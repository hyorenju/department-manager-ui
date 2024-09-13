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
import { getMasterDataSelection, updateTaskStatus } from '../../../../../api/axios';
import TextArea from 'antd/es/input/TextArea';
import { notificationError } from '../../../../../components/Notification';

export function ModalFormTaskDetail({ openForm, onChangeClickOpen, userTaskData, onSuccess }) {
  const [taskStatusList, setTaskStatusList] = useState([]);

  const handleUpdateTaskStatus = (id, values) => {
    updateTaskStatus(id, values).then((res) => {
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

  const handleGetTaskStatusList = () => {
    getMasterDataSelection({ type: 'TASK_STATUS' }).then((res) => {
      if (res.data?.success === true) {
        if (res.data?.success) {
          const newArr = [];
          res.data?.data?.items?.map((item) => newArr.push({ label: item?.name, value: item?.id }));
          setTaskStatusList(newArr);
        }
      } else if (res && res.success === false) {
        notificationError(res?.error.message);
      }
    });
  };

  useEffect(() => {
    handleGetTaskStatusList();
  }, []);

  return (
    <div>
      <ModalForm
        width={550}
        title="Sửa chi tiết công việc"
        initialValues={userTaskData}
        modalProps={{
          maskClosable: false,
          destroyOnClose: true,
          okText: 'Lưu',
          cancelText: 'Hủy',
        }}
        open={openForm}
        onFinish={(values) => {
          handleUpdateTaskStatus(userTaskData.id, values);
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
            name={'taskStatusId'}
            label="Tiến độ"
            placeholder="Chọn tiến độ"
            options={taskStatusList}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormTextArea
            width="465px"
            name="note"
            label="Ghi chú"
            placeholder="Nhập ghi chú (không bắt buộc)"
          />
        </ProForm.Group>
      </ModalForm>
    </div>
  );
}
