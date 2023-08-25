import { Form, Input, Button, Divider } from "antd";
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

export default function AddArrayTypes({ states, onAdd, onRemove, onChange }) {


    return <> 

        {states?.map((value, idx) => (
            <>
            <Divider orientation="left" orientationMargin="0">{`[${idx}]`} </Divider>

                <Input
                    type="text"
                    placeholder={`Value #${idx + 1}`}
                    value={value}
                    onChange={(e) => onChange(e, idx)}
                />
                <MinusCircleOutlined onClick={() => onRemove(idx)} />

            </>
        ))}
        <Form.Item>
            <Button type="dashed" onClick={onAdd} block icon={<PlusOutlined />}>
                Add
            </Button>
        </Form.Item>
    </>
};

