import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { ModalFormProfile } from './components/ModalFormProfile';
import { ModalFormPassword } from './components/ModalFormPassword';

function Profile() {
  const [userData, setUserData] = useState({});
  const [openModalFormUser, setOpenModalFormUser] = useState(false);
  const [openModalFormPassword, setOpenModalFormPassword] = useState(false);

  const hanldeSetUserData = () => {
    if (JSON.parse(sessionStorage.getItem('user_info'))) {
      setUserData(JSON.parse(sessionStorage.getItem('user_info')));
    }
  };

  useEffect(() => {
    hanldeSetUserData();
  }, []);

  return (
    <div>
      <div className="mx-auto bg-white w-[500px] h-[370px] rounded-3xl p-3">
        <div className="text-center uppercase font-bold text-primary mb-3 text-[30px] ">
          <p>Thông tin cá nhân</p>
        </div>
        <div className="my-auto text-[20px] ">
          <p>
            Mã người dùng: <span className="font-bold">{userData.id ? userData.id : ''}</span>
          </p>
          <p>
            Tên người dùng:{' '}
            <span className="font-bold">
              {userData.id ? `${userData?.firstName} ${userData?.lastName}` : ''}
            </span>
          </p>
          <p>
            Email: <span className="font-bold">{userData.id ? `${userData?.email}` : ''}</span>
          </p>
          <p>
            Số điện thoại:{' '}
            <span className="font-bold">{userData.id ? `${userData?.phoneNumber}` : ''}</span>
          </p>
          <p>
            Trình độ:{' '}
            <span className="font-bold">{userData.id ? `${userData?.degree?.name}` : ''}</span>
          </p>
          <p>
            Khoa:{' '}
            <span className="font-bold">
              {userData.id ? `${userData?.department?.faculty?.name}` : ''}
            </span>
          </p>
          <p>
            Bộ môn:{' '}
            <span className="font-bold">{userData.id ? `${userData?.department?.name}` : ''}</span>
          </p>
          <p>
            Vai trò:{' '}
            <span className="font-bold">{userData.id ? `${userData?.role?.name}` : ''}</span>
          </p>
        </div>
        <div className="relative mt-3 ">
          <Button className="absolute right-[165px]" onClick={() => setOpenModalFormPassword(true)}>
            Đổi mật khẩu
          </Button>
          <Button className="absolute right-[5px]" onClick={() => setOpenModalFormUser(true)}>
            Cập nhật thông tin
          </Button>
        </div>
      </div>

      <ModalFormProfile
        onSuccess={() => {
          setOpenModalFormUser(false);
        }}
        userData={userData}
        openForm={openModalFormUser}
        onChangeClickOpen={(open) => {
          if (!open) {
            hanldeSetUserData();
            setOpenModalFormUser(false);
          }
        }}
      />
      <ModalFormPassword
        onSuccess={() => {
          setOpenModalFormPassword(false);
        }}
        userData={userData}
        openForm={openModalFormPassword}
        onChangeClickOpen={(open) => {
          if (!open) {
            hanldeSetUserData();
            setOpenModalFormPassword(false);
          }
        }}
      />
    </div>
  );
}

export default Profile;
