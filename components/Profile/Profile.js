import { useState } from "react";
import { Form, Input, Button, Radio, Switch, Alert, Card } from "antd";
import { fetcher } from '@/lib/fetch';


const Profile = ({ user }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isFormChanged, setFormChanged] = useState(false);


  const onSubmit = async (values) => {

    setIsLoading(true);
    setErrors([]);

    form
      .validateFields()
      .then(async (values) => {

        try {
          await fetcher('/api/users', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...values }),
          });
          setErrors([]);
          setFormChanged(false);

        } catch (error) {
          setErrors([error?.message || 'Failed to update user.']);
        }
      })
      .catch((info) => {
        if (info?.errorFields?.length > 0) {
          setErrors(info?.errorFields?.map((field) => field.errors));
        } else {
          setErrors(['Validate Failed.']);
        }
      })
      .finally(() => {
        setIsLoading(false);

      });
  };

  const on2FAChange = (checked) => {
    setIs2FAEnabled(checked);
  };

  const handleFormChange = () => {
    setFormChanged(true);
  };

  return (
    <Card loading={isLoading} title="Profile:">


      {(errors &&
        errors.length > 0) &&
        errors.map((error, index) => (
          <Alert
            key={index}
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 10 }}
          />
        ))}

      <Form
        form={form}
        onFinish={onSubmit}
        onValuesChange={handleFormChange}

        layout="vertical"
        initialValues={{
          name: user.name,
          theme: user.theme,
          enable2FA: user.enable2FA,
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter your name." }]}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>



        {/* <Form.Item label="Preferred Theme" name="theme" valuePropName="value">
          <Radio.Group defaultValue={"dark"}>
          
          <Radio.Button value="dark">Dark</Radio.Button>
            <Radio.Button value="light">Light</Radio.Button>
          </Radio.Group>
        </Form.Item> */}

        {/* <Form.Item label="One Time Password" name="enable2FA" valuePropName="checked">
          <Switch checked={is2FAEnabled} onChange={on2FAChange} />
        </Form.Item> */}

     

        <Form.Item>
          <Button
            disabled={!isFormChanged}
            type="primary" htmlType="submit" loading={isLoading}>
            Update
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Profile;