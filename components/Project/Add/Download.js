import { Form, Alert, Divider, Input, Button, Typography, message, Radio } from "antd";
import {
  InfoCircleOutlined,
  CheckOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  DownloadOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const { Paragraph } = Typography;
const { TextArea } = Input;

const DownloadProject = ({ id, platform, apikey }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyValid, setIsKeyValid] = useState(false);
  const [error, setError] = useState(false);

  const onChangeApiKey = (event) => {
    event.preventDefault();
    if (!apikey) return;

    const value = event.target.value;
    setIsKeyValid(apikey.trim() === value.trim());
  };

  const onDownload = async () => {
    try {
      setIsLoading(true);
      setError("");

      const downloadLink = document.createElement("a");
      downloadLink.href = platform === "laravel"
        ? `/api/projects/download/${id}/laravel`
        : `/api/projects/download/${id}`;
      downloadLink.download = true;
      downloadLink.click();

      setIsKeyValid(false);
    } catch (e) {
      setError(e?.message || "Something went wrong");
      message.error(e?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const onDownloadLibraries = async () => {
    try {
      setIsLoading(true);

      const downloadLink = document.createElement("a");
      downloadLink.href = platform === "laravel"
      ? `/api/projects/download/${id}/laravel/libraries`
      : `/api/projects/download/${id}/libraries`;
      downloadLink.download = true;
      downloadLink.click();
    } catch (e) {
      message.error("Failed to download the AutoCode libraries.");
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <>
      <Divider orientation="left" orientationMargin="0">
        Download Files
      </Divider>

      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ marginBottom: 10 }}
        />
      )}

      <Form layout="vertical" onFinish={onDownload}>
        <Form.Item label="API Key">
          <Input.Password
            value={apikey ? apikey : "No Key Found"}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        <Form.Item
          label="Copy and Paste the Key"
          tooltip={{
            title: isKeyValid ? "Key is valid" : "Key is not valid",
            icon: isKeyValid ? <CheckOutlined /> : <InfoCircleOutlined />,
          }}
        >
          <TextArea rows={4} maxLength={500} onChange={onChangeApiKey} />
        </Form.Item>

        <Form.Item label="Selected Platform" style={{ marginTop: 20 }}>
          <Radio.Group  value={platform} disabled>
            <Radio value="nodejs">Node.js</Radio>
            <Radio value="laravel">Laravel</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item className="text-right">
          <Button
            type="primary"
            htmlType="submit"
            disabled={!isKeyValid}
            loading={isLoading}
          >
            Download {platform === "laravel" ? "Laravel" : "Node.js"} Files
          </Button>
        </Form.Item>

        {id !== -1 && (
          <Form.Item className="text-left">
            <Paragraph style={{ marginTop: 10 }}>
              If you only want to update the AutoCode libraries, please{" "}
              <Button
                type="link"
                onClick={onDownloadLibraries}
                icon={<DownloadOutlined />}
                style={{ padding: 0 }}
              >
                download here
              </Button>
              .
            </Paragraph>
            {platform === "laravel" && (
              <Paragraph style={{ marginTop: 10 }}>
                After downloading, copy <code>autocode-client.js</code> into the <code>dist</code> directory and the <code>packages</code> folder into the root directory.
             
              </Paragraph>
            )}
            {platform === "nodejs" && (
              <Paragraph style={{ marginTop: 10 }}>
                After downloading, simply copy and paste the files into your
                project's <code>dist</code> directory, replacing the existing ones.
              </Paragraph>
            )}
          </Form.Item>
        )}
      </Form>
    </>
  );
};

export default DownloadProject;
