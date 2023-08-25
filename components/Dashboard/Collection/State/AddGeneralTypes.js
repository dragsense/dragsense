import { Form, Space, Select, Input, Checkbox, Image } from "antd";
import { useState } from "react";

import dynamic from 'next/dynamic';
const { Option } = Select;

import RichTextEditor from "../Content";


import MediaModal from "@/components/Dashboard/Media/MediaModal";

import { TYPES } from '../Add';


export default function AddGeneralTypes({ setState, state }) {

    const [mediaModal, setMediaModal] = useState(false);


    const onChange = (event) => {
        event.preventDefault();

        let value = event.target.value;
        const name = event.target.name;

        setState({ ...state, [name]: value })
    }


    const onChangeBoolean = (event) => {
        event.preventDefault();
        const name = event.target.name;
        setState({ ...state, [name]: !state[name] })
    };

    const onChangeContent = (content) => {
        setState({ ...state, defaultValue: content })
    }

    const onChangeImage = (image) => {

        const newImage = image[0] ? image[0] :
            { _id: -1, src: '', alt: '' }


        setState({ ...state, defaultValue: newImage });

    }

    const onChangeType = (value) => {
        setState({ ...state, type: value });
    }



    return <>

        <Form.Item label="Select Type" className="font-500">
            <Select style={{ width: 120 }} 
             value={state.type}
            defaultValue={state.type} onChange={onChangeType}>
                {TYPES.map(type => <Option value={type.value}>{type.label}</Option>)}

            </Select>

        </Form.Item>


        {state.type == 'boolean' ?
            <Form.Item label="Content" className="font-500">
                <Checkbox checked={state.defaultValue} onChange={onChangeBoolean} />
            </Form.Item>
            : state.type == 'image' ?
                <Form.Item label="Image" >

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
                    <><Form.Item label="Default Value" className="font-500">
                        <Input placeholder="Default Value" name="defaultValue"
                            onChange={onChange}
                            style={{ width: 300 }}
                            value={state.defaultValue}
                            type={state.type}
                        />
                    </Form.Item>

                        {state.type === 'number' && <Space direction="horizontal" size={10}><Form.Item label="Min" className="font-500">
                            <Input placeholder="Min" name="min"
                                onChange={onChange}
                                style={{ width: 200 }}
                                value={state.min}
                                type="Number"
                            />
                        </Form.Item> <Form.Item label="Max" className="font-500">
                                <Input placeholder="Max" name="max"
                                    onChange={onChange}
                                    style={{ width: 200 }}
                                    value={state.max}
                                    type="Number"
                                />
                            </Form.Item></Space>}
                    </>}

        <MediaModal open={mediaModal} type="images" onClose={() => setMediaModal(false)} srcs={[state.defaultValue?._id ? state.defaultValue : []]} onSelect={onChangeImage} />

    </>




};

