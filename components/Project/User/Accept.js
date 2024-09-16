import { AuthLayout } from "../../Layout";
import { Card, Alert } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetcher } from '@/lib/fetch';

const AcceptedUserRequest = () => {
  const router = useRouter();
  const { error, token } = router.query;
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) return;

    const load = async () => {
      setIsLoading(true);
      setErrors([]);

      try {
        await fetcher('/api/projects/accept-request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });
        setSuccess(1);
        setErrors([]);
      } catch (error) {
        setSuccess(0);
        setErrors([error?.message || 'Sorry, we failed to process your request. Please try again!']);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [token]);

  return (
    <AuthLayout>
      <Card
        title="Project Request"
        loading={isLoading}
        extra={
          <>
            <Link href={`/auth/login?status=${success}`} disabled={isLoading}>
              Login?
            </Link>
          </>
        }
      >
        {error && (
          <Alert message={error} type="error" showIcon style={{ marginBottom: 10 }} />
        )}

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

        {success === 1 && (
          <>
            <p>Your request to join the project has been successfully accepted.</p>
            <p>You can now access the project. Please log in to continue.</p>
          </>
        )}
      </Card>
    </AuthLayout>
  );
};

export default AcceptedUserRequest;