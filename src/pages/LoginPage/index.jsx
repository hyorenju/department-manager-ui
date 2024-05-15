import { useMutation } from '@tanstack/react-query';
import { Button, Form, Input } from 'antd';
import Cookies from 'js-cookie';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { visitor } from '../../api/visitor/visitorApi';
import { notificationError, notificationSuccess } from '../../components/Notification';
import logofita from '../../assets/logo/logofita.png';
import logovnua from '../../assets/logo/logovnua.png';

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = useMutation({
    mutationKey: ['login'],
    mutationFn: async (values) => {
      try {
        const res = await visitor.login(values);
        if (res) return res;
      } catch (error) {}
    },

    onSuccess: (res) => {
      if (res && res.success === true && res.data) {
        Cookies.set('access_token', res.data.jwt);
        if (
          res.data.roleId === 'PRINCIPAL' ||
          res.data.roleId === 'DEAN' ||
          res.data.roleId === 'MANAGER' ||
          res.data.roleId === 'LECTURER' ||
          res.data.roleId === 'DEPUTY'
        ) {
          sessionStorage.setItem('user_info', JSON.stringify(res.data));
          sessionStorage.setItem('user_role', JSON.stringify(res.data?.roleId));
          notificationSuccess('Đăng nhập thành công');
          navigate(`/manage`);
        }
      } else if (res && res.success === false && res.error.code === 500) {
        notificationError(res.error.message);
      }
    },

    onError: (error) => {
      notificationError('Đăng nhập thất bại');
    },
  });

  const onFinish = (values) => {
    handleLogin.mutate(values);
  };

  return (
    <div className="h-[80vh] flex absolute right-[50%] bottom-[50%] translate-x-[50%] translate-y-[50%]">
      <div className="max-xl:hidden relative w-[25vw] bg-sky-900 border-solid border-sky-900 border-y-2 border-l-2 rounded-l-lg">
        <div className="relative text-center mt-16 mx-auto w-5/6">
          <p className="text-white">{'Học viện Nông nghiệp Việt Nam'}</p>
          <p className="text-white">{'Khoa Công nghệ thông tin'}</p>
          <div className="flex absolute right-[50%] translate-x-[40%] mt-2">
            <img className="w-20 mr-4" src={logovnua} alt="Logo FITA" />
            <img className="w-20" src={logofita} alt="Logo FITA" />
          </div>
          <h1 className="text-3xl font-bold text-white mt-28">WEBSITE</h1>
          <h1 className="text-3xl font-bold text-white">QUẢN LÝ BỘ MÔN</h1>
        </div>
        <div className="absolute left-[15%] bottom-30 mx-auto w-4/6">
          <p className="text-sm italic text-white mt-20">{'(*) Sinh viên khóa 65 khoa CNTT'}</p>
          <p className="text-sm italic text-white">{'654661 - Cam Trọng Hiếu'}</p>
        </div>
      </div>
      <div className="w-[25vw] max-xl:w-[80vh] border-solid border-sky-900 border-2 rounded-r-lg">
        <div className="text-center mt-36 mx-auto w-3/5">
          <h1 className="text-3xl font-bold text-sky-900">ĐĂNG NHẬP</h1>
        </div>
        <div className="w-[93%]">
          <Form
            className="mt-12 mx-auto"
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              maxWidth: 600,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="Tài khoản"
              name="id"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tài khoản!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mật khẩu!',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            {/* <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item> */}

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
