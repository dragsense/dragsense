import { Form, Row, Col, Space, Image, Input, Button, Select, Divider, Tooltip, message, Spin } from "antd";
import { QuestionCircleFilled } from '@ant-design/icons';
import { useState, useEffect, useReducer } from "react";
import dynamic from 'next/dynamic';

const { Option } = Select;
const { TextArea } = Input;


const STATUS = ['DRAFT', 'PRIVATE', 'PUBLIC'];

import LayoutServices from "@/lib/services/layouts";


import MediaModal from "../Media/MediaModal";

import RichTextEditor from "./Content";
import PageServices from "../../../lib/services/pages";
import SettingServices from "@/lib/services/setting";

import HTMLEditor from '../Setting/HTMLEditor';


const reducer = (state, action) => {
    switch (action.type) {
        case "start":
            return { ...state, loading: true }
        case "loadLayouts":
            return { ...state, layouts: action.data, error: '' }
        case "error":
            return { ...state, error: action.error }
        case "finish":
            return { ...state, loading: false }
        default:
            return state;
    }
};



export default function AddPage({ page, onSubmit }) {

    const [states, dispatch] = useReducer(reducer, { loading: false, layouts: [] });
    const [form] = Form.useForm();
    const [state, setState] = useState(page);
    const [layoutSearch, setLayoutSeacrh] = useState('');
    const [preview, setPreview] = useState(null);
    const [host, setHost] = useState('');

    const [mediaModal, setMediaModal] = useState(false);

    useEffect(() => {

        const laod = async () => {
            try {
                dispatch({ type: 'start' });

                if (page._id !== -1) {
                    const res = await PageServices.get(page._id);
                    if (res.page) {
                        page = res.page;
                    }

                }
                form.setFieldsValue({ name: page?.name, slug: page?.slug, layout: page?.layout })
                 
                const result = await SettingServices.get();
                setHost(result.host || '')
                setState(page);
                dispatch({ type: 'loadLayouts', data: page.populatedLayout || [] });
             
                if (page.populatedImage)
                setPreview(page.populatedImage[0] || null)
          

            } catch (e) {
                dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
            } finally {

                dispatch({ type: 'finish' });

            }

        }

        laod();

    }, [page])

    const laod = async () => {

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

    useEffect(() => {

        if (!layoutSearch)
            return;

        laod();

    }, [layoutSearch]);

    const onChange = (event) => {
        event.preventDefault();

        let value = event.target.value;
        const name = event.target.name;

        if (name == 'slug') {
            value = value.trim().toLowerCase();

        }

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


    const onChangeImage = (image) => {

        setState({
            ...state,
            setting: {
                ...state.setting,
                image: image[0]?._id
            }
        });

        setPreview(image[0]);

    }

    const onChangeContent = (content) => {
        setState({ ...state, setting: { ...state.setting, content } });

    }
    const onChangeScript = (value, name) => {
        setState({ ...state, scripts: { ...state.scripts, [name]: value } });
    }


    const onSubmitForm = (values) => {
        form.validateFields()
            .then(async (values) => {
                const slug = values.slug.toLowerCase().replace(/\s+/g, "-");

                onSubmit({ ...state, slug });
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

    const onChangeLayout = (value, option) => {

        form.setFieldsValue({ layout: value })

        setState({ ...state, layout: value });
    }


    const imageSrc = preview ? host + preview.src :
    "/images/default/default-img.png"


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
                                    message: 'Please enter the page name (alphanumeric).',
                                    pattern: /^[a-zA-Z0-9\s]+$/

                                },
                                {
                                    min: 2,
                                    message: 'Page name must be at least 4 characters long',
                                }
                            ]}

                        >
                            <Input placeholder="Name" name="name"
                                onChange={onChange}
                                value={state.name}
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
                                    message: 'Page slug must be at least 1 characters long',
                                }
                            ]}

                        >
                            <Input placeholder="Slug" name="slug"
                                onChange={onChange}
                                value={state.slug}
                            />
                        </Form.Item>


                        <Divider orientation="left" orientationMargin="0">{"Setting"}
                            <Tooltip title="The SEO title and meta description appear on Google or other search engines when someone searches for your website"> <QuestionCircleFilled /></Tooltip>
                        </Divider>


                        <Form.Item label="Page Title"

                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter the page title.',
                                },
                                {
                                    min: 3,
                                    message: 'Page title must be at least 3 characters long',
                                }
                            ]}

                        >
                            <Input placeholder="Title" name="title"
                                onChange={onChangeSetting}
                                defaultValue={state.setting?.title}
                                value={state.setting?.title}
                            />
                        </Form.Item>

                        <Form.Item label="Page Description" >
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
                            <Tooltip title="Dynamic Page Content"> <QuestionCircleFilled /></Tooltip> </Divider>
                        <Form.Item label="Page Body" >
                            <RichTextEditor content={state?.setting?.content} onSave={onChangeContent} />


                        </Form.Item>
                        <Form.Item label="Page Excerpt" >
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
                                src={imageSrc}
                                />
                        </Form.Item>

                        <Divider orientation="left" orientationMargin="0"> {"Header and Footer Scripts"} </Divider>
                        <Space direction="horizontal" size={10}>
                            <Form.Item label="Head" >


                                <HTMLEditor title="Edit Script"
                                    content={state.scripts?.head}
                                    onSave={(_content) => {
                                        onChangeScript(_content, 'head');
                                    }} />

                            </Form.Item>
                            <Form.Item label="After Content" >
                            <HTMLEditor title="Edit Script" content={state.scripts?.footer} onSave={(_content) => {
                                        onChangeScript(_content, 'footer');
                                    }} />

                            </Form.Item>
                        </Space>

                    </Col>
                </Row>

                <Form.Item className="text-right">
                    <Button type="primary" htmlType="submit" loading={states.loading}> Save </Button>
                </Form.Item>
            </Form>

            <MediaModal open={mediaModal} type="images" onClose={() => setMediaModal(false)} srcs={preview} onSelect={onChangeImage} />

            {states.loading && <><div style={{
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

        </div> <Spin tip="Loading" size="small" spinning={states.loading}
            style={{
                position: 'fixed',
                top: '50%',
                left: '50%',

                transform: 'translate(-50%, -50%)'
            }}
        >
        </Spin> </>}
        </>

    );
};

