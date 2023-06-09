import React, { useState, useEffect } from "react";
import Sidenav from "../../components/Sidenav/Sidenav";
import Nav from "../../components/Navbar/Nav";
import { Layout, Button, Form, Input } from "antd";
import MobileSidenav from "../../components/Sidenav/MobileSidenav";
// import { //toast } from "react-//toastify";
import { useNavigate } from "react-router-dom";
import { selectId } from "../../redux/reqPartSlice";
import { selectUserId, selectUserType } from "../../redux/userSlice";
import { useSelector } from "react-redux";
import { fnAddServiceDetail } from "../../functions/ServiceDetail/serviceDetail";

const { Content } = Layout;

const CreateServiceDetail = () => {
  const [loading, setLoading] = useState("");
  const [cost, setCost] = useState("");
  const [description, setDescription] = useState("");
  const [km, setKm] = useState("");
  const [perKm, setPerKm] = useState("");

  const navigate = useNavigate();
  const ticketId = useSelector(selectId);
  const userId = useSelector(selectUserId);

  const userType = useSelector(selectUserType);

  useEffect(() => {
    if (userType === "operator") {
      navigate("/all-ticket");
      // //toast.warning("Access Denied");
    }
  });

  const handleSubmit = async () => {
    if (!ticketId) {
      // //toast.error("Ticket is not Selected");
      return;
    }
    setLoading(true);
    try {
      fnAddServiceDetail(description, userId, ticketId, km, perKm)
        .then((res) => {
          if (res.status === 400) {
            // //toast.error("Issue Not Created");
            setLoading(false);
            return;
          } else if (res.status === 200) {
            //toast.success("Issue Generated");
            setLoading(false);
            navigate("/all-service-details");
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

  const spaceExp = /\s/g;
  const charExp = /^\d+$/;

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
                <h1>Add-Service Detail</h1>
              </div>
              <div className="login_form signup_form">
                <Form
                  layout="vertical"
                  className="login-form"
                  onFinish={handleSubmit}
                >
                  {/* ticket-Id */}
                  <Form.Item label="Ticket Id">
                    <Input disabled value={ticketId} />
                  </Form.Item>

                  {/* km */}
                  <Form.Item
                    name="km"
                    label="Kilometer"
                    rules={[
                      {
                        required: true,
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (spaceExp.test(value))
                            return Promise.reject("provide valid kilometer!");
                          return Promise.resolve();
                        },
                      }),
                      {
                        validator: (_, value) =>
                          charExp.test(value)
                            ? Promise.resolve()
                            : Promise.reject("please provide valid cost!"),
                      },
                    ]}
                    hasFeedback
                  >
                    <Input
                      name="km"
                      value={km}
                      onChange={(e) => setKm(e.target.value)}
                    />
                  </Form.Item>

                  {/* per-km */}
                  {userType === "admin" && (
                    <Form.Item
                      name="perkm"
                      label="Charge/Km"
                      rules={[
                        {
                          required: true,
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (spaceExp.test(value))
                              return Promise.reject(
                                "cost not contain empty space"
                              );
                            return Promise.resolve();
                          },
                        }),
                        {
                          validator: (_, value) =>
                            charExp.test(value)
                              ? Promise.resolve()
                              : Promise.reject("please provide valid cost!"),
                        },
                      ]}
                      hasFeedback
                    >
                      <Input
                        name="perKm"
                        value={perKm}
                        onChange={(e) => setPerKm(e.target.value)}
                      />
                    </Form.Item>
                  )}

                  {/* description */}
                  <Form.Item name="description" label="Description">
                    <Input
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Form.Item>

                  {/* add service-detail button */}
                  <Form.Item>
                    <div className="login_btn">
                      <Button
                        className="login-form-button"
                        htmlType="submit"
                        block
                        loading={loading}
                      >
                        Add
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

export default CreateServiceDetail;
