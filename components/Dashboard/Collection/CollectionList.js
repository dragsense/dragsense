import { Modal, Table, Space, theme, Tooltip, Button, Badge } from "antd";
import Link from "next/link";
import { ExclamationCircleFilled } from "@ant-design/icons";
import {
  AiFillFile,
  AiOutlineEdit,
  AiFillDatabase,
  AiOutlineCopy,
  AiOutlineSetting,
  AiOutlineDelete,
  AiOutlineForm,
  AiOutlineEye,
  AiOutlineDownload,
} from "react-icons/ai";
import moment from "moment";
import Router from "next/router";

import { signIn, signOut, useSession } from "next-auth/react";
import ProjectServices from "@/lib/services/projects";

const { confirm } = Modal;

const CollectionList = ({
  collections,
  onClone,
  page,
  setting,
  total,
  setPage,
  onEdit,
  onDelete,
  onEditDocuments,
  onDownloadCollection,
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

          <Tooltip title="Edit Collection Elements">
            <Button
              icon={<AiOutlineEdit size="1.5em" />}
              onClick={async () => {
                localStorage.setItem("activePage", record._id);
                localStorage.setItem("pageType", "collection");

                try {
                  if (!session.user)
                    throw new Error("Unauthorized Access or Session Expired");

                  const projectId = localStorage.getItem("project");

                  const info = {
                    pageId: record._id,
                    pageType: "collection",
                    projectId,
                  };

                  const encodedInfo = encodeURIComponent(JSON.stringify(info));

                  Router.push(`/admin/editor?info=${encodedInfo}`);
                } catch (e) {
                  message.error(e?.message || "Something was wrong.");
                }
              }}
            />
          </Tooltip>
          <Tooltip title="Edit Collection">
            <Button
              icon={<AiOutlineSetting size="1.5em" />}
              onClick={async (e) => {
                e.preventDefault();
                onEdit({ ...record });
              }}
            />
          </Tooltip>
          <Tooltip title="Edit Collection Entries">
            <Button
              onClick={async (e) => {
                e.preventDefault();
                onEditDocuments({ ...record });
              }}
              icon={<AiFillDatabase size="1.5em" />}
            ></Button>
          </Tooltip>

          {record.form && (
            <Tooltip title="Edit Form Entries">
              <Button
                onClick={async (e) => {
                  e.preventDefault();
                  onEditDocuments({ ...record.form, isForm: true });
                }}
                icon={<AiOutlineForm size="1.5em" />}
              ></Button>
            </Tooltip>
          )}
          <Tooltip title="Copy Component">
            <Button
              icon={
                <AiOutlineCopy style={{ color: colorWarning }} size="1.5em" />
              }
              onClick={async (e) => {
                e.preventDefault();
                confirm({
                  title: "Are you sure to copy this collection?",
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

          <Tooltip title="Download Collection Entries">
            <Button
              icon={<AiOutlineDownload style={{}} size="1.5em" />}
              onClick={(e) => {
                e.preventDefault();
                onDownloadCollection({ _id: record._id, name: record.name });
              }}
            />
          </Tooltip>

          <Tooltip title="Delete Collection">
            <Button
              icon={
                <AiOutlineDelete style={{ color: colorError }} size="1.5em" />
              }
              onClick={async (e) => {
                e.preventDefault();

                confirm({
                  title: "Are you sure to install this collection?",
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
      rowKey="_id"
      dataSource={collections.map((data) => {
        data.updatedAt = data.updatedAt || data.updated_at;
        data.createdAt = data.createdAt || data.created_at;

        return data;
      })}
      pagination={{
        total: total,
        current: page,
        pageSize: 10,
      }}
      onChange={handleTableChange}
    />
  );
};

export default CollectionList;
