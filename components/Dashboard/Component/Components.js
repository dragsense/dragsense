import ComponentList from "./ComponentList";
import AddComponent from './Add';
import { Card, Spin, Button, Tooltip, Space, Typography, Alert, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ComponentServices from "@/lib/services/components";
import { useEffect, useReducer, useState } from "react";
const { Title } = Typography;


const STATUS = ['DRAFT', 'PUBLIC'];


const initial = {
    components: [],
    component: null,
    total: 0,
    loading: false
}


const initialComponent = {
    _id: -1,
    name: '', states: {}
}


const reducer = (state, action) => {


    const updateComponent = () => {
        let index = state.components.findIndex(component => component._id === action.component?._id);
        if (index !== -1) {
            state.components[index] = action.component;

        }
    }

    const deleteComponent = () => {
        let index = state.components.findIndex(component => component._id === action.id);
        if (index !== -1) {
            state.components.splice(index, 1);
        }
    }



    switch (action.type) {
        case "start":
            return { ...state, loading: true }
        case "load":
            return {
                ...state, components: action.data, total: action.total,
                error: ''
            }
        case "add":
            return {
                ...state, components: [...state.components, action.component], total: state.total + 1,
                component: null,
                error: ''
            }
        case "edit":
            return {
                ...state, component: action.data,
                label: `${action.data._id !== -1 ? 'Edit' : 'New'} Component:`,
                error: ''
            }
        case "close":
            return { ...state, component: null }
        case "update":

            updateComponent();
            return {
                ...state, components: [...state.components], total: state.total + 1,
                error: ''
            }
        case "delete":
            deleteComponent();
            return {
                ...state, components: [...state.components], total: state.total - 1,
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

export default function Components() {

    const [state, dispatch] = useReducer(reducer, initial);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const load = async () => {
        try {

            dispatch({ type: 'start' });


            const res = await ComponentServices.getAll(page, 10);


            if (res.components) {
                const data = Array.isArray(res.components.results) ? res.components.results : [];
                dispatch({ type: 'load', data, total: res.components.totalResults });
            }

        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
        } finally {

            dispatch({ type: 'finish' });

        }

        return () => {
            
        }

    }

    const search = async () => {
        try {

            dispatch({ type: 'start' });

            const res = await ComponentServices.search(searchQuery);

       
            if (res.components) {
                const data = Array.isArray(res.components.results) ? res.components.results : [];
                dispatch({ type: 'load', data, total: res.components.totalResults });
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




    const onEdit = (component) => {
        dispatch({ type: 'edit', data: component });

    };

    const onSubmit = async (states) => {

        dispatch({ type: 'start' });

        const component = state.component;


        try {

            states.component = undefined;
            states.collection = undefined;

            const res = await ComponentServices.createOrUpdate(component?._id, states)

            dispatch({ type: component?._id !== -1 ? 'update' : 'add', component: res.component });

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
            const res = await ComponentServices.clone(_id)

            dispatch({ type: 'add', component: res.component });

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
            await ComponentServices.delete(id)


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


        <Card title={<>{state.component ? state.label : <>Components: <Input onChange={onChange} style={{maxWidth: 300, width: '100%', marginLeft: 10}} type="search" placeholder="search..."/></>} </>}
            extra={state.component ? <Button
                type="dashed"
                onClick={onClose}> Back </Button> :
                state.total > 0 && <Tooltip title="Add New Component"><Button
                    type="text"
                    onClick={() => onEdit({ ...initialComponent })}
                    icon={<PlusOutlined />}> </Button></Tooltip>}
            headStyle={{ padding: 10 }}>

            {state.error && <Alert message={state.error} style={{ margin: '10px 0' }} type="error" showIcon closable />}


            {
                state.component ?
                    <AddComponent component={state.component} onClose={onClose} onSubmit={onSubmit} /> :

                    state.total == 0 ? <Space size={20}>
                        <Title level={3}> Get started with your first component: </Title>
                        <Tooltip title="Add New"><Button
                            type="primary"
                            onClick={() => onEdit({ ...initialComponent })}
                            icon={<PlusOutlined />}> </Button></Tooltip>
                    </Space> :
                        <ComponentList
                            setPage={setPage}
                            total={state.total}
                            components={state.components}
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
            opacity: 0.5
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

