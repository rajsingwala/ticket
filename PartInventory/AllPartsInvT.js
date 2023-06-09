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
  fnDeletePartT,
  fnGetPartT,
  fnUpdatePartT,
} from "../../functions/PartInventory/partInv";
import {
  AiOutlineClose,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineSave,
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import "../../styles/User/AllUser.css";
import { useSelector } from "react-redux";
import { selectUserType } from "../../redux/userSlice";
import {
  Table as RTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import UpdatePartInvTModal from "../../components/Modal/UpdatePartInvTModal";

const { Content } = Layout;

const AllPartsInvT = () => {
  const [loading, setLoading] = useState(false);
  const [editRowKey, setEditRowKey] = useState("");
  const [parts, setParts] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editRowId, setEditRowId] = useState(false);

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const userType = useSelector(selectUserType);

  useEffect(() => {
    if (userType === "account" || userType === "engineer") {
      navigate("/all-parts-inventory");
      // //toast.info("Access Denied");
    }
  }, []);

  const loadParts = async () => {
    setLoading(true);
    fnGetPartT()
      .then((res) => {
        setParts(res.data.reverse());
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        // //toast.error(err);
      });
  };

  useEffect(() => {
    loadParts();
  }, []);

  const isEditing = (record) => {
    return record.partid === editRowKey;
  };

  const columns = [
    {
      title: "Part Name",
      dataIndex: "partname",
      align: "center",
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
                      onClick={() => save(record.partid)}
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

            {/* <Tooltip title="Delete">
              <Button
                disabled={editable}
                onClick={() => deleteData(record)}
                className="icon_btn"
              >
                <AiOutlineDelete color="#cf1235" cursor="pointer" size={18} />
              </Button>
            </Tooltip> */}
          </Space>
        );
      },
    },
  ];

  const cancel = () => {
    setEditRowKey("");
  };

  const save = async (partid) => {
    try {
      setLoading(true);
      const row = await form.validateFields();
      fnUpdatePartT(partid, row.quantity)
        .then((res) => {
          if (res.status === 400) {
            // //toast.error("Part Not U pdated");
            setLoading(false);
            return;
          } else if (res.status === 200) {
            // //toast.success("Part Updated Successfully");
            setLoading(false);
            loadParts();
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
      ...record,
    });
    setEditRowKey(record.partid);
  };

  const deleteData = (record) => {
    Modal.confirm({
      title: `Do you want to Delete ${record.partname}?`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        fnDeletePartT(record.partid)
          .then((res) => {
            if (res.status === 200) {
              // //toast.success(`${record.partname} Deleted Successfully`);
              loadParts();
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
        {editing && dataIndex === "quantity" ? (
          <Form.Item
            rules={[
              {
                required: true,
                message: "please provide quantity!",
              },
            ]}
            hasFeedback
            name={dataIndex}
          >
            <Input type="number" />
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const total = parts.length;

  const RColumn = ["Part Name", "Quantity"];

  const handleSubmit = () => {
    let isErr = false;

    let idx = 0;

    for (idx = 0; idx < form.getFieldsError().length; ++idx) {
      if (form.getFieldsError()[idx].errors.length !== 0) {
        isErr = true;
        return;
      }
    }

    fnUpdatePartT(editRowId, form.getFieldsValue().quantity)
      .then((res) => {
        if (res.status === 400) {
          //toast.error(`${row.username} Not Updated`);
          return;
        } else if (res.status === 200) {
          setVisible(false);
          loadParts();
          //toast.success("User Updated");
        }
      })
      .catch((err) => console.log(err));
  };

  const mobileEdit = (row) => {
    setEditRowId(row.partid);
    form.setFieldsValue({
      quantity: row.quantity,
      ...row,
    });
    setVisible(true);
  };

  const RColumns = ["Action", "Part Name", "Quantity"];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <MobileSidenav />
      <Sidenav />
      <UpdatePartInvTModal
        form={form}
        visible={visible}
        setVisible={setVisible}
        handleSubmit={handleSubmit}
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
                  {parts.map((row) => (
                    <Tr key={row.partid}>
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
                        </Space>
                      </Td>

                      <Td>{row.partname}</Td>
                      <Td>{row.quantity}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </RTable>
            </div>
            <Form form={form} component={false}>
              <Table
                loading={loading}
                rowKey={(record) => record.partid}
                columns={mergedColumn}
                components={{ body: { cell: editableCell } }}
                dataSource={parts}
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

export default AllPartsInvT;
