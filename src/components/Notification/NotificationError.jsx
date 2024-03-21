import { notification } from 'antd';

export const notificationError = (description) => {
  notification.error({
    duration: 3,
    message: 'Thất bại',
    placement: 'topRight',
    description: description,
  });
};
