'use client';

import { DashboardLayout } from "../../Layout";

import Forms from "./Forms"


export function FormComponent({ user }) {

    return <DashboardLayout user={user}>
        <div className="outter-box h-100p">
            <Forms />
        </div>
    </DashboardLayout>

};