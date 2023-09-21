import DocumnetList from "./DocumnetList";
import AddDocumnet from './Add';
import { Card, Spin, Button, Tooltip, Space, Typography, Alert, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import DocumnetServices from "@/lib/services/documents";
import CollectionServices from "@/lib/services/collections";
import FormServices from "@/lib/services/forms";

import { useEffect, useReducer, useState } from "react";
const { Title } = Typography;



const initial = {
    documents: [],
    document: null,
    total: 0,
    loading: false
}


const initialDocumnet = {
    _id: -1,
    name: 'Doc',
    states: {},
    slug: 'doc', setting: {
        title: '',
        desc: '',
        content: '',
        status: 'DRAFT'
    },
    relationships: {}
}


const reducer = (state, action) => {


    const updateDocumnet = () => {
        let index = state.documents.findIndex(document => document._id === action.document?._id);
        if (index !== -1) {
            state.documents[index] = action.document;

        }
    }

    const deleteDocumnet = () => {
        let index = state.documents.findIndex(document => document._id === action.id);
        if (index !== -1) {
            state.documents.splice(index, 1);
        }
    }



    switch (action.type) {
        case "start":
            return { ...state, loading: true }
        case "load":
            return {
                ...state, documents: action.data, total: action.total,
                error: ''
            }
        case "add":
            return {
                ...state, documents: [...state.documents, action.document], total: state.total + 1,
                document: null,
            }
        case "edit":
            return {
                ...state, document: action.data,
                label: `${action.data._id !== -1 ? 'Edit' : 'New'} Document:`,
                error: ''
            }
        case "close":
            return { ...state, document: null }
        case "update":
            updateDocumnet();
            return {
                ...state, documents: [...state.documents], total: state.total + 1,
                document: action.document,
                error: ''
            }
        case "delete":
            deleteDocumnet();
            return {
                ...state, documents: [...state.documents], total: state.total - 1,
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

export default function Documents({ collection, form }) {

    const [state, dispatch] = useReducer(reducer, initial);
    const [page, setPage] = useState(1);
    const [collectionDoc, setCollection] = useState({});

    const [searchQuery, setSearchQuery] = useState('');

    const load = async () => {
        dispatch({ type: 'start' });


        try {

            const collectionRes = form ? await FormServices.get(collection._id) : await CollectionServices.get(collection._id);
            if (!collectionRes.collection && !collectionRes.form)
                throw new Error(`${form ? 'Form' : 'Collection'} Not Found.`)


            const res = await DocumnetServices.getAll(collection._id, page, 10, form);

            if (res.documents) {
                const data = Array.isArray(res.documents.results) ? res.documents.results : [];
                dispatch({ type: 'load', data, total: res.documents.totalResults });
            }

          

            form ? setCollection(collectionRes.form) : setCollection(collectionRes.collection);

        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
        } finally {

            dispatch({ type: 'finish' });

        }
    }


    const search = async () => {
        try {

            dispatch({ type: 'start' });

            const res = await DocumnetServices.search(collection._id, searchQuery, form);


            if (res.documents) {
                const data = Array.isArray(res.documents.results) ? res.documents.results : [];
                dispatch({ type: 'load', data, total: res.documents.totalResults });
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

    }, [page, searchQuery, collection]);

    const onEdit = (document) => {
        dispatch({ type: 'edit', data: document });

    };

    const onSubmit = async (states) => {

        dispatch({ type: 'start' });

        const document = state.document;


        try {


            states.populatedRelationships = undefined;
            states.populatedImage = undefined;

            const res = await DocumnetServices.createOrUpdate(collection._id, document?._id, states, form)

            dispatch({ type: document?._id !== -1 ? 'update' : 'add', document: res.document });

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
            const res = await DocumnetServices.clone(collection._id, _id, form)

            dispatch({ type: 'add', document: res.document });

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
            await DocumnetServices.delete(collection._id, id, form)


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
        <Card title={state.document ? state.label : <> Documnets: <Input onChange={onChange} style={{ maxWidth: 300, width: '100%', marginLeft: 10 }} type="search" placeholder="search..." /></>}
            extra={state.document ? <Button
                type="dashed"
                onClick={onClose}> Back </Button> : state.total > 0 && <Tooltip title="Add New Documnet"><Button
                    type="text"
                    onClick={() => onEdit({
                        ...initialDocumnet,
                        name: 'Doc ' + (state.total + 1),
                        slug: "doc-" + (state.total + 1),
                        states: collection.states
                    })}
                    icon={<PlusOutlined />}> </Button></Tooltip>}
            headStyle={{ padding: 10 }}>

            {state.error && <Alert message={state.error} style={{ margin: '10px 0' }} type="error" showIcon closable />}

            {state.document ?
                <AddDocumnet collection={collectionDoc}
                    _form={form}
                    document={state.document} onSubmit={onSubmit} /> :

                state.total == 0 ? <Space size={20}>
                    <Title level={3}> Get started with your first Document: </Title>
                    <Tooltip title="Add New"><Button
                        type="primary"
                        onClick={() => onEdit({
                            ...initialDocumnet,
                            name: 'Doc ' + (state.total + 1),
                            slug: "doc-" + (state.total + 1),
                            states: collection.states
                        })}
                        icon={<PlusOutlined />}> </Button></Tooltip>
                </Space> :
                    <DocumnetList
                        setPage={setPage}
                        total={state.total}
                        
                        documents={state.documents}
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

    </>

};

