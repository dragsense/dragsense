import { Modal, Table, Space, theme, Button } from "antd";
import { AiFillFile, AiOutlineSetting, AiOutlineDelete } from "react-icons/ai";
import { ExclamationCircleFilled } from "@ant-design/icons";

const { confirm } = Modal;

const UserList = ({ users, page, total, setPage, onEdit, onDelete }) => {
  const handleTableChange = (pagination, filters, sorter) => {
    setPage(pagination.current);
  };

  const {
    token: { colorError, colorWarning },
  } = theme.useToken();

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <span>
          <AiFillFile size="1.5em" /> {text}
        </span>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Total Projects",
      dataIndex: "projectCount",
      key: "projectCount",
      align: "center",
    },
    {
      title: "Total Roles",
      dataIndex: "roleCount",
      key: "roleCount",
      align: "center",
    },

    {
      title: "Action",
      key: "action",
      align: "right",
      render: (text, record) => (
        <Space size="middle">
          <Button
            icon={<AiOutlineSetting size="1.5em" />}
            onClick={async (e) => {
              e.preventDefault();
              onEdit(record);
            }}
          />

          <Button
            icon={
              <AiOutlineDelete style={{ color: colorError }} size="1.5em" />
            }
            onClick={async (e) => {
              e.preventDefault();
              confirm({
                title: "Are you sure to delete this user?",
                icon: <ExclamationCircleFilled />,
                okText: "Yes",
                okType: "danger",
                cancelText: "No",
                onOk() {
                  onDelete(record._id);
                },
                onCancel() {},
              });
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={users.map((data) => {
        data.updatedAt = data.updatedAt || data.updated_at;
        data.createdAt = data.createdAt || data.created_at;

        return data;
      })}
      rowKey="_id"
      pagination={{
        total: total,
        current: page,
        userSize: 10,
      }}
      onChange={handleTableChange}
    />
  );
};

export default UserList;
