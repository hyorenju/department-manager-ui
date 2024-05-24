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
  Form,
  DatePicker,
  Upload,
  Divider,
  Collapse,
  Drawer,
} from 'antd';
import React, { useEffect, useState } from 'react';
import {
  getExamList,
  deleteExam,
  getMasterDataSelection,
  getUserSelection,
  getFacultySelection,
  getDepartmentSelection,
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

function ManageExam() {
  const roleId = JSON.parse(sessionStorage.getItem('user_role'));
  const { Title } = Typography;
  const [loadingTable, setLoadingTable] = useState(false);
  const [openModalFormExam, setOpenModalFormExam] = useState(false);
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
  const [schoolYearId, setSchoolYearId] = useState();
  const [term, setTerm] = useState();
  const [formId, setFormId] = useState();
  const [testDay, setTestDay] = useState('');
  const [proctor1Id, setProctor1Id] = useState();
  const [proctor2Id, setProctor2Id] = useState();
  const [searchClassId, setSearchClassId] = useState();
  const [classId, setClassId] = useState();

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
      facultyId: facultyId,
      departmentId: departmentId,
      subjectName: subjectName,
      schoolYear: schoolYearId,
      term: term,
      formId: formId,
      testDay: testDay,
      proctor1Id: proctor1Id,
      proctor2Id: proctor2Id,
      classId: classId,
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

  useEffect(() => {
    return handleGetExamList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    size,
    facultyId,
    departmentId,
    subjectName,
    schoolYearId,
    term,
    formId,
    testDay,
    proctor1Id,
    proctor2Id,
    classId,
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

  // Export exam list to excel
  const exportExamToExcel = useMutation({
    mutationKey: ['exportExamList'],
    mutationFn: () =>
      excelApi.exportExamList({
        facultyId: facultyId,
        departmentId: departmentId,
        subjectName: subjectName,
        schoolYear: schoolYearId,
        term: term,
        formId: formId,
        testDay: testDay,
        proctor1Id: proctor1Id,
        proctor2Id: proctor2Id,
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
        notificationSuccess('Upload file thành công');
        handleGetExamList();
      } else if (res && res.success === false) {
        setOpenModalError(true);
        window.open(res.error?.message);
        messageErrorToSever(
          null,
          'Upload file thất bại. Hãy làm theo đúng form excel chúng tôi đã gửi cho bạn.',
        );
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

  const columns = [
    {
      title: 'Khoa',
      dataIndex: ['subject', 'department', 'faculty', 'name'],
      align: 'left',
      width: '4.5%',
      filterDropdown: () => (
        <div className="p-3 flex flex-col gap-2 w-[280px]">
          <Select
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            value={facultyId}
            options={facultySelection}
            placeholder="Chọn khoa"
            onChange={(searchFacultyId) => setFacultyId(searchFacultyId)}
          />
          <Space>
            <ButtonCustom handleClick={() => setFacultyId(null)} size="small" title={'Reset'} />
          </Space>
        </div>
      ),
      filterIcon: () => (
        <Tooltip title="Tìm kiếm theo khoa">
          <SearchOutlined className={`${facultyId ? 'text-blue-500' : undefined} text-base`} />
        </Tooltip>
      ),
    },
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
            onChange={(term) => setFacultyId(term)}
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
            className="w-[180px] mb-3 block"
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
      title: 'Hình thức',
      dataIndex: ['form', 'name'],
      align: 'left',
      width: '3%',
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
            className="w-[180px] mb-3 block"
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
      width: '1.2%',
    },
    {
      title: 'Tổ',
      dataIndex: 'cluster',
      align: 'left',
      width: '1%',
    },
    {
      title: 'Sĩ số',
      dataIndex: 'quantity',
      align: 'left',
      width: '1.3%',
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
      title: 'Giám thị 1',
      render: (e, record, index) => (
        <>
          <p>
            {record?.proctor1?.id} {record.proctor1 ? '-' : null} {record?.proctor1?.firstName}{' '}
            {record?.proctor1?.lastName}
          </p>
        </>
      ),
      align: 'left',
      width: '4%',
      filterDropdown: () => (
        <div className="p-3 flex flex-col gap-2 w-[300px]">
          <Select
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            value={proctor1Id}
            options={proctorSelection}
            placeholder="Tìm giảng viên"
            onChange={(proctor1Id) => setProctor1Id(proctor1Id)}
          />
          <Space>
            <ButtonCustom handleClick={() => setProctor1Id(null)} size="small" title={'Reset'} />
          </Space>
        </div>
      ),
      filterIcon: () => (
        <Tooltip title="Tìm kiếm theo giám thị 1">
          <SearchOutlined className={`${proctor1Id ? 'text-blue-500' : undefined} text-base`} />
        </Tooltip>
      ),
    },
    {
      title: 'Giám thị 2',
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
      filterDropdown: () => (
        <div className="p-3 flex flex-col gap-2 w-[300px]">
          <Select
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            value={proctor2Id}
            options={proctorSelection}
            placeholder="Tìm giảng viên"
            onChange={(proctor2Id) => setProctor2Id(proctor2Id)}
          />
          <Space>
            <ButtonCustom handleClick={() => setProctor2Id(null)} size="small" title={'Reset'} />
          </Space>
        </div>
      ),
      filterIcon: () => (
        <Tooltip title="Tìm kiếm theo giám thị 2">
          <SearchOutlined className={`${proctor2Id ? 'text-blue-500' : undefined} text-base`} />
        </Tooltip>
      ),
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
      title: 'Ngày phân công',
      dataIndex: 'createdAt',
      align: 'left',
      width: '2.8%',
      //   render: (e, record, idx) => role(record.roleId),
    },
    {
      title: 'Người phân công',
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
      width: roleId !== 'LECTURER' ? '3.5%' : '0',
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
              title="Bạn có chắc chắn muốn xóa phân công này?"
              icon={<DeleteOutlined />}
              okText="Xóa"
              okType="danger"
              onConfirm={() => handleConfirmDeleteExam(record.id)}
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
      <Title level={3} className="uppercase text-center" style={{ marginBottom: 4 }}>
        Danh sách phân công kỳ thi
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
                  title="Thêm danh sách phân công"
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
                Thêm phân công
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

      <div className="relative">
        <Table
          scroll={{
            y: '64vh',
            x: 6400,
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

        {dataSource.length > 0 && (
          <div className="absolute bottom-5 left-0">
            <ButtonCustom
              title="Xuất danh sách phân công kỳ thi"
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
        maskClosable={false}
        onClose={() => setOpenDrawer(false)}
      >
        <ManageExamForm open={openDrawer} />
      </Drawer>
    </div>
  );
}

export default ManageExam;
