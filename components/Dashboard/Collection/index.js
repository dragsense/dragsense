
'use client';


import { DashboardLayout } from "../../Layout";

import Collections from "./Collections"


export function CollectionComponent({ user }) {

    return <DashboardLayout user={user}>
        <div className="outter-box h-100p">
            <Collections />
        </div>
    </DashboardLayout>

};