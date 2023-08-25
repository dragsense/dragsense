import { useState, useEffect, useCallback } from "react";
import { Form, Modal, Input, message, Checkbox } from "antd";



export default function Downlaod({ project, onDownload }) {

    const [modal, setModalOpen] = useState(false);
    const [form] = Form.useForm();

    const [checkValues, setValues] = useState({
        isPage: true,
        isComponent: false,
        isCollection: false,
        isForm: false,
        isPublic: false

    });

    const handleCheckboxChange = (name, value) => {
        setValues({ ...checkValues, [name]: value });
    };

    useEffect(() => {

        if (!project)
            return;

        setModalOpen(true);
    }, [project])


    const handleAfterOpenChange = (visible) => {

        setValues({
            isPage: true,
            isComponent: false,
            isCollection: false,
            isForm: false,
            isPublic: false
        });

        form.setFieldsValue({ name: project.name });

    };


    const onCancel = () => setModalOpen(false);

    return <>
        <Modal
            open={modal}
            title="Download Project"
            okText="Download"
            cancelText="Cancel"
            onCancel={onCancel}
            afterOpenChange={handleAfterOpenChange}
            onOk={() => {
                setModalOpen(false);

                form
                    .validateFields()
                    .then(async (values) => {


                        if (!await onDownload(project._id, { ...values, ...checkValues }))
                            setModalOpen(true);

                    })
                    .catch((info) => {

                        setModalOpen(true);

                        message.error('Validate Failed.');

                    });
            }}
        >
            <Form form={form}
                layout="vertical"
                initialValues={{}} >

                <Form.Item label=" Name"
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

          

                <Form.Item label="isPage?" name="isPage" className="font-500">
                    <Checkbox
                        checked={checkValues.isPage}
                        onChange={(e) => handleCheckboxChange("isPage", e.target.checked)}
                    >
                        Yes
                    </Checkbox>
                </Form.Item>

                <Form.Item label="isComponent?" name="isComponent" className="font-500">
                    <Checkbox
                        checked={checkValues.isComponent}
                        onChange={(e) =>
                            handleCheckboxChange("isComponent", e.target.checked)
                        }
                    >
                        Yes
                    </Checkbox>
                </Form.Item>

                <Form.Item label="isCollection?" name="isCollection" className="font-500">
                    <Checkbox
                        checked={checkValues.isCollection}
                        onChange={(e) => handleCheckboxChange("isCollection", e.target.checked)}
                    >
                        Yes
                    </Checkbox>
                </Form.Item>



                <Form.Item
                    label="isForm?"
                    name="isForm"
                    className="font-500"
                >
                    <Checkbox
                        checked={checkValues.isForm}
                        onChange={(e) =>
                            handleCheckboxChange("isForm", e.target.checked)
                        }
                    >
                        Yes
                    </Checkbox>
                </Form.Item>

           
            </Form>
        </Modal>
    </>

};

