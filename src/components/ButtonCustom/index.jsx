import { Button } from 'antd';

export function ButtonCustom({
  handleClick,
  title,
  icon,
  type = 'default',
  size,
  loading = false,
  disabled = false,
  danger = false,
}) {
  return (
    <Button
      danger={danger}
      disabled={disabled}
      loading={loading}
      className="flex justify-center items-center bg-white shadow-lg"
      icon={icon}
      onClick={handleClick}
      type={type}
      size={size}
    >
      {title}
    </Button>
  );
}
