import React, { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Calendar,
  Form,
  Input,
  Popconfirm,
  Segmented,
  Space,
  Table,
  Tooltip,
  Typography,
} from 'antd';
import { promiseApi } from '../../api/promiseApi';
import { useMutation } from '@tanstack/react-query';
import {
  finishedMyTask,
  getUserTaskCalendar,
  getUserTaskPage,
  updateTaskStatus,
} from '../../api/axios';
import dayjs from 'dayjs';
import { notificationError, notificationSuccess } from '../../components/Notification';
import { ButtonCustom } from '../../components/ButtonCustom';
import { CheckOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';

export function Work({ userData }) {
  const { Title } = Typography;
  const [loadingTable, setLoadingTable] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState();
  const [valueSearchUserTask, setValueSearchUserTask] = useState(null);
  const [keyword, setKeyword] = useState(null);
  const [userTaskList, setUserTaskList] = useState([]);
  const [renderList, setRenderList] = useState([]);
  const [dateCalendar, setDateCalendar] = useState(dayjs());
  const [componentVariant, setComponentVariant] = useState('Lịch công việc');

  useEffect(() => {
    if (componentVariant === 'Lịch công việc') {
      getUserTaskCalendar({
        userId: userData?.id,
        monthCalendar: dateCalendar.month() + 1,
        yearCalendar: dateCalendar.year(),
      }).then((res) => {
        if (res.data?.success) {
          setUserTaskList(res?.data?.data?.items);
        }
      });
    } else if (componentVariant === 'Danh sách công việc') {
      handelGetUserTaskList();
    }
  }, [userData, page, size, keyword, dateCalendar, componentVariant]);

  useEffect(() => {
    if (componentVariant === 'Lịch công việc') {
      handleGetDateList();
    } else if (componentVariant === 'Danh sách công việc') {
    }
  }, [userTaskList]);

  const handelGetUserTaskList = () => {
    setLoadingTable(true);
    getUserTaskPage({
      page: page,
      size: size,
      keyword: keyword,
      userId: userData?.id,
      isPrivate: true,
    })
      .then((res) => {
        if (res.data?.success) {
          setUserTaskList(res?.data?.data?.items);
          setTotal(res.data?.data?.total);
          setLoadingTable(false);
        } else notificationError('Bạn không có quyền truy cập');
      })
      .finally(() => setLoadingTable(false));
  };

  const handleSetDateCalendar = (value) => {
    setDateCalendar(value);
  };

  const handleFinishedTask = (id) => {
    finishedMyTask(id).then((res) => {
      if (res.data?.success) {
        handelGetUserTaskList();
        notificationSuccess('Bạn đã xác nhận hoàn thành công việc.');
      } else notificationError('Bạn không có quyền truy cập');
    });
  };

  const handleGetDateList = () => {
    const renders = [];
    userTaskList.forEach((userTaskData) => {
      let [day, month, year] = userTaskData?.task?.start.split('/');
      const start = new Date(year, month - 1, day);
      [day, month, year] = userTaskData?.task?.deadline.split('/');
      const deadline = new Date(year, month - 1, day);

      while (start <= deadline) {
        renders.push({ date: new Date(start), userTask: userTaskData });
        start.setDate(start.getDate() + 1);
      }
    });
    return setRenderList(renders);
  };

  const getTaskList = (value) => {
    let taskList = [];

    renderList.forEach((render) => {
      if (
        render?.date?.getDate() === value.date() &&
        render?.date?.getMonth() === value.month() &&
        render?.date?.getFullYear() === value.year()
      ) {
        taskList.push({
          type:
            render?.userTask?.personalStatus?.name === 'Chưa hoàn thành'
              ? 'warning'
              : render?.userTask?.personalStatus?.name === 'Đã quá hạn'
              ? 'error'
              : 'success',
          content: render?.userTask?.task?.name,
        });
      }
    });

    switch (value.date()) {
      case 8:
        return taskList;
      default:
    }

    return taskList;
  };

  const dateCellRender = (value) => {
    const taskList = getTaskList(value);
    return (
      <ul className="events">
        {taskList.map((item) => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  const onFormVariantChange = ({ variant }) => {
    setComponentVariant(variant);
  };

  const columns = [
    {
      title: 'Công việc lớn',
      dataIndex: ['task', 'project', 'name'],
      align: 'left',
      fixed: 'left',
      width: '14%',
    },
    {
      title: 'Công việc nhỏ',
      dataIndex: ['task', 'name'],
      align: 'left',
      fixed: 'left',
      width: '16%',
    },
    {
      title: 'Tiến độ',
      dataIndex: ['personalStatus', 'name'],
      align: 'left',
      width: '11%',
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: ['task', 'start'],
      align: 'left',
      width: '7%',
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: ['task', 'deadline'],
      align: 'left',
      width: '7%',
    },
    {
      title: 'Người giao việc',
      render: (e, record, index) => (
        <>
          <p>
            {record?.task?.project?.createdBy?.id} {record?.task?.project?.createdBy ? '-' : null}{' '}
            {record?.task?.project?.createdBy?.firstName}{' '}
            {record?.task?.project?.createdBy?.lastName}
          </p>
        </>
      ),
      align: 'left',
      width: '12%',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      align: 'left',
    },
    {
      title: 'Ngày giao',
      dataIndex: ['task', 'createdAt'],
      align: 'left',
      width: '7.5%',
    },
    {
      title: 'Tùy chọn',
      align: 'center',
      fixed: 'right',
      width: '6.5%',
      render: (e, record, index) => (
        <Button.Group key={index}>
          {!record.personalStatus?.name?.includes('Hoàn thành') && (
            <Popconfirm
              placement="topRight"
              title={
                <>
                  <p>Xác nhận đã hoàn thành công việc?</p>
                  <p>Hành động này không thể hoàn tác!</p>
                </>
              }
              icon={<DeleteOutlined />}
              okText="Đồng ý"
              onConfirm={() => handleFinishedTask(record?.id)}
            >
              <Button
                className="flex justify-center items-center text-md shadow-md"
                icon={<CheckOutlined />}
                size="small"
              >
                Xong
              </Button>
            </Popconfirm>
          )}
        </Button.Group>
      ),
    },
  ];

  return (
    <div className="relative">
      <Form
        onValuesChange={onFormVariantChange}
        variant={componentVariant}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          variant: componentVariant,
        }}
      >
        <Form.Item name="variant">
          <Segmented size={'large'} options={['Lịch công việc', 'Danh sách công việc']} />
        </Form.Item>
        {componentVariant === 'Lịch công việc' && (
          <Calendar
            className="p-6 absolute "
            cellRender={dateCellRender}
            onPanelChange={(value) => {
              handleSetDateCalendar(value);
            }}
          />
        )}
        {componentVariant === 'Danh sách công việc' && (
          <div className="absolute w-[100%]">
            <Title level={3} className="uppercase text-center" style={{ marginBottom: 0 }}>
              Danh sách công việc đang thực hiện
            </Title>
            <div className="flex my-3">
              <Tooltip className="flex" title="Nhập từ khóa">
                <Input
                  prefix={<SearchOutlined className="opacity-60 mr-1" />}
                  placeholder="Nhập từ khóa"
                  className="shadow-sm w-[230px] h-9 my-auto bg-white"
                  onChange={(e) => {
                    if (!e.target.value) {
                      setKeyword(e.target.value);
                    }
                    setValueSearchUserTask(e.target.value);
                  }}
                  value={valueSearchUserTask}
                  onPressEnter={(e) => {
                    setKeyword(e.target.value);
                  }}
                />
              </Tooltip>
              <p className="my-auto ml-2">Tổng số kết quả: {total}</p>
            </div>
            <Table
              scroll={{
                y: '64vh',
                x: 1600,
              }}
              rowKey="id"
              loading={loadingTable}
              //   bordered={true}
              dataSource={userTaskList}
              size="middle"
              columns={columns}
              pagination={{
                onChange: (page, size) => {
                  setPage(page);
                  setSize(size);
                },
                defaultCurrent: 1,
                size: size,
                total: total,
                current: page,
                showSizeChanger: false,
              }}
            />
          </div>
        )}
      </Form>
    </div>
  );
}

export default Work;
