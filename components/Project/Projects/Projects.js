
import { Alert, Typography, Card, message, Button, Tooltip, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
const { Title } = Typography;

import { useEffect, useReducer, useState, useCallback } from "react";

import ProjectServices from '@/lib/services/projects';

import AddProject from '../Add';
import ProjectLists from "./ProjectLists";
import Downlaod from './Download'
const initial = {
    projects: [],
    project: null,
    total: 0,
    error: '',
    loading: false
}

const initialProject = {
    _id: -1,
    name: '',
    url: '',
    port: '',
    mongouri: ''
}

const LIMIT = 6;

const reducer = (state, action) => {


    const updateProject = () => {
        let index = state.projects.findIndex(project => project._id === action.project?._id);
        if (index !== -1) {
            state.projects[index] = action.project;

        }
    }

    const deleteProject = () => {
        let index = state.projects.findIndex(project => project._id === action.id);
        if (index !== -1) {
            state.projects.splice(index, 1);
        }
    }




    switch (action.type) {
        case "start":
            return { ...state, loading: true }
        case "laod":
            return {
                ...state, projects: [...state.projects, ...action.data],
                total: action.total,
                error: ''

            }
        case "add":
            return {
                ...state,
                projects: [...state.projects, action.project],
                total: state.total + 1,
                project: action.project,
                label: `${'Edit'} Project:`,
                error: ''

            }
        case "edit":
            return {
                ...state,
                project: action.data,
                error: '',
                label: `${action.data._id !== -1 ? 'Edit' : 'New'} Project:`
            }
        case "update":
            updateProject();
            return {
                ...state,
                projects: [...state.projects],
                total: state.total + 1,
                error: ''

            }
        case "delete":
            deleteProject();
            return {
                ...state,
                projects: [...state.projects], total: state.total - 1,
                error: ''
            }

        case "close":
            return { ...state, project: null }
        case "error":
            return { ...state, error: action.error }
        case "finish":
            return { ...state, loading: false }
        default:
            return state;
    }
};

export default function Projects({ shared }) {

    const [state, dispatch] = useReducer(reducer, initial);
    const [page, setPage] = useState(1);
    const [downloadProject, setDownloadProject] = useState(null);


    const load = async () => {

        try {

            dispatch({ type: 'start' });
            const res = await ProjectServices.getAll(page, LIMIT, shared)

            const data = Array.isArray(res.projects) ? res.projects : [];

            dispatch({ type: 'laod', data, total: res.total });


        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
        } finally {

            dispatch({ type: 'finish' });

        }

    }

    useEffect(() => {

        load();
    }, [page]);

    const onSubmit = useCallback(async (states) => {


        try {
            dispatch({ type: 'start' });
            const project = state.project;

            const res = await ProjectServices.createOrUpdate(project?._id, states)

            dispatch({ type: project?._id !== -1 ? 'update' : 'add', project: res.project });

        } catch (e) {

            dispatch({ type: 'error', error: e?.error?.message || 'Something went wrong.' });
        } finally {
            dispatch({ type: 'finish' });
        }

    }, [state.project]);

    const onEdit = useCallback(async (project) => {


        if (project._id == -1) {
            dispatch({ type: 'edit', data: project })
            return;
        }

        try {
            dispatch({ type: 'start' });
            const res = await ProjectServices.get(project._id);


            dispatch({ type: 'edit', data: res.project });

        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
        } finally {
            dispatch({ type: 'finish' });
        }
    }, []);

    const onDelete = async (id) => {


        dispatch({ type: 'start' });
        try {
            await ProjectServices.delete(id)


            dispatch({ type: 'delete', id });

        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

        } finally {

            dispatch({ type: 'finish' });
        }
    };


    const onDownlaod = async (id, states) => {

        dispatch({ type: 'start' });
        try {

            await ProjectServices.download(id, states);
            return true;

        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

        } finally {

            dispatch({ type: 'finish' });
        }

    };


    const onClose = (e) => {
        e.preventDefault()
        dispatch({ type: 'close' });
    }

    const onDownlaodProject = (project) => {
        setDownloadProject(project);
    }



    return <>
        <Card loading={state.loading && state.total == 0} title={
            state.project ? state.label :
                `${shared ? 'Shared' : ''} Projects:`
        }
            extra={
                state.project ? <Button
                    type="dashed"
                    onClick={onClose}> Back </Button> :
                    state.total > 0 && !shared && <Tooltip title="Add New Project"><Button
                    type="text"
                        onClick={() => onEdit({ ...initialProject })}
                        icon={<PlusOutlined />}> </Button></Tooltip>}
            headStyle={{ padding: 10 }}
        >

            {state.error && <Alert message={state.error} style={{ margin: '10px 0' }} type="error" showIcon closable />}


            {state.project ?
                <AddProject
                    project={state.project}
                    onClose={onClose}
                    onSubmit={onSubmit}
                    loading={state.loading} /> :

                state.total == 0 && !shared ? <Space size={20} align="center">
                    <Title level={4}> Get started with your first project: </Title>
                    <Tooltip title="Add New"><Button
                        type="primary"
                        onClick={() => onEdit({ ...initialProject })}
                        icon={<PlusOutlined />}> </Button></Tooltip>
                </Space> :
                    <div className="text-center"><ProjectLists
                        projects={state.projects}
                        setPage={setPage}
                        total={state.total}
                        onEdit={onEdit}
                        onDownlaod={onDownlaodProject}
                        onDelete={onDelete}
                    />

                        {state.total > (page * LIMIT) && <Button

                            disabled={state.loading}
                            loading={state.loading} type="dashed" onClick={(e) => {
                                e.preventDefault();
                                setPage(page + 1);
                            }}> Load More </Button>

                        }

                    </div>
            }
        </Card>
        <Downlaod project={downloadProject} onDownload={onDownlaod} />

    </>

};

