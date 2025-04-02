import { AuthLayout } from "../Layout";
import { Input, Button, Form, Typography, Alert, Divider } from "antd";
import { useState } from "react";
import { fetcher } from "@/lib/fetch";
import Link from "next/link";
import { useRouter } from "next/router";

const { Title } = Typography;

const initialState = {
  email: "",
};

const ForgetComponent = ({ signIn }) => {
  const router = useRouter();
  const { error } = router.query;

  const [form] = Form.useForm();
  const [errors, setErrors] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]); // Reset errors before validation
  
    form
      .validateFields()
      .then(async (values) => {
        try {
          const response = await signIn("forgot-password", {
            ...values,
            redirect: false,
          });
  
          if (response.error === "EmailSignin") {
            setErrors([
              "The email you entered is incorrect. Please try again.",
            ]);
          } else {
            router.push("/auth/verify?status=2");
          }
        } catch (error) {
          setErrors([error?.message || "Something went wrong."]);
        } finally {
          setIsLoading(false);
        }
      })
      .catch((info) => {
        if (info?.errorFields?.length > 0) {
          setErrors(info.errorFields.map((field) => field.errors).flat());
        } else {
          setErrors(["Validation failed."]);
        }
        setIsLoading(false);
      });
  };
  
  return (
    <AuthLayout>
      <Divider orientationMargin="0">
        <Title level={4}>Forgot Password?</Title>
      </Divider>
      <br />
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ marginBottom: 10 }}
        />
      )}

      {errors &&
        errors.length > 0 &&
        errors.map((error, index) => (
          <Alert
            key={index}
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 10 }}
          />
        ))}

      <Form layout="vertical" form={form} initialValues={initialState}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please enter a valid email address",
              type: "email",
            },
          ]}
          hasFeedback
        >
          <Input maxLength={500} placeholder="Email" required />
        </Form.Item>

        <Form.Item>
          <span>
            <Link href="/auth/login">Login?</Link>
          </span>
        </Form.Item>

        <Form.Item className="text-right">
          <Button loading={isLoading} type="primary" onClick={onSubmit}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </AuthLayout>
  );
};

export default ForgetComponent;
