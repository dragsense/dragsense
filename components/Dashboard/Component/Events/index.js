import { DashboardLayout } from "@/components/Layout";

import ComponentList from "../ComponentList";
import AddComponent from './Add';

export function ComponentComponent({ user, components }) {
    return (
        <DashboardLayout user={user}>
            <div className="outter-box h-100p">
                <ComponentList user={user} components={components} />
            </div>
        </DashboardLayout>
    );
};

export function AddComponentComponent({ user, component }) {
    return (
        <DashboardLayout user={user}>
           
                <AddComponent component={component} />
           
        </DashboardLayout>
    );
};

