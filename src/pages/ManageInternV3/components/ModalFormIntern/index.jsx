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
  createInternship,
  updateInternship,
  uploadFile,
  getMasterDataSelection,
  getUserSelection,
  getFacultySelection,
  getDepartmentSelection,
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
  const [facultyId, setFacultyId] = useState();
  const [departmentId, setDepartmentId] = useState();

  const handleCreateInternship = (values) => {
    createInternship(values).then((res) => {
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

  const handleUpdateInternship = (id, values) => {
    updateInternship(id, values).then((res) => {
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
        message.error(res.data?.error?.message);
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

  const [instructorSelection, setInstructorSelection] = useState([]);
  useEffect(() => {
    if (openForm) {
      getUserSelection({ departmentId, facultyId }).then((res) => {
        if (res.data?.success) {
          const newArr = [];
          res.data?.data?.items?.map((item) =>
            newArr.push({
              label: `${item?.id} - ${item?.firstName} ${item?.lastName}`,
              value: item?.id,
            }),
          );
          setInstructorSelection(newArr);
        }
      });
    }
  }, [openForm, facultyId, departmentId]);

  const [facultySelection, setFacultySelection] = useState([]);
  useEffect(() => {
    if (openForm) {
      getFacultySelection().then((res) => {
        if (res.data?.success) {
          const newArr = [];
          res.data?.data?.items?.map((item) => newArr.push({ label: item?.name, value: item?.id }));
          setFacultySelection(newArr);
        }
      });
    }
  }, [openForm]);

  const [departmentSelection, setDepartmentSelection] = useState([]);
  useEffect(() => {
    if (openForm) {
      getDepartmentSelection({ facultyId }).then((res) => {
        if (res.data?.success) {
          const newArr = [];
          res.data?.data?.items?.map((item) => newArr.push({ label: item?.name, value: item?.id }));
          setDepartmentSelection(newArr);
        }
      });
    }
  }, [openForm, facultyId]);

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
        width={750}
        title={internData.id ? 'Sửa thông tin đề tài thực tập' : 'Thêm đề tài thực tập'}
        initialValues={internData}
        modalProps={{
          maskClosable: false,
          destroyOnClose: true,
          okText:
            !handleUploadFinal.isPending &&
            !handleUploadOutline.isPending &&
            !handleUploadProgress.isPending ? (
              internData.id ? (
                'Lưu'
              ) : (
                'Tạo'
              )
            ) : (
              <Button style={{ border: 'none', color: 'white', marginTop: '-5px' }} disabled={true}>
                Đang up file, vui lòng chờ...
              </Button>
            ),
          cancelText: 'Hủy',
        }}
        open={openForm}
        onFinish={(values) => {
          if (internData.id) {
            handleUpdateInternship(internData.id, values);
          } else {
            handleCreateInternship(values);
          }
        }}
        onOpenChange={onChangeClickOpen}
      >
        <hr className="mb-3" />
        <div className="text-center mb-3">
          <p className="uppercase text-lg underline">Thông tin chung</p>
        </div>
        <ProForm.Group>
          <ProFormSelect
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            width="md"
            name={['subject', 'department', 'faculty', 'name']}
            label="Khoa"
            placeholder="Chọn khoa"
            options={facultySelection}
            onChange={(value) => setFacultyId(value)}
            disabled={internData?.isLock}
          />
          <ProFormSelect
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            width="md"
            name={['subject', 'department', 'name']}
            label="Bộ môn"
            placeholder="Chọn bộ môn"
            options={departmentSelection}
            onChange={(value) => setDepartmentId(value)}
            disabled={internData?.isLock}
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
            name={['schoolYear', 'id']}
            label="Năm học"
            placeholder="Chọn năm học"
            options={schoolYearSelection}
            disabled={internData?.isLock}
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
            disabled={internData?.isLock}
          />
          <ProFormSelect
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            width="300px"
            rules={[{ required: true, message: 'Không được để trống' }]}
            name={['instructor', 'id']}
            label="GV hướng dẫn"
            placeholder="Chọn GV hướng dẫn"
            options={instructorSelection}
            disabled={internData?.isLock}
          />
        </ProForm.Group>

        <hr className="mb-3" />
        <div className="text-center mb-3">
          <p className="uppercase text-lg underline">Thông tin sinh viên</p>
        </div>

        <ProForm.Group>
          <ProFormText
            rules={[{ required: true, message: 'Không được để trống' }]}
            width="md"
            name="studentId"
            label="Mã sinh viên"
            placeholder="Nhập mã sinh viên"
            disabled={internData?.isLock}
          />
          <ProFormText
            rules={[{ required: true, message: 'Không được để trống' }]}
            width="md"
            name="studentName"
            label="Tên sinh viên"
            placeholder="Nhập tên sinh viên"
            disabled={internData?.isLock}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            rules={[{ required: true, message: 'Không được để trống' }]}
            width="md"
            name="classId"
            label="Mã lớp"
            placeholder="Nhập mã lớp"
            disabled={internData?.isLock}
          />
          <ProFormText
            rules={[{ required: false }]}
            width="md"
            name="phone"
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            disabled={internData?.isLock}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            rules={[{ required: false }]}
            width="md"
            name="company"
            label="Cơ sở thực tập"
            placeholder="Nhập nơi thực tập"
            disabled={internData?.isLock}
          />
        </ProForm.Group>

        <hr className="mb-3" />
        <div className="text-center mb-3">
          <p className="uppercase text-lg underline">Thông tin đề tài thực tập</p>
        </div>
        <ProForm.Group>
          <ProFormText
            rules={[
              isCreate ? { required: true, message: 'Không được để trống' } : { required: false },
            ]}
            width="xl"
            name="name"
            label="Tên đề tài"
            placeholder="Nhập tên đề tài"
            disabled={internData?.isLock}
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
            disabled={internData?.isLock}
          />

          <ProFormTextArea
            width="lg"
            name="note"
            label="Ghi chú"
            placeholder="Nhập ghi chú"
            disabled={internData?.isLock}
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
            disabled={handleUploadOutline.isPending ? true : internData?.isLock}
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
            disabled={handleUploadProgress.isPending ? true : internData?.isLock}
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
            disabled={handleUploadFinal.isPending ? true : internData?.isLock}
          />
        </ProForm.Group>
      </ModalForm>
    </div>
  );
}
