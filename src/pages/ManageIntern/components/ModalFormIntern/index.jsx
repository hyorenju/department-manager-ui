import {
  ModalForm,
  ProForm,
  ProFormText,
  ProFormUploadButton,
  ProFormSelect,
} from '@ant-design/pro-components';
import { Button, message, notification, Popconfirm, Select, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  createIntern,
  updateIntern,
  uploadFile,
  getMasterDataSelection,
  getStudentList,
  deleteStudent,
} from '../../../../api/axios';
import { useMutation } from '@tanstack/react-query';
import { notificationSuccess, notificationError } from '../../../../components/Notification';
import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { ButtonCustom } from '../../../../components/ButtonCustom';
import { ModalFormStudent } from '../ModalFormStudent';

export function ModalFormIntern({ isCreate, openForm, onChangeClickOpen, internData, onSuccess }) {
  const [loadingTable, setLoadingTable] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [formCreate, setFormCreate] = useState(true);
  const [openModalFormStudent, setOpenModalFormStudent] = useState(false);
  const [studentData, setStudentData] = useState();
  const [outlineFile, setOutlineFile] = useState('');
  const [progressFile, setProgressFile] = useState('');
  const [finalFile, setFinalFile] = useState('');

  const handleCreateIntern = (values) => {
    createIntern(values).then((res) => {
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
        message.error(res.data?.error?.message);
      }
    });
  };

  const handleUpdateIntern = (id, values) => {
    updateIntern(id, values).then((res) => {
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
        message.error(res.data?.error?.message);
      }
    });
  };

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

  const [internTypeSelection, setInternTypeSelection] = useState([]);
  useEffect(() => {
    if (openForm) {
      getMasterDataSelection({ type: 'INTERN_TYPE' }).then((res) => {
        if (res.data?.success) {
          const newArr = [];
          res.data?.data?.items?.map((item) => newArr.push({ label: item?.name, value: item?.id }));
          setInternTypeSelection(newArr);
        }
      });
    }
  }, [openForm]);

  useEffect(() => {
    if (openForm && internData.id) {
      handleGetStudentList();
    }
  }, [openForm]);

  const handleGetStudentList = () => {
    setLoadingTable(true);
    getStudentList(internData)
      .then((res) => {
        if (res.data?.success === true) {
          setDataSource(res.data?.data?.items);
        } else notificationError('Bạn không có quyền truy cập');
      })
      .finally(() => setLoadingTable(false));
  };

  const handleUploadOutlineFile = useMutation({
    mutationKey: ['uploadFile'],
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('file', file.file);
      return await uploadFile(formData);
    },
    onSuccess: (res) => {
      if (res.data?.success === true) {
        setOutlineFile(res.data?.data);
        notificationSuccess('Upload thành công');
      }
    },
  });

  const handleUploadProgressFile = useMutation({
    mutationKey: ['uploadFile'],
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('file', file.file);
      return await uploadFile(formData);
    },
    onSuccess: (res) => {
      if (res.data?.success === true) {
        setProgressFile(res.data?.data);
        notificationSuccess('Upload thành công');
      }
    },
  });

  const handleUploadFinalFile = useMutation({
    mutationKey: ['uploadFile'],
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('file', file.file);
      return await uploadFile(formData);
    },
    onSuccess: (res) => {
      if (res.data?.success === true) {
        setFinalFile(res.data?.data);
        notificationSuccess('Upload thành công');
      }
    },
  });

  const handleClickEdit = (record) => {
    setStudentData(record);
    setFormCreate(false);
    setOpenModalFormStudent(true);
  };

  const handleConfirmDeleteStudent = (id) => {
    setLoadingTable(true);
    deleteStudent(id)
      .then((res) => {
        if (res.data?.success === true) {
          notificationSuccess('Xóa thành công');
          handleGetStudentList();
        } else notificationError(res.data?.error?.message);
      })
      .finally(() => setLoadingTable(false));
  };

  const columns = [
    {
      title: 'MSV',
      dataIndex: 'studentId',
      align: 'left',
      fixed: 'left',
      width: '10%',
    },
    {
      title: 'Tên sinh viên',
      dataIndex: 'name',
      align: 'left',
      width: '22%',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      align: 'left',
      width: '12%',
    },
    {
      title: 'Nơi thực tập',
      dataIndex: 'company',
      align: 'left',
      width: '22%',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      align: 'left',
    },
    {
      title: 'Tùy chọn',
      align: 'center',
      fixed: 'right',
      width: '15%',
      render: (e, record, index) => (
        <Button.Group key={index}>
          <ButtonCustom
            title={'Sửa'}
            icon={<EditOutlined />}
            handleClick={() => handleClickEdit(record)}
            size="small"
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa bộ môn này?"
            icon={<DeleteOutlined />}
            okText="Xóa"
            okType="danger"
            onConfirm={() => handleConfirmDeleteStudent(record.id)}
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
      ),
    },
  ];

  return (
    <div>
      <ModalForm
        width={1100}
        title={internData.id ? 'Sửa thông tin đề tài thực tập' : 'Thêm đề tài thực tập'}
        initialValues={internData}
        modalProps={{
          maskClosable: false,
          destroyOnClose: true,
          okText: internData.id ? 'Lưu' : 'Tạo',
          cancelText: 'Hủy',
        }}
        open={openForm}
        onFinish={(values) => {
          if (internData.id) {
            handleUpdateIntern(internData.id, values);
          } else {
            handleCreateIntern(values);
          }
        }}
        onOpenChange={onChangeClickOpen}
      >
        <ProForm.Group>
          <ProFormText
            rules={[
              isCreate ? { required: true, message: 'Không được để trống' } : { required: false },
            ]}
            width="xl"
            name="name"
            label="Tên đề tài"
            placeholder="Nhập tên đề tài"
            disabled={isCreate ? false : true}
          />
        </ProForm.Group>

        <ProForm.Group>
          <ProFormSelect
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            width="sm"
            rules={[{ required: true, message: 'Không được để trống' }]}
            name={['type', 'id']}
            label="Loại đề tài"
            placeholder="Chọn loại đề tài"
            options={internTypeSelection}
          />
          <ProFormSelect
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            width="sm"
            rules={[{ required: true, message: 'Không được để trống' }]}
            name={['schoolYear', 'id']}
            label="Năm học"
            placeholder="Chọn năm học"
            options={schoolYearSelection}
          />
          <ProFormSelect
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            width="xs"
            rules={[{ required: true, message: 'Không được để trống' }]}
            name="term"
            label="Học kỳ"
            placeholder="Chọn học kỳ"
            options={[
              { label: 1, value: 1 },
              { label: 2, value: 2 },
              { label: 3, value: 3 },
            ]}
          />
        </ProForm.Group>

        <ProForm.Group>
          <ProFormUploadButton
            title="Bấm để tải"
            name="outlineFile"
            label="Tải file giáo trình"
            max={1}
            fieldProps={{
              name: 'file',
              customRequest: (file) => handleUploadOutlineFile.mutate(file),
            }}
            transform={() => {
              return { outlineFile: outlineFile };
            }}
            fileList={[]}
            icon={handleUploadOutlineFile.isPending ? <LoadingOutlined /> : <UploadOutlined />}
            disabled={handleUploadOutlineFile.isPending ? true : false}
          />
          <ProFormUploadButton
            title="Bấm để tải"
            name="progressFile"
            label="Tải file tiến độ"
            max={1}
            fieldProps={{
              name: 'file',
              customRequest: (file) => handleUploadProgressFile.mutate(file),
            }}
            transform={() => {
              return { progressFile: progressFile };
            }}
            fileList={[]}
            icon={handleUploadProgressFile.isPending ? <LoadingOutlined /> : <UploadOutlined />}
            disabled={handleUploadProgressFile.isPending ? true : false}
          />
          <ProFormUploadButton
            title="Bấm để tải"
            name="finalFile"
            label="Tải file tổng kết"
            max={1}
            fieldProps={{
              name: 'file',
              customRequest: (file) => handleUploadFinalFile.mutate(file),
            }}
            transform={() => {
              return { finalFile: finalFile };
            }}
            fileList={[]}
            icon={handleUploadFinalFile.isPending ? <LoadingOutlined /> : <UploadOutlined />}
            disabled={handleUploadFinalFile.isPending ? true : false}
          />
        </ProForm.Group>

        <ProForm.Group>
          <p style={{ width: '700px', color: 'gray', fontStyle: 'italic' }}>
            (*) Sau khi chọn file để upload, vui lòng đợi cho đến khi thông báo hiển thị.
          </p>
          <p style={{ width: '700px', color: 'gray', fontStyle: 'italic' }}>
            Chúng tôi sẽ cho bạn biết việc tải tệp lên có thành công hay không.
          </p>
          <Button
            icon={<PlusOutlined />}
            onClick={() => {
              setOpenModalFormStudent(true);
              setFormCreate(true);
            }}
            className="flex justify-center items-center text-md font-medium shadow-md bg-slate-100"
          >
            Thêm sinh viên vào đề tài
          </Button>
        </ProForm.Group>
        <ModalFormStudent
          isCreate={formCreate}
          onSuccess={() => {
            handleGetStudentList();
            setOpenModalFormStudent(false);
          }}
          intern={internData}
          studentData={studentData}
          openForm={openModalFormStudent}
          onChangeClickOpen={(open) => {
            if (!open) {
              setStudentData({});
              setOpenModalFormStudent(false);
            }
          }}
        />
        {!isCreate && (
          <div className="relative mt-3">
            <Table
              scroll={{
                y: 5000,
                x: 600,
              }}
              rowKey="id"
              loading={loadingTable}
              bordered={true}
              dataSource={dataSource}
              columns={columns}
              pagination={false}
            />
          </div>
        )}
      </ModalForm>
    </div>
  );
}
