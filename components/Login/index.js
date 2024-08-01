import { AuthLayout } from "../Layout";
import { GithubOutlined, FacebookOutlined, GoogleOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Input, Button, Form, Alert, Typography, Divider } from 'antd';
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
const { Title } = Typography;

import VerifyComponent from "./verify";
import ErrorComponent from "./error";

const LoginComponent = ({
    providers,
    csrfToken,
    signIn
}) => {
    const router = useRouter();
    const [form] = Form.useForm();
    const { error, status } = router.query;
    const [authError, setAuthError] = useState(error);
    const [isLoading, setIsLoading] = useState(false);


    const onSubmit = (values) => {
        setIsLoading(true);

        signIn("credentials", {
            email: values.email,
            password: values.password,
            csrfToken: csrfToken,
            callbackUrl: process.env.NEXTAUTH_URL,
            redirect: false
        }).then(async function (result) {
            setIsLoading(false);
            if (result.error !== null) {
                if (result.status === 401) {
                    setAuthError("The email or password you entered is incorrect. Please try again.");
                } else {
                    setAuthError(result.error);
                }
            } else 
                router.push("/admin/projects");
            
        }).finally(() => {
            setIsLoading(false);
        });
    };

    return (
        <AuthLayout>
            <Divider orientationMargin="0">
                <Title level={4}>Login</Title>
            </Divider>
            <br />
            {error && <Alert message={error || authError} type="error" showIcon style={{ marginBottom: 10 }} />}

            {status == 1 && <Alert message="Your account has been created successfully! Please login." type="success" showIcon style={{ marginBottom: 10 }} />}

            {status == 2 && <Alert message="Password reset successfuly! Please login." type="success" showIcon style={{ marginBottom: 10 }} />}

            <Form layout="vertical" form={form} initialValues={{ email: '', password: '' }} onFinish={onSubmit}>
                <Form.Item label="Email" name="email" rules={[
                    {
                        required: true,
                        message: 'Please enter a valid email address.',
                        type: 'email'
                    },
                ]} className="font-500">
                    <Input maxLength={500} placeholder="Email" name="name" />
                </Form.Item>

                <Form.Item label="Password" name="password" rules={[
                    {
                        required: true,
                        message: 'Please enter your password.',
                        type: 'password'
                    },
                ]} style={{ marginBottom: 0 }}>
                    <Input.Password
                        required
                        maxLength={48}
                        name="password"
                        placeholder="Password"
                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                </Form.Item>

                <Form.Item>
                    <span>
                  
                        <Link href="/auth/forget">Forgot password?</Link>
                    </span>
                </Form.Item>

                <Form.Item className="text-right">
                    <Button type="primary" htmlType="submit" loading={isLoading}>Login</Button>
                </Form.Item>
            </Form>

            {Object.values(providers || {}).map((provider) => <div key={provider.name}>
                    {(provider.id !== 'credentials' && provider.id !== 'forgot-password') && (
                        <Button
                            loading={isLoading}
                            type="button"
                            className={`social-btn ${provider.name === 'GitHub' ? 'github' :
                                provider.name === 'Facebook' ? 'facebook' :
                                    provider.name === 'Google' ? 'google' : ''}`}
                            icon={provider.name === 'GitHub' ? <GithubOutlined /> :
                                provider.name === 'Facebook' ? <FacebookOutlined /> :
                                    provider.name === 'Google' ? <GoogleOutlined /> : null}
                            onClick={() => signIn(provider.id)}
                        >
                            Sign in with {provider.name}
                        </Button>
                    )}
                </div>
            )}

            <div style={{ marginTop: 10 }}>
                <Link href="/auth/register">Create an account.</Link>
            </div>
        </AuthLayout>
    );
};

export default LoginComponent;
export {
    VerifyComponent,
    ErrorComponent
}