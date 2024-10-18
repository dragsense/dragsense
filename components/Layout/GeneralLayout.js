import { Layout, theme  } from 'antd';

const { Header, Content, Sider } = Layout;

import Nav from "../Nav";

const GeneralLayout = ({
    children,
    user
}) => {


    const {
        token: { colorBgContainer },
      } = theme.useToken();

    return (
        <Layout>
            <Header style={{background: colorBgContainer, height: 36, zIndex: 100}}><Nav user={user} /></Header>
       
            <Layout style={{marginTop: 20}}>
                    <Content
                        style={{
                            padding: 24,
                            width: '70%',
                            margin: 'auto',
                            minHeight: 'calc(100vh - 24px)'
                        }}>{children}</Content>
             
            </Layout>

        </Layout>
    );
};

export default GeneralLayout;
