
import { DashboardLayout } from "../../Layout";

import CSS from './CSS';

export function CSSComponent({ user }) {

    return (
        <DashboardLayout user={user}>
            <CSS />
        </DashboardLayout>
    );
};

