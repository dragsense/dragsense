import { Form, Space, Input, Button, Select, Radio, Tooltip, Card, Image, message } from 'antd';
import { QuestionCircleFilled, PlusOutlined } from '@ant-design/icons';
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
    { value: 'Object', label: 'OBJECT' },
];

const initialState = {
    key: '',
    defaultValue: null,
    values: [],
    type: 'text',
    new: true,
};

export default function AddState({ newState, onAddNew, setNewState }) {
    const [types, setTypes] = useState(() =>
        ADVANCE_TYPES.some((t) => t.value === newState.type) ? 1 : 0
    );
    const [state, setState] = useState({ states: {} });
    const [innerNewState, setInnerNewState] = useState(null);
    const [form] = Form.useForm();
    const [mediaModal, setMediaModal] = useState(false);

    useEffect(() => {
        if (!newState.states)
            newState.states = {}
        setState(newState);
        form.setFieldsValue(newState);
    }, [newState]);

    const onChange = (event) => {
        event.preventDefault();
        const value = event.target.value;
        const name = event.target.name;
        setState({ ...state, [name]: value });
    };

    const onChangeArrayValue = (evt, idx) => {
        state.states[idx] = evt.target.value;
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
    };

    const onAddArrayValue = (values) => {

        state.states = {};
        values.forEach((value, index) => {
            state.states[index] = value;
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
                    srcs: state.srcs
                });
                setNewState(null);
            })
            .catch((info) => {
                message.error('Validation failed.');
            });
    };

    const onAddState = (value) => {
        if (state.states) {
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
                        placeholder="Key"
                        name="key"
                        disabled={state.edit}
                        onChange={onChange}
                        value={state.key}
                    />
                </Form.Item>
                <Form.Item label="TYPES" className="font-500">
                    <Radio.Group
                        onChange={(e) => {
                            setTypes(e.target.value);
                            if (e.target.value === 1) {
                                setState({ ...state, type: 'array' });
                            }
                        }}
                        value={types}
                    >
                        <Radio value={0}>General</Radio>
                        <Radio value={1}>Advance</Radio>
                    </Radio.Group>
                </Form.Item>
                {types === 0 ? (
                    <AddGeneralTypes setState={setState} state={state} />
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
                                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                    {Object.values(state.states).map(src =>
                                        <Image.PreviewGroup>
                                            <Image
                                                preview={true}
                                                style={{
                                                    width: '120px',
                                                    height: '120px',
                                                    cursor: 'pointer'
                                                }}
                                                alt={src?.alt}
                                                src={src?.src}
                                                fallback="/images/default/default-img.png" />

                                        </Image.PreviewGroup>
                                    )}

                                    <Button
                                        type="dashed"
                                        onClick={() => setMediaModal(true)}
                                        icon={<PlusOutlined />}
                                        style={{ width: '120px', height: '120px' }}
                                    />
                                </div>
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
                        <Button type="primary" onClick={onAdd}>
                        {state.new ? 'Add' : 'Update' }
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
            <AddObjectTypes newState={innerNewState} setNewState={setInnerNewState} onAddNew={onAddState} />
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