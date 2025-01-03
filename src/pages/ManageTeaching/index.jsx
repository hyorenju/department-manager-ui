import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  FileDoneOutlined,
  LockFilled,
  LockOutlined,
  MutedFilled,
  MutedOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SaveOutlined,
  SearchOutlined,
  SoundFilled,
  SoundOutlined,
  SwapOutlined,
  UnlockOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import {
  Button,
  Input,
  message,
  Popconfirm,
  Popover,
  Select,
  Space,
  Table,
  Tooltip,
  Typography,
  Upload,
} from 'antd';
import React, { useEffect, useState } from 'react';
import {
  deleteTeaching,
  getDepartmentSelection,
  getFacultySelection,
  getMasterDataSelection,
  getTeachingList,
  getUserSelection,
  lockTeaching,
  warnTeaching,
} from '../../api/axios';
import { excelApi } from '../../api/excelApi';
import { promiseApi } from '../../api/promiseApi';
import { ButtonCustom } from '../../components/ButtonCustom';
import { messageErrorToSever } from '../../components/Message';
import { notificationError, notificationSuccess } from '../../components/Notification';
import { ModalErrorImportTeaching } from './components/ModalErrorImportTeaching';
import { ModalFormTeaching } from './components/ModalFormTeaching';
import { ModalFormLockTeaching } from './components/ModalFormLockTeaching';

function ManageTeaching() {
  const roleId = JSON.parse(localStorage.getItem('user_role'));
  const userInfo = JSON.parse(localStorage.getItem('user_info'));
  const { Title } = Typography;
  const [loadingTable, setLoadingTable] = useState(false);
  const [openModalFormTeaching, setOpenModalFormTeaching] = useState(false);
  const [openModalFormLockTeachingList, setOpenModalFormLockTeachingList] = useState(false);
  const [teachingData, setTeachingData] = useState({});
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [size, setSize] = useState(10);
  const [dataSource, setDataSource] = useState([]);
  const [formCreate, setFormCreate] = useState(true);
  const [openModalError, setOpenModalError] = useState(false);

  const [schoolYearId, setSchoolYearId] = useState(null);
  const [term, setTerm] = useState();
  const [status, setStatus] = useState();
  const [facultyId, setFacultyId] = useState();
  const [departmentId, setDepartmentId] = useState();
  const [searchSubjectName, setSearchSubjectName] = useState();
  const [searchSubjectId, setSearchSubjectId] = useState();
  const [subjectName, setSubjectName] = useState();
  const [subjectId, setSubjectId] = useState();
  const [teacherId, setTeacherId] = useState();
  const [classId, setClassId] = useState();
  const [teacherIdToRead, setTeacherIdToRead] = useState(null);
  const [isAll, setIsAll] = useState(false);
  const [valueSearchNote, setValueSearchNote] = useState();
  const [searchNote, setSearchNote] = useState();

  // handle delete teaching
  const handleConfirmDeleteTeaching = (id) => {
    setLoadingTable(true);
    deleteTeaching(id)
      .then((res) => {
        if (res.data?.success === true) {
          notificationSuccess('Xóa thành công');
          handleGetTeachingList();
        } else {
          notificationError(res.data?.error?.message);
        }
      })
      .finally(() => setLoadingTable(false));
  };

  // handle get teaching list
  const handleGetTeachingList = () => {
    setLoadingTable(true);
    getTeachingList({
      page: page,
      size: size,
      isAll: isAll,
      schoolYear: schoolYearId,
      term: term,
      facultyId: facultyId,
      departmentId: departmentId,
      subjectId: subjectId,
      subjectName: subjectName,
      teacherId: teacherId,
      classId: classId,
      status: status,
      note: searchNote,
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

  const handleLockTeaching = (id) => {
    setLoadingTable(true);
    lockTeaching(id)
      .then((res) => {
        if (res.data?.success) {
          message.success('Thành công');
          handleGetTeachingList();
        } else {
          message.error(res.data?.error?.message);
        }
      })
      .finally(() => setLoadingTable(false));
  };

  const handleWarnTeaching = (id) => {
    setLoadingTable(true);
    warnTeaching(id)
      .then((res) => {
        if (res.data?.success) {
          message.success('Thành công');
          handleGetTeachingList();
        } else {
          message.error(res.data?.error?.message);
        }
      })
      .finally(() => setLoadingTable(false));
  };

  const handleClickEdit = (record) => {
    setTeachingData(record);
    setOpenModalFormTeaching(true);
    setFormCreate(false);
  };

  const readDataFromDaoTao = useMutation({
    mutationKey: ['readFromDaoTao'],
    mutationFn: () => promiseApi.readFromDaoTao(teacherIdToRead),
    onSuccess: (res) => {
      if (res.success === true) {
        notificationSuccess('Đọc thành công, dữ liệu đã được thêm vào hệ thống');
        setTeacherIdToRead(null);
        handleGetTeachingList();
      } else {
        notificationError(res.error?.message);
      }
    },
  });

  useEffect(() => {
    handleGetTeachingList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    size,
    isAll,
    schoolYearId,
    term,
    facultyId,
    departmentId,
    subjectId,
    subjectName,
    teacherId,
    classId,
    status,
    searchNote,
  ]);

  const [schoolYearSelection, setSchoolYearSelection] = useState([]);
  useEffect(() => {
    getMasterDataSelection({ type: 'SCHOOL_YEAR' }).then((res) => {
      if (res.data?.success) {
        const newArr = [];
        res.data?.data?.items?.map((item) => newArr.push({ label: item?.name, value: item?.id }));
        setSchoolYearSelection(newArr);
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
    getDepartmentSelection({ facultyId: facultyId }).then((res) => {
      if (res.data?.success) {
        const newArr = [];
        res.data?.data?.items?.map((item) => newArr.push({ label: item?.name, value: item?.id }));
        setDepartmentSelection(newArr);
      }
    });
  }, [facultyId]);

  const [teacherSelection, setTeacherSelection] = useState([]);
  useEffect(() => {
    getUserSelection({ facultyId, departmentId }).then((res) => {
      if (res.data?.success) {
        const newArr = [];
        res.data?.data?.items?.map((item) =>
          newArr.push({
            label: `${item?.id} - ${item?.firstName} ${item?.lastName}`,
            value: item?.id,
          }),
        );
        setTeacherSelection(newArr);
      }
    });
  }, [facultyId, departmentId]);

  // Export teaching list to excel
  const exportTeachingToExcel = useMutation({
    mutationKey: ['exportTeachingList'],
    mutationFn: () =>
      excelApi.exportTeachingList({
        isAll: isAll,
        schoolYear: schoolYearId,
        term: term,
        facultyId: facultyId,
        departmentId: departmentId,
        subjectName: subjectName,
        status: status,
        note: searchNote,
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

  const importTeachingList = useMutation({
    mutationKey: ['importTeachingList'],
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append('file', file.file);
      return excelApi.importTeachingList(formData);
    },
    onSuccess: (res) => {
      if (res && res.success === true) {
        setIsAll(true);
        notificationSuccess('Upload file thành công');
        handleGetTeachingList();
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

  const props = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    customRequest: (file) => importTeachingList.mutate(file),
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

  const handleSetIsAll = () => {
    if (isAll) {
      setIsAll(false);
      setSchoolYearId(null);
      setTerm(null);
      setStatus(null);
      setFacultyId(null);
      setDepartmentId(null);
      setSearchSubjectName(null);
      setSearchSubjectId(null);
      setSubjectName(null);
      setSubjectId(null);
      setTeacherId(null);
      setTeacherIdToRead(null);
    } else {
      setIsAll(true);
      setSchoolYearId(null);
      setTerm(null);
      setStatus(null);
      setFacultyId(null);
      setDepartmentId(null);
      setSearchSubjectName(null);
      setSearchSubjectId(null);
      setSubjectName(null);
      setSubjectId(null);
      setTeacherId(null);
      setTeacherIdToRead(null);
    }
  };

  const columns = [
    {
      title: 'Năm học',
      dataIndex: ['schoolYear', 'name'],
      align: 'left',
      width: '3.5%',
      filterDropdown: () => (
        <div className="p-3 flex flex-col gap-2 w-[170px]">
          <Select
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            value={schoolYearId}
            options={schoolYearSelection}
            placeholder="Chọn năm học"
            onChange={(schoolYearId) => {
              setPage(1);
              setSchoolYearId(schoolYearId);
            }}
          />
          <Space>
            <ButtonCustom handleClick={() => setSchoolYearId(null)} size="small" title={'Reset'} />
          </Space>
        </div>
      ),
      filterIcon: () => (
        <Tooltip title="Tìm kiếm theo năm học">
          <SearchOutlined className={`${schoolYearId ? 'text-blue-500' : undefined} text-base`} />
        </Tooltip>
      ),
    },
    {
      title: 'HK',
      dataIndex: 'term',
      align: 'left',
      width: '2%',
      filterDropdown: () => (
        <div className="p-3 flex flex-col gap-2 w-[150px]">
          <Select
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            value={term}
            options={[
              {
                label: 'Học kỳ 1',
                value: 1,
              },
              {
                label: 'Học kỳ 2',
                value: 2,
              },
              {
                label: 'Học kỳ 3',
                value: 3,
              },
            ]}
            placeholder="Chọn học kỳ"
            onChange={(term) => {
              setPage(1);
              setTerm(term);
            }}
          />
          <Space>
            <ButtonCustom handleClick={() => setTerm(null)} size="small" title={'Reset'} />
          </Space>
        </div>
      ),
      filterIcon: () => (
        <Tooltip title="Tìm kiếm theo học kỳ">
          <SearchOutlined className={`${term ? 'text-blue-500' : undefined} text-base`} />
        </Tooltip>
      ),
    },
    // {
    //   title: 'Khoa',
    //   dataIndex: ['teacher', 'department', 'faculty', 'name'],
    //   align: 'left',
    //   width: '8.5%',
    //   filterDropdown:
    //     isAll &&
    //     (() => (
    //       <div className="p-3 flex flex-col gap-2 w-[280px]">
    //         <Select
    //           showSearch
    //           filterOption={(input, option) =>
    //             (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
    //           }
    //           value={facultyId}
    //           options={facultySelection}
    //           placeholder="Chọn khoa"
    //           onChange={(searchFacultyId) => setFacultyId(searchFacultyId)}
    //         />
    //         <Space>
    //           <ButtonCustom
    //             handleClick={() => {
    //               setFacultyId(null);
    //               // setSearchFacultyId(null);
    //             }}
    //             size="small"
    //             title={'Reset'}
    //           />
    //         </Space>
    //       </div>
    //     )),
    //   filterIcon: () => (
    //     <Tooltip title="Tìm kiếm theo khoa">
    //       <SearchOutlined className={`${facultyId ? 'text-blue-500' : undefined} text-base`} />
    //     </Tooltip>
    //   ),
    // },
    {
      title: 'Bộ môn',
      dataIndex: ['teacher', 'department', 'name'],
      align: 'left',
      width: '7.5%',
      filterDropdown:
        isAll &&
        (() => (
          <div className="p-3 flex flex-col gap-2 w-[280px]">
            <Select
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              value={departmentId}
              options={departmentSelection}
              placeholder="Chọn bộ môn"
              onChange={(departmentId) => {
                setPage(1);
                setDepartmentId(departmentId);
              }}
            />
            <Space>
              <ButtonCustom
                handleClick={() => setDepartmentId(null)}
                size="small"
                title={'Reset'}
              />
            </Space>
          </div>
        )),
      filterIcon: () => (
        <Tooltip title="Tìm kiếm theo bộ môn">
          <SearchOutlined className={`${departmentId ? 'text-blue-500' : undefined} text-base`} />
        </Tooltip>
      ),
    },
    {
      title: 'Mã môn',
      dataIndex: ['subject', 'id'],
      align: 'left',
      width: '4%',
      filterDropdown: () => (
        <div className="p-3">
          <Input
            placeholder={'Nhập mã môn học'}
            value={searchSubjectId}
            onChange={(e) => setSearchSubjectId(e.target.value)}
            className="w-[170px] mb-2 block"
            onPressEnter={(e) => {
              setPage(1);
              setSubjectId(e.target.value);
            }}
          />
          <Space>
            <ButtonCustom
              handleClick={() => {
                setSubjectId(null);
                setSearchSubjectId(null);
              }}
              size="small"
              title={'Reset'}
            />
          </Space>
        </div>
      ),
      filterIcon: () => (
        <Tooltip title="Tìm kiếm theo mã môn học">
          <SearchOutlined
            className={`${subjectId ? 'text-blue-500' : undefined} text-md p-1 text-base`}
          />
        </Tooltip>
      ),
    },
    {
      title: 'Tên môn giảng dạy',
      dataIndex: ['subject', 'name'],
      align: 'left',
      fixed: 'left',
      width: '9%',
      filterDropdown: () => (
        <div className="p-3">
          <Input
            placeholder={'Nhập tên môn học'}
            value={searchSubjectName}
            onChange={(e) => setSearchSubjectName(e.target.value)}
            className="w-[230px] mb-2 block"
            onPressEnter={(e) => {
              setPage(1);
              setSubjectName(e.target.value);
            }}
          />
          <Space>
            <ButtonCustom
              handleClick={() => {
                setSubjectName(null);
                setSearchSubjectName(null);
              }}
              size="small"
              title={'Reset'}
            />
          </Space>
        </div>
      ),
      filterIcon: () => (
        <Tooltip title="Tìm kiếm theo tên môn giảng dạy">
          <SearchOutlined
            className={`${subjectName ? 'text-blue-500' : undefined} text-md p-1 text-base`}
          />
        </Tooltip>
      ),
    },
    {
      title: 'Giảng viên',
      render: (e, record, index) => (
        <>
          <p>
            {record?.teacher?.id} {record.teacher ? '-' : null} {record?.teacher?.firstName}{' '}
            {record?.teacher?.lastName}
          </p>
        </>
      ),
      align: 'left',
      width: '7%',
      filterDropdown:
        isAll &&
        (() => (
          <div className="p-3 flex flex-col gap-2 w-[300px]">
            <Select
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              value={teacherId}
              options={teacherSelection}
              placeholder="Tìm giảng viên"
              onChange={(teacherId) => {
                setPage(1);
                setTeacherId(teacherId);
              }}
            />
            <Space>
              <ButtonCustom handleClick={() => setTeacherId(null)} size="small" title={'Reset'} />
            </Space>
          </div>
        )),
      filterIcon: () => (
        <Tooltip title="Tìm kiếm theo giáo viên">
          <SearchOutlined className={`${teacherId ? 'text-blue-500' : undefined} text-base`} />
        </Tooltip>
      ),
    },
    {
      title: 'Mã lớp',
      dataIndex: 'classId',
      align: 'left',
      width: '4.5%',
    },
    {
      title: 'NMH',
      dataIndex: 'teachingGroup',
      align: 'left',
      width: '2.5%',
    },
    {
      title: 'File thành phần',
      render: (record) => (
        <>
          <a href={record?.componentFile} target="_blank" rel="noopener noreferrer">
            {record?.componentFile ? 'Bấm để xem' : null}
          </a>
        </>
      ),
      align: 'left',
      width: '4.5%',
    },
    {
      title: 'File tổng kết',
      render: (record) => (
        <>
          <a href={record?.summaryFile} target="_blank" rel="noopener noreferrer">
            {record?.summaryFile ? 'Bấm để xem' : null}
          </a>
        </>
      ),
      align: 'left',
      width: '4%',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      align: 'left',
      width: '4.5%',
      filterDropdown: () => (
        <div className="p-3 flex flex-col gap-2 w-[180px]">
          <Select
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            value={status}
            options={[
              {
                label: 'Chưa hoàn thiện',
                value: 'Chưa hoàn thiện',
              },
              {
                label: 'Đã hoàn thiện',
                value: 'Đã hoàn thiện',
              },
            ]}
            placeholder="Chọn trạng thái"
            onChange={(status) => {
              setPage(1);
              setStatus(status);
            }}
          />
          <Space>
            <ButtonCustom handleClick={() => setStatus(null)} size="small" title={'Reset'} />
          </Space>
        </div>
      ),
      filterIcon: () => (
        <Tooltip title="Tìm kiếm theo GV hướng dẫn">
          <SearchOutlined className={`${status ? 'text-blue-500' : undefined} text-base`} />
        </Tooltip>
      ),
    },
    // {
    //   title: 'Hạn nộp điểm',
    //   dataIndex: 'deadline',
    //   align: 'left',
    //   width: '4%',
    // },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      align: 'left',
      width: '5.5%',
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
      width: '8%',
    },
    {
      title: 'Chỉnh sửa lần cuối',
      dataIndex: 'modifiedAt',
      align: 'left',
      width: '5.5%',
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
      width: '8%',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      align: 'left',
      filterDropdown: () => (
        <div className="p-3">
          <Input
            placeholder={'Nhập ghi chú'}
            value={valueSearchNote}
            onChange={(e) => setValueSearchNote(e.target.value)}
            className="w-[580px] mb-2 block"
            onPressEnter={(e) => {
              setPage(1);
              setSearchNote(e.target.value);
            }}
          />
          <Space>
            <ButtonCustom
              handleClick={() => {
                setSearchNote(null);
                setValueSearchNote(null);
              }}
              size="small"
              title={'Reset'}
            />
          </Space>
        </div>
      ),
      filterIcon: () => (
        <Tooltip title="Tìm kiếm theo ghi chú">
          <SearchOutlined
            className={`${searchNote ? 'text-blue-500' : undefined} text-md p-1 text-base`}
          />
        </Tooltip>
      ),
    },
    {
      // title: roleId !== 'LECTURER' ? 'Tùy chọn' : '',
      title: isAll & (roleId === 'LECTURER') ? '' : 'Tùy chọn',
      align: 'center',
      fixed: 'right',
      // width: roleId !== 'LECTURER' ? '5%' : '0',
      width: isAll & (roleId === 'LECTURER') ? '0' : '2.5%',
      render:
        (!isAll || roleId !== 'LECTURER') &&
        ((e, record, index) =>
          userInfo.department?.id === record.teacher?.department?.id && (
            <Button.Group key={index}>
              {/* <Button
              icon={
                record.isWarning === true ? (
                  <SoundFilled className="text-green-800" />
                ) : (
                  <MutedFilled className="text-rose-700" />
                )
              }
              onClick={() => {
                handleWarnTeaching(record.id);
              }}
              size="small"
              className={record.isWarning === true ? 'bg-green-50' : 'bg-yellow-100'}
            /> */}
              {roleId !== 'LECTURER' && (
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
                  onClick={() => handleLockTeaching(record.id)}
                  size="small"
                  style={
                    record.isLock === true
                      ? { backgroundColor: '#ffd2e5' }
                      : { backgroundColor: '#d7e6fa' }
                  }
                />
              )}
              <ButtonCustom
                icon={<EditOutlined />}
                handleClick={() => handleClickEdit(record)}
                size="small"
                disabled={record.isLock}
              />
              <Popconfirm
                placement="topRight"
                title="Bạn có chắc chắn muốn xóa bản ghi này?"
                icon={<DeleteOutlined />}
                okText="Xóa"
                okType="danger"
                onConfirm={() => handleConfirmDeleteTeaching(record.id)}
              >
                <Button
                  className="flex justify-center items-center text-md shadow-md"
                  icon={<DeleteOutlined />}
                  size="small"
                  danger
                  disabled={record.isLock}
                ></Button>
              </Popconfirm>
            </Button.Group>
          )),
    },
  ];

  return (
    <div>
      <Title level={3} className="uppercase text-center" style={{ marginBottom: 4 }}>
        Quản lý giảng dạy và điểm
      </Title>
      <div className="flex justify-between mb-2">
        <div className="flex">
          <ButtonCustom
            title={isAll ? 'Chuyển về chế độ xem cá nhân' : 'Chuyển sang chế độ xem tất cả'}
            handleClick={() => handleSetIsAll()}
            icon={<SwapOutlined />}
          />
          <p className="my-auto ml-3">Tổng số kết quả: {total}</p>
        </div>
        <Space>
          {/* {roleId !== 'LECTURER' && ( */}
          <>
            <QuestionCircleOutlined
              title="Bấm để xem file mẫu import"
              className="hover:cursor-pointer hover:text-primary"
              onClick={() => setOpenModalError(true)}
            />
            <Upload {...props}>
              <ButtonCustom
                title="Thêm danh sách bản ghi"
                icon={<UploadOutlined />}
                loading={importTeachingList.isPending}
              />
            </Upload>
            <Popover
              placement="bottom"
              content={
                <div className="flex justify-between w-[300px]">
                  <p className="font-bold text-red-600 text-lg">Tính năng này đang bảo trì</p>
                  {/* <Input
                    title="Mã giảng viên"
                    placeholder={'Nhập mã giảng viên'}
                    value={teacherIdToRead}
                    onChange={(e) => {
                      setTeacherIdToRead(e.target.value);
                    }}
                    className="w-[170px] mb-2 block"
                  />
                  <Button
                    icon={<SaveOutlined />}
                    style={{ marginRight: 0 }}
                    onClick={() => {
                      readDataFromDaoTao.mutate();
                    }}
                    loading={readDataFromDaoTao.isPending}
                    disabled={teacherIdToRead === null}
                  >
                    Tìm và lưu
                  </Button> */}
                </div>
              }
              trigger={'click'}
            >
              <Button
                icon={<FileDoneOutlined />}
                className="flex justify-center items-center text-md font-medium shadow-md bg-slate-100"
              >
                Đọc từ trang đào tạo
              </Button>
            </Popover>
            {roleId !== 'LECTURER' && (
              <ButtonCustom
                title="Tùy chọn lock"
                handleClick={() => setOpenModalFormLockTeachingList(true)}
                icon={<LockFilled />}
              />
            )}
            <Button
              icon={<PlusOutlined />}
              onClick={() => {
                setOpenModalFormTeaching(true);
                setFormCreate(true);
              }}
              className="flex justify-center items-center text-md font-medium shadow-md bg-slate-100"
            >
              Thêm bản ghi
            </Button>
          </>
          {/* )} */}
        </Space>
      </div>
      <ModalFormTeaching
        isCreate={formCreate}
        onSuccess={() => {
          handleGetTeachingList();
          setOpenModalFormTeaching(false);
        }}
        teachingData={teachingData}
        openForm={openModalFormTeaching}
        onChangeClickOpen={(open) => {
          if (!open) {
            setTeachingData({});
            setOpenModalFormTeaching(false);
          }
        }}
      />
      <ModalFormLockTeaching
        onSuccess={() => {
          handleGetTeachingList();
          setOpenModalFormLockTeachingList(false);
        }}
        openForm={openModalFormLockTeachingList}
        onChangeClickOpen={(open) => {
          if (!open) {
            setOpenModalFormLockTeachingList(false);
          }
        }}
      />

      <div className="relative">
        <Table
          scroll={{
            y: '64vh',
            x: 3400,
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
              title="Xuất danh sách giảng dạy"
              loading={exportTeachingToExcel.isPending}
              handleClick={() => {
                exportTeachingToExcel.mutate();
              }}
              icon={<DownloadOutlined />}
            />
          </div>
        )}
      </div>
      <ModalErrorImportTeaching open={openModalError} setOpen={(open) => setOpenModalError(open)} />
    </div>
  );
}

export default ManageTeaching;
