'use client';

import { DashboardLayout } from "../../Layout";

import dynamic from 'next/dynamic'

const CSS = dynamic(() => import('./CSS'), {
  ssr: false,
})


export function CSSComponent({ user }) {

    return (
        <DashboardLayout user={user}>
            <CSS />
        </DashboardLayout>
    );
};

