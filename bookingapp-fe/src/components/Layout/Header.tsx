import { DownOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown, Menu, MenuProps, Modal, Space } from "antd";
import { Header } from "antd/es/layout/layout";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { getCookie } from "../../helper/Cookie";
import ChangePassword from "../InfoUser/ChangePassword";
import "./Layout.css";

const HeaderComponent = () => {
  const role = getCookie("roles");
  const name = getCookie("name");
  const navigator = useNavigate();
  const [isopen, setIsOpen] = useState(false);
  const handleLogout = () => {
    const cookies = Cookies.get();
    for (const cookie in cookies) {
      Cookies.remove(cookie);
    }
    navigator("/login");
  };
  const handleChange = (status: boolean) => {
    setIsOpen(status);
  };
  const handleCancel = () => {
    handleChange(false);
  };
  const handleNavigate = (key: string) => {
    if(key === "logout") {
      handleLogout();
    } else if (key === "changepassword") {
      handleChange(true) 
    }else {
      navigator(key)
    }
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
      <Header className="header-layout">
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
          <></>
        )}

        <div style={{ display: "flex" }}>
          <Dropdown
            overlay={
              <Menu
                onClick={({ key }) => {
                  handleNavigate(key);
                }}
                selectable
                items={items}
              />
            }
            trigger={["click"]}
            arrow
          >
            <Button className="btn-account">
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
        className="small-modal"
      >
        <ChangePassword onChange={handleChange} />
      </Modal>
    </>
  );
};

export default HeaderComponent;
