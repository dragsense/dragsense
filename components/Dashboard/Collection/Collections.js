import CollectionList from "./CollectionList";
import AddCollection from './Add';
import { Card, Spin, Typography, Button, Tooltip, Space, Alert, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CollectionServices from "@/lib/services/collections";
import { useEffect, useReducer, useState } from "react";
import { DocumentComponent } from "../Document";
const { Title } = Typography;

const initial = {
    collections: [],
    collection: null,
    total: 0,
    loading: false,
    error: '',
}


const initialCollection = {
    _id: -1,
    states: {},
    name: '', slug: '', setting: {
        title: '',
        desc: '',
        content: '',
        status: 'DRAFT'
    }, layout: '',
    scripts: {
        head: '',
        footer: '',
    },
    relationships: [],

}


const reducer = (state, action) => {


    const updateCollection = () => {
        let index = state.collections.findIndex(collection => collection._id === action.collection?._id);
        if (index !== -1) {
            state.collections[index] = action.collection;

        }
    }

    const deleteCollection = () => {
        let index = state.collections.findIndex(collection => collection._id === action.id);
        if (index !== -1) {
            state.collections.splice(index, 1);
        }
    }



    switch (action.type) {
        case "start":
            return { ...state, loading: true }
        case "load":
            return { ...state, collections: action.data, total: action.total }
        case "edit":
            return {
                ...state, collection: action.data,
                label: `${action.data._id !== -1 ? 'Edit' : 'New'} Collection:`,
                error: ''
            }
        case "close":
            return { ...state, collection: null, error: '' }
        case "add":
            return {
                ...state, collections: [...state.collections, action.collection], total: state.total + 1,
                collection: null,
                error: ''
            }
        case "update":
            updateCollection();
            return {
                ...state, collections: [...state.collections], total: state.total + 1,
                collection: action.collection,
                error: ''
            }
        case "delete":
            deleteCollection();
            return {
                ...state, collections: [...state.collections], total: state.total - 1,
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

import ContentEditor from "./Content/ContentEditor";

export default function Collections() {

    const [state, dispatch] = useReducer(reducer, initial);
    const [page, setPage] = useState(1);
    const [collection, setCollection] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');


    const load = async () => {

        try {

            dispatch({ type: 'start' });


            const res = await CollectionServices.getAll(page, 10);

            if (res.collections) {
                const data = Array.isArray(res.collections.results) ? res.collections.results : [];
                dispatch({ type: 'load', data, total: res.collections.totalResults });
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

            const res = await CollectionServices.search(searchQuery);

            if (res.collections) {
                const data = Array.isArray(res.collections.results) ? res.collections.results : [];
                dispatch({ type: 'load', data, total: res.collections.totalResults });
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

    const onEdit = (collection) => {
        dispatch({ type: 'edit', data: collection });
    };

    const onSubmit = async (states) => {

        dispatch({ type: 'start' });

        const collection = state.collection;


        try {

            states.populatedLayout = undefined;
            states.populatedRelationships = undefined;
            states.populatedImage = undefined;

            const res = await CollectionServices.createOrUpdate(collection?._id, states)

            dispatch({ type: collection?._id !== -1 ? 'update' : 'add', collection: res.collection });

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
            const res = await CollectionServices.clone(_id)

            dispatch({ type: 'add', collection: res.collection });

        } catch (e) {

            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

        } finally {
            dispatch({ type: 'finish' });
        }


    };

    const onDelete = async (id) => {


        dispatch({ type: 'start' });
        try {
            await CollectionServices.delete(id)

            dispatch({ type: 'delete', id });

        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

        } finally {

            dispatch({ type: 'finish' });
        }
    };

    const onEditDocuments = (collection) => {
        setCollection({ ...collection });
    }


    const onClose = (e) => {
        e.preventDefault();

        setCollection(null);
        dispatch({ type: 'close' });
    }

    const onChange = (e) => {
        if (!state.loading)
            setSearchQuery(e.target.value)
    }

    return <>
        <Card  title={<>{state.collection ? state.label : <>Collections: <Input onChange={onChange} style={{maxWidth: 300, width: '100%', marginLeft: 10}} type="search" placeholder="search..."/></>}</>}
            extra={state.collection ? <Button
                type="dashed"
                onClick={onClose}> Back </Button> : state.total > 0 && <Tooltip 
                title="Add New Collection"><Button
                    type="text"
                    onClick={() => onEdit({ ...initialCollection })}
                    icon={<PlusOutlined />}> </Button></Tooltip>}
            headStyle={{ padding: 10 }}>

            {state.error && <Alert message={state.error} style={{ margin: '10px 0' }} type="error" showIcon closable />}

            {
                state.collection ?
                    <AddCollection collection={state.collection} onSubmit={onSubmit} /> :

                    state.total == 0 ? <Space size={20}>
                        <Title level={3}> Get started with your first Collection: </Title>
                        <Tooltip title="Add New"><Button
                            type="primary"
                            onClick={() => onEdit({ ...initialCollection })}
                            icon={<PlusOutlined />}> </Button></Tooltip>
                    </Space> :
                        <CollectionList
                            setCollection={setPage}
                            total={state.total}
                            collections={state.collections}
                            onEditDocuments={onEditDocuments}
                            page={page}
                            onClone={onClone}
                            onDelete={onDelete}
                            onEdit={onEdit}
                        />}
        </Card>

        <DocumentComponent collection={collection} form={collection?.isForm} />

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

