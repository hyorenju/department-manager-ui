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
import Highlighter from 'react-highlight-words';
import React, { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { deleteDepartment, getDepartmentList, getFacultySelection } from '../../api/axios';
import { ButtonCustom } from '../../components/ButtonCustom';
import { ModalFormDepartment } from './components/ModalFormDepartment';
import { useMutation } from '@tanstack/react-query';
import { excelApi } from '../../api/excelApi';
import { notificationError, notificationSuccess } from '../../components/Notification';
import { messageErrorToSever } from '../../components/Message';

function ManageDepartment() {
  const { Title } = Typography;
  const [loadingTable, setLoadingTable] = useState(false);
  const [openModalFormDepartment, setOpenModalFormDepartment] = useState(false);
  const [departmentData, setDepartmentData] = useState({});
  const [valueSearchDepartment, setValueSearchDepartment] = useState('');
  const [keyword, setKeyword] = useState();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [size, setSize] = useState(10);
  const [dataSource, setDataSource] = useState([]);
  const [formCreate, setFormCreate] = useState(true);
  const [facultySelection, setFacultySelection] = useState([]);
  const [facultyId, setFacultyId] = useState('');

  // handle delete department
  const handleConfirmDeleteDepartment = (id) => {
    setLoadingTable(true);
    deleteDepartment(id)
      .then((res) => {
        if (res.data?.success === true) {
          notificationSuccess('Xóa thành công');
          handleGetDepartmentList();
        } else notificationError(res.data?.error?.message);
      })
      .finally(() => setLoadingTable(false));
  };

  // handle get department list
  const handleGetDepartmentList = () => {
    setLoadingTable(true);
    getDepartmentList({ page: page, size: size, keyword: keyword, facultyId: facultyId })
      .then((res) => {
        if (res.data?.success === true) {
          setDataSource(res.data?.data?.items);
          setTotal(res.data?.data?.total);
          setLoadingTable(false);
        } else notificationError('Bạn không có quyền truy cập');
      })
      .finally(() => setLoadingTable(false));
  };

  const handleClickEdit = (record) => {
    setDepartmentData(record);
    setFormCreate(false);
    setOpenModalFormDepartment(true);
  };

  useEffect(() => {
    return handleGetDepartmentList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, keyword, facultyId]);

  useEffect(() => {
    getFacultySelection().then((res) => {
      if (res.data?.success) {
        const newArr = [];
        res.data?.data?.items?.map((item) => newArr.push({ label: item?.name, value: item?.id }));
        setFacultySelection(newArr);
      }
    });
  }, []);

  const columns = [
    {
      title: 'Mã bộ môn',
      dataIndex: 'id',
      align: 'left',
      fixed: 'left',
      width: '5%',
    },
    {
      title: 'Tên bộ môn',
      dataIndex: 'name',
      align: 'left',
      fixed: 'left',
      width: '9%',
    },
    {
      title: 'Khoa',
      dataIndex: ['faculty', 'name'],
      align: 'left',
      width: '9%',
      // ...handleSearchFacultyId(),
      filterDropdown: ({ close }) => (
        <div className="p-3 flex flex-col gap-2 w-[280px]">
          <Select
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            value={facultyId}
            options={facultySelection}
            placeholder="Chọn khoa"
            optionFilterProp="children"
            onChange={(searchFacultyId) => setFacultyId(searchFacultyId)}
          />
          <Space>
            <ButtonCustom handleClick={() => setFacultyId(null)} size="small" title={'Reset'} />
          </Space>
        </div>
      ),
      filterIcon: () => (
        <Tooltip title="Tìm kiếm theo tên khoa">
          <SearchOutlined className={`${facultyId ? 'text-blue-500' : undefined} text-base`} />
        </Tooltip>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      align: 'left',
      width: '7%',
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
      width: '7%',
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
      title: 'Tùy chọn',
      align: 'center',
      fixed: 'right',
      width: '6%',
      render: (e, record, index) => (
        <Button.Group key={index}>
          <ButtonCustom
            title={'Sửa'}
            icon={<EditOutlined />}
            handleClick={() => handleClickEdit(record)}
            size="small"
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa bộ môn này?"
            icon={<DeleteOutlined />}
            okText="Xóa"
            okType="danger"
            onConfirm={() => handleConfirmDeleteDepartment(record.id)}
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

  return (
    <div>
      <Title level={3} className="uppercase text-center" style={{ marginBottom: 0 }}>
        Danh sách bộ môn
      </Title>
      <div className="flex justify-between mb-2">
        <div className="flex">
          <Tooltip className="flex" title="Tìm kiếm bộ môn">
            <Input
              prefix={<SearchOutlined className="opacity-60 mr-1" />}
              placeholder="Nhập từ khóa"
              className="shadow-sm w-[230px] my-auto h-9"
              onChange={(e) => setValueSearchDepartment(e.target.value)}
              value={valueSearchDepartment}
              onPressEnter={() => setKeyword(valueSearchDepartment)}
            />
          </Tooltip>
          <p className="my-auto ml-2">Tổng số kết quả: {total}</p>
        </div>
        <Space>
          <Button
            icon={<PlusOutlined />}
            onClick={() => {
              setOpenModalFormDepartment(true);
              setFormCreate(true);
            }}
            className="flex justify-center items-center text-md font-medium shadow-md bg-slate-100"
          >
            Thêm bộ môn
          </Button>
        </Space>
      </div>
      <ModalFormDepartment
        isCreate={formCreate}
        onSuccess={() => {
          handleGetDepartmentList();
          setOpenModalFormDepartment(false);
        }}
        departmentData={departmentData}
        openForm={openModalFormDepartment}
        onChangeClickOpen={(open) => {
          if (!open) {
            setDepartmentData({});
            setOpenModalFormDepartment(false);
          }
        }}
      />
      <div className="relative">
        <Table
          scroll={{
            y: '64vh',
            x: 1600,
          }}
          rowKey="id"
          loading={loadingTable}
          bordered={true}
          dataSource={dataSource}
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
    </div>
  );
}

export default ManageDepartment;
