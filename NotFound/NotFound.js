import React from "react";
import { Layout, Image } from "antd";
import Nav from "../../components/Navbar/Nav";
import "../../styles/NotFound/NotFound.css";

const { Content } = Layout;

const NotFound = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout className="site-layout">
        <Nav />
        {/* Oops!
        We can't seem to find the page you're looking for */}
        <Content style={{ margin: "0 16px" }}>
          <div className="not_found">
            <div className="not_found_content">
              <h1>OOPS!</h1>
              <p>We can't seem to find the page you're looking for</p>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default NotFound;
