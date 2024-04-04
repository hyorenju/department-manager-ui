import { useMutation } from '@tanstack/react-query';
import { Button, Form, Input } from 'antd';
import Cookies from 'js-cookie';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { visitor } from '../../api/visitor/visitorApi';
import { notificationError, notificationSuccess } from '../../components/Notification';

function LoginPage(props) {
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
        // if (res.data.roleId === 'USER') {
        //   sessionStorage.setItem('user_info', JSON.stringify(res.data));
        //   notificationSuccess('Đăng nhập thành công');
        //   navigate(`/user`);
        // } else
        if (res.data.roleId === 'MANAGER' || res.data.roleId === 'LECTURER') {
          sessionStorage.setItem('user_info', JSON.stringify(res.data));
          notificationSuccess('Đăng nhập thành công');
          navigate(`/manager`);
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

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="w-5/6">
      <Form
        className="mt-24 mx-auto"
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
        onFinishFailed={onFinishFailed}
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
  );
}

export default LoginPage;
