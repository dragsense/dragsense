import { DashboardLayout } from "../../Layout";
import Setting from "./Setting";

export function SettingComponent({ user }) {

    return (
        <DashboardLayout user={user}>
            <Setting />
        </DashboardLayout>
    );
};

