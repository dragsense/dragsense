import { useState, useEffect, useCallback } from "react";
import { Form, Modal, Input, message, Checkbox } from "antd";

const { TextArea } = Input;

export default function AddIcon({ icon, onSubmit }) {

    const [iconModal, setIconModalOpen] = useState(false);
    const [form] = Form.useForm();


    useEffect(() => {

        if (!icon) {
            return;
        }

        form.setFieldsValue(icon);
        setIconModalOpen(true);

    }, [icon]);


    const onCancel = () => setIconModalOpen(false);

    return <>
        <Modal
            open={iconModal}
            title="Add/Edit Icon"
            okText="Save"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={() => {
                setIconModalOpen(false);

                form
                    .validateFields()
                    .then(async (values) => {


                        if (await onSubmit({ ...values }))
                            form.resetFields();
                        else
                            setIconModalOpen(true);

                    })
                    .catch((info) => {
                        setIconModalOpen(true);

                        message.error('Validate Failed.');

                    });
            }}
        >
            <Form form={form}
                layout="vertical"
                initialValues={{}} >

                <Form.Item label="Icon Name"
                    name="name"

                    rules={[
                        {
                            required: true,
                            message: 'Please enter the name.',
                        },
                        {
                            min: 2,
                            message: 'Name must be at least 2 characters long',
                        }
                    ]}

                    className="font-500">
                    <Input placeholder="Name" name="name"
                        required />
                </Form.Item>

                <Form.Item label="Icon Classes" name="classes" className="font-500">
                    <Input placeholder="classes" name="classes"
                        required />
                </Form.Item>
                <Form.Item label="Icon Svg" name="svg" className="font-500">
                    <TextArea placeholder="svg" name="svg"
                         />
                </Form.Item>
              
            </Form>
        </Modal>
    </>




};

