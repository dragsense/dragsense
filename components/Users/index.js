import { GeneralLayout } from "../Layout";
import Users from "./Users"

export default function UsersComponent({ user }) {

    return (
        <GeneralLayout user={user}>
            
            <Users />

        </GeneralLayout>
    );
};



