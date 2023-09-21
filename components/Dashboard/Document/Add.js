import { Form, Tooltip, Input, Button, Card, Divider, Image, Row, Col, message, Select } from "antd";
import { QuestionCircleFilled } from '@ant-design/icons';
import { useState, useEffect, useReducer } from "react";
const { TextArea } = Input;
import MediaModal from "../Media/MediaModal";

import { StateComponent } from "./State";
import DocumentServices from "@/lib/services/documents";
import RichTextEditor from "../Collection/Content";
const STATUS = ['DRAFT', 'PRIVATE', 'PUBLIC'];

export const TYPES = [
    { value: 'text', label: 'TEXT' },
    { value: 'number', label: 'NUMBER' },
    { value: 'image', label: 'IMAGE' },
    { value: 'date', label: 'DATE' },
    { value: 'time', label: 'TIME' },
    { value: 'month', label: 'MONTH' },
    { value: 'boolean', label: 'BOOLEAN' },
];

const reducer = (state, action) => {
    switch (action.type) {
        case "start":
            return { ...state, loading: true }
        case "documents":
            return { ...state, documents: { ...state.documents, ...action.data }, }
        case "error":
            return { ...state, error: action.error }
        case "finish":
            return { ...state, loading: false }
        default:
            return state;
    }
};

function isObject(value) {
    return typeof value === 'object' && value !== null && Array.isArray(value);
}


function isEmptyObject(obj) {
    return isObject(obj) && Object.keys(obj).length === 0;
}


export default function AddDocument({ collection, _form, document, onSubmit }) {

    const [mediaModal, setMediaModal] = useState(false);
    const [preview, setPreview] = useState({});
    const [host, setHost] = useState('');

    const [states, dispatch] = useReducer(reducer, {
        laoding: false,
        documents: {},
    });
    const [state, setState] = useState(document);
    const [form] = Form.useForm();

    const [documentSearch, setDocumentSearch] = useState(null);


    useEffect(() => {

        const laod = async () => {
            try {
                dispatch({ type: 'start' });

                if (document._id !== -1) {
                    const res = await DocumentServices.get(collection._id, document._id, _form);
                    if (res.document) {
                        document = res.document;
                    }

                    setHost(res.host || '');
                }

                form.setFieldsValue({ name: document?.name, slug: document?.slug });
                if (!document.states) {
                    document.states = collection.states;
                } else {
                    Object.keys(collection.states).forEach((key) => {
                        if (!document.states.hasOwnProperty(key)) {
                            document.states[key] = collection.states[key];
                        }
                    });
                }
                setState(document);

                const data = collection.relationships.reduce((result, rel) => {
                    result[rel] = document.populatedRelationships[rel];
                    return result;
                }, {});

                dispatch({ type: 'documents', data });
                setPreview(document.populatedImage[0] || {})


            } catch (e) {

                dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
            } finally {

                dispatch({ type: 'finish' });

            }

        }

        laod();

    }, [document]);

    const loadDocuemnts = async () => {

        try {



            dispatch({ type: 'start' });


            const res = await DocumentServices.search(documentSearch.idx, documentSearch.value);

            if (res.documents) {
                const data = Array.isArray(res.documents.results) ? res.documents.results : [];
                dispatch({ type: 'documents', data: { [documentSearch.idx]: data } });
            }


        } catch (e) {

            message.error(e?.message || 'Something went wrong.');
        } finally {

            dispatch({ type: 'finish' });

        }
    }

    useEffect(() => {

        if (!documentSearch || documentSearch.idx <= -1)
            return;


        loadDocuemnts();

    }, [documentSearch]);

    const onChange = (event) => {
        event.preventDefault();

        let value = event.target.value;
        const name = event.target.name;

        if (name == 'slug')
            value = value.trim().toLowerCase();

        setState({ ...state, [name]: value });
    }


    const onSubmitForm = async (values) => {

        form.validateFields()
            .then(async (values) => {

                onSubmit({ name: state.name, relationships: state.relationships, slug: state.slug, setting: state.setting, states: state.states });
            })
            .catch((info) => {
                message.error('Validate Failed.');
            });
    }

    const onChangeState = () => {
        console.log(state);
        setState({ ...state });

    }

    const handleChangeDocument = (value, options, idx) => {

        if (!state.relationships)
            state.relationships = {}

        state.relationships[idx] = value;

        setState({ ...state });

    }

    const dropdownRender = (menu) => {
        return <>
            {states.loading && <div>Loading...</div>}
            {menu}
        </>
    }


    const onChangeSetting = (event) => {
        event.preventDefault();

        const value = event.target.value;
        const name = event.target.name;

        setState({ ...state, setting: { ...state.setting, [name]: value } });
    }

    const onChangeStatus = (value) => {
        setState({ ...state, setting: { ...state.setting, status: value } });
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



    return (
        <>

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
                                    message: 'Please enter the document name (alphanumeric).',
                                    pattern: /^[a-zA-Z0-9\s]+$/
                                },
                                {
                                    min: 3,
                                    message: 'Document name must be at least 3 characters long',
                                }, {
                                    max: 60,
                                    message: 'Text be at most 60 characters long',
                                }

                            ]}

                            className="font-500">
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
                                    message: 'Document slug must be at least 1 characters long',
                                }, {
                                    max: 60,
                                    message: 'Text be at most 60 characters long',
                                }
                            ]}

                        >
                            <Input placeholder="Slug" name="slug"
                                onChange={onChange}
                                value={state.slug}
                                defaultValue={state.slug}
                            />
                        </Form.Item>
                        {collection.type !== 'form' && <>   <Divider orientation="left" orientationMargin="0">{"Setting"}
                            <Tooltip title="The SEO title and meta description appear on Google or other search engines when someone searches for your website"> <QuestionCircleFilled /></Tooltip>
                        </Divider>


                            <Form.Item label="Document Title"

                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter the document title.',
                                    },
                                    {
                                        min: 3,
                                        message: 'Collection title must be at least 3 characters long',
                                    }, {
                                        max: 60,
                                        message: 'Text be at most 60 characters long',
                                    }
                                ]}

                            >
                                <Input

                                    maxLength={60}

                                    placeholder="Title" name="title"
                                    onChange={onChangeSetting}
                                    value={state.setting?.title}

                                    defaultValue={state.setting?.title}
                                />
                            </Form.Item>

                            <Form.Item label="Document Description" >
                                <TextArea maxLength={500} rows={4} value={state.setting?.desc} name="desc" onChange={onChangeSetting} />
                            </Form.Item>
                        </>
                        }

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
                    {collection.type !== 'form' && <Col span={12}>
                        <Divider orientation="left" orientationMargin="0">{"Content"}
                            <Tooltip title="Dynamic Document Content"> <QuestionCircleFilled /></Tooltip> </Divider>
                        <Form.Item label="Document Body" >
                            <RichTextEditor content={state?.setting?.content} onSave={onChangeContent} />
                        </Form.Item>

                        <Form.Item label="Document Excerpt" >
                            <TextArea
                                maxLength={1000}
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

                    </Col>}
                </Row>

                {collection.type !== 'form' && <> <Divider orientation="left" orientationMargin="0">{"Relationships"}
                    <Tooltip title="Relationships with a collection"> <QuestionCircleFilled /></Tooltip> </Divider>

                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the Relationships.',
                            },
                        ]}

                    >
                        {(Array.isArray(collection.relationships) ? collection.relationships : []).map((rel, idx) =>
                            <>
                                <label>{rel.name}</label>

                                <Select
                                    style={{ width: '100%', margin: '10px 0px' }}
                                    placeholder="Select Documents"
                                    showSearch
                                    clearIcon
                                    onChange={(value, options) => handleChangeDocument(value, options, rel)}
                                    onSearch={(v) => {

                                        if (!state.loading)
                                            setDocumentSearch({ value: v, idx: rel })
                                    }
                                    }
                                    mode="multiple"
                                    dropdownRender={dropdownRender}
                                    optionFilterProp="label"

                                    defaultValue={state.relationships ? state.relationships[rel] : []}
                                    value={state.relationships ? state.relationships[rel] : []}

                                >
                                    <Option value=''> None </Option>
                                    {states.documents[rel]?.map(doc => <Option
                                        key={doc._id}
                                        value={doc._id}
                                        label={doc.name}

                                    >
                                        {doc.name}
                                    </Option>)}

                                </Select></>)}

                    </Form.Item>
                </>}
                <Divider></Divider>

                <Form.Item>
                    <Card title={<>States <Tooltip title="Dynamic Variables"> <QuestionCircleFilled /></Tooltip></>}>
                        <StateComponent
                            host={host}
                            states={state.states ? state.states : {}}
                            onChangeState={onChangeState} />
                    </Card>
                </Form.Item>


                <Form.Item className="text-right">
                    <Button type="primary" htmlType="submit" loading={state.loading}> Save </Button>
                </Form.Item>
            </Form>
            <MediaModal open={mediaModal} type="images"
                onClose={() => setMediaModal(false)}
                srcs={state.setting?.image} onSelect={onChangeImage} />

        </>

    );
};
