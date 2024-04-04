import { PoweroffOutlined } from '@ant-design/icons';
import { Avatar, Button, Layout, Menu, Space, Tooltip, Typography } from 'antd';
import Cookies from 'js-cookie';
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import userAvatar from '../../assets/img/user.png';

function LoginSuccess(props) {
  const { Title } = Typography;
  const navigate = useNavigate();
  const { Header, Sider, Content } = Layout;
  const userData = JSON.parse(sessionStorage.getItem('user_info'));

  const handleClickItemMenu = ({ key }) => {
    navigate(key);
  };

  const handleClickAvatar = () => {
    navigate(`/user`);
  };

  const handleClickLogout = () => {
    Cookies.remove('access_token');
    sessionStorage.removeItem('user_info');
    navigate('/');
  };

  const getItem = (label, key, icon, children, type) => {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  };

  const items = [
    getItem('Quản lý người dùng', `/manager/user`),
    getItem('Quản lí lớp', `/manager/class`),
    getItem('Quản lí môn học', `/manager/subject`),
    getItem('Quản lí đề tài thực tập', `/manager/intern`),
    getItem('Phân công giảng dạy', `/manager/teaching`),
    getItem('Phân công coi và chấm thi', `/manager/exam`),
  ];

  return (
    <div className="p-1 bg-white">
      <Layout className="h-[98vh]">
        <Sider style={{ borderRadius: '6px' }} width={250}>
          <div className="py-3 px-6 flex justify-center items-center border-b-2 border-stone-50">
            <Title style={{ color: '#fff', marginBottom: 0, width: 150 }} level={4}>
              {userData?.lastName ? `${userData?.lastName}` : 'Nhìn cái deso gì'}
            </Title>
          </div>
          <Menu
            triggerSubMenuAction={'click'}
            onClick={handleClickItemMenu}
            className="rounded-md mt-1"
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[window.location.pathname]}
            items={items}
          />
        </Sider>
        <Layout className="site-layout ml-2">
          <Header theme="dark" className="rounded-md flex justify-between items-center p-8 ">
            <Title style={{ color: '#fff', marginBottom: 0, textTransform: 'uppercase' }} level={2}>
              Bộ môn {userData?.department?.name}
            </Title>
            <Space size={24}>
              <Tooltip title="Thông tin cá nhân">
                <Avatar
                  className="bg-white cursor-pointer"
                  shape="circle"
                  size={40}
                  onClick={handleClickAvatar}
                  src={
                    <img src={userData?.avatar ? userData?.avatar : userAvatar} alt={'avatar'} />
                  }
                />
              </Tooltip>
              <Tooltip title="Đăng xuất">
                <Button
                  className="flex justify-center items-center text-white text-xl border-none"
                  shape="circle"
                  icon={<PoweroffOutlined />}
                  onClick={handleClickLogout}
                ></Button>
              </Tooltip>
            </Space>
          </Header>
          <Content className="mt-2 p-6 pb-0 bg-slate-200 rounded-md max-h-[91vh] overflow-y-auto">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default LoginSuccess;
