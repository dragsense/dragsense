import PageList from "./PageList";
import AddPage from './Add';
import { Card, Spin, Typography, Alert, Button, Tooltip, Space, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageServices from "@/lib/services/pages";
import SettingServices from '@/lib/services/setting';

import { useEffect, useReducer, useState } from "react";
const { Title } = Typography;

import ContentEditor from "./Content/ContentEditor";

const STATUS = ['DRAFT', 'PUBLIC'];


const initial = {
    pages: [],
    page: null,
    total: 0,
    error: '',
    loading: false
}


const initialPage = {
    _id: -1,
    name: '', slug: '', setting: {
        title: '',
        desc: '',
        content: '',
        status: "DRAFT"
    }, layout: '',
    scripts: {
        head: '',
        footer: '',
    }
}


const reducer = (state, action) => {


    const updatePage = () => {
        let index = state.pages.findIndex(page => page._id === action.page?._id);
        if (index !== -1) {
            state.pages[index] = action.page;

        }
    }

    const deletePage = () => {
        let index = state.pages.findIndex(page => page._id === action.id);
        if (index !== -1) {
            state.pages.splice(index, 1);
        }
    }



    switch (action.type) {
        case "start":
            return { ...state, loading: true }
        case "load":
            return {
                ...state, pages: action.data, total: action.total,
                error: ''
            }
        case "add":
            return {
                ...state, pages: [...state.pages, action.page], total: state.total + 1,
               page: null,
                error: ''
            }
        case "edit":
            return {
                ...state,
                page: action.data,
                label: `${action.data._id !== -1 ? 'Edit' : 'New'} Page:`,
                error: ''

            }
        case "close":
            return { ...state, page: null }
        case "update":

            updatePage();
            return {
                ...state, pages: [...state.pages], total: state.total + 1,
                page: action.page,
                error: ''
            }
        case "delete":
            deletePage();
            return {
                ...state, pages: [...state.pages], total: state.total - 1,
                error: ''
            }
        case "error":
            return { ...state, error: action.error }
        case "finish":
            return { ...state, loading: false }
        default:
            return state;
    }
};

export default function Pages() {

    const [state, dispatch] = useReducer(reducer, initial);
    const [page, setPage] = useState(1);
    const [setting, setSetting] = useState({});

    const [searchQuery, setSearchQuery] = useState('');


    useEffect(() => {
        const fetchHost = async () => {
          const result = await SettingServices.get();
          const settings = result.settings;
          setSetting({ host: result.host, homePage: settings.homePage });
        };
        fetchHost();
      }, []);

    const load = async () => {
        try {

            dispatch({ type: 'start' });


            const res = await PageServices.getAll(page, 10);

            if (res.pages) {

               

                const data = Array.isArray(res.pages.results) ? res.pages.results : [];

                dispatch({ type: 'load', data, total: res.pages.totalResults });

            }

        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
        } finally {
            dispatch({ type: 'finish' });
        }

    }

    const search = async () => {
        try {

            dispatch({ type: 'start' });

            const res = await PageServices.search(searchQuery);

       
            if (res.pages) {
                const data = Array.isArray(res.pages.results) ? res.pages.results : [];
                dispatch({ type: 'load', data, total: res.pages.totalResults });
            }


        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
        } finally {

            dispatch({ type: 'finish' });

        }
    }

    useEffect(() => {

        if (!searchQuery){
            load();
        }
        else
        search();

    }, [page, searchQuery]);

    useEffect(() => {

        ContentEditor.init(document);

        return () => {
            ContentEditor.destroy(null);
        }
    }, []);

    const onEdit = (page) => {
        dispatch({ type: 'edit', data: page });

    };

    const onSubmit = async (states) => {

        dispatch({ type: 'start' });

        const page = state.page;

        try {

            states.populatedLayout = undefined;
            states.populatedImage = undefined;

            const res = await PageServices.createOrUpdate(page?._id, states);


            dispatch({ type: page?._id !== -1 ? 'update' : 'add', page: res.page });
            message.success('Data submitted!');

        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
            message.error(e?.message || 'Something went wrong.');

        } finally {
            dispatch({ type: 'finish' });
        }


    };


    const onClone = async (_id) => {

        dispatch({ type: 'start' });

        const page = state.page;

        try {
            const res = await PageServices.clone(_id)

            dispatch({ type: 'add', page: res.page });

        } catch (e) {

            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
            message.error(e?.message || 'Something went wrong.');

        } finally {
            dispatch({ type: 'finish' });
        }


    };

    const onDelete = async (id) => {


        dispatch({ type: 'start' });
        try {
            await PageServices.delete(id)


            dispatch({ type: 'delete', id });

        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
            message.error(e?.message || 'Something went wrong.');

        } finally {

            dispatch({ type: 'finish' });
        }
    };


    const onClose = (e) => {
        e.preventDefault()
        dispatch({ type: 'close' });
    }

    const onChange = (e) => {
        if (!state.loading)
            setSearchQuery(e.target.value)
    }

    return <>
        <Card  title={<>{state.page ? state.label : <>Pages: <Input onChange={onChange} style={{maxWidth: 300, width: '100%', marginLeft: 10}} type="search" placeholder="search..."/></>} </>}
            extra={state.page ? <Button
                type="dashed"
                onClick={onClose}> Back </Button> :
                state.total > 0 && <Tooltip title="Add New Page"><Button
                    type="text"
                    onClick={() => onEdit({ ...initialPage })}
                    icon={<PlusOutlined />}> </Button></Tooltip>}
            headStyle={{ padding: 10 }}>

            {state.error && <Alert message={state.error} style={{ margin: '10px 0' }} type="error" showIcon closable />}

            {
                state.page ?
                    <AddPage page={state.page} onSubmit={onSubmit} /> :

                    state.total == 0 ? <Space size={20}>
                        <Title level={3}> Get started with your first page: </Title>
                        <Tooltip title="Add New"><Button
                            type="primary"
                            onClick={() => onEdit({ ...initialPage })}
                            icon={<PlusOutlined />}> </Button></Tooltip>
                    </Space> :
                        <PageList
                            setting={setting}
                            setPage={setPage}
                            total={state.total}
                            pages={state.pages}
                            page={page}
                            onClone={onClone}
                            onDelete={onDelete}
                            onEdit={onEdit}
                        />}
        </Card>

        {state.loading && <div style={{
            position: 'fixed',
            width: '100%',
            height: '100%',
            backgroundColor: '#2fc1ff',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1
        }}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >

        </div>}
        <Spin tip="Loading" size="small" spinning={state.loading}
            style={{
                position: 'fixed',
                top: '50%',
                left: '50%',

                transform: 'translate(-50%, -50%)'
            }}
        >
        </Spin>
    </>

};

