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
  fnDeleteIssue,
  fnGetIssue,
  fnUpdateIssue,
} from "../../functions/IssueType/issueType";
import {
  Table as RTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import UpdateIssueModal from "../../components/Modal/UpdateIssueModal";
import "../../styles/User/AllUser.css";

const { Content } = Layout;

const AllIssue = () => {
  const [loading, setLoading] = useState(false);
  const [editRowKey, setEditRowKey] = useState("");
  const [issues, setIssues] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editRowId, setEditRowId] = useState("");

  const [form] = Form.useForm();

  const loadIssueType = async () => {
    fnGetIssue()
      .then((res) => setIssues(res.data.reverse()))
      .catch((err) => {
        console.log(err);
        // //toast.error(err);
      });
  };

  useEffect(() => {
    loadIssueType();
  }, []);

  const isEditing = (record) => {
    return record.issueid === editRowKey;
  };

  const columns = [
    {
      title: "Issue Type",
      dataIndex: "issuename",
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
                      onClick={() => save(record.issueid)}
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

  const save = async (issueId) => {
    try {
      setLoading(true);
      const row = await form.validateFields();
      fnUpdateIssue(issueId, row.issuename)
        .then((res) => {
          if (res.status === 400) {
            // //toast.error("IssueType Not Updated");
            setLoading(false);
            return;
          } else if (res.status === 200) {
            // //toast.success("IssueType Updated Successfully");
            setLoading(false);
            loadIssueType();
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
      issuename: "",
      ...record,
    });
    setEditRowKey(record.issueid);
  };

  const deleteData = (record) => {
    Modal.confirm({
      title: `Do you want to Delete ${record.issuename}?`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        fnDeleteIssue(record.issueid)
          .then((res) => {
            if (res.status === 200) {
              // //toast.success(`${record.issuename} Deleted Successfully`);
              loadIssueType();
              //  else //toast.error(`${record.issuename} Not Deleted `);
            }
          })
          .catch((err) => {
            console.log(err);
            // //toast.error(`${record.issuename} Not Deleted `);
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
        {editing && dataIndex === "issuename" ? (
          <Form.Item
            name={dataIndex}
            rules={[
              {
                required: true,
                message: "please provide issue-type!",
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

  const total = issues.length;

  const mobileEdit = (row) => {
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

    fnUpdateIssue(editRowId, form.getFieldsValue().issuename)
      .then((res) => {
        if (res.status === 400) {
          //toast.error(`${row.username} Not Updated`);
          return;
        } else if (res.status === 200) {
          setVisible(false);
          loadIssueType();
          //toast.success("User Updated");
        }
      })
      .catch((err) => console.log(err));
  };

  const RColumns = ["Action", "Issue Type"];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <MobileSidenav />
      <Sidenav />
      <Layout className="site-layout">
        <Nav />
        <UpdateIssueModal
          visible={visible}
          setVisible={setVisible}
          handleSubmit={handleSubmit}
          form={form}
        />
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
                  {issues.map((row) => (
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
                rowKey={(record) => record.issueid}
                columns={mergedColumn}
                components={{ body: { cell: editableCell } }}
                dataSource={issues}
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

export default AllIssue;
