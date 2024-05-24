import {
  ModalForm,
  ProForm,
  ProFormText,
  ProFormUploadButton,
  ProFormSelect,
} from '@ant-design/pro-components';
import { message, notification, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  createTeaching,
  updateTeaching,
  uploadFile,
  getMasterDataSelection,
  getUserSelection,
  getSubjectSelection,
  getFacultySelection,
  getDepartmentSelection,
} from '../../../../api/axios';
import { useMutation } from '@tanstack/react-query';
import { notificationSuccess, notificationError } from '../../../../components/Notification';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { messageErrorToSever } from '../../../../components/Message';

export function ModalFormTeaching({
  isCreate,
  openForm,
  onChangeClickOpen,
  teachingData,
  onSuccess,
}) {
  const roleId = JSON.parse(sessionStorage.getItem('user_role'));
  const [facultyId, setFacultyId] = useState(null);
  const [departmentId, setDepartmentId] = useState(null);
  const [component, setComponent] = useState('');
  const [summary, setSummary] = useState('');
  const [componentList, setComponentList] = useState([]);
  const [summaryList, setSummaryList] = useState([]);

  const handleCreateTeachingcreateTeaching = (values) => {
    createTeaching(values).then((res) => {
      if (res.data?.success === true) {
        onSuccess();
        notification.success({
          message: 'Thành công',
          description: 'Tạo thành công',
          duration: 3,
        });
      } else {
        notificationError(res.data?.error?.message);
      }
    });
  };

  const handleUpdateTeachingupdateTeaching = (id, values) => {
    updateTeaching(id, values).then((res) => {
      if (res.data?.success === true) {
        onSuccess();
        notification.success({
          message: 'Thành công',
          description: 'Sửa thành công',
          duration: 3,
        });
      } else {
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
    if (openForm) {
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

  const handleUploadComponent = useMutation({
    mutationKey: ['uploadFile'],
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('file', file.file);
      setComponentList(new Array(file.file));
      return await uploadFile(formData);
    },
    onSuccess: (res) => {
      if (res.data?.success === true) {
        setComponent(res.data?.data);
        notificationSuccess('Upload thành công');
      }
    },
  });

  const handleUploadSummary = useMutation({
    mutationKey: ['uploadFile'],
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('file', file.file);
      setSummaryList(new Array(file.file));
      return await uploadFile(formData);
    },
    onSuccess: (res) => {
      if (res.data?.success === true) {
        setSummary(res.data?.data);
        notificationSuccess('Upload thành công');
      }
    },
  });

  return (
    <div>
      <ModalForm
        width={1100}
        title={teachingData.id ? 'Sửa phân công' : 'Thêm phân công'}
        initialValues={teachingData}
        modalProps={{
          maskClosable: false,
          destroyOnClose: true,
          okText: teachingData.id ? 'Lưu' : 'Tạo',
          cancelText: 'Hủy',
        }}
        open={openForm}
        onFinish={(values) => {
          if (teachingData.id) {
            handleUpdateTeachingupdateTeaching(teachingData.id, values);
          } else {
            handleCreateTeachingcreateTeaching(values);
          }
        }}
        onOpenChange={onChangeClickOpen}
      >
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
            label="Môn giảng dạy"
            placeholder="Chọn môn giảng dạy"
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
          <ProFormSelect
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            width="md"
            rules={
              roleId === 'LECTURER' ? null : [{ required: true, message: 'Không được để trống' }]
            }
            disabled={roleId === 'LECTURER' ? true : false}
            name={['teacher', 'id']}
            label="Giáo viên giảng dạy"
            placeholder="Chọn giáo viên giảng dạy"
            options={userSelection}
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
            name="teachingGroup"
            label="Nhóm môn học"
            placeholder="Nhập nhóm môn học"
            disabled={isCreate ? false : true}
          />
          <ProFormText width="md" name="note" label="Ghi chú" placeholder="Nhập ghi chú" />
        </ProForm.Group>

        <ProForm.Group>
          <ProFormUploadButton
            title="Bấm để tải"
            name="component"
            label="Tải file thành phần"
            max={1}
            fieldProps={{
              name: 'file',
              customRequest: (file) => handleUploadComponent.mutate(file),
              onRemove: () => {
                setComponent('');
                setComponentList([]);
              },
            }}
            transform={() => {
              return { componentFile: component };
            }}
            fileList={componentList}
            icon={handleUploadComponent.isPending ? <LoadingOutlined /> : <UploadOutlined />}
            disabled={handleUploadComponent.isPending ? true : false}
          />
          <ProFormUploadButton
            title="Bấm để tải"
            name="summary"
            label="Tải file tổng kết"
            max={1}
            fieldProps={{
              name: 'file',
              customRequest: (file) => handleUploadSummary.mutate(file),
              onRemove: () => {
                setSummary('');
                setSummaryList([]);
              },
            }}
            transform={() => {
              return { summaryFile: summary };
            }}
            fileList={summaryList}
            icon={handleUploadSummary.isPending ? <LoadingOutlined /> : <UploadOutlined />}
            disabled={handleUploadSummary.isPending ? true : false}
          />
        </ProForm.Group>
      </ModalForm>
    </div>
  );
}
