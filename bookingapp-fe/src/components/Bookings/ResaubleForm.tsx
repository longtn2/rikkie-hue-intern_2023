import { Form, Select, DatePicker, Input, Button } from 'antd';
import moment from 'moment';

interface Room {
  room_id: number;
  room_name: string;
  description: string | null;
  is_blocked: boolean;
}

interface DataType {
  user_id: number;
  role_id: number[];
  user_name: string;
  role_name: string[];
  phone_number: string;
  email: string;
}

interface TypeSubmit {
  onSubmit: (values: any) => void;
  timeStart: moment.Moment | null;
  timeEnd: moment.Moment | null;
  rooms: Room[];
  onCancel: () => void;
  users: DataType[] | null;
}

const ReusableForm: React.FC<TypeSubmit> = ({
  onSubmit,
  onCancel,
  timeStart,
  timeEnd,
  rooms,
  users,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    onSubmit(values);
    form.resetFields();
  };

  const handleCancel = () => {
    onCancel();
    form.resetFields();
  }

  return (
    <Form form={form} onFinish={handleSubmit} preserve={false}>
      <Form.Item
        name='room_id'
        label='Room'
        rules={[{ required: true, message: 'Room is not empty' }]}
      >
        <Select placeholder='Select a room'>
          {rooms.map(room => (
            <Select.Option key={room.room_id} value={room.room_id}>
              {room.room_name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
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
        rules={[{ required: true, message: 'Time start is not empty' }]}
        initialValue={timeStart}
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
        rules={[{ required: true, message: 'Time end is not empty' }]}
        initialValue={timeEnd}
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
        rules={[{ required: true, message: 'Title is not empty' }]}
      >
        <Input type='text' />
      </Form.Item>
      <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          htmlType='button'
          onClick={handleCancel}
          className = 'button'
        >
          Cancel
        </Button>
        <Button type='primary' htmlType='submit'>
          Create
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ReusableForm;
