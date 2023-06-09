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
  Select,
} from "antd";
import MobileSidenav from "../../components/Sidenav/MobileSidenav";
// import { //toast } from "react-//toastify";
import {
  fnAllTicket,
  fnDeleteTicket,
  fnUpdateTicket,
} from "../../functions/Ticket/ticket";
import {
  AiOutlineClose,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineSave,
  AiOutlineTool,
  AiOutlineDownload,
} from "react-icons/ai";
import { fnGetAllUser } from "../../functions/User/user";
import "../../styles/User/AllUser.css";
import { fnGetMachine } from "../../functions/MachineType/machineType";
import { fnGetIssue } from "../../functions/IssueType/issueType";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setId } from "../../redux/reqPartSlice";
import { fnGetReqPart } from "../../functions/ReqParts/reqParts";
import { selectUserId, selectUserType } from "../../redux/userSlice";
import { RiMotorbikeFill } from "react-icons/ri";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Challan from "../../components/Pdf/Challan";
import Ticket from "../../components/Pdf/Ticket";
import {
  Table as RTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import UpdateTicketModal from "../../components/Modal/UpdateTicketModal";

const { Content } = Layout;
const { Option } = Select;

const AllTicket = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editRowKey, setEditRowKey] = useState("");
  const [users, setUsers] = useState([]);
  const [issues, setIssues] = useState([]);
  const [machines, setMachines] = useState([]);
  const [reqParts, setReqParts] = useState([]);
  const [visible, setVisible] = useState(false);
  const [ticketRowId, setTicketRowId] = useState("");

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const userType = useSelector(selectUserType);

  const loadReqPart = async () => {
    fnGetReqPart(userId)
      .then((res) => {
        setReqParts(res.data.reverse());
      })
      .catch((err) => {
        console.log(err);
        // //toast.error(err);
      });
  };

  const loadTicket = async () => {
    setLoading(true);
    fnAllTicket()
      .then((res) => {
        setTickets(res.data.reverse());
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        // //toast.error(err);
      });
  };

  const loadUsers = async () => {
    fnGetAllUser()
      .then((res) => setUsers(res.data))
      .catch((err) => {
        console.log(err);
        // //toast.error(err);
      });
  };

  const loadIssueType = async () => {
    fnGetIssue()
      .then((res) => setIssues(res.data.reverse()))
      .catch((err) => {
        console.log(err);
        //toast.error(err);
      });
  };

  const loadMachineType = async () => {
    fnGetMachine()
      .then((res) => setMachines(res.data.reverse()))
      .catch((err) => {
        console.log(err);
        //toast.error(err);
      });
  };

  useEffect(() => {
    loadUsers();
    loadTicket();
    loadReqPart();
    loadIssueType();
    loadMachineType();
  }, []);

  const isEditing = (record) => {
    return record.ticketid === editRowKey;
  };

  const handleParts = (ticketId) => {
    dispatch(setId({ ticketId: ticketId }));
    navigate("/add-required-part");
  };

  const handleService = (ticketId) => {
    dispatch(setId({ ticketId: ticketId }));
    navigate("/add-service-detail");
  };

  const downloadPdf = (record, format) => {
    const partsArr = [];

    reqParts.map(
      (item) => item.ticketid === record.ticketid && partsArr.push(item)
    );

    return (
      <PDFDownloadLink
        document={
          format === "challan" ? (
            <Challan record={partsArr} fileName="CHALLAN" />
          ) : (
            <Ticket record={record} fileName="Ticket" partsArr={partsArr} />
          )
        }
      >
        <AiOutlineDownload />
      </PDFDownloadLink>
    );
  };

  const columns = [
    {
      title: "Ticket Id",
      dataIndex: "ticketid",
      align: "center",
      responsive: ["sm"],
    },
    {
      title: "Customer",
      dataIndex: "customer",
      align: "center",
      editTable: true,
      responsive: ["sm"],
    },
    {
      title: "Assigned Engineer",
      dataIndex: "engineer",
      align: "center",
      editTable: true,
      responsive: ["sm"],
      render: (_, record) => {
        return <div>{!record.engineer ? "---" : record.engineer}</div>;
      },
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
      title: "Status",
      dataIndex: "status",
      align: "center",
      responsive: ["sm"],

      editTable: true,
      responsive: ["sm"],
      render: (_, record) => {
        return <div>{!record.status ? "---" : record.status}</div>;
      },
    },
    {
      title: "Raise Date",
      dataIndex: "raisedate",
      align: "center",
      responsive: ["sm"],
    },
    {
      title: "Close Date",
      dataIndex: "closedate",
      align: "center",
      responsive: ["sm"],
      render: (_, record) => {
        return <div>{!record.closedate ? "---" : record.closedate}</div>;
      },
    },
    {
      title: "Issue Type",
      dataIndex: "issuetype",
      align: "center",
      responsive: ["sm"],
      editTable: true,
      render: (_, record) => {
        return <div>{!record.issuetype ? "---" : record.issuetype}</div>;
      },
    },
    {
      title: "Machine Type",
      dataIndex: "machinetype",
      align: "center",
      editTable: true,
      responsive: ["sm"],
      render: (_, record) => {
        return <div>{!record.machinetype ? "---" : record.machinetype}</div>;
      },
    },
    {
      title: "Download PDF",
      align: "center",
      responsive: ["sm"],
      render: (_, record) => {
        return (
          <Space>
            <Tooltip title="Download Challan">
              <Button className="icon_btn">
                {downloadPdf(record, "challan")}
              </Button>
            </Tooltip>
            <Tooltip title="Download Ticket">
              <Button className="icon_btn">
                {downloadPdf(record, "ticket")}
              </Button>
            </Tooltip>
          </Space>
        );
      },
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
                      onClick={() => save(record.ticketid)}
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
              <Space size="middle">
                {/* <Tooltip title="Download PDF">
                    <Button className="icon_btn">{downloadPdf(record)}</Button>
                  </Tooltip> */}
                <Tooltip title="Attach Parts">
                  <Button
                    onClick={() => handleParts(record.ticketid)}
                    className="icon_btn"
                    disabled={
                      record.status === "close" ||
                      userType === "account" ||
                      userType === "operator"
                    }
                  >
                    <AiOutlineTool color="#ff9900" cursor="pointer" size={18} />
                  </Button>
                </Tooltip>
                <Tooltip title="Attach Service Detail">
                  <Button
                    onClick={() => handleService(record.ticketid)}
                    className="icon_btn"
                    disabled={
                      record.status === "close" ||
                      userType === "account" ||
                      userType === "operator"
                    }
                  >
                    <RiMotorbikeFill
                      color="#37475a"
                      cursor="pointer"
                      size={18}
                    />
                  </Button>
                </Tooltip>
                <Tooltip title="Edit">
                  <Button
                    onClick={() => edit(record)}
                    className="icon_btn"
                    disabled={
                      record.status === "close" ||
                      userType === "account" ||
                      userType === "operator"
                    }
                  >
                    <AiOutlineEdit
                      color="#1890ff"
                      cursor="pointer"
                      size={18}
                      // onClick={() => editData(record)}
                    />
                  </Button>
                </Tooltip>
              </Space>
            )}

            <Tooltip title="Delete">
              <Button
                disabled={
                  editable || userType === "account" || userType === "operator"
                }
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

  const cancel = () => {
    setEditRowKey("");
  };

  const save = async (ticketid) => {
    try {
      setLoading(true);
      const row = await form.validateFields();
      fnUpdateTicket(
        ticketid,
        row.engineer,
        row.description,
        row.status,
        row.issuetype,
        row.machinetype
      )
        .then((res) => {
          if (res.status === 400) {
            //toast.error("Ticket Not Updated");
            setLoading(false);
            return;
          } else if (res.status === 200) {
            //toast.success("Ticket Updated Successfully");
            setLoading(false);
            loadTicket();
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
      engineer: "",
      description: "",
      status: "",
      issuetype: "",
      machinetype: "",
      ...record,
    });
    setEditRowKey(record.ticketid);
  };

  const deleteData = (record) => {
    Modal.confirm({
      title: `Do you want to Delete Ticket Id ${record.ticketid}?`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        fnDeleteTicket(record.ticketid)
          .then(
            (res) => {
              if (res.status === 200) {
                //toast.success(
                // `Ticket Id ${record.ticketid} Deleted Successfully`
              }
              loadTicket();
            }
            // else toast.error(`Ticket Id ${record.ticketid} Not Deleted `);
          )
          .catch((err) => {
            console.log(err);
            //toast.error(`${record.ticketid} Not Deleted `);
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
        {editing && dataIndex === "engineer" ? (
          <Form.Item name={dataIndex}>
            <Select>
              {users.map(
                (item) =>
                  item.usertype === "engineer" && (
                    <Option value={item.username} key={item.userid}>
                      {item.username}
                    </Option>
                  )
              )}
            </Select>
          </Form.Item>
        ) : editing && dataIndex === "description" ? (
          <Form.Item name={dataIndex}>
            <Input />
          </Form.Item>
        ) : editing && dataIndex === "status" ? (
          <Form.Item name={dataIndex}>
            <Select>
              <Option value="open">Open</Option>
              <Option value="close">Close</Option>
            </Select>
          </Form.Item>
        ) : editing && dataIndex === "issuetype" ? (
          <Form.Item name={dataIndex}>
            <Select>
              {issues.map((item) => (
                <Option key={item.issueid} value={item.issuename}>
                  {item.issuename}
                </Option>
              ))}
            </Select>
          </Form.Item>
        ) : editing && dataIndex === "machinetype" ? (
          <Form.Item name={dataIndex}>
            <Select>
              {machines.map((item) => (
                <Option key={item.machineid} value={item.machinename}>
                  {item.machinename}
                </Option>
              ))}
            </Select>
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const mobileEdit = (row) => {
    setTicketRowId(row.ticketid);
    form.setFieldsValue({
      closedate: row.closedate,
      description: row.description,
      engineer: row.engineer,
      issue: row.issuetype,
      machine: row.machinetype,
      raisedate: row.raisedate,
      status: row.status,
      ...row,
    });
    setVisible(true);
  };

  const total = tickets.length;

  const RColumns = [
    "Download Pdf",
    "Action",
    "TicketId",
    "Customer",
    "Assigned Engineer",
    "Description",
    "Status",
    "Raise Date",
    "Close Date",
    "Issue Type",
    "Machine Type",
  ];

  const handleSubmit = () => {
    let isErr = false;

    let idx = 0;

    for (idx = 0; idx < form.getFieldsError().length; ++idx) {
      if (form.getFieldsError()[idx].errors.length !== 0) {
        isErr = true;
        return;
      }
    }

    fnUpdateTicket(
      ticketRowId,
      form.getFieldsValue().engineer,
      form.getFieldsValue().description,
      form.getFieldsValue().status,
      form.getFieldsValue().issue,
      form.getFieldsValue().machine
    )
      .then((res) => {
        if (res.status === 400) {
          //toast.error(`${row.username} Not Updated`);
          return;
        } else if (res.status === 200) {
          setVisible(false);
          loadTicket();
          //toast.success("User Updated");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <MobileSidenav />
      <Sidenav />
      <UpdateTicketModal
        visible={visible}
        form={form}
        handleSubmit={handleSubmit}
        setVisible={setVisible}
        users={users}
        issues={issues}
        machines={machines}
      />
      <Layout className="site-layout">
        <Nav />
        <Content style={{ margin: "0 16px" }}>
          <div className="all_user all_ticket">
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
                  {tickets.map((row) => (
                    <Tr key={row.ticketid}>
                      <Td>
                        <Space size="middle">
                          <Tooltip title="Download Challan">
                            {downloadPdf(row, "challan")}
                          </Tooltip>
                          <Tooltip title="Download Ticket">
                            {downloadPdf(row, "ticket")}
                          </Tooltip>
                        </Space>
                      </Td>

                      <Td>
                        <Space size="middle">
                          <Tooltip title="Attach Parts">
                            <AiOutlineTool
                              onClick={() => {
                                userType !== "account" &&
                                  handleParts(row.ticketid);
                              }}
                              color="#ff9900"
                              cursor="pointer"
                              size={18}
                            />
                          </Tooltip>
                          <Tooltip title="Attach Service Detail">
                            <RiMotorbikeFill
                              color="#37475a"
                              onClick={() => {
                                userType !== "account" &&
                                  handleService(row.ticketid);
                              }}
                              cursor="pointer"
                              size={18}
                            />
                          </Tooltip>
                          <Tooltip title="Edit">
                            <AiOutlineEdit
                              color="#1890ff"
                              cursor="pointer"
                              size={18}
                              disabled={
                                row.status === "close" || userType === "account"
                              }
                              onClick={() => {
                                userType !== "account" && mobileEdit(row);
                              }}
                            />
                          </Tooltip>

                          <Tooltip title="Delete">
                            <AiOutlineDelete
                              onClick={() => {
                                userType !== "account" && deleteData(row);
                              }}
                              color="#cf1235"
                              cursor="pointer"
                              size={18}
                              disabled={userType === "account"}
                            />
                          </Tooltip>
                        </Space>
                      </Td>

                      <Td>{row.ticketid}</Td>
                      <Td>{row.customer}</Td>
                      <Td>{row.engineer ? row.engineer : "---"}</Td>
                      <Td>{row.description ? row.description : "---"}</Td>
                      <Td>{row.status}</Td>
                      <Td>{row.raisedate}</Td>
                      <Td>{row.closedate ? row.closedate : "---"}</Td>
                      <Td>{row.issuetype ? row.issuetype : "---"}</Td>
                      <Td>{row.machinetype ? row.machinetype : "---"}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </RTable>
            </div>
            <Form form={form} component={false}>
              <Table
                loading={loading}
                rowKey={(record) => record.ticketid}
                columns={mergedColumn}
                components={{ body: { cell: editableCell } }}
                pagination={{
                  defaultCurrent: 1,
                  total: total,
                  defaultPageSize: 5,
                  showSizeChanger: false,
                  showQuickJumper: true,
                }}
                dataSource={tickets}
                expandable={{
                  expandedRowRender: (record) => (
                    <div>
                      {reqParts.map(
                        (item) =>
                          item && (
                            <div
                              className="all_ticket_req"
                              key={item.partreqid}
                            >
                              <span>
                                {item.ticketid === record.ticketid &&
                                  item.partname}
                              </span>
                            </div>
                          )
                      )}
                    </div>
                  ),
                }}
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

export default AllTicket;
