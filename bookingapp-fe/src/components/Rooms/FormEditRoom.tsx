import React from 'react';
import { Form, Input, Button } from 'antd';

interface Room {
  room_id: number;
  room_name: string;
  description: string | null;
  is_blocked: boolean;
}

interface FormEdit {
  initialValues: Room;
  onFinish: (values: any) => void;
  onCancel: () => void;
}

const FormEditRoom: React.FC<FormEdit> = ({
  initialValues,
  onFinish,
  onCancel,
}) => {
  const [form] = Form.useForm();

  const handleCancel = () => {
    onCancel();
    form.resetFields();
  };

  return (
    <Form form={form} initialValues={initialValues} onFinish={onFinish}>
      <Form.Item name='room_name' label='Room Name: '>
        <Input type='text' className='input' />
      </Form.Item>
      <Form.Item name='description' label='Description: '>
        <Input type='text' className='input' />
      </Form.Item>
      <Form.Item>
        <Button type='primary' htmlType='submit' className='btnClick'>
          Save Changes
        </Button>
        <Button htmlType='button' onClick={handleCancel}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};
export default FormEditRoom;
