import { useEffect, useReducer, useState } from "react";
import {
  Card,
  Typography,
  Divider,
  Avatar,
  Alert,
  Badge,
  Descriptions,
  Row,
  Col,
  Space,
  theme,
} from "antd";
import ProjectServices from "@/lib/services/projects";
import ThemesServices from "@/lib/services/themes";
import { BackupComponent } from "../Project/Backup";
import { UserComponent } from "../Project/User";

const { Text, Paragraph } = Typography;

const initial = {
  project: {},
  theme: {},
  total: 1,
  error: "",
  loading: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "start":
      return { ...state, loading: true };
    case "load":
      return { ...state, project: action.project, error: "" };
    case "loadTheme":
      return { ...state, theme: action.theme, error: "" };
    case "error":
      return { ...state, error: action.error };
    case "finish":
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function Dashboard() {
  const [state, dispatch] = useReducer(reducer, initial);
  const [totalBackups, setTotalBackups] = useState(0);

  const {
    token: { colorPrimary },
  } = theme.useToken();

  const load = async () => {
    try {
      dispatch({ type: "start" });

      const id = localStorage.getItem("project");
      let response = await ProjectServices.get(id);
      const project = response.project;
      dispatch({ type: "load", project });

      response = await ThemesServices.getCurrentTheme(id);
      const theme = response.theme;
      dispatch({ type: "loadTheme", theme });
    } catch (e) {
      dispatch({ type: "error", error: e?.message || "Something went wrong." });
    } finally {
      dispatch({ type: "finish" });
    }
  };

  useEffect(() => {
    load();
  }, []);

  const status = state.project?.status;

  const SetTotalBackups = (value) => {
    setTotalBackups(value);
  };

  return (
    <div>
      <Card
        loading={state.loading}
        title={"Dashboard"}
        headStyle={{ padding: 10, fontSize: "1.5rem", fontWeight: "bold" }}
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

        <Row gutter={[8, 8]}>
          {/* Project Info Section */}
          <Col xs={24} md={12}>
            <Card
              title="Project Info"
              bordered={false}
              style={{ height: "100%" }}
            >
              <Descriptions column={1} layout="vertical" bordered>
                <Descriptions.Item label="Project Name">
                  <Text strong>{state.project?.name || "N/A"}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="API URL">
                  <Paragraph
                    ellipsis={{ rows: 2, expandable: true, symbol: "more" }}
                  >
                    {state.project?.url || "N/A"}
                  </Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Badge
                    status={status ? "success" : "error"}
                    text={status ? "Connected" : "Disconnected"}
                  />
                </Descriptions.Item>

                <Descriptions.Item label="Description">
                  <Paragraph
                    ellipsis={{ rows: 2, expandable: true, symbol: "more" }}
                  >
                    {state.project?.desc || "N/A"}
                  </Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="Platform">
                  {state.theme?.platform || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Project Stats"
                  span={3}
                  labelStyle={{ fontWeight: "bold" }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      width: "100%",
                    }}
                  >
                    <div style={{ borderRight: "1px solid", paddingRight: 10 }}>
                      <Text>Users: </Text>
                      <strong>{state.project.roles?.length || 0}</strong>
                    </div>
                    <div style={{ borderRight: "1px solid", paddingRight: 10 }}>
                      <Text>Backups: </Text>
                      <strong>{totalBackups || 0}</strong>
                    </div>
                    <div>
                      <Text>Themes: </Text>
                      <strong>{state.project.themes?.length || 0}</strong>
                    </div>
                  </div>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          {/* Theme Info Section */}
          <Col xs={24} md={12}>
            <Card
              title="Active Theme Info"
              bordered={false}
              style={{ height: "100%" }}
            >
              <Descriptions column={1} layout="vertical" bordered>
                <Descriptions.Item label="Current Theme">
                  <Text strong>{state.theme?.name || "Default"}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Update Status">
                  {state.theme?.updateStatus ? (
                    <Alert
                      message="The updates for the theme are available."
                      type="info"
                      showIcon
                    />
                  ) : (
                    "You are up to date."
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Description">
                  <Paragraph
                    ellipsis={{ rows: 2, expandable: true, symbol: "more" }}
                  >
                    {state.theme?.desc || "N/A"}
                  </Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="Preview">
                  {state.theme?.preview ? (
                    <img
                      src={state.theme.preview}
                      alt="Theme Preview"
                      style={{
                        width: "100%",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  ) : (
                    "No preview available"
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Author">
                  <Space>
                    <Avatar src={state.theme?.creatorProfile}>
                      {!state.theme?.creatorProfile && state.theme?.creator
                        ? state.theme?.creator.charAt(0)
                        : "A"}
                    </Avatar>
                    <b>
                      <em>{state.theme?.creator || "@dragsense"}</em>
                    </b>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Platform">
                  {state.theme?.platform || "N/A"}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>
      </Card>
      <br />
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <BackupComponent
            projectId={state.project?._id}
            SetTotalBackups={SetTotalBackups}
          />
        </Col>
        <Col xs={24} md={12}>
          <UserComponent projectId={state.project?._id} />
        </Col>
      </Row>
    </div>
  );
}

export { PageComponent } from "./Page";
export { ComponentComponent } from "./Component";
export { CollectionComponent } from "./Collection";
export { FormComponent } from "./Form";
export { MediaComponent } from "./Media";
export { StylingComponent } from "./Styling";
export { JSComponent } from "./JS";
export { SettingComponent } from "./Setting";
