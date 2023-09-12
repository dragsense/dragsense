


import { useState, useEffect, useReducer } from "react";
import {
    Space,
    Form,
    Input,
    Select,
    Checkbox,
    Image,
    Button,
    message,
    Card,
    Tooltip,
    Divider,
    Row,
    Col
} from "antd";
import { QuestionCircleFilled, EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";
import languages from './languages.json';


import HTMLEditor from './HTMLEditor';

import MediaModal from "../Media/MediaModal";

const { Option } = Select;
const { TextArea } = Input;

import SettingServices from '@/lib/services/setting';
import PageServices from "@/lib/services/pages";



const initial = {
    webTitle: '',
    tagLine: '',
    desc: '',
    lang: '',
    author: '',
    keywords: '',
    images: {
    },
    email: {
        host: '',
        port: '',
        secure: false,
        ignoreTLS: true,
        auth: {
            user: '',
            pass: '',
        }
    },
    scripts: {
        head: '',
        footer: ''
    }
}

const reducer = (state, action) => {

    switch (action.type) {
        case "start":
            return { ...state, loading: true }
        case "load":
            return { ...state, pages: action.data }
        case "finish":
            return { ...state, loading: false }
        default:
            return state;
    }
};


export default function Setting() {

    const [states, dispatch] = useReducer(reducer, { laoding: false, pages: [] });
    const [state, setState] = useState(initial);
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();
    const [pageSearch, setPageSearch] = useState('');
    const [isChange, setIsChange] = useState(false);

    const [mediaModal, setMediaModal] = useState({ open: false, type: '', src: '' });


    const load = async () => {

        try {

            setIsLoading(true);
            const res = await SettingServices.get();
            const data = { ...initial, ...res.setting };
            form.setFieldsValue({ webTitle: res.setting?.webTitle, email: res.setting?.email })

            setState(data);

        } catch (e) {
            message.error(e?.message || 'Something went wrong.');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {

        load();
    }, []);


    const loadPages = async () => {

        try {
            dispatch({ type: 'start' });

            const res = await PageServices.search(pageSearch);

            if (res.pages) {
                const data = Array.isArray(res.pages.results) ? res.pages.results : [];
                dispatch({ type: 'load', data, total: res.pages.totalResults });
            }


        } catch (e) {
            message.error(e?.message || 'Something went wrong.');
        } finally {

            dispatch({ type: 'finish' });

        }
    }

    useEffect(() => {

        if (!pageSearch)
            return;

        loadPages();

    }, [pageSearch]);




    const onChange = (event) => {
        event.preventDefault();

        const value = event.target.value;
        const name = event.target.name;

        setState({ ...state, [name]: value });
        setIsChange(true)

    }

    const onChangeHomePage = (value, option) => {

        state.homePage = state.homePage ?? {};

        if (!value)
            state.homePage = undefined;
        else {
            state.homePage._id = option.value
            state.homePage.name = option.label
        }
        setState({ ...state })
        setIsChange(true)

    }



    const onChangeLanguage = (val) => {
        setState({ ...state, lang: val })
    }

    const onChangeErrorPage = (value, option) => {

        state.errorPage = state.errorPage ?? {};

        if (!value)
            state.errorPage = undefined;
        else {
            state.errorPage._id = option.value
            state.errorPage.name = option.label
        }
        setState({ ...state })
        setIsChange(true)


    }

    const onChangeMaintenancePage = (value, option) => {

        state.maintenancePage = state.maintenancePage ?? {};

        if (!value)
            state.maintenancePage = undefined;
        else {
            state.maintenancePage._id = option.value
            state.maintenancePage.name = option.label
        }
        setState({ ...state })
        setIsChange(true)


    }

    const onChangeSearchPage = (value, option) => {

        state.searchPage = state.searchPage ?? {};

        if (!value)
            state.searchPage = undefined;
        else {
            state.searchPage._id = option.value
            state.searchPage.name = option.label
        }
        setState({ ...state })
        setIsChange(true)


    }


    const onSelectImage = (image) => {
        const newImage = image[0] ? image[0] :
            { _id: -1, src: '', alt: '' }

        if (mediaModal.type)
            setState({ ...state, images: { ...state.images, [mediaModal.type]: newImage } })

        setIsChange(true)

    }

    const onChangeLogo = (value) => {
        setState({ ...state, images: { ...state.images, logo: value.trim() } })
    }

    const onChangeMobileLogo = (value) => {
        setState({ ...state, images: { ...state.images, mobileLogo: value.trim() } })
    }

    const onChangeFavicon = (value) => {
        setState({ ...state, images: { ...state.images, favicon: value.trim() } })
    }

    const onChangePlaceHolder = (value) => {
        setState({ ...state, images: { ...state.images, placeholder: value.trim() } })
    }


    const onChangeScript = (value, name) => {
        setState({ ...state, scripts: { ...state.scripts, [name]: value } });
        setIsChange(true)

    }


    const emailValidator = (_, value) => {


        if (!value) {
            return Promise.resolve();
        }

        const emails = value.split(',').map((email) => email.trim());

        const isValidEmail = emails.every((email) =>
            /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
        );

        if (!isValidEmail) {
            return Promise.reject('Invalid email address');
        }

        return Promise.resolve();
    };


    const onSubmit = async (e) => {
        e.preventDefault();
        form.validateFields()
            .then(async (values) => {

                try {
                    setIsLoading(true);
                    const res = await SettingServices.createOrUpdate(state);

                    const data = res.setting;
                    setState(data);
                    setIsChange(false)
                    message.success('Data submitted!');

                } catch (e) {
                    message.error(e?.message || 'Something went wrong.');
                } finally {
                    setIsLoading(false);
                }

            })
            .catch((info) => {
                message.error('Validate Failed.');
            });
    }

    const dropdownRender = (menu) => {
        return <>
            {states.loading && <div>Loading...</div>}
            {menu}
        </>
    }



    return (
        <>
            <Card loading={isLoading} title={`Setting:`}
                headStyle={{ padding: 10 }}>

                <Form layout="vertical"
                    form={form}
                    initialValues={{}}
                >


                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Website Title"
                                name="webTitle"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter the website title (alphanumeric).',
                                        pattern: /^[a-zA-Z0-9\s]+$/
                                    },
                                    {
                                        min: 4,
                                        message: 'Website title must be at least 4 characters long',
                                    }
                                ]}

                                className="font-500">
                                <Input placeholder="Name" name="webTitle"
                                    maxLength={500}
                                    onChange={onChange}
                                    value={state.webTitle}
                                    required />
                            </Form.Item>
                            <Form.Item label="Tag Line"
                                rules={[
                                    {
                                        min: 4,
                                        message: 'Tagline must be at least 4 characters long',
                                    }
                                ]}

                                className="font-500">
                                <Input placeholder="Tag Line" name="tagLine"

                                    maxLength={500}

                                    onChange={onChange}
                                    value={state.tagLine}
                                    required />
                            </Form.Item>
                            <Form.Item label="Decription"
                                rules={[
                                    {
                                        min: 4,
                                        message: 'Description must be at least 4 characters long',
                                    }
                                ]}


                                className="font-500">
                                <TextArea rows={4} placeholder="Desc" name="desc"
                                    onChange={onChange}
                                    maxLength={500}
                                    value={state.desc}
                                    required />
                            </Form.Item>

                            <Form.Item label="Author"
                                rules={[
                                    {
                                        min: 2,
                                        message: 'Author must be at least 2 characters long',
                                    }
                                ]}

                                className="font-500">
                                <Input placeholder="author" name="author"
                                    onChange={onChange}
                                    maxLength={500}
                                    value={state.author}
                                    required />
                            </Form.Item>

                            <Form.Item label="Keywords"


                                className="font-500">
                                <TextArea rows={4} placeholder="Keywords" name="keywords"
                                    onChange={onChange}
                                    maxLength={2000}
                                    value={state.keywords}
                                    required />
                            </Form.Item>

                            <Form.Item label="Select Language" className="font-500">

                                <Select name="language"
                                    style={{ width: '100%' }} defaultValue={state.lang}
                                    onChange={onChangeLanguage}>
                                    {Object.keys(languages).map(key =>
                                        <Option key={key} value={key}>
                                            {languages[key]}
                                        </Option>
                                    )
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Divider orientation="left" orientationMargin="0">{"Website Setting"}
                            </Divider>

                            <Form.Item label="Home Page" className="font-500">
                                <Select name="homePage"
                                    onChange={onChangeHomePage}
                                    showSearch
                                    clearIcon
                                    placeholder="Select Page"
                                    onSearch={(v) => {
                                        if (!state.loading)
                                            setPageSearch(v)
                                    }}
                                    dropdownRender={dropdownRender}
                                    optionFilterProp="label"
                                    defaultValue={state.homePage?._id}
                                    value={state.homePage?._id}
                                >
                                    {state.homePage && <Option
                                        key={0} disabled
                                        value={state.homePage._id}
                                        label={state.homePage.name}>{state.homePage.name}</Option>}

                                    {states.pages.map(page =>
                                        <Option value={page._id} label={page.name}>{page.name}
                                        </Option>)}

                                </Select>
                            </Form.Item>

                            {/* <Form.Item label="Search Page" className="font-500">
                                <Select name="SearchPage"
                                    onChange={onChangeSearchPage}
                                    showSearch
                                    clearIcon
                                    placeholder="Select Page"
                                    onSearch={(v) => {
                                        if (!state.loading)
                                            setPageSearch(v)
                                    }}
                                    dropdownRender={dropdownRender}
                                    optionFilterProp="label"
                                    defaultValue={state.searchPage?._id}
                                    value={state.searchPage?._id}
                                >
                                    <Option value="">None</Option>

                                    {state.searchPage && <Option
                                        key={0} disabled
                                        value={state.searchPage._id}
                                        label={state.searchPage.name}>{state.searchPage.name}</Option>}

                                    {states.pages.map(page =>
                                        <Option value={page._id} label={page.name}>{page.name}
                                        </Option>)}
                                </Select>
                            </Form.Item> */}

                            <Form.Item label="Error Page" className="font-500">
                                <Select name="errorPage"
                                    onChange={onChangeErrorPage}
                                    showSearch
                                    clearIcon
                                    placeholder="Select Page"
                                    onSearch={(v) => {
                                        if (!state.loading)
                                            setPageSearch(v)
                                    }}
                                    dropdownRender={dropdownRender}
                                    optionFilterProp="label"
                                    defaultValue={state.errorPage?._id || ""}
                                    value={state.errorPage?._id || ""}
                                >
                                    <Option value="">None</Option>
                                    {state.errorPage && state.errorPage?._id !== '' && <Option
                                        key={0} disabled
                                        value={state.errorPage._id}
                                        label={state.errorPage.name}>{state.errorPage.name}</Option>}

                                    {states.pages.map(page =>
                                        <Option value={page._id} label={page.name}>{page.name}
                                        </Option>)}
                                </Select>
                            </Form.Item>

                            <Form.Item label="Maintenance Page" className="font-500">
                                <Select name="maintenancePage"

                                    onChange={onChangeMaintenancePage}
                                    showSearch
                                    clearIcon
                                    placeholder="Select Page"
                                    onSearch={(v) => {
                                        if (!state.loading)
                                            setPageSearch(v)
                                    }}
                                    dropdownRender={dropdownRender}
                                    optionFilterProp="label"
                                    defaultValue={state.maintenancePage?._id || ""}
                                    value={state.maintenancePage?._id || ""}
                                >
                                    <Option value="">None</Option>
                                    {state.maintenancePage && <Option
                                        key={0} disabled
                                        value={state.maintenancePage._id}
                                        label={state.maintenancePage.name}>{state.maintenancePage.name}</Option>}

                                    {states.pages.map(page =>
                                        <Option value={page._id} label={page.name}>{page.name}
                                        </Option>)}
                                </Select>
                            </Form.Item>

                            <Divider orientation="left" orientationMargin="0"> {"Images"} </Divider>

                            <Space direction="horizontal" className="wrapper"
                                style={{ overflow: 'auto', flexWrap: 'wrap' }}>
                                <Form.Item label="Favicon" className="font-500">


                                    <Image
                                        width="100%"
                                        onClick={() => setMediaModal({
                                            open: true,
                                            type: 'favicon',
                                            src: state.images?.favicon
                                        })}
                                        preview={false}
                                        style={{
                                            width: '100%',
                                            objectFit: 'cover',
                                            objectPosition: 'center',
                                            height: '120px',
                                            cursor: 'pointer'
                                        }}
                                        alt={state.images?.favicon?.alt}
                                        src={state.images?.favicon?.src}
                                        fallback="/images/default/default-img.png" />

                                </Form.Item>

                                <Form.Item label="Logo" className="font-500">
                                    <Image
                                        width="100%"
                                        onClick={() => setMediaModal({
                                            open: true,
                                            type: 'logo',
                                            src: state.images?.logo
                                        })}
                                        preview={false}
                                        style={{
                                            width: '100%',
                                            objectFit: 'cover',
                                            objectPosition: 'center',
                                            height: '120px',
                                            cursor: 'pointer'
                                        }}
                                        alt={state.images?.logo?.alt}
                                        src={state.images?.logo?.src}
                                        fallback="/images/default/default-img.png" />

                                </Form.Item>

                                <Form.Item label="Mobile Logo" className="font-500">
                                    <Image
                                        width="100%"
                                        onClick={() => setMediaModal({
                                            open: true,
                                            type: 'mobileLogo',
                                            src: state.images?.mobileLogo
                                        })}
                                        preview={false}
                                        style={{
                                            width: '100%',
                                            objectFit: 'cover',
                                            objectPosition: 'center',
                                            height: '120px',
                                            cursor: 'pointer'
                                        }}
                                        alt={state.images?.mobileLogo?.alt}
                                        src={state.images?.mobileLogo?.src}
                                        fallback="/images/default/default-img.png" />

                                </Form.Item>

                                <Form.Item label="Placeholder" className="font-500">
                                    <Image
                                        width="100%"
                                        onClick={() => setMediaModal({
                                            open: true,
                                            type: 'placeholder',
                                            src: state.images?.placeholder
                                        })}
                                        preview={false}
                                        style={{
                                            width: '100%',
                                            objectFit: 'cover',
                                            objectPosition: 'center',
                                            height: '120px',
                                            cursor: 'pointer'
                                        }}
                                        alt={state.images?.placeholder?.alt}
                                        src={state.images?.placeholder?.src}
                                        fallback="/images/default/default-img.png" />

                                </Form.Item>
                            </Space>

                            <Divider orientation="left" orientationMargin="0"> {"Header and Footer Scripts"} </Divider>
                            <Space direction="horizontal" className="wrapper" style={{ overflow: 'auto' }}>

                                <Form.Item label="Head" className="font-500">
                                    <HTMLEditor title="Edit Script"
                                        content={state.scripts.head}
                                        onSave={(_content) => {
                                            onChangeScript(_content, 'head');
                                        }} />
                                </Form.Item>
                                <Form.Item label="After Content" className="font-500">
                                    <HTMLEditor title="Edit Script" content={state.scripts.footer} onSave={(_content) => {
                                        onChangeScript(_content, 'footer');
                                    }} />
                                </Form.Item>
                            </Space>

                        </Col>
                    </Row>
                    <Divider orientation="left" orientationMargin="0"> {"Email"} </Divider>

                    <Row gutter={16}>
                        <Col span={12}>


                            <Divider orientation="left" orientationMargin="0"> {"Host Setting"} </Divider>

                            <Form.Item label="Host" className="font-500">
                                <Input placeholder="your.email.server.com" name="host"
                                    onChange={(e) => {

                                        setState({ ...state, email: { ...state.email, host: e.target.value } })
                                        setIsChange(true)
                                    }
                                    }
                                    maxLength={1000}
                                    value={state.email.host}
                                    required />
                            </Form.Item>
                            <Form.Item label="Port" className="font-500">
                                <Input placeholder="587" name="email port"
                                    maxLength={100}
                                    onChange={(e) => {
                                        setState({ ...state, email: { ...state.email, port: e.target.value } })

                                        setIsChange(true)
                                    }
                                    }
                                    value={state.email.port}
                                    type="number"
                                    required />
                            </Form.Item>
                            <Form.Item label="isSecure?" className="font-500">
                                <Checkbox className="font-500"
                                    onChange={() => {
                                        setState({ ...state, email: { ...state.email, secure: !state.email.secure } })
                                        setIsChange(true)
                                    }

                                    }
                                    checked={state.email.secure}
                                >Yes</Checkbox>
                            </Form.Item>
                            <Form.Item label="ignoreTLS?" className="font-500">
                                <Checkbox className="font-500"
                                    onChange={() => {
                                        setState({ ...state, email: { ...state.email, ignoreTLS: !state.email.ignoreTLS } })
                                        setIsChange(true)
                                    }
                                    }
                                    checked={state.email.ignoreTLS}
                                >Yes</Checkbox>
                            </Form.Item>

                            <Divider orientation="left" orientationMargin="0"> {"Email Auth"} <Tooltip title="SMTP Authentication, often abbreviated SMTP AUTH, is an extension of the Simple Mail Transfer Protocol (SMTP) whereby a client may log in using any authentication mechanism supported by the server."><QuestionCircleFilled /></Tooltip></Divider>

                            <Form.Item label="User" className="font-500">
                                <Input placeholder="youremail@yourdomain.com" name="user"
                                    maxLength={1000}
                                    onChange={(e) => {
                                        setState({ ...state, email: { ...state.email, auth: { ...state.email.auth, user: e.target.value } } })
                                        setIsChange(true)
                                    }
                                    }
                                    value={state.email.auth.user}
                                    required />
                            </Form.Item>

                            <Form.Item label="Password" className="font-500">
                                <Input.Password
                                    maxLength={1000}
                                    onChange={(e) => {
                                        setState({ ...state, email: { ...state.email, auth: { ...state.email.auth, pass: e.target.value } } })
                                        setIsChange(true)
                                    }
                                    }
                                    value={state.email.auth.pass}
                                    placeholder="*******"
                                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                />
                            </Form.Item>


                        </Col><Col span={12}>
                            <Divider orientation="left" orientationMargin="0"> {"Default Configuration"} </Divider>


                            <Form.Item label="Subject" className="font-500">
                                <TextArea rows={2} placeholder="Subject" name="subject"
                                    onChange={(e) => {
                                        setState({ ...state, email: { ...state.email, subject: e.target.value } })
                                        setIsChange(true)
                                    }
                                    }
                                    value={state.email.subject}
                                    maxLength={500}
                                    required />
                            </Form.Item>

                            <Form.Item label="From" className="font-500">
                                <Input placeholder="Enter From address" name="email"
                                    onChange={(e) => {
                                        setState({ ...state, email: { ...state.email, from: e.target.value } })
                                        setIsChange(true)
                                    }
                                    }
                                    maxLength={1000}
                                    value={state.email.from}
                                    type="email"
                                    multiple
                                    required />
                            </Form.Item>
                            <Form.Item label="To" name={['email', 'to']} rules={[{ validator: emailValidator }]}>

                                <Input placeholder="Enter To addresses separated by commas" name="email"
                                    onChange={(e) => {
                                        setState({ ...state, email: { ...state.email, to: e.target.value } })
                                        setIsChange(true)
                                    }
                                    }
                                    maxLength={1000}
                                    value={state.email.to}
                                    type="email"
                                    multiple
                                    required />
                            </Form.Item>

                            <Form.Item label="CC" name={['email', 'cc']} rules={[{ validator: emailValidator }]}>
                                <Input placeholder="Enter Cc addresses separated by commas" name="email"
                                    onChange={(e) => {

                                        setState({ ...state, email: { ...state.email, cc: e.target.value } })
                                        setIsChange(true)
                                    }
                                    }
                                    maxLength={1000}
                                    value={state.email.cc}
                                    type="email"
                                    multiple
                                />
                            </Form.Item>

                            <Form.Item label="BCC" name={['email', 'bcc']} rules={[{ validator: emailValidator }]}>
                                <Input placeholder="Enter Bcc addresses separated by commas" name="email"
                                    onChange={(e) => {
                                        setState({ ...state, email: { ...state.email, bcc: e.target.value } })
                                        setIsChange(true)
                                    }
                                    }
                                    maxLength={1000}
                                    value={state.email.bcc}
                                    type="email"
                                />
                            </Form.Item>

                            <Form.Item label="Reply To" name={['email', 'replyTo']}>
                                <Input placeholder="Enter Reply To address"
                                    maxLength={1000}
                                    onChange={(e) => {
                                        setState({ ...state, email: { ...state.email, replyTo: e.target.value } })
                                        setIsChange(true)
                                    }
                                    }
                                    value={state.email.replyTo}
                                    multiple
                                    type="email" />
                            </Form.Item>


                        </Col>
                    </Row>


                    <Form.Item className="text-right">
                        <Button type="primary" onClick={onSubmit} loading={states.loading} disabled={!isChange}> Save </Button>
                    </Form.Item>
                </Form>
            </Card>

            <MediaModal
                open={mediaModal.open} type="images"
                onClose={() => setMediaModal({ ...mediaModal, open: false })}
                srcs={mediaModal.src || []}
                onSelect={onSelectImage} />

        </>

    );

}

