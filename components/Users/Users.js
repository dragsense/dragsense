import UserList from "./UserList";
import AddUser from "./Add";
import {
  Card,
  Spin,
  Typography,
  Alert,
  Button,
  Tooltip,
  Space,
  Input,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import UserServices from "@/lib/services/users";

import { useEffect, useReducer, useState } from "react";
import { useRouter } from "next/router";
const { Title } = Typography;

const initial = {
  users: [],
  user: null,
  total: 0,
  error: "",
  loading: false,
};

const initialUser = {
  _id: -1,
  name: "",
  email: "",
  isEmailPublic: false,
  bio: "",
  emailVerified: false,
};

const reducer = (state, action) => {
  const updateUser = () => {
    let index = state.users.findIndex((user) => user._id === action.user?._id);
    if (index !== -1) {
      state.users[index] = action.user;
    }
  };

  const deleteUser = () => {
    let index = state.users.findIndex((user) => user._id === action.id);
    if (index !== -1) {
      state.users.splice(index, 1);
    }
  };

  switch (action.type) {
    case "start":
      return { ...state, loading: true };
    case "load":
      return {
        ...state,
        users: action.data,
        total: action.total,
        error: "",
      };
    case "add":
      return {
        ...state,
        users: [...state.users, action.user],
        total: state.total + 1,
        user: null,
        error: "",
      };
    case "edit":
      return {
        ...state,
        user: action.data,
        label: `${action.data._id !== -1 ? "Edit" : "New"} User:`,
        error: "",
      };
    case "close":
      return { ...state, user: null };
    case "update":
      updateUser();
      return {
        ...state,
        users: [...state.users],
        total: state.total + 1,
        user: action.user,
        error: "",
      };
    case "delete":
      deleteUser();
      return {
        ...state,
        users: [...state.users],
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

export default function Users() {
  const [state, dispatch] = useReducer(reducer, initial);
  const [page, setPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const load = async () => {
    try {
      dispatch({ type: "start" });

      const res = await UserServices.getAllUsers(page, 10);

      if (res.users) {
        const data = Array.isArray(res.users) ? res.users : [];
        dispatch({ type: "load", data, total: res.total });
      }
    } catch (e) {
      dispatch({ type: "error", error: e?.message || "Something went wrong." });
    } finally {
      dispatch({ type: "finish" });
    }
  };

  const search = async () => {
    try {
      dispatch({ type: "start" });

      const res = await UserServices.searchUsers(searchQuery, page);

      if (res.users) {
        const data = Array.isArray(res.users) ? res.users : [];
        dispatch({ type: "load", data, total: res.total });
      }
    } catch (e) {
      dispatch({ type: "error", error: e?.message || "Something went wrong." });
    } finally {
      dispatch({ type: "finish" });
    }
  };

  useEffect(() => {
    if (!searchQuery) {
      load();
    } else search();
  }, [page, searchQuery]);

  const onEdit = (user) => {
    dispatch({ type: "edit", data: user });
  };

  const onSubmit = async (states) => {
    dispatch({ type: "start" });

    const user = state.user;

    try {
      states.populatedLayout = undefined;
      states.populatedImage = undefined;

      const res = await UserServices.createOrUpdate(user?._id, states);

      dispatch({ type: user?._id !== -1 ? "update" : "add", user: res.user });
      message.success("Data submitted!");
    } catch (e) {
      dispatch({ type: "error", error: e?.message || "Something went wrong." });
      message.error(e?.message || "Something went wrong.");
    } finally {
      dispatch({ type: "finish" });
    }
  };

  const onDelete = async (id) => {
    dispatch({ type: "start" });
    try {
      await UserServices.delete(id);

      dispatch({ type: "delete", id });
    } catch (e) {
      dispatch({ type: "error", error: e?.message || "Something went wrong." });
      message.error(e?.message || "Something went wrong.");
    } finally {
      dispatch({ type: "finish" });
    }
  };

  const onClose = (e) => {
    e.preventDefault();
    dispatch({ type: "close" });
  };

  const onChange = (e) => {
    if (!state.loading) setSearchQuery(e.target.value);
  };

  const onBackClick = () => {
    router.push("/admin/projects");
  };

  return (
    <>
      <Card
        title={
          <>
            {state.user ? (
              state.label
            ) : (
              <>
                Users:{" "}
                <Input
                  onChange={onChange}
                  style={{ maxWidth: 300, width: "100%", marginLeft: 10 }}
                  type="search"
                  placeholder="search..."
                />
              </>
            )}{" "}
          </>
        }
        extra={
          <>
            {state.user ? (
              <Button type="dashed" onClick={onClose}>
                {" "}
                Back{" "}
              </Button>
            ) : (
              state.total > 0 && (
                <Tooltip title="Add New User">
                  <Button
                    type="text"
                    onClick={() => onEdit({ ...initialUser })}
                    icon={<PlusOutlined />}
                  >
                    {" "}
                  </Button>
                </Tooltip>
              )
            )}{" "}
            <Button type="dashed" onClick={onBackClick}>
              Back to Projects
            </Button>
          </>
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

        {state.user ? (
          <AddUser user={state.user} onSubmit={onSubmit} />
        ) : state.total == 0 ? (
          <Space size={20}>
            <Title level={3}> Get started with your first user: </Title>
            <Tooltip title="Add New">
              <Button
                type="primary"
                onClick={() => onEdit({ ...initialUser })}
                icon={<PlusOutlined />}
              >
                {" "}
              </Button>
            </Tooltip>
          </Space>
        ) : (
          <UserList
            setPage={setPage}
            total={state.total}
            users={state.users}
            page={page}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        )}
      </Card>

      {state.loading && (
        <div
          style={{
            position: "fixed",
            width: "100%",
            height: "100%",
            backgroundColor: "#2fc1ff",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        ></div>
      )}
      <Spin
        tip="Loading"
        size="small"
        spinning={state.loading}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",

          transform: "translate(-50%, -50%)",
        }}
      ></Spin>
    </>
  );
}
