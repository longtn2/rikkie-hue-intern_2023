import React, { useEffect } from 'react';
import { Form, Input, Button, FormInstance, Row, Col } from 'antd';

interface Room {
  room_id: number;
  room_name: string;
  description: string | null;
  is_blocked: boolean;
}

interface FormEdit {
  getInitialValues: () => Room | null;
  onFinish: (values: any) => void;
  onCancel: () => void;
  form: FormInstance;
}

const FormEditRoom: React.FC<FormEdit> = ({
  getInitialValues,
  onFinish,
  onCancel,
  form,
}) => {
  const initialValues: Room | null = getInitialValues();
  console.log(initialValues?.description);
  useEffect(() => {
    form.resetFields();
    getInitialValues();
  }, [initialValues]);
  const handleCancel = () => {
    onCancel();
    form.resetFields();
  };

  const handelFinish = (values: any) => {
    if (values) {
      form.resetFields();
      onFinish(values);
    }
  };

  return (
    <Form
      form={form}
      initialValues={{
        room_name: initialValues?.room_name,
        description: initialValues?.description,
      }}
      onFinish={handelFinish}
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
          Update
        </Button>
      </Form.Item>
    </Form>
  );
};
export default FormEditRoom;
