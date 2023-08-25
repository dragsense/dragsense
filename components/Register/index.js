import { AuthLayout } from "../Layout";
import { EyeInvisibleOutlined, EyeTwoTone, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { Input, Button, message, Form, Typography, Alert, Divider, Progress } from 'antd';
import { useState } from 'react'
import { useRouter } from "next/router";
import { fetcher } from '@/lib/fetch';
import Link from "next/link";
import validator from 'validator';

import ForgetComponent from "./forget";
import ResetComponent from './reset';
import VerifyUserComponent from './verify';

const { Text, Title } = Typography;

const initialState = {
    email: '',
    name: '',
    password: '',
};

const RegisterComponent = (props) => {
    const router = useRouter();
    const [form] = Form.useForm();
    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);


    const validatePasswordStrength = (value) => {
        const score = calculatePasswordStrength(value);
        setPasswordStrength(score);
    };

    const calculatePasswordStrength = (value) => {

        const passwordLengthScore = Math.min(value.length, 10) * 10;
        const passwordComplexityScore = validator.isStrongPassword(value, {
            minLength: 8, minLowercase: 1,
            minUppercase: 1, minNumbers: 1, minSymbols: 1
        }) ? 100 : 0;
        return Math.round((passwordLengthScore + passwordComplexityScore) / 2);
    };

    const onSubmit = async (e) => {

        e.preventDefault();
        setIsLoading(true);
        setErrors([]);

        form
            .validateFields()
            .then(async (values) => {

                try {
                    await fetcher('/api/users', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ ...values, confirmPassword: undefined }),
                    });
                    router.query.status = 1;
                    router.pathname = '/auth/verify';
                    router.push(router);
                    setErrors([]);
                } catch (error) {
                    setErrors([error?.message || 'Failed to register user.']);
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

    return (
        <AuthLayout>
            <Divider orientationMargin="0">
                <Title level={4}>Register</Title>
            </Divider>
            <br />
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
                layout="vertical"
                form={form}
                initialValues={initialState}


            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter your name',
                        },
                    ]}
                    hasFeedback
                >
                    <Input placeholder="Name" required />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter a valid email address',
                            type: 'email',
                        },
                    ]}
                    hasFeedback
                >
                    <Input placeholder="Email" required />
                </Form.Item>

                <Form.Item
                    label={<>Password
                        <Progress
                            percent={passwordStrength}
                            showInfo={false}
                            steps={3}
                            type="line"
                            strokeColor={passwordStrength >= 70 ? "#52c41a" : passwordStrength >= 40 ? "#faad14" : "#ff4d4f"}
                            status={passwordStrength >= 70 ? "success" : passwordStrength >= 40 ? "warning" : "exception"}
                            style={{ marginLeft: 10, }}
                        />
                        <Text type={passwordStrength >= 70 ? "success" : "danger"} style={{ marginLeft: 5 }}>
                            {passwordStrength >= 70 ? (
                                <CheckCircleOutlined />
                            ) : (
                                <WarningOutlined />
                            )}
                        </Text>
                    </>
                    }
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter a password',
                        }

                    ]}
                    hasFeedback

                >
                    <Input.Password
                        required
                        placeholder="Password"
                        onChange={(e) => validatePasswordStrength(e.target.value)}
                    />

                </Form.Item>





                <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Passwords do not match!'));
                            },
                        }),
                    ]}
                    hasFeedback
                >
                    <Input.Password
                        required
                        placeholder="Confirm Password"
                    />
                </Form.Item>

                <Form.Item>
                    <span>
                        <Link href='/auth/login'>Login?</Link>
                    </span>
                </Form.Item>

                <Form.Item className="text-right">
                    <Button loading={isLoading} type="primary" onClick={onSubmit}>Submit</Button>
                </Form.Item>
            </Form>
        </AuthLayout>
    );
};

export default RegisterComponent;
export { ForgetComponent, ResetComponent, VerifyUserComponent };