
import { Card, Alert, Button, Tooltip, Space, Typography, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { useEffect, useReducer, useState } from "react";
const { Title } = Typography;

import ThemeList from "./ThemeList";
import AddTheme from './Add';
import ThemeServices from '@/lib/services/themes';

const initial = {
    themes: [],
    theme: null,
    total: 1,
    error: '',
    loading: false
}

const reducer = (state, action) => {


    const deleteTheme = () => {
        let index = state.themes.findIndex(theme => theme._id === action.id);
        if (index !== -1) {
            state.themes.splice(index, 1);
        }
    }



    switch (action.type) {
        case "start":
            return { ...state, loading: true }
        case "load":
            return {
                ...state, themes: [...state.themes, ...action.data],
                total: action.total + 1, error: ''
            }
        case "add":
            return {
                ...state, themes: [...state.themes, action.theme],
                total: state.total + 1, error: ''
            }
        case "edit":
            return { ...state, theme: action.data, error: '' }
        case "close":
            return { ...state, theme: null }
        case "delete":
            deleteTheme();
            return { ...state, themes: [...state.themes], total: state.total - 1, error: '' }
        case "error":
            return { ...state, error: action.error }
        case "refresh":
            return { ...state, themes: [...state.themes] }
        case "finish":
            return { ...state, loading: false }
        default:
            return state;
    }
};

export default function Themes({ projectId, activeTheme = 0 }) {

    const [state, dispatch] = useReducer(reducer, initial);
    const [page, setPage] = useState(1);
    const [activeThemeId, setActiveTheme] = useState(activeTheme);

    const load = async () => {

        
        try {

            dispatch({ type: 'start' });
            const res = await ThemeServices.getAll(projectId, page);


            const data = Array.isArray(res.themes) ? res.themes : [];

            dispatch({ type: 'load', data, total: res.total });


        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
        } finally {

            dispatch({ type: 'finish' });

        }

    }

    useEffect(() => {

        if (!projectId)
            return;

            load();

    }, [page]);


    const onAdd = async (id) => {


        dispatch({ type: 'start' });

        let status = false;

        try {

            const res = await ThemeServices.create(projectId, id);

            dispatch({ type: 'add', theme: res.theme });

            status = true;
            dispatch({ type: 'close' });


        } catch (e) {

            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

        } finally {
            dispatch({ type: 'finish' });
            return status;

        }

    };

    const onDelete = async (id) => {


        dispatch({ type: 'start' });
        try {
            await ThemeServices.delete(projectId, id);

            dispatch({ type: 'delete', id });

        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

        } finally {

            dispatch({ type: 'finish' });
        }
    };

    const onInstall = async (id) => {



        dispatch({ type: 'start' });
        try {
            await ThemeServices.install(projectId, id);
            setActiveTheme(id)

            message.error('Great! Theme Installed Successfully.');


        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

        } finally {

            dispatch({ type: 'finish' });
        }
    };

    const onDownload = async (id) => {

        dispatch({ type: 'start' });
        try {

            const res = await ThemeServices.download(projectId, id);

            const downloadLink = document.createElement('a');
            downloadLink.href = `/api/projects/${projectId}/themes/${res.uuid}`;
            downloadLink.download = `theme-${id}-${new Date().getDate()}.zip`;
            downloadLink.click();

        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

        } finally {

            dispatch({ type: 'finish' });
        }

    };

    const onEdit = (theme) => {
        dispatch({ type: 'edit', data: theme });

    };


    return <>
        <Card loading={state.loading} title={`Themes: Comming Soon`}
            extra={state.total > 0 && <Tooltip title="Add New Theme"><Button
                type="text"
                onClick={(e) => {
                    e.preventDefault();
                    onEdit({})
                }}
                icon={<PlusOutlined />}> </Button></Tooltip>}
                headStyle={{ padding: 10 }}
                >

{state.error && <Alert message={state.error} style={{margin: '10px 0'}} type="error" showIcon closable />}


            {state.total <= 0 ? <Space size={20}>
                <Title level={5}> Add New Theme: </Title>
                <Tooltip title="Add New"><Button
                    type="primary"
                    onClick={(e) => {
                        e.preventDefault();
                        onEdit({})
                    }}
                    icon={<PlusOutlined />}> </Button></Tooltip>
            </Space> :
                <ThemeList
                    themes={state.themes}
                    onDelete={onDelete}
                    onInstall={onInstall}
                    onDownload={onDownload}
                    total={state.total}
                    activeTheme={activeThemeId}
                    setPage={setPage} />
            }
        </Card>


        <AddTheme
            onAdd={onAdd}
            themes={state.themes}
            theme={state.theme}
            loading={state.loading}
        />


    </>

};

