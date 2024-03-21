import { Result } from 'antd';
import React from 'react';
import { ButtonCustom } from '../Button';
import { useNavigate } from 'react-router-dom';

export function NotFound(props) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/manager`);
  };

  return (
    <div>
      <Result
        status="404"
        title={
          <>
            <p className="text-5xl text-blue-900">404</p>
            <p className="text-4xl text-blue-900">Không tìm thấy trang</p>
          </>
        }
        extra={
          <ButtonCustom
            handleClick={handleClick}
            type="primary"
            title="Quay lại trang quản lý"
          ></ButtonCustom>
        }
      />
    </div>
  );
}
