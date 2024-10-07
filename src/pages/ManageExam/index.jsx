import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  UserAddOutlined,
  UploadOutlined,
  PlusOutlined,
  DownloadOutlined,
  QuestionCircleOutlined,
  MenuOutlined,
  TableOutlined,
  SwapOutlined,
  SnippetsOutlined,
  SoundFilled,
  MutedFilled,
} from '@ant-design/icons';
import { ProFormSelect, editableRowByKey } from '@ant-design/pro-components';
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
  Form,
  DatePicker,
  Upload,
  Divider,
  Collapse,
  Drawer,
} from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  getExamList,
  deleteExam,
  getMasterDataSelection,
  getUserSelection,
  getFacultySelection,
  getDepartmentSelection,
  warnExam,
} from '../../api/axios';
import { ButtonCustom } from '../../components/ButtonCustom';
import { ModalFormExam } from './components/ModalFormExam';
import { excelApi } from '../../api/excelApi';
import { notificationError, notificationSuccess } from '../../components/Notification';
import { messageErrorToSever } from '../../components/Message';
import { useMutation } from '@tanstack/react-query';
import { ModalErrorImportExam } from './components/ModalErrorImportExam';
import dayjs from 'dayjs';
import { ManageExamForm } from './pages/ManageExamForm';
import { ModalFormAssignment } from './components/ModalFormAssignment';

function ManageExam() {
  const roleId = JSON.parse(sessionStorage.getItem('user_role'));
  const userData = JSON.parse(sessionStorage.getItem('user_info'));
  const { Title } = Typography;
  const [loadingTable, setLoadingTable] = useState(false);
  const [openModalFormExam, setOpenModalFormExam] = useState(false);
  const [openModalFormAssignment, setOpenModalFormAssignment] = useState(false);
  const [examData, setExamData] = useState({});
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [size, setSize] = useState(10);
  const [dataSource, setDataSource] = useState([]);
  const [formCreate, setFormCreate] = useState(true);
  const [openModalError, setOpenModalError] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const [facultyId, setFacultyId] = useState();
  const [departmentId, setDepartmentId] = useState();
  const [searchSubjectName, setSearchSubjectName] = useState();
  const [subjectName, setSubjectName] = useState();
  const [searchSubjectId, setSearchSubjectId] = useState();
  const [subjectId, setSubjectId] = useState();
  const [schoolYearId, setSchoolYearId] = useState(null);
  const [term, setTerm] = useState();
  const [formId, setFormId] = useState();
  const [testDay, setTestDay] = useState('');
  const [proctorId, setProctorId] = useState();
  const [searchClassId, setSearchClassId] = useState();
  const [classId, setClassId] = useState();
  const [isAll, setIsAll] = useState(false);
  const [searchExamGroup, setSearchExamGroup] = useState(null);
  const [examGroup, setExamGroup] = useState(null);
  const [searchCluster, setSearchCluster] = useState(null);
  const [cluster, setCluster] = useState(null);
  const [searchQuantity, setSearchQuantity] = useState(null);
  const [quantity, setQuantity] = useState(null);

  // handle delete exam
  const handleConfirmDeleteExam = (id) => {
    setLoadingTable(true);
    deleteExam(id)
      .then((res) => {
        if (res.data?.success === true) {
          notificationSuccess('Xóa thành công');
          handleGetExamList();
        } else notificationError(res.data?.error?.message);
      })
      .finally(() => setLoadingTable(false));
  };

  // handle get exam list
  const handleGetExamList = () => {
    setLoadingTable(true);
    getExamList({
      page: page,
      size: size,
      isAll: isAll,
      facultyId: facultyId,
      departmentId: departmentId,
      subjectId: subjectId,
      subjectName: subjectName,
      schoolYear: schoolYearId,
      term: term,
      formId: formId,
      testDay: testDay,
      proctorId: proctorId,
      classId: classId,
      examGroup: examGroup,
      cluster: cluster,
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
    setExamData(record);
    setFormCreate(false);
    setOpenModalFormExam(true);
  };

  const handleClickAssign = (record) => {
    setExamData(record);
    setOpenModalFormAssignment(true);
  };

  useEffect(() => {
    return handleGetExamList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    size,
    isAll,
    facultyId,
    departmentId,
    subjectId,
    subjectName,
    schoolYearId,
    term,
    formId,
    testDay,
    proctorId,
    classId,
    examGroup,
    cluster,
  ]);

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

  const [proctorSelection, setProctorSelection] = useState([]);
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
        setProctorSelection(newArr);
      }
    });
  }, [facultyId, departmentId]);

  const [examFormSelection, setExamFormSelection] = useState([]);
  useEffect(() => {
    getMasterDataSelection({ type: 'EXAM_FORM' }).then((res) => {
      if (res.data?.success) {
        const newArr = [];
        res.data?.data?.items?.map((item) => newArr.push({ label: item?.name, value: item?.id }));
        setExamFormSelection(newArr);
      }
    });
  }, []);

  const handleWarnExam = (id) => {
    setLoadingTable(true);
    warnExam(id)
      .then((res) => {
        if (res.data?.success) {
          message.success('Thành công');
          handleGetExamList();
        } else {
          message.error(res.data?.error?.message);
        }
      })
      .finally(() => setLoadingTable(false));
  };

  // Export exam list to excel
  const exportExamToExcel = useMutation({
    mutationKey: ['exportExamList'],
    mutationFn: () =>
      excelApi.exportExamList({
        isAll: isAll,
        facultyId: facultyId,
        departmentId: departmentId,
        subjectName: subjectName,
        schoolYear: schoolYearId,
        term: term,
        formId: formId,
        testDay: testDay,
        proctorId: proctorId,
        classId: classId,
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

  const importExamList = useMutation({
    mutationKey: ['importExamList'],
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append('file', file.file);
      return excelApi.importExamList(formData);
    },
    onSuccess: (res) => {
      if (res && res.success === true) {
        setIsAll(true);
        setPage(1);
        notificationSuccess('Upload file thành công');
        handleGetExamList();
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
    customRequest: (file) => importExamList.mutate(file),
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
      setPage(1);
      setFacultyId(null);
      setDepartmentId(null);
      setSearchSubjectName(null);
      setSubjectName(null);
      setSchoolYearId(null);
      setTerm(null);
      setFormId(null);
      setTestDay(null);
      setProctorId(null);
      setSearchClassId(null);
      setClassId(null);
    } else {
      setIsAll(true);
      setPage(1);
      setFacultyId(null);
      setDepartmentId(null);
      setSearchSubjectName(null);
      setSubjectName(null);
      setSchoolYearId(null);
      setTerm(null);
      setFormId(null);
      setTestDay(null);
      setProctorId(null);
      setSearchClassId(null);
      setClassId(null);
    }
  };

  const columns = [
    {
      title: 'Năm học',
      dataIndex: ['schoolYear', 'name'],
      align: 'left',
      width: '2%',
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
            onChange={(schoolYearId) => setSchoolYearId(schoolYearId)}
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
      width: '1.1%',
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
            onChange={(term) => setTerm(term)}
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
    {
      title: 'Mã',
      dataIndex: ['subject', 'id'],
      align: 'left',
      fixed: 'left',
      width: '1.8%',
      filterDropdown: () => (
        <div className="p-3">
          <Input
            placeholder={'Nhập mã môn thi'}
            value={searchSubjectId}
            onChange={(e) => setSearchSubjectId(e.target.value)}
            className="w-[180px] mb-2 block"
            onPressEnter={(e) => {
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
        <Tooltip title="Tìm kiếm theo mã môn thi">
          <SearchOutlined
            className={`${subjectId ? 'text-blue-500' : undefined} text-md p-1 text-base`}
          />
        </Tooltip>
      ),
    },
    {
      title: 'Tên môn thi',
      dataIndex: ['subject', 'name'],
      align: 'left',
      fixed: 'left',
      width: '4%',
      filterDropdown: () => (
        <div className="p-3">
          <Input
            placeholder={'Nhập tên môn thi'}
            value={searchSubjectName}
            onChange={(e) => setSearchSubjectName(e.target.value)}
            className="w-[260px] mb-2 block"
            onPressEnter={(e) => {
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
        <Tooltip title="Tìm kiếm theo tên môn thi">
          <SearchOutlined
            className={`${subjectName ? 'text-blue-500' : undefined} text-md p-1 text-base`}
          />
        </Tooltip>
      ),
    },
    {
      title: 'Lớp thi',
      dataIndex: 'classId',
      align: 'left',
      width: '3%',
      filterDropdown: () => (
        <div className="p-3">
          <Input
            placeholder={'Nhập mã lớp'}
            value={searchClassId}
            onChange={(e) => setSearchClassId(e.target.value)}
            className="w-[180px] mb-2 block"
            onPressEnter={(e) => {
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
      title: 'Nhóm',
      dataIndex: 'examGroup',
      align: 'left',
      width: '1.3%',
      filterDropdown: () => (
        <div className="p-3">
          <Input
            placeholder={'Nhập nhóm thi'}
            value={searchExamGroup}
            onChange={(e) => setSearchExamGroup(e.target.value)}
            className="w-[130px] mb-2 block"
            onPressEnter={(e) => {
              setExamGroup(e.target.value);
            }}
          />
          <Space>
            <ButtonCustom
              handleClick={() => {
                setExamGroup(null);
                setSearchExamGroup(null);
              }}
              size="small"
              title={'Reset'}
            />
          </Space>
        </div>
      ),
      filterIcon: () => (
        <Tooltip title="Tìm kiếm theo nhóm thi">
          <SearchOutlined
            className={`${examGroup ? 'text-blue-500' : undefined} text-md p-1 text-base`}
          />
        </Tooltip>
      ),
    },
    {
      title: 'Tổ',
      dataIndex: 'cluster',
      align: 'left',
      width: '1%',
      filterDropdown: () => (
        <div className="p-3">
          <Input
            placeholder={'Nhập tổ thi'}
            value={searchCluster}
            onChange={(e) => setSearchCluster(e.target.value)}
            className="w-[100px] mb-2 block"
            onPressEnter={(e) => {
              setCluster(e.target.value);
            }}
          />
          <Space>
            <ButtonCustom
              handleClick={() => {
                setCluster(null);
                setSearchCluster(null);
              }}
              size="small"
              title={'Reset'}
            />
          </Space>
        </div>
      ),
      filterIcon: () => (
        <Tooltip title="Tìm kiếm theo nhóm thi">
          <SearchOutlined
            className={`${cluster ? 'text-blue-500' : undefined} text-md p-1 text-base`}
          />
        </Tooltip>
      ),
    },
    {
      title: 'Sĩ số',
      dataIndex: 'quantity',
      align: 'left',
      width: '1.3%',
    },
    {
      title: 'Ngày thi',
      render: (e, record, index) => (
        <>
          <p>{dayjs(record?.testDay).format('DD/MM/YYYY')}</p>
        </>
      ),
      align: 'left',
      width: '2%',
      filterDropdown: () => (
        <div className="p-3 flex flex-col gap-2 w-[170px]">
          <Form.Item>
            <DatePicker
              placeholder="Chọn ngày thi"
              format={'MM/DD/YYYY'}
              onChange={(value) =>
                value != null
                  ? setTestDay(`${value.$D}/${value.$M + 1}/${value.$y}`)
                  : setTestDay(null)
              }
            />
          </Form.Item>
        </div>
      ),
      filterIcon: () => (
        <Tooltip title="Chọn ngày thi">
          <SearchOutlined className={`${testDay ? 'text-blue-500' : undefined} text-base`} />
        </Tooltip>
      ),
    },
    {
      title: 'Phòng thi',
      dataIndex: 'testRoom',
      align: 'left',
      width: '2.0%',
    },
    {
      title: 'Tiết BĐ',
      dataIndex: 'lessonStart',
      align: 'left',
      width: '1.3%',
    },
    {
      title: 'Số tiết',
      dataIndex: 'lessonsTest',
      align: 'left',
      width: '1.3%',
    },
    // {
    //   title: 'Khoa',
    //   dataIndex: ['subject', 'department', 'faculty', 'name'],
    //   align: 'left',
    //   width: '4.5%',
    //   filterDropdown: () => (
    //     <div className="p-3 flex flex-col gap-2 w-[280px]">
    //       <Select
    //         showSearch
    //         filterOption={(input, option) =>
    //           (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
    //         }
    //         value={facultyId}
    //         options={facultySelection}
    //         placeholder="Chọn khoa"
    //         onChange={(searchFacultyId) => setFacultyId(searchFacultyId)}
    //       />
    //       <Space>
    //         <ButtonCustom handleClick={() => setFacultyId(null)} size="small" title={'Reset'} />
    //       </Space>
    //     </div>
    //   ),
    //   filterIcon: () => (
    //     <Tooltip title="Tìm kiếm theo khoa">
    //       <SearchOutlined className={`${facultyId ? 'text-blue-500' : undefined} text-base`} />
    //     </Tooltip>
    //   ),
    // },
    {
      title: 'Bộ môn',
      dataIndex: ['subject', 'department', 'name'],
      align: 'left',
      width: '4%',
      filterDropdown: () => (
        <div className="p-3 flex flex-col gap-2 w-[280px]">
          <Select
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            value={departmentId}
            options={departmentSelection}
            placeholder="Chọn bộ môn"
            onChange={(departmentId) => setDepartmentId(departmentId)}
          />
          <Space>
            <ButtonCustom handleClick={() => setDepartmentId(null)} size="small" title={'Reset'} />
          </Space>
        </div>
      ),
      filterIcon: () => (
        <Tooltip title="Tìm kiếm theo bộ môn">
          <SearchOutlined className={`${departmentId ? 'text-blue-500' : undefined} text-base`} />
        </Tooltip>
      ),
    },
    {
      title: 'Hình thức',
      dataIndex: ['form', 'name'],
      align: 'left',
      width: '2%',
      filterDropdown: () => (
        <div className="p-3 flex flex-col gap-2 w-[220px]">
          <Select
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            value={formId}
            options={examFormSelection}
            placeholder="Chọn hình thức"
            onChange={(formId) => setFormId(formId)}
          />
          <Space>
            <ButtonCustom handleClick={() => setFormId(null)} size="small" title={'Reset'} />
          </Space>
        </div>
      ),
      filterIcon: () => (
        <Tooltip title="Tìm kiếm theo loại đề thi">
          <SearchOutlined className={`${formId ? 'text-blue-500' : undefined} text-base`} />
        </Tooltip>
      ),
    },
    {
      title: 'Mã đề',
      dataIndex: 'examCode',
      align: 'left',
      width: '1.2%',
    },
    {
      title: 'Giám thị 1',
      render: (e, record, index) => (
        <>
          <p>
            {record?.proctor1?.id} {record.proctor1 ? '-' : null} {record?.proctor1?.firstName}{' '}
            {record?.proctor1?.lastName}
          </p>
          {/* <Select
            style={{ display: `block` }}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            value={proctorId}
            options={proctorSelection}
            placeholder={
              <p>
                {record?.proctor1?.id} {record.proctor1 ? '-' : null} {record?.proctor1?.firstName}{' '}
                {record?.proctor1?.lastName}
              </p>
            }
            onChange={(proctorId) => setProctorId(proctorId)}
          /> */}
        </>
      ),
      align: 'left',
      width: '4%',
      filterDropdown:
        isAll &&
        (() => (
          <div className="p-3 flex flex-col gap-2 w-[300px]">
            <Select
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              value={proctorId}
              options={proctorSelection}
              placeholder="Tìm giảng viên"
              onChange={(proctorId) => setProctorId(proctorId)}
            />
            <Space>
              <ButtonCustom handleClick={() => setProctorId(null)} size="small" title={'Reset'} />
            </Space>
          </div>
        )),
      filterIcon: () => (
        <Tooltip title="Tìm kiếm theo giám thị 1">
          <SearchOutlined className={`${proctorId ? 'text-blue-500' : undefined} text-base`} />
        </Tooltip>
      ),
    },
    {
      title: 'Giám thị 2',
      editable: true,
      render: (e, record, index) => (
        <>
          <p>
            {record?.proctor2?.id} {record.proctor2 ? '-' : null} {record?.proctor2?.firstName}{' '}
            {record?.proctor2?.lastName}
          </p>
        </>
      ),
      align: 'left',
      width: '4%',
      filterDropdown:
        isAll &&
        (() => (
          <div className="p-3 flex flex-col gap-2 w-[300px]">
            <Select
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              value={proctorId}
              options={proctorSelection}
              placeholder="Tìm giảng viên"
              onChange={(proctorId) => setProctorId(proctorId)}
            />
            <Space>
              <ButtonCustom handleClick={() => setProctorId(null)} size="small" title={'Reset'} />
            </Space>
          </div>
        )),
      filterIcon: () => (
        <Tooltip title="Tìm kiếm theo giám thị 2">
          <SearchOutlined className={`${proctorId ? 'text-blue-500' : undefined} text-base`} />
        </Tooltip>
      ),
    },
    {
      title: 'Giáo viên giảng dạy',
      render: (e, record, index) => (
        <>
          <p>
            {record?.lecturerTeach?.id} {record.lecturerTeach ? '-' : null}{' '}
            {record?.lecturerTeach?.firstName} {record?.lecturerTeach?.lastName}
          </p>
        </>
      ),
      align: 'left',
      width: '4%',
    },
    {
      title: 'Hạn nộp điểm',
      dataIndex: 'deadline',
      align: 'left',
      width: '1.7%',
    },
    {
      title: 'Chấm thi 1',
      render: (e, record, index) => (
        <>
          <p>
            {record?.marker1?.id} {record.marker1 ? '-' : null} {record?.marker1?.firstName}{' '}
            {record?.marker1?.lastName}
          </p>
        </>
      ),
      align: 'left',
      width: '4%',
    },
    {
      title: 'Chấm thi 2',
      render: (e, record, index) => (
        <>
          <p>
            {record?.marker2?.id} {record.marker2 ? '-' : null} {record?.marker2?.firstName}{' '}
            {record?.marker2?.lastName}
          </p>
        </>
      ),
      align: 'left',
      width: '4%',
    },
    {
      title: 'CB bốc đề',
      render: (e, record, index) => (
        <>
          <p>
            {record?.picker?.id} {record.picker ? '-' : null} {record?.picker?.firstName}{' '}
            {record?.picker?.lastName}
          </p>
        </>
      ),
      align: 'left',
      width: '4%',
    },
    {
      title: 'CB in sao đề',
      render: (e, record, index) => (
        <>
          <p>
            {record?.printer?.id} {record.printer ? '-' : null} {record?.printer?.firstName}{' '}
            {record?.printer?.lastName}
          </p>
        </>
      ),
      align: 'left',
      width: '4%',
    },
    {
      title: 'CB nhận đề',
      render: (e, record, index) => (
        <>
          <p>
            {record?.questionTaker?.id} {record.prquestionTakerinter ? '-' : null}{' '}
            {record?.questionTaker?.firstName} {record?.questionTaker?.lastName}
          </p>
        </>
      ),
      align: 'left',
      width: '4%',
    },
    {
      title: 'CB nhận bài',
      render: (e, record, index) => (
        <>
          <p>
            {record?.examTaker?.id} {record.examTaker ? '-' : null} {record?.examTaker?.firstName}{' '}
            {record?.examTaker?.lastName}
          </p>
        </>
      ),
      align: 'left',
      width: '4%',
    },
    {
      title: 'CB giao bài',
      render: (e, record, index) => (
        <>
          <p>
            {record?.examGiver?.id} {record.examGiver ? '-' : null} {record?.examGiver?.firstName}{' '}
            {record?.examGiver?.lastName}
          </p>
        </>
      ),
      align: 'left',
      width: '4%',
    },
    {
      title: 'CB giao điểm',
      render: (e, record, index) => (
        <>
          <p>
            {record?.pointGiver?.id} {record.pointGiver ? '-' : null}{' '}
            {record?.pointGiver?.firstName} {record?.pointGiver?.lastName}
          </p>
        </>
      ),
      align: 'left',
      width: '4%',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      align: 'left',
      width: '2.8%',
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
      width: '4%',
    },
    {
      title: 'Chỉnh sửa lần cuối',
      dataIndex: 'modifiedAt',
      align: 'left',
      width: '2.8%',
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
      width: '4%',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      align: 'left',
    },
    {
      title: roleId !== 'LECTURER' ? 'Tùy chọn' : '',
      align: 'center',
      fixed: 'right',
      width: roleId !== 'LECTURER' ? '1.8%' : '0',
      render:
        roleId !== 'LECTURER' &&
        ((e, record, index) =>
          (roleId === 'MANAGER' || roleId === 'DEPUTY') &&
          userData.department?.id === record.subject?.department?.id &&
          roleId !== 'PRINCIPAL' && (
            <Button.Group key={index}>
              <Button
                icon={
                  record.isWarning === true ? (
                    <SoundFilled className="text-green-800" />
                  ) : (
                    <MutedFilled className="text-rose-700" />
                  )
                }
                onClick={() => {
                  handleWarnExam(record.id);
                }}
                size="small"
                className={record.isWarning === true ? 'bg-green-50' : 'bg-yellow-100'}
              />
              <Button
                content="Phân công"
                title="Phân công"
                className="bg-blue-100"
                onClick={() => handleClickAssign(record)}
                size="small"
                icon={<SnippetsOutlined />}
              ></Button>
              <ButtonCustom
                icon={<EditOutlined />}
                handleClick={() => handleClickEdit(record)}
                size="small"
              />
              <Popconfirm
                placement="topRight"
                title="Bạn có chắc chắn muốn xóa bản ghi này?"
                icon={<DeleteOutlined />}
                okText="Xóa"
                okType="danger"
                onConfirm={() => handleConfirmDeleteExam(record.id)}
              >
                <Button
                  className="flex justify-center items-center text-md shadow-md"
                  size="small"
                  icon={<DeleteOutlined />}
                  danger
                ></Button>
              </Popconfirm>
            </Button.Group>
            // )
          )),
    },
  ];

  return (
    <div>
      <Title level={3} className="uppercase text-center" style={{ marginBottom: 4 }}>
        Quản lý lịch coi thi
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
          {roleId !== 'LECTURER' && (
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
                  loading={importExamList.isPending}
                />
              </Upload>
              <ButtonCustom
                title="Danh sách hình thức thi"
                handleClick={() => setOpenDrawer(true)}
                icon={<TableOutlined />}
              />
              <Button
                icon={<PlusOutlined />}
                onClick={() => {
                  setOpenModalFormExam(true);
                  setFormCreate(true);
                }}
                className="flex justify-center items-center text-md font-medium shadow-md bg-slate-100"
              >
                Thêm bản ghi
              </Button>
            </>
          )}
        </Space>
      </div>
      <ModalFormExam
        isCreate={formCreate}
        onSuccess={() => {
          handleGetExamList();
          setOpenModalFormExam(false);
        }}
        examData={examData}
        openForm={openModalFormExam}
        onChangeClickOpen={(open) => {
          if (!open) {
            setExamData({});
            setOpenModalFormExam(false);
          }
        }}
      />
      <ModalFormAssignment
        onSuccess={() => {
          handleGetExamList();
          setOpenModalFormAssignment(false);
        }}
        examData={examData}
        openForm={openModalFormAssignment}
        onChangeClickOpen={(open) => {
          if (!open) {
            setExamData({});
            setOpenModalFormAssignment(false);
          }
        }}
      />

      <div className="relative">
        <Table
          scroll={{
            y: '64vh',
            x: 6400,
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
              title="Xuất danh sách lịch coi thi"
              loading={exportExamToExcel.isPending}
              handleClick={() => {
                exportExamToExcel.mutate();
              }}
              icon={<DownloadOutlined />}
            />
          </div>
        )}
      </div>
      <ModalErrorImportExam open={openModalError} setOpen={(open) => setOpenModalError(open)} />

      <Drawer
        extra={<h1 className="ml-[-100%] font-medium text-xl">Danh sách hình thức thi</h1>}
        placement="right"
        open={openDrawer}
        width={600}
        maskClosable={true}
        onClose={() => setOpenDrawer(false)}
      >
        <ManageExamForm open={openDrawer} />
      </Drawer>
    </div>
  );
}

export default ManageExam;
