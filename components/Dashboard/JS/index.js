
import { DashboardLayout } from "../../Layout";

import dynamic from 'next/dynamic'

const JS = dynamic(() => import('./JS'), {
  ssr: false,
})

export function JSComponent({ user }) {

    return (
        <DashboardLayout user={user}>
            <JS />
        </DashboardLayout>
    );
};

