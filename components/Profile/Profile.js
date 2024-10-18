import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Switch,
  message,
  Alert,
  Card,
  Upload,
  Avatar,
  Row,
  Col,
} from "antd";
import { fetcher } from "@/lib/fetch";
import { useRouter } from "next/router";

const { TextArea } = Input;

const Profile = ({ user }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailPublic, setIsEmailPublic] = useState(
    user.isEmailPublic || false
  );
  const [errors, setErrors] = useState([]);
  const [isFormChanged, setFormChanged] = useState(false);
  const router = useRouter();

  const load = async () => {
    setIsLoading(true);
    setErrors([]);
    try {
      const userData = await fetcher(`/api/users/${user.email}`, {
        method: "GET",
      });
      setErrors([]);
      if (userData) {
        form.setFieldsValue({
          name: userData.name,
          email: userData.email,
          bio: userData.bio,
          isEmailPublic: userData.isEmailPublic,
        });

        setIsEmailPublic(userData.isEmailPublic);
      }
    } catch (error) {
      setErrors([error?.message || "Failed to update profile."]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    load();
  }, [user]);

  const onSubmit = async (values) => {
    setIsLoading(true);
    setErrors([]);

    form
      .validateFields()
      .then(async (values) => {
        try {
          await fetcher("/api/users", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...values }),
          });
          setErrors([]);
          setFormChanged(false);
          message.success("Profile updated successfully!");
        } catch (error) {
          setErrors([error?.message || "Failed to update profile."]);
        }
      })
      .catch((info) => {
        if (info?.errorFields?.length > 0) {
          setErrors(info?.errorFields?.map((field) => field.errors));
        } else {
          setErrors(["Validation Failed."]);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onEmailPublicChange = (checked) => {
    setIsEmailPublic(checked);
    setFormChanged(true);
  };

  const handleFormChange = () => {
    setFormChanged(true);
  };

  const onBackClick = () => {
    router.push("/admin/projects");
  };

  return (
    <Card
      loading={isLoading}
      title="Profile"
      extra={
        <Button type="dashed" onClick={onBackClick}>
          Back to Projects
        </Button>
      }
    >
      {errors.length > 0 &&
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
          email: user.email,
        }}
      >
        {/* Name Field */}
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter your name." }]}
        >
          <Input maxLength={500} placeholder="Enter your name" />
        </Form.Item>

        {/* Email Field */}
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please enter your email." }]}
        >
          <Input maxLength={500} placeholder="Enter your email" />
        </Form.Item>

        {/* Email Public Toggle */}
        <Form.Item label="Make email public" name="isEmailPublic">
          <Switch checked={isEmailPublic} onChange={onEmailPublicChange} />
        </Form.Item>

        {/* Bio Section */}
        <Form.Item label="Bio" name="bio">
          <TextArea rows={4} placeholder="Tell something about yourself..." />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button
            disabled={!isFormChanged}
            type="primary"
            htmlType="submit"
            loading={isLoading}
          >
            Update Profile
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Profile;
