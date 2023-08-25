
import { Card } from 'antd';

import Media from './Media';


export default function MediaComponents({ type, feild, srcs, onSelect }) {

    return <>

        <Card >
            <Media type={type} srcs={srcs} fields={feild} onSelect={onSelect} />
        </Card>
    </>


};

