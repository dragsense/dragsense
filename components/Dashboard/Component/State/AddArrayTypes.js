import { useEffect, useState } from "react";
import { Form, Input, Button, Row, Col } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

export default function AddArrayTypes({ state, states, onAdd, onRemove, onChange }) {
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleAddValue = () => {
        const values = inputValue.split(",").filter((value) => value !== "");
        onAdd(values);
        setInputValue("");
    };

    const handleArrayValueChange = (e, idx) => {
        onChange(e.target.value, idx);
    };

    useEffect(() => {
        if (!states)
            states = {};


        setInputValue(Object.values(states).flatMap((value) => value))
    }, [state])

    return (
        <Row gutter={8}>
            <Col flex="auto">
                <Form.Item>
                    <Input.TextArea
                        rows={4}
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Enter multiple values separated by spaces"
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="dashed"
                        onClick={handleAddValue}
                        block
                        icon={<PlusOutlined />}
                    >
                        Save
                    </Button>
                </Form.Item>
            </Col>
            <Col flex="auto">
                {Object.values(states).map((value, idx) => (
                        <Form.Item key={idx}>
                            <Input
                                type="text"
                                placeholder={`Value #${idx + 1}`}
                                value={value}
                                onChange={(e) => handleArrayValueChange(e, idx)}
                                addonAfter={
                                    <MinusCircleOutlined onClick={() => onRemove(idx)} />
                                }
                            />
                        </Form.Item>
                    ))}
            </Col>
        </Row>
    );
}