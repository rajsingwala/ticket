import React, { useEffect, useState } from "react";
import Sidenav from "../../components/Sidenav/Sidenav";
import Nav from "../../components/Navbar/Nav";
import { Layout, Button, Form, Input } from "antd";
import "../../styles/User/Login.css";
import { ImMobile } from "react-icons/im";
import { AiOutlineLock } from "react-icons/ai";
import MobileSidenav from "../../components/Sidenav/MobileSidenav";
import { useDispatch, useSelector } from "react-redux";
import { selectUserId } from "../../redux/userSlice";
import { NavLink } from "react-router-dom";
import { fnLogin } from "../../functions/User/user";
import { setUserLoginDetails } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
// import { //toast } from "react-//toastify";

const { Content } = Layout;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const userId = useSelector(selectUserId);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) navigate("/all-ticket");
  }, []);

  const mobileExp = /^[6-9]\d{9}$/gi;
  const spaceExp = /\s/g;

  const charExp = /^\d+$/;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      fnLogin(mobile, password)
        .then((res) => {
          if (res.data.status === 400) {
            //toast.error("Invalid Credentials");
            setLoading(false);
            return;
          }
          dispatch(
            setUserLoginDetails({
              userId: res?.data[0]?.userid,
              userName: res?.data[0]?.username,
              companyName: res?.data[0]?.companyname,
              userType: res?.data[0]?.usertype,
              email: res?.data[0]?.email,
              mobileNo: res?.data[0]?.mobile,
            })
          );

          navigate("/all-ticket");
          setLoading(false);
          //toast.success("LoggedIn Successfully");
        })
        .catch((err) => {
          setLoading(false);
          //toast.error(err);
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {userId && (
        <>
          <MobileSidenav />
          <Sidenav />
        </>
      )}
      <Layout className="site-layout">
        <Nav />
        <Content style={{ margin: "0 16px" }}>
          <div className="login_div">
            <div className="login_content">
              <div className="login_content_title">
                <h1>Login</h1>
              </div>
              <div className="login_form">
                <Form
                  layout="vertical"
                  className="login-form"
                  onFinish={handleSubmit}
                  scrollToFirstError
                >
                  {/* mobile-no */}
                  <Form.Item
                    name="mobile-no"
                    label="Mobile No"
                    rules={[
                      {
                        required: true,
                        message: "please provide mobile-no!",
                        //if(getFieldValue("password") !== value)
                      },
                      { len: 10 },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (spaceExp.test(value))
                            return Promise.reject(
                              "password not contain empty space"
                            );
                          return Promise.resolve();
                        },
                      }),
                      {
                        validator: (_, value) =>
                          charExp.test(value)
                            ? Promise.resolve()
                            : Promise.reject("please provide valid mobile-no!"),
                      },
                      // {
                      //   validator: (_, value) =>
                      //     mobileExp.test(value)
                      //       ? Promise.resolve()
                      //       : Promise.reject("please provide valid mobile-no!"),
                      // },
                      // ({ getFieldValue }) => ({
                      //   validator(_, value) {
                      //     console.log(value);
                      //     console.log(mobileExp.test(value));
                      //     if (!mobileExp.test(value)) {
                      //       return Promise.reject(
                      //         "please provide valid mobile-no"
                      //       );
                      //     }
                      //     return Promise.resolve();
                      //   },
                      // }),
                    ]}
                    hasFeedback
                  >
                    <Input
                      autoFocus
                      name="mobile-no"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      prefix={<ImMobile className="site-form-item-icon" />}
                      placeholder="enter mobile-no"
                      type="tel"
                    />
                  </Form.Item>

                  {/* password */}
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      {
                        required: true,
                        message: "please provide password!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (spaceExp.test(value))
                            return Promise.reject(
                              "password not contain empty space"
                            );
                          return Promise.resolve();
                        },
                      }),
                      { min: 6 },
                    ]}
                    hasFeedback
                  >
                    <Input.Password
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      name="password"
                      prefix={<AiOutlineLock className="site-form-item-icon" />}
                      placeholder="enter password"
                    />
                  </Form.Item>

                  <div className="switch_page">
                    <p>
                      {" "}
                      New Here?<NavLink to="/sign-up"> SignUp</NavLink>
                    </p>
                  </div>

                  {/* login-button */}
                  <Form.Item>
                    <div className="login_btn">
                      <Button
                        className="login-form-button"
                        htmlType="submit"
                        block
                        loading={loading}
                      >
                        LOGIN
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

export default Login;
