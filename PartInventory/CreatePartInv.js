import React, { useEffect, useState } from "react";
import Sidenav from "../../components/Sidenav/Sidenav";
import Nav from "../../components/Navbar/Nav";
import { Layout, Button, Form, Input, Select } from "antd";
import MobileSidenav from "../../components/Sidenav/MobileSidenav";
// import { //toast } from "react-//toastify";
import { useNavigate } from "react-router-dom";
import { fnAddPart } from "../../functions/PartInventory/partInv";
import { fnGetMachine } from "../../functions/MachineType/machineType";

const { Content } = Layout;
const { Option } = Select;

const CreatePartInv = () => {
  const [loading, setLoading] = useState("");
  const [partName, setPartName] = useState("");
  const [machines, setMachines] = useState([]);
  const [machineName, setMachineName] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      fnAddPart(partName, machineName)
        .then((res) => {
          if (res.status === 400) {
            // //toast.error("Part Not Created");
            setLoading(false);
            return;
          } else if (res.status === 200) {
            // //toast.success("Part Created");
            setLoading(false);
            navigate("/all-parts-inventory");
          }
        })
        .catch((err) => {
          // //toast.error(err);
          console.log(err);
          setLoading(false);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const loadMachineType = async () => {
    fnGetMachine()
      .then((res) => setMachines(res.data.reverse()))
      .catch((err) => {
        console.log(err);
        // //toast.error(err);
      });
  };

  useEffect(() => {
    loadMachineType();
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
                <h1>Add-Part in Inventory</h1>
              </div>
              <div className="login_form signup_form">
                <Form
                  layout="vertical"
                  className="login-form"
                  onFinish={handleSubmit}
                >
                  {/* part-name */}
                  <Form.Item
                    name="partname"
                    label="Part Name"
                    rules={[
                      {
                        required: true,
                        message: "please provide part-name!",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input
                      name="partname"
                      value={partName}
                      onChange={(e) => setPartName(e.target.value)}
                    />
                  </Form.Item>

                  {/* machine-name */}
                  <Form.Item
                    name="machineName"
                    label="Machine Name"
                    rules={[
                      {
                        required: true,
                        message: "please provide machine-name!",
                      },
                    ]}
                    hasFeedback
                  >
                    <Select
                      value={machineName}
                      onChange={(e) => setMachineName(e)}
                    >
                      {machines.map((item) => (
                        <Option key={item.machineid} value={item.machinename}>
                          {item.machinename}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  {/* add part-button */}
                  <Form.Item>
                    <div className="login_btn">
                      <Button
                        className="login-form-button"
                        htmlType="submit"
                        block
                        loading={loading}
                      >
                        Add Part
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

export default CreatePartInv;
