import { Image, Modal } from 'antd';
import React from 'react';
import img from '../../../../assets/img/import-teaching-require.png';

export const ModalErrorImportTeaching = ({ open, setOpen }) => {
  const handleClickOk = () => {
    setOpen(false);
  };
  return (
    <>
      <Modal
        width={750}
        maskClosable={false}
        title={
          <h1 className="text-sky-900 text-2xl font-bold">
            Lỗi import tệp excel phân công giảng dạy
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
          đúng format, vui lòng kiểm tra tệp lỗi mà chúng tôi đã gửi để kiểm tra chi tiết lỗi.
        </p>
        <Image src={img} alt="Mẫu file giảng dạy" className="w-full h-full object-cover" />
      </Modal>
    </>
  );
};
