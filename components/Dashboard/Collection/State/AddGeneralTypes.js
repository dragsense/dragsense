import { Form, Space, Select, Input, Checkbox, Image, Modal, Button } from "antd";
import { useState } from "react";

import dynamic from 'next/dynamic';
const { Option } = Select;
const { TextArea } = Input;

import RichTextEditor from "../Content";


import MediaModal from "@/components/Dashboard/Media/MediaModal";
import Video from "@/components/Dashboard/Media/Video";
import Audio from "@/components/Dashboard/Media/Audio";

import { TYPES } from '../Add';
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";

const initialState = {
    key: '',
    defaultValue: null,
    values: [],
    type: 'text',
    new: true,
    states: {}
};
export default function AddGeneralTypes({ host, isChange, setState, state }) {

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
        const name = event.target.name;
        setState({ ...state, [name]: !state[name] })
    };

    const onChangeContent = (content) => {
        setState({ ...state, defaultValue: content })
    }


    const onChangeImage = (media) => {


        if (type == 'images' || type == 'docs') {
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
        if (isChange)
            Modal.confirm({
                title: 'Switching Type',
                content: 'Are you sure you want to switch to the type? Any unsaved changes may be lost.',
                onOk: () => {
                    setState({ ...initialState, states: {}, key: state.key, new: state.new, type: value });
                },
                onCancel: () => {
                    // Do nothing when the user cancels the confirmation
                },
            });
        else
            setState({ ...state, type: value });

    }

    const srcs = type == 'images' ? state.src : [...(state.srcs ? state.srcs : [])];

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
                        onClick={() => {
                            setType('images')

                            setMediaModal(true)
                        }}
                        preview={false}
                        style={{
                            width: '120px',
                            height: '120px',
                            cursor: 'pointer',
                            objectFit: 'cover',
                        }}
                        alt={state.src?.alt}
                        src={host+state.src?.src}
                        fallback="/images/default/default-img.png" />
                </Form.Item>
                : state.type == 'content' ?
                    <Form.Item label="Content" className="font-500">
                        <RichTextEditor content={state.defaultValue} onSave={onChangeContent} />
                    </Form.Item>
                    :
                    state.type == 'video' ?
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
                                        <div key={index} style={{ width: 320, position: 'relative' }}>
                                            <DeleteOutlined style={{ position: 'absolute', top: -20, right: 0 }} onClick={() => {
                                                state.srcs.splice(index, 1);
                                                setState({
                                                    ...state
                                                });
                                            }} />
                                            <Video src={host+src.src} alt={src.alt} mimetype={src.mimetype} />
                                        </div>
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
                                    src={host+state.src?.src}
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
                                        <div key={index} style={{ width: 360, position: 'relative' }}>
                                            <DeleteOutlined style={{ position: 'absolute', top: -20, right: 0 }} onClick={() => {
                                                state.srcs.splice(index, 1);
                                                setState({
                                                    ...state
                                                });
                                            }} />

                                            <Audio src={host+src.src} alt={src.alt} mimetype={src.mimetype} /></div>
                                    ))}
                                </div>
                            </Form.Item>
                            : state.type == 'doc' || state.fileType == 'doc' ?
                                <Form.Item label="src:">
                                    <Button onClick={() => {
                                        setType('docs')

                                        setMediaModal(true)
                                    }} icon={<UploadOutlined />}>Upload</Button>
                                    <br />
                                    <br />
                                    <a href={host+state.defaultValue} target="_blank" rel="noopener noreferrer">
                                        <FileOutlined style={{ fontSize: 48 }} />
                                    </a>
                                </Form.Item>
                                :
                                <><Form.Item label="Default Value" className="font-500">
                                    {state.type === 'text' ?

                                        <TextArea placeholder="Default Value" name="defaultValue"
                                            onChange={onChange}
                                            maxLength={1000}
                                            style={{ width: '100%' }}
                                            value={state.defaultValue}
                                            type={state.type}
                                        />
                                        : <Input placeholder="Default Value" name="defaultValue"
                                            onChange={onChange}
                                            style={{ width: 420 }}
                                            maxLength={100}
                                            type={state.type}
                                        />
                                    }</Form.Item>


                                    {state.type === 'number' && <Space direction="horizontal" size={10}><Form.Item label="Min" className="font-500">
                                        <Input
                                            maxLength={100}
                                            placeholder="Min" name="min"
                                            onChange={onChange}
                                            style={{ width: 200 }}
                                            value={state.min}
                                            type="Number"
                                        />
                                    </Form.Item> <Form.Item label="Max" className="font-500">
                                            <Input
                                                maxLength={100}

                                                placeholder="Max" name="max"
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

