import { ModalForm, ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { notification, message, Input, Button, Popconfirm } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  createUser,
  updateUser,
  transferRole,
  getMasterDataSelection,
  getFacultySelection,
  getDepartmentSelection,
  getRoleSelection,
} from '../../../../api/axios';
import { notificationError, notificationSuccess } from '../../../../components/Notification';
import { ButtonCustom } from '../../../../components/ButtonCustom';
import { DeleteOutlined, SyncOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export function ModalFormUser({ isCreate, openForm, onChangeClickOpen, userData, onSuccess }) {
  const navigate = useNavigate();

  const handleCreateUser = (values) => {
    createUser(values).then((res) => {
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
          res.data?.error?.errorDetailList.forEach((e) => message.error(e.message));
        }
      } else if (res.data?.error?.code === 500) {
        notificationError(res.data?.error?.message);
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

  const handleTransferRole = (id) => {
    transferRole(id).then((res) => {
      if (res.data?.success === true) {
        notification.success({
          message: 'Thành công',
          description: 'Chuyển vai trò thành công',
          duration: 3,
        });
        handleLogout();
      } else notificationError(res.data?.error?.message);
    });
  };

  const handleLogout = () => {
    Cookies.remove('access_token');
    sessionStorage.removeItem('user_info');
    sessionStorage.removeItem('user_role');
    navigate('/');
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
      getDepartmentSelection({}).then((res) => {
        if (res.data?.success) {
          const newArr = [];
          res.data?.data?.items?.map((item) => newArr.push({ label: item?.name, value: item?.id }));
          setDepartmentSelection(newArr);
        }
      });
    }
  }, [openForm]);
  const handleGetDepartmentSelection = (value) => {
    if (value) {
      getDepartmentSelection({ facultyId: value }).then((res) => {
        if (res.data?.success) {
          const newArr = [];
          res.data?.data?.items?.map((item) => newArr.push({ label: item?.name, value: item?.id }));
          setDepartmentSelection(newArr);
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
            rules={[
              isCreate ? { required: true, message: 'Không được để trống' } : { required: false },
            ]}
            width="md"
            name="id"
            label="Mã người dùng"
            placeholder="Nhập mã người dùng"
            disabled={isCreate ? false : true}
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
            rules={[
              isCreate ? { required: true, message: 'Không được để trống' } : { required: false },
            ]}
            name={['department', 'faculty', 'id']}
            label="Khoa"
            placeholder="Chọn khoa"
            onChange={handleGetDepartmentSelection}
            options={facultySelection}
            disabled={isCreate ? false : true}
          />
          <ProFormSelect
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            width="md"
            rules={[
              isCreate ? { required: true, message: 'Không được để trống' } : { required: false },
            ]}
            name={['department', 'id']}
            label="Bộ môn"
            placeholder="Chọn bộ môn"
            options={departmentSelection}
            disabled={isCreate ? false : true}
          />
          <ProFormSelect
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            width="md"
            rules={[{ required: true, message: 'Không được để trống' }]}
            name={['role', 'id']}
            label="Vai trò"
            placeholder="Chọn vai trò"
            options={roleSelection}
          />
        </ProForm.Group>
        <ProForm.Group>
          {/* <ProFormText
            rules={[{ required: false, message: 'Không được để trống' }]}
            width="md"
            name="password"
            label="Mật khẩu"
            placeholder={
              isCreate ? "Nếu để trống sẽ mặc định là '123'" : 'Nếu để trống mật khẩu sẽ giữ nguyên'
            }
          /> */}
          <ProFormText.Password
            width="md"
            name="password"
            label="Mật khẩu"
            placeholder={
              isCreate ? "Nếu để trống sẽ mặc định là '123'" : 'Nếu để trống mật khẩu sẽ giữ nguyên'
            }
          />
          <ProFormText
            rules={[{ required: false, message: 'Không được để trống' }]}
            width="xl"
            name="note"
            label="Ghi chú"
            placeholder="Nhập ghi chú"
          />
        </ProForm.Group>
        {!isCreate && (
          <Popconfirm
            placement="topRight"
            title={
              <>
                <p>Bạn có chắc chắn muốn chuyển vai trò của mình cho người dùng này?</p>
                <p>Tài khoản của bạn sẽ bị giáng xuống vai trò thấp nhất.</p>
              </>
            }
            okText="Chắc chắn"
            okType="danger"
            onConfirm={() => {
              handleTransferRole(userData?.id);
            }}
          >
            <Button className="absolute right-40 bottom-5" icon={<SyncOutlined />} danger>
              Chuyển vai trò
            </Button>
          </Popconfirm>
        )}
      </ModalForm>
    </div>
  );
}
