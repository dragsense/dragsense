import { Form, Select, Input, Checkbox, Space } from "antd";
const { Option } = Select;
const { TextArea } = Input;


import { TYPES } from './Add';
import AddArrayTypes from "./AddArrayTypes";

export default function AddFormTypes({ onChangeState, state }) {


    const onChange = (event) => {
        event.preventDefault();

        let value = event.target.value;
        const name = event.target.name;
        state[name] = value;
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

    const onChangeArrayValue = (evt, idx) => {
        state.states[idx] = evt.target.value;
        onChangeState();

    };


    const onAddArrayValue = (values) => {

        state.states = {};
        values.forEach((value, index) => {
            state.states[index] = value;
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

                value={state.label}
            />

        </Form.Item>

        <Form.Item label="Default Value" className="font-500">
                <Input placeholder="Value" disabled={state.type == 'file'} name="defaultValue"
                    onChange={onChange}

                    value={state.defaultValue}
                    type={state.type == 'radio' || state.type == 'checkbox' ? 'text' : state.type}
                />

            </Form.Item>

        {state.type !== 'checkbox' &&
            state.type !== 'radio' &&
            state.type !== 'select' ? <>


            {state.type !== 'file' && state.type !== 'color' && state.type !== 'range' && 
            <Form.Item label="Placeholder" className="font-500">
                <Input  placeholder="placeholder" name="placeholder"
                    onChange={onChange}
                    value={state.placeholder}
                    type="text"
                    required />
            </Form.Item>}

      

            {state.type === 'number' && <Space direction="horizontal" size={10}><Form.Item label="Min" className="font-500">
                <Input placeholder="Min" name="min"
                    onChange={onChange}

                    value={state.min}
                    type="Number"
                />
            </Form.Item> <Form.Item label="Max" className="font-500">
                    <Input placeholder="Max" name="max"
                        onChange={onChange}

                        value={state.max}
                        type="Number"
                    />
                </Form.Item></Space>}

            {(state.type !== 'range' && state.type !== 'color') && <Form.Item label="Regex" className="font-500">
                <Input placeholder="Value" name="regex"
                    onChange={onChange}

                    value={state.regex}
                    type="text"
                />

            </Form.Item>}




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

