import React from 'react';
import { Form, Input, Button } from 'antd';
import './Room.css';

interface FormAdd {
  onFinish: (values: any) => void;
  onCancel: () => void;
}

const FormAddRoom: React.FC<FormAdd> = ({ onFinish, onCancel }) => {
  const [form] = Form.useForm();

  const handleCancel = () => {
    onCancel();
    form.resetFields();
  };

  return (
    <Form form={form} onFinish={onFinish} preserve={false}>
      <Form.Item
        name='room_name'
        label='Room Name:'
        rules={[
          {
            required: true,
            message: 'Room name cannot be empty',
          },
        ]}
      >
        <Input type='text' />
      </Form.Item>
      <Form.Item
        name='description'
        label='Description:'
        rules={[
          {
            required: true,
            message: 'Description cannot be empty',
          },
        ]}
      >
        <Input type='text' />
      </Form.Item>
      <Form.Item>
        <Button type='primary' htmlType='submit' className='btnClick'>
          Add
        </Button>
        <Button htmlType='button' onClick={handleCancel}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormAddRoom;
