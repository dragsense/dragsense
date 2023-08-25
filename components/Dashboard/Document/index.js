
import { Modal } from "antd";
import { useState, useEffect } from "react";

import Documents from "./Documents"


export function DocumentComponent({ collection, form }) {


    const [documnetsModal, setDocumnetsModal] = useState(false);

    useEffect(() => {

        if (!collection) {
            return;
        }

        setDocumnetsModal(true);

    }, [collection]);

    const onCancel = () => setDocumnetsModal(false);


    return <Modal
        open={documnetsModal}
        title={collection ? <>Collection : {collection.name}</> : 'Documents'}
        cancelText="Back"
        width="90%"
        onCancel={onCancel}
        footer={[]}
    >
        {collection && <Documents collection={collection} form={form} />}
    </Modal>


};