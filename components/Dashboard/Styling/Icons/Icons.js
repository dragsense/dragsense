import IconsList from './IconsList';
import AddIcons from './Add';
import { Button, Spin, Divider, message, Input } from 'antd';
import ThemeServices from "@/lib/services/theme";
import { useEffect, useReducer, useCallback, useState } from "react";
import { debounce } from '@/lib/utils/utils';
import { UploadOutlined } from '@ant-design/icons';
import { IconsIFrame } from "@/components/Iframe/setting";

const initial = {
    icons: [],
    single: null,
    total: 0,
    loading: false
}

const initialIcon = {
    _uid: -1,
    name: '',
    classes: '',
    svg: '',
}


const LIMIT = 25;

const reducer = (state, action) => {


    const updateSingle = () => {
        let index = state.icons.findIndex(single => single._uid === action.single?._uid);
        if (index !== -1) {
            state.icons[index] = action.single;

        }
    }

    const deleteSingle = () => {
        let index = state.icons.findIndex(single => single._uid === action._uid);
        if (index !== -1) {
            state.icons.splice(index, 1);
        }
    }

    switch (action.type) {
        case "start":
            return { ...state, loading: true }
        case "load":
            return { ...state, icons: [...state.icons, ...action.data], total: action.total }
        case "searchLoad":
            return { ...state, icons: action.data, total: action.total }
        case "add":
            return { ...state, icons: [...state.icons, action.single], total: action.total + 1 }
        case "edit":
            return { ...state, single: action.data }
        case "close":
            return { ...state, single: null }
        case "update":
            updateSingle();
            return { ...state, icons: [...state.icons], total: state.total + 1 }
        case "delete":
            deleteSingle();
            return { ...state, icons: [...state.icons], total: state.total - 1 }
        case "finish":
            return { ...state, loading: false }
        default:
            return state;
    }
};



export default function Icons({ editor, onSelect }) {


    const [searchQuery, setSearchQuery] = useState('');

    const [state, dispatch] = useReducer(reducer, initial);
    const [page, setPage] = useState(1);

    const load = async () => {
        try {

            dispatch({ type: 'start' });


            const res = await ThemeServices.getIcons(page, LIMIT);

            if (res.icons) {
                const data = Array.isArray(res.icons.data) ? res.icons.data : [];
                dispatch({ type: 'load', data, total: res.icons.total || 0 });
            }


        } catch (e) {
            message.error(e?.message || 'Something went wrong.');
        } finally {

            dispatch({ type: 'finish' });

        }
    }


    useEffect(() => {

        if (state.total >= 0) {
            state.icons = [];
        }


        if (!searchQuery) {
            state.icons = []
            load();
        }
        else
            searchIcons();

    }, [page, searchQuery]);



    const searchIcons = async () => {
        try {

            dispatch({ type: 'start' });
            const res = await ThemeServices.searchIcons(searchQuery);

            if (res.icons) {
                const data = Array.isArray(res.icons.data) ? res.icons.data : [];
                dispatch({ type: 'searchLoad', data, total: res.icons.total || 0 });
            }

        } catch (e) {
            message.error(e?.message || 'Something went wrong.');
        } finally {
            dispatch({ type: 'finish' });
        }
    };



    const onAdd = () => {
        dispatch({ type: 'edit', data: { ...initialIcon } });

    };

    const onEdit = (single) => {
        dispatch({ type: 'edit', data: single });

    };

    const onSubmit = async (states) => {

        dispatch({ type: 'start' });

        let status = false;

        try {

            const single = state.single;

            let res;
            if (single._uid !== -1)
                res = await ThemeServices.updateIcon(single._uid, states);
            else
                res = await ThemeServices.addIcon(states);


            dispatch({ type: single._uid !== -1 ? 'update' : 'add', single: res.icon });

            status = true;
            dispatch({ type: 'close' });

            message.success('Data submitted!');

  
        } catch (e) {

            message.error(e?.message || 'Something went wrong.');

        } finally {
            dispatch({ type: 'finish' });
            return status;
        }


    };

    const onDelete = async (_uid) => {


        dispatch({ type: 'start' });
        try {
            await ThemeServices.deleteIcon(_uid)

            dispatch({ type: 'delete', _uid });

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

        <Button icon={<UploadOutlined size="5rem" />} onClick={onAdd}></Button>
        <Divider />

        <Input
            type="text"
            placeholder="Search icons..."
            value={searchQuery}
            onChange={onChange}
        />
        <Divider />

        <div style={{ minHeight: '100vh' }}>
            <Spin tip="Loading" size="small" spinning={state.loading}>

                <IconsList
                    editor={editor}
                    setPage={setPage}
                    icons={state.icons}
                    onDelete={onDelete}
                    onSelect={onSelect}
                    onEdit={onEdit}

                />
            </Spin>
        </div>
        <Divider />


        {state.total > (page * LIMIT) && <Button disabled={state.loading} loading={state.loading} onClick={(e) => {
            e.preventDefault();
            setPage(page + 1);
        }}> Load More </Button>}

        <AddIcons
            onSubmit={onSubmit}
            icon={state.single}
        />




    </div>

};

