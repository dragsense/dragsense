import {
  Card,
  Alert,
  Button,
  Tooltip,
  Space,
  Typography,
  Input,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
const { Title } = Typography;

import { useEffect, useReducer, useState } from "react";

import UserList from "./UserList";
import AddUser from "./Add";

import UserServices from "@/lib/services/users";

const initial = {
  roles: [],
  role: null,
  total: 0,
  error: "",
  loading: false,
};

const initialRole = {
  id: -1,
  roleName: "Admin",
  email: "",
  permissions: ["all"],
};

const reducer = (state, action) => {
  const updateRole = () => {
    let index = state.roles.findIndex((role) => role._id === action.role?._id);
    if (index !== -1) {
      state.roles[index].name = action.role.name;
      state.roles[index].permissions = action.role.permissions;
    }
  };

  const deleteRole = () => {
    let index = state.roles.findIndex((role) => role._id === action.id);
    if (index !== -1) {
      state.roles.splice(index, 1);
    }
  };

  switch (action.type) {
    case "start":
      return { ...state, loading: true };
    case "load":
      return { ...state, roles: action.data, total: action.total, error: "" };
    case "add":
      return {
        ...state,
        roles: [...state.roles, ...action.role],
        total: state.total + 1,
        error: "",
      };
    case "edit":
      return { ...state, role: action.data, error: "" };
    case "close":
      return { ...state, role: null };
    case "update":
      updateRole();
      return {
        ...state,
        roles: [...state.roles],
        total: state.total + 1,
        error: "",
      };
    case "delete":
      deleteRole();

      return {
        ...state,
        roles: [...state.roles],
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

export default function Users({ projectId, setUser }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const load = async () => {
    try {
      dispatch({ type: "start" });
      const res = await UserServices.getAll(projectId, page);

      const data = Array.isArray(res.roles) ? res.roles : [];

      dispatch({ type: "load", data, total: res.total });
    } catch (e) {
      dispatch({ type: "error", error: e?.message || "Something went wrong." });
    } finally {
      dispatch({ type: "finish" });
    }
  };

  const search = async () => {
    try {
      dispatch({ type: "start" });

      const res = await UserServices.search(projectId, searchQuery, page);

      const data = Array.isArray(res.roles) ? res.roles : [];

      dispatch({ type: "load", data, total: res.total });
    } catch (e) {
      dispatch({ type: "error", error: e?.message || "Something went wrong." });
    } finally {
      dispatch({ type: "finish" });
    }
  };

  useEffect(() => {
    if (!projectId) return;
    if (!searchQuery) {
      load();
    } else search();
  }, [projectId, page, searchQuery]);

  const onEdit = (role) => {
    dispatch({ type: "edit", data: role });
  };

  const onSubmit = async (states) => {
    dispatch({ type: "start" });

    let status = false;

    try {
      const role = state.role;

      const res = await UserServices.createOrUpdate(
        projectId,
        role?.id,
        states
      );

      dispatch({ type: role?.id !== -1 ? "update" : "add", role: res.role ? [] : [] });

      status = true;
      dispatch({ type: "close" });
      if (role?.id === -1) message.success("Request submitted!");
      else message.success("Data submitted!");
    } catch (e) {
      dispatch({ type: "error", error: e?.message || "Something went wrong." });
      message.error(e?.message || "Something went wrong.");
    } finally {
      dispatch({ type: "finish" });
      return status;
    }
  };

  const onDelete = async (id) => {
    dispatch({ type: "start" });
    try {
      await UserServices.delete(projectId, id);

      dispatch({ type: "delete", id });
    } catch (e) {
      dispatch({ type: "error", error: e?.message || "Something went wrong." });
      message.error(e?.message || "Something went wrong.");
    } finally {
      dispatch({ type: "finish" });
    }
  };

  const onChange = (e) => {
    if (!state.loading) setSearchQuery(e.target.value);
  };
  return (
    <>
      <Card
        loading={state.loading}
        title={
          <div>
            Users:
            <Input
              onChange={onChange}
              style={{ maxWidth: 300, width: "100%", marginLeft: 10 }}
              type="search"
              placeholder="search..."
            />
          </div>
        }
        extra={
          state.total > 0 && (
            <Tooltip title="Add New User">
              <Button
                type="text"
                onClick={(e) => {
                  e.preventDefault();
                  onEdit({ ...initialRole });
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
          <Space size={20} align="center">
            <Title level={5}> Add New User: </Title>
            <Tooltip title="Add New">
              <Button
                type="primary"
                onClick={(e) => {
                  e.preventDefault();
                  onEdit({ ...initialRole });
                }}
                icon={<PlusOutlined />}
              >
                {" "}
              </Button>
            </Tooltip>
          </Space>
        ) : (
          <UserList
            roles={state.roles}
            onDelete={onDelete}
            onEdit={onEdit}
            total={state.total}
            setPage={setPage}
          />
        )}
      </Card>

      <AddUser onSubmit={onSubmit} role={state.role} />
    </>
  );
}
