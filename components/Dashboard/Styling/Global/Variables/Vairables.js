
import { Card, message, Typography, Alert, Button, Tooltip, Space, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { useEffect, useReducer, useState } from "react";
const { Title } = Typography;

import VariableList from "./VariableList";
import AddVariable from './Add';
import ThemeServices from '@/lib/services/theme';

const initial = {
    variables: [],
    variable: null,
    error: '',

    loading: false
}

const initialVariable = {
    _uid: -1,
    name: '',
    variable: null,
}

const reducer = (state, action) => {


    const updateVariable = () => {
        let index = state.variables.findIndex(variable => variable._uid === action.variable?._uid);
        if (index !== -1) {
            state.variables[index] = action.variable;

        }
    }

    const deleteVariable = () => {
        let index = state.variables.findIndex(variable => variable._uid === action._uid);
        if (index !== -1) {
            state.variables.splice(index, 1);
        }
    }



    switch (action.type) {
        case "start":
            return { ...state, loading: true }
        case "load":
            return {
                ...state, variables: action.data, total: action.total,
                error: ''
            }
        case "add":
            return {
                ...state, variables: [...state.variables, action.variable],
                variable: null,
                total: state.total + 1,
                error: ''
            }
        case "edit":
            return {
                ...state, variable: action.data,
                label: `${action.data._id !== -1 ? 'Edit' : 'New'} Variable:`,

                error: ''
            }
        case "close":
            return { ...state, variable: null }
        case "update":
            updateVariable();
            return {
                ...state, variables: [...state.variables],
                error: ''
            }
        case "delete":
            deleteVariable();
            return {
                ...state, variables: [...state.variables],
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

export default function Variables({ variable, setVariable }) {

    const [state, dispatch] = useReducer(reducer, initial);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');



    const load = async () => {
        try {

            dispatch({ type: 'start' });
            const res = await ThemeServices.getVariables(page, 25);

            if (res.variables) {
                const data = Array.isArray(res.variables.data) ? res.variables.data : [];
                dispatch({ type: 'load', data, total: res.variables.total || 0 });
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

            const res = await ThemeServices.searchVariables(searchQuery);

       
         
            if (res.variables) {
                const data = Array.isArray(res.variables.data) ? res.variables.data : [];
                dispatch({ type: 'load', data, total: res.variables.total || 0 });
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





    const onEdit = (variable) => {
        dispatch({ type: 'edit', data: variable });

    };

    const onSelect = (variable) => {
        setVariable(variable);

    };



    const onSubmit = async (states) => {


        dispatch({ type: 'start' });

        let status = false;

        try {

            const variable = state.variable;

            if (variable._uid !== -1) {
                const res = await ThemeServices.updateVariable(variable._uid, {...states, _uid: undefined});
                dispatch({ type: 'update', variable: res.variable });
            }
            else {
                const res = await ThemeServices.addVariable(states);
                dispatch({ type: 'add', variable: res.variable });
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

            await ThemeServices.deleteVariable(_uid);


            dispatch({ type: 'delete', _uid });

        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
            message.success('Data submitted!');

        } finally {

            dispatch({ type: 'finish' });
        }
    };

    const onChange = (e) => {
        if (!state.loading)
            setSearchQuery(e.target.value)
    }

    return <>
        <Card loading={state.loading} title={<>{state.variable ? state.label : `Variables:`} <Input onChange={onChange} style={{maxWidth: 300, width: '100%', marginLeft: 10}} type="search" placeholder="search..."/></>}
            extra={state.variables?.length > 0 && <Tooltip title="Add New Variable"><Button
                    type="text"
                    onClick={(e) => {
                        e.preventDefault();
                        onEdit({ ...initialVariable });
                    }}
                    icon={<PlusOutlined />}> </Button></Tooltip>}
            headStyle={{ padding: 18 }}
            bodyStyle={{ padding: 24 }}>
            {state.error && <Alert message={state.error} style={{ margin: '10px 0' }} type="error" showIcon closable />}


            {state.variables <= 0 ? <Space variable={20}>
                <Title level={4}>  Add New Variable: </Title>
                <Tooltip title="Add New"><Button
                    type="primary"
                    onClick={(e) => {
                        e.preventDefault();
                        onEdit({ ...initialVariable });
                    }}
                    icon={<PlusOutlined />}> </Button></Tooltip>
            </Space> :
                <VariableList
                    selectedVariable={variable}
                    variables={state.variables}
                    total={state.total}
                    page={page}
                    setPage={setPage}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onSelect={onSelect}

                />
            }
        </Card>


        <AddVariable
            onSubmit={onSubmit}
            variable={state.variable}
        />


    </>

};

