<<<<<<< HEAD
<<<<<<< HEAD
import { Button, Checkbox, Col, Form, Input, Row } from "antd";
import React, { useState } from "react";
import axios from "axios";

import { url } from "../../ultils/urlApi";
import { DataType, HEADER } from "../../constant/constant";
import { handleErrorShow, handleSuccessShow } from "../../ultils/ultilsApi";
interface FormAddProps {
  onModalAddUser: (status: boolean) => void;
  onAddUser: (addUser: DataType) => void;
}

const FormAdd: React.FC<FormAddProps> = ({ onModalAddUser, onAddUser }) => {
  const [form] = Form.useForm();
=======
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Spin,
  notification,
} from "antd";
import React from "react";
=======
import { Button, Checkbox, Col, Form, Input, Row } from "antd";
import React, { useState } from "react";
>>>>>>> 2b05bb3 (WIBA-506 user manager (add + edit + delete + search))
import axios from "axios";

import { url } from "../../ultils/urlApi";
import { DataType, HEADER } from "../../constant/constant";
import { handleErrorShow, handleSuccessShow } from "../../ultils/ultilsApi";
interface FormAddProps {
  onModalAddUser: (status: boolean) => void;
  onAddUser: (addUser: DataType) => void;
}

const FormAdd: React.FC<FormAddProps> = ({ onModalAddUser, onAddUser }) => {
  const [form] = Form.useForm();
<<<<<<< HEAD
  const token = getCookie("token");
>>>>>>> e8031da (WIBA-506 update add new user)
=======
>>>>>>> 2b05bb3 (WIBA-506 user manager (add + edit + delete + search))
  const [loading, setLoading] = useState<boolean>(false);
  const handleSubmit = async (value: any) => {
    setLoading(true);
    try {
      await axios
        .post(url + "/v1/users", value, {
          headers: HEADER,
        })
        .then((response) => {
          onAddUser(value);
<<<<<<< HEAD
<<<<<<< HEAD
          handleSuccessShow(response);
          onModalAddUser(false);
        });
    } catch (error: any) {
      handleErrorShow(error);
    } finally {
      setLoading(false);
=======
          Modal.success({
            content: response.data.message,
          });
=======
          handleSuccessShow(response);
>>>>>>> 2b05bb3 (WIBA-506 user manager (add + edit + delete + search))
          onModalAddUser(false);
        });
    } catch (error: any) {
      handleErrorShow(error);
    } finally {
      setLoading(false);
<<<<<<< HEAD
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
>>>>>>> e8031da (WIBA-506 update add new user)
=======
>>>>>>> 2b05bb3 (WIBA-506 user manager (add + edit + delete + search))
    }
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
            {
              max: 10,
              message: "Phone number has at most 10 numbers",
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
            { min: 8, message: "Password has at least 8 letters" },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="Password" />
          <Form.Item
            label="Confirm password"
            name="confirm_password"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please input password!" },
              { whitespace: true, message: "Please input password!" },
              { min: 8, message: "Password has at least 8 numbers" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Not match with password!"));
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Confirm password" />
          </Form.Item>
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
<<<<<<< HEAD
<<<<<<< HEAD
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
=======
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" disabled={loading}>
            {loading ? <Spin spinning={loading} /> : "Submit"}
          </Button>
        </Form.Item>
>>>>>>> e8031da (WIBA-506 update add new user)
=======
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
>>>>>>> 2b05bb3 (WIBA-506 user manager (add + edit + delete + search))
      </Form>
    </div>
  );
};

export default FormAdd;
