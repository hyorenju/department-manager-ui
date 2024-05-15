import { createMasterData, updateMasterData } from '../../../../../api/axios';
import { ButtonCustom } from '../../../../../components/ButtonCustom';
import { messageErrorToSever } from '../../../../../components/Message';
import { notificationSuccess } from '../../../../../components/Notification';
import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Space } from 'antd';

export function ModalFormDegree({ open, onChangeClickOpen, degreeData, onSuccess }) {
  const queryClient = useQueryClient();

  // handle create degree
  const handleCreateDegree = useMutation({
    mutationKey: ['createDegree'],
    mutationFn: async (values) => createMasterData(values),
    onSuccess: (res) => {
      if (res && res.data?.success === true) {
        onSuccess();
        queryClient.invalidateQueries({
          queryKey: ['degreeList'],
        });
        notificationSuccess('Tạo trình độ thành công');
        onChangeClickOpen(false);
      } else messageErrorToSever(res.data, 'Tạo trình độ thất bại');
    },
  });

  // handle update degree
  const handleUpdateDegree = useMutation({
    mutationKey: ['updateDegree'],
    mutationFn: async (values) => updateMasterData(degreeData.id, values),
    onSuccess: (res) => {
      if (res && res.data?.success === true) {
        onSuccess();
        queryClient.invalidateQueries({
          queryKey: ['degreeList'],
        });
        notificationSuccess('Cập nhật trình độ thành công');
        onChangeClickOpen(false);
      } else messageErrorToSever(res, 'Cập nhật trình độ thất bại');
    },
  });

  return (
    <div>
      <ModalForm
        width={350}
        title={degreeData.id ? 'Cập nhật thông tin trình độ' : 'Thêm trình độ'}
        initialValues={{
          name: degreeData.id ? degreeData.name : null,
          type: degreeData.id ? degreeData.type : 'USER_DEGREE',
        }}
        modalProps={{
          maskClosable: false,
          destroyOnClose: true,
        }}
        submitter={{
          render: (props) => [
            <Space>
              <ButtonCustom
                type="primary"
                handleClick={() => props.submit()}
                title={degreeData.id ? 'Cập nhật' : 'Tạo mới'}
                loading={
                  degreeData.id ? handleUpdateDegree.isLoading : handleCreateDegree.isLoading
                }
              />
              <ButtonCustom title="Hủy" handleClick={() => onChangeClickOpen(false)} />
            </Space>,
          ],
        }}
        open={open}
        onFinish={(values) => {
          if (degreeData.id) {
            handleUpdateDegree.mutate(values);
          } else {
            handleCreateDegree.mutate(values);
          }
        }}
        onOpenChange={onChangeClickOpen}
      >
        <ProForm.Group>
          <ProFormText
            rules={[{ required: true, message: 'Không được để trống' }]}
            width="sm"
            name="name"
            label="Trình độ"
            placeholder="Nhập trình độ"
          />
          <ProFormText name="type" hidden />
        </ProForm.Group>
      </ModalForm>
    </div>
  );
}
