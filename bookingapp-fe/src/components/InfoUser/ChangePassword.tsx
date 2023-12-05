import { Button, Form, Input, Modal } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { url } from "../ultils/urlApi";
import { handleError, handleSuccess } from "../ultils/ultilsApi";
import { showPopup } from "../ultils/Popup";
import { token } from "../constant/constant";

interface ChangePasswordProps {
  onChange: (status: boolean) => void;
}
const ChangePassword: React.FC<ChangePasswordProps> = ({ onChange }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const handleChangepassword = async (value: any) => {
    try {
      setLoading(true);
      await axios
        .put(url + "/v1/users/change_password", value, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response: any) => {
          const { message } = handleSuccess(response);
          showPopup(true, message);
          onChange(false);
        });
    } catch (error: any) {
      const { message, errors }: any = handleError(error);
      const messageErrors = message + " " + errors;
      showPopup(false, messageErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ padding: 20 }}>
        <Form
          name="validateOnly"
          labelCol={{ flex: "200px" }}
          labelAlign="left"
          form={form}
          wrapperCol={{ flex: 1 }}
          preserve={false}
          colon={false}
          style={{ maxWidth: 800 }}
          onFinish={handleChangepassword}
        >
          <Form.Item
            label="Enter old password"
            name="current_password"
            rules={[
              { required: true, message: "Please input password!" },
              { whitespace: true, message: "Please input password!" },
              { min: 8, message: "Password has at least 8 numbers" },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Current Password" />
          </Form.Item>
          <Form.Item
            label="Enter new password"
            name="new_password"
            rules={[
              { required: true, message: "Please input password!" },
              { whitespace: true, message: "Please input password!" },
              { min: 8, message: "Password has at least 8 numbers" },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="New Password" />
          </Form.Item>
          <Form.Item
            label="Repeat new password"
            name="confirm_password"
            dependencies={["new_password"]}
            rules={[
              { required: true, message: "Please input password!" },
              { whitespace: true, message: "Please input password!" },
              { min: 8, message: "Password has at least 8 numbers" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("new_password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Not match with new password!")
                  );
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Repeat new Password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ChangePassword;
