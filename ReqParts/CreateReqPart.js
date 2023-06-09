import React, { useEffect, useState } from "react";
import Sidenav from "../../components/Sidenav/Sidenav";
import Nav from "../../components/Navbar/Nav";
import { Layout, Button, Form, Select } from "antd";
import MobileSidenav from "../../components/Sidenav/MobileSidenav";
// import { //toast } from "react-//toastify";
import { useNavigate } from "react-router-dom";
import Input from "antd/lib/input/Input";
import { useSelector } from "react-redux";
import { selectId } from "../../redux/reqPartSlice";
import { selectUserId } from "../../redux/userSlice";
import { fnGetPart } from "../../functions/PartInventory/partInv";
import { fnAddReqPart } from "../../functions/ReqParts/reqParts";

const { Content } = Layout;
const { Option } = Select;

const CreateReqPart = () => {
  const [loading, setLoading] = useState("");
  const [parts, setParts] = useState([]);
  const [partName, setPartName] = useState("");
  const [request, setRequest] = useState("");
  const [quantity, setQuantity] = useState("");
  const [contract, setContract] = useState("");

  const navigate = useNavigate();
  const ticketId = useSelector(selectId);
  const userId = useSelector(selectUserId);

  const handleSubmit = async () => {
    if (!ticketId) {
      // //toast.error("Ticket is not Selected");
      return;
    }
    setLoading(true);
    try {
      fnAddReqPart(userId, ticketId, quantity, request, partName, contract)
        .then((res) => {
          if (res.status === 400) {
            // //toast.error("Part Not Added");
            setLoading(false);
            return;
          } else if (res.status === 200) {
            // //toast.success("Part Added Successfully");
            setLoading(false);
            navigate("/all-required-parts");
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

  const loadParts = async () => {
    fnGetPart()
      .then((res) => setParts(res.data))
      .catch((err) => {
        console.log(err);
        // //toast.error(err);
      });
  };

  useEffect(() => {
    loadParts();
  }, []);

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
                <h1>Required Parts</h1>
              </div>
              <div className="login_form signup_form">
                <Form
                  layout="vertical"
                  className="login-form"
                  onFinish={handleSubmit}
                >
                  {/* ticket */}
                  <Form.Item label="Ticket Id">
                    <Input disabled value={ticketId} />
                  </Form.Item>

                  {/* part-name */}
                  <Form.Item
                    name="partname"
                    label="Part Name"
                    rules={[{ required: true }]}
                    hasFeedback
                  >
                    <Select
                      name="partname"
                      onChange={(e) => setPartName(e)}
                      value={partName}
                    >
                      {parts.map((part) => (
                        <Option key={part.partid} value={part.partname}>
                          {part.partname}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  {/* request */}
                  <Form.Item
                    name="requesttype"
                    label="Request Type"
                    rules={[{ required: true }]}
                    hasFeedback
                  >
                    <Select
                      name="requesttype"
                      onChange={(e) => setRequest(e)}
                      value={request}
                    >
                      <Option value="issue">Issue</Option>
                      <Option value="return">Return</Option>
                    </Select>
                  </Form.Item>

                  {/* quantity */}
                  <Form.Item
                    name="quantity"
                    label="Quantity"
                    rules={[{ required: true }]}
                    hasFeedback
                  >
                    <Input
                      name="quantity"
                      min={1}
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </Form.Item>

                  {/* contract */}
                  <Form.Item
                    name="contract"
                    label="Contract"
                    rules={[{ required: true }]}
                    hasFeedback
                  >
                    <Select
                      name="contract"
                      onChange={(e) => setContract(e)}
                      value={contract}
                    >
                      <Option value="amc">Amc</Option>
                      <Option value="warranty">Warranty</Option>
                      <Option value="oncall">OnCall</Option>
                    </Select>
                  </Form.Item>

                  {/* add required-part-button */}
                  <Form.Item>
                    <div className="login_btn">
                      <Button
                        className="login-form-button"
                        htmlType="submit"
                        block
                        loading={loading}
                      >
                        Add To Ticket
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

export default CreateReqPart;
