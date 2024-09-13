import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  UserAddOutlined,
  DownloadOutlined,
  PlusOutlined,
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
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import {
  getSubjectList,
  deleteSubject,
  getFacultySelection,
  getDepartmentSelection,
} from '../../api/axios';
import { ButtonCustom } from '../../components/ButtonCustom';
import { ModalFormSubject } from './components/ModalFormSubject';
import { excelApi } from '../../api/excelApi';
import { notificationError, notificationSuccess } from '../../components/Notification';
import { messageErrorToSever } from '../../components/Message';
import { useMutation } from '@tanstack/react-query';

function ManageSubject() {
  const roleId = JSON.parse(sessionStorage.getItem('user_role'));
  const userInfo = JSON.parse(sessionStorage.getItem('user_info'));
  const { Title } = Typography;
  const [loadingTable, setLoadingTable] = useState(false);
  const [openModalFormSubject, setOpenModalFormSubject] = useState(false);
  const [subjectData, setSubjectData] = useState({});
  const [valueSearchSubject, setValueSearchSubject] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [size, setSize] = useState(10);
  const [dataSource, setDataSource] = useState([]);
  const [formCreate, setFormCreate] = useState(true);

  const [searchFacultyId, setSearchFacultyId] = useState('');
  const [searchDepartmentId, setSearchDepartmentId] = useState('');

  // handle delete subject
  const handleConfirmDeleteSubject = (id) => {
    setLoadingTable(true);
    deleteSubject(id)
      .then((res) => {
        if (res.data?.success === true) {
          notificationSuccess('Xóa thành công');
          handleGetSubjectList();
        } else notificationError(res.data?.error?.message);
      })
      .finally(() => setLoadingTable(false));
  };

  // handle get subject list
  const debunceValue = useDebounce(valueSearchSubject, 750);
  const keyword = debunceValue[0];
  const handleGetSubjectList = () => {
    setLoadingTable(true);
    getSubjectList({
      page: page,
      size: size,
      keyword: keyword,
      departmentId: searchDepartmentId,
      facultyId: searchFacultyId,
    })
      .then((res) => {
        if (res.data?.success === true) {
          setDataSource(res.data?.data?.items);
          setTotal(res.data?.data?.total);
          setLoadingTable(false);
        } else
          notification.error({
            message: 'Lấy danh sách thất bại',
            description: 'Bạn không có quyền truy cập',
            duration: 3,
          });
      })
      .finally(() => setLoadingTable(false));
  };

  const handleClickEdit = (record) => {
    setSubjectData(record);
    setFormCreate(false);
    setOpenModalFormSubject(true);
  };

  useEffect(() => {
    return handleGetSubjectList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, keyword, searchDepartmentId, searchFacultyId]);

  const [facultySelection, setFacultySelection] = useState([]);
  useEffect(() => {
    getFacultySelection().then((res) => {
      if (res.data?.success) {
        const newArr = [];
        res.data?.data?.items?.map((item) => newArr.push({ label: item?.name, value: item?.id }));
        setFacultySelection(newArr);
      }
    });
  }, []);

  const [departmentSelection, setDepartmentSelection] = useState([]);
  useEffect(() => {
    getDepartmentSelection({ facultyId: searchFacultyId }).then((res) => {
      if (res.data?.success) {
        const newArr = [];
        res.data?.data?.items?.map((item) => newArr.push({ label: item?.name, value: item?.id }));
        setDepartmentSelection(newArr);
      }
    });
  }, [searchFacultyId]);

  // Export subject list to excel
  const exportSubjectToExcel = useMutation({
    mutationKey: ['exportSubjectList'],
    mutationFn: () =>
      excelApi.exportSubjectList({
        keyword: keyword,
        departmentId: searchDepartmentId,
        facultyId: searchFacultyId,
      }),
    onSuccess: (res) => {
      if (res && res.success === true) {
        window.open(res.data);
        notificationSuccess('Đã xuất file excel thành công hãy kiểm tra trong máy của bạn nhé');
      } else {
        messageErrorToSever(res, 'Có lỗi trong quá trình lưu file');
      }
    },
  });

  const columns = [
    {
      title: 'Mã môn học',
      dataIndex: 'id',
      align: 'left',
      width: '5%',
    },
    {
      title: 'Tên môn học',
      dataIndex: 'name',
      align: 'left',
      fixed: 'left',
      width: '10%',
    },
    {
      title: 'Khoa',
      dataIndex: ['department', 'faculty', 'name'],
      align: 'left',
      width: '9%',
      filterDropdown: () => (
        <div className="p-3 flex flex-col gap-2 w-[280px]">
          <Select
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            value={searchFacultyId}
            options={facultySelection}
            placeholder="Chọn khoa"
            onChange={(searchFacultyId) => setSearchFacultyId(searchFacultyId)}
          />
          <Space>
            <ButtonCustom
              handleClick={() => setSearchFacultyId(null)}
              size="small"
              title={'Reset'}
            />
          </Space>
        </div>
      ),
      filterIcon: () => (
        <Tooltip title="Tìm kiếm theo khoa">
          <SearchOutlined
            className={`${searchFacultyId ? 'text-blue-500' : undefined} text-base`}
          />
        </Tooltip>
      ),
    },
    {
      title: 'Bộ môn',
      dataIndex: ['department', 'name'],
      align: 'left',
      width: '9%',
      filterDropdown: () => (
        <div className="p-3 flex flex-col gap-2 w-[280px]">
          <Select
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            value={searchDepartmentId}
            options={departmentSelection}
            placeholder="Chọn bộ môn"
            onChange={(searchDepartmentId) => setSearchDepartmentId(searchDepartmentId)}
          />
          <Space>
            <ButtonCustom
              handleClick={() => setSearchDepartmentId(null)}
              size="small"
              title={'Reset'}
            />
          </Space>
        </div>
      ),
      filterIcon: () => (
        <Tooltip title="Tìm kiếm theo bộ môn">
          <SearchOutlined
            className={`${searchDepartmentId ? 'text-blue-500' : undefined} text-base`}
          />
        </Tooltip>
      ),
    },
    {
      title: 'Số tín chỉ',
      dataIndex: 'credits',
      align: 'left',
      width: '4%',
    },
    {
      title: 'File đề cương',
      render: (record) => (
        <>
          <a href={record?.outline} target="_blank" rel="noopener noreferrer">
            {record?.outline ? 'Bấm để xem' : null}
          </a>
        </>
      ),
      align: 'left',
      width: '5%',
    },
    {
      title: 'File bài giảng',
      render: (record) => (
        <>
          <a href={record?.lecture} target="_blank" rel="noopener noreferrer">
            {record?.lecture ? 'Bấm để xem' : null}
          </a>
        </>
      ),
      align: 'left',
      width: '5%',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      align: 'left',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      align: 'left',
      width: '8%',
      //   render: (e, record, idx) => role(record.roleId),
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
      width: '9%',
    },
    {
      title: 'Chỉnh sửa lần cuối',
      dataIndex: 'modifiedAt',
      align: 'left',
      width: '8%',
    },
    {
      title: 'Người sửa',
      render: (e, record, index) => (
        <>
          <p>
            {record?.modifiedBy?.id} {record.modifiedBy ? '-' : null}{' '}
            {record?.modifiedBy?.firstName} {record?.modifiedBy?.lastName}
          </p>
        </>
      ),
      align: 'left',
      width: '9%',
    },
    {
      title: roleId !== 'LECTURER' ? 'Tùy chọn' : '',
      align: 'center',
      fixed: 'right',
      width: roleId !== 'LECTURER' ? '7%' : '0',
      render:
        roleId !== 'LECTURER' &&
        ((e, record, index) =>
          (roleId === 'MANAGER' || roleId === 'DEPUTY') &&
          userInfo.department?.id === record.department?.id && (
            <Button.Group key={index}>
              <ButtonCustom
                title={'Sửa'}
                icon={<EditOutlined />}
                handleClick={() => handleClickEdit(record)}
                size="small"
              />
              <Popconfirm
                placement="topRight"
                title="Bạn có chắc chắn muốn môn học này?"
                icon={<DeleteOutlined />}
                okText="Xóa"
                okType="danger"
                onConfirm={() => handleConfirmDeleteSubject(record.id)}
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
          )),
    },
  ];

  return (
    <div>
      <Title level={3} className="uppercase text-center" style={{ marginBottom: 0 }}>
        Danh sách môn học
      </Title>
      <div className="flex justify-between mb-2">
        <div className="flex">
          <Tooltip className="flex" title="Tìm kiếm môn học">
            <Input
              prefix={<SearchOutlined className="opacity-60 mr-1" />}
              placeholder="Nhập từ khóa"
              className="shadow-sm w-[230px] h-9 my-auto"
              onChange={(e) => setValueSearchSubject(e.target.value)}
              value={valueSearchSubject}
            />
          </Tooltip>
          <p className="my-auto ml-2">Tổng số kết quả: {total}</p>
        </div>
        <Space>
          {roleId !== 'LECTURER' && (
            <Button
              icon={<PlusOutlined />}
              onClick={() => {
                setOpenModalFormSubject(true);
                setFormCreate(true);
              }}
              className="flex justify-center items-center text-md font-medium shadow-md bg-slate-100"
            >
              Thêm môn học
            </Button>
          )}
        </Space>
      </div>
      <ModalFormSubject
        isCreate={formCreate}
        onSuccess={() => {
          handleGetSubjectList();
          setOpenModalFormSubject(false);
        }}
        subjectData={subjectData}
        openForm={openModalFormSubject}
        onChangeClickOpen={(open) => {
          if (!open) {
            setSubjectData({});
            setOpenModalFormSubject(false);
          }
        }}
      />
      <div className="relative">
        <Table
          scroll={{
            y: '64vh',
            x: 2600,
          }}
          rowKey="id"
          loading={loadingTable}
          // bordered={true}
          dataSource={dataSource}
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
        {dataSource.length > 0 && (
          <div className="absolute bottom-5 left-0">
            <ButtonCustom
              title="Xuất danh sách môn học"
              loading={exportSubjectToExcel.isPending}
              handleClick={() => {
                exportSubjectToExcel.mutate();
              }}
              icon={<DownloadOutlined />}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageSubject;
