import { Modal, Table, Space, theme, Button, Badge, message } from "antd";
import {
  AiFillFile,
  AiOutlineEdit,
  AiOutlineCopy,
  AiOutlineSetting,
  AiOutlineDelete,
  AiOutlineEye,
} from "react-icons/ai";
import { ExclamationCircleFilled } from "@ant-design/icons";
import moment from "moment";
import Router from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";

const { confirm } = Modal;

const PageList = ({
  pages,
  page,
  setting,
  onClone,
  total,
  setPage,
  onEdit,
  onDelete,
}) => {
  const { data: session } = useSession();

  const handleTableChange = (pagination, filters, sorter) => {
    setPage(pagination.current);
  };

  const {
    token: { colorError, colorWarning },
  } = theme.useToken();

  let homePageId = null;

  if (setting.homePage) homePageId = setting.homePage._id;

  const host = setting.host;

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
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      align: "center",
      sorter: (a, b) => a.slug.localeCompare(b.slug),
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
      title: "Status",
      dataIndex: "setting",
      key: "setting",
      align: "center",
      render: (setting) => (
        <Badge
          status={setting?.status === "DRAFT" ? "default" : "success"}
          text={setting?.status}
        />
      ),
      sorter: (a, b) => a.setting?.status.localeCompare(b.setting?.status),
    },
    {
      title: "Action",
      key: "action",
      align: "right",
      render: (text, record) => (
        <Space size="middle">
          <Button
            icon={<AiOutlineEye size="1.5em" />}
            onClick={(e) => {
              e.preventDefault();
              window.open(
                `${host}/${homePageId === record._id ? "" : record.slug}`,
                "_blank"
              );
            }}
          />

          <Button
            icon={<AiOutlineEdit size="1.5em" />}
            onClick={async () => {
              localStorage.setItem("activePage", record._id);
              localStorage.setItem("pageType", "page");
              //Router.push("/admin/editor");

              try {
                if (!session.user)
                  throw new Error("Unauthorized Access or Session Expired");

                const projectId = localStorage.getItem("project");

                const info = {
                  pageId: record._id,
                  pageType: "page",
                  projectId,
                };

                const encodedInfo = encodeURIComponent(JSON.stringify(info));

                Router.push(`/admin/editor?info=${encodedInfo}`);
              } catch (e) {
                message.error(e?.message || "Something was wrong.");
              }
            }}
          />
          <Button
            icon={<AiOutlineSetting size="1.5em" />}
            onClick={async (e) => {
              e.preventDefault();
              onEdit(record);
            }}
          />

          <Button
            icon={
              <AiOutlineCopy style={{ color: colorWarning }} size="1.5em" />
            }
            onClick={async (e) => {
              e.preventDefault();
              confirm({
                title: "Are you sure to copy this page?",
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
          <Button
            icon={
              <AiOutlineDelete style={{ color: colorError }} size="1.5em" />
            }
            onClick={async (e) => {
              e.preventDefault();
              confirm({
                title: "Are you sure to delete this page?",
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
      dataSource={pages.map(data => {
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

export default PageList;
