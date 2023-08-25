import MediaList from './MediaList';
import AddMedia from './Add';
import { Button, Spin, Divider, message, Input } from 'antd';
import MediaServices from "@/lib/services/media";
import { useEffect, useReducer, useCallback, useState } from "react";
import UplaodComponent from './Upload';
import { debounce } from '@/lib/utils/utils';
const initial = {
    media: [],
    single: null,
    total: 0,
    loading: false
}

const LIMIT = 25;

const reducer = (state, action) => {


    const updateSingle = () => {
        let index = state.media.findIndex(single => single._id === action.single?._id);
        if (index !== -1) {
            state.media[index] = action.single;

        }
    }

    const deleteSingle = () => {
        let index = state.media.findIndex(single => single._id === action.id);
        if (index !== -1) {
            state.media.splice(index, 1);
        }
    }

    switch (action.type) {
        case "start":
            return { ...state, loading: true }
        case "load":
            return { ...state, media: [...state.media, ...action.data], total: action.total }
        case "searchLoad":
            return { ...state, media: action.data, total: action.total }
        case "add":
            return { ...state, media: [action.data, ...state.media], total: action.total + 1 }
        case "edit":
            return { ...state, single: action.data }
        case "close":
            return { ...state, single: null }
        case "update":
            updateSingle();
            return { ...state, media: [...state.media], total: state.total + 1 }
        case "delete":
            deleteSingle();
            return { ...state, media: [...state.media], total: state.total - 1 }
        case "finish":
            return { ...state, loading: false }
        default:
            return state;
    }
};



export default function Media({ type, srcs, onSelect }) {


    const [searchQuery, setSearchQuery] = useState('');

    const [state, dispatch] = useReducer(reducer, initial);
    const [page, setPage] = useState(1);

    const load = async () => {
        try {

            dispatch({ type: 'start' });


            const res = await MediaServices.getAll(type, page, LIMIT);


            if (res.media) {
                const data = Array.isArray(res.media.results) ? res.media.results : [];
                dispatch({ type: 'load', data, total: res.media.totalResults });
            }


        } catch (e) {
            message.error(e?.message || 'Something went wrong.');
        } finally {

            dispatch({ type: 'finish' });

        }
    }

    useEffect(() => {

        if (page <= 1)
            return;

        load();
    }, [page]);

    useEffect(() => {

        if (state.total >= 0) {
            state.media = [];
        }


        if (!searchQuery){
            state.media = []
            load();
        }
        else
            searchMedia();

    }, [type, searchQuery]);



    const searchMedia = async () => {
        try {

            dispatch({ type: 'start' });
            const res = await MediaServices.search(type, searchQuery);

            if (res.media) {
                const data = Array.isArray(res.media.results) ? res.media.results : [];
                dispatch({ type: 'searchLoad', data, total: res.media.totalResults });
            }

        } catch (e) {
            console.log(e?.message)
            message.error(e?.message || 'Something went wrong.');
        } finally {
            dispatch({ type: 'finish' });
        }
    };



    const onAdd = (single) => {
        dispatch({ type: 'add', data: single });

    };

    const onEdit = (single) => {
        dispatch({ type: 'edit', data: single });

    };

    const onSubmit = async (states) => {

        dispatch({ type: 'start' });

        let status = false;

        try {

            const single = state.single;

            const res = await MediaServices.update(single._id, states);

            dispatch({ type: 'update', single: res.media });

            status = true;
            dispatch({ type: 'close' });


        } catch (e) {

            message.error(e?.message || 'Something went wrong.');

        } finally {
            dispatch({ type: 'finish' });
            return status;
        }


    };

    const onDelete = async (id) => {


        dispatch({ type: 'start' });
        try {
            await MediaServices.delete(id)

            dispatch({ type: 'delete', id });

        } catch (e) {
            message.error(e?.message || 'Something went wrong.');

        } finally {

            dispatch({ type: 'finish' });
        }
    };

    const onChange = (e) => {
        if (!state.loading)
            setSearchQuery(e.target.value)
    }



    return <div style={{ textAlign: 'center' }}>

        <UplaodComponent type={type} onAdd={onAdd} />
        <Divider />

        <Input
            type="text"
            placeholder="Search media..."
            value={searchQuery}
            onChange={onChange}
        />
        <Divider />


        <Spin tip="Loading" size="small" spinning={state.loading}>


            <MediaList
                setPage={setPage}
                media={state.media}
                onDelete={onDelete}
                onSelect={onSelect}
                onEdit={onEdit}
                srcs={srcs}
                type={type}
            />
        </Spin>

        <Divider />


        {state.total > (page * LIMIT) && <Button disabled={state.loading} loading={state.loading} onClick={(e) => {
            e.preventDefault();
            setPage(page + 1);
        }}> Load More </Button>}

        <AddMedia
            onSubmit={onSubmit}
            media={state.single}
        />




    </div>

};

