

import { Card, Form, Space, Input, Button, Select, Divider, message, Tooltip, Alert, Row, Col, Image } from "antd";
import { QuestionCircleFilled, PlusOutlined } from '@ant-design/icons';
import { useState, useEffect, useReducer } from "react";
import dynamic from 'next/dynamic';

const { Option } = Select;
const { TextArea } = Input;

const STATUS = ['DRAFT', 'PRIVATE', 'PUBLIC'];

import LayoutServices from "@/lib/services/layouts";


import MediaModal from "../Media/MediaModal";


import CollectionServices from "@/lib/services/collections";
import FormServices from "@/lib/services/forms";

import RichTextEditor from "./Content";


import { StateComponent, AddStateComponent } from "./State";

export const TYPES = [
    { value: 'text', label: 'TEXT' },
    { value: 'number', label: 'NUMBER' },
    { value: 'image', label: 'IMAGE' },
    { value: 'content', label: 'CONTENT' },
    { value: 'date', label: 'DATE' },
    { value: 'time', label: 'TIME' },
    { value: 'month', label: 'MONTH' },
    { value: 'boolean', label: 'BOOLEAN' },
];

const initialState = {
    key: '',
    defaultValue: null,
    type: TYPES[0].value,
    states: {},
    relationships: [],
    new: true
}



const reducer = (state, action) => {
    switch (action.type) {
        case "start":
            return { ...state, loading: true }
        case "loadLayouts":
            return { ...state, layouts: action.data }
        case "loadCollections":
            return { ...state, collections: action.data }
        case "loadForms":
            return { ...state, forms: action.data }
        case "error":
            return { ...state, error: action.error }
        case "finish":
            return { ...state, loading: false }
        default:
            return state;
    }
};



export default function AddCollection({ collection, onSubmit }) {

    const [states, dispatch] = useReducer(reducer, {
        laoding: false,
        layouts: [],
        forms: [],
        collections: []
    });

    const [form] = Form.useForm();
    const [newState, setNewState] = useState(null);
    const [state, setState] = useState(collection);
    const [preview, setPreview] = useState({});

    const [mediaModal, setMediaModal] = useState(false);

    const [layoutSearch, setLayoutSeacrh] = useState('');
    const [formSearch, setFormSearch] = useState('');

    const [collectionSearch, setCollectionSearch] = useState('');

    useEffect(() => {

        const laod = async () => {
            try {
                dispatch({ type: 'start' });

                if (collection._id !== -1) {
                    const res = await CollectionServices.get(collection._id);
                    if (res.collection) {
                        collection = res.collection;
                    }
                }
                form.setFieldsValue({ 
                    name: collection?.name, 
                    slug: collection?.slug,
                     layout: collection?.layout })
            
                setState(collection);
                dispatch({ type: 'loadLayouts', data: collection.populatedLayout || [] });
                dispatch({ type: 'loadCollections', data: collection.populatedRelationships || [] });
                setPreview(collection.populatedImage[0] || {})


            } catch (e) {
                dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
            } finally {

                dispatch({ type: 'finish' });

            }

        }

        laod();

    }, [collection])

    const layoutLoad = async () => {

        try {
            dispatch({ type: 'start' });

            const res = await LayoutServices.search(layoutSearch);

            if (res.layouts) {
                const data = Array.isArray(res.layouts.results) ? res.layouts.results : [];
                dispatch({ type: 'loadLayouts', data });
            }



        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
        } finally {

            dispatch({ type: 'finish' });

        }
    }

    const collectionLoad = async () => {

        try {
            dispatch({ type: 'start' });

            const res = await CollectionServices.search(collectionSearch);

            if (res.collections) {
                const data = Array.isArray(res.collections.results) ? res.collections.results : [];
                dispatch({ type: 'loadCollections', data });
            }


        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
        } finally {

            dispatch({ type: 'finish' });

        }
    }

    const formLoad = async () => {

        try {
            dispatch({ type: 'start' });

            const res = await FormServices.search(formSearch);
            console.log(res.forms)
            const data = Array.isArray(res.forms) ? res.forms : [];

            dispatch({ type: 'loadForms', data })


        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
        } finally {

            dispatch({ type: 'finish' });

        }
    }

    useEffect(() => {

        if (!layoutSearch)
            return;

        layoutLoad();

    }, [layoutSearch]);

    useEffect(() => {

        if (!collectionSearch)
            return;

        collectionLoad();

    }, [collectionSearch]);

    useEffect(() => {

        if (!formSearch)
            return;

        formLoad();

    }, [formSearch]);

    const onChange = (event) => {
        event.preventDefault();

        let value = event.target.value;
        const name = event.target.name;

        if (name == 'slug')
            value = value.trim().toLowerCase();

        setState({ ...state, [name]: value })
    }

    const onChangeStatus = (value) => {
        setState({ ...state, setting: { ...state.setting, status: value } });
    }

    const onChangeSetting = (event) => {
        event.preventDefault();

        const value = event.target.value;
        const name = event.target.name;

        setState({ ...state, setting: { ...state.setting, [name]: value } });
    }

    const onChangeLayout = (value, option) => {

        form.setFieldsValue({ layout: value })

        setState({ ...state, layout: value });
    }

    const handleChangeForm = (value, option) => {

        state.form = { _id: value, name: option.label, slug: option.slug }
        setState({ ...state });

    }


    const onChangeImage = (image) => {

        setState({
            ...state,
            setting: {
                ...state.setting,
                image: image[0]?._id
            }
        });

        setPreview(image[0])
    }

    const onChangeContent = (content) => {
        setState({ ...state, setting: { ...state.setting, content } });

    }
    const onChangeScript = (value, name) => {
        setState({ ...state, scripts: { ...state.scripts, [name]: value } });
    }


    const handleChangeCollection = (value, options) => {

        state.relationships = value;
        setState({ ...state });

    }

    const onAddState = (value) => {

        if (!state.states)
            state.states = {};

        state.states[value.key] = value
        setState({ ...state })

    }

    const onRemoveState = key => {
        if (state.states[key]) {
            delete state.states[key];
        }
        setState({ ...state })
    };

    const onSubmitForm = (values) => {

        form.validateFields()
            .then(async (values) => {
                const slug = values.slug.toLowerCase().replace(/\s+/g, "-");

                onSubmit({...state, slug});
            })
            .catch((info) => {
                message.error('Validate Failed.');
            });
    }

    const dropdownRender = (menu) => {
        return <>
            {states.loading && <div>Loading...</div>}
            {menu}
        </>
    }


    return (
        <>

            {state.error && <Alert message={state.error} style={{ margin: '10px 0' }} type="error" showIcon closable />}
            <Form layout="vertical"
                form={form}
                initialValues={{}}
                onFinish={onSubmitForm}>
                <Row gutter={16}>
                    <Col span={12}>


                        <Form.Item label="Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter the collection name (alphanumeric).',
                                    pattern: /^[a-zA-Z0-9\s]+$/
                                },
                                {
                                    min: 2,
                                    message: 'Collection name must be at least 4 characters long',
                                }
                            ]}

                        >
                            <Input placeholder="Name" name="name"
                                onChange={onChange}
                                defaultValue={state.name}
                            />
                        </Form.Item>
                        <Form.Item label="Slug"
                            name="slug"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter the slug.',
                                },
                                {
                                    min: 2,
                                    message: 'Collection slug must be at least 1 characters long',
                                }
                            ]}

                        >
                            <Input placeholder="Slug" name="slug"
                                onChange={onChange}
                                defaultValue={state.slug}
                            />
                        </Form.Item>

                        <Divider orientation="left" orientationMargin="0">{"Setting"}
                            <Tooltip title="The SEO title and meta description appear on Google or other search engines when someone searches for your website"> <QuestionCircleFilled /></Tooltip>
                        </Divider>


                        <Form.Item label="Collection Title"

                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter the page title.',
                                },
                                {
                                    min: 3,
                                    message: 'Collection title must be at least 3 characters long',
                                }
                            ]}

                        >
                            <Input placeholder="Title" name="title"
                                onChange={onChangeSetting}
                                defaultValue={state.setting?.title}
                                value={state.setting?.title}

                            />
                        </Form.Item>

                        <Form.Item label="Collection Description" >
                            <TextArea rows={4} value={state.setting?.desc} name="desc" onChange={onChangeSetting} />
                        </Form.Item>

                        <Form.Item label="Status" >
                            <Select style={{ width: 120 }} value={state.setting?.status}
                                defaultValue={state.setting?.status}
                                onChange={onChangeStatus}>
                                <Option value={STATUS[0]}>{STATUS[0]}</Option>
                                <Option value={STATUS[1]}>{STATUS[1]}</Option>
                                <Option value={STATUS[2]}>{STATUS[2]}</Option>
                            </Select>
                        </Form.Item>



                    </Col>
                    <Col span={12}>

                        <Form.Item label="Layout"
                            name="layout"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter the layout.',
                                },
                            ]}

                        >


                            <Select
                                style={{ width: '100%' }}
                                placeholder="Select Lyout"
                                showSearch
                                clearIcon
                                onChange={onChangeLayout}
                                onSearch={(v) => {

                                    if (!state.loading)
                                        setLayoutSeacrh(v)
                                }
                                }
                                dropdownRender={dropdownRender}
                                optionFilterProp="label"
                                defaultValue={state.layout}
                                value={state.layout}
                            >

                                {states.layouts.map(layout => <Option
                                    key={layout._id}
                                    value={layout._id}
                                    label={layout.name}
                                >
                                    {layout.name}
                                </Option>)}
                            </Select>

                        </Form.Item>

                        <Divider orientation="left" orientationMargin="0">{"Content"}
                            <Tooltip title="Dynamic Collection Content"> <QuestionCircleFilled /></Tooltip> </Divider>
                        <Form.Item label="Collection Body" >
                            <RichTextEditor content={state?.setting?.content} onSave={onChangeContent} />
                        </Form.Item>
                        <Form.Item label="Collection Excerpt" >
                            <TextArea
                                rows={4}
                                value={state.setting?.excerpt}
                                name="excerpt"
                                onChange={onChangeSetting} />

                        </Form.Item>

                        <Form.Item label="Cover Image" >

                            <img
                                width="100%"
                                onClick={() => setMediaModal(true)}
                                preview={false}
                                style={{
                                    width: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                    height: '120px',
                                    cursor: 'pointer'
                                }}
                                alt={preview?.alt}
                                src={preview?.src || state.populatedImage?.[0]?.src || "/images/default/default-img.png"}
                                 />
                        </Form.Item>


                        <Divider orientation="left" orientationMargin="0"> {"Header and Footer Scripts"} </Divider>
                        <Space direction="horizontal" size={10}>
                            <Form.Item label="Head" >
                                <RichTextEditor name="Edit Script" content={state.scripts?.head} onSave={(_content) => {
                                    onChangeScript(_content, 'head');
                                }} isOnlyHTML={1} />
                            </Form.Item>
                            <Form.Item label="After Content" >
                                <RichTextEditor name="Edit Script" content={state.scripts?.footer} onSave={(_content) => {
                                    onChangeScript(_content, 'footer');
                                }} isOnlyHTML={1} />
                            </Form.Item>
                        </Space>

                    </Col>
                </Row>



                <Divider orientation="left" orientationMargin="0">{"Relationships"}
                    <Tooltip title="Relationships with a collection"> <QuestionCircleFilled /></Tooltip>
                </Divider>

                <Form.Item
                    rules={[
                        {
                            required: true,
                            message: 'Please enter the Relationships.',
                        },
                    ]}

                >


                    <Select
                        style={{ width: '100%' }}
                        placeholder="Select Relationships"
                        showSearch
                        clearIcon
                        onChange={handleChangeCollection}
                        onSearch={(v) => {

                            if (!state.loading)
                                setCollectionSearch(v)
                        }
                        }
                        mode="multiple"
                        dropdownRender={dropdownRender}
                        optionFilterProp="label"
                        defaultValue={state.relationships}
                        value={state.relationships}

                    >

                        <Option value=''> None </Option>
                        {states.collections.map(col => <Option
                            key={col._id}
                            value={col._id}
                            label={col.name}

                        >
                            {col.name}
                        </Option>)}
                    </Select>

                </Form.Item>


                <Divider orientation="left" orientationMargin="0">{"Forms"}
                    <Tooltip title="Form with a collection"> <QuestionCircleFilled /></Tooltip>
                </Divider>

                <Form.Item
                    label="Attach Form"
                    rules={[
                        {
                            required: false,
                        },
                    ]}

                >
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Select Form"
                        showSearch
                        clearIcon
                        onChange={handleChangeForm}
                        onSearch={(v) => {

                            if (!state.loading)
                                setFormSearch(v)
                        }
                        }
                        dropdownRender={dropdownRender}
                        optionFilterProp="label"
                        defaultValue={state.form ? state.form._id : null}
                        value={state.form ? state.form._id : null}
                    >
                        {state.form && <Option
                            key={0} disabled
                            value={state.form._id}
                            label={state.form.name}
                            slug={state.form.slug}
                        >
                            {state.form.name}
                        </Option>}
                        <Option value=''> None </Option>

                        {states.forms.map(form => <Option
                            key={form._id}
                            value={form._id}
                            label={form.name}
                            slug={form.slug}
                        >
                            {form.name}
                        </Option>)}
                    </Select>

                </Form.Item>


                <Divider></Divider>

                <Form.Item>
                    <Card title={<>States <Tooltip title="Dynamic Variables"> <QuestionCircleFilled /></Tooltip></>}
                        extra={<><Tooltip title="Add New State">
                            <Button
                                type="text"
                                onClick={() => setNewState({ ...initialState })}
                                icon={<PlusOutlined />}> </Button></Tooltip></>}
                    >
                   
                        {newState ? <AddStateComponent newState={newState} onAdd={onAddState} setNewState={setNewState} />

                            :
                            <StateComponent states={state.states} setNewState={setNewState} onRemove={onRemoveState} />}
                    </Card>
                </Form.Item>



                <Form.Item className="text-right">
                    <Button type="primary" htmlType="submit" loading={states.loading}> Save </Button>
                </Form.Item>
            </Form>

            <MediaModal open={mediaModal} type="images" onClose={() => setMediaModal(false)} srcs={preview} onSelect={onChangeImage} />

        </>

    );
};

