import { createMasterData, updateMasterData } from '../../../../../api/axios';
import { ButtonCustom } from '../../../../../components/ButtonCustom';
import { messageErrorToSever } from '../../../../../components/Message';
import { notificationSuccess } from '../../../../../components/Notification';
import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Space } from 'antd';

export function ModalFormExamForm({ open, onChangeClickOpen, examFormData, onSuccess }) {
  const queryClient = useQueryClient();

  // handle create exam form
  const handleCreateExamForm = useMutation({
    mutationKey: ['createExamForm'],
    mutationFn: async (values) => createMasterData(values),
    onSuccess: (res) => {
      if (res && res.data?.success === true) {
        onSuccess();
        queryClient.invalidateQueries({
          queryKey: ['examFormList'],
        });
        notificationSuccess('Tạo thành công');
        onChangeClickOpen(false);
      } else messageErrorToSever(res.data, 'Tạo thất bại');
    },
  });

  // handle update exam form
  const handleUpdateExamForm = useMutation({
    mutationKey: ['updateExamForm'],
    mutationFn: async (values) => updateMasterData(examFormData.id, values),
    onSuccess: (res) => {
      if (res && res.data?.success === true) {
        onSuccess();
        queryClient.invalidateQueries({
          queryKey: ['examFormList'],
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
        title={examFormData.id ? 'Cập nhật thông tin hình thức thi' : 'Thêm hình thức thi'}
        initialValues={{
          name: examFormData.id ? examFormData.name : null,
          type: examFormData.id ? examFormData.type : 'EXAM_FORM',
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
                title={examFormData.id ? 'Cập nhật' : 'Tạo mới'}
                loading={
                  examFormData.id ? handleUpdateExamForm.isLoading : handleCreateExamForm.isLoading
                }
              />
              <ButtonCustom title="Hủy" handleClick={() => onChangeClickOpen(false)} />
            </Space>,
          ],
        }}
        open={open}
        onFinish={(values) => {
          if (examFormData.id) {
            handleUpdateExamForm.mutate(values);
          } else {
            handleCreateExamForm.mutate(values);
          }
        }}
        onOpenChange={onChangeClickOpen}
      >
        <ProForm.Group>
          <ProFormText
            rules={[{ required: true, message: 'Không được để trống' }]}
            width="sm"
            name="name"
            label="Hình thức thi"
            placeholder="Nhập hình thức thi"
          />
          <ProFormText name="type" hidden />
        </ProForm.Group>
      </ModalForm>
    </div>
  );
}
