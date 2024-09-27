import {
  ModalForm,
  ProForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { notification, message, Form, Input, Select, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  createTask,
  getUserOption,
  getUserSelection,
  updateTask,
  getUserTaskList,
  updateParticipant,
} from '../../../../api/axios';
import { notificationSuccess } from '../../../../components/Notification';
import TextArea from 'antd/es/input/TextArea';

export function ModalFormTask({
  isCreate,
  openForm,
  onChangeClickOpen,
  taskData,
  onSuccess,
  projectId,
  modifier,
}) {
  const handleCreateTask = (values) => {
    createTask(values).then((res) => {
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

  const handleUpdateTask = (id, values) => {
    updateTask(id, values).then((res) => {
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

  const handleUpdateParticitant = () => {
    updateParticipant({ taskId: taskData?.id, userIds: userSelected }).then((res) => {
      if (res.data?.success === true) {
        notification.success({
          message: 'Thành công',
          description: 'Lưu thành công danh sách thành viên',
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

  const [userIds, setUserIds] = useState([]);
  const [userSelected, setUserSelected] = useState([]);
  const [userOption, setUserOption] = useState([]);
  useEffect(() => {
    setUserSelected([]);
    if (openForm) {
      if (modifier.role?.id === 'LECTURER') {
        setUserOption([
          {
            label: `${modifier?.id} - ${modifier?.firstName} ${modifier?.lastName}`,
            value: modifier.id,
          },
        ]);
      } else {
        getUserOption().then((res) => {
          if (res.data?.success) {
            const newArr = [];
            res.data?.data?.items?.map((item) =>
              newArr.push({
                label: `${item?.id} - ${item?.firstName} ${item?.lastName}`,
                value: item?.id,
              }),
            );
            setUserOption(newArr);
          }
        });
      }
      getUserTaskList({ taskId: taskData?.id }).then((res) => {
        if (res.data?.success) {
          const newArr = [];
          res.data?.data?.items?.map((item) => {
            newArr.push({
              label: `${item?.user?.id} - ${item?.user?.firstName} ${item?.user?.lastName}`,
              value: item?.user?.id,
            });
          });
          // res.data?.data?.items?.map((item) => anotherNewArr.push(item?.user?.id));
          setUserSelected(newArr);
        }
      });
    }
  }, [openForm]);

  useEffect(() => {
    const anotherNewArr = [];
    userSelected.map((item) => anotherNewArr.push(item?.user?.id));
    setUserIds(anotherNewArr);
  }, [userSelected]);

  return (
    <div>
      <ModalForm
        width={1200}
        title={taskData.id ? 'Sửa thông tin công việc' : 'Thêm công việc'}
        initialValues={{
          name: taskData.id ? taskData.name : null,
          description: taskData.id ? taskData.description : null,
          start: taskData.id ? taskData.start : null,
          deadline: taskData.id ? taskData.deadline : null,
          projectId: projectId,
          userIds: userIds,
        }}
        modalProps={{
          maskClosable: false,
          destroyOnClose: true,
          okText: taskData.id ? 'Lưu' : 'Tạo',
          cancelText: 'Hủy',
        }}
        open={openForm}
        onFinish={(values) => {
          if (taskData.id) {
            handleUpdateTask(taskData.id, values);
          } else {
            handleCreateTask(values);
          }
        }}
        onOpenChange={onChangeClickOpen}
      >
        <ProForm.Group>
          {isCreate && <ProFormText name="projectId" hidden={true} />}
          <ProFormText
            rules={[{ required: true, message: 'Không được để trống' }]}
            width="xl"
            name="name"
            label="Tên công việc"
            placeholder="Nhập tên công việc"
          />
          {isCreate && (
            <>
              <ProFormDatePicker
                rules={[{ required: true, message: 'Không được để trống' }]}
                width="sm"
                placeholder="Chọn ngày bắt đầu"
                name="start"
                label="Ngày bắt đầu"
                fieldProps={{
                  format: 'DD/MM/YYYY',
                }}
              />
              <ProFormDatePicker
                rules={[{ required: true, message: 'Không được để trống' }]}
                width="sm"
                placeholder="Chọn ngày kết thúc"
                name="deadline"
                label="Ngày kết thúc"
                fieldProps={{
                  format: 'DD/MM/YYYY',
                }}
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
                placeholder="Chọn ngày kết thúc"
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
          {isCreate && (
            <ProFormSelect
              rules={[{ required: true, message: 'Không được để trống' }]}
              name="userIds"
              mode="multiple"
              placeholder="Chọn những người thực hiện"
              value={userSelected}
              onChange={setUserSelected}
              label={'Những người thực hiện'}
              // onChange={(e) => {
              //   setUserSelected(e);
              //   console.log(e);
              // }}
              style={{
                width: '550px',
              }}
              options={userOption}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          )}
          <ProFormTextArea
            width={isCreate ? '465px' : '600px'}
            name="description"
            label="Mô tả"
            placeholder="Nhập mô tả (không bắt buộc)"
          />
        </ProForm.Group>
      </ModalForm>
    </div>
  );
}
