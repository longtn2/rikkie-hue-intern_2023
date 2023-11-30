import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  Row,
  notification,
} from "antd";
import React from "react";
import axios from "axios";
import { url } from "../ultils/urlApi";
import getCookie from "../route/Cookie";
import { useEffect, useState } from "react";
import { DataType } from "../constant/constant";

const FormAdd = ({ onModalAddUser }) => {
  const [form] = Form.useForm();
  const token = getCookie("token");
  const [list_users, setListUsers] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getData = async () => {
    setLoading(true);
    try {
      await axios
        .get(url + "/v1/users", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setListUsers(response.data.data.users);
        });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const handleSubmit = async (value: any) => {
    setLoading(true);
    try {
      await axios
        .post(url + "/v1/users", value, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          getData();
          Modal.success({
            content: response.data.message,
          });
          onModalAddUser(false);
        })
        .catch((error) => {
          error.response.data.message === "Conflict"
            ? notification.error({
                message: error.response.data.errors,
                duration: 5,
              })
            : error.response.data.errors.map((error: any) => {
                notification.error({
                  message: error.field,
                  description: error.error,
                  duration: 5,
                });
              });
        });
    } catch (error) {}
  };
  return (
    <div style={{ padding: 20 }}>
      <Form
        name="validateOnly"
        labelCol={{ flex: "150px" }}
        labelAlign="left"
        preserve={false}
        form={form}
        onFinish={handleSubmit}
        wrapperCol={{ flex: 1 }}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="User Name"
          name="user_name"
          rules={[
            { required: true, message: "Name is required" },
            { whitespace: true },
          ]}
        >
          <Input placeholder="Enter User Name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input email!" },
            { type: "email", message: "Invalid email format" },
            { whitespace: true },
          ]}
          hasFeedback
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          label="Phone Number"
          name="phone_number"
          rules={[
            { required: true, message: "Please input phone-number!" },
            {
              min: 10,
              message: "Phone number has at least 10 numbers",
            },
            { whitespace: true },
            {
              pattern: /^\d+$/,
              message: "Please input number!",
            },
          ]}
          hasFeedback
        >
          <Input placeholder="Phone Number" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please input password!" },
            { whitespace: true, message: "Please input password!" },
          ]}
          hasFeedback
        >
          <Input placeholder="Password" type="password" required />
        </Form.Item>
        <Form.Item
          name="role_id"
          label="Role"
          rules={[{ required: true, message: "Please select role!" }]}
          hasFeedback
        >
          <Checkbox.Group>
            <Row>
              <Col span={12}>
                <Checkbox value={2} style={{ lineHeight: "32px" }}>
                  User
                </Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox value={1} style={{ lineHeight: "32px" }}>
                  Admin
                </Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FormAdd;
