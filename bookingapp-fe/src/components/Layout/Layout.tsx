import {  Outlet } from "react-router-dom";
import {
  Layout,
} from "antd";
import HeaderComponent from "./Header";
import SiderComponent from "./Sider";
const { Content } = Layout;
const LayoutApp = () => {
  return (
    <Layout>
      <HeaderComponent/>
      <Layout>
        <SiderComponent />
        <Content
          style={{
            marginTop: 13,
            marginLeft:13,
            padding: 24,
            minHeight: 900,
            background: "white",
            zIndex:'0',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutApp;
