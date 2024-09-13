import { Tabs, Divider } from "antd";
import Setting from "./Setting";
import { UserComponent } from "../User";
import { BackupComponent } from '../Backup';
import { ThemeComponent } from '../Theme';

import { SettingOutlined, DatabaseFilled, UserOutlined, FontSizeOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;




const AddProject = ({ project, onClose, onSubmit, loading }) => {


    return (

        <>

            <Tabs
                defaultActiveKey="1" >

                <TabPane tab={<span>
                    <SettingOutlined size="1rem" style={{ marginRight: 3 }} />
                    Setting
                </span>} key="1">

                    <Setting project={project} onSubmit={onSubmit} loading={loading} />
                </TabPane>
                <TabPane tab={<span>
                    <UserOutlined size="1rem" style={{ marginRight: 3 }} />
                    Users
                </span>} key="2">
                    <UserComponent projectId={project._id} />
                </TabPane>
                <TabPane tab={<span>
                    <DatabaseFilled size="1rem" style={{ marginRight: 3 }} />
                    Backups
                </span>} key="3">
                    <BackupComponent projectId={project._id} />
                </TabPane>

                <TabPane tab={<span>
                    <FontSizeOutlined size="1rem" style={{ marginRight: 3 }} />
                    Themes
                </span>} key="4">
                    <ThemeComponent projectId={project._id} platform={project.platform} activeTheme={project.activeTheme || 0} />
                </TabPane>
            </Tabs>


        </>

    );
};

export default AddProject;
