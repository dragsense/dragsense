import { Card, Alert, Button, Tooltip, Space, Typography, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { useEffect, useReducer, useState } from "react";
const { Title } = Typography;

import BackupServices from "@/lib/services/backups";
import BackupList from "./BackupList";
import AddBackup from "./Add";
import SettingServices from "@/lib/services/setting";

const initial = {
  backups: [],
  backup: null,
  total: 0,
  error: "",
  loading: false,
};

const initialBackup = {
  _id: -1,
  name: "",
  preview: "",
  desc: "",
  published: false,
};

const reducer = (state, action) => {
  const updateBackup = () => {
    let index = state.backups.findIndex(
      (backup) => backup._id === action.backup?._id
    );
    if (index !== -1) {
      state.backups[index] = { ...state.backups[index], ...action.backup };
    }
  };

  const deleteBackup = () => {
    let index = state.backups.findIndex((backup) => backup._id === action.id);
    if (index !== -1) {
      state.backups.splice(index, 1);
    }
  };

  switch (action.type) {
    case "start":
      return { ...state, loading: true, error: '' };
    case "load":
      return { ...state, backups: action.data, total: action.total, error: "" };
    case "add":
      return {
        ...state,
        backups: [...state.backups, action.backup],
        total: state.total + 1,
        error: "",
      };
    case "edit":
      return { ...state, backup: action.data, error: "" };
    case "close":
      return { ...state, backup: null };
    case "update":
      updateBackup();
      return {
        ...state,
        backups: [...state.backups],
        total: state.total + 1,
        error: "",
      };
    case "delete":
      deleteBackup();
      return {
        ...state,
        backups: [...state.backups],
        total: state.total - 1,
        error: "",
      };
    case "error":
      return { ...state, error: action.error };
    case "finish":
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function Backups({ projectId }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const [page, setPage] = useState(1);
  const [host, setHost] = useState("");

  const load = async () => {
    try {
      dispatch({ type: "start" });
      const res = await BackupServices.getAll(projectId, page);


      const result = await SettingServices.get();
      setHost(result.host || "");

      const data = Array.isArray(res.backups) ? res.backups : [];

      dispatch({ type: "load", data, total: res.total });

    } catch (e) {
      dispatch({ type: "error", error: e?.message || "Something went wrong." });
    } finally {
      dispatch({ type: "finish" });
    }
  };

  useEffect(() => {
    if (!projectId) return;

    load();
  }, [page]);

  const onSubmit = async (states) => {
    dispatch({ type: "start" });

    let status = false;

    try {
      const backup = state.backup;

      const res = await BackupServices.createOrUpdate(
        projectId,
        backup?._id,
        states
      );



      dispatch({
        type: backup?._id !== -1 ? "update" : "add",
        backup: res.backup,
      });

      status = true;
      dispatch({ type: "close" });

      message.success("Data submitted!");
    } catch (e) {
      dispatch({ type: "error", error: e?.message || "Something went wrong." });
      message.error(e?.message || "Something went wrong.");
    } finally {
      dispatch({ type: "finish" });
      return status;
    }
  };

  const onEdit = (backup) => {
    dispatch({ type: "edit", data: backup });
  };

  const onDelete = async (id) => {
    dispatch({ type: "start" });
    try {
      await BackupServices.delete(projectId, id);

      dispatch({ type: "delete", id });
    } catch (e) {
      dispatch({ type: "error", error: e?.message || "Something went wrong." });
      message.error(e?.message || "Something went wrong.");
    } finally {
      dispatch({ type: "finish" });
    }
  };

  const onInstall = async (id) => {
    dispatch({ type: "start" });
    try {
      await BackupServices.install(projectId, id);
    } catch (e) {
      dispatch({ type: "error", error: e?.message || "Something went wrong." });
      message.error(e?.message || "Something went wrong.");
    } finally {
      dispatch({ type: "finish" });
    }
  };

  const onDownload = async (id) => {
    dispatch({ type: "start" });
    try {
      const downloadLink = document.createElement("a");
      downloadLink.href = `/api/projects/${projectId}/backups/${id}`;
      downloadLink.download = true;
      downloadLink.click();
    } catch (e) {
      dispatch({ type: "error", error: e?.message || "Something went wrong." });
      message.error(e?.message || "Something went wrong.");
    } finally {
      dispatch({ type: "finish" });
    }
  };

  return (
    <>
      <Card
        loading={state.loading}
        title={`Backups:`}
        extra={
          state.total > 0 && (
            <Tooltip title="Add New Backup">
              <Button
                type="text"
                onClick={(e) => {
                  e.preventDefault();
                  onEdit({ ...initialBackup });
                }}
                icon={<PlusOutlined />}
              >
                {" "}
              </Button>
            </Tooltip>
          )
        }
        headStyle={{ padding: 10 }}
      >
        {state.error && (
          <Alert
            message={state.error}
            style={{ margin: "10px 0" }}
            type="error"
            showIcon
            closable
          />
        )}

        {state.total <= 0 ? (
          <Space size={20}>
            <Title level={5}> Add New Backup: </Title>
            <Tooltip title="Add New">
              <Button
                type="primary"
                onClick={(e) => {
                  e.preventDefault();
                  onEdit({ ...initialBackup });
                }}
                icon={<PlusOutlined />}
              >
                {" "}
              </Button>
            </Tooltip>
          </Space>
        ) : (
          <BackupList
            backups={state.backups}
            onDelete={onDelete}
            onEdit={onEdit}
            onInstall={onInstall}
            onDownload={onDownload}
            total={state.total}
            setPage={setPage}
          />
        )}
      </Card>

      <AddBackup onSubmit={onSubmit} host={host} backup={state.backup} />
    </>
  );
}
