import React from 'react';
import { Modal, Form, Input, Button, Typography } from 'antd';

const { Title } = Typography;

interface FormConfigItem {
  name: string;
  label: string;
}
interface CustomModalProps {
  title: string;
  visible: boolean;
  onCancel: () => void;
  formId: string;
  formConfig: FormConfigItem[];
  onFinish: (values: any) => void;
}
const CustomModal: React.FC<CustomModalProps> = ({
  title,
  visible,
  onCancel,
  formId,
  formConfig,
  onFinish,
}) => {
  const [form] = Form.useForm();

  const handleFinish = () => {
    form.validateFields().then((values) => {
      form.resetFields();
      onFinish(values);
    });
  };

  return (
    <Modal
      title={<Title level={2}>{title}</Title>}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key='cancel' onClick={onCancel}>
          Cancel
        </Button>,
        <Button key='submit' type='primary' form={formId} htmlType='submit'>
          Submit
        </Button>,
      ]}
    >
      <Form form={form} id={formId} onFinish={handleFinish}>
        {formConfig.map((item) => (
          <Form.Item
            key={item.name}
            name={item.name}
            label={item.label}
            rules={[{ required: true, message: `Please enter ${item.label}` }]}
          >
            <Input type='text' />
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export default CustomModal;