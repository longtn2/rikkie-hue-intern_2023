import { DownOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown, Menu, MenuProps, Modal, Space } from "antd";
import { Header } from "antd/es/layout/layout";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import ChangePassword from "../InfoUser/ChangePassword";
import { getCookie } from "../../helper/Cookie";
const HeaderComponent = () => {
  const role = getCookie("roles");
  const name = getCookie("name");
  const navigator = useNavigate();
  const handleLogout = () => {
    const cookies = Cookies.get();
    for (const cookie in cookies) {
      Cookies.remove(cookie);
    }
    navigator("/login");
  };
  const [isopen, setIsopen] = useState(false);
  const handleChange = (status: boolean) => {
    setIsopen(status);
  };
  const handleCancel = () => {
    handleChange(false);
  };
  const handleNavigate = (key: string) => {
    key === "changepassword" ? handleChange(true) : navigator(key);
  };
  const items: MenuProps["items"] = [
    {
      label: "Infomaiton account",
      icon: <UserOutlined />,
      key: "informationaccount",
    },
    {
      label: "Change password",
      icon: <UserOutlined />,
      key: "changepassword",
    },
    {
      label: " Logout",
      icon: <LogoutOutlined />,
      key: "logout",
    },
  ];

  return (
    <>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          background: "white",
          justifyContent: "space-between",
        }}
      >
        <h1>BookingMeetingRoom</h1>
        {!role.includes("admin") ? (
          <Menu
            className="menu"
            onClick={({ key }) => {
              navigator(key);
            }}
            theme="light"
            mode="horizontal"
            defaultSelectedKeys={["/"]}
            items={[
              {
                key: "/calendarmeeting",
                label: "Calendar",
              },
              {
                key: "/bookingroom",
                label: "Booking room",
              },
              {
                key: "/invitations",
                label: "Invitations",
              },
            ]}
          />
        ) : (
          []
        )}

        <div style={{ display: "flex" }}>
          <Dropdown
            overlay={
              <Menu
                onClick={({ key }) => {
                  key === "logout" ? handleLogout() : handleNavigate(key);
                }}
                selectable
                items={items}
              />
            }
            trigger={["click"]}
            arrow
          >
            <Button
              style={{
                height: "80%",
                width: 200,
                borderRadius: 5,
                columnGap: "100%",
                alignItems: "center",
                display: "flex",
                border: "none",
              }}
            >
              <a
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <Space style={{ columnGap: 30 }}>
                  <Avatar
                    style={{ marginLeft: 0 }}
                    src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1"
                  />
                  {name}
                  <DownOutlined />
                </Space>
              </a>
            </Button>
          </Dropdown>
        </div>
      </Header>

      <Modal
        title="Change passwordpassword"
        destroyOnClose={true}
        open={isopen}
        footer={[]}
        onCancel={handleCancel}
        style={{ width: "500px", textAlign: "center" }}
      >
        <ChangePassword onChange={handleChange} />
      </Modal>
    </>
  );
};

export default HeaderComponent;
