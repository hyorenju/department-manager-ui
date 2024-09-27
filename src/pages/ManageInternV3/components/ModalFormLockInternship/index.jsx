import { ModalForm, ProForm, ProFormSelect } from '@ant-design/pro-components';
import { message, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  createIntern,
  getMasterDataSelection,
  lockInternList,
  lockInternshipList,
} from '../../../../api/axios';
import { notificationError } from '../../../../components/Notification';

export function ModalFormLockInternship({ onSuccess, openForm, onChangeClickOpen }) {
  const handleLockInternList = (values) => {
    lockInternshipList(values).then((res) => {
      if (res.data?.success === true) {
        onSuccess();
        notification.success({
          message: 'Thành công',
          description: 'Cập nhật thành công',
          duration: 3,
        });
      } else if (res.data?.error?.code === 500) {
        notificationError(res.data?.error?.message);
      }
    });
  };

  const [schoolYearSelection, setSchoolYearSelection] = useState([]);
  useEffect(() => {
    if (openForm) {
      getMasterDataSelection({ type: 'SCHOOL_YEAR' }).then((res) => {
        if (res.data?.success) {
          const newArr = [];
          res.data?.data?.items?.map((item) => newArr.push({ label: item?.name, value: item?.id }));
          setSchoolYearSelection(newArr);
        }
      });
    }
  }, [openForm]);

  return (
    <div>
      <ModalForm
        width={700}
        title={'Khóa danh sách đề tài thực tập'}
        modalProps={{
          maskClosable: false,
          destroyOnClose: true,
          okText: 'Đồng ý',
          cancelText: 'Hủy',
        }}
        open={openForm}
        onFinish={(values) => handleLockInternList(values)}
        onOpenChange={onChangeClickOpen}
      >
        <ProForm.Group>
          <ProFormSelect
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            width="sm"
            rules={[{ required: true, message: 'Không được để trống' }]}
            name="wantLock"
            label="Tùy chọn"
            placeholder="Tùy chọn"
            options={[
              { label: 'Khóa', value: true },
              { label: 'Mở khóa', value: false },
            ]}
          />
          <ProFormSelect
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            width="sm"
            rules={[{ required: true, message: 'Không được để trống' }]}
            name={'schoolYearId'}
            label="Năm học"
            placeholder="Chọn năm học"
            options={schoolYearSelection}
          />
          <ProFormSelect
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            width="xs"
            rules={[{ required: true, message: 'Không được để trống' }]}
            name="term"
            label="Học kỳ"
            placeholder="Chọn HK"
            options={[
              { label: 1, value: 1 },
              { label: 2, value: 2 },
            ]}
          />
        </ProForm.Group>
      </ModalForm>
    </div>
  );
}
