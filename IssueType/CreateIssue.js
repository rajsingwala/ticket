import React, { useState } from "react";
import Sidenav from "../../components/Sidenav/Sidenav";
import Nav from "../../components/Navbar/Nav";
import { Layout, Button, Form, Input } from "antd";
import MobileSidenav from "../../components/Sidenav/MobileSidenav";
// import { //toast } from "react-//toastify";
import { useNavigate } from "react-router-dom";
import { fnAddIssue } from "../../functions/IssueType/issueType";

const { Content } = Layout;

const CreateIssue = () => {
  const [loading, setLoading] = useState("");
  const [issue, setIssue] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      fnAddIssue(issue)
        .then((res) => {
          if (res.status === 400) {
            // //toast.error("Issue Not Created");
            setLoading(false);
            return;
          } else if (res.status === 200) {
            // //toast.success("Issue Generated");
            setLoading(false);
            navigate("/all-issue-type");
          }
        })
        .catch((err) => {
          // //toast.error(err);
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <MobileSidenav />
      <Sidenav />
      <Layout className="site-layout">
        <Nav />
        <Content style={{ margin: "0 16px" }}>
          <div className="login_div signup_div create_ticket">
            <div className="login_content signup_content">
              <div className="login_content_title">
                <h1>Add-Issue Type</h1>
              </div>
              <div className="login_form signup_form">
                <Form
                  layout="vertical"
                  className="login-form"
                  onFinish={handleSubmit}
                >
                  {/* issue-type */}
                  <Form.Item
                    name="issue"
                    label="Issue Type"
                    rules={[
                      {
                        required: true,
                        message: "please provide issue-type!",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input
                      name="issue"
                      value={issue}
                      onChange={(e) => setIssue(e.target.value)}
                    />
                  </Form.Item>

                  {/* add issue-button */}
                  <Form.Item>
                    <div className="login_btn">
                      <Button
                        className="login-form-button"
                        htmlType="submit"
                        block
                        loading={loading}
                      >
                        Add Issue-Type
                      </Button>
                    </div>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default CreateIssue;
