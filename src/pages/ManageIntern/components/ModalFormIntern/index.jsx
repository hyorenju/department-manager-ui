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
  const [outline, setOutline] = useState('');
  const [progress, setProgress] = useState('');
  const [final, setFinal] = useState('');
  const [outlineList, setOutlineList] = useState([]);
  const [progressList, setProgressList] = useState([]);
  const [finalList, setFinalList] = useState([]);

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
    setOutlineList([]);
    setProgressList([]);
    setFinalList([]);
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

  const handleUploadOutline = useMutation({
    mutationKey: ['uploadFile'],
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('file', file.file);
      setOutlineList(new Array(file.file));
      return await uploadFile(formData);
    },
    onSuccess: (res) => {
      if (res.data?.success === true) {
        setOutline(res.data?.data);
        console.log(res.data?.data);
        notificationSuccess('Upload thành công');
      }
    },
  });

  const handleUploadProgress = useMutation({
    mutationKey: ['uploadFile'],
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('file', file.file);
      setProgressList(new Array(file.file));
      return await uploadFile(formData);
    },
    onSuccess: (res) => {
      if (res.data?.success === true) {
        setProgress(res.data?.data);
        notificationSuccess('Upload thành công');
      }
    },
  });

  const handleUploadFinal = useMutation({
    mutationKey: ['uploadFile'],
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('file', file.file);
      setFinalList(new Array(file.file));
      return await uploadFile(formData);
    },
    onSuccess: (res) => {
      if (res.data?.success === true) {
        setFinal(res.data?.data);
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
            title="Bạn có chắc chắn muốn xóa sinh viên này?"
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
        width={internData.id ? 1100 : 700}
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
            placeholder="Chọn HK"
            options={[
              { label: 1, value: 1 },
              { label: 2, value: 2 },
              { label: 3, value: 3 },
            ]}
          />
        </ProForm.Group>

        <ProForm.Group>
          <ProFormText width="xl" name="name" label="Ghi chú" placeholder="Nhập ghi chú" />
        </ProForm.Group>

        <ProForm.Group>
          <ProFormUploadButton
            title="Bấm để tải"
            name="outline"
            label="Tải file đề cương"
            max={1}
            fieldProps={{
              name: 'file',
              customRequest: (file) => handleUploadOutline.mutate(file),
              onRemove: () => {
                setOutline('');
                setOutlineList([]);
              },
            }}
            transform={() => {
              return { outlineFile: outline };
            }}
            fileList={outlineList}
            icon={handleUploadOutline.isPending ? <LoadingOutlined /> : <UploadOutlined />}
            disabled={handleUploadOutline.isPending ? true : false}
          />
          <ProFormUploadButton
            title="Bấm để tải"
            name="progress"
            label="Tải file tiến độ"
            max={1}
            fieldProps={{
              name: 'file',
              customRequest: (file) => handleUploadProgress.mutate(file),
              onRemove: () => {
                setProgress('');
                setProgressList([]);
              },
            }}
            transform={() => {
              return { progressFile: progress };
            }}
            fileList={progressList}
            icon={handleUploadProgress.isPending ? <LoadingOutlined /> : <UploadOutlined />}
            disabled={handleUploadProgress.isPending ? true : false}
          />
          <ProFormUploadButton
            title="Bấm để tải"
            name="final"
            label="Tải file tổng kết"
            max={1}
            fieldProps={{
              name: 'file',
              customRequest: (file) => handleUploadFinal.mutate(file),
              onRemove: () => {
                setFinal('');
                setFinalList([]);
              },
            }}
            transform={() => {
              return { finalFile: final };
            }}
            fileList={finalList}
            icon={handleUploadFinal.isPending ? <LoadingOutlined /> : <UploadOutlined />}
            disabled={handleUploadFinal.isPending ? true : false}
          />
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
            {!isCreate && (
              <Button
                icon={<PlusOutlined />}
                onClick={() => {
                  setOpenModalFormStudent(true);
                  setFormCreate(true);
                }}
                className="absolute right-0 top-[-40px] flex items-center text-md font-medium shadow-md bg-slate-100"
              >
                Thêm sinh viên vào đề tài
              </Button>
            )}
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
