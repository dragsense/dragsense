import { Divider, Layout, theme } from 'antd';

const { Content } = Layout;

const AuthLayout = ({
    children,
}) => {

    const {
        token: { colorBgElevated,  colorPrimaryActive },
      } = theme.useToken();



    return (
        <>
            <Layout style={{ minHeight: '100vh' }}>
                <Content className='auth-container'>
                    <div className='bg'> <img src="/images/background/bg-triangles.png" alt='bg' /> </div>
                    <div className='logo-container' style={{backgroundColor: colorBgElevated}}>
                    <div style={{ padding: 10}}>
                        <div className='logo' > <img src="/images/logo/nav-logo.png" alt='logo' /> </div>
                        </div>
                        <div className='box' > {children}</div>
                    </div>
                    <div className='bg'> <img src="/images/background/bg-triangles.png" alt='bg' /> </div>
                </Content>
            </Layout>
        </>
    );
};

export default AuthLayout;
