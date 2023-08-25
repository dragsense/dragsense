
import { Form, Modal, Input, Checkbox, message, Select } from "antd";
import { useState, useEffect, useReducer } from "react";

const { Option } = Select;
const { TextArea } = Input;
import MediaServices from "@/lib/services/media";
import MediaModal from "@/components/Dashboard/Media/MediaModal";
import { FileOutlined } from "@ant-design/icons";

const reducer = (state, action) => {

    switch (action.type) {
        case "start":
            return { ...state, loading: true }
        case "load":
            return { ...state, layouts: action.data }
        case "finish":
            return { ...state, loading: false }
        default:
            return state;
    }
};


export default function AddFont({ onSubmit, font = {} }) {


    const [states, dispatch] = useReducer(reducer, { laoding: false, fonts: [] });
    const [mediaModal, setMediaModal] = useState(false);

    const [form] = Form.useForm();
    const [fontModal, setFontModalOpen] = useState(false);
    const [fontSrc, setFontSrc] = useState([]);
    const [isGoogleFont, setIsGoogleFont] = useState(false);




    const onChangeMedia = (media) => {
        const fonts = media.map(f => { return { _id: f._id, name: f.name, src: f.src, format: f.format } });
        form.setFieldsValue({ src: null });
        setFontSrc(fonts);
    }

    useEffect(() => {

        if (!font) {
            return;
        }

        form.setFieldsValue(font);
        setFontSrc(font.fontSrc || []);
        setIsGoogleFont(font.isGoogleFont || false);
        setFontModalOpen(true);

    }, [font]);


    const onCancel = () => setFontModalOpen(false);




    return (
        <>

            <Modal
                open={fontModal}
                title={`${font?.id == -1 ? 'Add a new' : 'Edit'} font`}
                okText="Save"
                cancelText="Cancel"
                onCancel={onCancel}
                onOk={() => {
                    setFontModalOpen(false);

                    form
                        .validateFields()
                        .then(async (values) => {

                            if (await onSubmit({
                                ...values,
                                isGoogleFont, fontSrc
                            }))
                                form.resetFields();
                            else
                                setFontModalOpen(true);


                        })
                        .catch((info) => {
                            setFontModalOpen(true);

                            message.error('Validate Failed.');

                        });
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                    initialValues={{}}
                >

                    <Form.Item
                        name="name"
                        label="Font Name"
                        className="font-500"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the font name (alphanumeric).',
                                pattern: /^[a-zA-Z0-9\s]+$/
                            },
                        ]}
                    >
                        <Input type="text" />

                    </Form.Item>
                    <Form.Item label="Font Family"

                        rules={[
                            {
                                required: true,
                                message: 'Please enter the font family.',
                            },
                        ]}
                        name="fontFamily" className="font-500">
                        <Input placeholder="Font Family" name="fontFamily" />
                    </Form.Item>



                    <Form.Item label="is Google Font?">
                        <Checkbox
                            checked={isGoogleFont}
                            onChange={(e) => setIsGoogleFont(e.target.checked)}
                        >
                            Yes
                        </Checkbox>
                    </Form.Item>

                    {!isGoogleFont ? <><label style={{ cursor: "pointer" }} onClick={() => setMediaModal(true)}>
                        
                        <FileOutlined style={{ fontSize: 48 }} />
                    </label>

                        <Form.Item label="Selected Fonts:" style={{marginTop: 10}}>
                            <ol style={{fontSize: 14}}>
                                {fontSrc.map(f => <><li>{`${f.name}`} <strong>{`(${f.format})`}</strong></li></>)}
                            </ol>
                        </Form.Item>

                    </>
                        :

                        <Form.Item label={isGoogleFont ? 'Link' : 'Srcs'} name="src" style={{ marginTop: 10 }}>
                            <TextArea disabled={!isGoogleFont} rows={4} placeholder="Google Font" />

                        </Form.Item>}

                </Form>
            </Modal>

            <MediaModal open={mediaModal}
                type={"fonts"}
                multiple={true}
                onClose={() => setMediaModal(false)} srcs={fontSrc} onSelect={onChangeMedia} />
        </>
    );

};

