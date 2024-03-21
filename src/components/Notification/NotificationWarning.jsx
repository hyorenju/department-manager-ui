import { notification } from 'antd';

export function NotificationWarning({ description }) {
  return (
    <>
      <div>
        {notification.warning({
          placement: 'topRight',
          message: 'Cảnh báo',
          description: description,
          duration: 3,
        })}
      </div>
    </>
  );
}
