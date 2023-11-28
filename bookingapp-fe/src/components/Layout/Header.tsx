import {  Outlet } from "react-router-dom";
import {
  Layout,
} from "antd";
import HeaderComponent from "./Header";
import SiderComponent from "./Sider";
const {Content } = Layout;
const LayoutApp = () => {
  return (
    <Layout>
      <HeaderComponent/>
      <Layout>
        <SiderComponent />
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