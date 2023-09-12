import { Form, Alert, Divider, Input, Button, Typography, message } from "antd";
import { InfoCircleOutlined, CheckOutlined } from '@ant-design/icons';
import { useState, } from "react";


const { Paragraph } = Typography;
const { TextArea } = Input;



const DownloadProject = ({ id, name, apikey }) => {


    const [isLoading, setIsLoading] = useState(false);
    const [isKeyValid, setIsKeyValid] = useState(false);
    const [error, setError] = useState(false);

    const onChangeApiKey = (event) => {
        event.preventDefault();

        if (!apikey)
            return;

        const value = event.target.value;


        if (apikey.trim() === value.trim())
            setIsKeyValid(true);
        else
            setIsKeyValid(false);
    }



    const b64toBlob = async (base64, type = 'application/octet-stream') =>
        fetch(`data:${type};base64,${base64}`).then(res => res.blob())

    const onDownload = async (values) => {

        try {
            setIsLoading(true);
            setErrpr('');
        

            const downloadLink = document.createElement('a');
            downloadLink.href = `/api/projects/download/${id}`;
            downloadLink.download = true;
            downloadLink.click();
            
            setIsKeyValid(false);

        } catch (e) {
            setError(e?.message || 'Something went wrong')
            message.error(e?.message || 'Something went wrong.');

        } finally {
            setIsLoading(false);
        }
    }




    return <>

        <Divider orientation="left" orientationMargin="0">
            Downlaod Files
        </Divider>

        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 10 }} />}


        <Form layout="vertical" onFinish={onDownload}>

            <Form.Item label="API Key" >
                <Paragraph style={{ margin: 0 }} copyable>{apikey ? apikey : 'No Key Found'}</Paragraph>
            </Form.Item>
            <Form.Item
                label="Copy and Paste the Key"

                tooltip={{ title: isKeyValid ? 'Key is valid' : 'Key is not valid', icon: isKeyValid ? <CheckOutlined type="success" /> : <InfoCircleOutlined type="info" /> }}

            >
                <TextArea rows={4} maxLength={500} onChange={onChangeApiKey} />
            </Form.Item>

            <Form.Item className="text-right">

                <Button type="primary" htmlType="submit" disabled={!isKeyValid} loading={isLoading}> Download </Button>
            </Form.Item>
        </Form>
    </>



};

export default DownloadProject;
