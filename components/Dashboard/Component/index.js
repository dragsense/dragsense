
import { DashboardLayout } from "../../Layout";

import Components from "./Components"


export function ComponentComponent({ user }) {

    return <DashboardLayout user={user}>
        <div className="outter-box h-100p">
            <Components />
        </div>
    </DashboardLayout>

};