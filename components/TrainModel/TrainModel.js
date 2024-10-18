import React, { useState } from "react";
import {
  Card,
  Popover,
  Input,
  Button,
  Typography,
  Row,
  Col,
  Spin,
  message,
  InputNumber,
  Form,
  Checkbox,
  List,
} from "antd";
import { useRouter } from "next/router";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/mode/javascript/javascript";
import AIServices from "../../lib/services/ai";

const { Title, Text } = Typography;
const { TextArea } = Input;

const ProgressMessages = ({ progressMessages }) => {
  return (
    <Card
      style={{ maxHeight: 600, overflowY: "scroll", borderRadius: 8 }}
      bordered={true}
    >
      <List
        dataSource={[...progressMessages].reverse()} // Reverse the messages
        renderItem={(msg, index) => (
          <List.Item key={index}>
            <Text>
              <span dangerouslySetInnerHTML={{ __html: msg }}></span>
            </Text>
          </List.Item>
        )}
      />
    </Card>
  );
};

const TrainModel = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [numberOfData, setNumberOfData] = useState(1000);
  const [numberOfTags, setNumberOfTags] = useState(1);
  const [applyRandomRange, setApplyRandomRange] = useState(false);
  const [numberOfDepth, setNumberOfDepth] = useState(1);
  const [progressMessages, setProgressMessages] = useState([]);
  const [retrain, setRetrain] = useState(true);
  const [popoverVisible, setPopoverVisible] = useState(false);

  const router = useRouter();

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const appendProgressMessage = (msg) => {
    setProgressMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, msg];
      return updatedMessages;
    });
  };

  const handleTrainModel = async () => {
    if (!numberOfData || numberOfData < 100 || numberOfData > 10000) {
      message.error(
        "Please enter a valid number of data between 100 and 10,000."
      );
      return;
    }

    if (!numberOfTags || numberOfTags < 1 || numberOfTags > 5) {
      message.error("Please enter a valid number of tags between 1 and 5.");
      return;
    }

    if (!numberOfDepth || numberOfDepth < 1 || numberOfDepth > 3) {
      message.error("Please enter a valid number of depth between 1 and 3.");
      return;
    }

    setLoading(true);
    setProgressMessages([]);
    try {
      const response = await fetch(`/api/ai`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          numberOfData,
          numberOfTags,
          applyRandomRange,
          numberOfDepth,
          retrain
        }),
      });

      if (!response.body) {
        throw new Error("ReadableStream not supported.");
      }

      setLoading(false);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          appendProgressMessage(chunk); // Append message to the UI
        }
      }

      message.success("Model retrained successfully.");
    } catch (error) {
      message.error(`Error training model: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateOutput = async () => {
    if (!input) {
      message.error("Please enter a valid prompt.");
      return;
    }

    setLoading(true);
    setProgressMessages([]);

    try {
      const response = await fetch(`/api/ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputText: input,
        }),
      });

      if (!response.body) {
        throw new Error("ReadableStream not supported.");
      }
      setLoading(false);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          appendProgressMessage(chunk); // Append message to the UI
        }
      }

      message.success("Generated successfully.");
    } catch (error) {
      message.error(`Error generating results: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const onBackClick = () => {
    router.push("/admin/projects");
  };

  const handleCheckboxChange = (e) => {
      setPopoverVisible(true); 
  };

  const confirmChange = () => {
    setRetrain(!retrain); // If user confirms, uncheck the checkbox
    setPopoverVisible(false); // Hide the popover
  };

  const cancelChange = () => {
    setPopoverVisible(false); // Cancel the popover and keep checkbox checked
  };

  const popoverContent = (
    <div>
      <p>If unchecked, the model will be trained from scratch. Are you sure?</p>
      <div>
        <Button
          type="primary"
          onClick={confirmChange}
          style={{ marginRight: "8px" }}
        >
          Yes
        </Button>
        <Button onClick={cancelChange}>No</Button>
      </div>
    </div>
  );

  return (
    <Card
      title="Train Model"
      extra={
        <Button type="dashed" onClick={onBackClick}>
          Back to Projects
        </Button>
      }
      headStyle={{ padding: 10 }}
    >
      <Spin spinning={loading}>
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Title level={5}>Enter parameters to generate random data</Title>
              <Form.Item label="Number of Data to Generate">
                <InputNumber
                  min={100}
                  max={10000}
                  value={numberOfData}
                  onChange={setNumberOfData}
                  placeholder="Enter Number"
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Form.Item label="Number of Tags">
                <InputNumber
                  min={1}
                  max={5}
                  value={numberOfTags}
                  onChange={setNumberOfTags}
                  placeholder="Enter Number of Tags"
                  style={{ width: "60%", marginRight: "16px" }}
                />
                <Checkbox
                  checked={applyRandomRange}
                  onChange={(e) => setApplyRandomRange(e.target.checked)}
                >
                  Apply Random Range
                </Checkbox>
              </Form.Item>
              <Form.Item label="Number of Depth">
                <InputNumber
                  min={1}
                  max={3}
                  value={numberOfDepth}
                  onChange={setNumberOfDepth}
                  placeholder="Enter Number"
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Form.Item label="Retrain Model">
                <Popover
                  content={popoverContent}
                  title="Confirm Action"
                  trigger="click"
                  open={popoverVisible}
                  onOpenChange={(visible) =>
                    setPopoverVisible(visible && !retrain)
                  } // Show popover only if retrain is being unchecked
                >
                  <Checkbox checked={retrain} onChange={handleCheckboxChange}>
                    Yes
                  </Checkbox>
                </Popover>
              </Form.Item>
              <Button
                type="primary"
                onClick={handleTrainModel}
                style={{ margin: "16px 0" }}
              >
                Train Model
              </Button>
            </Col>

            <Col span={12}>
              <Title level={5}>User Input</Title>
              <TextArea
                rows={8}
                value={input}
                onChange={handleInputChange}
                placeholder="Enter your input here"
              />
              <Button
                type="primary"
                onClick={handleGenerateOutput}
                style={{ marginTop: "16px" }}
              >
                Generate
              </Button>
            </Col>
          </Row>

          <Title level={5}>Output</Title>
          <ProgressMessages progressMessages={progressMessages} />
        </Form>
      </Spin>
    </Card>
  );
};

export default TrainModel;
