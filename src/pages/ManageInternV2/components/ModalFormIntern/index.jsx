import {
  ModalForm,
  ProForm,
  ProFormText,
  ProFormUploadButton,
  ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, message, notification, Popconfirm, Select, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  createIntern,
  updateIntern,
  uploadFile,
  getMasterDataSelection,
  getStudentList,
  deleteStudent,
} from '../../../../api/axios';
import { useMutation } from '@tanstack/react-query';
import { notificationSuccess, notificationError } from '../../../../components/Notification';
import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { ButtonCustom } from '../../../../components/ButtonCustom';
import { ModalFormStudent } from '../ModalFormStudent';

export function ModalFormIntern({ isCreate, openForm, onChangeClickOpen, internData, onSuccess }) {
  const [outline, setOutline] = useState('');
  const [progress, setProgress] = useState('');
  const [final, setFinal] = useState('');
  const [outlineList, setOutlineList] = useState([]);
  const [progressList, setProgressList] = useState([]);
  const [finalList, setFinalList] = useState([]);

  const handleCreateIntern = (values) => {
    createIntern(values).then((res) => {
      if (res.data?.success === true) {
        onSuccess();
        notification.success({
          message: 'Thành công',
          description: 'Tạo thành công',
          duration: 3,
        });
      } else if (res.data?.error?.code === 2) {
        // eslint-disable-next-line no-lone-blocks
        {
          res.data?.error?.errorDetailList?.forEach((e) => message.error(e.message));
        }
      } else if (res.data?.error?.code === 500) {
        notificationError(res.data?.error?.message);
      }
    });
  };

  const handleUpdateIntern = (id, values) => {
    updateIntern(id, values).then((res) => {
      if (res.data?.success === true) {
        onSuccess();
        notification.success({
          message: 'Thành công',
          description: 'Sửa thành công',
          duration: 3,
        });
      } else if (res.data?.error?.code === 2) {
        // eslint-disable-next-line no-lone-blocks
        {
          res.data?.error?.errorDetailList?.forEach((e) => message.error(e.message));
        }
      } else if (res.data?.error?.code === 500) {
        notificationError(res.data?.error?.message);
      }
    });
  };

  const [schoolYearSelection, setSchoolYearSelection] = useState([]);
  useEffect(() => {
    if (openForm) {
      getMasterDataSelection({ type: 'SCHOOL_YEAR' }).then((res) => {
        if (res.data?.success) {
          const newArr = [];
          res.data?.data?.items?.map((item) => newArr.push({ label: item?.name, value: item?.id }));
          setSchoolYearSelection(newArr);
        }
      });
    }
  }, [openForm]);

  const [internTypeSelection, setInternTypeSelection] = useState([]);
  useEffect(() => {
    if (openForm) {
      getMasterDataSelection({ type: 'INTERN_TYPE' }).then((res) => {
        if (res.data?.success) {
          const newArr = [];
          res.data?.data?.items?.map((item) => newArr.push({ label: item?.name, value: item?.id }));
          setInternTypeSelection(newArr);
        }
      });
    }
  }, [openForm]);

  useEffect(() => {
    setOutlineList([]);
    setProgressList([]);
    setFinalList([]);
  }, [openForm]);

  const handleUploadOutline = useMutation({
    mutationKey: ['uploadFile'],
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('file', file.file);
      setOutlineList(new Array(file.file));
      return await uploadFile(formData);
    },
    onSuccess: (res) => {
      if (res.data?.success === true) {
        setOutline(res.data?.data);
        console.log(res.data?.data);
        notificationSuccess('Upload thành công');
      }
    },
  });

  const handleUploadProgress = useMutation({
    mutationKey: ['uploadFile'],
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('file', file.file);
      setProgressList(new Array(file.file));
      return await uploadFile(formData);
    },
    onSuccess: (res) => {
      if (res.data?.success === true) {
        setProgress(res.data?.data);
        notificationSuccess('Upload thành công');
      }
    },
  });

  const handleUploadFinal = useMutation({
    mutationKey: ['uploadFile'],
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('file', file.file);
      setFinalList(new Array(file.file));
      return await uploadFile(formData);
    },
    onSuccess: (res) => {
      if (res.data?.success === true) {
        setFinal(res.data?.data);
        notificationSuccess('Upload thành công');
      }
    },
  });

  return (
    <div>
      <ModalForm
        width={700}
        title={internData.id ? 'Sửa thông tin đề tài thực tập' : 'Thêm đề tài thực tập'}
        initialValues={internData}
        modalProps={{
          maskClosable: false,
          destroyOnClose: true,
          okText:
            !handleUploadFinal.isPending &&
            !handleUploadOutline.isPending &&
            !handleUploadProgress.isPending
              ? internData.id
                ? 'Lưu'
                : 'Tạo'
              : 'Vui lòng chờ',
          cancelText: 'Hủy',
        }}
        open={openForm}
        onFinish={(values) => {
          if (internData.id) {
            handleUpdateIntern(internData.id, values);
          } else {
            handleCreateIntern(values);
          }
        }}
        onOpenChange={onChangeClickOpen}
      >
        <ProForm.Group>
          <ProFormText
            rules={[
              isCreate ? { required: true, message: 'Không được để trống' } : { required: false },
            ]}
            width="xl"
            name="name"
            label="Tên đề tài"
            placeholder="Nhập tên đề tài"
            disabled={isCreate ? false : true}
          />
        </ProForm.Group>

        <ProForm.Group>
          <ProFormSelect
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            width="sm"
            rules={[{ required: true, message: 'Không được để trống' }]}
            name={['type', 'id']}
            label="Loại đề tài"
            placeholder="Chọn loại đề tài"
            options={internTypeSelection}
            disabled={!internData?.isLock ? false : true}
          />
          <ProFormSelect
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            width="sm"
            rules={[{ required: true, message: 'Không được để trống' }]}
            name={['schoolYear', 'id']}
            label="Năm học"
            placeholder="Chọn năm học"
            options={schoolYearSelection}
            disabled={!internData?.isLock ? false : true}
          />
          <ProFormSelect
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            width="xs"
            rules={[{ required: true, message: 'Không được để trống' }]}
            name="term"
            label="Học kỳ"
            placeholder="Chọn HK"
            options={[
              { label: 1, value: 1 },
              { label: 2, value: 2 },
              { label: 3, value: 3 },
            ]}
            disabled={!internData?.isLock ? false : true}
          />
        </ProForm.Group>

        <ProForm.Group>
          <ProFormTextArea
            width="xl"
            name="note"
            label="Ghi chú"
            placeholder="Nhập ghi chú"
            disabled={!internData?.isLock ? false : true}
          />
        </ProForm.Group>

        <ProForm.Group>
          <ProFormUploadButton
            title="Bấm để tải"
            name="outline"
            label="Tải file đề cương"
            max={1}
            fieldProps={{
              name: 'file',
              customRequest: (file) => handleUploadOutline.mutate(file),
              onRemove: () => {
                setOutline('');
                setOutlineList([]);
              },
            }}
            transform={() => {
              return { outlineFile: outline };
            }}
            fileList={outlineList}
            icon={handleUploadOutline.isPending ? <LoadingOutlined /> : <UploadOutlined />}
            disabled={handleUploadOutline.isPending ? true : internData?.isLock ? true : false}
          />
          <ProFormUploadButton
            title="Bấm để tải"
            name="progress"
            label="Tải file tiến độ"
            max={1}
            fieldProps={{
              name: 'file',
              customRequest: (file) => handleUploadProgress.mutate(file),
              onRemove: () => {
                setProgress('');
                setProgressList([]);
              },
            }}
            transform={() => {
              return { progressFile: progress };
            }}
            fileList={progressList}
            icon={handleUploadProgress.isPending ? <LoadingOutlined /> : <UploadOutlined />}
            disabled={handleUploadOutline.isPending ? true : internData?.isLock ? true : false}
          />
          <ProFormUploadButton
            title="Bấm để tải"
            name="final"
            label="Tải file tổng kết"
            max={1}
            fieldProps={{
              name: 'file',
              customRequest: (file) => handleUploadFinal.mutate(file),
              onRemove: () => {
                setFinal('');
                setFinalList([]);
              },
            }}
            transform={() => {
              return { finalFile: final };
            }}
            fileList={finalList}
            icon={handleUploadFinal.isPending ? <LoadingOutlined /> : <UploadOutlined />}
            disabled={handleUploadOutline.isPending ? true : internData?.isLock ? true : false}
          />
        </ProForm.Group>
      </ModalForm>
    </div>
  );
}
