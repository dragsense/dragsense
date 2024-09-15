import { Alert, Layout, theme } from 'antd';

const { Header, Content, Footer } = Layout;

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
                            style={{ marginBottom: 10 }} message={<><strong>Note:</strong> Our app is currently undergoing testing to ensure an optimal user experience. If you encounter any bugs, please email us at support@dragsense.com.</>} />

                        {children}</Content>

                        <Footer
                        style={{
                            textAlign: 'center',
                            background: colorBgContainer,
                            padding: '12px 24px',
                        }}
                    >
                        © 2024 dragsense.com
                    </Footer>
                </Layout>
            </Layout>

        </Layout>
    );
};

export default DashboardLayout;
