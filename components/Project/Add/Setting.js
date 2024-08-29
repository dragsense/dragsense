import {
  Col,
  Row,
  Form,
  Space,
  Divider,
  Input,
  Button,
  Steps,
  message,
} from "antd";
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
          {
            <DownloadProject
              id={project._id}
              name={project.name}
              apikey={project.apikey}
            />
          }
          <a href="#get-help">How to Install the website?</a>
        </Col>
      </Row>
      <div id="get-help">
        <HelpSection />
      </div>
    </>
  );
};

const HelpSection = () => {
  return (
    <div id="get-help">
      <Divider orientation="left" orientationMargin="0">
        Help
      </Divider>

      {/* Steps for setting up the project */}
      <Steps direction="vertical" current={8} size="small">
        {/* Hosting Requirements */}
        <Step
          title="Hosting Requirements"
          description={
            <>
              <p><strong>Ensure you have the following hosting requirements:</strong></p>
              <ul>
                <li>
                  <strong>Node.js:</strong> Node.js 18.x or higher
                </li>
                <li>
                  <strong>Laravel:</strong> PHP 8.x or higher
                </li>
                <li>
                  <strong>Database:</strong> For Laravel: MySQL, PostgreSQL, or any other supported database. For Node.js: MongoDB
                </li>
                <li>
                  <strong>Web Server:</strong> Apache or Nginx
                </li>
              </ul>
            </>
          }
        />

        {/* Download Project */}
        <Step
          title="Download Project"
          description="Download the project files (your-project-name.rar)."
        />

        {/* Upload and Extract Files */}
        <Step
          title="Upload and Extract Files"
          description="Upload the project files and extract them into the root folder of your hosting environment."
        />

        {/* Environment Setup */}
        <Step
          title="Environment Setup"
          description={
            <>
              <p><strong>Prepare your environment configuration:</strong></p>
              <ul>
                <li>
                  <strong>Rename <code>.env.example</code> to <code>.env</code></strong>
                </li>
              </ul>
            </>
          }
        />

        {/* NodeJS Setup */}
        <Step
          title="NodeJS Setup"
          description={
            <>
              <p><strong>Run the following commands in the project's root folder:</strong></p>
              <ol>
                <li>
                  <code style={{ backgroundColor: '#f0f0f0', padding: '2px 4px' }}>npm install</code>
                </li>
                <li>
                  <code style={{ backgroundColor: '#f0f0f0', padding: '2px 4px' }}>npm run build</code>
                </li>
                <li>
                  <code style={{ backgroundColor: '#f0f0f0', padding: '2px 4px' }}>npm run start</code>
                </li>
              </ol>
            </>
          }
        />

        {/* Laravel Setup */}
        <Step
          title="Laravel Setup"
          description={
            <>
              <p><strong>After extracting the project files, follow these steps:</strong></p>
              <ol>
                <li>
                  <strong>Run <code style={{ backgroundColor: '#f0f0f0', padding: '2px 4px' }}>composer install</code> to install PHP dependencies.</strong>
                </li>
                <li>
                  <strong>Run <code style={{ backgroundColor: '#f0f0f0', padding: '2px 4px' }}>npm install</code> to install Node.js dependencies.</strong>
                </li>
                <li>
                  <strong>Run <code style={{ backgroundColor: '#f0f0f0', padding: '2px 4px' }}>npm run build</code> to compile React components.</strong>
                </li>
                <li>
                  <strong>Add the following configuration to <code style={{ backgroundColor: '#f0f0f0', padding: '2px 4px' }}>config/autocode.php</code>:</strong>
                  <pre style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
{`<?php
return [
    'api_key' => env('AUTOCODE_API_KEY'),
    'prefix' => env('AUTOCODE_API_PREFIX', 'api'),
];`}
                  </pre>
                </li>
                <li>
                  <strong>In the <code style={{ backgroundColor: '#f0f0f0', padding: '2px 4px' }}>filesystems.php</code> configuration file, add:</strong>
                  <pre style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
{`'links' => [
    public_path('storage') => storage_path('app/public'),
    public_path('autocode') => base_path('dist'),
    // Additional symbolic links can be defined here as needed for your application
],`}
                  </pre>
                  <strong>Then, run <code style={{ backgroundColor: '#f0f0f0', padding: '2px 4px' }}>php artisan storage:link</code></strong>
                </li>
                <li>
                  <strong>Register the AutoCode service provider in either <code style={{ backgroundColor: '#f0f0f0', padding: '2px 4px' }}>config/app.php</code> or a new Laravel path like <code style={{ backgroundColor: '#f0f0f0', padding: '2px 4px' }}>bootstrap/provider.php</code>:</strong>
                  <pre style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
{`DragSense\\AutoCode\\Providers\\AutoCodeServiceProvider::class,`}
                  </pre>
                </li>
                <li>
                  <strong>Update the autoload in <code style={{ backgroundColor: '#f0f0f0', padding: '2px 4px' }}>composer.json</code>:</strong>
                  <pre style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
{`"autoload": {
    "psr-4": {
        // other namespaces...
        "DragSense\\\\AutoCode\\": "packages/DragSense/AutoCode/src"
    }
}`}
                  </pre>
                </li>
                <li>
                  <strong>Run <code style={{ backgroundColor: '#f0f0f0', padding: '2px 4px' }}>composer dump-autoload</code> to update the autoload files.</strong>
                </li>
                <li>
                  <strong>Run the migration commands:</strong>
                  <pre style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
{`php artisan migrate`}
                  </pre>
                  <pre style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
{`php artisan migrate --path=packages/DragSense/AutoCode/src/database/migrations`}
                  </pre>
                </li>
                <li>
                  <strong>Start the Laravel development server:</strong>
                  <pre style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
{`php artisan serve`}
                  </pre>
                </li>
              </ol>
            </>
          }
        />

        {/* Check Readiness */}
        <Step
          title="Check Readiness"
          description="Check if the 'Page not found' is displayed, indicating that your environment is ready for creating pages and content."
        />

        {/* Finally */}
        <Step
          title="Finally"
          description="Return to DragSense to create pages and content."
        />
      </Steps>
    </div>
  );
};

export default Setting;
