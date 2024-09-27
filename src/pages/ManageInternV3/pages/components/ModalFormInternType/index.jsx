import { createMasterData, updateMasterData } from '../../../../../api/axios';
import { ButtonCustom } from '../../../../../components/ButtonCustom';
import { messageErrorToSever } from '../../../../../components/Message';
import { notificationSuccess } from '../../../../../components/Notification';
import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Space } from 'antd';

export function ModalFormInternType({ open, onChangeClickOpen, internTypeData, onSuccess }) {
  const queryClient = useQueryClient();

  // handle create intern type
  const handleCreateInternType = useMutation({
    mutationKey: ['createInternType'],
    mutationFn: async (values) => createMasterData(values),
    onSuccess: (res) => {
      if (res && res.data?.success === true) {
        onSuccess();
        queryClient.invalidateQueries({
          queryKey: ['internList'],
        });
        notificationSuccess('Tạo thành công');
        onChangeClickOpen(false);
      } else messageErrorToSever(res.data, 'Tạo thất bại');
    },
  });

  // handle update intern type
  const handleUpdateInternType = useMutation({
    mutationKey: ['updateInternType'],
    mutationFn: async (values) => updateMasterData(internTypeData.id, values),
    onSuccess: (res) => {
      if (res && res.data?.success === true) {
        onSuccess();
        queryClient.invalidateQueries({
          queryKey: ['internList'],
        });
        notificationSuccess('Cập nhật thành công');
        onChangeClickOpen(false);
      } else messageErrorToSever(res, 'Cập nhật thất bại');
    },
  });

  return (
    <div>
      <ModalForm
        width={350}
        title={internTypeData.id ? 'Cập nhật thông tin loại đề tài' : 'Thêm loại đề tài'}
        initialValues={{
          name: internTypeData.id ? internTypeData.name : null,
          type: internTypeData.id ? internTypeData.type : 'INTERN_TYPE',
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
                title={internTypeData.id ? 'Cập nhật' : 'Tạo mới'}
                loading={
                  internTypeData.id
                    ? handleUpdateInternType.isLoading
                    : handleCreateInternType.isLoading
                }
              />
              <ButtonCustom title="Hủy" handleClick={() => onChangeClickOpen(false)} />
            </Space>,
          ],
        }}
        open={open}
        onFinish={(values) => {
          if (internTypeData.id) {
            handleUpdateInternType.mutate(values);
          } else {
            handleCreateInternType.mutate(values);
          }
        }}
        onOpenChange={onChangeClickOpen}
      >
        <ProForm.Group>
          <ProFormText
            rules={[{ required: true, message: 'Không được để trống' }]}
            width="sm"
            name="name"
            label="Loại đề tài"
            placeholder="Nhập loại đề tài"
          />
          <ProFormText name="type" hidden />
        </ProForm.Group>
      </ModalForm>
    </div>
  );
}
