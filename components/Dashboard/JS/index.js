
import { DashboardLayout } from "../../Layout";

import JS from './JS';

export function JSComponent({ user }) {

    return (
        <DashboardLayout user={user}>
            <JS />
        </DashboardLayout>
    );
};

