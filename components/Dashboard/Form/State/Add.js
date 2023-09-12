import { Form, Space, Input, Button, message } from "antd";
import { useState, useEffect } from "react";


import AddFormTypes from "./AddFormTypes";

export const TYPES = [
    { value: 'text', label: 'TEXT' },
    { value: 'number', label: 'NUMBER' },
    { value: 'email', label: 'EMAIL' },
    { value: 'tel', label: 'TEL' },
    { value: 'password', label: 'PASSWORD' },
    { value: 'select', label: 'SELECT' },
    { value: 'file', label: 'FILE' },
    { value: 'radio', label: 'RADIO GROUP' },
    { value: 'checkbox', label: 'CHECKBOX GROUP' },
    { value: 'range', label: 'RANGE' },
    { value: 'url', label: 'URL' },
    { value: 'time', label: 'TIME' },
    { value: 'date', label: 'DATE' },
    { value: 'datetime', label: 'DATETIME' },
    { value: 'month', label: 'MONTH' },
    { value: 'week', label: 'WEEK' },
    { value: 'hidden', label: 'HIDDEN' },
    { value: 'textarea', label: 'TEXTAREA' },

];


export default function AddState({ newState, onAddNew, setNewState }) {


    const [state, setState] = useState({});
    const [form] = Form.useForm();

    useEffect(() => {
        if (!newState.states)
            newState.states = {}
        setState(newState);
        form.setFieldsValue(newState);
    }, [newState])


    const onChange = (event) => {
        event.preventDefault();

        const value = event.target.value;
        const name = event.target.name;

        setState({ ...state, [name]: value })
    }



    const onAdd = (e) => {

        form
            .validateFields()
            .then(async (values) => {

                const key = state.key.toLowerCase().replace(/\s+/g, "-");


                onAddNew({
                    ...state, key, new: undefined
                });
                setNewState(null);

            })
            .catch((info) => {
                console.log(info)
                message.error('Validate Failed.');

            });

    }


    const onChangeState = () => {

        setState({ ...state });

    }



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
                         maxLength={60}

                        name="key"
                        onChange={onChange}
                        value={state.key}
                        disabled={!state.new}
                        required />
                </Form.Item>


                <AddFormTypes state={state} onChangeState={onChangeState} />


                <Form.Item className="text-right">
                    <Space>
                        <Button type="default" onClick={() => { setNewState(null) }}>Cancel</Button>
                        <Button type="primary" onClick={onAdd} > 
                        {state.new ? 'Add' : 'Update' }

                         </Button>
                    </Space>
                </Form.Item>
            </Form>
        </>

    );
};

