import { PoweroffOutlined } from '@ant-design/icons';
import { Avatar, Button, Layout, Menu, Space, Tooltip, Typography } from 'antd';
import Cookies from 'js-cookie';
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import userAvatar from '../../assets/img/user.png';

function LoginSuccess() {
  const { Title } = Typography;
  const navigate = useNavigate();
  const { Header, Sider, Content } = Layout;
  const userData = JSON.parse(sessionStorage.getItem('user_info'));
  const roleId = JSON.parse(sessionStorage.getItem('user_role'));

  const handleClickItemMenu = ({ key }) => {
    navigate(key);
  };

  const handleClickAvatar = () => {
    navigate(`/user`);
  };

  const handleClickLogout = () => {
    Cookies.remove('access_token');
    sessionStorage.removeItem('user_info');
    sessionStorage.removeItem('user_role');
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

  const menu = (roleId) => {
    switch (roleId) {
      case 'LECTURER':
        return [
          getItem('Quản lý người dùng', `/manage/user`),
          getItem('Quản lí lớp', `/manage/class`),
          getItem('Quản lí môn học', `/manage/subject`),
          getItem('Quản lí đề tài thực tập', `/manage/intern`),
          getItem('Phân công giảng dạy', `/manage/teaching`),
          getItem('Phân công kỳ thi', `/manage/exam`),
        ];
      case 'MANAGER':
        return [
          getItem('Quản lý người dùng', `/manage/user`),
          getItem('Quản lí lớp', `/manage/class`),
          getItem('Quản lí môn học', `/manage/subject`),
          getItem('Quản lí đề tài thực tập', `/manage/intern`),
          getItem('Phân công giảng dạy', `/manage/teaching`),
          getItem('Phân công kỳ thi', `/manage/exam`),
        ];
      case 'DEPUTY':
        return [
          getItem('Quản lý người dùng', `/manage/user`),
          getItem('Quản lí lớp', `/manage/class`),
          getItem('Quản lí môn học', `/manage/subject`),
          getItem('Quản lí đề tài thực tập', `/manage/intern`),
          getItem('Phân công giảng dạy', `/manage/teaching`),
          getItem('Phân công kỳ thi', `/manage/exam`),
        ];
      case 'DEAN':
        return [
          getItem('Quản lý người dùng', `/manage/user`),
          getItem('Quản lí lớp', `/manage/class`),
          getItem('Quản lí môn học', `/manage/subject`),
          getItem('Quản lí đề tài thực tập', `/manage/intern`),
          getItem('Phân công giảng dạy', `/manage/teaching`),
          getItem('Phân công kỳ thi', `/manage/exam`),
          getItem('Danh sách bộ môn', `/manage/department`),
        ];
      case 'PRINCIPAL':
        return [
          getItem('Quản lý người dùng', `/manage/user`),
          getItem('Quản lí lớp', `/manage/class`),
          getItem('Quản lí môn học', `/manage/subject`),
          getItem('Quản lí đề tài thực tập', `/manage/intern`),
          getItem('Phân công giảng dạy', `/manage/teaching`),
          getItem('Phân công kỳ thi', `/manage/exam`),
          getItem('Danh sách khoa', `/manage/faculty`),
          getItem('Danh sách bộ môn', `/manage/department`),
        ];
      default:
        return [];
    }
  };

  return (
    <div className="p-1 bg-white">
      <Layout className="h-[98vh]">
        <Sider style={{ borderRadius: '6px' }} width={200}>
          <div className="py-3 px-6 flex justify-center items-center border-b-2 border-stone-50">
            <Title style={{ color: '#fff', marginBottom: 0, width: '100%' }} level={4}>
              {userData?.lastName ? `Xin chào ${userData?.lastName}` : 'Xin chào admin'}
            </Title>
          </div>
          <Menu
            triggerSubMenuAction={'click'}
            onClick={handleClickItemMenu}
            className="rounded-md mt-1"
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[window.location.pathname]}
            items={menu(roleId)}
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
