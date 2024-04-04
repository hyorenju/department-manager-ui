import { ModalForm, ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { notification, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { createClass, updateClass, getFacultySelection } from '../../../../api/axios';

export function ModalFormClass({ isCreate, openForm, onChangeClickOpen, classData, onSuccess }) {
  const handleCreateClass = (values) => {
    createClass(values).then((res) => {
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
        message.error(res.data?.error?.message);
      }
    });
  };

  const handleUpdateClass = (id, values) => {
    updateClass(id, values).then((res) => {
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
        width={1100}
        title={classData.id ? 'Sửa thông tin lớp' : 'Thêm lớp'}
        initialValues={classData}
        modalProps={{
          maskClosable: false,
          destroyOnClose: true,
          okText: classData.id ? 'Lưu' : 'Tạo',
          cancelText: 'Hủy',
        }}
        open={openForm}
        onFinish={(values) => {
          if (classData.id) {
            handleUpdateClass(classData.id, values);
          } else {
            handleCreateClass(values);
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
            label="Mã lớp"
            placeholder="Nhập mã lớp"
            disabled={isCreate ? false : true}
          />
          <ProFormText
            rules={[{ required: true, message: 'Không được để trống' }]}
            width="md"
            name="name"
            label="Tên lớp"
            placeholder="Nhập tên lớp"
          />
          <ProFormSelect
            width="md"
            rules={[{ required: true, message: 'Không được để trống' }]}
            name={['faculty', 'id']}
            label="Chọn khoa"
            placeholder="Chọn khoa"
            options={facultySelection}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            rules={[
              isCreate ? { required: false } : { required: true, message: 'Không được để trống' },
            ]}
            width="md"
            name="monitor"
            label="Lớp trưởng"
            placeholder="Nhập thông tin lớp trưởng"
          />
          <ProFormText
            rules={[
              isCreate ? { required: false } : { required: true, message: 'Không được để trống' },
            ]}
            width="md"
            name="monitorPhone"
            label="Sđt lớp trưởng"
            placeholder="Nhập sđt lớp trưởng"
          />
          <ProFormText
            rules={[{ required: false }]}
            width="md"
            name="monitorEmail"
            label="Email lớp trưởng"
            placeholder="Nhập email lớp trưởng"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            width="md"
            rules={[
              isCreate ? { required: false } : { required: true, message: 'Không được để trống' },
            ]}
            name="hrTeacher"
            label="Giáo viên chủ nhiệm"
            placeholder="Nhập thông tin GVCN"
          />
          <ProFormText
            rules={[{ required: false }]}
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
