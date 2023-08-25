import { Form, Modal, Input, Radio, message } from "antd";
import { useState, useEffect } from "react";

export default function AddVariable({ onSubmit, variable = {} }) {
    const [form] = Form.useForm();
    const [variableModal, setVariableModalOpen] = useState(false);


    useEffect(() => {

        if (!variable) {
            return;
        }
        form.setFieldsValue(variable);
        setVariableModalOpen(true);
    }, [variable]);




    const onCancel = () => setVariableModalOpen(false);


    return (
        <Modal
            visible={variableModal}
            title={`${variable?.id === -1 ? "Add a new" : "Edit"} variable`}
            okText="Save"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={() => {
                setVariableModalOpen(false);

                form
                    .validateFields()
                    .then(async (values) => {
                        if (await onSubmit(values)) {
                            form.resetFields();
                        } else {
                            setVariableModalOpen(true);
                        }
                    })
                    .catch((info) => {
                        setVariableModalOpen(true);
                        message.error("Validation Failed.");
                    });
            }}
        >
            <>
                <Form form={form} layout="vertical" name="form_in_modal" initialValues={{}}>
                    <Form.Item
                        name="name"
                        label="Variable Name"
                        className="variable-500"
                        rules={[
                            {
                                required: true,
                                message: "Please enter the variable name (alphanumeric).",
                                pattern: /^[a-zA-Z0-9\s]+$/,
                            },
                        ]}
                    >
                        <Input type="text" />
                    </Form.Item>

                    <Form.Item label="Value" name="value"  rules={[
                            {
                                required: true,
                                message: "Please enter the value.",
                            },
                        ]}>
                        <Input type="text" />
                    </Form.Item>

                    <Form.Item label="Type" name="type"  rules={[
                            {
                                required: true,
                                message: "Please select the type.",
                            },
                        ]}>
                        <Radio.Group>
                            <Radio.Button value="font">Font</Radio.Button>
                            <Radio.Button value="size">Size</Radio.Button>
                            <Radio.Button value="space">Space</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                </Form>

            </>
        </Modal>
    );
}