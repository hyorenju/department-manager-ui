import { ButtonCustom } from '../../../../components/ButtonCustom';
import { notificationError, notificationSuccess } from '../../../../components/Notification';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Popconfirm, Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import { getMasterDataSelection, deleteMasterData } from '../../../../api/axios';
import { ModalFormExamForm } from '../components/ModalFormExamForm';

export function ManageExamForm() {
  const [loadingTable, setLoadingTable] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [examFormData, setExamFormData] = useState({});
  const [examFormList, setExamFormList] = useState([]);

  const handleGetExamFormList = () => {
    setLoadingTable(true);
    getMasterDataSelection({ type: 'EXAM_FORM' })
      .then((res) => {
        if (res.data?.success === true) {
          // const newArr = [];
          // res.data?.data?.items?.map((item) => newArr.push({ label: item?.name, value: item?.id }));
          setExamFormList(res.data?.data?.items);
          setTotal(res.data?.data?.total);
        } else if (res && res.success === false) {
          notificationError(res?.error.message);
        }
      })
      .finally(() => setLoadingTable(false));
  };
  useEffect(() => {
    handleGetExamFormList();
  }, []);

  const deleteExamForm = (id) => {
    setLoadingTable(true);
    deleteMasterData(id)
      .then((res) => {
        if (res.data?.success === true) {
          notificationSuccess('Xóa thành công');
          handleGetExamFormList();
        } else {
          notificationError(res.data?.error?.message);
        }
      })
      .finally(() => setLoadingTable(false));
  };

  const columns = [
    {
      title: 'Hình thức',
      dataIndex: 'name',
    },
    {
      title: 'Tùy chọn',
      align: 'center',
      fixed: 'right',
      width: '40%',
      render: (record, index) => (
        <Button.Group key={index}>
          <ButtonCustom
            title={'Sửa'}
            icon={<EditOutlined />}
            handleClick={() => {
              setOpenModal(true);
              setExamFormData(record);
            }}
            size="small"
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa hình thức này?"
            icon={<DeleteOutlined />}
            okText="Xóa"
            okType="danger"
            onConfirm={() => deleteExamForm(record.id)}
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
    <>
      <div>
        <div className="flex justify-between">
          <p className="my-auto">Tổng số kết quả: {total}</p>
          <Space className="mb-2">
            <ButtonCustom
              title="Thêm hình thức thi"
              icon={<PlusOutlined />}
              handleClick={() => {
                setOpenModal(true);
              }}
            />
          </Space>
        </div>
        <Table
          loading={loadingTable}
          className="w-[80%] mx-auto"
          rowKey={'name'}
          columns={columns}
          dataSource={examFormList}
          pagination={{
            onChange: (page, size) => {
              setPage(page);
              setSize(size);
            },
            defaultCurrent: 1,
            defaultsize: 10,
            current: page,
            total: total,
            pageSize: size,
            showSizeChanger: false,
          }}
        />
        <ModalFormExamForm
          onSuccess={() => {
            handleGetExamFormList();
            setOpenModal(false);
          }}
          examFormData={examFormData}
          open={openModal}
          onChangeClickOpen={(open) => {
            if (!open) {
              setExamFormData({});
              setOpenModal(false);
            }
          }}
        />
      </div>
    </>
  );
}
