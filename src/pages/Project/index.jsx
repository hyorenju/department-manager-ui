import {
  DeleteOutlined,
  EditOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  Popconfirm,
  Popover,
  Select,
  Space,
  Table,
  Tooltip,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import {
  deleteProject,
  deleteTask,
  getMasterDataSelection,
  getProjectList,
  getTasktList,
  getUserSelection,
} from '../../api/axios';
import { ButtonCustom } from '../../components/ButtonCustom';
import { notificationError, notificationSuccess } from '../../components/Notification';
import { ModalFormProject } from './components/ModalFormProject';
import { ModalFormTask } from './components/ModalFormTask';
import { ManageTaskDetail } from './pages/ManageTaskDetail';
import { FormFilterProject } from './components/FormFilterProject';

function ManageProject() {
  const userData = JSON.parse(sessionStorage.getItem('user_info'));
  const { Title } = Typography;
  const [loadingTable, setLoadingTable] = useState(false);
  const [openModalFormProject, setOpenModalFormProject] = useState(false);
  const [openModalFormTask, setOpenModalFormTask] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [projectData, setProjectData] = useState({});
  const [taskData, setTaskData] = useState({});
  const [typeValueSearch, setTypeValueSearch] = useState('');
  const [valueSearch, setValueSearch] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [size, setSize] = useState(10);
  const [projectDataSource, setProjectDataSource] = useState([]);
  const [taskDataSource, setTaskDataSource] = useState([]);
  const [formCreate, setFormCreate] = useState(true);
  const [userSelection, setUserSelection] = useState();
  const [statusSelection, setStatusSelection] = useState();

  const [project, setProject] = useState({});
  const [createdBy, setCreatedBy] = useState();
  const [startDate, setStartDate] = useState();
  const [startDateSearch, setStartDateSearch] = useState();
  const [endDate, setEndDate] = useState();
  const [endDateSearch, setEndDateSearch] = useState();
  const [memberId, setMemberId] = useState();
  const [statusId, setStatusId] = useState();
  const [reset, setReset] = useState(false);

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
    getProjectList({
      page: page,
      size: size,
      keyword: valueSearch,
      createdById: createdBy,
      startDate,
      endDate,
      memberId,
      statusId,
    })
      .then((res) => {
        if (res.data?.success === true) {
          setProjectDataSource(res.data?.data?.items);
          setTotal(res.data?.data?.total);
          setLoadingTable(false);
        } else if (res.data?.error?.code === 500) {
          notificationError(res.data?.error?.message);
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
  }, [page, size, valueSearch, reset]);

  useEffect(() => {
    getUserSelection({ departmentId: userData?.department.id, facultyId: null }).then((res) => {
      if (res.data?.success) {
        const newArr = [];
        res.data?.data?.items?.map((item) =>
          newArr.push({
            label: `${item?.id} - ${item?.firstName} ${item?.lastName}`,
            value: item?.id,
          }),
        );
        setUserSelection(newArr);
      }
    });
  }, [userData]);

  useEffect(() => {
    getMasterDataSelection({ type: 'TASK_STATUS' }).then((res) => {
      if (res.data?.success) {
        const newArr = [];
        res.data?.data?.items?.map((item) => newArr.push({ label: item?.name, value: item?.id }));
        setStatusSelection(newArr);
      }
    });
  }, []);

  const onReset = () => {
    setCreatedBy(null);
    setStartDateSearch(null);
    setStartDate(null);
    setEndDateSearch(null);
    setEndDate(null);
    setMemberId(null);
    setStatusId(null);
    if (reset) {
      setReset(false);
    } else {
      setReset(true);
    }
  };

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
        width: '10%',
      },
      {
        title: 'Ngày kết thúc',
        dataIndex: 'deadline',
        align: 'left',
        width: '10%',
      },
      {
        title: 'Tiến độ',
        dataIndex: ['taskStatus', 'name'],
        align: 'left',
        width: '14%',
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'createdAt',
        align: 'left',
        width: '14%',
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
        width: '12%',
        render: (e, record, index) => (
          <div key={index}>
            <Button.Group>
              <Button
                className="bg-blue-100 flex justify-center items-center shadow-lg"
                onClick={() => {
                  handleClickTaskDetail(record);
                }}
                size="small"
                icon={<InfoCircleOutlined />}
              >
                Chi tiết
              </Button>

              {record.project?.createdBy?.id === userData.id && (
                <Button
                  icon={<EditOutlined />}
                  onClick={() => handleClickEditTask(record)}
                  size="small"
                  className="flex border-white justify-center items-center bg-white shadow-lg"
                ></Button>
              )}
              {record.project?.createdBy?.id === userData.id && (
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
                    danger
                  ></Button>
                </Popconfirm>
              )}
            </Button.Group>
            {/* <Button.Group>
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
            </Button.Group> */}
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
        scroll={{
          y: '64vh',
          x: 1250,
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
      width: '17%',
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
      width: '8%',
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'deadline',
      align: 'left',
      width: '8%',
    },
    {
      title: 'Tiến độ',
      dataIndex: ['projectStatus', 'name'],
      align: 'left',
      width: '12%',
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
      width: '11%',
    },
    {
      title: 'Tùy chọn',
      align: 'center',
      fixed: 'right',
      width: '10.5%',
      render: (e, record, index) => (
        <Button.Group key={index}>
          {record.createdBy?.id === userData.id && (
            <>
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
            </>
          )}
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
              placeholder="Tìm theo tên hoặc mô tả"
              className="shadow-sm w-[230px] h-9 my-auto mr-2"
              onChange={(e) => {
                if (!e.target.value) {
                  setValueSearch(e.target.value);
                }
                setTypeValueSearch(e.target.value);
              }}
              value={typeValueSearch}
              onPressEnter={(e) => {
                setValueSearch(e.target.value);
              }}
            />
          </Tooltip>
          <div className="my-auto">
            <Popover
              placement="bottom"
              overlayInnerStyle={{ backgroundColor: '#eef1f3', border: '1px solid #4f8cdd' }}
              content={
                <div className="font-semibold ">
                  <Form className="w-[450px]">
                    <Form.Item label="Tìm theo người tạo">
                      <Select
                        showSearch
                        filterOption={(input, option) =>
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={userSelection}
                        onChange={setCreatedBy}
                        value={createdBy}
                      />
                    </Form.Item>
                    <div className="flex">
                      <Form.Item label="Từ ngày">
                        <DatePicker
                          value={startDateSearch}
                          placeholder="Chọn ngày"
                          format={'DD/MM/YYYY'}
                          onChange={(e) => {
                            if (e) {
                              setStartDateSearch(e);
                              setStartDate(`${e.$D}/${e.$M + 1}/${e.$y}`);
                            } else {
                              setStartDateSearch(null);
                              setStartDate(null);
                            }
                          }}
                        />
                      </Form.Item>
                      <Form.Item className="ml-2" label="- đến ngày">
                        <DatePicker
                          value={endDateSearch}
                          placeholder="Chọn ngày"
                          format={'DD/MM/YYYY'}
                          onChange={(e) => {
                            if (e) {
                              setEndDateSearch(e);
                              setEndDate(`${e.$D}/${e.$M + 1}/${e.$y}`);
                            } else {
                              setEndDateSearch(null);
                              setEndDate(null);
                            }
                          }}
                        />
                      </Form.Item>
                    </div>
                    <Form.Item label="Tìm theo thành viên">
                      <Select
                        showSearch
                        filterOption={(input, option) =>
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={userSelection}
                        onChange={setMemberId}
                        value={memberId}
                      />
                    </Form.Item>
                    <Form.Item label="Tìm theo trạng thái">
                      <Select
                        showSearch
                        filterOption={(input, option) =>
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={statusSelection}
                        onChange={setStatusId}
                        value={statusId}
                      />
                    </Form.Item>
                    <Form.Item
                      className="mb-0"
                      wrapperCol={{
                        offset: 16,
                      }}
                    >
                      <div className="flex">
                        <Button
                          htmlType="button"
                          onClick={() => {
                            onReset();
                          }}
                        >
                          Bỏ lọc
                        </Button>
                        <Button type="primary" htmlType="submit" onClick={handleGetProjectList}>
                          Lọc
                        </Button>
                      </div>
                    </Form.Item>
                  </Form>
                </div>
              }
              trigger={'click'}
            >
              <Button
                icon={<FilterOutlined />}
                className="justify-center items-center text-md font-medium shadow-md bg-slate-100"
              >
                Chọn điều kiện lọc
              </Button>
            </Popover>
          </div>
          <p className="my-auto ml-2">Tổng số kết quả: {total}</p>
        </div>
        <Space>
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
        modifier={userData}
      />
      <div className="relative">
        <Table
          scroll={{
            y: '64vh',
            x: 1550,
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
          width={1300}
          maskClosable={true}
          onClose={() => {
            setOpenDrawer(false);
            handleGetTaskList();
            handleGetProjectList();
          }}
        >
          <ManageTaskDetail open={openDrawer} taskData={taskData} modifier={userData} />
        </Drawer>
      </div>
    </div>
  );
}

export default ManageProject;
