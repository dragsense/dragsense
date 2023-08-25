import { Form, Space, Input, Button, Select, Typography, Alert } from "antd";
import { QuestionCircleFilled, InfoCircleOutlined, CheckOutlined } from '@ant-design/icons';
import { useState, useCallback } from "react";
import { fetcher } from "@/lib/fetch";

const { Option } = Select;
const { TextArea } = Input;

const STATUS = ['DRAFT', 'PUBLIC'];

export default function AddComponent({ component }) {


    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [state, setState] = useState(component ? component :
        {
            id: '', name: '', slug: '', setting: {
                title: '',
                desc: '',
                status: STATUS[0]
            }
        });


    const onChange = (event) => {
        event.preventDefault();

        const value = event.target.value;
        const name = event.target.name;

        setState({ ...state, [name]: value.trim() })
    }

    const onChangeSetting = (event) => {
        event.preventDefault();

        const value = event.target.value;
        const name = event.target.name;

        setState({ ...state, setting: { ...setting, [name]: value.trim() } });
    }


    const onSubmit = useCallback(
        async (values) => {
            try {
                setIsLoading(true);
                setError('');
                const _component = await fetcher('/api/pages', {
                    method: component ? 'PATCH' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(state),
                });
                setState(_component);
            } catch (e) {
                setError(e?.message);
            } finally {
                setIsLoading(false);
            }
        },
        [state]
    );




    return (
        <>
            <div className="outter-box">
                <div className="inner-box">
                    <h1> {component ? 'Edit' : 'New'} Component </h1>
                    {error &&

                        <Alert message={error} type="error" showIcon />

                    }
                    <div> <Button type="default">Cancel</Button> <Button type="primary" loading={isLoading} onClick={onSubmit}>Save</Button></div>
                </div>
                <div className="inner-box">
                    <div className="inner-box border w-50p h-100p">
                        <div className="wrapper">
                            <h2>{component ? 'Edit' : 'Create'}</h2>
                            <div className="hr-line"></div>
                            <Form layout="vertical">

                                <Space direction="vertical" className="wrapper">
                                    <Form.Item label="Name" className="font-500">
                                        <Input placeholder="Name" name="name"
                                            onChange={onChange}
                                            value={state.name}
                                            required />
                                    </Form.Item>
                                </Space>
                            </Form>

                            <div className="inner-box border">
                                <div className="wrapper">
                                    <h3>{"States"} <QuestionCircleFilled /></h3>
                                    <div className="hr-line"></div>
                                    <Form layout="vertical">
                                        <Space direction="vertical" className="wrapper">

                                            <Form.Item label="Page Title" className="font-500">
                                                <Input placeholder="Title" name="title"
                                                    onChange={onChangeSetting}
                                                    value={state.setting.title}
                                                    required />
                                            </Form.Item>

                                            <Form.Item label="Page Description" className="font-500">
                                            <TextArea rows={4} value={state.setting.desc} onChange={onChangeSetting}/>
                                            </Form.Item>

                                            <Form.Item label="Status" className="font-500">
                                                <Select style={{ width: 120 }} defaultValue={state.setting.status} onChange={onChangeSetting}>
                                                    <Option value="jack">{STATUS[0]}</Option>
                                                    <Option value="lucy">{STATUS[1]}</Option>
                                                </Select>
                                            </Form.Item>
                                        </Space>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="inner-box border w-50p">
                        <div className="wrapper">
                            <h2>Events</h2>
                            <div className="hr-line"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};

