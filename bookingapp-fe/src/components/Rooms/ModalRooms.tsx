import { Form, Input, Button } from 'antd';

interface MyFormProps {
  onFinish: (values: any) => void;
  onCancel: () => void;
}

const MyForm: React.FC<MyFormProps> = ({ status, onFinish, onCancel }) => {
  const { form } = Form.useForm();
  const handleCancel = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    onCancel();
    form.resetFields();
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item name='room_name' label='Room Name:'>
        <Input type='text' />
      </Form.Item>
      <Form.Item name='description' label='Description:'>
        <Input type='text' />
      </Form.Item>
      <Form.Item>
        <Button type='primary' htmlType='submit' style={{ marginRight: '5px' }}>
          {status === 'update' ? 'Save Changes' : 'Add'}
        </Button>
        <Button htmlType='button' onClick={handleCancel}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default MyForm;
