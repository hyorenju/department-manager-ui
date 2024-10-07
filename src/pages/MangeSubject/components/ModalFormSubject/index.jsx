import {
  ModalForm,
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { message, notification, Select, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { createSubject, updateSubject, uploadFile } from '../../../../api/axios';
import { useMutation } from '@tanstack/react-query';
import { notificationSuccess, notificationError } from '../../../../components/Notification';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';

export function ModalFormSubject({
  isCreate,
  openForm,
  onChangeClickOpen,
  subjectData,
  onSuccess,
}) {
  const [outline, setOutline] = useState('');
  const [lecture, setLecture] = useState('');
  const [outlineList, setOutlineList] = useState([]);
  const [lectureList, setLectureList] = useState([]);

  const handleCreateSubject = (values) => {
    createSubject(values).then((res) => {
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
        message.error(res.data?.error?.message);
      }
    });
  };

  const handleUpdateSubject = (id, values) => {
    updateSubject(id, values).then((res) => {
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
        notificationSuccess('Upload thành công');
      }
    },
  });

  const handleUploadLecture = useMutation({
    mutationKey: ['uploadFile'],
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('file', file.file);
      setLectureList(new Array(file.file));
      return await uploadFile(formData);
    },
    onSuccess: (res) => {
      if (res.data?.success === true) {
        setLecture(res.data?.data);
        notificationSuccess('Upload thành công');
      }
    },
  });

  useEffect(() => {
    setOutlineList([]);
    setLectureList([]);
  }, [openForm]);

  return (
    <div>
      <ModalForm
        width={800}
        title={subjectData.id ? 'Sửa thông tin môn học' : 'Thêm môn học'}
        initialValues={subjectData}
        modalProps={{
          maskClosable: false,
          destroyOnClose: true,
          okText:
            !handleUploadLecture.isPending && !handleUploadOutline.isPending
              ? subjectData.id
                ? 'Lưu'
                : 'Tạo'
              : 'Vui lòng chờ',
          cancelText: 'Hủy',
        }}
        open={openForm}
        onFinish={(values) => {
          if (subjectData.id) {
            handleUpdateSubject(subjectData.id, values);
          } else {
            handleCreateSubject(values);
          }
        }}
        onOpenChange={onChangeClickOpen}
      >
        <ProForm.Group>
          <ProFormText
            rules={[
              isCreate ? { required: true, message: 'Không được để trống' } : { required: false },
            ]}
            width="md"
            name="id"
            label="Mã môn học"
            placeholder="Nhập mã môn học"
            disabled={isCreate ? false : true}
          />
          <ProFormText
            rules={[{ required: true, message: 'Không được để trống' }]}
            width="md"
            name="name"
            label="Tên môn học"
            placeholder="Nhập tên môn học"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            rules={[{ required: true, message: 'Không được để trống' }]}
            width="md"
            name="credits"
            label="Số tín chỉ"
            placeholder="Nhập số tín chỉ"
          />
          <ProFormTextArea
            rules={[{ required: false }]}
            width="md"
            name="note"
            label="Ghi chú"
            placeholder="Nhập ghi chú"
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
              return { outline: outline };
            }}
            fileList={outlineList}
            icon={handleUploadOutline.isPending ? <LoadingOutlined /> : <UploadOutlined />}
            disabled={handleUploadOutline.isPending ? true : false}
          />
          <ProFormUploadButton
            title="Bấm để tải"
            name="lecture"
            label="Tải file giáo trình"
            max={1}
            fieldProps={{
              name: 'file',
              customRequest: (file) => handleUploadLecture.mutate(file),
              onRemove: () => {
                setLecture('');
                setLectureList([]);
              },
            }}
            transform={() => {
              return { lecture: lecture };
            }}
            fileList={lectureList}
            icon={handleUploadLecture.isPending ? <LoadingOutlined /> : <UploadOutlined />}
            disabled={handleUploadLecture.isPending ? true : false}
          />
        </ProForm.Group>
      </ModalForm>
    </div>
  );
}
