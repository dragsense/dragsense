import { Form, Space, Input, Button, Select, Switch, message } from "antd";
import { useState, useEffect, useReducer } from "react";

import ComponentServices from "@/lib/services/components";
import LayoutServices from '@/lib/services/layouts';

const { Option } = Select;

const reducer = (state, action) => {
    switch (action.type) {
        case "start":
            return { ...state, loading: true }
        case "load":
            return { ...state, components: action.data }
        case "finish":
            return { ...state, loading: false }
        default:
            return state;
    }
};




export default function AddLayout({ layout, onSelect, onSubmit }) {

    const [states, dispatch] = useReducer(reducer, { laoding: false, components: [] });
    const [state, setState] = useState(layout);
    const [form] = Form.useForm();
    const [componentSearch, setComponentSearch] = useState('');




    useEffect(() => {
        const laod = async () => {
            try {
                dispatch({ type: 'start' });

                if (layout._id !== -1) {
                    const res = await LayoutServices.get(layout._id);
                    if (res.layout) {
                        layout = res.layout;
                    }
                }

                onSelect(layout)
              
                form.setFieldsValue({ name: layout?.name})
                setState(layout);
                dispatch({ type: 'load', data: layout?.populatedComponents || [] });


            } catch (e) {
                dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
            } finally {

                dispatch({ type: 'finish' });

            }

        }

        laod();

    }, [layout])



    const loadComponents = async () => {

        try {
            dispatch({ type: 'start' });

            const res = await ComponentServices.search(componentSearch);
       

            if (res.components) {
                const data = Array.isArray(res.components.results) ? res.components.results : [];
                dispatch({ type: 'load', data });
            }


        } catch (e) {
            message.error(e?.message || 'Something went wrong.');
        } finally {

            dispatch({ type: 'finish' });

        }
    }

    useEffect(() => {

        if (!componentSearch)
            return;

            loadComponents();
    }, [componentSearch]);


    const onChange = (event) => {
        event.preventDefault();

        const value = event.target.value;
        const name = event.target.name;


        setState({ ...state, [name]: value });
    }


    const onSubmitForm = async (values) => {


        form.validateFields()
            .then(async (values) => {
                onSubmit({ ...state, _id: undefined, });

            })
            .catch((info) => {
                message.error('Validate Failed.');
            });

    }

    const onSwitchTopComponent = () => {

        setState({ ...state, topComponent: !state.topComponent });

        onSelect({ ...state, topComponent: !state.topComponent })

    }
    const onSwitchBottomComponent = () => {
        setState({ ...state, bottomComponent: !state.bottomComponent })

        onSelect({ ...state, bottomComponent: !state.bottomComponent })

    }

    function onChangeTopComponent(value, option) {

        const top = value;


        setState({ ...state, components: { ...state.components, top } })
    }

    function onChangeBottomComponent(value, option) {
        const bottom = value;

        setState({ ...state, components: { ...state.components, bottom } })
    }


    const dropdownRender = (menu) => {
        return <>
            {states.loading && <div>Loading...</div>}
            {menu}
        </>
    }


    return (
        <>

            <Form layout="horixontal"
                form={form}
                initialValues={{}}
                onFinish={onSubmitForm}>

                <Form.Item label="Name"
                    name='name'
                    rules={[
                        {
                            required: true,
                            message: 'Please enter the layout name (alphanumeric).',
                            pattern: /^[a-zA-Z0-9\s]+$/
                        },
                        {
                            min: 3,
                            message: 'Layout name must be at least 3 characters long',
                        },
                        {
                            max: 40,
                            message: 'Text be at most 40 characters long',
                        }
                        ]}

                    className="font-500">
                    <Input placeholder="Name" name="name"
                        onChange={onChange}
                        value={state.name}
                        required />
                </Form.Item>


                <Form.Item label="Top">


                    <Switch onChange={onSwitchTopComponent} checked={state.topComponent} />



                </Form.Item>

                <Form.Item label="Components">

                    <Select
                        showSearch
                        clearIcon
                        disabled={!state.topComponent}
                        style={{ width: '100%' }}
                        placeholder="Search to Select"
                        optionFilterProp="label"
                        onSearch={(v) => {

                            if (!state.loading)
                                setComponentSearch(v)
                        }
                        }
                        dropdownRender={dropdownRender}
                        onChange={onChangeTopComponent}
                        defaultValue={state.components?.top}
                        value={state.components?.top}

                    >
                     {console.log(state.components)}
                        {states.components?.map(comp => comp && <Option key={comp._id} value={comp._id}
                            label={comp.name}

                        >{comp.name}</Option>)}
                    </Select>
                </Form.Item>

                <Form.Item label="Bottom">

                    <Switch onChange={onSwitchBottomComponent} checked={state.bottomComponent} />

                </Form.Item>

                <Form.Item label="Components">

                    <Select
                        showSearch
                        clearIcon
                        disabled={!state.bottomComponent}
                        style={{ width: '100%' }}
                        placeholder="Search to Select"
                        onChange={onChangeBottomComponent}
                        optionFilterProp="label"
                        onSearch={(v) => {

                            if (!state.loading)
                                setComponentSearch(v)
                        }
                        }
                        dropdownRender={dropdownRender}
                        defaultValue={state.components?.bottom}
                        value={state.components?.bottom}

                    >
                     
                        {states.components?.map(comp =>  comp &&<Option key={comp._id} value={comp._id}
                            label={comp.name}

                        >{comp.name}</Option>)}                    </Select>
                </Form.Item>

                <Form.Item className="text-right">
                    <Button type="primary" htmlType="submit" loading={states.loading}> Save </Button>
                </Form.Item>
            </Form>

        </>

    );
};

