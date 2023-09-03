import { useEffect, useReducer } from "react";
import { DashboardLayout } from "../Layout";
import { Card, Typography, Divider, Avatar, List, Alert, Badge, Descriptions } from 'antd';


import ProjectServices from "@/lib/services/projects";


const { Text } = Typography;

const initial = {
    project: {},
    theme: {},
    total: 1,
    error: '',
    loading: false
}

const reducer = (state, action) => {



    switch (action.type) {
        case "start":
            return { ...state, loading: true }
        case "load":
            return { ...state, project: action.project, error: '' }
        case "loadTheme":
            return { ...state, theme: action.theme, error: '' }
        case "error":
            return { ...state, error: action.error }
        case "finish":
            return { ...state, loading: false }
        default:
            return state;
    }
};


export default function Dashboard() {

    const [state, dispatch] = useReducer(reducer, initial);


    const laod = async () => {

        try {

            dispatch({ type: 'start' });

            const id = localStorage.getItem("project");
            let response = await ProjectServices.get(id);
            const project = response.project;
            dispatch({ type: 'load', project });

        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
        } finally {
            dispatch({ type: 'finish' });

        }

    }

    useEffect(() => {

        laod();

    }, []);

    const status = state.project?.status;

    return (


        <Card loading={state.loading} title={'Dashboard'} headStyle={{ padding: 10 }}>

            {state.error && <Alert message={state.error} style={{ margin: '10px 0' }} type="error" showIcon closable />}


            <Descriptions title="Project Info" layout="vertical" bordered>
                <Descriptions.Item label="Current Project">{state.project?.name}</Descriptions.Item>
                <Descriptions.Item label="API URL">{state.project?.url}</Descriptions.Item>
                <Descriptions.Item label="Total Users">
                    {state.project.roles?.length}
                </Descriptions.Item>
                <Descriptions.Item label="Description">
                {state.project?.desc}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                    <Badge status={status ? 'success' : 'danger'} text={status ? "Connected" : "Disonnected"} />
                </Descriptions.Item>
            </Descriptions>
            <br />
            <Descriptions title="Active Theme Info" layout="vertical" bordered>
                <Descriptions.Item label="Current Theme">Default</Descriptions.Item>
                <Descriptions.Item label="Author">
                    <b> <Avatar>A</Avatar> <em>autocode</em> </b>
                </Descriptions.Item>

            </Descriptions>

        </Card>


    );
};

export { PageComponent } from './Page'
export { ComponentComponent } from './Component';
export { CollectionComponent } from './Collection';
export { FormComponent } from './Form';
export { MediaComponent } from './Media';
export { StylingComponent } from './Styling';
export { JSComponent } from './JS';
export { SettingComponent } from './Setting';
