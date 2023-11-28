import { useNavigate, Outlet } from "react-router-dom";
import {
  HomeOutlined,
  UserOutlined,
  SelectOutlined,
  LogoutOutlined,
  DownOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

import {
  Layout,
  Menu,
  Button,
  Space,
  Avatar,
  Dropdown,
  MenuProps,
} from "antd";
import { Header } from "antd/es/layout/layout";
import getCookie from "../Routes/Cookies";
const { Sider, Content } = Layout;
const LayoutApp = () => {
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
  const items: MenuProps["items"] = [
    {
      label: "Infomaiton account",
      icon: <UserOutlined />,
      key: "informationaccount",
    },
    {
      label: "Change password",
      icon: <UserOutlined />,
      key: "changpassword",
    },
    {
      label: " Logout",
      icon: <LogoutOutlined />,
      key: "logout",
    },
  ];
  const handleNavigate = (key: string) => {
    navigator(key);
  };

  return (
    <Layout>
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
        {role.includes("user") ? (
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
                key: "/",
                label: "Calendar",
              },
              {
                key: "/bookingroom",
                label: "Booking room",
              },
            ]}
          />
        ) : null}
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
      </Header>
      <Layout>
        {role.includes("admin") ? (
          <Sider
            style={{ marginTop: 13 }}
            trigger={null}
            collapsible
            theme="light"
            width={"200px"}
          >
            <div className="demo-logo-vertical" />
            <Menu
              className="menu"
              onClick={({ key }) => {
                handleNavigate(key);
              }}
              theme="light"
              mode="inline"
              defaultSelectedKeys={["/"]}
              items={[
                {
                  key: "/",
                  icon: <AppstoreOutlined />,
                  label: "Dashboard",
                },
                {
                  key: "/roomManager",
                  icon: <HomeOutlined />,
                  label: "Room Manager",
                },
                {
                  key: "/usermanager",
                  icon: <UserOutlined />,
                  label: "User Manager",
                },
                {
                  key: "/bookingmanager",
                  icon: <SelectOutlined />,
                  label: "Booking Manager",
                },
              ]}
            />
          </Sider>
        ) : null}
        <Content
          style={{
            margin: 13,
            padding: 24,
            minHeight: 670,
            background: "white",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutApp;