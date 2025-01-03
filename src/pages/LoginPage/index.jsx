import { useMutation } from '@tanstack/react-query';
import { Button, Form, Input } from 'antd';
import Cookies from 'js-cookie';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { visitor } from '../../api/visitor/visitorApi';
import { notificationError, notificationSuccess } from '../../components/Notification';
import logofita from '../../assets/logo/logofita.png';
import logovnua from '../../assets/logo/logovnua.png';

function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập
    const userInfo = localStorage.getItem('user_info'); // Hoặc kiểm tra token
    if (userInfo) {
      navigate('/manage/project'); // Chuyển hướng đến Dashboard
    }
  }, [navigate]);

  // const userInfo = JSON.parse(localStorage.getItem('user_info'));
  // if (userInfo) {
  //   navigate(`/manage/project`);
  // }

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
          res.data.role?.id === 'PRINCIPAL' ||
          res.data.role?.id === 'DEAN' ||
          res.data.role?.id === 'MANAGER' ||
          res.data.role?.id === 'LECTURER' ||
          res.data.role?.id === 'DEPUTY'
        ) {
          localStorage.setItem('user_info', JSON.stringify(res.data));
          localStorage.setItem('user_role', JSON.stringify(res.data?.role?.id));
          notificationSuccess('Đăng nhập thành công');
          navigate(`/manage/project`);
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

  const [form] = Form.useForm();

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
        <div className="relative text-center">
          <p className="text-sm italic text-white mt-20">
            {'Nhóm nghiên cứu Bộ môn Khoa học máy tính'}
          </p>
          <p className="text-sm italic text-white">{'Khoa CNTT - Học viện Nông nghiệp Việt Nam'}</p>
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
            form={form}
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
              <Input
                onChange={(item) => {
                  const value = item.target.value.toUpperCase(); // Chuyển đổi thành chữ hoa
                  form.setFieldsValue({ id: value }); // Cập nhật giá trị trong form
                }}
              />
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
