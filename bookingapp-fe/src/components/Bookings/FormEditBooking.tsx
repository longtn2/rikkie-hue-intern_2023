import { Form, Select, DatePicker, Input, Button, FormInstance } from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import './Booking.css';
import { BookingDataCalendar, BookingDataApi } from '../../constant/constant';

interface FormEditBooking {
  onFinish: (values: BookingDataApi) => void;
  getInitialValues: () => BookingDataCalendar | null;
  onCancel: () => void;
  users: DataType[] | null;
  form: FormInstance;
}

interface DataType {
  user_id: number;
  role_id: number[];
  user_name: string;
  role_name: string[];
  phone_number: string;
  email: string;
}

const FormEditBooking: React.FC<FormEditBooking> = ({
  onFinish,
  onCancel,
  getInitialValues,
  users,
  form,
}) => {
  const initialValues: BookingDataCalendar | null = getInitialValues();
  const [timeStart, setTimeStart] = useState<dayjs.Dayjs | null>(
    initialValues?.start ? dayjs(initialValues.start) : null
  );
  const [timeEnd, setTimeEnd] = useState<dayjs.Dayjs | null>(
    initialValues?.end ? dayjs(initialValues.end) : null
  );

  useEffect(() => {
    getInitialValues();
    form.resetFields();
    setTimeStart(initialValues?.start ? dayjs(initialValues.start) : null);
    setTimeEnd(initialValues?.end ? dayjs(initialValues.end) : null);
  }, [getInitialValues]);

  const handleCancel = () => {
    onCancel();
  };

  const handleFinish = (values: any) => {
    const updatedValues = {
      ...values,
      time_start: timeStart ? timeStart.format('YYYY-MM-DD HH:mm') : null,
      time_end: timeEnd ? timeEnd.format('YYYY-MM-DD HH:mm') : null,
    };
    onFinish(updatedValues);
  };

  const handleTimeStartChange = (value: dayjs.Dayjs | null) => {
    setTimeStart(value ? dayjs(value) : null);
  };

  const handleTimeEndChange = (value: dayjs.Dayjs | null) => {
    setTimeEnd(value ? dayjs(value) : null);
  };

  return (
    <>
      <Form
        form={form}
        onFinish={handleFinish}
        initialValues={{
          user_ids: initialValues?.user_ids,
          user_names: initialValues?.user_names,
          room_id: initialValues?.room_id,
          title: initialValues?.title,
        }}
        preserve={false}
        labelCol={{ span: 5 }}
        labelAlign='left'
        wrapperCol={{ flex: 4 }}
      >
        <Form.Item
          name='user_ids'
          label='Employees'
          rules={[{ required: true, message: 'Employees is not empty' }]}
        >
          <Select
            mode='multiple'
            placeholder='Select employees'
            optionLabelProp='label'
          >
            {users?.map(user => (
              <Select.Option
                key={user.user_id}
                value={user.user_id}
                label={user.user_name}
              >
                {user.user_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name='time_start'
          label='Start Time'
          rules={[
            {
              required: true,
              message: 'Time start is not required',
            },
          ]}
          initialValue={dayjs(initialValues?.start)}
        >
          <DatePicker
            showTime
            format='YYYY-MM-DD HH:mm'
            allowClear={true}
            picker='date'
            placeholder='Select start time'
            value={timeStart}
            onChange={handleTimeStartChange}
          />
        </Form.Item>
        <Form.Item
          name='time_end'
          label='End Time'
          rules={[
            {
              required: true,
              message: 'Time end is not required',
            },
          ]}
          initialValue={dayjs(initialValues?.end)}
        >
          <DatePicker
            showTime
            format='YYYY-MM-DD HH:mm'
            allowClear={true}
            picker='date'
            placeholder='Select end time'
            value={timeEnd}
            onChange={handleTimeEndChange}
          />
        </Form.Item>
        <Form.Item
          name='title'
          label='Title'
          rules={[
            {
              required: true,
              message: 'Title is not required',
            },
          ]}
        >
          <Input type='text' />
        </Form.Item>
        <Form.Item className='modal-container-item'>
          <Button
            htmlType='button'
            onClick={handleCancel}
            className='btn-right'
          >
            Cancel
          </Button>
          <Button type='primary' htmlType='submit'>
            Update
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default FormEditBooking;
