import { Layout, theme } from 'antd';
import Nav from '../Nav';
const { Header, Content } = Layout;

const NavLayout = ({
    children,
    user

}) => {

    const {
        token: { colorBgLayout },
    } = theme.useToken();


    return (
        <>
            <Header className="header" style={{ background: colorBgLayout }}><Nav user={user} /></Header>
            {children}
        </>
    );
};

export default NavLayout;