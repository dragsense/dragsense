import { Modal, Button } from "antd";
import { useEffect } from "react";
import { useState, } from "react";

import MediaComponents from './MediaComponents';

export default function MediaModal({ onClose,
    type,
    field = '',
    open,
    srcs,
    multiple = false,
    onSelect }) {

    const [selectedMedia, setSelectedMedia] = useState([]);

    useEffect(() => {

        if (!open)
            return;

        if (!srcs)
            srcs = {};


        if (!Array.isArray(srcs))
            setSelectedMedia([srcs]);
        else
            setSelectedMedia(srcs);


    }, [open])

    const onSelectMedia = (media) => {


        if (multiple) {
            const index = selectedMedia.findIndex(src => (src._id == media._id || src.src == media.src));

            if (index !== -1)
            selectedMedia.splice(index, 1);
            else
            selectedMedia.push({ 
                _id: media._id, 
                src: media.src,
                 alt: media.alt, 
                 format: media.format,
                mimetype: media.mimetype,
                 name: media.name });

            setSelectedMedia([...selectedMedia]);

        } else {

            const index = selectedMedia.findIndex(src => (src._id == media._id || src.src == media.src));

            if (index !== -1)
                setSelectedMedia([{}]);
            else {
                const selectedMedia = { _id: media._id, src: media.src, alt: media.alt,
                    format: media.format,

                    mimetype: media.mimetype, name: media.name };
                setSelectedMedia([selectedMedia]);
            }

        }


    };

    const handleOk = () => {
        onSelect(selectedMedia);
        setSelectedMedia([]);
        onClose();
    };

    const onCancel = () => {
        setSelectedMedia([]);
        onClose();
    }


    return <><Modal title={`Select Media${': ' + type}`}
        open={open}
        closable
        width={"70%"}
        onCancel={onClose}
        footer={
            <div style={{ padding: 5 }}>
                <Button onClick={onCancel}>Cancel</Button>
                <Button type="primary" onClick={handleOk}>Add</Button>
            </div>
        } >

        <MediaComponents type={type} field={field} srcs={selectedMedia} onSelect={onSelectMedia} />

    </Modal>
    </>


}

