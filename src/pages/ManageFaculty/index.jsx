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
import { deleteFaculty, getFacultyList } from '../../api/axios';
import { ButtonCustom } from '../../components/ButtonCustom';
import { ModalFormFaculty } from './components/ModalFormFaculty';
import { useMutation } from '@tanstack/react-query';
import { excelApi } from '../../api/excelApi';
import { notificationError, notificationSuccess } from '../../components/Notification';
import { messageErrorToSever } from '../../components/Message';

function ManageFaculty() {
  const { Title } = Typography;
  const [loadingTable, setLoadingTable] = useState(false);
  const [openModalFormFaculty, setOpenModalFormFaculty] = useState(false);
  const [facultyData, setFacultyData] = useState({});
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [size, setSize] = useState(10);
  const [dataSource, setDataSource] = useState([]);
  const [formCreate, setFormCreate] = useState(true);

  // handle delete faculty
  const handleConfirmDeleteFaculty = (id) => {
    setLoadingTable(true);
    deleteFaculty(id)
      .then((res) => {
        if (res.data?.success === true) {
          notificationSuccess('Xóa thành công');
          handleGetFacultyList();
        } else notificationError(res.data?.error?.message);
      })
      .finally(() => setLoadingTable(false));
  };

  // handle get faculty list
  const handleGetFacultyList = () => {
    setLoadingTable(true);
    getFacultyList({ page: page, size: size })
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
    setFacultyData(record);
    setFormCreate(false);
    setOpenModalFormFaculty(true);
  };

  useEffect(() => {
    return handleGetFacultyList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size]);

  const columns = [
    {
      title: 'Mã khoa',
      dataIndex: 'id',
      align: 'left',
      fixed: 'left',
      width: '5%',
    },
    {
      title: 'Tên khoa',
      dataIndex: 'name',
      align: 'left',
      fixed: 'left',
      width: '10%',
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
            placement="topRight"
            title="Bạn có chắc chắn muốn xóa khoa này?"
            icon={<DeleteOutlined />}
            okText="Xóa"
            okType="danger"
            onConfirm={() => handleConfirmDeleteFaculty(record.id)}
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
        Danh sách khoa
      </Title>
      <div className="flex justify-between mb-2">
        <p className="my-auto ml-2">Tổng số kết quả: {total}</p>
        <Space>
          <Button
            icon={<PlusOutlined />}
            onClick={() => {
              setOpenModalFormFaculty(true);
              setFormCreate(true);
            }}
            className="flex justify-center items-center text-md font-medium shadow-md bg-slate-100"
          >
            Thêm khoa
          </Button>
        </Space>
      </div>
      <ModalFormFaculty
        isCreate={formCreate}
        onSuccess={() => {
          handleGetFacultyList();
          setOpenModalFormFaculty(false);
        }}
        facultyData={facultyData}
        openForm={openModalFormFaculty}
        onChangeClickOpen={(open) => {
          if (!open) {
            setFacultyData({});
            setOpenModalFormFaculty(false);
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
      </div>
    </div>
  );
}

export default ManageFaculty;
