import { DeleteOutlined, EditOutlined, SearchOutlined, UserAddOutlined } from '@ant-design/icons';
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
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { deleteClass, getClassList } from '../../api/axios';
import { ButtonCustom } from '../../components/ButtonCustom';
import { ModalFormClass } from './components/ModalFormClass';

function ManageClass(props) {
  const { Title } = Typography;
  const [loadingTable, setLoadingTable] = useState(false);
  const [openModalFormUser, setOpenModalFormUser] = useState(false);
  const [classData, setClassData] = useState({});
  const [valueSearchClass, setValueSearchClass] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [size, setSize] = useState(10);
  const [dataSource, setDataSource] = useState([]);
  const [formCreate, setFormCreate] = useState(true);

  // handle delete class
  const handleConfirmDeleteClass = (id) => {
    setLoadingTable(true);
    deleteClass(id)
      .then((res) => {
        if (res.data?.success === true) {
          notification.success({
            message: 'Thành công',
            description: 'Xóa thành công',
            duration: 2,
          });
          handleGetClassList();
        } else return message.error(res.data?.error?.message);
      })
      .finally(() => setLoadingTable(false));
  };

  // handle get class list
  const debunceValue = useDebounce(valueSearchClass, 750);
  const keyword = debunceValue[0];
  const handleGetClassList = () => {
    setLoadingTable(true);
    getClassList({ page: page, size: size, keyword: keyword, facultyId: '' })
      .then((res) => {
        if (res.data?.success === true) {
          setDataSource(res.data?.data?.items);
          setTotal(res.data?.data?.total);
          setLoadingTable(false);
        } else if (res.data?.error?.message === 'Access Denied') {
          message.warning('Bạn không có quyền truy cập');
        }
      })
      .finally(() => setLoadingTable(false));
  };

  const handleClickEdit = (record) => {
    setClassData(record);
    setFormCreate(false);
    setOpenModalFormUser(true);
  };
  useEffect(() => {
    handleGetClassList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, keyword]);

  const columns = [
    {
      title: 'Mã lớp',
      dataIndex: 'id',
      align: 'left',
      fixed: 'left',
      width: '4%',
    },
    {
      title: 'Tên lớp',
      dataIndex: 'name',
      align: 'left',
      width: '8%',
    },
    {
      title: 'Khoa',
      dataIndex: ['faculty', 'name'],
      align: 'left',
      width: '8%',
    },
    {
      title: 'Giáo viên chủ nhiệm',
      dataIndex: 'hrTeacher',
      align: 'left',
      width: '7%',
    },
    {
      title: 'Lớp trưởng',
      dataIndex: 'monitor',
      align: 'left',
      width: '7%',
    },
    {
      title: 'Sđt lớp trưởng',
      dataIndex: 'monitorPhone',
      align: 'left',
      width: '4%',
    },
    {
      title: 'Email lớp trưởng',
      dataIndex: 'monitorEmail',
      align: 'left',
      width: '7%',
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
      width: '6%',
      //   render: (e, record, idx) => role(record.roleId),
    },
    {
      title: 'Người tạo',
      render: (e, record, index) => (
        <>
          {console.log(record)}
          <p>
            {record.createdBy.id} - {record.createdBy.firstName} {record.createdBy.lastName}
          </p>
        </>
      ),
      align: 'left',
      width: '8%',
    },
    {
      title: 'Chỉnh sửa lần cuối',
      dataIndex: 'modifiedAt',
      align: 'left',
      width: '8%',
    },
    {
      title: 'Người sửa',
      dataIndex: ['modifiedBy', 'id'],
      align: 'left',
      width: '8%',
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
            title="Bạn có chắc chắn muốn xóa lớp này ?"
            icon={<DeleteOutlined />}
            okText="Xóa"
            okType="danger"
            onConfirm={() => handleConfirmDeleteClass(record.id)}
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
        <Tooltip title="Tìm kiếm lớp">
          <Input
            prefix={<SearchOutlined className="opacity-60 mr-1" />}
            placeholder="Nhập từ khóa"
            className="shadow-sm w-[230px]"
            onChange={(e) => setValueSearchClass(e.target.value)}
            value={valueSearchClass}
          />
        </Tooltip>
        <Title level={3} className="uppercase absolute left-[50%]">
          Danh sách lớp
        </Title>
        <Space>
          <Button
            icon={<UserAddOutlined />}
            onClick={() => {
              setOpenModalFormUser(true);
              setFormCreate(true);
            }}
            className="flex justify-center items-center text-md font-medium shadow-md bg-slate-100"
          >
            Thêm lớp
          </Button>
        </Space>
      </div>
      <ModalFormClass
        isCreate={formCreate}
        onSuccess={() => {
          handleGetClassList();
          setOpenModalFormUser(false);
        }}
        classData={classData}
        openForm={openModalFormUser}
        onChangeClickOpen={(open) => {
          if (!open) {
            setClassData({});
            setOpenModalFormUser(false);
          }
        }}
      />

      {dataSource && (
        <Table
          scroll={{
            y: 5000,
            x: 3900,
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
    </div>
  );
}

export default ManageClass;
