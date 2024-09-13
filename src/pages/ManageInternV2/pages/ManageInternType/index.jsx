import { ButtonCustom } from '../../../../components/ButtonCustom';
import { notificationError, notificationSuccess } from '../../../../components/Notification';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Popconfirm, Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import { getMasterDataSelection, deleteMasterData } from '../../../../api/axios';
import { ModalFormInternType } from '../components/ModalFormInternType';

export function ManageInternType() {
  const [loadingTable, setLoadingTable] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [internTypeData, setInternTypeData] = useState({});
  const [InternTypeList, setInterTypeList] = useState([]);

  const handleGetInternTypeList = () => {
    setLoadingTable(true);
    getMasterDataSelection({ type: 'INTERN_TYPE' })
      .then((res) => {
        if (res.data?.success === true) {
          setInterTypeList(res.data?.data?.items);
          setTotal(res.data?.data?.total);
        } else if (res && res.success === false) {
          notificationError(res?.error.message);
        }
      })
      .finally(() => setLoadingTable(false));
  };
  useEffect(() => {
    handleGetInternTypeList();
  }, []);

  const deleteInternType = (id) => {
    setLoadingTable(true);
    deleteMasterData(id)
      .then((res) => {
        if (res.data?.success === true) {
          notificationSuccess('Xóa thành công');
          handleGetInternTypeList();
        } else {
          notificationError(res.data?.error?.message);
        }
      })
      .finally(() => setLoadingTable(false));
  };

  const columns = [
    {
      title: 'Loại đề tài',
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
              setInternTypeData(record);
            }}
            size="small"
          />
          <Popconfirm
            placement="topRight"
            title="Bạn có chắc chắn muốn xóa loại đề tài này?"
            icon={<DeleteOutlined />}
            okText="Xóa"
            okType="danger"
            onConfirm={() => deleteInternType(record.id)}
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
              title="Thêm loại đề tài"
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
          dataSource={InternTypeList}
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
        <ModalFormInternType
          onSuccess={() => {
            handleGetInternTypeList();
            setOpenModal(false);
          }}
          internTypeData={internTypeData}
          open={openModal}
          onChangeClickOpen={(open) => {
            if (!open) {
              setInternTypeData({});
              setOpenModal(false);
            }
          }}
        />
      </div>
    </>
  );
}
