import { Form, Select, DatePicker, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { getProjectList, getUserSelection } from '../../../../api/axios';

export function FormFilterProject({ userSelection, statusSelection }) {
  const [createdBy, setCreatedBy] = useState();
  const [startDate, setStartDate] = useState();
  const [startDateSearch, setStartDateSearch] = useState();
  const [endDate, setEndDate] = useState();
  const [endDateSearch, setEndDateSearch] = useState();
  const [memberId, setMemberId] = useState();
  const [statusId, setStatusId] = useState();
  const [loadingTable, setLoadingTable] = useState(false);

  const onReset = () => {
    setCreatedBy(null);
    setStartDateSearch(null);
    setStartDate(null);
    setEndDateSearch(null);
    setEndDate(null);
    setMemberId(null);
    setStatusId(null);
  };

  return (
    <div className="font-semibold ">
      <Form className="w-[450px]">
        <Form.Item label="Tìm theo người tạo">
          <Select options={userSelection} onChange={setCreatedBy} value={createdBy}></Select>
        </Form.Item>
        <div className="flex">
          <Form.Item label="Từ ngày">
            <DatePicker
              value={startDateSearch}
              placeholder="Chọn ngày"
              format={'DD/MM/YYYY'}
              onChange={(e) => {
                setStartDateSearch(e);
                setStartDate(`${e.$D}/${e.$M + 1}/${e.$y}`);
              }}
            />
          </Form.Item>
          <Form.Item className="ml-2" label="- đến ngày">
            <DatePicker
              value={endDateSearch}
              placeholder="Chọn ngày"
              format={'DD/MM/YYYY'}
              onChange={(e) => {
                setEndDateSearch(e);
                setEndDate(`${e.$D}/${e.$M + 1}/${e.$y}`);
              }}
            />
          </Form.Item>
        </div>
        <Form.Item label="Tìm theo thành viên">
          <Select options={userSelection} onChange={setMemberId} value={memberId}></Select>
        </Form.Item>
        <Form.Item label="Tìm theo trạng thái">
          <Select options={statusSelection} onChange={setStatusId} value={statusId}></Select>
        </Form.Item>
        <Form.Item
          className="mb-0"
          wrapperCol={{
            offset: 16,
          }}
        >
          <div className="flex">
            <Button htmlType="button" onClick={onReset}>
              Bỏ lọc
            </Button>
            <Button type="primary" htmlType="submit">
              Lọc
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}
