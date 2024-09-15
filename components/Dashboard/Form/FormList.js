import { Modal, Table, Space, theme, Tooltip, Button } from "antd";
import Link from "next/link";
import { ExclamationCircleFilled } from "@ant-design/icons";

import {
  AiFillFile,
  AiOutlineEdit,
  AiFillDatabase,
  AiOutlineCopy,
  AiOutlineSetting,
  AiOutlineDownload,
  AiOutlineDelete,
} from "react-icons/ai";
import moment from "moment";
import Router from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import ProjectServices from "@/lib/services/projects";

const { confirm } = Modal;

const FormList = ({
  forms,
  page,
  onClone,
  total,
  setPage,
  onEdit,
  onDelete,
  onEditDocuments,
  onDownloadCollection
}) => {
  const { data: session } = useSession();

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
          <AiFillFile size="1.5em" className="ac-icon1" /> {text}
        </span>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      align: "center",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },

    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (date) => moment(date).format("MMMM Do YYYY, h:mm:ss a"),
    },
    {
      title: "Created By",
      dataIndex: "creator",
      key: "creator",
      align: "center",
      render: (creator) => creator?.name,
    },
    {
      title: "Last Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      align: "center",
      render: (date) => date && moment(date).format("MMMM Do YYYY, h:mm:ss a"),
    },
    {
      title: "Last Updated By",
      dataIndex: "updater",
      key: "updater",
      align: "center",
      render: (updater) => updater?.name,
    },
    {
      title: "Action",
      key: "action",
      align: "right",
      render: (text, record) => (
        <Space size="middle">
          <Tooltip title="Edit Form Elements">
            <Button
              icon={<AiOutlineEdit size="1.5em" />}
              onClick={async () => {
                localStorage.setItem("activePage", record._id);
                localStorage.setItem("pageType", "form");

                try {
                  if (!session.user)
                    throw new Error("Unauthorized Access or Session Expired");

                  const projectId = localStorage.getItem("project");

                  const info = {
                    pageId: record._id,
                    pageType: "form",
                    projectId,
                  };

                  const encodedInfo = encodeURIComponent(JSON.stringify(info));

                  Router.push(`/admin/editor?info=${encodedInfo}`);
                } catch (e) {
                  message.error(e?.message || "Something was wrong.");
                }
              }}
              className="ac-icon2"
              size="2em"
            />
          </Tooltip>
          <Tooltip title="Edit Form">
            <Button
              icon={<AiOutlineSetting size="1.5em" />}
              onClick={async (e) => {
                e.preventDefault();
                onEdit({ ...record });
              }}
              className="ac-icon2"
            />
          </Tooltip>
          <Tooltip title="Edit Form Entries">
            <Button
              icon={<AiFillDatabase size="1.5em" />}
              onClick={async (e) => {
                e.preventDefault();
                onEditDocuments({ ...record });
              }}
            />
          </Tooltip>
          <Tooltip title="Copy Form">
            <Button
              icon={
                <AiOutlineCopy style={{ color: colorWarning }} size="1.5em" />
              }
              onClick={async (e) => {
                e.preventDefault();
                confirm({
                  title: "Are you sure to copy this form?",
                  icon: <ExclamationCircleFilled />,
                  okText: "Yes",
                  okType: "danger",
                  cancelText: "No",
                  onOk() {
                    onClone(record._id);
                  },
                  onCancel() {},
                });
              }}
            />
          </Tooltip>
          <Tooltip title="Download Form Entries">
            <Button
              icon={<AiOutlineDownload style={{}} size="1.5em" />}
              onClick={(e) => {
                e.preventDefault();
                onDownloadCollection({ _id: record._id, name: record.name });
              }}
            />
          </Tooltip>
          <Tooltip title="Delete Form">
            <Button
              icon={<AiOutlineDelete size="1.5em" />}
              onClick={async (e) => {
                e.preventDefault();
                confirm({
                  title: "Are you sure to install this form?",
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
            />{" "}
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={forms.map((data) => {
        data.updatedAt = data.updatedAt || data.updated_at;
        data.createdAt = data.createdAt || data.created_at;

        return data;
      })}
      rowKey="_id"
      pagination={{
        total: total,
        current: page,
        pageSize: 10,
      }}
      onChange={handleTableChange}
    />
  );
};

export default FormList;
