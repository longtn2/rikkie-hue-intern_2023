import { Button, Checkbox, Col, Form, Input, Modal, Row, notification } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../ultils/urlApi";
import getCookie from "../route/Cookie";

const FormEdit = ({ onModalEditUser, data ,onEditUser}) => {
  const [form] = Form.useForm();
  const token = getCookie("token");
  const [loading, setLoading] = useState<boolean>(false);

  const handleUpdate = async (value: any) => {
    if (data) {
      try {
        await axios
          .put(url + "/v1/users/" + data.user_id, value, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            onEditUser(value)
            Modal.success({
              content: response.data.message,
            });
            onModalEditUser(false);
          })
          .catch((error) => {
            notification.error({
              message: error.response.data.data.error,
            });
          });
      } catch (error) {
        console.log(error);
    }
  };
}
  return (
    <>

      <div style={{ padding: 20 }}>
        <Form
          name="validateOnly"
          labelCol={{ flex: "150px" }}
          labelAlign="left"
          form={form}
          wrapperCol={{ flex: 1 }}
          preserve={false}
          colon={false}
          style={{ maxWidth: 600 }}
          initialValues={data}
          onFinish={handleUpdate}
        >
          <Form.Item
            label="User Name"
            name="user_name"
            rules={[
              { required: true, message: "Please input user name!" },
              { whitespace: true },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phone_number"
            rules={[
              { required: true },
              {
                pattern: new RegExp("^[0-9]*$"),
                message: "Please enter a valid phone number!",
              },
              { whitespace: true },
              { min: 10, message: "Phone number has at least 10 numbers" },
            ]}
            hasFeedback
          >
            <Input />
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
              Update
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default FormEdit;