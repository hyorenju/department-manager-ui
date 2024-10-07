import {
  ModalForm,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { notification, message, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { createStudent, updateStudent } from '../../../../api/axios';
import { notificationError, notificationSuccess } from '../../../../components/Notification';
import { ButtonCustom } from '../../../../components/ButtonCustom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { messageErrorToSever } from '../../../../components/Message';

export function ModalFormStudent({
  isCreate,
  openForm,
  onChangeClickOpen,
  intern,
  studentData,
  onSuccess,
}) {
  const queryClient = useQueryClient();

  // const handleCreateStudent = (values) => {
  //   createStudent(values).then((res) => {
  //     if (res.data?.success === true) {
  //       onSuccess();
  //       notificationSuccess('Tạo thành công');
  //     } else if (res.data?.error?.code === 2) {
  //       // eslint-disable-next-line no-lone-blocks
  //       {
  //         res.data?.error?.errorDetailList.forEach((e) => message.error(e.message));
  //       }
  //     } else if (res.data?.error?.code === 500) {
  //       notificationError(res.data?.error?.message);
  //     }
  //   });
  // };

  const handleCreateStudent = useMutation({
    mutationKey: ['createStudent'],
    mutationFn: async (values) => createStudent(values),
    onSuccess: (res) => {
      if (res && res.data?.success === true) {
        onSuccess();
        queryClient.invalidateQueries({
          queryKey: ['studentList'],
        });
        notificationSuccess('Tạo thành công');
        onChangeClickOpen(false);
      } else notificationError(res.data?.error?.message);
    },
  });

  // const handleUpdateStudent = (id, values) => {
  //   updateStudent(id, values).then((res) => {
  //     if (res.data?.success === true) {
  //       onSuccess();
  //       notificationSuccess('Sửa thành công');
  //     } else if (res.data?.error?.code === 2) {
  //       // eslint-disable-next-line no-lone-blocks
  //       {
  //         res.data?.error?.errorDetailList?.forEach((e) => message.error(e.message));
  //       }
  //     } else if (res.data?.error?.code === 500) {
  //       notificationError(res.data?.error?.message);
  //     }
  //   });
  // };

  const handleUpdateStudent = useMutation({
    mutationKey: ['updateStudent'],
    mutationFn: async (values) => updateStudent(studentData?.id, values),
    onSuccess: (res) => {
      if (res && res.data?.success === true) {
        onSuccess();
        queryClient.invalidateQueries({
          queryKey: ['studentList'],
        });
        notificationSuccess('Cập nhật thành công');
        onChangeClickOpen(false);
      } else notificationError(res.data?.error?.message);
    },
  });

  return (
    <div>
      <ModalForm
        width={1100}
        title={studentData?.id ? 'Sửa thông tin sinh viên' : 'Thêm sinh viên'}
        initialValues={{
          id: studentData?.id ? studentData?.id : null,
          studentId: studentData?.id ? studentData.studentId : null,
          name: studentData?.id ? studentData.name : null,
          classId: studentData?.id ? studentData.classId : null,
          phoneNumber: studentData?.id ? studentData.phoneNumber : null,
          company: studentData?.id ? studentData.company : null,
          intern: intern,
          note: studentData?.id ? studentData.note : null,
        }}
        modalProps={{
          maskClosable: false,
          destroyOnClose: true,
        }}
        submitter={{
          render: (props) => [
            <Space>
              <ButtonCustom
                type="primary"
                handleClick={() => props.submit()}
                title={studentData?.id ? 'Cập nhật' : 'Tạo mới'}
                loading={
                  studentData?.id ? handleUpdateStudent.isLoading : handleCreateStudent.isLoading
                }
              />
              <ButtonCustom title="Hủy" handleClick={() => onChangeClickOpen(false)} />
            </Space>,
          ],
        }}
        open={openForm}
        onFinish={(values) => {
          if (studentData?.id) {
            handleUpdateStudent.mutate(values);
          } else {
            handleCreateStudent.mutate(values);
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
            name="studentId"
            label="Mã sinh viên"
            placeholder="Nhập mã sinh viên"
            disabled={!isCreate ? true : intern?.isLock ? true : false}
          />
          <ProFormText
            rules={[{ required: true, message: 'Không được để trống' }]}
            width="md"
            name="name"
            label="Họ tên"
            placeholder="Nhập họ tên"
            disabled={intern?.isLock ? true : false}
          />
          <ProFormText
            width="md"
            name="classId"
            label="Mã lớp"
            placeholder="Nhập mã lớp"
            disabled={intern?.isLock ? true : false}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            rules={[{ required: true, message: 'Không được để trống' }]}
            width="md"
            name="phoneNumber"
            label="Số điện thoại"
            placeholder="Số điện thoại"
            disabled={intern?.isLock ? true : false}
          />
          <ProFormText
            rules={[{ required: true, message: 'Không được để trống' }]}
            width="md"
            name="company"
            label="Địa điểm thực tập"
            placeholder="Nhập nơi thực tập"
            disabled={intern?.isLock ? true : false}
          />
          <ProFormTextArea
            width="md"
            name="note"
            label="Ghi chú"
            placeholder="Nhập ghi chú"
            disabled={intern?.isLock ? true : false}
          />
          <ProFormText name="intern" hidden />
        </ProForm.Group>
      </ModalForm>
    </div>
  );
}
