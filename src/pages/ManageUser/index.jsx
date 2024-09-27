import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  SearchOutlined,
  UserAddOutlined,
  PlusOutlined,
  TableOutlined,
  UnlockOutlined,
  LockOutlined,
  UploadOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import {
  Button,
  Drawer,
  Input,
  message,
  Popconfirm,
  Select,
  Space,
  Table,
  Tooltip,
  Typography,
  Upload,
} from 'antd';
import React, { useEffect, useState } from 'react';
import {
  deleteUser,
  getAllRole,
  getDepartmentSelection,
  getFacultySelection,
  getMasterDataSelection,
  getUserList,
  lockAccount,
} from '../../api/axios';
import { excelApi } from '../../api/excelApi';
import { ButtonCustom } from '../../components/ButtonCustom';
import { messageErrorToSever } from '../../components/Message';
import { notificationError, notificationSuccess } from '../../components/Notification';
import { ModalFormUser } from './components/ModalFormUser';
import { ManageDegree } from './pages/ManageDegree';
import { ModalErrorImportUser } from './components/ModalErrorImportUser';

function ManageUser() {
  const roleId = JSON.parse(sessionStorage.getItem('user_role'));
  const userInfo = JSON.parse(sessionStorage.getItem('user_info'));
  const { Title } = Typography;
  const [loadingTable, setLoadingTable] = useState(false);
  const [openModalFormUser, setOpenModalFormUser] = useState(false);
  const [openModalError, setOpenModalError] = useState(false);
  const [userData, setUserData] = useState({});
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [size, setSize] = useState(10);
  const [dataSource, setDataSource] = useState([]);
  const [formCreate, setFormCreate] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);

  const [valueSearchId, setValueSearchId] = useState('');
  const [searchId, setSearchId] = useState('');
  const [valueSearchFirstName, setValueSearchFirstName] = useState('');
  const [searchFirstName, setSearchFirstName] = useState('');
  const [valueSearchLastName, setValueSearchLastName] = useState('');
  const [searchLastName, setSearchLastName] = useState('');
  const [searchDegreeId, setSearchDegreeId] = useState('');
  const [searchFacultyId, setSearchFacultyId] = useState('');
  const [searchDepartmentId, setSearchDepartmentId] = useState(userInfo?.department?.id);
  const [searchRoleId, setSearchRoleId] = useState('');

  // handle delete user
  const handleConfirmDeleteUser = (id) => {
    setLoadingTable(true);
    deleteUser(id)
      .then((res) => {
        if (res.data?.success === true) {
          notificationSuccess('Xóa thành công');
          handleGetUserList();
        } else {
          notificationError(res.data?.error?.message);
        }
      })
      .finally(() => setLoadingTable(false));
  };

  // handle get user list
  const handleGetUserList = () => {
    setLoadingTable(true);
    getUserList({
      page: page,
      size: size,
      id: searchId,
      firstName: searchFirstName,
      lastName: searchLastName,
      degreeId: searchDegreeId,
      facultyId: searchFacultyId,
      departmentId: searchDepartmentId,
      roleId: searchRoleId,
    })
      .then((res) => {
        if (res.data?.success === true) {
          setDataSource(res.data?.data?.items);
          setTotal(res.data?.data?.total);
          setLoadingTable(false);
        } else if (res.data?.error?.message === 'Access Denied') {
          notificationError('Bạn không có quyền truy cập danh sách này');
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
  }, [
    page,
    size,
    searchId,
    searchFirstName,
    searchLastName,
    searchDegreeId,
    searchFacultyId,
    searchDepartmentId,
    searchRoleId,
  ]);

  const type = 'USER_DEGREE';
  const [degreeSelection, setDegreeSelection] = useState([]);
  useEffect(() => {
    getMasterDataSelection({ type: type }).then((res) => {
      if (res.data?.success) {
        const newArr = [];
        res.data?.data?.items?.map((item) => newArr.push({ label: item?.name, value: item?.id }));
        setDegreeSelection(newArr);
      }
    });
  }, []);

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

  const [roleSelection, setRoleSelection] = useState([]);
  useEffect(() => {
    getAllRole().then((res) => {
      if (res.data?.success) {
        const newArr = [];
        res.data?.data?.items?.map((item) => newArr.push({ label: item?.name, value: item?.id }));
        setRoleSelection(newArr);
      }
    });
  }, []);

  // Export user list to excel
  const exportUserToExcel = useMutation({
    mutationKey: ['exportUserList'],
    mutationFn: () =>
      excelApi.exportUserList({
        id: searchId,
        firstName: searchFirstName,
        lastName: searchLastName,
        degreeId: searchDegreeId,
        facultyId: searchFacultyId,
        departmentId: searchDepartmentId,
        roleId: searchRoleId,
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

  const handleLockAccount = (id) => {
    setLoadingTable(true);
    lockAccount(id)
      .then((res) => {
        if (res.data?.success) {
          message.success('Thành công');
          handleGetUserList();
        } else {
          message.error('Có lỗi xảy ra!');
        }
      })
      .finally(() => setLoadingTable(false));
  };

  const importUserList = useMutation({
    mutationKey: ['importUserList'],
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append('file', file.file);
      return excelApi.importUserList(formData);
    },
    onSuccess: (res) => {
      if (res && res.success === true) {
        notificationSuccess('Upload file thành công');
        handleGetUserList();
      } else if (res && res.success === false) {
        setOpenModalError(true);
        if (res.error?.message === 'DATA_NOT_FOUND') {
          messageErrorToSever(
            res,
            'Không tìm thấy dữ liệu. Hãy chắc chắn rằng file excel được nhập từ ô A1',
          );
        } else if (res.error?.message === 'NO_DATA') {
          messageErrorToSever(res, 'Dữ liệu không hợp lệ, hãy trình bày theo hướng dẫn.');
        } else {
          window.open(res.error?.message);
          messageErrorToSever(
            null,
            'Upload file thất bại. Hãy làm theo đúng form excel chúng tôi đã gửi cho bạn.',
          );
        }
      }
    },
  });

  const props = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    customRequest: (file) => importUserList.mutate(file),
    beforeUpload: (file) => {
      const checkSize = file.size / 1024 / 1024 < 1;
      const isXLXS =
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      if (!isXLXS) {
        notificationError(`${file.name} không phải là một file excel`, 3);
        return false;
      }
      if (!checkSize) {
        notificationError(`File tải lên không được quá 1MB`, 3);
        return false;
      }
      return true;
    },
  };

  const columns = [
    {
      title: 'Mã',
      dataIndex: 'id',
      align: 'left',
      fixed: 'left',
      width: '5%',
      filterDropdown: () => (
        <div className="p-3">
          <Input
            placeholder={'Nhập mã giảng viên'}
            value={valueSearchId}
            onChange={(e) => setValueSearchId(e.target.value)}
            className="w-[180px] mb-2 block"
            onPressEnter={(e) => {
              setSearchId(e.target.value);
            }}
          />
          <Space>
            <ButtonCustom
              handleClick={() => {
                setSearchId(null);
                setValueSearchId(null);
              }}
              size="small"
              title={'Reset'}
            />
          </Space>
        </div>
      ),
      filterIcon: () => (
        <Tooltip title="Tìm kiếm theo mã giảng viên">
          <SearchOutlined
            className={`${searchId ? 'text-blue-500' : undefined} text-md p-1 text-base`}
          />
        </Tooltip>
      ),
    },
    {
      title: 'Họ đệm',
      dataIndex: 'firstName',
      align: 'left',
      width: '8%',
      filterDropdown: () => (
        <div className="p-3">
          <Input
            placeholder={'Nhập họ đệm'}
            value={valueSearchFirstName}
            onChange={(e) => setValueSearchFirstName(e.target.value)}
            className="w-[180px] mb-2 block"
            onPressEnter={(e) => {
              setSearchFirstName(e.target.value);
            }}
          />
          <Space>
            <ButtonCustom
              handleClick={() => {
                setSearchFirstName(null);
                setValueSearchFirstName(null);
              }}
              size="small"
              title={'Reset'}
            />
          </Space>
        </div>
      ),
      filterIcon: () => (
        <Tooltip title="Tìm kiếm theo họ đệm">
          <SearchOutlined
            className={`${searchFirstName ? 'text-blue-500' : undefined} text-md p-1 text-base`}
          />
        </Tooltip>
      ),
    },
    {
      title: 'Tên',
      dataIndex: 'lastName',
      align: 'left',
      width: '5%',
      filterDropdown: () => (
        <div className="p-3">
          <Input
            placeholder={'Nhập tên'}
            value={valueSearchLastName}
            onChange={(e) => setValueSearchLastName(e.target.value)}
            className="w-[180px] mb-2 block"
            onPressEnter={(e) => {
              setSearchLastName(e.target.value);
            }}
          />
          <Space>
            <ButtonCustom
              handleClick={() => {
                setSearchLastName(null);
                setValueSearchLastName(null);
              }}
              size="small"
              title={'Reset'}
            />
          </Space>
        </div>
      ),
      filterIcon: () => (
        <Tooltip title="Tìm kiếm theo tên">
          <SearchOutlined
            className={`${searchLastName ? 'text-blue-500' : undefined} text-md p-1 text-base`}
          />
        </Tooltip>
      ),
    },
    {
      title: 'Khoa',
      dataIndex: ['department', 'faculty', 'name'],
      align: 'left',
      width: '11%',
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
      title: 'Trình độ',
      dataIndex: ['degree', 'name'],
      align: 'left',
      width: '6%',
      filterDropdown: () => (
        <div className="p-3 flex flex-col gap-2 w-[230px]">
          <Select
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            value={searchDegreeId}
            options={degreeSelection}
            placeholder="Chọn trình độ"
            onChange={(searchDegreeId) => setSearchDegreeId(searchDegreeId)}
          />
          <Space>
            <ButtonCustom
              handleClick={() => setSearchDegreeId(null)}
              size="small"
              title={'Reset'}
            />
          </Space>
        </div>
      ),
      filterIcon: () => (
        <Tooltip title="Tìm kiếm theo trình độ">
          <SearchOutlined className={`${searchDegreeId ? 'text-blue-500' : undefined} text-base`} />
        </Tooltip>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      align: 'left',
      width: '10%',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      align: 'left',
      width: '6%',
    },
    {
      title: 'Vai trò',
      dataIndex: ['role', 'name'],
      align: 'left',
      width: '10%',
      filterDropdown: () => (
        <div className="p-3 flex flex-col gap-2 w-[230px]">
          <Select
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            value={searchRoleId}
            options={roleSelection}
            placeholder="Chọn vai trò"
            onChange={(searchRoleId) => setSearchRoleId(searchRoleId)}
          />
          <Space>
            <ButtonCustom handleClick={() => setSearchRoleId(null)} size="small" title={'Reset'} />
          </Space>
        </div>
      ),
      filterIcon: () => (
        <Tooltip title="Tìm kiếm theo vai trò">
          <SearchOutlined className={`${searchRoleId ? 'text-blue-500' : undefined} text-base`} />
        </Tooltip>
      ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      align: 'left',
    },
    {
      title: roleId !== 'LECTURER' ? 'Tùy chọn' : '',
      // title: 'Tùy chọn',
      align: 'center',
      fixed: 'right',
      width: roleId !== 'LECTURER' ? '8%' : '0',
      // width: '7.5%',
      render:
        roleId !== 'LECTURER' &&
        ((e, record, index) =>
          (roleId === 'MANAGER' || roleId === 'DEPUTY') &&
          userInfo.department?.id === record.department?.id && (
            <Button.Group key={index}>
              <Button
                icon={
                  record.isLock === null ? (
                    <UnlockOutlined />
                  ) : record.isLock === false ? (
                    <UnlockOutlined />
                  ) : (
                    <LockOutlined />
                  )
                }
                onClick={() => handleLockAccount(record.id)}
                size="small"
                style={
                  record.isLock === true
                    ? { backgroundColor: '#ffd2e5' }
                    : { backgroundColor: '#d7e6fa' }
                }
              />
              <ButtonCustom
                title={'Sửa'}
                icon={<EditOutlined />}
                handleClick={() => handleClickEdit(record)}
                size="small"
              />
              <Popconfirm
                placement="topRight"
                title="Bạn có chắc chắn muốn xóa người dùng này?"
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
          )),
    },
  ];

  return (
    <div>
      <Title level={3} className="uppercase text-center" style={{ marginBottom: 0 }}>
        Danh sách người dùng
      </Title>
      <div className="flex justify-between mb-2">
        <p className="my-auto">Tổng số kết quả: {total}</p>
        <Space>
          {roleId !== 'LECTURER' && (
            <>
              <QuestionCircleOutlined
                title="Bấm để xem file mẫu import"
                className="hover:cursor-pointer hover:text-primary"
                onClick={() => setOpenModalError(true)}
              />
              <Upload {...props}>
                <ButtonCustom
                  title="Thêm danh sách người dùng"
                  icon={<UploadOutlined />}
                  loading={importUserList.isPending}
                />
              </Upload>
              <ButtonCustom
                title="Danh sách trình độ"
                handleClick={() => setOpenDrawer(true)}
                icon={<TableOutlined />}
              />
              <Button
                icon={<PlusOutlined />}
                onClick={() => {
                  setOpenModalFormUser(true);
                  setFormCreate(true);
                }}
                className="flex justify-center items-center text-md font-medium shadow-md bg-slate-100"
              >
                Thêm người dùng
              </Button>
            </>
          )}
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

      <div className="relative">
        <Table
          scroll={{
            y: '64vh',
            x: 2100,
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
            //   showSizeChanger: true,
          }}
        />
        {dataSource.length > 0 && (
          <div className="absolute bottom-5 left-0">
            <ButtonCustom
              title="Xuất danh sách người dùng"
              loading={exportUserToExcel.isPending}
              handleClick={() => {
                exportUserToExcel.mutate();
              }}
              icon={<DownloadOutlined />}
            />
          </div>
        )}
      </div>
      <Drawer
        extra={<h1 className="ml-[-100%] font-medium text-xl">Danh sách trình độ</h1>}
        placement="right"
        open={openDrawer}
        width={600}
        maskClosable={true}
        onClose={() => setOpenDrawer(false)}
      >
        <ManageDegree open={openDrawer} />
      </Drawer>
      <ModalErrorImportUser open={openModalError} setOpen={(open) => setOpenModalError(open)} />
    </div>
  );
}

export default ManageUser;
