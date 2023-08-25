import FormList from "./FormList";
import AddForm from './Add';
import { Card, Spin, Button, Tooltip, Space, Typography, Alert, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import FormServices from "@/lib/services/forms";
import { useEffect, useReducer, useState } from "react";
const { Title } = Typography;
import { DocumentComponent } from "../Document";
import ContentEditor from "./Content/ContentEditor";


const initial = {
    forms: [],
    form: null,
    total: 0,
    loading: false
}


const initialForm = {
    _id: -1,
    slug: '',
    record: false,
    recordOnly: false,
    name: '',
    emailbody: { plain: "", head: '', body: '', footer: '', html: false },
    states: {},
    setting: {
        to: '',
        from: '',
        subject: '',
        cc: '',
        bcc: '',
        replyTo: '',
        redirect: '',
        sendCopy: false,
        successMessage: '',
        errorMessage: '',
    },


}


const reducer = (state, action) => {


    const updateForm = () => {
        let index = state.forms.findIndex(form => form._id === action.form?._id);
        if (index !== -1) {
            state.forms[index] = action.form;

        }
    }

    const deleteForm = () => {
        let index = state.forms.findIndex(form => form._id === action.id);
        if (index !== -1) {
            state.forms.splice(index, 1);
        }
    }



    switch (action.type) {
        case "start":
            return { ...state, loading: true }
        case "load":
            return {
                ...state, forms: action.data, total: action.total,
                error: ''
            }
        case "edit":

            return {
                ...state, form: action.data,
                label: `${action.data._id !== -1 ? 'Edit' : 'New'} Form:`,
                error: ''
            }
        case "close":
            return { ...state, form: null }
        case "add":
            return {
                ...state, forms: [...state.forms, action.form], total: state.total + 1, form: null,
                error: ''
            }
        case "update":
            updateForm();
            return {
                ...state, forms: [...state.forms], total: state.total + 1,
                form: action.form,
                error: ''
            }
        case "delete":
            deleteForm();
            return {
                ...state, forms: [...state.forms], total: state.total - 1,
                error: action.error
            }
        case "error":
            return { ...state, error: action.error }
        case "finish":
            return { ...state, loading: false }
        default:
            return state;
    }
};

export default function Forms() {

    const [state, dispatch] = useReducer(reducer, initial);
    const [page, setPage] = useState(1);
    const [form, setForm] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const load = async () => {
        try {

            dispatch({ type: 'start' });


            const res = await FormServices.getAll(page, 10);

            if (res.forms) {
                const data = Array.isArray(res.forms.results) ? res.forms.results : [];
                dispatch({ type: 'load', data, total: res.forms.totalResults });
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

            const res = await FormServices.search(searchQuery);


            if (res.forms) {
                const data = Array.isArray(res.forms.results) ? res.forms.results : [];
                dispatch({ type: 'load', data, total: res.forms.totalResults });
            }




        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
        } finally {

            dispatch({ type: 'finish' });

        }
    }

    useEffect(() => {

        if (!searchQuery) {
            load();
        }
        else
            search();

    }, [page, searchQuery]);



    const onEdit = (form) => {

        dispatch({ type: 'edit', data: form });
    };

    const onSubmit = async (states) => {

        dispatch({ type: 'start' });

        const form = state.form;


        try {

            const res = await FormServices.createOrUpdate(form?._id, states)

            dispatch({ type: form?._id !== -1 ? 'update' : 'add', form: res.form });

        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

        } finally {
            dispatch({ type: 'finish' });
        }


    };

    const onClone = async (_id) => {

        dispatch({ type: 'start' });

        const page = state.page;

        try {
            const res = await FormServices.clone(_id)

            dispatch({ type: 'add', form: res.form });

        } catch (e) {

            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

        } finally {
            dispatch({ type: 'finish' });
        }


    };

    const onDelete = async (id) => {


        dispatch({ type: 'start' });
        try {
            const res = await FormServices.delete(id)


            dispatch({ type: 'delete', id });

        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

        } finally {

            dispatch({ type: 'finish' });
        }
    };

    const onEditDocuments = (form) => {
        setForm({ ...form });
    }


    const onClose = (e) => {
        e.preventDefault();

        setForm(null);
        dispatch({ type: 'close' });
    }


    const onChange = (e) => {
        if (!state.loading)
            setSearchQuery(e.target.value)
    }


    return <div>

        <Card  title={state.form ? state.label : <>Forms: <Input onChange={onChange} style={{ maxWidth: 300, width: '100%', marginLeft: 10 }} type="search" placeholder="search..." /></>}
            extra={state.form ? <Button
                type="dashed"
                onClick={onClose}> Back </Button> : state.total > 0 && <Tooltip title="Add New Form"><Button
                    type="text"
                    onClick={() => onEdit({ ...initialForm })}
                    icon={<PlusOutlined />}> </Button></Tooltip>}
            headStyle={{ padding: 10 }}>

            {state.error && <Alert message={state.error} style={{ margin: '10px 0' }} type="error" showIcon closable />}
            {
                state.form ?
                    <AddForm _form={state.form} onSubmit={onSubmit} /> :

                    state.total == 0 ? <Space size={20}>
                        <Title level={3}> Get started with your first Form: </Title>
                        <Tooltip title="Add New"><Button
                            type="primary"
                            onClick={() => onEdit({ ...initialForm })}
                            icon={<PlusOutlined />}> </Button></Tooltip>
                    </Space> :
                        <FormList
                            setPage={setPage}
                            total={state.total}
                            forms={state.forms}
                            onEditDocuments={onEditDocuments}
                            page={page}
                            onClone={onClone}
                            onDelete={onDelete}
                            onEdit={onEdit}
                        />}
        </Card>

        <DocumentComponent collection={form} form={true} />


        {state.loading && <div style={{
            position: 'fixed',
            width: '100%',
            height: '100%',
            backgroundColor: '#fff',
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

    </div>

};

