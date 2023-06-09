import React, { useEffect, useState } from "react";
import Sidenav from "../../components/Sidenav/Sidenav";
import Nav from "../../components/Navbar/Nav";
import {
  Layout,
  Modal,
  Button,
  Form,
  Input,
  Table,
  Space,
  Tooltip,
} from "antd";
import MobileSidenav from "../../components/Sidenav/MobileSidenav";
// import { //toast } from "react-//toastify";
import {
  AiOutlineClose,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineSave,
} from "react-icons/ai";
import {
  fnGetServiceDetail,
  fnUpdateServiceDetail,
  fnDeleteServiceDetail,
  fnGetAllServiceDetails,
} from "../../functions/ServiceDetail/serviceDetail";
import { useSelector } from "react-redux";
import { selectUserId, selectUserType } from "../../redux/userSlice";
import {
  Table as RTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import UpdateServiceModal from "../../components/Modal/UpdateServiceModal";
import "../../styles/User/AllUser.css";

const { Content } = Layout;

const AllServiceDetail = () => {
  const [loading, setLoading] = useState(false);
  const [editRowKey, setEditRowKey] = useState("");
  const [serviceDetails, setServiceDetails] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editRowId, setEditRowId] = useState("");

  const [form] = Form.useForm();
  const userId = useSelector(selectUserId);
  const userType = useSelector(selectUserType);

  const loadServiceDetail = async () => {
    if (userType === "engineer") {
      fnGetServiceDetail(userId)
        .then((res) => {
          console.log(res);
          setServiceDetails(res.data.reverse());
        })
        .catch((err) => {
          console.log(err);
          // //toast.error(err);
        });
    } else {
      fnGetAllServiceDetails()
        .then((res) => {
          setServiceDetails(res.data.reverse());
        })
        .catch((err) => {
          console.log(err);
          // //toast.error(err);
        });
    }
  };

  useEffect(() => {
    loadServiceDetail();
  }, []);

  const isEditing = (record) => {
    return record.serviceid === editRowKey;
  };

  const columns = [
    {
      title: "Engineer Name",
      dataIndex: "engineername",
      align: "center",
      responsive: ["sm"],
    },
    {
      title: "Description",
      dataIndex: "description",
      align: "center",
      editTable: true,
      responsive: ["sm"],
      render: (_, record) => {
        return <div>{!record.description ? "---" : record.description}</div>;
      },
    },
    {
      title: "Kilometer",
      dataIndex: "km",
      align: "center",
      editTable: true,
      responsive: ["sm"],
    },
    {
      title: "PerKm",
      dataIndex: "perkm",
      align: "center",
      editTable: true,
      responsive: ["sm"],
    },
    {
      title: "Cost",
      dataIndex: "cost",
      align: "center",
      responsive: ["sm"],
    },
    {
      title: "Date",
      dataIndex: "date",
      align: "center",
      responsive: ["sm"],
    },

    {
      title: "Action",
      align: "center",
      responsive: ["sm"],
      render: (_, record) => {
        const editable = isEditing(record);
        return (
          (userType === "admin" || userType === "engineer") && (
            <Space size="middle">
              {editable ? (
                <span>
                  <Space size="middle">
                    <Tooltip title="Save">
                      <Button
                        onClick={() => save(record.serviceid)}
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
          )
        );
      },
    },
  ];

  const cancel = () => {
    setEditRowKey("");
  };

  const save = async (serviceId) => {
    try {
      setLoading(true);
      const row = await form.validateFields();
      fnUpdateServiceDetail(serviceId, row.description, row.km, row.perkm)
        .then((res) => {
          if (res.status === 400) {
            // //toast.error("Service Detail Not Updated");
            setLoading(false);
            return;
          } else if (res.status === 200) {
            // //toast.success("Service Detail Updated Successfully");
            setLoading(false);
            loadServiceDetail();
          }
        })
        .catch((err) => {
          console.log(err);
        });

      setEditRowKey("");
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const edit = (record) => {
    form.setFieldsValue({
      description: "",
      cost: "",
      date: "",
      ...record,
    });
    setEditRowKey(record.serviceid);
  };

  const deleteData = (record) => {
    Modal.confirm({
      title: `Do you want to Delete this Record}?`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        fnDeleteServiceDetail(record.serviceid)
          .then((res) => {
            if (res.status === 200) {
              // //toast.success(`Record Deleted Successfully`);
              loadServiceDetail();
            }
            // else toast.error(`Record Not Deleted `);
          })
          .catch((err) => {
            console.log(err);
            // //toast.error(`Record Not Deleted `);
          });
      },
    });
  };

  const spaceExp = /\s/g;
  const charExp = /^\d+$/;

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
        {editing && dataIndex === "description" ? (
          <Form.Item name={dataIndex}>
            <Input />
          </Form.Item>
        ) : editing && dataIndex === "km" ? (
          <Form.Item
            name={dataIndex}
            rules={[
              {
                required: true,
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (spaceExp.test(value))
                    return Promise.reject("cost not contain empty space");
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
            <Input />
          </Form.Item>
        ) : editing && dataIndex === "perkm" ? (
          <Form.Item
            name={dataIndex}
            rules={[
              {
                required: true,
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (spaceExp.test(value))
                    return Promise.reject("cost not contain empty space");
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
            <Input />
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const total = serviceDetails.length;

  const mobileEdit = (row) => {
    console.log(row);
    setEditRowId(row.issueid);
    form.setFieldsValue({
      issuename: row.issue,
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

    fnUpdateServiceDetail(editRowId, form.getFieldsValue().issuename)
      .then((res) => {
        if (res.status === 400) {
          //toast.error(`${row.username} Not Updated`);
          return;
        } else if (res.status === 200) {
          setVisible(false);
          loadServiceDetail();
          //toast.success("User Updated");
        }
      })
      .catch((err) => console.log(err));
  };

  const RColumns = [
    "Action",
    "Engineer Name",
    "Description",
    "Kilometer",
    "PerKm",
    "Cost",
    "Date",
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <MobileSidenav />
      <Sidenav />
      <UpdateServiceModal
        visible={visible}
        setVisible={setVisible}
        form={form}
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
                  {serviceDetails.map((row) => (
                    <Tr key={row.issueid}>
                      <Td>
                        <Space size="middle">
                          <Tooltip title="Edit">
                            <AiOutlineEdit
                              color="#1890ff"
                              cursor="pointer"
                              size={18}
                              disabled={row.status === "close"}
                              onClick={() => mobileEdit(row)}
                            />
                          </Tooltip>
                          <Tooltip title="Delete">
                            <AiOutlineDelete
                              color="#cf1235"
                              cursor="pointer"
                              size={18}
                              disabled={row.status === "close"}
                              onClick={() => deleteData(row)}
                            />
                          </Tooltip>
                        </Space>
                      </Td>

                      <Td>{row.issuename}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </RTable>
            </div>
            <Form form={form} component={false}>
              <Table
                loading={loading}
                rowKey={(record) => record.serviceid}
                columns={mergedColumn}
                components={{ body: { cell: editableCell } }}
                pagination={{
                  defaultCurrent: 1,
                  total: total,
                  defaultPageSize: 5,
                  showSizeChanger: false,
                  showQuickJumper: true,
                }}
                dataSource={serviceDetails}
                bordered
                pagination={{
                  pageSize: 10,
                }}
              />
            </Form>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AllServiceDetail;
