import React, { useState, useEffect, useReducer } from "react";
import {
  List,
  Modal,
  Typography,
  Badge,
  Space,
  Card,
  Avatar,
  Button,
  message,
  Input,
} from "antd";
import {
  LikeOutlined,
  StarOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { fetcher } from "@/lib/fetch";
import { isEmpty } from "@/lib/utils";
import ThemesServices from "../../../lib/services/themes";

const { Text } = Typography;
const { confirm } = Modal;

const initial = {
  themes: [],
  total: 0,
  loading: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "start":
      return { ...state, loading: true };
    case "load":
      return { ...state, themes: action.data, total: action.total + 1 };
    case "finish":
      return { ...state, loading: false };
    default:
      return state;
  }
};

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

export default function AddTheme({
  onAdd,
  platform,
  loading,
  themes,
  theme = {},
}) {
  const [state, dispatch] = useReducer(reducer, initial);
  const [page, setPage] = useState(1);
  const [themeModal, setThemeModalOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const load = async () => {
    try {
      dispatch({ type: "start" });
      const res = await ThemesServices.getAllThemes(platform, page);

      const data = Array.isArray(res.themes) ? res.themes : [];

      dispatch({ type: "load", data, total: res.total });
    } catch (e) {
      message.error(e?.message || "Something went wrong.");
    } finally {
      dispatch({ type: "finish" });
    }
  };

  const search = async () => {
    try {
      dispatch({ type: "start" });

      const res = await ThemesServices.searchThemes(
        platform,
        searchQuery,
        page
      );

      const data = Array.isArray(res.themes) ? res.themes : [];
      dispatch({ type: "load", data, total: res.total });
    } catch (e) {
      dispatch({ type: "error", error: e?.message || "Something went wrong." });
    } finally {
      dispatch({ type: "finish" });
    }
  };

  useEffect(() => {
    if (!theme || !platform) return;

    setThemeModalOpen(true);

    if (!searchQuery) {
      load();
    } else search();
  }, [page, searchQuery, theme]);

  const onChange = (e) => {
    if (!state.loading) setSearchQuery(e.target.value);
  };

  const onCancel = () => {
    setThemeModalOpen(false);
    setSelectedTheme(null);
  };

  const handleThemeSelection = (theme) => {
    setSelectedTheme(theme);
  };

  const handleAddTheme = () => {
    confirm({
      title: "Are you sure you want to add this theme?",
      icon: <ExclamationCircleFilled />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        onAdd(selectedTheme._id);
      },
      onCancel() {},
    });
  };

  return (
    <Modal
      closable
      width="90%"
      open={themeModal}
      title={
        <div>
          Add a new theme:
          <Input
            onChange={onChange}
            style={{ maxWidth: 300, width: "100%", marginLeft: 10 }}
            type="search"
            placeholder="search..."
          />
        </div>
      }
      onCancel={onCancel}
      footer={[
        <div style={{ padding: 5 }}>
          <Button key="cancel" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            key="add"
            type="primary"
            onClick={handleAddTheme}
            disabled={!selectedTheme}
          >
            Add
          </Button>
        </div>,
      ]}
    >
      <div style={{ maxHeight: "90vh", overflow: "visible scroll" }}>
        <List
          itemLayout="vertical"
          size="default"
          loading={state.loading || loading}
          pagination={{
            onChange: (page) => {
              setPage(page);
            },
            total: state.total + 1,
            pageSize: 3,
          }}
          dataSource={[...state.themes]}
          footer={
            <Text type="secondary">
              Powered by <b>AutoCode</b> - The ultimate platform for rapid web
              development.
            </Text>
          }
          renderItem={(theme) => {
            const index = themes.findIndex((t) => t._id === theme._id);
            const isSelected = selectedTheme && selectedTheme._id === theme._id;
            const ribbonText = index >= 0 ? "Added" : "";
            const ribbonColor = index >= 0 ? "green" : "";

            const cardStyle = {
              padding: 0,
              marginBottom: 10,
              border: isSelected ? "2px solid #2fc1ff" : "1px solid #e8e8e8", // Highlight the card if selected
              boxShadow: isSelected ? "0 0 10px rgba(0, 0, 255, 0.5)" : "none", // Add shadow if selected
            };

            return (
              <div
                onClick={() => handleThemeSelection(theme)}
                key={theme._id}
                style={{ width: "calc(100% - 30px)" }}
              >
                <Badge.Ribbon text={ribbonText} color={ribbonColor}>
                  <Card bodyStyle={{ padding: 10 }} style={cardStyle} hoverable>
                    <List.Item
                      key={theme.title}
                      actions={[
                        <IconText
                          icon={StarOutlined}
                          text="0"
                          key="list-vertical-star-o"
                        />,
                        <IconText
                          icon={LikeOutlined}
                          text="0"
                          key="list-vertical-like-o"
                        />,
                      ]}
                      extra={
                        <img
                          width={272}
                          alt="logo"
                          src={theme.preview || "/images/default/theme.png"}
                        />
                      }
                    >
                      <List.Item.Meta
                        title={theme.name}
                        description={
                          <div>
                            <span style={{ paddingRight: 10 }}>Author: </span>
                            <b>
                              <Avatar
                                src={
                                  <img src={theme.creator.image} alt="avatar" />
                                }
                              />{" "}
                              <em>{theme.creator.name}</em>{" "}
                            </b>
                          </div>
                        }
                      />
                      <p>{theme.desc}</p>
                      <Text type="secondary">
                        Theme Preview URL:{" "}
                        <a
                          style={{ color: colorPrimary }}
                          href={theme.previewUrl}
                          target="_blank"
                        >
                          {theme.previewUrl}
                        </a>
                      </Text>
                      <br />
                      <Text type="secondary">
                        Date:{" "}
                        <b>
                          {" "}
                          <em>
                            {new Date(theme.createdAt).toDateString()}
                          </em>{" "}
                        </b>
                      </Text>
                    </List.Item>
                  </Card>
                </Badge.Ribbon>
              </div>
            );
          }}
        />
      </div>
    </Modal>
  );
}
