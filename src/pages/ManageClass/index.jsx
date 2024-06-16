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
import { deleteClass, getClassList, getFacultySelection } from '../../api/axios';
import { ButtonCustom } from '../../components/ButtonCustom';
import { ModalFormClass } from './components/ModalFormClass';
import { useMutation } from '@tanstack/react-query';
import { excelApi } from '../../api/excelApi';
import { notificationError, notificationSuccess } from '../../components/Notification';
import { messageErrorToSever } from '../../components/Message';

function ManageClass() {
  const roleId = JSON.parse(sessionStorage.getItem('user_role'));
  const { Title } = Typography;
  const [loadingTable, setLoadingTable] = useState(false);
  const [openModalFormClass, setOpenModalFormClass] = useState(false);
  const [classData, setClassData] = useState({});
  const [valueSearchClass, setValueSearchClass] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [size, setSize] = useState(10);
  const [dataSource, setDataSource] = useState([]);
  const [formCreate, setFormCreate] = useState(true);
  const [facultySelection, setFacultySelection] = useState([]);
  const [facultyId, setFacultyId] = useState('');

  // handle delete class
  const handleConfirmDeleteClass = (id) => {
    setLoadingTable(true);
    deleteClass(id)
      .then((res) => {
        if (res.data?.success === true) {
          notificationSuccess('Xóa thành công');
          handleGetClassList();
        } else notificationError(res.data?.error?.message);
      })
      .finally(() => setLoadingTable(false));
  };

  // handle get class list
  const debunceValue = useDebounce(valueSearchClass, 750);
  const keyword = debunceValue[0];
  const handleGetClassList = () => {
    setLoadingTable(true);
    getClassList({ page: page, size: size, keyword: keyword, facultyId: facultyId })
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
    setClassData(record);
    setFormCreate(false);
    setOpenModalFormClass(true);
  };

  useEffect(() => {
    return handleGetClassList();
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

  // Export class list to excel
  const exportClassToExcel = useMutation({
    mutationKey: ['exportClassList'],
    mutationFn: () =>
      excelApi.exportClassList({
        keyword: keyword,
        facultyId: facultyId,
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
      title: 'Mã lớp',
      dataIndex: 'id',
      align: 'left',
      fixed: 'left',
      width: '5%',
    },
    {
      title: 'Tên lớp',
      dataIndex: 'name',
      align: 'left',
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
      title: 'Giáo viên chủ nhiệm',
      dataIndex: 'hrTeacher',
      align: 'left',
      width: '8%',
    },
    {
      title: 'Lớp trưởng',
      dataIndex: 'monitor',
      align: 'left',
      width: '8%',
    },
    {
      title: 'Sđt lớp trưởng',
      dataIndex: 'monitorPhone',
      align: 'left',
      width: '5%',
    },
    {
      title: 'Email lớp trưởng',
      dataIndex: 'monitorEmail',
      align: 'left',
      width: '8%',
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
      title: roleId !== 'LECTURER' ? 'Tùy chọn' : '',
      align: 'center',
      fixed: 'right',
      width: roleId !== 'LECTURER' ? '6%' : '0',
      render:
        roleId !== 'LECTURER' &&
        ((e, record, index) => (
          <Button.Group key={index}>
            <ButtonCustom
              title={'Sửa'}
              icon={<EditOutlined />}
              handleClick={() => handleClickEdit(record)}
              size="small"
            />
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa lớp này?"
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
        )),
    },
  ];

  return (
    <div>
      <Title level={3} className="uppercase text-center" style={{ marginBottom: 0 }}>
        Danh sách lớp
      </Title>
      <div className="flex justify-between mb-2">
        <div className="flex">
          <Tooltip className="flex" title="Tìm kiếm lớp">
            <Input
              prefix={<SearchOutlined className="opacity-60 mr-1" />}
              placeholder="Nhập từ khóa"
              className="shadow-sm w-[230px] h-9 my-auto"
              onChange={(e) => setValueSearchClass(e.target.value)}
              value={valueSearchClass}
            />
          </Tooltip>
          <p className="my-auto ml-2">Tổng số kết quả: {total}</p>
        </div>
        <Space>
          {roleId !== 'LECTURER' && (
            <Button
              icon={<PlusOutlined />}
              onClick={() => {
                setOpenModalFormClass(true);
                setFormCreate(true);
              }}
              className="flex justify-center items-center text-md font-medium shadow-md bg-slate-100"
            >
              Thêm lớp
            </Button>
          )}
        </Space>
      </div>
      <ModalFormClass
        isCreate={formCreate}
        onSuccess={() => {
          handleGetClassList();
          setOpenModalFormClass(false);
        }}
        classData={classData}
        openForm={openModalFormClass}
        onChangeClickOpen={(open) => {
          if (!open) {
            setClassData({});
            setOpenModalFormClass(false);
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
        {dataSource.length > 0 && (
          <div className="absolute bottom-5 left-0">
            <ButtonCustom
              title="Xuất danh sách lớp"
              loading={exportClassToExcel.isPending}
              handleClick={() => {
                exportClassToExcel.mutate();
              }}
              icon={<DownloadOutlined />}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageClass;
