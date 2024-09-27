import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Button, Input, Popconfirm, Select, Space, Table, Tooltip, Typography, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { deleteClass, getClassList, getFacultySelection } from '../../api/axios';
import { excelApi } from '../../api/excelApi';
import { ButtonCustom } from '../../components/ButtonCustom';
import { messageErrorToSever } from '../../components/Message';
import { notificationError, notificationSuccess } from '../../components/Notification';
import { ModalErrorImportClass } from './components/ModalErrorImportUser';
import { ModalFormClass } from './components/ModalFormClass';

function ManageClass() {
  const roleId = JSON.parse(sessionStorage.getItem('user_role'));
  const { Title } = Typography;
  const [loadingTable, setLoadingTable] = useState(false);
  const [openModalFormClass, setOpenModalFormClass] = useState(false);
  const [openModalError, setOpenModalError] = useState(false);
  const [classData, setClassData] = useState({});
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [size, setSize] = useState(10);
  const [dataSource, setDataSource] = useState([]);
  const [formCreate, setFormCreate] = useState(true);
  const [facultySelection, setFacultySelection] = useState([]);
  const [facultyId, setFacultyId] = useState('');
  const [classId, setClassId] = useState('');
  const [className, setClassName] = useState('');
  const [homeroomTeacher, setHomeroomTeacher] = useState('');
  const [monitor, setMonitor] = useState('');

  const [classIdSearch, setClassIdSearch] = useState('');
  const [classNameSearch, setClassNameSearch] = useState('');
  const [homeroomTeacherSearch, setHomeroomTeacherSearch] = useState('');
  const [monitorSearch, setMonitorSearch] = useState('');

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
  // const debunceValue = useDebounce(valueSearchClass, 750);
  // const keyword = debunceValue[0];
  const handleGetClassList = () => {
    setLoadingTable(true);
    getClassList({
      page: page,
      size: size,
      // keyword: keyword,
      facultyId: facultyId,
      id: classId,
      name: className,
      hrTeacher: homeroomTeacher,
      monitor: monitor,
    })
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
  }, [page, size, facultyId, classId, className, homeroomTeacher, monitor]);

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
        // keyword: keyword,
        facultyId: facultyId,
        id: classId,
        name: className,
        hrTeacher: homeroomTeacher,
        monitor: monitor,
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

  const importClassList = useMutation({
    mutationKey: ['importClassList'],
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append('file', file.file);
      return excelApi.importClassList(formData);
    },
    onSuccess: (res) => {
      if (res && res.success === true) {
        notificationSuccess('Upload file thành công');
        handleGetClassList();
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
    customRequest: (file) => importClassList.mutate(file),
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
      title: 'Mã lớp',
      dataIndex: 'id',
      align: 'left',
      fixed: 'left',
      width: '5%',
      filterDropdown: () => (
        <div className="p-3">
          <Input
            placeholder={'Nhập mã lớp'}
            value={classIdSearch}
            onChange={(e) => setClassIdSearch(e.target.value)}
            className="w-[180px] mb-2 block"
            onPressEnter={(e) => {
              setClassId(e.target.value);
            }}
          />
          <Space>
            <ButtonCustom
              handleClick={() => {
                setClassId(null);
                setClassIdSearch(null);
              }}
              size="small"
              title={'Reset'}
            />
          </Space>
        </div>
      ),
      filterIcon: () => (
        <Tooltip title="Tìm kiếm theo mã lớp">
          <SearchOutlined
            className={`${classId ? 'text-blue-500' : undefined} text-md p-1 text-base`}
          />
        </Tooltip>
      ),
    },
    {
      title: 'Tên lớp',
      dataIndex: 'name',
      align: 'left',
      width: '9%',
      filterDropdown: () => (
        <div className="p-3">
          <Input
            placeholder={'Nhập tên lớp'}
            value={classNameSearch}
            onChange={(e) => setClassNameSearch(e.target.value)}
            className="w-[240px] mb-2 block"
            onPressEnter={(e) => {
              setClassName(e.target.value);
            }}
          />
          <Space>
            <ButtonCustom
              handleClick={() => {
                setClassName(null);
                setClassNameSearch(null);
              }}
              size="small"
              title={'Reset'}
            />
          </Space>
        </div>
      ),
      filterIcon: () => (
        <Tooltip title="Tìm kiếm theo tên lớp">
          <SearchOutlined
            className={`${className ? 'text-blue-500' : undefined} text-md p-1 text-base`}
          />
        </Tooltip>
      ),
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
      filterDropdown: () => (
        <div className="p-3">
          <Input
            placeholder={'Nhập thông tin gvcn'}
            value={homeroomTeacherSearch}
            onChange={(e) => setHomeroomTeacherSearch(e.target.value)}
            className="w-[240px] mb-2 block"
            onPressEnter={(e) => {
              setHomeroomTeacher(e.target.value);
            }}
          />
          <Space>
            <ButtonCustom
              handleClick={() => {
                setHomeroomTeacher(null);
                setHomeroomTeacherSearch(null);
              }}
              size="small"
              title={'Reset'}
            />
          </Space>
        </div>
      ),
      filterIcon: () => (
        <Tooltip title="Tìm kiếm theo thông tin gvcn">
          <SearchOutlined
            className={`${homeroomTeacher ? 'text-blue-500' : undefined} text-md p-1 text-base`}
          />
        </Tooltip>
      ),
    },
    {
      title: 'Lớp trưởng',
      dataIndex: 'monitor',
      align: 'left',
      width: '8%',
      filterDropdown: () => (
        <div className="p-3">
          <Input
            placeholder={'Nhập thông tin lớp trưởng'}
            value={monitorSearch}
            onChange={(e) => setMonitorSearch(e.target.value)}
            className="w-[240px] mb-2 block"
            onPressEnter={(e) => {
              setMonitor(e.target.value);
            }}
          />
          <Space>
            <ButtonCustom
              handleClick={() => {
                setMonitor(null);
                setMonitorSearch(null);
              }}
              size="small"
              title={'Reset'}
            />
          </Space>
        </div>
      ),
      filterIcon: () => (
        <Tooltip title="Tìm kiếm theo thông tin lớp trưởng">
          <SearchOutlined
            className={`${monitor ? 'text-blue-500' : undefined} text-md p-1 text-base`}
          />
        </Tooltip>
      ),
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
              placement="topRight"
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
          {/* <Tooltip className="flex" title="Tìm kiếm lớp">
            <Input
              prefix={<SearchOutlined className="opacity-60 mr-1" />}
              placeholder="Nhập từ khóa"
              className="shadow-sm w-[230px] h-9 my-auto"
              onChange={(e) => setValueSearchClass(e.target.value)}
              value={valueSearchClass}
            />
          </Tooltip> */}
          <p className="my-auto ml-2">Tổng số kết quả: {total}</p>
        </div>
        <Space>
          {roleId !== 'LECTURER' && (
            <>
              <Upload {...props}>
                <ButtonCustom
                  title="Thêm danh sách lớp"
                  icon={<UploadOutlined />}
                  loading={importClassList.isPending}
                />
              </Upload>
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
            </>
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
          // bordered={true}
          dataSource={dataSource}
          // size="small"
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

      <ModalErrorImportClass open={openModalError} setOpen={(open) => setOpenModalError(open)} />
    </div>
  );
}

export default ManageClass;
