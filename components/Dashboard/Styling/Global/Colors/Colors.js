
import { Card, message, Typography, Alert, Button, Tooltip, Space, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { useEffect, useReducer, useState } from "react";
const { Title } = Typography;

import ColorList from "./ColorList";
import AddColor from './Add';
import ThemeServices from '@/lib/services/theme';

const initial = {
    colors: [],
    color: null,
    error: '',

    loading: false
}

const initialColor = {
    _uid: -1,
    name: '',
    color:  '#000',
}

const reducer = (state, action) => {


    const updateColor = () => {
        let index = state.colors.findIndex(color => color._uid === action.color?._uid);
        if (index !== -1) {
            state.colors[index] = action.color;

        }
    }

    const deleteColor = () => {
        let index = state.colors.findIndex(color => color._uid === action._uid);
        if (index !== -1) {
            state.colors.splice(index, 1);
        }
    }



    switch (action.type) {
        case "start":
            return { ...state, loading: true }
        case "load":
            return {
                ...state, colors: action.data, total: action.total,
                error: ''
            }
        case "add":
            return {
                ...state, colors: [...state.colors, action.color],
                color: null,
                total: state.total + 1,
                error: ''
            }
        case "edit":
            return {
                ...state, color: action.data,
                label: `${action.data._id !== -1 ? 'Edit' : 'New'} Color:`,

                error: ''
            }
        case "close":
            return { ...state, color: null }
        case "update":
            updateColor();
            return {
                ...state, colors: [...state.colors],
                error: ''
            }
        case "delete":
            deleteColor();
            return {
                ...state, colors: [...state.colors],
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

export default function Colors({ color, setColor }) {

    const [state, dispatch] = useReducer(reducer, initial);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const load = async () => {
        try {

            dispatch({ type: 'start' });
            const res = await ThemeServices.getColors(page, 25);

            if (res.colors) {
                const data = Array.isArray(res.colors.data) ? res.colors.data : [];
                dispatch({ type: 'load', data, total: res.colors.total || 0 });
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

            const res = await ThemeServices.searchColors(searchQuery);

       
            if (res.colors) {
                const data = Array.isArray(res.colors.data) ? res.colors.data : [];
                dispatch({ type: 'load', data, total: res.colors.total || 0 });
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



    const onEdit = (color) => {
        dispatch({ type: 'edit', data: color });

    };

    const onSelect = (color) => {
        setColor(color);

    };



    const onSubmit = async (states) => {


        dispatch({ type: 'start' });

        let status = false;

        try {

            const color = state.color;

            if (color._uid !== -1) {
                const res = await ThemeServices.updateColor(color._uid,{ ...states, _uid: undefined });
                dispatch({ type: 'update', color: res.color });
            }
            else {
                const res = await ThemeServices.addColor(states);
                dispatch({ type: 'add', color: res.color });
            }



            status = true;
            dispatch({ type: 'close' });

            message.success('Data submitted!');

        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
            message.error(e?.message || 'Something went wrong.');

        } finally {
            dispatch({ type: 'finish' });
            return status;

        }


    };

    const onDelete = async (_uid) => {


        dispatch({ type: 'start' });
        try {

            await ThemeServices.deleteColor(_uid);


            dispatch({ type: 'delete', _uid });

        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
            message.error(e?.message || 'Something went wrong.');

        } finally {

            dispatch({ type: 'finish' });
        }
    };

    const onChange = (e) => {
        if (!state.loading)
            setSearchQuery(e.target.value)
    }


    return <>
        <Card loading={state.loading} title={<>{state.color ? state.label : `Colors:`} <Input onChange={onChange} style={{maxWidth: 300, width: '100%', marginLeft: 10}} type="search" placeholder="search..."/></>}
            extra={state.colors?.length > 0 && <Tooltip title="Add New Color"><Button
                type="text"
                onClick={(e) => {
                    e.preventDefault();
                    onEdit({ ...initialColor });
                }}
                icon={<PlusOutlined />}> </Button></Tooltip>}
            headStyle={{ padding: 18 }}
            bodyStyle={{ padding: 24 }}>
            {state.error && <Alert message={state.error} style={{ margin: '10px 0' }} type="error" showIcon closable />}


            {state.colors <= 0 ? <Space size={20}>
                <Title level={4}>  Add New Color: </Title>
                <Tooltip title="Add New"><Button
                    type="primary"
                    onClick={(e) => {
                        e.preventDefault();
                        onEdit({ ...initialColor });
                    }}
                    icon={<PlusOutlined />}> </Button></Tooltip>
            </Space> :
                <ColorList
                    selectedColor={color}
                    colors={state.colors}
                    total={state.total}
                    page={page}
                    onDelete={onDelete}
                    setPage={setPage}
                    onEdit={onEdit}
                    onSelect={onSelect}

                />
            }
        </Card>


        <AddColor
            onSubmit={onSubmit}
            color={state.color}
        />


    </>

};

