import { message } from 'antd';
import { notificationError } from '../Notification';

export const messageErrorToSever = (res, notification) => {
  if (res && res.error?.code === 2) {
    // eslint-disable-next-line no-lone-blocks
    {
      res.error?.errorDetailList?.forEach((e) => message.error(e.message));
    }
  } else if (res && res.success === false && res.error?.code === 500) {
    notificationError(res.error?.message);
  } else if (res && res.success === false && res.error?.code === 3) {
    message.error(res.error?.message);
  } else {
    notificationError(notification);
  }
};
