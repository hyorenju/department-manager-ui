import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  UserAddOutlined,
  DownloadOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  UploadOutlined,
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
  Upload,
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
import { ModalErrorImportSubject } from './components/ModalErrorImportSubject';

function ManageSubject() {
  const roleId = JSON.parse(localStorage.getItem('user_role'));
  const userInfo = JSON.parse(localStorage.getItem('user_info'));
  const { Title } = Typography;
  const [loadingTable, setLoadingTable] = useState(false);
  const [openModalFormSubject, setOpenModalFormSubject] = useState(false);
  const [openModalError, setOpenModalError] = useState(false);
  const [subjectData, setSubjectData] = useState({});
  const [valueSearchSubject, setValueSearchSubject] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [size, setSize] = useState(10);
  const [dataSource, setDataSource] = useState([]);
  const [formCreate, setFormCreate] = useState(true);
  const [searchId, setSearchId] = useState(null);
  const [searchName, setSearchName] = useState(null);

  const [searchFacultyId, setSearchFacultyId] = useState(null);
  const [searchDepartmentId, setSearchDepartmentId] = useState(userInfo.department?.id);
  const [id, setId] = useState(null);
  const [name, setName] = useState(null);

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
  const handleGetSubjectList = () => {
    setLoadingTable(true);
    getSubjectList({
      page: page,
      size: size,
      id,
      name,
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

  const importSubjectList = useMutation({
    mutationKey: ['importSubjectList'],
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append('file', file.file);
      return excelApi.importSubjectList(formData);
    },
    onSuccess: (res) => {
      if (res && res.success === true) {
        notificationSuccess('Upload file thành công');
        handleGetSubjectList();
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
            'Upload file thất bại. Hãy làm theo đúng form excel chúng tôi đã gửi cho bạn. (Hãy chắc chắn rằng trình duyệt của bạn không chặn tự động mở tab mới)',
          );
        }
      }
    },
  });

  const handleClickEdit = (record) => {
    setSubjectData(record);
    setFormCreate(false);
    setOpenModalFormSubject(true);
  };

  useEffect(() => {
    return handleGetSubjectList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, id, name, searchDepartmentId, searchFacultyId]);

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
        id,
        name,
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

  const props = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    customRequest: (file) => importSubjectList.mutate(file),
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
      title: 'Mã môn học',
      dataIndex: 'id',
      align: 'left',
      width: '5%',
      filterDropdown: () => (
        <div className="p-3">
          <Input
            placeholder={'Nhập mã môn học'}
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-[150px] mb-2 block"
            onPressEnter={(e) => {
              setPage(1);
              setId(e.target.value);
            }}
          />
          <Space>
            <ButtonCustom
              handleClick={() => {
                setId(null);
                setSearchId(null);
              }}
              size="small"
              title={'Reset'}
            />
          </Space>
        </div>
      ),
      filterIcon: () => (
        <Tooltip title="Tìm kiếm theo mã môn học">
          <SearchOutlined className={`${id ? 'text-blue-500' : undefined} text-md p-1 text-base`} />
        </Tooltip>
      ),
    },
    {
      title: 'Tên môn học',
      dataIndex: 'name',
      align: 'left',
      fixed: 'left',
      width: '10%',
      filterDropdown: () => (
        <div className="p-3">
          <Input
            placeholder={'Nhập tên môn học'}
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-[240px] mb-2 block"
            onPressEnter={(e) => {
              setPage(1);
              setName(e.target.value);
            }}
          />
          <Space>
            <ButtonCustom
              handleClick={() => {
                setName(null);
                setSearchName(null);
              }}
              size="small"
              title={'Reset'}
            />
          </Space>
        </div>
      ),
      filterIcon: () => (
        <Tooltip title="Tìm kiếm theo tên môn học">
          <SearchOutlined
            className={`${name ? 'text-blue-500' : undefined} text-md p-1 text-base`}
          />
        </Tooltip>
      ),
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
      width: roleId !== 'LECTURER' ? '3%' : '0',
      render:
        roleId !== 'LECTURER' &&
        ((e, record, index) =>
          (roleId === 'MANAGER' || roleId === 'DEPUTY' || roleId === 'PRINCIPAL') &&
          userInfo.department?.id === record.department?.id && (
            <Button.Group key={index}>
              <ButtonCustom
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
                ></Button>
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
          {/* <Tooltip className="flex" title="Tìm kiếm môn học">
            <Input
              prefix={<SearchOutlined className="opacity-60 mr-1" />}
              placeholder="Nhập từ khóa"
              className="shadow-sm w-[230px] h-9 my-auto"
              onChange={(e) => setValueSearchSubject(e.target.value)}
              value={valueSearchSubject}
            />
          </Tooltip> */}
          <p className="my-auto ml-2">Tổng số kết quả: {total}</p>
        </div>
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
                  title="Thêm danh sách môn học"
                  icon={<UploadOutlined />}
                  loading={importSubjectList.isPending}
                />
              </Upload>
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
            </>
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
      <ModalErrorImportSubject open={openModalError} setOpen={(open) => setOpenModalError(open)} />
    </div>
  );
}

export default ManageSubject;
