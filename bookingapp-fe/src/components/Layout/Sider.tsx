import { Menu } from 'antd';
import React from 'react'
import getCookie from '../route/Cookie';
import { useNavigate } from 'react-router-dom';
import { AppstoreOutlined, HomeOutlined, SelectOutlined, UserOutlined } from '@ant-design/icons';
import Sider from 'antd/es/layout/Sider';

const SiderComponent = () => {
 const role = getCookie("roles");
 const navigator = useNavigate();
  return (
    <>
     {role.includes("admin") ? (
          <Sider
            style={{ marginTop: 13 }}
            trigger={null}
            theme="light"
            width={"200px"}
          >
            <div className="demo-logo-vertical" />
            <Menu
              className="menu"
              onClick={({ key }) => {
                navigator(key);
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
    </>
  )
}

export default SiderComponent