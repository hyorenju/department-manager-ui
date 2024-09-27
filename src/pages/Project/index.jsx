import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  UserAddOutlined,
  DownloadOutlined,
  PlusOutlined,
  DownOutlined,
  ExpandOutlined,
  UpOutlined,
  CaretUpOutlined,
  UpCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { ProFormSelect } from '@ant-design/pro-components';
import {
  Button,
  Input,
  Popconfirm,
  Space,
  Table,
  Tooltip,
  Typography,
  message,
  notification,
  Select,
  Dropdown,
  Badge,
  Drawer,
} from 'antd';
import dayjs from 'dayjs';
import Highlighter from 'react-highlight-words';
import React, { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import {
  getProjectList,
  deleteProject,
  getTasktList,
  deleteTask,
  upOrdinalNumber,
} from '../../api/axios';
import { ButtonCustom } from '../../components/ButtonCustom';
import { useMutation } from '@tanstack/react-query';
import { excelApi } from '../../api/excelApi';
import { notificationError, notificationSuccess } from '../../components/Notification';
import { messageErrorToSever } from '../../components/Message';
import { ModalFormProject } from './components/ModalFormProject';
import { ModalFormTask } from './components/ModalFormTask';
import { render } from '@testing-library/react';
import { ManageTaskDetail } from './pages/ManageTaskDetail';

function ManageProject() {
  const roleId = JSON.parse(sessionStorage.getItem('user_role'));
  const { Title } = Typography;
  const [loadingTable, setLoadingTable] = useState(false);
  const [loadingExpandTable, setLoadingExpandTable] = useState(false);
  const [openModalFormProject, setOpenModalFormProject] = useState(false);
  const [openModalFormTask, setOpenModalFormTask] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [projectData, setProjectData] = useState({});
  const [taskData, setTaskData] = useState({});
  const [typeValueSearchProject, setTypeValueSearchProject] = useState('');
  const [valueSearchProject, setValueSearchProject] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [size, setSize] = useState(10);
  const [projectDataSource, setProjectDataSource] = useState([]);
  const [taskDataSource, setTaskDataSource] = useState([]);
  const [formCreate, setFormCreate] = useState(true);

  const [project, setProject] = useState({});

  // handle delete project
  const handleConfirmDeleteProject = (id) => {
    setLoadingTable(true);
    deleteProject(id)
      .then((res) => {
        if (res.data?.success === true) {
          notificationSuccess('Xóa thành công');
          handleGetProjectList();
        } else notificationError(res.data?.error?.message);
      })
      .finally(() => setLoadingTable(false));
  };

  // handle delete task
  const handleConfirmDeleteTask = (id) => {
    setLoadingTable(true);
    deleteTask(id)
      .then((res) => {
        if (res.data?.success === true) {
          notificationSuccess('Xóa thành công');
          handleGetTaskList();
        } else notificationError(res.data?.error?.message);
      })
      .finally(() => setLoadingTable(false));
  };

  // handle get project list
  const handleGetProjectList = () => {
    setLoadingTable(true);
    getProjectList({ page: page, size: size, keyword: valueSearchProject })
      .then((res) => {
        if (res.data?.success === true) {
          setProjectDataSource(res.data?.data?.items);
          setTotal(res.data?.data?.total);
          setLoadingTable(false);
        } else notificationError('Bạn không có quyền truy cập');
      })
      .finally(() => setLoadingTable(false));
  };

  // handle get task list
  const handleGetTaskList = () => {
    setLoadingTable(true);
    getTasktList({ projectId: project.id })
      .then((res) => {
        if (res.data?.success === true) {
          setTaskDataSource(res.data?.data?.items);
          setLoadingTable(false);
        } else notificationError('Bạn không có quyền truy cập');
      })
      .finally(() => setLoadingTable(false));
  };

  const handleUpOrdinalNumber = (id) => {
    setLoadingTable(true);
    upOrdinalNumber(id)
      .then((res) => {
        if (res.data?.success === true) {
          notificationSuccess('Nâng độ ưu tiên thành công');
          handleGetTaskList();
          setLoadingTable(false);
        } else notificationError('Bạn không có quyền truy cập');
      })
      .finally(() => setLoadingTable(false));
  };

  const handleClickEditProject = (record) => {
    setProjectData(record);
    setFormCreate(false);
    setOpenModalFormProject(true);
  };

  const handleClickEditTask = (record) => {
    setTaskData(record);
    setFormCreate(false);
    setOpenModalFormTask(true);
  };

  const handleClickTaskDetail = (record) => {
    setTaskData(record);
    setOpenDrawer(true);
  };

  useEffect(() => {
    return handleGetTaskList();
  }, [project]);

  useEffect(() => {
    return handleGetProjectList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, valueSearchProject]);

  const expandedRowRender = () => {
    const columns = [
      {
        title: 'Tên công việc nhỏ',
        dataIndex: 'name',
        align: 'left',
        fixed: 'left',
        width: '20%',
      },
      {
        title: 'Mô tả',
        dataIndex: 'description',
        // align: 'left',
        // width: '27%',
      },
      {
        title: 'Ngày bắt đầu',
        dataIndex: 'start',
        align: 'left',
        width: '10.5%',
      },
      {
        title: 'Ngày kết thúc',
        dataIndex: 'deadline',
        align: 'left',
        width: '10.5%',
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'createdAt',
        align: 'left',
        width: '17%',
      },
      // {
      //   title: 'Status',
      //   key: 'state',
      //   render: () => <Badge status="success" text="Finished" />,
      // },
      {
        title: 'Tùy chọn',
        align: 'center',
        fixed: 'right',
        width: '15%',
        render: (e, record, index) => (
          <div className="border-2 border-none rounded-md bg-primary" key={index}>
            <Button.Group>
              <Button
                icon={<EditOutlined />}
                onClick={() => handleClickEditTask(record)}
                size="small"
                className="flex border-white justify-center items-center bg-white shadow-lg"
              >
                Sửa
              </Button>
              <Popconfirm
                placement="topRight"
                title="Bạn có chắc chắn muốn xóa công việc nhỏ này?"
                icon={<DeleteOutlined />}
                okText="Xóa"
                okType="danger"
                onConfirm={() => handleConfirmDeleteTask(record.id)}
              >
                <Button
                  className="flex justify-center items-center bg-white text-md shadow-md"
                  icon={<DeleteOutlined />}
                  size="small"
                >
                  Xóa
                </Button>
              </Popconfirm>
            </Button.Group>
            <Button.Group>
              <Button
                className="bg-white flex justify-center items-center shadow-lg"
                onClick={() => handleUpOrdinalNumber(record.id)}
                size="small"
                title="Nâng độ ưu tiên"
                icon={<CaretUpOutlined />}
              ></Button>
              <Button
                className="bg-white flex justify-center items-center shadow-lg"
                onClick={() => {
                  handleClickTaskDetail(record);
                }}
                size="small"
                icon={<InfoCircleOutlined />}
              >
                Chi tiết
              </Button>
            </Button.Group>
          </div>
        ),
      },
    ];
    return (
      <Table
        title={() => {
          return (
            <div className="flex justify-between">
              <p className="text-center font-bold text-lg">{`${project?.name}`}</p>
              <div>
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setOpenModalFormTask(true);
                    setFormCreate(true);
                  }}
                  className="items-center text-md font-medium shadow-md bg-slate-100"
                >
                  Thêm công việc nhỏ
                </Button>
              </div>
            </div>
          );
        }}
        columns={columns}
        dataSource={taskDataSource}
        pagination={false}
        footer={() => {
          return <hr />;
        }}
      />
    );
  };

  const columns = [
    {
      title: 'Tên công việc',
      dataIndex: 'name',
      align: 'left',
      fixed: 'left',
      width: '18%',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      align: 'left',
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'start',
      align: 'left',
      width: '9%',
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'deadline',
      align: 'left',
      width: '9%',
    },
    {
      title: 'Người tạo',
      render: (e, record, index) => (
        <>
          <p>
            {record?.createdBy?.id} {record.createdBy ? '-' : null} {record?.createdBy?.firstName}{' '}
            {record?.createdBy?.lastName}
          </p>
        </>
      ),
      align: 'left',
      width: '14%',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      align: 'left',
      width: '13%',
    },
    {
      title: 'Tùy chọn',
      align: 'center',
      fixed: 'right',
      width: '10.5%',
      render: (e, record, index) => (
        <Button.Group key={index}>
          <ButtonCustom
            title={'Sửa'}
            icon={<EditOutlined />}
            handleClick={() => handleClickEditProject(record)}
            size="small"
          />
          <Popconfirm
            placement="topRight"
            title="Bạn có chắc chắn muốn xóa công việc này?"
            icon={<DeleteOutlined />}
            okText="Xóa"
            okType="danger"
            onConfirm={() => handleConfirmDeleteProject(record.id)}
          >
            <Button
              className="flex justify-center items-center text-md shadow-md"
              icon={<DeleteOutlined />}
              size="small"
              danger
            >
              Xóa
            </Button>
          </Popconfirm>
        </Button.Group>
      ),
    },
  ];
  // const data = [];
  // for (let i = 0; i < 3; ++i) {
  //   data.push({
  //     key: i.toString(),
  //     name: 'Screen',
  //     platform: 'iOS',
  //     version: '10.3.4.5654',
  //     upgradeNum: 500,
  //     creator: 'Jack',
  //     createdAt: '2014-12-24 23:12:00',
  //   });
  // }

  return (
    <div>
      <Title level={3} className="uppercase text-center" style={{ marginBottom: 0 }}>
        Danh sách công việc
      </Title>
      <div className="flex justify-between mb-2">
        <div className="flex">
          <Tooltip className="flex" title="Tìm kiếm công việc">
            <Input
              prefix={<SearchOutlined className="opacity-60 mr-1" />}
              placeholder="Nhập từ khóa"
              className="shadow-sm w-[230px] h-9 my-auto"
              onChange={(e) => {
                if (!e.target.value) {
                  setValueSearchProject(e.target.value);
                }
                setTypeValueSearchProject(e.target.value);
              }}
              value={typeValueSearchProject}
              onPressEnter={(e) => {
                setValueSearchProject(e.target.value);
              }}
            />
          </Tooltip>
          <p className="my-auto ml-2">Tổng số kết quả: {total}</p>
        </div>
        <Space>
          {roleId !== 'LECTURER' && (
            <Button
              icon={<PlusOutlined />}
              onClick={() => {
                setOpenModalFormProject(true);
                setFormCreate(true);
              }}
              className="flex justify-center items-center text-md font-medium shadow-md bg-slate-100"
            >
              Thêm công việc
            </Button>
          )}
        </Space>
      </div>
      <ModalFormProject
        isCreate={formCreate}
        onSuccess={() => {
          handleGetProjectList();
          setOpenModalFormProject(false);
        }}
        projectData={projectData}
        openForm={openModalFormProject}
        onChangeClickOpen={(open) => {
          if (!open) {
            setProjectData({});
            setOpenModalFormProject(false);
          }
        }}
      />
      <ModalFormTask
        isCreate={formCreate}
        onSuccess={() => {
          handleGetTaskList();
          setOpenModalFormTask(false);
        }}
        projectId={project?.id}
        taskData={taskData}
        openForm={openModalFormTask}
        onChangeClickOpen={(open) => {
          if (!open) {
            setTaskData({});
            setOpenModalFormTask(false);
          }
        }}
      />
      <div className="relative">
        <Table
          scroll={{
            y: '64vh',
            x: 1400,
          }}
          rowKey="id"
          loading={loadingTable}
          //   bordered={true}
          dataSource={projectDataSource}
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
          expandable={{
            expandedRowRender,
            onExpand: (expanded, record) => {
              if (expanded) {
                setProject(record);
              }
            },
            //Only expand 1 project at the same time
            onExpandedRowsChange: (row) => {
              if (row.length === 2) {
                row.shift();
              }
            },
          }}
        />
        <Drawer
          extra={
            <h1 className="absolute top-3 right-[50%] translate-x-1/2 font-medium text-xl">{`${taskData?.name}`}</h1>
          }
          placement="right"
          open={openDrawer}
          width={1200}
          maskClosable={true}
          onClose={() => setOpenDrawer(false)}
        >
          <ManageTaskDetail open={openDrawer} taskData={taskData} />
        </Drawer>
      </div>
    </div>
  );
}

export default ManageProject;
