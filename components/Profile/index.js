

import { Typography, theme } from 'antd';

import { ProfileLayout } from "../Layout";
import Profile from "./Profile";

const { Title } = Typography;


export default function ProfileComponent({ user }) {

    const {
        token: { colorPrimary },
      } = theme.useToken();


    return (
        <ProfileLayout user={user}>

            <Title> Wellcome, {" "}
                <span style={{color: colorPrimary}}>{user.name.split(" ")[0]}</span>
            </Title>
            <Profile user={user} />
        </ProfileLayout>
    );
};


