import {
  Card,
  Alert,
  Button,
  Tooltip,
  Space,
  Typography,
  message,
  Input,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { useEffect, useReducer, useState } from "react";
const { Title } = Typography;

import ThemeList from "./ThemeList";
import AddTheme from "./Add";
import ThemeServices from "@/lib/services/themes";

const initial = {
  themes: [],
  theme: null,
  total: 1,
  error: "",
  loading: false,
};

const reducer = (state, action) => {
  const deleteTheme = () => {
    let index = state.themes.findIndex((theme) => theme._id === action.id);
    if (index !== -1) {
      state.themes.splice(index, 1);
      state.total = state.total - 1;
    }
  };

  const addTheme = () => {
    let index = state.themes.findIndex((theme) => theme._id === action.id);
    if (index == -1) {
      state.themes.push(action.theme);
      state.total = state.total + 1;
    }
  };

  switch (action.type) {
    case "start":
      return { ...state, loading: true };
    case "load":
      return {
        ...state,
        themes: action.data,
        total: state.total,
        error: "",
      };
    case "add":
      addTheme();
      return {
        ...state,
        themes: [...state.themes],
        total: state.total,
        error: "",
      };
    case "edit":
      return { ...state, theme: action.data, error: "" };
    case "close":
      return { ...state, theme: null };
    case "delete":
      deleteTheme();
      return {
        ...state,
        themes: [...state.themes],
        total: state.total,
        error: "",
      };
    case "error":
      return { ...state, error: action.error };
    case "refresh":
      return { ...state, themes: [...state.themes] };
    case "finish":
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function Themes({ projectId, platform,  activeTheme = 0 }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const [page, setPage] = useState(1);
  const [activeThemeId, setActiveTheme] = useState(activeTheme);
  const [searchQuery, setSearchQuery] = useState("");

  const load = async () => {
    try {
      dispatch({ type: "start" });
      const res = await ThemeServices.getAll(projectId,  page);

      const data = Array.isArray(res.themes) ? res.themes : [];

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

      const res = await ThemeServices.search(projectId, searchQuery, page);

      const data = Array.isArray(res.themes) ? res.themes : [];

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
  }, [page, searchQuery]);

  const onAdd = async (id) => {
    dispatch({ type: "start" });

    let status = false;

    try {
      const res = await ThemeServices.create(projectId, id);

      dispatch({ type: "add", theme: res.theme });

      status = true;
      dispatch({ type: "close" });
    } catch (e) {
      dispatch({ type: "error", error: e?.message || "Something went wrong." });
    } finally {
      dispatch({ type: "finish" });
      return status;
    }
  };

  const onDelete = async (id) => {
    dispatch({ type: "start" });
    try {
      await ThemeServices.delete(projectId, id);

      dispatch({ type: "delete", id });
    } catch (e) {
      dispatch({ type: "error", error: e?.message || "Something went wrong." });
    } finally {
      dispatch({ type: "finish" });
    }
  };

  const onInstall = async (id) => {
    dispatch({ type: "start" });
    try {
      await ThemeServices.install(projectId, id);
      setActiveTheme(id);

      message.success("Great! Theme Installed Successfully.");
      dispatch({ type: "error", error: null });
    } catch (e) {
      dispatch({ type: "error", error: e?.message || "Something went wrong." });
    } finally {
      dispatch({ type: "finish" });
    }
  };

  const onDownload = async (id, name) => {
    dispatch({ type: "start" });
    try {
      const downloadLink = document.createElement("a");
      downloadLink.href = `/api/projects/${projectId}/themes/${id}/download`;
      downloadLink.download = `theme-${name}-${new Date().getDate()}.zip`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      message.success("Your download will begin shortly.");

    } catch (e) {
      dispatch({ type: "error", error: e?.message || "Something went wrong." });
    } finally {
      dispatch({ type: "finish" });
    }
  };

  const onEdit = (theme) => {
    dispatch({ type: "edit", data: theme });
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
            Themes:
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
            <Tooltip title="Add New Theme">
              <Button
                type="text"
                onClick={(e) => {
                  e.preventDefault();
                  onEdit({});
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
            <Title level={5}> Add New Theme: </Title>
            <Tooltip title="Add New">
              <Button
                type="primary"
                onClick={(e) => {
                  e.preventDefault();
                  onEdit({});
                }}
                icon={<PlusOutlined />}
              >
                {" "}
              </Button>
            </Tooltip>
          </Space>
        ) : (
          <ThemeList
            themes={state.themes}
            onDelete={onDelete}
            onInstall={onInstall}
            onDownload={onDownload}
            total={state.total}
            activeTheme={activeThemeId}
            setPage={setPage}
          />
        )}
      </Card>

      <AddTheme
        onAdd={onAdd}
        platform={platform}
        themes={state.themes}
        _theme={state.theme}
        loading={state.loading}
      />
    </>
  );
}
