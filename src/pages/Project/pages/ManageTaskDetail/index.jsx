import { ButtonCustom } from '../../../../components/ButtonCustom';
import { notificationError, notificationSuccess } from '../../../../components/Notification';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Popconfirm, Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import { getUserTaskList } from '../../../../api/axios';
import { ModalFormTaskDetail } from '../components/ModalFormTaskDetail';

export function ManageTaskDetail({ open, taskData }) {
  const [loadingTable, setLoadingTable] = useState(false);
  const [total, setTotal] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [taskDetail, setTaskDetail] = useState({});
  const [taskDetailList, setTaskDetailList] = useState([]);

  const handleGetTaskDetailList = () => {
    setLoadingTable(true);
    getUserTaskList({ taskId: taskData?.id })
      .then((res) => {
        if (res.data?.success === true) {
          setTaskDetailList(res.data?.data?.items);
          setTotal(res.data?.data?.total);
        } else if (res && res.success === false) {
          notificationError(res?.error.message);
        }
      })
      .finally(() => setLoadingTable(false));
  };

  useEffect(() => {
    handleGetTaskDetailList();
  }, [open]);

  const columns = [
    {
      title: 'Mã thành viên',
      dataIndex: ['user', 'id'],
      width: '12%',
    },
    {
      title: 'Tên thành viên',
      render: (e, record, index) => (
        <>
          <p>
            {record?.user?.id} - {record?.user?.firstName} {record?.user?.lastName}
          </p>
        </>
      ),
      width: '22%',
    },
    {
      title: 'Tiến độ',
      dataIndex: ['taskStatus', 'name'],
      width: '16%',
    },
    {
      title: 'Hoàn thành lúc',
      dataIndex: 'finishedAt',
      width: '16%',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
    },
    {
      title: 'Tùy chọn',
      align: 'center',
      fixed: 'right',
      width: '9%',
      render: (record, index) => (
        <Button.Group key={index}>
          <ButtonCustom
            title={'Sửa'}
            icon={<EditOutlined />}
            handleClick={() => {
              setOpenModal(true);
              setTaskDetail(record);
            }}
            size="small"
          />
        </Button.Group>
      ),
    },
  ];
  return (
    <>
      <div>
        <div className="flex justify-between mb-6">
          <p className="my-auto">Tổng số kết quả: {total}</p>
        </div>
        <Table
          loading={loadingTable}
          className="w-[95%] mx-auto "
          rowKey={'name'}
          columns={columns}
          dataSource={taskDetailList}
          pagination={false}
        />
      </div>
      <ModalFormTaskDetail
        openForm={openModal}
        onChangeClickOpen={(open) => {
          if (!open) {
            setTaskDetail({});
            setOpenModal(false);
          }
        }}
        userTaskData={taskDetail}
        onSuccess={() => {
          handleGetTaskDetailList();
          setOpenModal(false);
        }}
      />
    </>
  );
}
