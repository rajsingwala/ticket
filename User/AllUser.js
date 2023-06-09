import React, { useState, useEffect } from "react";
import Sidenav from "../../components/Sidenav/Sidenav";
import Nav from "../../components/Navbar/Nav";
import {
  Layout,
  Table,
  Space,
  Modal,
  Tooltip,
  Form,
  Input,
  Select,
  Button,
  Radio,
} from "antd";
import {
  AiOutlineClose,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineMail,
  AiOutlineUser,
  AiOutlineSave,
} from "react-icons/ai";
import MobileSidenav from "../../components/Sidenav/MobileSidenav";
import "../../styles/User/AllUser.css";
import {
  fnDeleteUser,
  fnGetAllUser,
  fnUpdateUser,
} from "../../functions/User/user";
// import { //toast } from "react-//toastify";
import { useSelector } from "react-redux";
import { selectUserId, selectUserType } from "../../redux/userSlice";
import UpdateUserModal from "../../components/Modal/UpdateUserModal";
import {
  Table as RTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

const { Content } = Layout;
const { Option } = Select;

const AllUser = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editRowKey, setEditRowKey] = useState("");
  const [form] = Form.useForm();

  const userId = useSelector(selectUserId);
  const reduxUserType = useSelector(selectUserType);
  const [editType, setEditType] = useState(false);
  const [userRowId, setUserRowId] = useState("");

  const [visible, setVisible] = useState(false);

  const isEditing = (record) => {
    return record.userid === editRowKey;
  };

  const cancel = () => {
    setEditRowKey("");
  };

  const mobileExp = /^[6-9]\d{9}$/gi;

  const charExp = /^\d+$/;
  const spaceExp = /\s/g;

  const save = async (userid) => {
    try {
      setLoading(true);
      const row = await form.validateFields();
      fnUpdateUser(
        userid,
        row.username,
        row.email,
        row.mobile,
        row.companyname,
        row.usertype,
        row.underamc
      ).then((res) => {
        if (res.status === 400) {
          //toast.error(`${row.username} Not Updated`);
          setLoading(false);
          return;
        } else if (res.status === 200) {
          //toast.success("User Updated");
          setLoading(false);
          loadData();
        }
      });

      setEditRowKey("");
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const edit = (record) => {
    form.setFieldsValue({
      username: "",
      companyname: "",
      mobile: "",
      usertype: "",
      email: "",
      ...record,
    });
    setEditRowKey(record.userid);
  };

  const loadData = async () => {
    setLoading(true);
    fnGetAllUser()
      .then((res) => {
        setData(res.data.reverse());
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
    reduxUserType === "admin" && setEditType(true);
  }, []);

  const arr = [
    {
      id: 1,
      username: "pqr",
    },
    {
      id: 2,
      username: "xyz",
    },
    {
      id: 3,
      username: "pqr",
    },
    {
      id: 4,
      username: "abc",
    },
    {
      id: 5,
      username: "xyz",
    },
    {
      id: 6,
      username: "abc",
    },
    {
      id: 7,
      username: "abc",
    },
    {
      id: 8,
      username: "pqr",
    },
    {
      id: 9,
      username: "xyz",
    },
    {
      id: 10,
      username: "abc",
    },
  ];

  const [userFilter, setUserFilter] = useState([]);
  useEffect(() => {
    var idx = 0;

    var temp = [];
    for (idx = 0; idx < arr.length; ++idx) {
      var obj = {};
      obj["text"] = arr[idx].username;
      obj["value"] = arr[idx].username;

      temp.push(obj);
    }
    temp = [...new Map(temp.map((item) => [item["text"], item])).values()];
    setUserFilter(temp);
  }, []);

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      align: "center",
      editTable: true,
      responsive: ["sm"],
      filters: userFilter,
      onFilter: (value, record) => record.username === value,
    },
    {
      title: "Company-Name",
      dataIndex: "companyname",
      align: "center",
      editTable: true,
      responsive: ["sm"],
    },
    {
      title: "Mobile-No",
      dataIndex: "mobile",
      align: "center",
      editTable: true,
      responsive: ["sm"],
    },
    {
      title: "Email",
      dataIndex: "email",
      align: "center",
      editTable: true,
      responsive: ["sm"],
      render: (_, record) => {
        return <div>{!record.email ? "---" : record.email}</div>;
      },
    },
    {
      title: "User-Type",
      dataIndex: "usertype",
      align: "center",
      editTable: true,
      responsive: ["sm"],
    },
    {
      title: "UnderAmc",
      dataIndex: "underamc",
      align: "center",
      editTable: true,
      responsive: ["sm"],
    },
    {
      title: "Action",
      align: "center",
      responsive: ["sm"],
      render: (_, record) => {
        const editable = isEditing(record);
        return (
          <Space size="middle">
            {editable ? (
              <span>
                <Space size="middle">
                  <Tooltip title="Save">
                    <Button
                      onClick={() => save(record.userid)}
                      className="icon_btn"
                    >
                      <AiOutlineSave
                        color="#1890ff"
                        cursor="pointer"
                        size={18}
                      />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Cancel">
                    <Button onClick={cancel} className="icon_btn">
                      <AiOutlineClose
                        color="#b6102e"
                        cursor="pointer"
                        size={18}
                      />
                    </Button>
                  </Tooltip>
                </Space>
              </span>
            ) : (
              <Tooltip title="Edit">
                <Button onClick={() => edit(record)} className="icon_btn">
                  <AiOutlineEdit
                    color="#1890ff"
                    cursor="pointer"
                    size={18}
                    // onClick={() => editData(record)}
                  />
                </Button>
              </Tooltip>
            )}

            <Tooltip title="Delete">
              <Button
                disabled={editable}
                onClick={() => deleteData(record)}
                className="icon_btn"
              >
                <AiOutlineDelete color="#cf1235" cursor="pointer" size={18} />
              </Button>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const total = data.length;

  const deleteData = (record) => {
    Modal.confirm({
      title: `Do you want to Delete ${record.username}?`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        if (record.userid === userId) {
          //toast.error("Currently LoggedIn User Can't Deleted");
          return;
        }
        fnDeleteUser(record.userid)
          .then((res) => {
            if (res.status === 200) {
              //toast.success(`${record.username} Deleted Successfully`);
              loadData();
            }
            // else toast.error(`${record.username} Not Deleted `);
          })
          .catch((err) => {
            console.log(err);
            //toast.error(`${record.username} Not Deleted `);
          });
      },
    });
  };

  const mergedColumn = columns.map((col) => {
    if (!col.editTable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const editableCell = ({
    editing,
    dataIndex,
    title,
    record,
    children,
    ...restProps
  }) => {
    return (
      <td {...restProps}>
        {editing && dataIndex === "username" ? (
          <Form.Item
            name={dataIndex}
            rules={[
              {
                required: true,
                message: "please provide username!",
              },
              { min: 3 },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>
        ) : editing && dataIndex === "companyname" ? (
          <Form.Item
            name={dataIndex}
            rules={[
              {
                required: true,
                message: "please provide company name!",
              },
              { min: 3 },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>
        ) : editing && dataIndex === "mobile" ? (
          <Form.Item
            name={dataIndex}
            rules={[
              {
                required: true,
                message: "please provide mobile-no!",
              },
              { len: 10 },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (spaceExp.test(value))
                    return Promise.reject("password not contain empty space");
                  return Promise.resolve();
                },
              }),
              {
                validator: (_, value) =>
                  charExp.test(value)
                    ? Promise.resolve()
                    : Promise.reject("please provide valid mobile-no!"),
              },
            ]}
            hasFeedback
          >
            <Input type="tel" />
          </Form.Item>
        ) : editing && dataIndex === "email" ? (
          <Form.Item
            name={dataIndex}
            rules={[
              {
                type: "email",
                message: "please provide valid email!",
              },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>
        ) : editing && dataIndex === "usertype" && editType ? (
          <Form.Item
            name={dataIndex}
            rules={[
              {
                required: true,
                message: "please select user-type!",
              },
            ]}
            hasFeedback
          >
            <Select>
              <Option value="customer">Customer</Option>
              <Option value="engineer">Engineer</Option>
              <Option value="admin">Admin</Option>
              <Option value="account">Account</Option>
              <Option value="operator">Operator</Option>
            </Select>
          </Form.Item>
        ) : editing && dataIndex === "underamc" ? (
          <Form.Item
            name={dataIndex}
            rules={[
              {
                required: true,
                message: "please select underAmc!",
              },
            ]}
            hasFeedback
          >
            <Radio.Group>
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
            </Radio.Group>
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
  {
    const RColumns = [
      "Action",
      "Username",
      "Company-Name",
      "Mobile-No",
      "Email",
      "User-Type",
      "UnderAmc",
    ];

    const mobileEdit = (row) => {
      setUserRowId(row.userid);
      form.setFieldsValue({
        username: row.username,
        companyname: row.companyname,
        mobile: row.mobile,
        usertype: row.usertype,
        email: row.email,
        underamc: row.underamc,
        ...row,
      });
      setVisible(true);
    };

    const handleSubmit = () => {
      let isErr = false;

      let idx = 0;

      for (idx = 0; idx < form.getFieldsError().length; ++idx) {
        if (form.getFieldsError()[idx].errors.length !== 0) {
          isErr = true;
          return;
        }
      }

      fnUpdateUser(
        userRowId,
        form.getFieldsValue().username,
        form.getFieldsValue().email,
        form.getFieldsValue().mobile,
        form.getFieldsValue().companyname,
        form.getFieldsValue().usertype,
        form.getFieldsValue().underamc
      )
        .then((res) => {
          if (res.status === 400) {
            //toast.error(`${row.username} Not Updated`);
            return;
          } else if (res.status === 200) {
            setVisible(false);
            loadData();
            //toast.success("User Updated");
          }
        })
        .catch((err) => console.log(err));
    };

    return (
      <Layout style={{ minHeight: "100vh" }}>
        <MobileSidenav />
        <Sidenav />

        <UpdateUserModal
          visible={visible}
          form={form}
          setVisible={setVisible}
          handleSubmit={handleSubmit}
        />
        <Layout className="site-layout">
          <Nav />
          <Content style={{ margin: "0 16px" }}>
            <div className="all_user">
              <div className="res_table">
                <RTable>
                  <Thead>
                    <Tr>
                      {RColumns.map((col) => (
                        <Th key={col}>{col}</Th>
                      ))}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data.map((row) => (
                      <Tr key={row.userid}>
                        <Td>
                          <Space size="middle">
                            <AiOutlineEdit
                              color="#1890ff"
                              cursor="pointer"
                              size={16}
                              onClick={() => mobileEdit(row)}
                            />

                            <AiOutlineDelete
                              color="#cf1235"
                              cursor="pointer"
                              size={16}
                              onClick={() => deleteData(row)}
                            />
                          </Space>
                        </Td>

                        <Td>{row.username}</Td>
                        <Td>{row.companyname}</Td>
                        <Td>{row.mobile}</Td>
                        <Td>{row.email ? row.email : "---"}</Td>
                        <Td>{row.usertype}</Td>
                        <Td>{row.underamc}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </RTable>
              </div>
              <Form form={form} component={false}>
                <Table
                  loading={loading}
                  rowKey={(record) => record.userid}
                  columns={mergedColumn}
                  components={{ body: { cell: editableCell } }}
                  dataSource={arr}
                  bordered
                  pagination={{
                    defaultCurrent: 1,
                    total: total,
                    defaultPageSize: 5,
                    showSizeChanger: false,
                    showQuickJumper: true,
                  }}
                />
              </Form>
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
};

export default AllUser;
