import React from 'react';
import { Form, Input, Button, FormInstance, Col, Row } from 'antd';
import './Room.css';

interface FormAdd {
  onFinish: (values: any) => void;
  onCancel: () => void;
  form: FormInstance;
}

const FormAddRoom: React.FC<FormAdd> = ({ onFinish, onCancel, form }) => {
  const handleCancel = () => {
    onCancel();
    form.resetFields();
  };

  const handleSubmit = (values: any) => {
    onFinish(values);
    form.resetFields();
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      labelCol={{ span: 5 }}
      labelAlign='left'
      preserve={false}
      wrapperCol={{ flex: 4 }}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
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
            <Input type='text' className='form-item-input' />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
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
            <Input type='text' className='form-item-input' />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item className='action-btn'>
        <Button htmlType='button' onClick={handleCancel} className='btn-right'>
          Cancel
        </Button>
        <Button type='primary' htmlType='submit'>
          Add
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormAddRoom;
