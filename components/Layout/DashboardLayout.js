import { Alert, Layout, theme } from 'antd';

const { Header, Content } = Layout;

import Nav from "../Nav";
import SideBar from '../SideBar';

const DashboardLayout = ({
    children,
    user
}) => {



    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout>
            <Header style={{ background: colorBgContainer, height: 36, zIndex: 100 }}><Nav user={user} /></Header>
            <Layout style={{ marginTop: 25 }}>
                <SideBar user={user} />

                <Layout>
                    <Content
                        style={{
                            padding: '0 24px 24px',
                            margin: 0,
                            minHeight: 'calc(100vh - 24px)'
                        }}>
                        <Alert type="warning"
                            closable
                            style={{ marginBottom: 10 }} message={<><strong>Note:</strong> Our app is currently in testing mode to ensure a top-notch experience.</>} />

                        {children}</Content>
                </Layout>
            </Layout>

        </Layout>
    );
};

export default DashboardLayout;
