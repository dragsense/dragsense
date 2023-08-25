import { Form, Space, Input, Button, Select, Radio, Tooltip, Card, Image, message } from "antd";
import { QuestionCircleFilled, PlusOutlined } from '@ant-design/icons';
import { useState, useCallback, useEffect } from "react";

const { Option } = Select;

const ADVANCE_TYPES = [
    { value: 'array', label: 'ARRAY' },
    { value: 'images', label: 'IMAGES' },
    { value: 'object', label: 'OBJECT' },
    { value: 'object_array', label: 'OBJECT ARRAY' }
];


const initialState = {
    key: '',
    defaultValue: null,
    values: [],
    type: 'text',
    new: true,
};

import StateList from "./StateList";
import AddGeneralTypes from './AddGeneralTypes'
import AddObjectTypes from './AddObjectTypes'
import AddArrayTypes from './AddArrayTypes'


import MediaModal from "@/components/Dashboard/Media/MediaModal";

export default function AddState({ newState, onAddNew, setNewState }) {

    const [types, setTypes] = useState(() => ADVANCE_TYPES.some(t => t.value == newState.type) ? 1 : 0);
    const [state, setState] = useState({});
    const [innerNewState, setInnerNewState] = useState(null);
    const [form] = Form.useForm();
    const [mediaModal, setMediaModal] = useState(false);

    useEffect(() => {
          if (!newState.states)
            newState.states = {}
        setState(newState);
        form.setFieldsValue(newState);
    }, [newState])

    const onChange = (event) => {
        event.preventDefault();

        let value = event.target.value;
        const name = event.target.name;

        setState({ ...state, [name]: value })
    }


    const onChangeArrayValue = (evt, idx) => {
        state.defaultValue[idx] = evt.target.value;
        setState({ ...state });
    };

    const onChangeImage = (images) => {

        images.forEach((value, index) => {
            state.states[index] = value;
        });

        setState({ ...state });
    };

    const onChangeType = (value) => {
        setState({ ...state, type: value });
    }

    const onAddArrayValue = () => {
        if (!Array.isArray(state.defaultValue))
            state.defaultValue = [];

        state.defaultValue = [...state.defaultValue, ''];
        setState({ ...state });
    };

    const onRemoveArrayValue = idx => {
        state.defaultValue.splice(idx, 1);
        setState({ ...state });
    };


    const onAdd = (e) => {
        form
            .validateFields()
            .then(async (values) => {

                const key = state.key.toLowerCase().replace(/\s+/g, "-");


                onAddNew({
                    key,
                    defaultValue: state.defaultValue,
                    type: state.type,
                    states: state.states,
                    src: state.src,
                    srcs: state.srcs
                });
                setNewState(null);
            })
            .catch((info) => {
                message.error('Validation failed.');
            });
    };

    const onAddState = (value) => {
        if (!state.states) {
            state.states = {};
        }
        state.states[value.key] = value;
        setState({ ...state });
    };

    const onRemoveState = (key) => {
        if (state.states[key]) {
            delete state.states[key];
        }
        setState({ ...state });
    };



    return (
        <>
            <Form layout="vertical" form={form}
                initialValues={{}}>

                <Form.Item label="Key"
                    name="key"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter the key.',
                        },
                        {
                            min: 2,
                            message: 'Key must be at least 2 characters long',
                        }
                    ]}

                    className="font-500">
                    <Input placeholder="Key"
                        name="key"
                        onChange={onChange}
                        value={state.key}
                        disabled={!state.new}
                    />
                </Form.Item>

                <Form.Item label="TYPES" className="font-500">
                    <Radio.Group onChange={(e) => setTypes(e.target.value)} value={types}>
                        <Radio value={0}>General</Radio>
                        <Radio value={1}>Advance</Radio>
                    </Radio.Group>
                </Form.Item>


                {types == 0 ? <>

                    <AddGeneralTypes setState={setState} state={state} />  </>
                    : <>

                        <Form.Item label="Select Type" className="font-500">
                            <Select style={{ width: 120 }}
                                defaultValue={state.type}
                                value={state.type}
                                onChange={onChangeType}>
                                {ADVANCE_TYPES.map(type => <Option value={type.value}>{type.label}</Option>)}

                            </Select>
                        </Form.Item>


                        {state.type == 'array' ?

                            <AddArrayTypes states={state.defaultValue} onAdd={onAddArrayValue} onRemove={onRemoveArrayValue} onChange={onChangeArrayValue} />

                            : state.type == 'images' ?
                                <Form.Item label="Image" >

                                    <Space>
                                        {Array.isArray(state.defaultValue) ? state.defaultValue.map(image => <Image
                                            width="100%"
                                            onClick={() => setMediaModal(true)}
                                            preview={false}
                                            style={{
                                                width: '120px',
                                                height: '120px',
                                                cursor: 'pointer'
                                            }}
                                            alt={image.alt}
                                            src={image.src}
                                            fallback="/images/default/default-img.png" />) : <Image
                                            width="100%"
                                            onClick={() => setMediaModal(true)}
                                            preview={false}
                                            style={{
                                                width: '120px',
                                                height: '120px',
                                                cursor: 'pointer'
                                            }}
                                            src="/images/default/default-img.png"
                                            fallback="/images/default/default-img.png" />}
                                    </Space>
                                </Form.Item>
                                :
                                <Card title={<>Inner States  <Tooltip title="Object, Object Arrays"> <QuestionCircleFilled /></Tooltip></>}
                                    extra={<Tooltip title="Add New State">
                                        <Button
                                            type="text"
                                            onClick={() => setInnerNewState({ ...initialState })}
                                            icon={<PlusOutlined />}> </Button></Tooltip>}
                                >
                                    <StateList states={state.states} setNewState={setInnerNewState} onRemove={onRemoveState} />
                                </Card>}
                    </>
                }

                <br />

                <Form.Item className="text-right">
                    <Space>
                        <Button type="default" onClick={() => { setNewState(null) }}>Cancel</Button>
                        <Button type="primary" onClick={onAdd} >
                            {state.new ? 'Add' : 'Update'}

                        </Button>
                    </Space>
                </Form.Item>
            </Form>

            <AddObjectTypes newState={innerNewState} setNewState={setInnerNewState} onAddNew={onAddState} />

            <MediaModal open={mediaModal} type="images" multiple={true} onClose={() => setMediaModal(false)} srcs={Array.isArray(state.defaultValue) ? state.defaultValue : []} onSelect={onChangeImage} />

        </>

    );
};

