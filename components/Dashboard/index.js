import { DashboardLayout } from "../Layout";
import Dashboard from "./Dashboard";

export default function DashboardComponent({ user }) {
  return (
    <DashboardLayout user={user}>
      <Dashboard />
    </DashboardLayout>
  );
}

export { PageComponent } from "./Page";
export { ComponentComponent } from "./Component";
export { CollectionComponent } from "./Collection";
export { FormComponent } from "./Form";
export { MediaComponent } from "./Media";
export { StylingComponent } from "./Styling";
export { JSComponent } from "./JS";
export { CSSComponent } from "./CSS";
export { SettingComponent } from "./Setting";
