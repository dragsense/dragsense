import { Row, Col, Divider } from "antd";
import { useState } from "react";

import Layouts from "./Layouts"

export function LayoutPreview({ layout }) {

    return layout ? <div className="layout-container">

        {layout.topComponent && <div className="layout-top">
            Top
        </div>}
        <div class="layout-main">Main</div>
        {layout.bottomComponent && <div className="layout-bottom">
            Bottom
        </div>}

    </div> : <span>Please Select the Layout</span>

}



export default function LayoutComponent() {

    const [layout, setLayout] = useState(null);


    return <Row gutter={16}>
        <Col span={12}>
            <Layouts layout={layout} setLayout={setLayout} />
        </Col>
        <Col span={12}>
            <LayoutPreview layout={layout} index="1" />
        </Col>
    </Row>


}

