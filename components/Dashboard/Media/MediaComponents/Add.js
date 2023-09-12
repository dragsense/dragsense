import { useState, useEffect, useCallback } from "react";
import { Form, Modal, Input, message, Checkbox } from "antd";



export default function AddMedia({ media, onSubmit }) {

    const [mediaModal, setMediaModalOpen] = useState(false);
    const [form] = Form.useForm();


    const handleCheckboxChange = (name, value) => {
        setValues({ ...checkValues, [name]: value });
    };

    useEffect(() => {

        if (!media) {
            return;
        }

        form.setFieldsValue(media);
        setMediaModalOpen(true);

    }, [media]);


    const onCancel = () => setMediaModalOpen(false);

    return <>
        <Modal
            open={mediaModal}
            title="Edit Media"
            okText="Save"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={() => {
                setMediaModalOpen(false);

                form
                    .validateFields()
                    .then(async (values) => {

                        if (await onSubmit({...values }))
                            form.resetFields();
                        else
                            setMediaModalOpen(true);

                    })
                    .catch((info) => {
                        setMediaModalOpen(true);

                        message.error('Validate Failed.');

                    });
            }}
        >
            <Form form={form}
                layout="vertical"
                initialValues={{}} >

                <p>File Size: <strong>{media?.size} Bytes </strong></p>
                {media?.dimensions && (
                    <p>
                        Dimensions: <strong>{media.dimensions?.width} x {media.dimensions?.height}</strong>
                    </p>
                )}

                <Form.Item label="Media Name"
                    name="name"

                    rules={[
                        {
                            required: true,
                            message: 'Please enter the name.',
                        },
                        {
                            min: 2,
                            message: 'Name must be at least 2 characters long',
                        },
                        {
                            max: 70,
                            message: 'Name must be at most 70 characters long',
                        }
                    ]}

                    className="font-500">
                    <Input placeholder="Name" name="name"
                        required />
                </Form.Item>

                <Form.Item label="Media Alt" name="alt" 
                className="font-500"
                
                rules={[
                       
                        {
                            min: 2,
                            message: 'Alt Text must be at least 2 characters long',
                        },
                        {
                            max: 40,
                            message: 'Alt Text be at most 40 characters long',
                        }
                    ]}
                
                >
                    <Input placeholder="alt text" name="alt"
                        required />
                </Form.Item>

            </Form>
        </Modal>
    </>




};

