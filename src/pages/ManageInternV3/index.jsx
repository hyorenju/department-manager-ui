import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  UserAddOutlined,
  DownloadOutlined,
  PlusOutlined,
  TableOutlined,
  QuestionCircleOutlined,
  UploadOutlined,
  SwapOutlined,
  UnlockOutlined,
  LockOutlined,
  LockFilled,
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
  Drawer,
  Upload,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import {
  getInternshipList,
  deleteInternship,
  getMasterDataSelection,
  getUserSelection,
  getFacultySelection,
  getDepartmentSelection,
  lockInternship,
} from '../../api/axios';
import { excelApi } from '../../api/excelApi';
import { notificationError, notificationSuccess } from '../../components/Notification';
import { messageErrorToSever } from '../../components/Message';
import { ButtonCustom } from '../../components/ButtonCustom';
import { ModalFormIntern } from './components/ModalFormIntern';
import { useMutation } from '@tanstack/react-query';
import { ManageInternType } from './pages/ManageInternType';
import { ModalErrorImportIntern } from './components/ModalErrorImportIntern';
import { ModalFormLockInternship } from './components/ModalFormLockInternship';

function ManageIntern() {
  const roleId = JSON.parse(localStorage.getItem('user_role'));
  const userInfo = JSON.parse(localStorage.getItem('user_info'));
  const { Title } = Typography;
  const [loadingTable, setLoadingTable] = useState(false);
  const [openModalFormIntern, setOpenModalFormIntern] = useState(false);
  const [openModalFormLockInternshipList, setOpenModalFormLockInternshipList] = useState(false);
  const [internData, setInternData] = useState({});
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [size, setSize] = useState(10);
  const [dataSource, setDataSource] = useState([]);
  const [formCreate, setFormCreate] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openModalError, setOpenModalError] = useState(false);

  const [valueSearchName, setValueSearchName] = useState();
  const [searchName, setSearchName] = useState();
  const [schoolYearId, setSchoolYearId] = useState(null);
  const [term, setTerm] = useState();
  const [instructorId, setInstructorId] = useState();
  const [typeId, setTypeId] = useState();
  const [status, setStatus] = useState();
  const [facultyId, setFacultyId] = useState();
  const [departmentId, setDepartmentId] = useState();
  const [isAll, setIsAll] = useState(false);
  const [searchStudentId, setSearchStudentId] = useState();
  const [studentId, setStudentId] = useState();
  const [searchStudentName, setSearchStudentName] = useState();
  const [studentName, setStudentName] = useState();
  const [searchClassId, setSearchClassId] = useState();
  const [classId, setClassId] = useState();
  const [searchCompany, setSearchCompany] = useState();
  const [company, setCompany] = useState();
  const [valueSearchNote, setValueSearchNote] = useState();
  const [searchNote, setSearchNote] = useState();

  // handle delete intern
  const handleConfirmDeleteIntern = (id) => {
    setLoadingTable(true);
    deleteInternship(id)
      .then((res) => {
        if (res.data?.success === true) {
          notificationSuccess('Xóa thành công');
          handleGetInternList();
        } else notificationError(res.data?.error?.message);
      })
      .finally(() => setLoadingTable(false));
  };

  // handle get intern list
  const handleGetInternList = () => {
    setLoadingTable(true);
    getInternshipList({
      page: page,
      size: size,
      isAll: isAll,
      name: searchName,
      schoolYear: schoolYearId,
      term: term,
      instructorId: instructorId,
      typeId: typeId,
      status: status,
      facultyId: facultyId,
      departmentId: departmentId,
      studentId,
      studentName,
      classId,
      company,
      note: searchNote,
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
    setInternData(record);
    setFormCreate(false);
    setOpenModalFormIntern(true);
  };

  useEffect(() => {
    return handleGetInternList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    size,
    isAll,
    searchName,
    schoolYearId,
    term,
    instructorId,
    typeId,
    status,
    facultyId,
    departmentId,
    studentId,
    studentName,
    classId,
    company,
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

  const [instructorSelection, setInstructorSelection] = useState([]);
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
        setInstructorSelection(newArr);
      }
    });
  }, [facultyId, departmentId]);

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
    getDepartmentSelection({ facultyId }).then((res) => {
      if (res.data?.success) {
        const newArr = [];
        res.data?.data?.items?.map((item) => newArr.push({ label: item?.name, value: item?.id }));
        setDepartmentSelection(newArr);
      }
    });
  }, [facultyId]);

  const [internTypeSelection, setInternTypeSelection] = useState([]);
  useEffect(() => {
    getMasterDataSelection({ type: 'INTERN_TYPE' }).then((res) => {
      if (res.data?.success) {
        const newArr = [];
        res.data?.data?.items?.map((item) => newArr.push({ label: item?.name, value: item?.id }));
        setInternTypeSelection(newArr);
      }
    });
  }, []);

  // Export intern list to excel
  const exportInternToExcel = useMutation({
    mutationKey: ['exportInternList'],
    mutationFn: () =>
      excelApi.exportInternList({
        isAll: isAll,
        name: searchName,
        schoolYear: schoolYearId,
        term: term,
        instructorId: instructorId,
        typeId: typeId,
        status: status,
        facultyId: facultyId,
        departmentId: departmentId,
        studentId,
        studentName,
        classId,
        company,
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

  const importInternList = useMutation({
    mutationKey: ['importInternList'],
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append('file', file.file);
      return excelApi.importInternList(formData);
    },
    onSuccess: (res) => {
      if (res && res.success === true) {
        setIsAll(true);
        notificationSuccess('Upload file thành công');
        handleGetInternList();
      } else if (res && res.success === false) {
        setOpenModalError(true);
        if (res.error?.code === 500) {
          window.open(res.error?.message);
          messageErrorToSever(
            null,
            'Upload file thất bại. Hãy làm theo đúng form excel chúng tôi đã gửi cho bạn. (Hãy chắc chắn rằng trình duyệt của bạn không chặn tự động mở tab mới)',
          );
        }
      }
    },
  });

  const handleSetIsAll = () => {
    if (isAll) {
      setIsAll(false);
      setPage(1);
      setValueSearchName(null);
      setSearchName(null);
      setSchoolYearId(null);
      setTerm(null);
      setInstructorId(null);
      setTypeId(null);
      setStatus(null);
      setFacultyId(null);
      setDepartmentId(null);
    } else {
      setIsAll(true);
      setPage(1);
      setValueSearchName(null);
      setSearchName(null);
      setSchoolYearId(null);
      setTerm(null);
      setInstructorId(null);
      setTypeId(null);
      setStatus(null);
      setFacultyId(null);
      setDepartmentId(null);
    }
  };

  const props = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    customRequest: (file) => importInternList.mutate(file),
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

  const handleLockIntern = (id) => {
    setLoadingTable(true);
    lockInternship(id)
      .then((res) => {
        if (res.data?.success) {
          message.success('Thành công');
          handleGetInternList();
          setInternData(res.data.data);
        } else {
          message.error(res.data?.error?.message);
        }
      })
      .finally(() => setLoadingTable(false));
  };

  const columns = [
    {
      title: 'Năm học',
      dataIndex: ['schoolYear', 'name'],
      align: 'left',
      width: '3%',
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
      width: '1.5%',
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
    //   dataIndex: ['instructor', 'department', 'faculty', 'name'],
    //   align: 'left',
    //   width: '5%',
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
    //           <ButtonCustom handleClick={() => setFacultyId(null)} size="small" title={'Reset'} />
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
      dataIndex: ['instructor', 'department', 'name'],
      align: 'left',
      width: '6%',
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
      title: 'Tên đề tài thực tập',
      dataIndex: 'name',
      align: 'left',
      fixed: 'left',
      width: '7%',
      filterDropdown: () => (
        <div className="p-3">
          <Input
            placeholder={'Nhập tên'}
            value={valueSearchName}
            onChange={(e) => setValueSearchName(e.target.value)}
            className="w-[280px] mb-2 block"
            onPressEnter={(e) => {
              setPage(1);
              setSearchName(e.target.value);
            }}
          />
          <Space>
            <ButtonCustom
              handleClick={() => {
                setSearchName(null);
                setValueSearchName(null);
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
            className={`${searchName ? 'text-blue-500' : undefined} text-md p-1 text-base`}
          />
        </Tooltip>
      ),
    },
    {
      title: 'Loại đề tài',
      dataIndex: ['type', 'name'],
      align: 'left',
      width: '4%',
      filterDropdown: () => (
        <div className="p-3 flex flex-col gap-2 w-[250px]">
          <Select
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            value={typeId}
            options={internTypeSelection}
            placeholder="Chọn loại đề tài"
            onChange={(typeId) => {
              setPage(1);
              setTypeId(typeId);
            }}
          />
          <Space>
            <ButtonCustom handleClick={() => setTypeId(null)} size="small" title={'Reset'} />
          </Space>
        </div>
      ),
      filterIcon: () => (
        <Tooltip title="Tìm kiếm theo loại đề tài">
          <SearchOutlined className={`${typeId ? 'text-blue-500' : undefined} text-base`} />
        </Tooltip>
      ),
    },
    {
      title: 'Giáo viên hướng dẫn',
      render: (e, record, index) => (
        <>
          <p>
            {record?.instructor?.id} - {record?.instructor?.firstName}{' '}
            {record?.instructor?.lastName}
          </p>
        </>
      ),
      align: 'left',
      width: '6%',
      filterDropdown:
        isAll &&
        (() => (
          <div className="p-3 flex flex-col gap-2 w-[300px]">
            <Select
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              value={instructorId}
              options={instructorSelection}
              placeholder="Tìm giảng viên"
              onChange={(instructorId) => {
                setPage(1);
                setInstructorId(instructorId);
              }}
            />
            <Space>
              <ButtonCustom
                handleClick={() => setInstructorId(null)}
                size="small"
                title={'Reset'}
              />
            </Space>
          </div>
        )),
      filterIcon: () => (
        <Tooltip title="Tìm kiếm theo GV hướng dẫn">
          <SearchOutlined className={`${instructorId ? 'text-blue-500' : undefined} text-base`} />
        </Tooltip>
      ),
    },
    {
      title: 'MSV',
      dataIndex: 'studentId',
      align: 'left',
      width: '2.5%',
      filterDropdown: () => (
        <div className="p-3">
          <Input
            placeholder={'Nhập MSV'}
            value={searchStudentId}
            onChange={(e) => setSearchStudentId(e.target.value)}
            className="w-[120px] mb-2 block"
            onPressEnter={(e) => {
              setPage(1);
              setStudentId(e.target.value);
            }}
          />
          <Space>
            <ButtonCustom
              handleClick={() => {
                setStudentId(null);
                setSearchStudentId(null);
              }}
              size="small"
              title={'Reset'}
            />
          </Space>
        </div>
      ),
      filterIcon: () => (
        <Tooltip title="Tìm kiếm theo MSV">
          <SearchOutlined
            className={`${studentId ? 'text-blue-500' : undefined} text-md p-1 text-base`}
          />
        </Tooltip>
      ),
    },
    {
      title: 'Tên sinh viên',
      dataIndex: 'studentName',
      align: 'left',
      width: '5.5%',
      filterDropdown: () => (
        <div className="p-3">
          <Input
            placeholder={'Nhập tên sinh viên'}
            value={searchStudentName}
            onChange={(e) => setSearchStudentName(e.target.value)}
            className="w-[260px] mb-2 block"
            onPressEnter={(e) => {
              setPage(1);
              setStudentName(e.target.value);
            }}
          />
          <Space>
            <ButtonCustom
              handleClick={() => {
                setStudentName(null);
                setSearchStudentName(null);
              }}
              size="small"
              title={'Reset'}
            />
          </Space>
        </div>
      ),
      filterIcon: () => (
        <Tooltip title="Tìm kiếm theo tên sinh viên">
          <SearchOutlined
            className={`${studentName ? 'text-blue-500' : undefined} text-md p-1 text-base`}
          />
        </Tooltip>
      ),
    },
    {
      title: 'Lớp',
      dataIndex: 'classId',
      align: 'left',
      width: '3.5%',
      filterDropdown: () => (
        <div className="p-3">
          <Input
            placeholder={'Nhập mã lớp'}
            value={searchClassId}
            onChange={(e) => setSearchClassId(e.target.value)}
            className="w-[150px] mb-2 block"
            onPressEnter={(e) => {
              setPage(1);
              setClassId(e.target.value);
            }}
          />
          <Space>
            <ButtonCustom
              handleClick={() => {
                setClassId(null);
                setSearchClassId(null);
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
      title: 'Số điện thoại',
      dataIndex: 'phone',
      align: 'left',
      width: '3.5%',
    },
    {
      title: 'Nơi thực tập',
      dataIndex: 'company',
      align: 'left',
      width: '6.5%',
      filterDropdown: () => (
        <div className="p-3">
          <Input
            placeholder={'Nhập tên cơ sở thực tập'}
            value={searchCompany}
            onChange={(e) => setSearchCompany(e.target.value)}
            className="w-[260px] mb-2 block"
            onPressEnter={(e) => {
              setPage(1);
              setCompany(e.target.value);
            }}
          />
          <Space>
            <ButtonCustom
              handleClick={() => {
                setCompany(null);
                setSearchCompany(null);
              }}
              size="small"
              title={'Reset'}
            />
          </Space>
        </div>
      ),
      filterIcon: () => (
        <Tooltip title="Tìm kiếm tên cơ sở thực tập">
          <SearchOutlined
            className={`${company ? 'text-blue-500' : undefined} text-md p-1 text-base`}
          />
        </Tooltip>
      ),
    },
    {
      title: 'File đề cương',
      render: (record) => (
        <>
          <a href={record?.outlineFile} target="_blank" rel="noopener noreferrer">
            {record?.outlineFile ? 'Bấm để xem' : null}
          </a>
        </>
      ),
      align: 'left',
      width: '3%',
    },
    {
      title: 'File tiến độ',
      render: (record) => (
        <>
          <a href={record?.progressFile} target="_blank" rel="noopener noreferrer">
            {record?.progressFile ? 'Bấm để xem' : null}
          </a>
        </>
      ),
      align: 'left',
      width: '3%',
    },
    {
      title: 'File tổng kết',
      render: (record) => (
        <>
          <a href={record?.finalFile} target="_blank" rel="noopener noreferrer">
            {record?.finalFile ? 'Bấm để xem' : null}
          </a>
        </>
      ),
      align: 'left',
      width: '3%',
    },
    {
      title: 'Trạng thái đề tài',
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
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      align: 'left',
      width: '4.5%',
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
      width: '6%',
    },
    {
      title: 'Chỉnh sửa lần cuối',
      dataIndex: 'modifiedAt',
      align: 'left',
      width: '4.5%',
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
      width: '6%',
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
            className="w-[480px] mb-2 block"
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
      title: isAll & (roleId === 'LECTURER') ? '' : 'Tùy chọn',
      align: 'center',
      fixed: 'right',
      width: isAll & (roleId === 'LECTURER') ? '0' : '2.5%',
      render:
        (!isAll || roleId !== 'LECTURER') &&
        ((e, record, index) =>
          userInfo.department?.id === record.instructor?.department?.id && (
            <Button.Group key={index}>
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
                  onClick={() => handleLockIntern(record.id)}
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
                title="Bạn có chắc chắn muốn xóa đề tài này?"
                icon={<DeleteOutlined />}
                okText="Xóa"
                okType="danger"
                onConfirm={() => handleConfirmDeleteIntern(record.id)}
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
      <Title level={3} className="uppercase text-center" style={{ marginBottom: 0 }}>
        Danh sách đề tài thực tập
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
          <QuestionCircleOutlined
            title="Bấm để xem file mẫu import"
            className="hover:cursor-pointer hover:text-primary"
            onClick={() => setOpenModalError(true)}
          />
          <Upload {...props}>
            <ButtonCustom
              title="Thêm danh sách đề tài TT"
              icon={<UploadOutlined />}
              loading={importInternList.isPending}
            />
          </Upload>
          {roleId !== 'LECTURER' && (
            <>
              <ButtonCustom
                title="Tùy chọn lock"
                handleClick={() => setOpenModalFormLockInternshipList(true)}
                icon={<LockFilled />}
              />
              <ButtonCustom
                title="Loại đề tài"
                handleClick={() => setOpenDrawer(true)}
                icon={<TableOutlined />}
              />
            </>
          )}
          <Button
            icon={<PlusOutlined />}
            onClick={() => {
              setOpenModalFormIntern(true);
              setFormCreate(true);
            }}
            className="flex justify-center items-center text-md font-medium shadow-md bg-slate-100"
          >
            Thêm đề tài thực tập
          </Button>
        </Space>
      </div>
      <ModalFormIntern
        isCreate={formCreate}
        onSuccess={() => {
          handleGetInternList();
          setOpenModalFormIntern(false);
        }}
        internData={internData}
        openForm={openModalFormIntern}
        onChangeClickOpen={(open) => {
          if (!open) {
            setInternData({});
            setOpenModalFormIntern(false);
          }
        }}
      />
      <ModalFormLockInternship
        onSuccess={() => {
          handleGetInternList();
          setOpenModalFormLockInternshipList(false);
        }}
        openForm={openModalFormLockInternshipList}
        onChangeClickOpen={(open) => {
          if (!open) {
            setOpenModalFormLockInternshipList(false);
          }
        }}
      />
      <div className="relative">
        <Table
          scroll={{
            y: '64vh',
            x: 3700,
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
              title="Xuất danh sách đề tài thực tập"
              loading={exportInternToExcel.isPending}
              handleClick={() => {
                exportInternToExcel.mutate();
              }}
              icon={<DownloadOutlined />}
            />
          </div>
        )}
      </div>

      <Drawer
        extra={<h1 className="ml-[-100%] font-medium text-xl">Danh sách loại đề tài</h1>}
        placement="right"
        open={openDrawer}
        width={600}
        maskClosable={true}
        onClose={() => setOpenDrawer(false)}
      >
        <ManageInternType open={openDrawer} />
      </Drawer>
      <ModalErrorImportIntern open={openModalError} setOpen={(open) => setOpenModalError(open)} />
    </div>
  );
}

export default ManageIntern;
