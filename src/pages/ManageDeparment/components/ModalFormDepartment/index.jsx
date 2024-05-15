import { ModalForm, ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { notification, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { createDepartment, updateDepartment, getFacultySelection } from '../../../../api/axios';
import { notificationSuccess } from '../../../../components/Notification';

export function ModalFormDepartment({
  isCreate,
  openForm,
  onChangeClickOpen,
  departmentData,
  onSuccess,
}) {
  const handleCreateDepartment = (values) => {
    createDepartment(values).then((res) => {
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

  const handleUpdateDepartment = (id, values) => {
    updateDepartment(id, values).then((res) => {
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

  return (
    <div>
      <ModalForm
        width={800}
        title={departmentData.id ? 'Sửa thông tin bộ môn' : 'Thêm bộ môn'}
        initialValues={departmentData}
        modalProps={{
          maskClosable: false,
          destroyOnClose: true,
          okText: departmentData.id ? 'Lưu' : 'Tạo',
          cancelText: 'Hủy',
        }}
        open={openForm}
        onFinish={(values) => {
          if (departmentData.id) {
            handleUpdateDepartment(departmentData.id, values);
          } else {
            handleCreateDepartment(values);
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
            label="Mã bộ môn"
            placeholder="Nhập mã bộ môn"
            disabled={isCreate ? false : true}
          />
          <ProFormText
            rules={[{ required: true, message: 'Không được để trống' }]}
            width="md"
            name="name"
            label="Tên bộ môn"
            placeholder="Nhập tên bộ môn"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect
            width="md"
            rules={[{ required: true, message: 'Không được để trống' }]}
            name={['faculty', 'id']}
            label="Chọn khoa"
            placeholder="Chọn khoa"
            options={facultySelection}
          />
        </ProForm.Group>
      </ModalForm>
    </div>
  );
}
