import {
  ModalForm,
  ProForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { notification, message, Form, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { createProject, updateProject, getFacultySelection } from '../../../../api/axios';
import { notificationSuccess } from '../../../../components/Notification';
import TextArea from 'antd/es/input/TextArea';

export function ModalFormProject({
  isCreate,
  openForm,
  onChangeClickOpen,
  projectData,
  onSuccess,
  userRole,
}) {
  const handleCreateProject = (values) => {
    createProject(values).then((res) => {
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

  const handleUpdateProject = (id, values) => {
    updateProject(id, values).then((res) => {
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
        width={600}
        title={projectData.id ? 'Sửa thông tin công việc' : 'Thêm công việc'}
        initialValues={projectData}
        modalProps={{
          maskClosable: false,
          destroyOnClose: true,
          okText: projectData.id ? 'Lưu' : 'Tạo',
          cancelText: 'Hủy',
        }}
        open={openForm}
        onFinish={(values) => {
          if (projectData.id) {
            handleUpdateProject(projectData.id, values);
          } else {
            handleCreateProject(values);
          }
        }}
        onOpenChange={onChangeClickOpen}
      >
        <ProForm.Group>
          <ProFormText
            rules={[{ required: true, message: 'Không được để trống' }]}
            width="515px"
            name="name"
            label="Tên công việc"
            placeholder="Nhập tên công việc"
          />
          {isCreate && (
            <>
              <ProFormDatePicker
                rules={[{ required: true, message: 'Không được để trống' }]}
                width="xm"
                placeholder="Ngày bắt đầu"
                name="start"
                label="Ngày bắt đầu"
                fieldProps={{
                  format: 'DD/MM/YYYY',
                }}
              />
              <ProFormDatePicker
                rules={[{ required: true, message: 'Không được để trống' }]}
                width="xm"
                placeholder="Ngày kến thúc"
                name="deadline"
                label="Ngày kết thúc"
                fieldProps={{
                  format: 'DD/MM/YYYY',
                }}
              />
              <ProFormSelect
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                width="xm"
                rules={[
                  isCreate
                    ? { required: true, message: 'Không được để trống' }
                    : { required: false },
                ]}
                name="isPrivate"
                label="Loại công việc"
                placeholder="Chọn loại"
                options={[
                  userRole !== 'LECTURER' && { label: 'Việc chung', value: false },
                  { label: 'Việc cá nhân', value: true },
                ]}
                disabled={isCreate ? false : true}
              />
            </>
          )}
          {!isCreate && (
            <>
              <ProFormText
                rules={[{ required: true, message: 'Không được để trống' }]}
                width="sm"
                placeholder="Nhập ngày bắt đầu"
                name="start"
                label="Ngày bắt đầu"
              />
              <ProFormText
                rules={[{ required: true, message: 'Không được để trống' }]}
                width="sm"
                placeholder="Nhập ngày kết thúc"
                name="deadline"
                label="Ngày kết thúc"
                fieldProps={{
                  format: 'DD/MM/YYYY',
                }}
              />
            </>
          )}
        </ProForm.Group>
        <ProForm.Group>
          <ProFormTextArea
            width="515px"
            name="description"
            label="Mô tả"
            placeholder="Nhập mô tả (không bắt buộc)"
          />
        </ProForm.Group>
      </ModalForm>
    </div>
  );
}
