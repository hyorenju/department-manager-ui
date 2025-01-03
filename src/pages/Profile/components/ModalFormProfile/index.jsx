import { ModalForm, ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { message, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { getMasterDataSelection, updateProfile } from '../../../../api/axios';
import { notificationError } from '../../../../components/Notification';

export function ModalFormProfile({ openForm, onChangeClickOpen, userData, onSuccess }) {
  const handleUpdateProfile = (id, values) => {
    updateProfile(values).then((res) => {
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

  const [degreeSelection, setDegreeSelection] = useState([]);
  useEffect(() => {
    if (openForm) {
      getMasterDataSelection({ type: 'USER_DEGREE' }).then((res) => {
        if (res.data?.success) {
          const newArr = [];
          res.data?.data?.items?.map((item) => newArr.push({ label: item?.name, value: item?.id }));
          setDegreeSelection(newArr);
        }
      });
    }
  }, [openForm]);

  return (
    <div>
      <ModalForm
        width={750}
        title={'Sửa thông tin cá nhân'}
        initialValues={userData}
        modalProps={{
          maskClosable: false,
          destroyOnClose: true,
          okText: 'Lưu',
          cancelText: 'Hủy',
        }}
        open={openForm}
        onFinish={(values) => {
          handleUpdateProfile(userData.id, values);
        }}
        onOpenChange={onChangeClickOpen}
      >
        <ProForm.Group>
          <ProFormText
            rules={[{ required: true, message: 'Không được để trống' }]}
            width="md"
            name="firstName"
            label="Họ đệm"
            placeholder="Nhập họ đệm"
          />
          <ProFormText
            rules={[{ required: true, message: 'Không được để trống' }]}
            width="md"
            name="lastName"
            label="Tên"
            placeholder="Nhập tên"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            rules={[{ required: true, message: 'Không được để trống' }]}
            width="md"
            name="email"
            label="Email"
            placeholder="example@gmail.com"
          />
          <ProFormText
            rules={[{ required: true, message: 'Không được để trống' }]}
            width="md"
            name="phoneNumber"
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            width="md"
            rules={[{ required: true, message: 'Không được để trống' }]}
            name={['degree', 'id']}
            label="Trình độ"
            placeholder="Chọn trình độ"
            options={degreeSelection}
          />
        </ProForm.Group>
      </ModalForm>
    </div>
  );
}
