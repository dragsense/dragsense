import LayoutList from "./LayoutList";
import AddLayout from './Add';
import { Card, Typography, Alert, Button, Tooltip, Space, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import LayoutServices from "@/lib/services/layouts";
import { useEffect, useReducer, useState } from "react";
const { Title } = Typography;




const initial = {
    layouts: [],
    layout: null,
    total: 0,
    error: '',
    loading: false
}


const initialLayout = {
    _id: -1,
    name: '',
    topComponent: false,
    bottomComponent: false,

    components: { top: null, bottom: null },
}


const reducer = (state, action) => {


    const updateLayout = () => {
        let index = state.layouts.findIndex(layout => layout._id === action.layout?._id);
        if (index !== -1) {
            state.layouts[index] = action.layout;

        }
    }

    const deleteLayout = () => {
        let index = state.layouts.findIndex(layout => layout._id === action.id);
        if (index !== -1) {
            state.layouts.splice(index, 1);
        }
    }



    switch (action.type) {
        case "start":
            return { ...state, loading: true }
        case "load":
            return {
                ...state, layouts: action.data, total: action.total,
                error: ''
            }
        case "add":
            return {
                ...state,
                layouts: [...state.layouts, action.layout],
                layout: null,
                total: state.total + 1,
                error: ''
            }
        case "edit":
            return {
                ...state, layout: action.data,
                label: `${action.data._id !== -1 ? 'Edit' : 'New'} Layout:`,
                error: ''

            }
        case "close":
            return { ...state, layout: null }
        case "update":

            updateLayout();
            return {
                ...state,
                layouts: [...state.layouts],
                layout: action.layout,
                error: ''
            }
        case "delete":
            deleteLayout();
            return {
                ...state,
                layouts: [...state.layouts],
                total: state.total - 1,
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

export default function Layouts({ layout, setLayout }) {

    const [state, dispatch] = useReducer(reducer, initial);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const load = async () => {
        try {

            dispatch({ type: 'start' });

            const res = await LayoutServices.getAll(10,page);

            if (res.layouts) {
                const data = Array.isArray(res.layouts.results) ? res.layouts.results : [];
                dispatch({ type: 'load', data, total: res.layouts.totalResults });
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

            const res = await LayoutServices.search(searchQuery);

            if (res.layouts) {
                const data = Array.isArray(res.layouts.results) ? res.layouts.results : [];
                dispatch({ type: 'load', data, total: res.layouts.totalResults });
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

    const onEdit = (layout) => {
        dispatch({ type: 'edit', data: layout });

    };

    const onSubmit = async (states) => {

        dispatch({ type: 'start' });

        const layout = state.layout;

        try {


            states.populatedComponents = undefined;
            delete states._id;

            const res = await LayoutServices.createOrUpdate(layout?._id, states)


            dispatch({ type: layout?._id !== -1 ? 'update' : 'add', layout: res.layout });
            message.success('Data submitted!');

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
            await LayoutServices.delete(id)


            dispatch({ type: 'delete', id });

        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
            message.success('Data submitted!');

        } finally {

            dispatch({ type: 'finish' });
        }
    };


    const onClose = (e) => {
        e.preventDefault()
        dispatch({ type: 'close' });
    }


    const onSelect = (layout) => {

        setLayout(layout);
    }

    const onChange = (e) => {
        if (!state.loading)
            setSearchQuery(e.target.value)
    }


    return <>
        <Card loading={state.loading} title={<>{state.layout ? state.label : `Layouts:`} <Input onChange={onChange} style={{maxWidth: 300, width: '100%', marginLeft: 10}} type="search" placeholder="search..."/></>}
            extra={state.layout ? <Button
                type="dashed"
                onClick={onClose}> Back </Button> : state.total > 0 && <Tooltip title="Add New Layout"><Button
                    type="text"
                    onClick={() => onEdit({ ...initialLayout })}
                    icon={<PlusOutlined />}> </Button></Tooltip>}
            headStyle={{ padding: 10 }}>

            {state.error && <Alert message={state.error} style={{ margin: '10px 0' }} type="error" showIcon closable />}



            {
                state.layout ?
                    <AddLayout layout={state.layout} onClose={onClose} onSelect={onSelect} onSubmit={onSubmit} /> :

                    state.total == 0 ? <Space size={20}>
                        <Title level={4}>  Get started with your first layout: </Title>
                        <Tooltip title="Add New"><Button
                            type="primary"
                            onClick={() => onEdit({ ...initialLayout })}
                            icon={<PlusOutlined />}> </Button></Tooltip>
                    </Space> :
                        <LayoutList
                            setPage={setPage}
                            page={page}
                            selectedLayout={layout}
                            total={state.total}
                            layouts={state.layouts}
                            onSelect={onSelect}
                            onDelete={onDelete}
                            onEdit={onEdit}
                        />}
        </Card>


    </>

};

