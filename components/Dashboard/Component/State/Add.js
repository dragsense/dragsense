import { Form, Space, Input, Button, Select, Radio, Tooltip, Modal, Card, Image, message } from 'antd';
import { QuestionCircleFilled, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import StateList from './StateList';
import AddGeneralTypes from './AddGeneralTypes';
import AddObjectTypes from './AddObjectTypes';
import AddArrayTypes from './AddArrayTypes';
import MediaModal from '@/components/Dashboard/Media/MediaModal';

const { Option } = Select;

const ADVANCE_TYPES = [
    { value: 'array', label: 'ARRAY' },
    { value: 'images', label: 'IMAGES' },
    { value: 'object', label: 'OBJECT' },
];

const initialState = {
    key: '',
    defaultValue: null,
    values: [],
    type: 'text',
    new: true,
    states: {}
};

export default function AddState({ newState, host, onAddNew, setNewState }) {
    const [types, setTypes] = useState(() =>
        ADVANCE_TYPES.some((t) => t.value === newState.type) ? 1 : 0
    );
    const [state, setState] = useState({ states: {} });
    const [innerNewState, setInnerNewState] = useState(null);
    const [form] = Form.useForm();
    const [mediaModal, setMediaModal] = useState(false);
    const [isChange, setIsChange] = useState(false);

    useEffect(() => {
        if (!newState.states)
            newState.states = {}
        setState(newState);
        form.setFieldsValue(newState);
    }, [newState]);

    useEffect(() => {
        if (Object.keys(state.states || {}).length > 0,
            state.key ||
            state.defaultValue
            || Object.keys(state.srcs || {}).length > 0)
            setIsChange(true);
    }, [state])

    const onChange = (event) => {
        event.preventDefault();
        const value = event.target.value;
        const name = event.target.name;
        setState({ ...state, [name]: value });
    };

    const onChangeArrayValue = (value, idx) => {
        state.states[idx] = { idx, value };
        setState({ ...state });


    };

    const onChangeImage = (images) => {

        images.forEach((value, index) => {
            state.states[index] = value;
        });

        if (images.length <= 0)
            state.states = {}

        setState({ ...state });


    };

    const onChangeType = (value) => {

        if (isChange)
            Modal.confirm({
                title: 'Switching Type',
                content: 'Are you sure you want to switch to the type? Any unsaved changes may be lost.',
                onOk: () => {

                    setState({ ...initialState, states: {}, key: state.key, new: state.new, type: value });
                },
                onCancel: () => {
                    // Do nothing when the user cancels the confirmation
                },
            });
        else
            setState({ ...state, type: value });

    };

    const onAddArrayValue = (values) => {

        state.states = {};
        values.forEach((value, idx) => {
            state.states[idx] = { idx, value };
        });


        setState({ ...state });
    };

    const onRemoveArrayValue = (idx) => {
        if (state.states[idx]) {
            delete state.states[idx];
        }
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
                    min: state.min,
                    max: state.max,
                    srcs: state.srcs
                });
                setNewState(null);
                setIsChange(false);
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
            <Form layout="vertical" form={form} initialValues={{}}>
                <Form.Item
                    label="Key"
                    name="key"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter the key.',
                        },
                        {
                            min: 2,
                            message: 'Key must be at least 2 characters long',
                        },
                    ]}
                    className="font-500"
                >
                    <Input
                        maxLength={60}

                        placeholder="Key"
                        name="key"
                        disabled={!state.new}
                        onChange={onChange}
                        value={state.key}
                    />
                </Form.Item>
                <Form.Item label="TYPES" className="font-500">
                    <Radio.Group
                        onChange={(e) => {
                            const newType = e.target.value;
                            if (isChange)
                                Modal.confirm({
                                    title: 'Switching to Advanced',
                                    content: 'Are you sure you want to switch to the Advanced type? Any unsaved changes may be lost.',
                                    onOk: () => {
                                        setTypes(newType);

                                        setState({ ...initialState, states: {}, key: state.key, new: state.new, type: newType === 1 ? 'array' : 'text' });
                                    },
                                    onCancel: () => {
                                        // Do nothing when the user cancels the confirmation
                                    },
                                });
                            else {
                                setTypes(newType);
                                setState({ ...state, type: newType === 1 ? 'array' : 'text' });
                            }


                        }}
                        value={types}
                    >
                        <Radio value={0}>General</Radio>
                        <Radio value={1}>Advanced</Radio>
                    </Radio.Group>
                </Form.Item>
                {types === 0 ? (
                    <AddGeneralTypes host={host} isChange={isChange} setState={setState} state={state} />
                ) : (
                    <>
                        <Form.Item label="Select Type" className="font-500">
                            <Select style={{ width: 120 }} defaultValue={state.type} onChange={onChangeType}>
                                {ADVANCE_TYPES.map((type) => (
                                    <Option key={type.value} value={type.value}>
                                        {type.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        {state.type === 'array' ? (
                            <AddArrayTypes
                                state={state}
                                states={state.states}
                                onAdd={onAddArrayValue}
                                onRemove={onRemoveArrayValue}
                                onChange={onChangeArrayValue}
                            />
                        ) : state.type === 'images' ? (
                            <Form.Item label="Images">

                                <Image.PreviewGroup>
                                    <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap', position: 'relative' }}>

                                        {Object.values(state.states).map((src, idx) => <>


                                            <div key={idx} style={{ position: 'relative' }}>

                                                <DeleteOutlined style={{ position: 'absolute', top: -20, right: 0 }} onClick={() => {
                                                    if (state.states[idx]) {
                                                        delete state.states[idx];
                                                    } setState({
                                                        ...state
                                                    });
                                                }} />

                                                <Image
                                                    preview={true}
                                                    style={{
                                                        width: '120px',
                                                        height: '120px',
                                                        cursor: 'pointer'
                                                    }}
                                                    alt={src?.alt}
                                                    src={host+src?.src}
                                                    crossOrigin ="anonymous" 
                                                    fallback="/images/default/default-img.png" />
                                            </div>
                                        </>

                                        )}
                                        <Button
                                            type="dashed"
                                            onClick={() => setMediaModal(true)}
                                            icon={<PlusOutlined />}
                                            style={{ width: '120px', height: '120px' }}
                                        />
                                    </div>
                                </Image.PreviewGroup>

                            </Form.Item>
                        ) : (
                            <Card
                                title={
                                    <>
                                        Inner States{' '}
                                        <Tooltip title="Object">
                                            {' '}
                                            <QuestionCircleFilled />
                                        </Tooltip>
                                    </>
                                }
                                extra={
                                    <Tooltip title="Add New">
                                        <Button type="primary" onClick={() => setInnerNewState({ ...initialState })} icon={<PlusOutlined />}>
                                            {' '}
                                        </Button>
                                    </Tooltip>
                                }
                            >
                                <StateList states={state.states} setNewState={setInnerNewState} onRemove={onRemoveState} />
                            </Card>
                        )}
                    </>
                )}
                <br />
                <Form.Item className="text-right">
                    <Space>
                        <Button type="default" onClick={() => { setNewState(null) }}>
                            Cancel
                        </Button>
                        <Button type="primary" disabled={!isChange} onClick={onAdd}>
                            {state.new ? 'Add' : 'Update'}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
            <AddObjectTypes host={host} newState={innerNewState} setNewState={setInnerNewState} onAddNew={onAddState} />
            <MediaModal
                open={mediaModal}
                type="images"
                multiple={true}
                onClose={() => setMediaModal(false)}
                srcs={Object.values(state.states).flatMap((value) => value)}
                onSelect={onChangeImage}
            />
        </>
    );
}