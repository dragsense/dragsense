
'use client';

import { DashboardLayout } from "../../Layout";

import Pages from "./Pages"


export function PageComponent({ user }) {

    return <DashboardLayout user={user}>
        <div className="outter-box h-100p">
            <Pages />
        </div>
    </DashboardLayout>


};


