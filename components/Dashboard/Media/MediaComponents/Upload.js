
import { PlusOutlined } from "@ant-design/icons";
import { Upload, Modal, message } from 'antd';
import { useEffect, useState } from "react";
import MediaServices from "@/lib/services/media";

const types = {
    "images": [
        'image/apng',
        'image/avif',
        'image/gif',
        'image/jpeg',
     
        'image/png',
        'image/svg+xml',
        'image/webp',
        'image/vnd.microsoft.icon'
    ],
    "videos": ['video/x-msvideo', 'video/mpeg', 'video/mp4', 'video/ogg', 'video/3gpp2', 'video/3gpp'],
    "docs": ['application/x-freearc',
        'application/octet-stream',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-fontobject',
        'application/gzip',
        'application/pdf',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/xml',
        'text/csv',
        'text/css',
        'text/html',
        'text/javascript'
    ],
    'audios': ['audio/mpeg', 'audio/3gpp', 'audio/ogg', 'audio/3gpp2', 'audio/wav', 'audio/webm'],
    'fonts': ['font/otf', 'font/ttf', 'font/woff', 'application/font-woff', 'font/woff2', ""]

}

const LIMIT = 10;

export default function UplaodMedia({ type, onAdd }) {


    const [fileList, setFileList] = useState([]);

    const handleUpload = async (options) => {
        const { onSuccess, onError, file, onProgress } = options;
        try {


            const formData = new FormData();
            formData.append('file', file);
            const res = await MediaServices.upload(type, formData, onProgress);
            onAdd(res.media);
            onSuccess({ status: 'done' });


        } catch (e) {
            onError(e)
            message.error(e?.message || 'Upload failed.');
        }
    };

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    }

    const handleRemove = (file) => {
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        setFileList(newFileList);
    };

    const handleSuccess = (response, file) => {
        message.destroy();
        message.success(`${file.name} uploaded successfully`);
        handleRemove(file);
    };

    const handleExceed = (files, fileList) => {
        message.error(`You can only upload a maximum of 2 files.`);
    };

    const handleBeforeUpload = (file, fileList) => {
        const isValid = types[type].includes(file.type);
        if (!isValid) {

            message.error(`You can only upload ${type} file!`);
            return false;
        }

        if (fileList.length > LIMIT) {
            message.destroy();
            message.warning(`You can only upload a maximum of ${LIMIT} files.`);
        }

        return true;

    };



    const props = {
        accept: types[type].join(','),
        onDrop: handleChange,
        customRequest: handleUpload,
        onSuccess: handleSuccess,
        onChange: handleChange,
        beforeUpload: handleBeforeUpload,
        onExceed: handleExceed,
        showUploadList: { showRemoveIcon: true, showPreviewIcon: false },
        listType: "picture-card",
        fileList,
        maxCount: LIMIT,
        multiple: true,
        timeout: 60000

    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return <>
        <Upload {...props} >
            {fileList.length < LIMIT && uploadButton}
        </Upload>
    </>


};

