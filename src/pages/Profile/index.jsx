import { Button, Image, Upload } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { ModalFormProfile } from './components/ModalFormProfile';
import { ModalFormPassword } from './components/ModalFormPassword';
import { CameraOutlined, PlusOutlined } from '@ant-design/icons';
import { updateAvatar } from '../../api/axios';
import userAvatar from '../../assets/img/user.png';
import './style.css';

function Profile() {
  const [userData, setUserData] = useState({});
  const [openModalFormUser, setOpenModalFormUser] = useState(false);
  const [openModalFormPassword, setOpenModalFormPassword] = useState(false);
  const fileInputRef = useRef(null);

  const hanldeSetUserData = () => {
    if (JSON.parse(localStorage.getItem('user_info'))) {
      setUserData(JSON.parse(localStorage.getItem('user_info')));
    }
  };

  useEffect(() => {
    hanldeSetUserData();
  }, []);

  async function uploadAvatar(file) {
    const formData = new FormData();
    formData.append('file', file);

    // const response = await updateAvatar(formData);

    // if (!response.ok) {
    //   throw new Error('Failed to upload image');
    // }

    // const data = await response.data;

    // return data;

    updateAvatar(formData).then((res) => {
      localStorage.setItem('user_info', JSON.stringify(res.data?.data));
      hanldeSetUserData();
    });
  }

  const handleUploadAvatar = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadAvatar(file);
    }
  };

  return (
    <div>
      <div className="mx-auto bg-white w-[700px] h-[370px] rounded-3xl p-3 flex">
        <div className="mr-3">
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            accept="image/*"
          />
          <div className="cover-image relative h-[200px]" onClick={handleUploadAvatar}>
            <CameraOutlined className="camera absolute bottom-[50%] right-[50%] translate-x-[50%] translate-y-[50%] text-white" />
            <img
              className="avatar-image"
              src={userData.avatar ? userData.avatar : userAvatar}
              alt="avatar"
            />
          </div>
        </div>
        <div>
          <div className="text-center uppercase font-bold text-primary mb-3 text-[30px] ">
            <p>Thông tin cá nhân</p>
          </div>
          <div className="my-auto text-[20px] max-w-[400px]">
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
              <span className="font-bold">
                {userData.id ? `${userData?.department?.name}` : ''}
              </span>
            </p>
            <p>
              Vai trò:{' '}
              <span className="font-bold">{userData.id ? `${userData?.role?.name}` : ''}</span>
            </p>
          </div>
          <div className="flex mt-3">
            <Button onClick={() => setOpenModalFormPassword(true)}>Đổi mật khẩu</Button>
            <Button onClick={() => setOpenModalFormUser(true)}>Cập nhật thông tin</Button>
          </div>
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
