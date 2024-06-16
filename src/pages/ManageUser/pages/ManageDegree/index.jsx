import { ButtonCustom } from '../../../../components/ButtonCustom';
import { notificationError, notificationSuccess } from '../../../../components/Notification';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Popconfirm, Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import { getMasterDataSelection, deleteMasterData } from '../../../../api/axios';
import { ModalFormDegree } from '../components/ModalFormDegree';

export function ManageDegree() {
  const [loadingTable, setLoadingTable] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [degreeData, setDegreeData] = useState({});
  const [degreeList, setDegreeList] = useState([]);

  const handleGetDegreeList = () => {
    setLoadingTable(true);
    getMasterDataSelection({ type: 'USER_DEGREE' })
      .then((res) => {
        if (res.data?.success === true) {
          // const newArr = [];
          // res.data?.data?.items?.map((item) => newArr.push({ label: item?.name, value: item?.id }));
          setDegreeList(res.data?.data?.items);
          setTotal(res.data?.data?.total);
        } else if (res && res.success === false) {
          notificationError(res?.error.message);
        }
      })
      .finally(() => setLoadingTable(false));
  };
  useEffect(() => {
    handleGetDegreeList();
  }, []);

  const deleteDegree = (id) => {
    setLoadingTable(true);
    deleteMasterData(id)
      .then((res) => {
        if (res.data?.success === true) {
          notificationSuccess('Xóa thành công');
          handleGetDegreeList();
        } else {
          notificationError(res.data?.error?.message);
        }
      })
      .finally(() => setLoadingTable(false));
  };

  const columns = [
    {
      title: 'Trình độ',
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
              setDegreeData(record);
            }}
            size="small"
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa trình độ này?"
            icon={<DeleteOutlined />}
            okText="Xóa"
            okType="danger"
            onConfirm={() => deleteDegree(record.id)}
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
              title="Thêm trình độ"
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
          dataSource={degreeList}
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
        <ModalFormDegree
          onSuccess={() => {
            handleGetDegreeList();
            setOpenModal(false);
          }}
          degreeData={degreeData}
          open={openModal}
          onChangeClickOpen={(open) => {
            if (!open) {
              setDegreeData({});
              setOpenModal(false);
            }
          }}
        />
      </div>
    </>
  );
}
