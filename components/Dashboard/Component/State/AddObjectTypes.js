import { useState, useEffect, useCallback } from "react";
import { Form, Modal, Input, message } from "antd";


import AddGeneralTypes from './AddGeneralTypes';

export default function AddObjectTypes({ newState, onAddNew, setNewState }) {

    const [objectTypesModal, setObjectTypesModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [state, setState] = useState({});


    useEffect(() => {

        if (!newState) {
            return;
        }
       
        setState(newState);

        setObjectTypesModalOpen(true);

    }, [newState]);


    const onChange = (event) => {
        event.preventDefault();

        let value = event.target.value;
        const name = event.target.name;

        setState({ ...state, [name]: value.toLowerCase() })
    }


    const onCancel = () => setObjectTypesModalOpen(false);

    return <>
        <Modal
            open={objectTypesModal}
            title={`${state?.key !== '' ? 'Add a new' : 'Edit'} inner state`}
            okText="Add"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={() => {
                setObjectTypesModalOpen(false);

                form
                    .validateFields()
                    .then(async (values) => {

                       
                        onAddNew({key: state.key, defaultValue: state.defaultValue, type: state.type});
                        setNewState(null);
                        form.resetFields();

                    })
                    .catch((info) => {

                        setObjectTypesModalOpen(true);

                        message.error('Validate Failed.');

                    });
            }}
        >
            <Form form={form} 
            layout="vertical"
                initialValues={{}} >
                <Form.Item label="Key"
                    
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
                        disabled={!state.new}
                        onChange={onChange}
                        value={state.key}
                         />
                         
                </Form.Item>



                <AddGeneralTypes setState={setState} state={state} />
            </Form>
        </Modal>
    </>




};

