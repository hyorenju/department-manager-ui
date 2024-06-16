import { Input, Select, Space } from 'antd';
import { useState } from 'react';
import { ButtonCustom } from '../../components/ButtonCustom';
// import { Column } from '@ant-design/plots';

function Statistic() {
  const [condition, setCondition] = useState(null);
  const [display, setDisplay] = useState('none');

  const data = [
    { termId: '2019-2020 kỳ 1', quantity: 3 },
    { termId: '2019-2020 kỳ 2', quantity: 4 },
    { termId: '2020-2021 kỳ 1', quantity: 3 },
    { termId: '2020-2021 kỳ 2', quantity: 5 },
    { termId: '2021-2022 kỳ 1', quantity: 4 },
    { termId: '2021-2022 kỳ 2', quantity: 6 },
    { termId: '2022-2023 kỳ 1', quantity: 7 },
    { termId: '2022-2023 kỳ 2', quantity: 9 },
    { termId: '2023-2024 kỳ 1', quantity: 13 },
  ];

  const config = {
    data,
    xField: 'termId',
    yField: 'quantity',
    // label: {
    //   position: 'middle',
    //   style: {
    //     fill: '#FFFFFF',
    //     opacity: 0.6,
    //   },
    // },
    columnStyle: {
      fill: 'red',
      fillOpacity: 0.5,
      stroke: 'black',
      lineWidth: 1,
      shadowColor: 'black',
      shadowBlur: 10,
      shadowOffsetX: 5,
      shadowOffsetY: 5,
      cursor: 'pointer',
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: true,
      },
    },
  };

  return (
    <div>
      <h2 className="text-rose-600 text-[20px] font-bold uppercase text-center">
        Tính năng này đang phát triển
      </h2>
      <div className="gap-4 mb-3">
        <Space className="flex block">
          <p className="text-lg">Thống kê theo</p>
          <Select
            className="w-[350px]"
            size="large"
            placeholder="---Chọn tiêu chí---"
            options={[
              {
                label: '---Chọn tiêu chí---',
                value: null,
              },
              {
                label: 'Giảng viên',
                value: 'user',
              },
              {
                label: 'Bộ môn',
                value: 'department',
              },
            ]}
            onChange={(e) => {
              setCondition(e);
              e === null ? setDisplay('none') : setDisplay(display);
            }}
          />
          {condition === 'user' && (
            <>
              <p className="ml-9 text-lg">Nhập mã người dùng</p>
              <Input className="w-[350px]" size="large" placeholder="Mã người dùng" />
            </>
          )}
          {condition === 'department' && (
            <>
              <p className="ml-9 text-lg">Nhập mã bộ môn</p>
              <Input className="w-[350px]" size="large" placeholder="Mã bộ môn" />
            </>
          )}
        </Space>

        {condition !== null && (
          <Space className="block flex mt-3">
            <p className="text-lg">Chọn khoảng thời gian:</p>
            <Select
              className="w-[350px]"
              size="large"
              placeholder="Từ"
              options={[
                {
                  label: 'Năm 2019-2020',
                  value: '2019-2020',
                },
                {
                  label: 'Năm 2020-2021',
                  value: '2020-2021',
                },
                {
                  label: 'Năm 2021-2022',
                  value: '2021-2022',
                },
                {
                  label: 'Năm 2022-2023',
                  value: '2022-2023',
                },
                {
                  label: 'Năm 2023-2024',
                  value: '2023-2024',
                },
              ]}
              onChange={(e) => {
                setCondition(e);
              }}
            />
            <p> - </p>
            <Select
              className="w-[350px] mr-9"
              size="large"
              placeholder="Đến"
              options={[
                {
                  label: 'Năm 2019-2020',
                  value: '2020-2021',
                },
                {
                  label: 'Năm 2020-2021',
                  value: '2020-2021',
                },
                {
                  label: 'Năm 2021-2022',
                  value: '2021-2022',
                },
                {
                  label: 'Năm 2022-2023',
                  value: '2022-2023',
                },
                {
                  label: 'Năm 2023-2024',
                  value: '2023-2024',
                },
              ]}
              onChange={(e) => {
                setCondition(e);
              }}
            />
            <ButtonCustom
              title={'Tìm kiếm'}
              size={'large'}
              type="primary"
              handleClick={() => {
                setDisplay('block');
              }}
            />
          </Space>
        )}
      </div>

      <div style={{ display: `${display}` }}>
        {/* <Column {...config} /> */}
        <p
          style={{
            display: 'block',
            textAlign: 'center',
            opacity: 0.8,
            marginTop: '10px',
            paddingBottom: '10px',
          }}
          italic
        >
          Biểu đồ số lượng môn giảng dạy qua từng học kỳ
        </p>
      </div>

      {/* {condition !== null && (
        <ButtonCustom title={'Tìm kiếm'} size={'large'} type="primary" handleClick={() => {}} />
      )} */}
    </div>
  );
}

export default Statistic;
