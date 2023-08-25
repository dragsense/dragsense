import { Form, Space, Select, Input, Checkbox, Image } from "antd";
import dynamic from 'next/dynamic';
const { Option } = Select;
const { TextArea } = Input;

import RichTextEditor from "../../Collection/Content";

import MediaModal from "@/components/Dashboard/Media/MediaModal";

import { TYPES } from '../Add';
import { useState } from "react";


export default function AddGeneralTypes({ onChangeState, state }) {

    const [mediaModal, setMediaModal] = useState(false);

    const onChange = (event) => {
        event.preventDefault();

        let value = event.target.value;
        state.defaultValue = value;

        onChangeState();
    }


    const onChangeBoolean = (event) => {
        event.preventDefault();
        state.defaultValue = !state.defaultValue;

        onChangeState();
    };

    const onChangeContent = (content) => {
        state.defaultValue = content;
        onChangeState();
    }

    const onChangeImage = (image) => {

        const newImage = image[0] ? image[0] :
            { _id: -1, src: '', alt: '' }

        state.defaultValue = newImage;

        onChangeState();

    }

    const onChangeType = (value) => {
        onChangeState();
    }



    return <>



        {state.type == 'boolean' ?
            <Form.Item label="Boolean" className="font-500">
                <Checkbox checked={state.defaultValue} onChange={onChangeBoolean} />
            </Form.Item>
            : state.type == 'image' ?
                <Form.Item label="Image" className="font-500">
                    <Image
                        width="100%"
                        onClick={() => setMediaModal(true)}
                        preview={false}
                        style={{
                            width: '120px',
                            height: '120px',
                            cursor: 'pointer'
                        }}
                        alt={state.defaultValue?.alt}
                        src={state.defaultValue?.src}
                        fallback="/images/default/default-img.png" />
                </Form.Item>
                : state.type == 'content' ?
                    <Form.Item label="Content" className="font-500">
                        <RichTextEditor content={state.defaultValue} onSave={onChangeContent} />
                    </Form.Item>
                    :
                    state.type === 'textarea' ? 
                        <Form.Item label="Value" className="font-500">
                            <TextArea placeholder="Min" name="min"
                                onChange={onChange}
                                style={{ width: 300 }}
                                value={state.defaultValue}
                                type="Number"
                            />
                        </Form.Item> :
                        <><Form.Item label="Value" className="font-500">
                            <Input placeholder="Value" name="defaultValue"
                                onChange={onChange}
                                style={{ width: 300 }}
                                value={state.defaultValue}
                                type={state.type}
                            />
                        </Form.Item>

                            {state.type === 'number' &&

                                <Space direction="horizontal" size={10}><Form.Item label="Min" className="font-500">
                                    <Input placeholder="Min" name="min"
                                        onChange={onChange}
                                        style={{ width: 200 }}
                                        value={state.min}
                                        type="Number"
                                    />
                                </Form.Item>

                                    <Form.Item label="Max" className="font-500">
                                        <Input placeholder="Max" name="max"
                                            onChange={onChange}
                                            style={{ width: 200 }}
                                            value={state.max}
                                            type="Number"
                                        />
                                    </Form.Item>
                                </Space>}
                        </>}

                        <MediaModal open={mediaModal} type="images" onClose={() => setMediaModal(false)} srcs={[state.defaultValue?._id ? state.defaultValue : []]} onSelect={onChangeImage} />

                    </>




};

