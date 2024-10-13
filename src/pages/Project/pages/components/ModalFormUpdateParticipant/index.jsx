import {
  ModalForm,
  ProForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { notification, message, Form, Input, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  getMasterDataSelection,
  getUserOption,
  getUserTaskList,
  updateParticipant,
  updateTaskStatus,
} from '../../../../../api/axios';
import TextArea from 'antd/es/input/TextArea';
import { notificationError, notificationSuccess } from '../../../../../components/Notification';
import { useMutation } from '@tanstack/react-query';
import { promiseApi } from '../../../../../api/promiseApi';

export function ModalFormUpdateParticipant({
  openForm,
  onChangeClickOpen,
  onSuccess,
  modifier,
  task,
}) {
  const handleUpdateParticipant = useMutation({
    mutationKey: ['updateParticipant'],
    mutationFn: (values) => promiseApi.updateParticipant(values),
    onSuccess: (res) => {
      if (res.success === true) {
        onSuccess();
        notificationSuccess('Thêm thành công');
      } else if (res.data?.error?.code === 2) {
        // eslint-disable-next-line no-lone-blocks
        {
          res.data?.error?.errorDetailList.forEach((e) => message.error(e.message));
        }
      } else if (res.data?.error?.code === 500) {
        message.error(res.data?.error?.message);
      }
    },
  });

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
        getUserOption({ taskId: task?.id, isUpdateParticipant: true }).then((res) => {
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

      // getUserTaskList({ taskId: task?.id }).then((res) => {
      //   if (res.data?.success) {
      //     const newArr = [];
      //     res.data?.data?.items?.map((item) =>
      //       newArr.push({
      //         label: `${item?.user?.id} - ${item?.user?.firstName} ${item?.user?.lastName}`,
      //         value: item?.user?.id,
      //       }),
      //     );
      //     // res.data?.data?.items?.map((item) => anotherNewArr.push(item?.user?.id));
      //     setUserSelected(newArr);
      //   }
      // });
    }
  }, [openForm]);

  useEffect(() => {
    const newArr = [];
    userSelected.map((item) => newArr.push(item?.user?.id));
    setUserIds(newArr);
  }, [userSelected]);

  return (
    <div>
      <ModalForm
        width={600}
        title="Thêm thành viên tham gia"
        initialValues={{
          taskId: task?.id,
          userIds: userIds,
        }}
        modalProps={{
          maskClosable: false,
          destroyOnClose: true,
          okText: !handleUpdateParticipant.isPending ? (
            'Lưu'
          ) : (
            <Button style={{ border: 'none', color: 'white', marginTop: '-5px' }} disabled={true}>
              Đang gửi mail thông báo cho từng thành viên, vui lòng chờ...
            </Button>
          ),
          cancelText: 'Hủy',
        }}
        open={openForm}
        onFinish={(values) => {
          handleUpdateParticipant.mutate(values);
        }}
        onOpenChange={onChangeClickOpen}
      >
        <ProFormText name="taskId" hidden={true} />
        <ProFormSelect
          rules={[{ required: true, message: 'Không được để trống' }]}
          name="userIds"
          mode="multiple"
          placeholder="Chọn những người thực hiện"
          value={userSelected}
          onChange={(e) => {
            console.log(e);
          }}
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
      </ModalForm>
    </div>
  );
}
