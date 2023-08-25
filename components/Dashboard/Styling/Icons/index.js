
import { Card } from 'antd';

import Icons from './Icons';


export default function IconsComponent({ editor }) {

    return <>
        <Card >
            <Icons editor={editor} />
        </Card>
    </>


};

