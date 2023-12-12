import { Form, Select, DatePicker, Input, Button, Modal } from 'antd';
import moment from 'moment';
import './Booking.css';
import {
  BookingDataCalendar,
  BookingDataApi,
  DataType,
} from '../../constant/constant';
interface FormEditBooking {
  onFinish: (values: BookingDataApi) => void;
  initialValues: BookingDataCalendar | null;
  onCancel: () => void;
  users: DataType[] | null;
}

const FormEditBooking: React.FC<FormEditBooking> = ({
  onFinish,
  onCancel,
  initialValues,
  users,
}) => {
  const [form] = Form.useForm();

  const handleCancel = () => {
    onCancel();
    form.resetFields();
  };

  return (
    <>
      <Form
        form={form}
        onFinish={onFinish}
        initialValues={{
          user_ids: initialValues?.user_ids,
          user_names: initialValues?.user_names,
          room_id: initialValues?.room_id,
          time_start: moment(initialValues?.start),
          time_end: moment(initialValues?.end),
          title: initialValues?.title,
        }}
        preserve={false}
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
        >
          <DatePicker
            showTime
            format='YYYY-MM-DD HH:mm'
            placeholder='Select start time'
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
        >
          <DatePicker
            showTime
            format='YYYY-MM-DD HH:mm'
            placeholder='Select end time'
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
