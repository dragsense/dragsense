import { Col, Row, Form, Space, Divider, Input, Button, Steps, message } from "antd";
import { useEffect, useState } from "react";
import DownloadProject from "./Download";

const { Step } = Steps;
const { TextArea } = Input;

const Setting = ({ project, onSubmit, loading }) => {
    const [form] = Form.useForm();
    const [isFormChanged, setFormChanged] = useState(false);

    useEffect(() => {
        if (!project) {
            return;
        }
        form.setFieldsValue(project);
    }, [project]);

    const onSubmitForm = async (values) => {
        form
            .validateFields()
            .then(async (values) => {
                await onSubmit(values);
                setFormChanged(false);
                message.success('Data submitted!');

            })
            .catch((info) => {
                setFormChanged(false);
                message.error("Validate Failed.");
            });
    };

    const handleFormChange = () => {
        setFormChanged(true);
    };

    const handleResetForm = () => {
        form.resetFields();
        setFormChanged(false);
    };

    return (
        <>
            <Row gutter={16} style={{ marginTop: 10 }}>
                <Col span={12}>
                    <Form
                        layout="vertical"
                        form={form}
                        initialValues={{}}
                        onFinish={onSubmitForm}
                        onValuesChange={handleFormChange}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter the project name (alphanumeric).",
                                    pattern: /^[a-zA-Z0-9\s]+$/,
                                },
                                {
                                    min: 4,
                                    message: "Project name must be at least 4 characters long",
                                },
                            ]}
                        >
                            <Input maxLength={100} placeholder="Name" name="name" />
                        </Form.Item>
                        <Form.Item label="Description" name="desc">
                            <TextArea maxLength={500} rows={4} />
                        </Form.Item>
                        <Form.Item
                            label="API Url"
                            name="url"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input a valid URL!",
                                },
                            ]}
                        >
                            <Input maxLength={500} placeholder="Url" name="url" type="url" />
                        </Form.Item>
                        <Form.Item className="text-right">
                            <Space>
                            <Button onClick={handleResetForm}>Reset</Button>

                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    disabled={!isFormChanged}
                                >
                                    {project._id !== -1 ? "Update" : "Create"}
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={12}>
                    {<DownloadProject id={project._id} name={project.name} apikey={project.apikey} />}
                    <a href="#get-help">How to Install the website?</a>
                </Col>
            </Row>
            <div id="get-help">
                <Divider orientation="left" orientationMargin="0">
                    Help
                </Divider>
                {/* Steps for setting up the project */}
                <Steps direction="vertical" current={8} size="small">
                    {/* Step 1: Check hosting requirements */}
                    <Step title="Hosting Requirements" description="Ensure you have the following hosting requirements:" />
                    {/* Step 2: Download the project */}
                    <Step title="Download Project" description="Download the project files (your-project-name.rar)." />
                    {/* Step 3: Upload and extract files */}
                    <Step title="Upload and Extract Files" description="Upload the project files and extract them into the root folder of your hosting environment." />
                    {/* Step 4: Run necessary commands */}
                    <Step title="Run Commands" description="Run the following commands in the project's root folder: 1. `npm install` 2. `npm run build` 3. `npm run start`" />
                    {/* Step 5: Check readiness */}
                    <Step title="Check Readiness" description="Check if the Page not found is displayed, indicating that your environment is ready for creating pages and content." />
                    {/* Step 6: Return to DragSense */}
                    <Step title="Finally" description="Back to DragSense to create pages and content." />
                </Steps>
            </div>
        </>
    );
};

export default Setting;