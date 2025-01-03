import { ModalForm, ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { message, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { changePassword } from '../../../../api/axios';
import { notificationError } from '../../../../components/Notification';

export function ModalFormPassword({ openForm, onChangeClickOpen, userData, onSuccess }) {
  const handleChangePassword = (id, values) => {
    changePassword(values).then((res) => {
      if (res.data?.success === true) {
        localStorage.setItem('user_info', JSON.stringify(res.data.data));
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

  return (
    <div>
      <ModalForm
        width={400}
        title={'Đổi mật khẩu'}
        initialValues={userData}
        modalProps={{
          maskClosable: false,
          destroyOnClose: true,
          okText: 'Lưu',
          cancelText: 'Hủy',
        }}
        open={openForm}
        onFinish={(values) => {
          handleChangePassword(userData.id, values);
        }}
        onOpenChange={onChangeClickOpen}
      >
        <ProFormText.Password
          rules={[{ required: true, message: 'Không được để trống' }]}
          width="md"
          name="currentPassword"
          label="Mật khẩu cũ"
          placeholder="Nhập mật khẩu cũ"
        />
        <ProFormText.Password
          rules={[{ required: true, message: 'Không được để trống' }]}
          width="md"
          name="newPassword"
          label="Mật khẩu mới"
          placeholder="Nhập mật khẩu mới"
        />
        <ProFormText.Password
          rules={[{ required: true, message: 'Không được để trống' }]}
          width="md"
          name="confirmPassword"
          label="Xác nhận mật khẩu"
          placeholder="Nhập lại mật khẩu mới"
        />
      </ModalForm>
    </div>
  );
}
