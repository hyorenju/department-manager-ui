import { ModalForm, ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { notification, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { createFaculty, updateFaculty } from '../../../../api/axios';
import { notificationSuccess } from '../../../../components/Notification';

export function ModalFormFaculty({
  isCreate,
  openForm,
  onChangeClickOpen,
  facultyData,
  onSuccess,
}) {
  const handleCreateFaculty = (values) => {
    createFaculty(values).then((res) => {
      if (res.data?.success === true) {
        onSuccess();
        notificationSuccess('Tạo thành công');
      } else if (res.data?.error?.code === 2) {
        // eslint-disable-next-line no-lone-blocks
        {
          res.data?.error?.errorDetailList.forEach((e) => message.error(e.message));
        }
      } else if (res.data?.error?.code === 500) {
        message.error(res.data?.error?.message);
      }
    });
  };

  const handleUpdateFaculty = (id, values) => {
    updateFaculty(id, values).then((res) => {
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

  return (
    <div>
      <ModalForm
        width={800}
        title={facultyData.id ? 'Sửa thông tin khoa' : 'Thêm khoa'}
        initialValues={facultyData}
        modalProps={{
          maskClosable: false,
          destroyOnClose: true,
          okText: facultyData.id ? 'Lưu' : 'Tạo',
          cancelText: 'Hủy',
        }}
        open={openForm}
        onFinish={(values) => {
          if (facultyData.id) {
            handleUpdateFaculty(facultyData.id, values);
          } else {
            handleCreateFaculty(values);
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
            label="Mã khoa"
            placeholder="Nhập mã khoa"
            disabled={isCreate ? false : true}
          />
          <ProFormText
            rules={[{ required: true, message: 'Không được để trống' }]}
            width="md"
            name="name"
            label="Tên khoa"
            placeholder="Nhập tên khoa"
          />
        </ProForm.Group>
      </ModalForm>
    </div>
  );
}
