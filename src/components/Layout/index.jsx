import {
  LineOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PoweroffOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Layout, Menu, Space, Tooltip, Typography, Popover, Divider } from 'antd';
import Cookies from 'js-cookie';
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import userAvatar from '../../assets/img/user.png';
import { ButtonCustom } from '../ButtonCustom';

function LoginSuccess() {
  const { Title } = Typography;
  const navigate = useNavigate();
  const { Header, Sider, Content } = Layout;
  const userData = JSON.parse(sessionStorage.getItem('user_info'));
  const roleId = JSON.parse(sessionStorage.getItem('user_role'));
  const [hideLayout, setHideLayout] = useState(false);

  const handleClickItemMenu = ({ key }) => {
    navigate(key);
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
          getItem('Danh sách người dùng', `/manage/user`),
          getItem('Danh sách lớp', `/manage/class`),
          getItem('Danh sách môn học', `/manage/subject`),
          getItem('Quản lý đề tài thực tập', `/manage/intern`),
          getItem('Quản lý giảng dạy và điểm', `/manage/teaching`),
          getItem('Quản lý lịch coi thi', `/manage/exam`),
          getItem('Danh sách công việc', `/manage/project`),
        ];
      case 'MANAGER':
        return [
          getItem('Quản lý người dùng', `/manage/user`),
          getItem('Quản lí lớp', `/manage/class`),
          getItem('Quản lí môn học', `/manage/subject`),
          getItem('Quản lí đề tài thực tập', `/manage/intern`),
          getItem('Quản lý giảng dạy và điểm', `/manage/teaching`),
          getItem('Quản lý lịch coi thi', `/manage/exam`),
          getItem('Quản lý công việc', `/manage/project`),
        ];
      case 'DEPUTY':
        return [
          getItem('Quản lý người dùng', `/manage/user`),
          getItem('Quản lí lớp', `/manage/class`),
          getItem('Quản lí môn học', `/manage/subject`),
          getItem('Quản lí đề tài thực tập', `/manage/intern`),
          getItem('Quản lý giảng dạy và điểm', `/manage/teaching`),
          getItem('Quản lý lịch coi thi', `/manage/exam`),
          getItem('Quản lý công việc', `/manage/project`),
        ];
      case 'DEAN':
        return [
          getItem('Quản lý người dùng', `/manage/user`),
          getItem('Quản lí lớp', `/manage/class`),
          getItem('Quản lí môn học', `/manage/subject`),
          getItem('Quản lí đề tài thực tập', `/manage/intern`),
          getItem('Quản lý giảng dạy và điểm', `/manage/teaching`),
          getItem('Quản lý lịch coi thi', `/manage/exam`),
          getItem('Danh sách bộ môn', `/manage/department`),
        ];
      case 'PRINCIPAL':
        return [
          getItem('Quản lý người dùng', `/manage/user`),
          getItem('Quản lí lớp', `/manage/class`),
          getItem('Quản lí môn học', `/manage/subject`),
          getItem('Quản lí đề tài thực tập', `/manage/intern`),
          getItem('Quản lý giảng dạy và điểm', `/manage/teaching`),
          getItem('Quản lý lịch coi thi', `/manage/exam`),
          getItem('Danh sách khoa', `/manage/faculty`),
          getItem('Danh sách bộ môn', `/manage/department`),
          getItem('Thống kê', `/manage/statistic`),
        ];
      default:
        return [];
    }
  };

  const content = (
    <div className="text-lg">
      <div className="hover:bg-indigo-100 rounded-md p-1">
        <a className="hover:text-black" href="/manage/profile">
          Quản lý tài khoản
        </a>
      </div>
      <div className="hover:bg-indigo-100 rounded-md p-1">
        <a className="hover:text-black" href="/manage/work">
          Công việc phải làm
        </a>
      </div>
      <Divider className="my-2"></Divider>
      <div className=" w-[180px] hover:bg-indigo-100 rounded-md p-1">
        <a className="hover:text-black" href="/instruction">
          Hướng dẫn sử dụng
        </a>
      </div>
      <div className="hover:bg-indigo-100 rounded-md p-1">
        <a className="hover:text-black" href="/" onClick={handleClickLogout}>
          Đăng xuất
        </a>
      </div>
    </div>
  );

  return (
    <div className="p-1 bg-white">
      <Layout className="h-[98.5vh] p-0">
        <Sider hidden={hideLayout} style={{ borderRadius: '6px' }} width={230}>
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
        <Layout className="ml-1">
          <Header theme="dark" className="rounded-md flex justify-between items-center p-8">
            <div className="flex">
              <Button
                className="text-black bg-gray-400 border-white"
                onClick={() => {
                  if (hideLayout) {
                    setHideLayout(false);
                  } else if (!hideLayout) {
                    setHideLayout(true);
                  }
                }}
                icon={hideLayout ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              />
              <Title
                style={{
                  color: '#fff',
                  marginBottom: 0,
                  textTransform: 'uppercase',
                  marginLeft: '12px',
                }}
                level={3}
              >
                Bộ môn {userData?.department?.name}
              </Title>
            </div>
            <Space size={24}>
              <Popover content={content} trigger={'click'}>
                <Avatar
                  className="bg-white cursor-pointer mr-6"
                  shape="circle"
                  size={40}
                  src={<img src={userData.avatar ? userData.avatar : userAvatar} alt={'avatar'} />}
                />
              </Popover>
            </Space>
          </Header>
          <Content className="mt-2 px-4 pt-2 bg-slate-200 rounded-md overflow-y-auto">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default LoginSuccess;
