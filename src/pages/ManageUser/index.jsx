import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  SwapOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import {
  Button,
  Drawer,
  Input,
  Popconfirm,
  Space,
  Table,
  Tooltip,
  Typography,
  notification,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { deleteUser, getUserList } from '../../api/axios';
import { ButtonCustom } from '../../components/ButtonCustom';
import DrawerAdminAuther from './components/Drawer';
import { ModalFormUser } from './components/ModalFormUser';

function ManageUser(props) {
  const { Title } = Typography;
  const [openDrawer, setOpenDrawer] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [openModalFormUser, setOpenModalFormUser] = useState(false);
  const [userData, setUserData] = useState({});
  const [valueSearchUser, setValueSearchUser] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [size, setSize] = useState(10);
  const [dataSource, setDataSource] = useState([]);
  const [formCreate, setFormCreate] = useState(true);

  // handle delete user
  const handleConfirmDeleteUser = (id) => {
    setLoadingTable(true);
    deleteUser(id)
      .then((res) => {
        if (res.data?.success === true) {
          notification.success({
            message: 'Thành công',
            description: 'Xóa thành công',
            duration: 2,
          });
          handleGetUserList();
        } else
          return notification.error({
            message: 'Xóa thất bại',
            description: res.data?.error?.message,
            duration: 2,
          });
      })
      .finally(() => setLoadingTable(false));
  };

  // handle get user list
  const debunceValue = useDebounce(valueSearchUser, 750);
  const keyword = debunceValue[0];
  const handleGetUserList = () => {
    setLoadingTable(true);
    getUserList({ page: page, size: size, keyword: keyword })
      .then((res) => {
        if (res.data?.success === true) {
          setDataSource(res.data?.data?.items);
          setTotal(res.data?.data?.total);
          setLoadingTable(false);
        } else if (res.data?.error?.message === 'Access Denied') {
          // message.warning('Bạn không có quyền truy cập');
          notification.error({
            message: 'Lấy danh sách thất bại',
            description: 'Bạn không có quyền truy cập',
            duration: 2,
          });
        }
      })
      .finally(() => setLoadingTable(false));
  };

  const handleClickEdit = (record) => {
    setUserData(record);
    setOpenModalFormUser(true);
    setFormCreate(false);
  };
  useEffect(() => {
    handleGetUserList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, keyword]);

  const columns = [
    {
      title: 'Mã người dùng',
      dataIndex: 'id',
      align: 'left',
      fixed: 'left',
      width: '5%',
    },
    {
      title: 'Họ đệm',
      dataIndex: 'firstName',
      align: 'left',
      width: '7%',
    },
    {
      title: 'Tên',
      dataIndex: 'lastName',
      align: 'left',
      width: '3%',
    },
    {
      title: 'Trình độ',
      dataIndex: ['degree', 'name'],
      align: 'left',
      width: '3%',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      align: 'left',
      width: '8%',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      align: 'left',
      width: '5%',
    },
    {
      title: 'Bộ môn',
      dataIndex: ['department', 'name'],
      align: 'left',
      width: '7%',
    },
    {
      title: 'Khoa',
      dataIndex: ['department', 'faculty', 'name'],
      align: 'left',
      width: '10%',
    },
    {
      title: 'Vai trò',
      dataIndex: ['role', 'id'],
      align: 'left',
      width: '4%',
      //   render: (e, record, idx) => role(record.roleId),
    },
    {
      title: 'Chức vụ',
      dataIndex: ['role', 'name'],
      align: 'left',
      width: '8%',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      align: 'left',
    },
    {
      title: 'Tùy chọn',
      align: 'center',
      fixed: 'right',
      width: '5%',
      render: (e, record, index) => (
        <Button.Group key={index}>
          <ButtonCustom
            title={'Sửa'}
            icon={<EditOutlined />}
            handleClick={() => handleClickEdit(record)}
            size="small"
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa người dùng này ?"
            icon={<DeleteOutlined />}
            okText="Xóa"
            okType="danger"
            onConfirm={() => handleConfirmDeleteUser(record.id)}
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
    <div className="h-[98vh]">
      <div className="flex justify-between mb-3">
        <Tooltip title="Tìm kiếm người dùng">
          <Input
            prefix={<SearchOutlined className="opacity-60 mr-1" />}
            placeholder="Nhập từ khóa"
            className="shadow-sm w-[230px]"
            onChange={(e) => setValueSearchUser(e.target.value)}
            value={valueSearchUser}
          />
        </Tooltip>
        <Title level={3} className="uppercase absolute left-[45%]">
          Danh sách người dùng
        </Title>
        <Space>
          <Button
            icon={<SwapOutlined />}
            onClick={() => {
              setOpenDrawer(true);
            }}
            className="flex justify-center items-center text-md font-medium shadow-md bg-slate-100"
          >
            Phân quyền
          </Button>
          <Button
            icon={<UserAddOutlined />}
            onClick={() => {
              setOpenModalFormUser(true);
              setFormCreate(true);
            }}
            className="flex justify-center items-center text-md font-medium shadow-md bg-slate-100"
          >
            Thêm người dùng
          </Button>
        </Space>
      </div>
      <ModalFormUser
        isCreate={formCreate}
        onSuccess={() => {
          handleGetUserList();
          setOpenModalFormUser(false);
        }}
        userData={userData}
        openForm={openModalFormUser}
        onChangeClickOpen={(open) => {
          if (!open) {
            setUserData({});
            setOpenModalFormUser(false);
          }
        }}
      />

      {dataSource && (
        <Table
          scroll={{
            y: 5000,
            x: 3600,
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
            // showSizeChanger: true,
          }}
        />
      )}
      <Drawer placement="right" open={openDrawer} onClose={() => setOpenDrawer(false)} width={1300}>
        <DrawerAdminAuther />
      </Drawer>
    </div>
  );
}

export default ManageUser;
