import { Form, Input, Button, Card } from "antd";
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

export default function AddArrayTypes({ states, onAdd, onRemove, onChange }) {


    return <> <Card title="Array Values">

        {Array.isArray(states) && states?.map((value, idx) => (
            <>
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
    </Card></>
};

