import { AuthLayout } from "../Layout";
import { Card, Alert, Button } from 'antd';
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetcher } from '@/lib/fetch';

const VerifyUserComponent = (props) => {
    const router = useRouter();
    const { error, token } = router.query;
    const [errors, setErrors] = useState([]);
    const [success, setSuccess] = useState(0);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        if(!token)
        return;

        const laod = async () => {

            setIsLoading(true);
            setErrors([]);

            try {
                await fetcher('/api/users/verify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });
                setSuccess(1);
                setErrors([]);
            } catch (error) {
                setSuccess(false);

                setErrors([error?.message || 'Sorry, we are failed to reset password. Please try again!']);
            } finally {
                setIsLoading(false);

            }
        }

        laod();

    }, [token])

    return (
        <AuthLayout>
            <Card title="Email Verification" loading={isLoading} extra={<>
                <Link href={`/auth/login?status=${success}`} disabled={isLoading}>Login?</Link>
            </>}>
                {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 10 }} />}

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
                {success && <><p>We have successfully verified your email.</p>
                <p>Thank you for verifying your email address.</p></>}

            </Card>
        </AuthLayout>
    );
};

export default VerifyUserComponent;