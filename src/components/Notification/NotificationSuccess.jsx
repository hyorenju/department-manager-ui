import { notification } from 'antd';

export const notificationSuccess = (description) => {
  notification.success({
    duration: 3,
    message: 'Thành công',
    placement: 'topRight',
    description: description,
  });
};
