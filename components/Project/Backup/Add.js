import { Form, Button, Modal, Input, Checkbox, message, Switch } from "antd";
import { useState, useEffect } from "react";
import { InfoCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;

export default function AddBackup({ onSubmit, backup = {} }) {


    const [form] = Form.useForm();
    const [backupModal, setBackupModalOpen] = useState(false);
    const [image, setImage] = useState('');
    const [showField, setShowField] = useState(false);

    const onChangePublicStatus = () => {
        setShowField(!showField);
    };

    useEffect(() => {

        if (!backup) {
            return;
        }

        form.setFieldsValue(backup);
        setImage(backup.preview);
        setShowField(backup.published);


        setBackupModalOpen(true);

    }, [backup]);


    const onCancel = () => setBackupModalOpen(false);

    const onSelect = (image) => {
        setImage(image?.path)
        form.setFieldsValue({ preview: image?.path });

    }

    const onRemove = (image) => {
        setImage('')
        form.setFieldsValue({ preview: '' });

    }

    return (
        <Modal
            open={backupModal}
            title={`${backup?._id == -1 ? 'Add a new' : 'Edit'} backup`}
            okText="Save"
            closable
            footer={
                <div style={{padding: 5}}>
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button type="primary" onClick={() => {


                        form
                            .validateFields()
                            .then(async (values) => {

                                if (await onSubmit(values)){
                                    form.resetFields();
                                    setBackupModalOpen(false);

                                }
                                else
                                    setBackupModalOpen(true);


                            })
                            .catch((info) => {
                                setBackupModalOpen(true);

                                message.error('Validate Failed.');

                            });

                    }}>Save</Button>
                </div>
            }
            onCancel={onCancel}

        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
                initialValues={{}}
            >

                <Form.Item
                    name="name"
                    className="font-500"
                    label="Name"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter the backup name (alphanumeric).',
                            pattern: /^[a-zA-Z0-9\s]+$/
                        },
                    ]}
                >
                    <Input maxLength={100} type="text" />

                </Form.Item>


                {backup?._id !== -1 && <>
                    <Form.Item name="update" valuePropName="checked">
                        <Checkbox >Update (Update this backup with current files)</Checkbox>

                    </Form.Item>
                </>
                }

                <Form.Item name="published"
                    className="font-500"
                    label="Public"
                    valuePropName="checked"
                    tooltip={{ title: 'Public Theme', icon: <InfoCircleOutlined /> }}

                >
                    <Switch onChange={onChangePublicStatus} checked={backup?.published} />
                </Form.Item>




                {showField && <> <Form.Item
                    name="desc"
                    label="Description"
                    className="font-500"
                    tooltip={{ title: 'Theme Description', icon: <InfoCircleOutlined /> }}

                >
                    <TextArea maxLength={1000} placeholder="Description" rows={4} />
                </Form.Item>

                    <Form.Item name="preview" className="font-500" label="Preview"
                        tooltip={{ title: 'Theme Preview', icon: <InfoCircleOutlined /> }}
                    >
                        <Input hidden />
                        <ImageComponent image={image} onSelect={onSelect} onRemove={onRemove} />

                    </Form.Item></>}





            </Form>
        </Modal>
    );

};

