import { Form, Space, Input, Button, Select, Radio, Modal, Tooltip, Card, Image, message } from "antd";
import { QuestionCircleFilled, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
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
    states: {}
};

import StateList from "./StateList";
import AddGeneralTypes from './AddGeneralTypes'
import AddObjectTypes from './AddObjectTypes'
import AddArrayTypes from './AddArrayTypes'


import MediaModal from "@/components/Dashboard/Media/MediaModal";

export default function AddState({ newState, host, onChangeSlelectedState, setNewState }) {

    const [types, setTypes] = useState(() => ADVANCE_TYPES.some(t => t.value == newState.type) ? 1 : 0);
    const [state, setState] = useState({});
    const [innerNewState, setInnerNewState] = useState(null);
    const [form] = Form.useForm();
    const [mediaModal, setMediaModal] = useState(false);
    const [isChange, setIsChange] = useState(false);

    useEffect(() => {
        if (!newState.states)
            newState.states = {}
        setState(newState);
        setTypes(() => ADVANCE_TYPES.some(t => t.value == newState.type) ? 1 : 0);
        form.setFieldsValue(newState);
    }, [newState])

    
    useEffect(() => {
        if (Object.keys(state.states || {}).length > 0,
            state.key ||
            state.defaultValue
            || Object.keys(state.srcs || {}).length > 0)
            setIsChange(true);
    }, [state])

    const onChange = (event) => {
        event.preventDefault();

        let value = event.target.value;
        const name = event.target.name;

        setState({ ...state, [name]: value })
    }


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

        Modal.confirm({
            title: 'Switching Type',
            content: 'Are you sure you want to switch to the type? Any unsaved changes may be lost.',
            onOk: () => {
                setState({ ...initialState,states: {}, key: state.key, new: state.new, type: value });
            },
            onCancel: () => {
                // Do nothing when the user cancels the confirmation
            },
        });
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
        e.preventDefault();

        onChangeSlelectedState(state);

        setIsChange(false);
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

               
              {/*   <Form.Item label="TYPES" className="font-500">
                    <Radio.Group onChange={(e) => {
                        const newType = e.target.value;

                        Modal.confirm({
                            title: 'Switching to Advanced',
                            content: 'Are you sure you want to switch to the Advanced type? Any unsaved changes may be lost.',
                            onOk: () => {
                                setTypes(newType);
                                state.states = {}
                                setState({ ...initialState, key: state.key, new: state.new, type: newType === 1 ? 'array' : 'text' });
                            },
                            onCancel: () => {
                                // Do nothing when the user cancels the confirmation
                            },
                        });

                    }} value={types}>
                        <Radio value={0}>General</Radio>
                        <Radio value={1}>Advance</Radio>
                    </Radio.Group>
                </Form.Item> */}


                {types == 0 ? <>

                    <AddGeneralTypes host={host} isChange={isChange} setState={setState} state={state} />  </>
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
                                                    src={host + src?.src}
                                                    
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
                        <Button type="default" onClick={() => { if(setNewState) setNewState(null) }}>Cancel</Button>
                        <Button type="primary" disabled={!isChange}  onClick={onAdd} >
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

