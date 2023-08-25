import { AuthLayout } from "../Layout";
import { Card, Alert } from 'antd';
import { MdErrorOutline } from "react-icons/md";
import { useRouter } from "next/router";

const ErrorComponent = (props) => {
    const router = useRouter();
    const { error } = router.query;

    return (
        <AuthLayout>
            <Card title={<>Auth Error!! {<MdErrorOutline />} </>}>

                <Alert message={error} type="error" showIcon style={{ marginBottom: 10 }} />

            </Card>
        </AuthLayout>
    );
};

export default ErrorComponent;