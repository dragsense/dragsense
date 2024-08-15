import { AuthLayout } from "../Layout";
import { Card, Alert } from "antd";

import { useRouter } from "next/router";

const VerifyComponent = (props) => {
  const router = useRouter();
  const { error, status } = router.query;

  return (
    <AuthLayout>
      <Card title={"Check your inbox"}>
        {error ? (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 10 }}
          />
        ) : (
          <>
            {status == 1 && (
              <Alert
                message="Your account has been created successfully! Please Verify your email."
                type="success"
                showIcon
                style={{ marginBottom: 10 }}
              />
            )}
            {status == 2 && (
              <p>
                We have sent you an email. <br /> <br />
                Please check your inbox for further instructions.
              </p>
            )}
          </>
        )}
      </Card>
    </AuthLayout>
  );
};

export default VerifyComponent;
