
import React from "react";
import { LoadingOutlined } from '@ant-design/icons';

import { Spin } from 'antd';


export default function Loading() {

    return <div style={{
        width: '100%', height: '100%', display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }}>
        <Spin tip="Loading" size="large" />
    </div >


}
