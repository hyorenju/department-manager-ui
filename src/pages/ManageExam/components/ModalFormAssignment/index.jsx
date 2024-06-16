import { ModalForm, ProForm, ProFormSelect } from '@ant-design/pro-components';
import { message, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { getAssignSelection, updateProctor } from '../../../../api/axios';
import { notificationError } from '../../../../components/Notification';

export function ModalFormAssignment({ openForm, onChangeClickOpen, examData, onSuccess }) {
  const handleUpdateProctor = (id, values) => {
    updateProctor(id, values).then((res) => {
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

  const [proctorSelection, setProctorSelection] = useState([]);
  useEffect(() => {
    if (openForm) {
      getAssignSelection(examData?.id).then((res) => {
        if (res.data?.success) {
          const newArr = [];
          res.data?.data?.items?.map((item) =>
            newArr.push({
              label: `${item?.id} - ${item?.firstName} ${item?.lastName}`,
              value: item?.id,
            }),
          );
          setProctorSelection(newArr);
        }
      });
    }
  }, [openForm]);

  return (
    <div>
      <ModalForm
        width={750}
        title={'Phân công coi thi'}
        initialValues={examData}
        modalProps={{
          maskClosable: false,
          destroyOnClose: true,
          okText: 'Lưu',
          cancelText: 'Hủy',
        }}
        open={openForm}
        onFinish={(values) => {
          handleUpdateProctor(examData.id, values);
        }}
        onOpenChange={onChangeClickOpen}
      >
        <ProForm.Group>
          <ProFormSelect
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            width="md"
            rules={[{ required: true, message: 'Không được để trống' }]}
            name={['proctor1', 'id']}
            label="Cán bộ coi thi 1"
            placeholder="Chọn cán bộ coi thi 1"
            options={proctorSelection}
          />
          <ProFormSelect
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            width="md"
            rules={[{ required: true, message: 'Không được để trống' }]}
            name={['proctor2', 'id']}
            label="Cán bộ coi thi 2"
            placeholder="Chọn cán bộ coi thi 2"
            options={proctorSelection}
          />
        </ProForm.Group>
      </ModalForm>
    </div>
  );
}
