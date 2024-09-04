import { Form, Card, Divider, Tooltip, Select, Input, Checkbox, Button, message, Row, Col, Switch, Spin } from "antd";

import { QuestionCircleFilled, PlusOutlined } from '@ant-design/icons';
import { useState, useEffect, useReducer } from "react";
import TextArea from "antd/lib/input/TextArea";

import dynamic from 'next/dynamic';

import RichTextEditor, { HTMLEditor } from "./Content";


import { StateComponent, AddStateComponent } from "./State";
import FormServices from "@/lib/services/forms";

export const TYPES = [
    { value: 'text', label: 'TEXT' },
    { value: 'number', label: 'NUMBER' },
    { value: 'image', label: 'IMAGE' },
    { value: 'date', label: 'DATE' },
    { value: 'time', label: 'TIME' },
    { value: 'month', label: 'MONTH' },
    { value: 'color', label: 'COLOR' },
    { value: 'boolean', label: 'BOOLEAN' },
];


const initialState = {
    id: '',
    key: '',
    label: '',
    placeholder: '',
    defaultValue: '',
    type: TYPES[0].value,
    labelPos: 0,
    new: true
};


const reducer = (state, action) => {


    switch (action.type) {
        case "start":
            return { ...state, loading: true }
        case "error":
            return { ...state, error: action.error }
        case "finish":
            return { ...state, loading: false }
        default:
            return state;
    }
};


export default function AddForm({ _form, onSubmit }) {

    const [state, dispatch] = useReducer(reducer, {
        loading: false,
    });

    const [newState, setNewState] = useState(null);
    let [states, setStates] = useState({});
    let [emailBody, setEmailBody] = useState({});

    const [mode, setMode] = useState(false);

    const [form] = Form.useForm();

    useEffect(() => {


        const laod = async () => {
            try {
                dispatch({ type: 'start' });

                if (_form._id !== -1) {
                    const res = await FormServices.get(_form._id);
                    if (res.form) {
                        _form = res.form;
                    }
                }
                form.setFieldsValue({ name: form?.name, slug: form?.slug })
                setStates(_form.states || {});
                setEmailBody(_form.emailbody || {})
                form.setFieldsValue(_form);


            } catch (e) {
                dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
            } finally {

                dispatch({ type: 'finish' });

            }

        }

        laod();

    }, [_form])


    const handleEmailBodyChange = (key, value) => {
        const updatedEmailBody = { ...emailBody, [key]: value };
        setEmailBody(updatedEmailBody);

        form.setFieldsValue({ emailbody: updatedEmailBody })

    };

    const onSubmitForm = (values) => {

        form.validateFields()
            .then(async (values) => {
                const slug = values.slug.toLowerCase().replace(/\s+/g, "-");

                if(values.recordOnly)
                onSubmit({ ...values, slug, setting: undefined, states });
                else
                onSubmit({ ...values, slug, emailbody: emailBody, states });
            })
            .catch((info) => {
                message.error('Validate Failed.');
            });
    }


    const onAddState = (value) => {

        if (!states)
            states = {};

        states[value.key] = value
        setStates({ ...states })

    }

    const onRemoveState = key => {
        if (states[key]) {
            delete states[key];
        }
        setStates({ ...states })
    };

    const emailValidator = (_, value) => {

        if(!value)
        return Promise.resolve();

        if (!value) {
            return Promise.reject('Please enter at least one email address');
        }

        const emails = value.split(',').map((email) => email.trim());

        const isValidEmail = emails.every((email) =>
            /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
        );

        if (!isValidEmail) {
            return Promise.reject('Invalid email address');
        }

        return Promise.resolve();
    };

    const toggleMode = () => {
        setMode((prevMode) => !prevMode);
    };


 
    return (
        <>

            <Form layout="vertical"
                form={form}
                initialValues={{}}
                onFinish={onSubmitForm}>


                <Form.Item label="Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter the form name (alphanumeric).',
                            pattern: /^[a-zA-Z0-9\s]+$/

                        },
                        {
                            min: 4,
                            message: 'Form name must be at least 4 characters long',
                        }, {
                            max: 60,
                            message: 'Text be at most 60 characters long',
                        }
                    ]}

                    className="font-500">
                    <Input placeholder="Name"
                        required />
                </Form.Item>



                <Form.Item label="Slug" className="font-500"
                    name="slug"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter the slug.',
                        },
                        {
                            min: 1,
                            message: 'Form slug must be at least 1 characters long',
                        }, {
                            max: 60,
                            message: 'Text be at most 60 characters long',
                        }
                    ]}

                >
                    <Input placeholder="Slug"
                        required />
                </Form.Item>

                <Form.Item label="Record?" name="record" valuePropName="checked">
                    <Checkbox>Yes</Checkbox>
                </Form.Item>

                <Form.Item label="Record Only?" name="recordOnly" valuePropName="checked">
                    <Checkbox onChange={toggleMode}
                    >Yes</Checkbox>
                </Form.Item>



                <Row gutter={16}>
                    {!form.getFieldValue(['recordOnly']) &&
                        <Col span={12}>
                            <Divider orientation="left" orientationMargin="0">{"Email Setting"} </Divider>


                            <Form.Item label="To" name={['setting', 'to']} rules={[{
                            }, { validator: emailValidator }]}>
                                <Input maxLength={500} placeholder="Enter To addresses separated by commas" />
                            </Form.Item>

                            <Form.Item label="Cc" name={['setting', 'cc']} 
                            rules={[{ validator: emailValidator }]}>
                                <Input maxLength={500} placeholder="Enter Cc addresses separated by commas" />
                            </Form.Item>

                            <Form.Item label="Bcc" name={['setting', 'bcc']} 
                            rules={[{ validator: emailValidator }]}>
                                <Input maxLength={500} placeholder="Enter Bcc addresses separated by commas" />
                            </Form.Item>

                            <Form.Item label="From" name={['setting', 'from']}>
                                <Input maxLength={500} placeholder="Enter From address" type="email" />
                            </Form.Item>

                            <Form.Item label="Subject" name={['setting', 'subject']}>
                                <Input maxLength={500} placeholder="Enter Subject" />
                            </Form.Item>

                            <Form.Item label="Reply To" name={['setting', 'replyTo']}>
                                <Input maxLength={500} placeholder="Enter Reply To address" type="email" />
                            </Form.Item>

                            <Form.Item label="Redirect" name={['setting', 'redirect']}>
                                <Input maxLength={500} placeholder="Enter Redirect URL" type="url" />
                            </Form.Item>

                            <Form.Item name={['setting', 'sendCopy']} valuePropName="checked">
                                <Checkbox>Send Copy</Checkbox>
                            </Form.Item>

                            <Form.Item label="Success Message" name={['setting', 'successMessage']}>
                                <TextArea maxLength={500} placeholder="Enter Success Message" rows={4} />
                            </Form.Item>

                            <Form.Item label="Error Message" name={['setting', 'errorMessage']}>
                                <TextArea maxLength={500} placeholder="Enter Error Message" rows={4} />
                            </Form.Item>



                            <Divider orientation="left" orientationMargin="0">{"Email Message Template"}
                                <Tooltip title="Use curly brackets for variables e.g {{subject}}"> <QuestionCircleFilled /></Tooltip> </Divider>

                            <Form.Item
                                label="Type"
                                name={['emailbody', 'html']}
                                valuePropName="checked"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select the template type.',
                                    },
                                ]}
                                className="font-500"
                            >
                                <Switch
                                    checkedChildren="HTML"
                                    unCheckedChildren="Text"
                                    onChange={() => handleEmailBodyChange('html', !emailBody.html)}

                                />
                            </Form.Item>
                            {form.getFieldValue(['emailbody', 'html']) ? (
                                <>
                                    <Form.Item
                                        label="Head"                                    >
                                        <HTMLEditor
                                            title=""
                                            content={emailBody.head || ''}
                                            onSave={(head) => handleEmailBodyChange('head', head)}
                                        />
                                    </Form.Item>


                                    <Form.Item
                                        label="Body"
                                        style={{ margin: 0, position: 'relative', zIndex: 10 }}

                                    >
                                        <RichTextEditor
                                            title=""
                                            content={emailBody.body || ''}
                                            head={emailBody.head || ''}
                                            footer={emailBody.footer || ''}
                                            onSave={(body) => handleEmailBodyChange('body', body)}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name={['emailbody', 'body']}
                                        rules={[{ required: true, message: 'Please enter the message body.' }]}
                                        style={{ marginTop: -25 }}
                                    >
                                        <TextArea style={{ display: 'none', border: '1px solid black' }} value={emailBody.body} />
                                    </Form.Item>
                                    <Form.Item
                                        label="Footer"
                                    >
                                        <HTMLEditor
                                            title=""
                                            content={emailBody.footer || ''}
                                            onSave={(footer) => handleEmailBodyChange('footer', footer)}
                                        />
                                    </Form.Item>
                                </>
                            ) : (
                                // Plain text area for the Plain text version
                                <Form.Item
                                    label="Message Body"
                                    name={['emailbody', 'plain']}
                                    rules={[{ required: true, message: 'Please enter the message body.' }]}
                                >
                                    <TextArea
                                    maxLength={2000}
                                        placeholder="Message Body"
                                        rows={10}
                                        onChange={(e) => handleEmailBodyChange('plain', e.target.value)}
                                        style={{ maxHeight: '100%' }}
                                        value={emailBody.plain || ''}
                                        required
                                    />
                                </Form.Item>
                            )}

                        </Col>}

                    <Col span={form.getFieldValue(['recordOnly']) ? 24 : 12}>

                        <Card title={<>States <Tooltip title="Dynamic Variables"> <QuestionCircleFilled /></Tooltip></>}
                            extra={<><Tooltip title="Add New">
                                <Button
                                    type="text"
                                    onClick={() => setNewState({ ...initialState })}
                                    icon={<PlusOutlined />}> </Button></Tooltip></>}
                        >
                            {newState ? <AddStateComponent newState={newState} onAdd={onAddState} setNewState={setNewState} />

                                :
                                <StateComponent states={states} setNewState={setNewState} onRemove={onRemoveState} />}
                        </Card>
                    </Col>
                </Row>


                <Form.Item className="text-right" style={{marginTop: 10}}>
                    <Button type="primary" htmlType="submit" disabled={state.loading}> Save </Button>
                </Form.Item>
            </Form>

            {state.loading && <><div style={{
            position: 'fixed',
            width: '100%',
            height: '100%',
            backgroundColor: '#2fc1ff',
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

        </div> <Spin tip="Loading" size="small" spinning={state.loading}
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

