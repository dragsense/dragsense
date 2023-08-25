import React, { useState } from 'react';
import { Menu, Layout, theme } from 'antd';

import { useRouter } from 'next/router';

import {
    MdFileCopy, MdWidgets, MdPermMedia,
    MdSettings, MdStyle,
    MdCode, MdEmail, MdDashboard, MdJavascript, MdCss
} from 'react-icons/md'
import { FaCoins } from 'react-icons/fa'

const { Sider } = Layout;

const activeRoute = (routeName) => {

    if (routeName === '/admin/dashboard')
        return '0';

    if (routeName === '/admin/dashboard/pages' || routeName === "/admin/dashboard/pages/[pageId]")
        return '1';

    if (routeName === '/admin/dashboard/components' || routeName === "/admin/dashboard/components/[componentId]")
        return '2';

    if (routeName === '/admin/dashboard/collections' || routeName === "/admin/dashboard/collections/[collectiontId]")
        return '3';

    if (routeName === '/admin/dashboard/media/docs' || routeName === '/admin/dashboard/media' || routeName === '/admin/dashboard/media/videos')
        return '4';

    if (routeName === '/admin/dashboard/styling')
        return '5';

    if (routeName === '/admin/dashboard/jsindex')
        return '6';

    if (routeName === '/admin/dashboard/cssindex')
        return '7';

    if (routeName === '/admin/dashboard/forms')
        return '8';

    if (routeName === '/admin/dashboard/setting')
        return '9';

}

const SideBar = () => {

    const {
        token: { colorBgContainer },
    } = theme.useToken();


    const router = useRouter();

    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };


    return (

        <>

            <Sider collapsible collapsed={collapsed} onCollapse={toggleCollapsed}>
                <Menu
                    style={{ background: colorBgContainer, height: '100%' }}
                    defaultSelectedKeys={[activeRoute(router.pathname)]}
                    mode="inline"
                  
                    id="ac-side-menu"
                    inlineCollapsed={false}
                >
                    <Menu.Item key="0" icon={<MdDashboard size="1.5em" />} onClick={() => router.push('/admin/dashboard')}>
                        Dashboard
                    </Menu.Item>
                    <Menu.Item key="1" icon={<MdFileCopy size="1.5em" />} onClick={() => router.push('/admin/dashboard/pages')}>
                        Pages
                    </Menu.Item>
                    <Menu.Item key="2" icon={<MdWidgets size="1.5em" />} onClick={() => router.push('/admin/dashboard/components')}>
                        Components
                    </Menu.Item>
                    <Menu.Item key="3" icon={<FaCoins size="1.5em" />} onClick={() => router.push('/admin/dashboard/collections')}>
                        Collections
                    </Menu.Item>
                    <Menu.Item key="4" icon={<MdPermMedia size="1.5em" />} onClick={() => router.push('/admin/dashboard/media')}>
                        Media
                    </Menu.Item>
                    <Menu.Item key="5" icon={<MdStyle size="1.5em" />} onClick={() => router.push('/admin/dashboard/styling')}>
                        Styling
                    </Menu.Item>
                    <Menu.Item key="6" icon={<MdJavascript size="2.5em" />} onClick={() => router.push('/admin/dashboard/jsindex')}>
                        Custom JS
                    </Menu.Item>
                    <Menu.Item key="7" icon={<MdCss size="2.5em" />} onClick={() => router.push('/admin/dashboard/cssindex')}>
                        Custom CSS
                    </Menu.Item>
                    <Menu.Item key="8" icon={<MdEmail size="1.5em" />} onClick={() => router.push('/admin/dashboard/forms')}>
                        Form
                    </Menu.Item>
                    <Menu.Item key="9" icon={<MdSettings size="1.5em" />} onClick={() => router.push('/admin/dashboard/setting')}>
                        Setting
                    </Menu.Item>
                </Menu>

            </Sider>
        </>
    );
}

export default SideBar;
