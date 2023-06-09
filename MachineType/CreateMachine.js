import React, { useState } from "react";
import Sidenav from "../../components/Sidenav/Sidenav";
import Nav from "../../components/Navbar/Nav";
import { Layout, Button, Form, Input } from "antd";
import MobileSidenav from "../../components/Sidenav/MobileSidenav";
// import { //toast } from "react-//toastify";
import { useNavigate } from "react-router-dom";
import { fnAddMachine } from "../../functions/MachineType/machineType";

const { Content } = Layout;

const CreateMachine = () => {
  const [loading, setLoading] = useState("");
  const [machine, setMachine] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      fnAddMachine(machine)
        .then((res) => {
          if (res.status === 400) {
            // //toast.error("Machine Not Created");
            setLoading(false);
            return;
          } else if (res.status === 200) {
            // //toast.success("Machine Generated");
            setLoading(false);
            navigate("/all-machine-type");
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
                <h1>Add-Machine Type</h1>
              </div>
              <div className="login_form signup_form">
                <Form
                  layout="vertical"
                  className="login-form"
                  onFinish={handleSubmit}
                >
                  {/* issue-type */}
                  <Form.Item
                    name="machine"
                    label="Machine Type"
                    rules={[
                      {
                        required: true,
                        message: "please provide machine-type!",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input
                      name="machine"
                      value={machine}
                      onChange={(e) => setMachine(e.target.value)}
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
                        Add Machine-Type
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

export default CreateMachine;
