

import { Typography, theme } from 'antd';

import { ProjectLayout } from "../Layout";
import ProjectsComponent from "./Projects";

const { Title } = Typography;


export default function ProjectComponent({ user }) {

    const {
        token: { colorPrimary },
      } = theme.useToken();


    return (
        <ProjectLayout user={user}>

            <Title> Wellcome, {" "}
                <span style={{color: colorPrimary}}>{user.name.split(" ")[0]}</span>
            </Title>
            <ProjectsComponent />

        </ProjectLayout>
    );
};


