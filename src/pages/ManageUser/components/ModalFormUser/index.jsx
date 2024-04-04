import { ModalForm, ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { notification, message } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  createUser,
  updateUser,
  getDegreeSelection,
  getFacultySelection,
  getDepartmentSelection,
  getRoleSelection,
} from '../../../../api/axios';

export function ModalFormUser({ isCreate, openForm, onChangeClickOpen, userData, onSuccess }) {
  const handleCreateUser = (values) => {
    createUser(values).then((res) => {
      if (res.data?.success === true) {
        onSuccess();
        notification.success({
          message: 'Thành công',
          description: 'Tạo thành công',
          duration: 2,
        });
      } else if (res.data?.error?.code === 2) {
        // eslint-disable-next-line no-lone-blocks
        {
          res.data?.error?.errorDetailList.forEach((e) => message.error(e.message));
        }
      } else if (res.data?.error?.code === 500) {
        notification.error({
          message: 'Tạo thất bại',
          description: res.data?.error?.message,
          duration: 2,
        });
      }
    });
  };

  const handleUpdateUser = (id, values) => {
    updateUser(id, values).then((res) => {
      if (res.data?.success === true) {
        onSuccess();
        notification.success({
          message: 'Thành công',
          description: 'Sửa thành công',
          duration: 2,
        });
      } else if (res.data?.error?.code === 2) {
        // eslint-disable-next-line no-lone-blocks
        {
          res.data?.error?.errorDetailList?.forEach((e) => message.error(e.message));
        }
      } else if (res.data?.error?.code === 500) {
        notification.error({
          message: 'Cập nhật thất bại',
          description: res.data?.error?.message,
          duration: 2,
        });
      }
    });
  };

  const type = 'USER_DEGREE';
  const [degreeSelection, setDegreeSelection] = useState([]);
  useEffect(() => {
    if (openForm) {
      getDegreeSelection({ type: type }).then((res) => {
        if (res.data?.success) {
          const newArr = [];
          res.data?.data?.items?.map((item) => newArr.push({ label: item?.name, value: item?.id }));
          setDegreeSelection(newArr);
        }
      });
    }
  }, [openForm]);

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
  const handleGetDepartmentSelection = (value) => {
    // value will contain the selected faculty ID
    const facultyId = value;

    // If a faculty is selected, fetch departments for that faculty
    if (facultyId) {
      getDepartmentSelection({ facultyId }).then((res) => {
        if (res.data?.success) {
          const newDepartmentSelection = [];
          res.data?.data?.items?.map((item) =>
            newDepartmentSelection.push({ label: item?.name, value: item?.id }),
          );
          // Update state with the new department options
          setDepartmentSelection(newDepartmentSelection);
        }
      });
    }
  };

  const [roleSelection, setRoleSelection] = useState([]);
  useEffect(() => {
    if (openForm) {
      getRoleSelection().then((res) => {
        if (res.data?.success) {
          const newArr = [];
          res.data?.data?.items?.map((item) => newArr.push({ label: item?.name, value: item?.id }));
          setRoleSelection(newArr);
        }
      });
    }
  }, [openForm]);

  return (
    <div>
      <ModalForm
        width={1100}
        title={userData.id ? 'Sửa thông tin người dùng' : 'Thêm người dùng'}
        initialValues={userData}
        modalProps={{
          maskClosable: false,
          destroyOnClose: true,
          okText: userData.id ? 'Lưu' : 'Tạo',
          cancelText: 'Hủy',
        }}
        open={openForm}
        onFinish={(values) => {
          if (userData.id) {
            handleUpdateUser(userData.id, values);
          } else {
            handleCreateUser(values);
          }
        }}
        onOpenChange={onChangeClickOpen}
      >
        <ProForm.Group>
          <ProFormText
            rules={[{ required: true, message: 'Không được để trống' }]}
            width="md"
            name="id"
            label="Mã người dùng"
            placeholder="Nhập mã người dùng"
          />
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
          <ProFormSelect
            width="md"
            rules={[{ required: true, message: 'Không được để trống' }]}
            name={['degree', 'id']}
            label="Trình độ"
            placeholder="Chọn trình độ"
            options={degreeSelection}
          />
          <ProFormText
            rules={[{ required: true, message: 'Không được để trống' }]}
            width="md"
            name="email"
            label="Email"
            placeholder="Nhập email"
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
            width="md"
            rules={[{ required: true, message: 'Không được để trống' }]}
            name={['department', 'faculty', 'id']}
            label="Chọn khoa"
            placeholder="Chọn khoa"
            onChange={handleGetDepartmentSelection}
            options={facultySelection}
          />
          <ProFormSelect
            width="md"
            rules={[{ required: true, message: 'Không được để trống' }]}
            name={['department', 'id']}
            label="Chọn bộ môn"
            placeholder="Chọn bộ môn"
            options={departmentSelection}
          />
          <ProFormText
            rules={[{ required: false, message: 'Không được để trống' }]}
            width="md"
            name="password"
            label="Mật khẩu"
            placeholder={
              isCreate ? "Nếu để trống sẽ mặc định là '123'" : 'Nếu để trống mật khẩu sẽ giữ nguyên'
            }
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect
            width="md"
            rules={[{ required: true, message: 'Không được để trống' }]}
            name={['role', 'id']}
            label="Chọn vai trò"
            placeholder="Chọn vai trò"
            options={roleSelection}
          />
          <ProFormText
            rules={[{ required: false, message: 'Không được để trống' }]}
            width="xl"
            name="note"
            label="Ghi chú"
            placeholder="Nhập ghi chú"
          />
        </ProForm.Group>
      </ModalForm>
    </div>
  );
}
