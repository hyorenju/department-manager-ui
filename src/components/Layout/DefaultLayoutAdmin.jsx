import { BellOutlined, PoweroffOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Layout, Menu, Space, Tooltip, Typography } from 'antd';
import Cookies from 'js-cookie';
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export function DefaultLayoutAdmin(props) {
  const { Title } = Typography;
  const navigate = useNavigate();
  const { Header, Sider, Content } = Layout;
  const dataAdmin = JSON.parse(sessionStorage.getItem('info_admin'));
  const handleClickItemMenu = ({ key }) => {
    navigate(key);
  };
  const handleClickAvatar = () => {
    navigate(`/manage/infomation`);
  };
  const handleClickLogout = () => {
    Cookies.remove('access_token');
    sessionStorage.removeItem('info_admin');
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
    getItem('Quản lí sinh viên', `/manage/students`),
    getItem('Quản lí lớp', `/manage/classes`),
    getItem('Quản lí ngành', `/manage/majors`),
    getItem('Quản lí khóa', `/manage/courses`),
    getItem('Quản lí điểm', `/manage/points`),
    getItem('Quản lí học kì', `/manage/semesters`),
    getItem('Quản lí trạng thái sinh viên', `/manage/status`),
    getItem('Quản lí quản trị viên', `/manage/authorization`),
    getItem('Quản lí hiển thị', null, null, [
      getItem('Lỗi nhập dữ liệu', `/manage/news`),
      getItem('Banner', `/manage/banner`),
    ]),
    getItem('Thống kê', `/manage/statistical`),
  ];

  return (
    <div className='p-1 bg-white'>
      <Layout className='min-h-[99vh]'>
        <Sider style={{ borderRadius: '6px' }} width={250}>
          <div className='py-3 px-6 flex justify-center items-center border-b-2 border-stone-50'>
            <Title style={{ color: '#fff', marginBottom: 0, width: 150 }} level={4}>
              {dataAdmin?.name ? `${dataAdmin?.name}` : 'Xin chào Admin'}
            </Title>
          </div>
          <Menu
            triggerSubMenuAction={'click'}
            onClick={handleClickItemMenu}
            className='rounded-md mt-1'
            theme='dark'
            mode='inline'
            defaultSelectedKeys={[window.location.pathname]}
            items={items}
          />
        </Sider>
        <Layout className='site-layout ml-2'>
          <Header theme='dark' className='rounded-md flex justify-between items-center p-8 '>
            <Title style={{ color: '#fff', marginBottom: 0, textTransform: 'uppercase' }} level={2}>
              khoa công nghệ thông tin
            </Title>
            <Space size={24}>
              <Badge count={10} size='small'>
                <Button
                  shape='circle'
                  className='flex justify-center items-center text-white border-none text-xl'
                  icon={<BellOutlined />}
                ></Button>
              </Badge>
              <Tooltip title='Thông tin cá nhân'>
                <Avatar
                  className='bg-white cursor-pointer'
                  shape='circle'
                  size={40}
                  onClick={handleClickAvatar}
                  src={<img src={dataAdmin?.avatar} alt={'avatar'} />}
                />
              </Tooltip>
              <Tooltip title='Đăng xuất'>
                <Button
                  className='flex justify-center items-center text-white text-xl border-none'
                  shape='circle'
                  icon={<PoweroffOutlined />}
                  onClick={handleClickLogout}
                ></Button>
              </Tooltip>
            </Space>
          </Header>
          <Content className='mt-2 p-6 pb-0 bg-slate-200 rounded-md max-h-[91vh] overflow-y-auto'>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}
