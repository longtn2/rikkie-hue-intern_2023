import React, { useState } from 'react';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography } from 'antd';
import axios from 'axios';
import { handleErrorShow } from '../../ultils/ultilsApi';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { url } from '../../ultils/urlApi';
import './Form.css';

const { Title, Text } = Typography;

const FormLogin: React.FC = () => {
  const Navigate = useNavigate();
  const [form] = Form.useForm();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    await axios
      .post(url + '/v1/login', values, {
        withCredentials: true,
      })
      .then(res => {
        const token: string = res.data.data[0].token;
        const roles: string[] = res.data.data[1].role_name;
        const name: string = res.data.data[2].user_name;
        const id: number = res.data.data[3].user_id;
        Cookies.set('roles', JSON.stringify(roles));
        Cookies.set('token', token);
        Cookies.set('name', name);
        Cookies.set('id', id.toString());
        if (roles.includes('admin')) {
          Navigate('/');
        } else {
          Navigate('/calendarmeeting');
        }
      })
      .catch(error => {
        handleErrorShow(error);
      });

    setLoading(false);
  };

  const onFinishFailed = (errorInfo: any) => {
    setErrors(
      errorInfo.errorFields.reduce((acc: Record<string, string>, curr: any) => {
        acc[curr.name[0]] = curr.errors[0];
        return acc;
      }, {})
    );
  };
  return (
    <>
      <div className='container'>
        <div className='title'>
          <Title level={2}>Booking Login</Title>
          <Text underline strong>
            {' '}
            Welcome to RikkeiSoft{' '}
          </Text>
        </div>
        <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <Form.Item
            name='email'
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Invalid email format' },
            ]}
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email}
            className='form-item'
          >
            <Input
              prefix={<MailOutlined className='icon' />}
              placeholder='Email'
              allowClear
              className='Input'
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            name='password'
            rules={[{ required: true, message: 'Password is required' }]}
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password}
          >
            <Input.Password
              prefix={<LockOutlined style={{ marginRight: '10px' }} />}
              placeholder='Password'
              allowClear
              disabled={loading}
            />
          </Form.Item>

          <Form.Item className='Input'>
            <Button
              type='primary'
              htmlType='submit'
              block
              className='btn'
              loading={loading}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default FormLogin;
