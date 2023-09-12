import { Form, Select, Input, Checkbox, Space } from "antd";
const { Option } = Select;
const { TextArea } = Input;


import { TYPES } from './Add';
import AddArrayTypes from "./AddArrayTypes";

const acceptOptions = [
    'doc',
    'docx',
    'pdf',   // PDF documents
    'xml',
    'text/csv',
    'text/css',
    'text/html',
    'text/javascript',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', // MS Excel documents
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // MS Excel documents (XLSX)
    'application/vnd.ms-powerpoint', // MS PowerPoint presentations
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // MS PowerPoint presentations (PPTX)
    'image/apng',
    'image/avif',
    'image/gif',
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'image/webp',
    'image/vnd.microsoft.icon',
    'video/x-msvideo', 'video/mpeg', 'video/mp4', 'video/ogg', 'video/3gpp2', 'video/3gpp',
    'audio/mpeg', 'audio/3gpp', 'audio/ogg', 'audio/3gpp2', 'audio/wav', 'audio/webm'
];

export default function AddFormTypes({ onChangeState, state }) {


    const onChange = (event) => {
        event.preventDefault();

        let value = event.target.value;
        const name = event.target.name;
        state[name] = value;
        onChangeState();
    }


    const onChangeAccepted = (value) => {

        state["acceptOptions"] = value;
        onChangeState();

    }


    const onChangeMaxSize = (value) => {

        state["maxSize"] = value;
        onChangeState();

    }

    const onChangeLabel = (val) => {
        state.labelPos = val;
        onChangeState();
    };



    const onChangeType = (value) => {
        state.type = value;

        if (value !== 'radio' || value !== 'checkbox' || value !== 'select')
            state.multiple = undefined;
        onChangeState();

    }

    const onChangeArrayValue = (value, idx) => {
        state.states[idx] = { idx, value };
        setState({ ...state });
    };


    const onAddArrayValue = (values) => {

        state.states = {};
        values.forEach((value, idx) => {
            state.states[idx] = { idx, value };
        });


        onChangeState();
    };

    const onRemoveArrayValue = (idx) => {
        if (state.states[idx]) {
            delete state.states[idx];
        }
        onChangeState();
    };




    return <>

        <Form.Item disabled label="Select Type" className="font-500">
            <Select style={{ width: 120 }} value={state.type} defaultValue={state.type} onChange={onChangeType}>
                {TYPES.map(type => <Option value={type.value}>{type.label}</Option>)}

            </Select>

        </Form.Item>

        <Form.Item label="Label" className="font-500">
            <Input placeholder="Label" name="label"
                onChange={onChange}
                maxLength={500}

                value={state.label}
            />

        </Form.Item>

        <Form.Item label="Default Value" className="font-500">
            <Input placeholder="Value" disabled={state.type == 'file'} name="defaultValue"
                onChange={onChange}
                maxLength={500}
                value={state.defaultValue}
                type={state.type == 'radio' || state.type == 'checkbox' ? 'text' : state.type}
            />

        </Form.Item>

        {state.type !== 'checkbox' &&
            state.type !== 'radio' &&
            state.type !== 'select' ? <>


            {state.type !== 'file' && state.type !== 'color' && state.type !== 'range' &&
                <Form.Item label="Placeholder" className="font-500">
                    <Input placeholder="placeholder" name="placeholder"
                        onChange={onChange}
                        maxLength={500}
                        value={state.placeholder}
                        type="text"
                        required />
                </Form.Item>}



            {state.type === 'number' && <Space direction="horizontal" size={10}><Form.Item label="Min" className="font-500">
                <Input placeholder="Min" name="min"
                    onChange={onChange}
                    maxLength={100}
                    value={state.min}
                    type="Number"
                />
            </Form.Item> <Form.Item label="Max" className="font-500">
                    <Input placeholder="Max" name="max"
                        onChange={onChange}
                        maxLength={100}
                        value={state.max}
                        type="Number"
                    />
                </Form.Item></Space>}

            {(state.type !== 'range' && state.type !== 'color' && state.type !== 'file' && state.type !== 'select') && <Form.Item label="Regex" className="font-500">
                <Input placeholder="Value" name="regex"
                    onChange={onChange}
                    maxLength={500}
                    value={state.regex}
                    type="text"
                />

            </Form.Item>}

            {(state.type === 'file') && <><Form.Item label="Accepted Documents" className="font-500">
                <Select name="acceptOptions"
                    onChange={onChangeAccepted}
                    value={state.acceptOptions}
                    mode="multiple"
                >
                    {acceptOptions.map(v => <Option value={v}>{v}</Option>)}
                </Select>

            </Form.Item>
                <Form.Item label="Max Size" className="font-500">
                    <Select name="maxSize"
                        onChange={onChangeMaxSize}
                        value={state.maxSize}
                    >
                        <Option value="1" label="< 1MB"> &lt; 1MB </Option>
                        <Option value="5" label="< 5MB"> &lt; 5MB </Option>
                        <Option value="10" label="< 10MB"> &lt; 10MB </Option>
                        <Option value="20" label="< 20MB"> &lt; 20MB </Option>
                        <Option value="50" label="< 50MB"> &lt; 50MB </Option>
                    </Select>

                </Form.Item> </>}




        </>

            : <Form.Item>
                <AddArrayTypes
                    state={state}
                    states={state.states}
                    onAdd={onAddArrayValue}
                    onRemove={onRemoveArrayValue}
                    onChange={onChangeArrayValue}
                />
            </Form.Item>
        }

        <Form.Item label="Error Message" className="font-500">
            <TextArea placeholder="Error message" name="errorMessage"
                onChange={onChange}
                maxLength={500}
                value={state.errorMessage}

            />

        </Form.Item>


        <Form.Item label="isRequired?" className="font-500">
            <Checkbox
                onChange={(e) => {
                    e.preventDefault();


                    state.required = !state.required
                    onChangeState();
                }}
                checked={state.required}
            >Yes</Checkbox>
        </Form.Item>

        {state.type == 'select' && <Form.Item label="isMultiple?" className="font-500">
            <Checkbox
                onChange={(e) => {
                    e.preventDefault();
                    state.multiple = !state.multiple
                    onChangeState();

                }}
                checked={state.multiple}
            >Yes</Checkbox>
        </Form.Item>}

        {state.type !== 'select' && <>


            <Form.Item label="Label Position" className="font-500">
                <Select style={{ width: '100%' }} value={state.labelPos} onChange={onChangeLabel}>
                    {[

                        { label: 'Label Before', value: 0 },
                        { label: 'Label After', value: 1 },
                    ].map(option => (
                        <Option key={option.value} value={option.value}>
                            {option.label}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
        </>}
    </>




};

