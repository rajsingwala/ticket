import React, { useEffect, useState } from "react";
import Sidenav from "../../components/Sidenav/Sidenav";
import Nav from "../../components/Navbar/Nav";
import { Layout, Button, Form, Select } from "antd";
import MobileSidenav from "../../components/Sidenav/MobileSidenav";
import { fnGetAllUser } from "../../functions/User/user";
// import { //toast } from "react-//toastify";
import { fnCreateTicket } from "../../functions/Ticket/ticket";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserType } from "../../redux/userSlice";

const { Content } = Layout;
const { Option } = Select;

const CreateTicket = () => {
  const [loading, setLoading] = useState("");
  const [user, setUser] = useState("");
  const [users, setUsers] = useState([]);

  const userType = useSelector(selectUserType);

  const navigate = useNavigate();

  useEffect(() => {
    if (userType === "operator") {
      navigate("//all-ticket");
      //toast.warning("Access Denied");
    }
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      fnCreateTicket(user)
        .then((res) => {
          if (res.status === 400) {
            //toast.error("Ticket Not Created");
            setLoading(false);
            return;
          } else if (res.status === 200) {
            //toast.success("Ticket Generated");
            setLoading(false);
            navigate("/all-ticket");
          }
        })
        .catch((err) => {
          //toast.error(err);
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    fnGetAllUser()
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => console.log(err));
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
                <h1>Create-Ticket</h1>
              </div>
              <div className="login_form signup_form">
                <Form
                  layout="vertical"
                  className="login-form"
                  onFinish={handleSubmit}
                >
                  {/* user-type */}
                  <Form.Item
                    name="user"
                    label="User"
                    rules={[
                      {
                        required: true,
                        message: "please select user!",
                      },
                    ]}
                    hasFeedback
                  >
                    <Select
                      onChange={(e) => setUser(e)}
                      placeholder="Select User"
                      value={user}
                    >
                      {users.map(
                        (item) =>
                          item.usertype === "customer" && (
                            <Option value={item.username} key={item.userid}>
                              {item.username}
                            </Option>
                          )
                      )}
                    </Select>
                  </Form.Item>

                  {/* generate ticket-button */}
                  <Form.Item>
                    <div className="login_btn">
                      <Button
                        className="login-form-button"
                        htmlType="submit"
                        block
                        loading={loading}
                      >
                        Generate Ticket
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

export default CreateTicket;
