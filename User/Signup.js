import React, { useState, useEffect } from "react";
import Sidenav from "../../components/Sidenav/Sidenav";
import Nav from "../../components/Navbar/Nav";
import { Layout, Button, Form, Input, Select, Radio } from "antd";
import "../../styles/User/Login.css";
import { ImMobile } from "react-icons/im";
import { AiOutlineLock, AiOutlineMail, AiOutlineUser } from "react-icons/ai";
import { RiBuilding3Line } from "react-icons/ri";
import MobileSidenav from "../../components/Sidenav/MobileSidenav";
import "../../styles/User/Signup.css";
import { fnCreateUser } from "../../functions/User/user";
import { useSelector, useDispatch } from "react-redux";
import {
  selectUserId,
  selectUserType,
  setUserLoginDetails,
} from "../../redux/userSlice";
import { NavLink, useNavigate } from "react-router-dom";
// import { //toast } from "react-//toastify";

const { Content } = Layout;
const { Option } = Select;

const Signup = () => {
  const [userName, setUserName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("customer");
  const [underAmc, setUnderAmc] = useState("no");
  const [loading, setLoading] = useState(false);

  const userId = useSelector(selectUserId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mobileExp = /^[6-9]\d{9}$/gi;
  const spaceExp = /\s/g;

  const charExp = /^\d+$/;

  useEffect(() => {
    if (userId) navigate("/all-ticket");
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      fnCreateUser(
        userName,
        companyName,
        mobile,
        password,
        email,
        userType,
        underAmc
      ).then((res) => {
        if (res.data.status === 400) {
          //toast.error("Something Went Wrong");
          setLoading(false);
          return;
        } else if (res.data.status === 403) {
          //toast.error("Mobile No Already Exists");
          setLoading(false);
          return;
        }
        dispatch(
          setUserLoginDetails({
            userId: res.data[0].userid,
            userName: res.data[0].username,
            companyName: res.data[0].companyname,
            userType: res.data[0].usertype,
            email: res.data[0].email,
            mobileNo: res.data[0].mobile,
          })
        );
        navigate("/all-ticket");
        setLoading(false);
        //toast.success("User Created Successfully");
      });
    } catch (error) {
      //toast.error(error);
      setLoading(false);
      console.log(error);
    }
  };

  const handleUserType = (e) => {
    setUserType(e);
  };

  const handleAmc = (e) => {
    setUnderAmc(e.target.value);
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
          <div className="login_div signup_div">
            <div className="login_content signup_content">
              <div className="login_content_title">
                <h1>Sign-Up</h1>
              </div>
              <div className="login_form signup_form">
                <Form
                  layout="vertical"
                  className="login-form"
                  onFinish={handleSubmit}
                  scrollToFirstError
                >
                  {/* username */}
                  <Form.Item
                    name="username"
                    label="Username"
                    rules={[
                      {
                        required: true,
                        message: "please provide username!",
                      },
                      { min: 3 },
                    ]}
                    hasFeedback
                  >
                    <Input
                      name="username"
                      placeholder="enter username"
                      prefix={<AiOutlineUser className="site-form-item-icon" />}
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      autoFocus
                    />
                  </Form.Item>

                  {/* company-name */}
                  <Form.Item
                    name="companyname"
                    label="Company Name"
                    rules={[
                      {
                        required: true,
                        message: "please provide company name!",
                      },
                      { min: 3 },
                    ]}
                    hasFeedback
                  >
                    <Input
                      name="companyname"
                      type="companyname"
                      placeholder="enter company-name"
                      prefix={
                        <RiBuilding3Line className="site-form-item-icon" />
                      }
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </Form.Item>

                  {/* mobile-no */}
                  <Form.Item
                    name="mobile-no"
                    label="Mobile No"
                    rules={[
                      {
                        required: true,
                        message: "please provide mobile-no!",
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
                      {
                        validator: (_, value) =>
                          charExp.test(value)
                            ? Promise.resolve()
                            : Promise.reject("please provide valid mobile-no!"),
                      },
                      // ({ getFieldValue }) => ({
                      //   validator(_, value) {
                      //     //if(getFieldValue("password") !== value)
                      //     if (mobileExp.test(value) || spaceExp.test(value))
                      //       return Promise.reject(
                      //         "please provide valid mobile-no"
                      //       );
                      //     return Promise.resolve();
                      //   },
                      // }),
                    ]}
                    hasFeedback
                  >
                    <Input
                      name="mobil-no"
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

                  {/* email */}
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      {
                        type: "email",
                        message: "please provide valid email!",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input
                      type="email"
                      name="email"
                      placeholder="enter email"
                      prefix={<AiOutlineMail className="site-form-item-icon" />}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Item>

                  {/* user-type */}
                  {/* <Form.Item
                    name="usertype"
                    label="UserType"
                    rules={[
                      {
                        required: true,
                        message: "please select user-type!",
                      },
                    ]}
                    hasFeedback
                  >
                    <Select
                      onChange={handleUserType}
                      placeholder="Select User Type"
                      value={userType}
                    >
                      <Option value="customer">Customer</Option>
                      <Option value="engineer">Engineer</Option>
                      <Option value="admin">Admin</Option>
                      <Option value="account">Account</Option>
                    </Select>
                  </Form.Item> */}

                  {/* under-amc */}
                  {/* {userType === "customer" && (
                    <Form.Item
                      label="UnderAmc"
                      rules={[
                        {
                          required: true,
                          message: "please select underAmc!",
                        },
                      ]}
                      hasFeedback
                    >
                      <Radio.Group onChange={handleAmc} value={underAmc}>
                        <Radio value="yes">Yes</Radio>
                        <Radio value="no">No</Radio>
                      </Radio.Group>
                    </Form.Item>
                  )} */}

                  <div className="switch_page">
                    <p>
                      {" "}
                      Already have an Account?
                      <NavLink to="/login"> LogIn</NavLink>
                    </p>
                  </div>

                  {/* signup-button */}
                  <Form.Item>
                    <div className="login_btn">
                      <Button
                        className="login-form-button"
                        htmlType="submit"
                        block
                        loading={loading}
                      >
                        Sign-Up
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

export default Signup;
