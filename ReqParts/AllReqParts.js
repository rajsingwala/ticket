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
  AiOutlineClose,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineSave,
} from "react-icons/ai";
import "../../styles/User/AllUser.css";
import { useSelector } from "react-redux";
import {
  fnDeleteReqPart,
  fnGetReqPart,
  fnUpdateReqPart,
} from "../../functions/ReqParts/reqParts";
import { selectUserId, selectUserType } from "../../redux/userSlice";
import { fnGetPart } from "../../functions/PartInventory/partInv";
import {
  Table as RTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import UpdateReqPartModal from "../../components/Modal/UpdateReqPartModal";

const { Content } = Layout;
const { Option } = Select;

const AllReqParts = () => {
  const [parts, setParts] = useState([]);
  const [reqParts, setReqParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editRowKey, setEditRowKey] = useState("");
  const [editRowId, setEditRowId] = useState("");
  const [visible, setVisible] = useState(false);

  const [form] = Form.useForm();
  const userId = useSelector(selectUserId);
  const userType = useSelector(selectUserType);

  const loadReqParts = async () => {
    fnGetReqPart(userId)
      .then((res) => {
        setReqParts(res.data.reverse());
      })
      .catch((err) => {
        console.log(err);
        // //toast.error(err);
      });
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
    loadReqParts();
    loadParts();
  }, []);

  const isEditing = (record) => {
    return record.partreqid === editRowKey;
  };

  const columns = [
    {
      title: "Ticket Id",
      dataIndex: "ticketid",
      align: "center",
      responsive: ["sm"],
    },
    {
      title: "Part Name",
      dataIndex: "partname",
      align: "center",
      editTable: true,
      responsive: ["sm"],
    },
    {
      title: "Request Type",
      dataIndex: "requesttype",
      align: "center",
      editTable: true,
      responsive: ["sm"],
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      align: "center",
      editTable: true,
      responsive: ["sm"],
    },
    {
      title: "Contract",
      dataIndex: "contract",
      align: "center",
      responsive: ["sm"],
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
                      onClick={() => save(record.partreqid)}
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
                <Button
                  onClick={() => edit(record)}
                  className="icon_btn"
                  disabled={record.status === "close"}
                >
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

  const cancel = () => {
    setEditRowKey("");
  };

  const save = async (partreqid) => {
    try {
      setLoading(true);
      const row = await form.validateFields();
      console.log(partreqid);
      fnUpdateReqPart(
        partreqid,
        row.quantity,
        row.requesttype,
        row.partname,
        row.contract
      )
        .then((res) => {
          if (res.status === 400) {
            // //toast.error("Part Not Updated");
            setLoading(false);
            return;
          } else if (res.status === 200) {
            // //toast.success("Part Updated Successfully");
            setLoading(false);
            loadReqParts();
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
      quantity: "",
      requesttype: "",
      contract: "",
      partname: "",
      ...record,
    });
    setEditRowKey(record.partreqid);
  };

  const deleteData = (record) => {
    Modal.confirm({
      title: `Do you want to Delete ${record.partname}?`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        fnDeleteReqPart(record.partreqid)
          .then((res) => {
            if (res.status === 200) {
              // //toast.success(`${record.partname} Deleted Successfully`);
              loadReqParts();
            }
            // else toast.error(`${record.partname} Not Deleted `);
          })
          .catch((err) => {
            console.log(err);
            // //toast.error(`${record.partname} Not Deleted `);
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
        {editing && dataIndex === "partname" ? (
          <Form.Item
            name={dataIndex}
            name="partname"
            rules={[{ required: true }]}
            hasFeedback
          >
            <Select name="partname">
              {parts.map((part) => (
                <Option key={part.partid} value={part.partname}>
                  {part.partname}
                </Option>
              ))}
            </Select>
          </Form.Item>
        ) : editing && dataIndex === "quantity" ? (
          <Form.Item
            name={dataIndex}
            name="quantity"
            rules={[{ required: true }]}
            hasFeedback
          >
            <Input name="quantity" min={1} type="number" />
          </Form.Item>
        ) : editing && dataIndex === "requesttype" ? (
          <Form.Item
            name={dataIndex}
            name="requesttype"
            rules={[{ required: true }]}
            hasFeedback
          >
            <Select name="requesttype">
              <Option value="issue">Issue</Option>
              <Option value="return">Return</Option>
            </Select>
          </Form.Item>
        ) : editing && dataIndex === "contract" ? (
          <Form.Item
            name={dataIndex}
            name="contract"
            rules={[{ required: true }]}
            hasFeedback
          >
            <Select name="contract">
              <Option value="amc">Amc</Option>
              <Option value="warranty">Warranty</Option>
              <Option value="oncall">OnCall</Option>
            </Select>
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const total = AllReqParts.length;

  const mobileEdit = (row) => {
    setEditRowId(row.partreqid);
    form.setFieldsValue({
      ticketid: row.ticketid,
      partname: row.partname,
      requestype: row.requestype,
      quantity: row.quantity,
      contract: row.contract,
      ...row,
    });
    setVisible(true);
  };

  const RColumns = [
    "Action",
    "Ticket Id",
    "Part Name",
    "Request Type",
    "Quantity",
    "Contract",
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

    fnUpdateReqPart(
      editRowId,
      form.getFieldsValue().quantity,
      form.getFieldsValue().requesttype,
      form.getFieldsValue().partname,
      form.getFieldsValue().contract
    )
      .then((res) => {
        if (res.status === 400) {
          //toast.error(`${row.username} Not Updated`);
          return;
        } else if (res.status === 200) {
          setVisible(false);
          loadReqParts();
          //toast.success("User Updated");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <MobileSidenav />
      <Sidenav />
      <UpdateReqPartModal
        form={form}
        visible={visible}
        setVisible={setVisible}
        handleSubmit={handleSubmit}
        parts={parts}
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
                  {reqParts.map((row) => (
                    <Tr key={row.partreqid}>
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

                      <Td>{row.ticketid}</Td>
                      <Td>{row.partname}</Td>
                      <Td>{row.requesttype}</Td>
                      <Td>{row.quantity}</Td>
                      <Td>{row.contract}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </RTable>
            </div>
            <Form form={form} component={false}>
              <Table
                loading={loading}
                rowKey={(record) => record.partreqid}
                columns={mergedColumn}
                components={{ body: { cell: editableCell } }}
                dataSource={reqParts}
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
};

export default AllReqParts;
