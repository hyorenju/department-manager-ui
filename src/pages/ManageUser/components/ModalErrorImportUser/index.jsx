import { Image, Modal } from 'antd';
import React from 'react';
import img from '../../../../assets/img/import-user-require.png';

export const ModalErrorImportUser = ({ open, setOpen }) => {
  const handleClickOk = () => {
    setOpen(false);
  };
  return (
    <>
      <Modal
        width={750}
        maskClosable={true}
        title={
          <h1 className="text-sky-900 text-2xl font-bold">
            Hướng dẫn import tệp excel danh sách người dùng
          </h1>
        }
        open={open}
        onCancel={handleClickOk}
        onOk={handleClickOk}
        okText="Đã hiểu"
        cancelButtonProps={{
          style: {
            display: 'none',
          },
        }}
      >
        <p className="text-sky-900 italic font-semibold mb-4">
          Vui lòng trình bày tệp excel như ảnh dưới đây trước khi tiến hành import. Nếu đã trình bày
          đúng format mà vẫn thất bại, vui lòng xem tệp lỗi mà chúng tôi đã gửi để kiểm tra chi tiết
          lỗi.
        </p>
        <Image
          src={img}
          alt="Mẫu file danh sách người dùng"
          className="w-full h-full object-cover"
        />
      </Modal>
    </>
  );
};
