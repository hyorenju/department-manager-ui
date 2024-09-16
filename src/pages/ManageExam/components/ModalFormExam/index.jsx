import {
  ModalForm,
  ProForm,
  ProFormText,
  ProFormUploadButton,
  ProFormSelect,
  ProFormDatePicker,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { DatePicker, Form, message, notification, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import {
  createExam,
  updateExam,
  getAssignSelection,
  getMasterDataSelection,
  getUserSelection,
  getSubjectSelection,
  getFacultySelection,
  getDepartmentSelection,
  getAssignSelectionByRequest,
} from '../../../../api/axios';
import { useMutation } from '@tanstack/react-query';
import { notificationSuccess, notificationError } from '../../../../components/Notification';
import dayjs from 'dayjs';
import TextArea from 'antd/es/input/TextArea';

export function ModalFormExam({ isCreate, openForm, onChangeClickOpen, examData, onSuccess }) {
  const [facultyId, setFacultyId] = useState(null);
  const [departmentId, setDepartmentId] = useState(null);
  const [testDay, setTestDay] = useState('');
  const [lessonStart, setLessonStart] = useState(null);
  const [lessonsTest, setLessonsTest] = useState(null);

  const handleCreateExam = (values) => {
    createExam(values).then((res) => {
      if (res.data?.success === true) {
        onSuccess();
        notification.success({
          message: 'Thành công',
          description: 'Tạo thành công',
          duration: 3,
        });
      } else if (res.data?.error?.code === 2) {
        // eslint-disable-next-line no-lone-blocks
        {
          res.data?.error?.errorDetailList?.forEach((e) => message.error(e.message));
        }
      } else if (res.data?.error?.code === 500) {
        notificationError(res.data?.error?.message);
      }
    });
  };

  const handleUpdateExam = (id, values) => {
    updateExam(id, values).then((res) => {
      if (res.data?.success === true) {
        onSuccess();
        notification.success({
          message: 'Thành công',
          description: 'Sửa thành công',
          duration: 3,
        });
      } else if (res.data?.error?.code === 2) {
        // eslint-disable-next-line no-lone-blocks
        {
          res.data?.error?.errorDetailList?.forEach((e) => message.error(e.message));
        }
      } else if (res.data?.error?.code === 500) {
        notificationError(res.data?.error?.message);
      }
    });
  };

  const [facultySelection, setFacultySelection] = useState([]);
  useEffect(() => {
    if (openForm) {
      getFacultySelection().then((res) => {
        if (res.data?.success) {
          const newArr = [];
          res.data?.data?.items?.map((item) => newArr.push({ label: item?.name, value: item?.id }));
          setFacultySelection(newArr);
        }
      });
    }
  }, [openForm]);

  const [departmentSelection, setDepartmentSelection] = useState([]);
  useEffect(() => {
    if (openForm) {
      getDepartmentSelection({ facultyId }).then((res) => {
        if (res.data?.success) {
          const newArr = [];
          res.data?.data?.items?.map((item) => newArr.push({ label: item?.name, value: item?.id }));
          setDepartmentSelection(newArr);
        }
      });
    }
  }, [openForm, facultyId]);

  const [subjectSelection, setSubjectSelection] = useState([]);
  useEffect(() => {
    if (openForm & isCreate) {
      getSubjectSelection({ facultyId, departmentId }).then((res) => {
        if (res.data?.success) {
          const newArr = [];
          res.data?.data?.items?.map((item) => newArr.push({ label: item?.name, value: item?.id }));
          setSubjectSelection(newArr);
        }
      });
    }
  }, [openForm, facultyId, departmentId]);

  const [schoolYearSelection, setSchoolYearSelection] = useState([]);
  useEffect(() => {
    if (openForm) {
      getMasterDataSelection({ type: 'SCHOOL_YEAR' }).then((res) => {
        if (res.data?.success) {
          const newArr = [];
          res.data?.data?.items?.map((item) => newArr.push({ label: item?.name, value: item?.id }));
          setSchoolYearSelection(newArr);
        }
      });
    }
  }, [openForm]);

  const [examFormSelection, setExamFormSelection] = useState([]);
  useEffect(() => {
    if (openForm) {
      getMasterDataSelection({ type: 'EXAM_FORM' }).then((res) => {
        if (res.data?.success) {
          const newArr = [];
          res.data?.data?.items?.map((item) => newArr.push({ label: item?.name, value: item?.id }));
          setExamFormSelection(newArr);
        }
      });
    }
  }, [openForm]);

  const [lecturerTeachSelection, setLecturerTeachSelection] = useState([]);
  useEffect(() => {
    if (openForm) {
      getUserSelection({}).then((res) => {
        if (res.data?.success) {
          const newArr = [];
          res.data?.data?.items?.map((item) =>
            newArr.push({
              label: `${item?.firstName} ${item?.lastName} - Bộ môn ${item?.department?.name} - Khoa ${item?.department?.faculty?.name}`,
              value: item?.id,
            }),
          );
          setLecturerTeachSelection(newArr);
        }
      });
    }
  }, [openForm]);

  const [proctorSelection, setProctorSelection] = useState([]);
  useEffect(() => {
    if (openForm && !isCreate) {
      getAssignSelection(examData?.id).then((res) => {
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
    }
  }, [openForm]);

  useEffect(() => {
    if (testDay !== '' && lessonStart != null && lessonsTest != null) {
      getAssignSelectionByRequest({ testDay, lessonStart, lessonsTest }).then((res) => {
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
    }
  }, [testDay, lessonStart, lessonsTest]);

  const [userSelection, setUserSelection] = useState([]);
  useEffect(() => {
    if (openForm) {
      getUserSelection({ departmentId, facultyId }).then((res) => {
        if (res.data?.success) {
          const newArr = [];
          res.data?.data?.items?.map((item) =>
            newArr.push({
              label: `${item?.id} - ${item?.firstName} ${item?.lastName}`,
              value: item?.id,
            }),
          );
          setUserSelection(newArr);
        }
      });
    }
  }, [openForm, facultyId, departmentId]);

  return (
    <div>
      <ModalForm
        width={1100}
        title={examData.id ? 'Sửa thông tin lịch thi' : 'Thêm lịch thi'}
        initialValues={examData}
        modalProps={{
          maskClosable: false,
          destroyOnClose: true,
          okText: examData.id ? 'Lưu' : 'Tạo',
          cancelText: 'Hủy',
        }}
        open={openForm}
        onFinish={(values) => {
          if (examData.id) {
            handleUpdateExam(examData.id, values);
          } else {
            handleCreateExam(values);
          }
        }}
        onOpenChange={onChangeClickOpen}
      >
        <hr className="mb-3" />
        <div className="text-center mb-3">
          <p className="uppercase text-lg underline">Thông tin môn thi</p>
        </div>

        <ProForm.Group>
          <ProFormSelect
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            width="md"
            name={['subject', 'department', 'faculty', 'name']}
            label="Khoa"
            placeholder="Chọn khoa"
            options={facultySelection}
            onChange={(value) => setFacultyId(value)}
          />
          <ProFormSelect
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            width="md"
            name={['subject', 'department', 'name']}
            label="Bộ môn"
            placeholder="Chọn bộ môn"
            options={departmentSelection}
            onChange={(value) => setDepartmentId(value)}
          />
          <ProFormSelect
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            width="md"
            rules={[
              isCreate ? { required: true, message: 'Không được để trống' } : { required: false },
            ]}
            name={['subject', 'id']}
            label="Môn thi"
            placeholder="Chọn môn thi"
            options={subjectSelection}
            disabled={isCreate ? false : true}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            width="md"
            rules={[
              isCreate ? { required: true, message: 'Không được để trống' } : { required: false },
            ]}
            name={['schoolYear', 'id']}
            label="Năm học"
            placeholder="Chọn năm học"
            options={schoolYearSelection}
            disabled={isCreate ? false : true}
          />
          <ProFormSelect
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            width="md"
            rules={[
              isCreate ? { required: true, message: 'Không được để trống' } : { required: false },
            ]}
            name="term"
            label="Học kỳ"
            placeholder="Chọn học kỳ"
            options={[
              { label: 1, value: 1 },
              { label: 2, value: 2 },
              { label: 3, value: 3 },
            ]}
            disabled={isCreate ? false : true}
          />
          <ProFormText
            rules={[{ required: true, message: 'Không được để trống' }]}
            width="md"
            name="testRoom"
            label="Phòng thi"
            placeholder="Nhập phòng thi"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormDatePicker
            rules={[
              isCreate ? { required: true, message: 'Không được để trống' } : { required: false },
            ]}
            width="md"
            placeholder="Chọn ngày thi"
            name="testDay"
            label="Ngày thi"
            disabled={isCreate ? false : true}
            fieldProps={{
              format: 'DD/MM/YYYY',
              onChange: (e) => {
                setTestDay(`${e.$D}/${e.$M + 1}/${e.$y}`);
              },
            }}
          />
          <ProFormText
            rules={[
              isCreate ? { required: true, message: 'Không được để trống' } : { required: false },
            ]}
            width="md"
            name="lessonStart"
            label="Tiết bắt đầu"
            placeholder="Nhập tiết bắt đầu"
            disabled={isCreate ? false : true}
            fieldProps={{
              onBlur: (e) => {
                setLessonStart(e.target.value);
              },
            }}
          />
          <ProFormText
            rules={[
              isCreate ? { required: true, message: 'Không được để trống' } : { required: false },
            ]}
            width="md"
            name="lessonsTest"
            label="Số tiết thi"
            placeholder="Nhập số tiết"
            disabled={isCreate ? false : true}
            fieldProps={{
              onBlur: (e) => {
                setLessonsTest(e.target.value);
              },
            }}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            rules={[
              isCreate ? { required: true, message: 'Không được để trống' } : { required: false },
            ]}
            width="md"
            name="classId"
            label="Mã lớp"
            placeholder="Nhập mã lớp"
            disabled={isCreate ? false : true}
          />
          <ProFormText
            rules={[
              isCreate ? { required: true, message: 'Không được để trống' } : { required: false },
            ]}
            width="md"
            name="examGroup"
            label="Nhóm thi"
            placeholder="Nhập nhóm thi"
            disabled={isCreate ? false : true}
          />
          <ProFormText
            rules={[
              isCreate ? { required: true, message: 'Không được để trống' } : { required: false },
            ]}
            width="md"
            name="cluster"
            label="Tổ thi"
            placeholder="Nhập tổ thi"
            disabled={isCreate ? false : true}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText width="md" name="quantity" label="Sĩ số" placeholder="Nhập sĩ số" />

          <ProFormSelect
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            width="md"
            // rules={[
            //   !isCreate ? { required: true, message: 'Không được để trống' } : { required: false },
            // ]}
            name={['form', 'id']}
            label="Hình thức thi"
            placeholder="Chọn hình thức thi"
            options={examFormSelection}
          />
          <ProFormText
            // rules={[
            //   isCreate ? { required: false } : { required: true, message: 'Không được để trống' },
            // ]}
            width="md"
            name="examCode"
            label="Mã đề thi"
            placeholder="Nhập mã đề thi"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormTextArea width="1050px" name="note" label="Ghi chú" placeholder="Nhập ghi chú" />
        </ProForm.Group>

        <hr className="mb-3" />
        <div className="text-center mb-3">
          <p className="uppercase text-lg underline">Phân công môn thi</p>
        </div>

        <ProForm.Group>
          <ProFormSelect
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            width="md"
            rules={[{ required: true, message: 'Không được để trống' }]}
            name={['proctor1', 'id']}
            label="Giám thị coi thi 1"
            placeholder="Chọn giám thị coi thi 1"
            options={proctorSelection}
          />
          <ProFormSelect
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            width="md"
            rules={[{ required: true, message: 'Không được để trống' }]}
            name={['proctor2', 'id']}
            label="Giám thị coi thi 2"
            placeholder="Chọn giám thị coi thi 2"
            options={proctorSelection}
          />
          <ProFormSelect
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            width="md"
            // rules={[
            //   !isCreate ? { required: true, message: 'Không được để trống' } : { required: false },
            // ]}
            name={['printer', 'id']}
            label="Giáo viên in sao đề"
            placeholder="Chọn giáo viên"
            options={userSelection}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            width="690px "
            // rules={[
            //   !isCreate ? { required: true, message: 'Không được để trống' } : { required: false },
            // ]}
            name={['lecturerTeach', 'id']}
            label="Giáo viên giảng dạy"
            placeholder="Chọn giáo viên giảng dạy"
            options={lecturerTeachSelection}
          />
          <ProFormSelect
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            width="md"
            // rules={[
            //   !isCreate ? { required: true, message: 'Không được để trống' } : { required: false },
            // ]}
            name={['picker', 'id']}
            label="Giáo viên bốc đề"
            placeholder="Chọn giáo viên bốc đề"
            options={userSelection}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            width="md"
            // rules={[
            //   !isCreate ? { required: true, message: 'Không được để trống' } : { required: false },
            // ]}
            name={['questionTaker', 'id']}
            label="Giáo viên ký nhận đề"
            placeholder="Chọn giáo viên"
            options={userSelection}
          />
          <ProFormSelect
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            width="md"
            // rules={[
            //   !isCreate ? { required: true, message: 'Không được để trống' } : { required: false },
            // ]}
            name={['marker1', 'id']}
            label="Giáo viên chấm thi 1"
            placeholder="Chọn giáo viên"
            options={userSelection}
          />
          <ProFormSelect
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            width="md"
            // rules={[
            //   !isCreate ? { required: true, message: 'Không được để trống' } : { required: false },
            // ]}
            name={['marker2', 'id']}
            label="Giáo viên chấm thi 2"
            placeholder="Chọn giáo viên"
            options={userSelection}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            width="md"
            // rules={[
            //   !isCreate ? { required: true, message: 'Không được để trống' } : { required: false },
            // ]}
            name={['examTaker', 'id']}
            label="Giáo viên ký nhận bài thi"
            placeholder="Chọn giáo viên"
            options={userSelection}
          />
          <ProFormSelect
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            width="md"
            // rules={[
            //   !isCreate ? { required: true, message: 'Không được để trống' } : { required: false },
            // ]}
            name={['examGiver', 'id']}
            label="Giáo viên bàn giao bài"
            placeholder="Chọn giáo viên"
            options={userSelection}
          />
          <ProFormSelect
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            width="md"
            // rules={[
            //   !isCreate ? { required: true, message: 'Không được để trống' } : { required: false },
            // ]}
            name={['pointGiver', 'id']}
            label="Giáo viên bàn giao điểm"
            placeholder="Chọn giáo viên"
            options={userSelection}
          />
        </ProForm.Group>
        <ProForm.Group></ProForm.Group>
      </ModalForm>
    </div>
  );
}
