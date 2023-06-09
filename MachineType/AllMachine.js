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
  fnGetMachine,
  fnUpdateMachine,
  fnDeleteMachine,
} from "../../functions/MachineType/machineType";
import {
  Table as RTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import UpdateMachineModal from "../../components/Modal/UpdateMachineModal";
import "../../styles/User/AllUser.css";

const { Content } = Layout;

const AllMachine = () => {
  const [loading, setLoading] = useState(false);
  const [editRowKey, setEditRowKey] = useState("");
  const [machines, setMachines] = useState([]);

  const [editRowId, setEditRowId] = useState("");
  const [visible, setVisible] = useState(false);

  const [form] = Form.useForm();

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

  const isEditing = (record) => {
    return record.machineid === editRowKey;
  };

  const columns = [
    {
      title: "Machine Type",
      dataIndex: "machinename",
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
                      onClick={() => save(record.machineid)}
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

  const cancel = () => {
    setEditRowKey("");
  };

  const save = async (machineId) => {
    try {
      setLoading(true);
      const row = await form.validateFields();
      fnUpdateMachine(machineId, row.machinename)
        .then((res) => {
          if (res.status === 400) {
            //toast.error("MachineType Not Updated");
            setLoading(false);
            return;
          } else if (res.status === 200) {
            // //toast.success("MachineType Updated Successfully");
            setLoading(false);
            loadMachineType();
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
      machinename: "",
      ...record,
    });
    setEditRowKey(record.machineid);
  };

  const deleteData = (record) => {
    Modal.confirm({
      title: `Do you want to Delete ${record.machinename}?`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        fnDeleteMachine(record.machineid)
          .then((res) => {
            if (res.status === 200) {
              // //toast.success(`${record.machinename} Deleted Successfully`);
              loadMachineType();
              // } else //toast.error(`${record.machinename} Not Deleted `);
            }
          })
          .catch((err) => {
            console.log(err);
            // //toast.error(`${record.machinename} Not Deleted `);
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
        {editing && dataIndex === "machinename" ? (
          <Form.Item
            name={dataIndex}
            rules={[
              {
                required: true,
                message: "please provide machine-type!",
              },
              { min: 3 },
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

  const total = machines.length;

  const RColumns = ["Action", "Machine Name"];

  const mobileEdit = (row) => {
    setEditRowId(row.machineid);
    form.setFieldsValue({
      machine: row.machinename,
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

    fnUpdateMachine(editRowId, form.getFieldsValue().machine)
      .then((res) => {
        if (res.status === 400) {
          //toast.error(`${row.username} Not Updated`);
          return;
        } else if (res.status === 200) {
          setVisible(false);
          loadMachineType();
          //toast.success("User Updated");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <MobileSidenav />
      <Sidenav />
      <UpdateMachineModal
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
                  {machines.map((row) => (
                    <Tr key={row.machineid}>
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

                      <Td>{row.machinename}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </RTable>
            </div>
            <Form form={form} component={false}>
              <Table
                loading={loading}
                rowKey={(record) => record.machineid}
                columns={mergedColumn}
                components={{ body: { cell: editableCell } }}
                dataSource={machines}
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

export default AllMachine;
