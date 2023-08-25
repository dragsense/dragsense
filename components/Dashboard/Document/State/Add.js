import { Form, Select, Tooltip, Button, Divider, Image, Space } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { useState, useCallback, useEffect } from "react";

const { Option } = Select;


import AddGeneralTypes from './AddGeneralTypes'
import AddArrayTypes from './AddArrayTypes'

import MediaModal from "@/components/Dashboard/Media/MediaModal";

import StateList from "./StateList";

export default function AddState({ state, onChangeState }) {

    const [mediaModal, setMediaModal] = useState(false);


    const onChangeArrayValue = (evt, idx) => {
        state.defaultValue[idx] = evt.target.value;
        onChangeState();


    };

    const onChangeImage = (images) => {

        state.defaultValue = [...images];
        onChangeState();



    }

    const onAddArrayValue = () => {
        if (!Array.isArray(state.defaultValue))
            state.defaultValue = [];

        state.defaultValue = [...state.defaultValue, ''];
        onChangeState();

    };

    const onRemoveArrayValue = idx => {
        state.defaultValue.splice(idx, 1);
        onChangeState();

    };


    const onAddObjectArrayValue = () => {
        if (!Array.isArray(state.defaultValue))
            state.defaultValue = [];

        state.defaultValue = [...state.defaultValue, JSON.parse(JSON.stringify({...state.states}))];
        onChangeState();
    }; 
  
    const onRemoveObjectArrayValue = idx => {
        state.defaultValue.splice(idx, 1); 
        onChangeState();

    };


    return (
        <>
            <Form layout="vertical">


                {state.type == 'images' ?
                    <Form.Item label="Image" >

                        <Space>
                            {Array.isArray(state.defaultValue) ? state.defaultValue.map(image => <Image
                                width="100%"
                                onClick={() => setMediaModal(true)}
                                preview={false}
                                style={{
                                    width: '120px',
                                    height: '120px',
                                    cursor: 'pointer'
                                }}
                                alt={image.alt}
                                src={image.src}
                                fallback="/images/default/default-img.png" />) : <Image
                                width="100%"
                                onClick={() => setMediaModal(true)}
                                preview={false}
                                style={{
                                    width: '120px',
                                    height: '120px',
                                    cursor: 'pointer'
                                }}
                                src="/images/default/default-img.png"
                                fallback="/images/default/default-img.png" />}
                        </Space>
                    </Form.Item>
                     : state.type == 'object' ? <>
                     <Form.Item label="value" >
                    
                         <StateList type={state.type} 
                         states={state.states || {}} 
                         onChangeState={onChangeState}
 
                         />
                     </Form.Item>
 
                 </>
 
                     : state.type == 'array' || state.type == 'object_array' ? <>
                         <Form.Item label="values" >
 
                             <StateList type={state.type} states={Array.isArray(state.defaultValue) ? state.defaultValue : []} onChangeState={onChangeState}
                                 onRemove={onRemoveObjectArrayValue}
                             />
                         </Form.Item>
 
                         <Form.Item>
                             <Button type="dashed" onClick={onAddObjectArrayValue} block icon={<PlusOutlined />}>
                                 Add
                             </Button>
                         </Form.Item></>
 
                         :
                        <AddGeneralTypes state={state} onChangeState={onChangeState} />
                }

            </Form>

            <MediaModal open={mediaModal} type="images" multiple={true} onClose={() => setMediaModal(false)} srcs={Array.isArray(state.defaultValue) ? state.defaultValue : []} onSelect={onChangeImage} />

        </>

    );
};

