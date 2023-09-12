
import { Card, message, Typography, Alert, Button, Tooltip, Space, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { useEffect, useReducer, useState } from "react";
const { Title } = Typography;

import FontList from "./FontList";
import AddFont from './Add';
import ThemeServices from '@/lib/services/theme';

const initial = {
    fonts: [],
    error: '',

    font: null,
    loading: false
}

const initialFont = {
    _uid: -1,
    name: '',
    fontFamily: '',
}

const reducer = (state, action) => {

    const updateFont = () => {
        let index = state.fonts.findIndex(font => font._uid === action.font?._uid);
        if (index !== -1) {
            state.fonts[index] = action.font;

        }
    }

    const deleteFont = () => {
        let index = state.fonts.findIndex(font => font._uid === action._uid);
        if (index !== -1) {
            state.fonts.splice(index, 1);
        }
    }



    switch (action.type) {
        case "start":
            return { ...state, loading: true }
        case "load":
            return {
                ...state, fonts: action.data,
                error: ''
            }
        case "add":
            return {
                ...state, fonts: [...state.fonts, action.font],
                font: null,
                error: ''
            }
        case "edit":
            return {
                ...state, font: action.data,
                label: `${action.data._id !== -1 ? 'Edit' : 'New'} Font:`,

                error: ''
            }
        case "update":
            updateFont();
            return {
                ...state, fonts: [...state.fonts],
                font: action.font,

                error: ''
            }
        case "delete":
            deleteFont();
            return {
                ...state, fonts: [...state.fonts],
                font: null,
                error: ''
            }
        case "close":
            return { ...state, font: null }

        case "error":
            return { ...state, error: action.error }
        case "finish":
            return { ...state, loading: false }
        default:
            return state;
    }
};

export default function Fonts({ font, setFont, fonts, setFonts }) {

    const [state, dispatch] = useReducer(reducer, initial);
    const [searchQuery, setSearchQuery] = useState('');



    const onEdit = (font) => {
        dispatch({ type: 'edit', data: font });

    };

    const onSelect = (font) => {
        setFont(font);
    };


    const onSubmit = async (states) => {

        if (fonts.length >= 25) {
            dispatch({ type: 'error', error: "Font limit reached. You cannot add more fonts." });
            return;
        }



        dispatch({ type: 'start' });

        let status = false;

        try {

            const font = state.font;


            const iframe = document.querySelector("#ac-editor-iframe-doc")
            const iFramedocument = iframe.contentDocument;;
            let addedFont;


            if (font._uid !== -1) {
                const res = await ThemeServices.updateFont(font._uid, { ...states, _uid: undefined });

                let index = fonts.findIndex(font => font._uid === res.font?._uid);
                if (index !== -1) {
                    addedFont = res.font;
                    fonts[index] = res.font;
                }
                dispatch({ type: 'update', font: addedFont });
                setFonts([...fonts])

            }
            else {
                const res = await ThemeServices.addFont(states);
                addedFont = res.font;
                dispatch({ type: 'add', font: addedFont });

                setFonts([...fonts, res.font])

            }

            if (addedFont) {
                const { _uid, fontFamily, fontSrc, src, isGoogleFont } = addedFont;
                if (isGoogleFont && src) {

                    const id = 'google-font-' + _uid;

                    const existingLink = document.getElementById(id);

                    if (!existingLink) {
                        const linkElement = document.createElement('div');
                        linkElement.id = 'google-font-' + _uid;
                        linkElement.innerHTML = src;
                        iFramedocument.head.appendChild(linkElement);
                    } else {
                        existingLink.innerHTML = src;
                    }
                }
                else
                    if (Array.isArray(fontSrc)) {
                        for (const src of fontSrc) {
                            const fontFace = new FontFace(fontFamily, `url(${src.src}) format('${src.format}')`);
                            iFramedocument.fonts.add(fontFace);
                        }
                    }
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

            await ThemeServices.deleteFont(_uid);

            let index = fonts.findIndex(font => font._uid === _uid);

            if (index !== -1) {

                const { _uid, fontFamily, fontSrc, src, isGoogleFont } = fonts[index];

                const iframe = document.querySelector("#ac-editor-iframe-doc")
                const iFramedocument = iframe.contentDocument;;

                if (isGoogleFont && src) {
                    const id = 'google-font-' + _uid;

                    const existingLink = iFramedocument.getElementById(id);

                    if (existingLink) {
                        existingLink.remove();
                    }
                }
                else
                    if (Array.isArray(fontSrc)) {
                        for (const src of fontSrc) {
                            const fontFace = new FontFace(fontFamily, `url(${src.src}) format('${src.format}')`);
                            iFramedocument.fonts.delete(fontFace);
                        }
                    }


                fonts.splice(index, 1);
            }

            dispatch({ type: 'delete', _uid });

            setFonts([...fonts])

        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
            message.error(e?.message || 'Something went wrong.');

        } finally {

            dispatch({ type: 'finish' });
        }
    };

    const load = async () => {
        dispatch({ type: 'load', data: fonts });
    }

    const search = async () => {


        const data = fonts.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        dispatch({ type: 'load', data });

    }

    useEffect(() => {

        if (!searchQuery) {
            load();
        }
        else
            search();

    }, [searchQuery, fonts]);




    const onChange = (e) => {
        if (!state.loading)
            setSearchQuery(e.target.value)
    }


    return <>
        <Card loading={state.loading} title={<>{state.font ? state.label : `Fonts:`} <Input onChange={onChange} style={{ maxWidth: 300, width: '100%', marginLeft: 10 }} type="search" placeholder="search..." /></>}
            extra={(state.fonts.length > 0 && fonts.length < 25) && <Tooltip title="Add New Font"><Button
                type="text"
                onClick={(e) => {
                    e.preventDefault();
                    onEdit({ ...initialFont });
                }}
                icon={<PlusOutlined />}> </Button></Tooltip>}
            headStyle={{ padding: 10 }}>

            {state.error && <Alert message={state.error} style={{ margin: '10px 0' }} type="error" showIcon closable />}

            {state.fonts.length <= 0 ? <Space size={20}>
                <Title level={4}>  Add New Font: </Title>
                <Tooltip title="Add New"><Button
                    type="primary"
                    onClick={(e) => {
                        e.preventDefault();
                        onEdit({ ...initialFont });
                    }}
                    icon={<PlusOutlined />}> </Button></Tooltip>
            </Space> :
                <FontList
                    selectedFont={font}
                    fonts={state.fonts}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onSelect={onSelect}

                />
            }
        </Card>


        <AddFont
            onSubmit={onSubmit}
            font={state.font}
        />


    </>

};

