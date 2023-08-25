import { Form, Space, Button, Select, Input, Checkbox, Image } from "antd";
const { Option } = Select;
import { useState } from "react";

import MediaModal from "@/components/Dashboard/Media/MediaModal";

import { TYPES } from '../Add';
import Video from "@/components/Dashboard/Media/Video";
import Audio from "@/components/Dashboard/Media/Audio";
import { UploadOutlined } from "@ant-design/icons";


export default function AddGeneralTypes({ setState, state }) {

    const [mediaModal, setMediaModal] = useState(false);
    const [type, setType] = useState("images");

    const onChange = (event) => {
        event.preventDefault();

        let value = event.target.value;
        const name = event.target.name;

        setState({ ...state, [name]: value })
    }


    const onChangeBoolean = (event) => {
        event.preventDefault();

        setState({ ...state, defaultValue: !state.defaultValue })
    };


    const onChangeImage = (media) => {


        if (type == 'images') {
            setState({
                ...state,
                defaultValue: media[0].src,
                src: media[0]
            });
        }
        else {
            setState({
                ...state,
                srcs: media
            });
        }

    }

    const onChangeType = (value) => {
        setState({ ...state, type: value });
    }


    const srcs = type == 'images' ? state.src : [...(state.srcs ? state.srcs : [])];

    return <>

        <Form.Item label="Select Type" className="font-500">
            <Select style={{ width: 120 }} value={state.type} defaultValue={state.type} onChange={onChangeType}>
                {TYPES.map(type => <Option value={type.value}>{type.label}</Option>)}

            </Select>

        </Form.Item>


        {state.type == 'boolean' ?
            <Form.Item label="Value" className="font-500">
                <Checkbox checked={state.defaultValue} onChange={onChangeBoolean} > On </Checkbox>
            </Form.Item>
            : state.type == 'image' ?

                <Form.Item label="Image" >

                    <Image

                        onClick={() => {
                            setType('images')

                            setMediaModal(true)
                        }}
                        preview={true}
                        style={{
                            width: '120px',
                            height: '120px',
                            cursor: 'pointer'
                        }}
                        alt={state.src?.alt}
                        src={state.src?.src}
                        fallback="/images/default/default-img.png" />
                </Form.Item>

                : state.type == 'video' ?
                    <>
                        <Form.Item label="srcs:">
                            <Button onClick={() => {
                                setType('videos')

                                setMediaModal(true)
                            }} icon={<UploadOutlined />}>Upload</Button>
                            <br />
                            <br />
                            <div style={{ display: 'flex', gap: 10 }}>
                                {Array.isArray(state.srcs) && state.srcs.map((src, index) => (
                                    <div style={{ width: 320 }}><Video src={src.src} alt={src.alt} mimetype={src.mimetype} /></div>
                                ))}
                            </div>
                        </Form.Item>
                        <Form.Item label="Poster">
                            <Image

                                onClick={() => {
                                    setType('images')

                                    setMediaModal(true)
                                }}
                                preview={false}
                                style={{
                                    width: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                    height: '120px',
                                    cursor: 'pointer'
                                }}
                                alt="video poster"
                                src={state.src?.src}
                                fallback="/images/default/default-poster.png" />
                        </Form.Item>
                    </>
                    : state.type == 'audio' ?
                        <Form.Item label="srcs:">
                            <Button onClick={() => {
                                setType('audios')

                                setMediaModal(true)
                            }} icon={<UploadOutlined />}>Upload</Button>
                            <br />
                            <br />
                            <div style={{ display: 'flex', gap: 10 }}>
                                {Array.isArray(state.srcs) && state.srcs.map((src, index) => (
                                    <div style={{ width: 360 }}><Audio src={src.src} alt={src.alt} mimetype={src.mimetype} /></div>
                                ))}
                            </div>
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

        <MediaModal open={mediaModal}
            type={type}
            multiple={type == 'videos' || type == 'audios'}
            onClose={() => setMediaModal(false)} srcs={srcs} onSelect={onChangeImage} />

    </>




};

