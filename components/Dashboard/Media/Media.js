
import { FaImage, FaMix, FaVideo, FaFile, FaFileAudio, FaFont } from "react-icons/fa";
import { Tabs, Card, theme } from 'antd';

import MediaComponents from './MediaComponents';

const { TabPane } = Tabs;

export default function Media({ srcs = [] }) {

  const {
    token: { colorTextBase },
  } = theme.useToken();



    return <Card>
  
      <Tabs
        defaultActiveKey="1" 
        theme="dark"
        tabBarStyle={{ color: colorTextBase }}>
  
        <TabPane tab={<span>
          <FaImage size="1rem" style={{ marginRight: 3 }} />
          Images
        </span>} key="1">
  
          <MediaComponents type="images" srcs={srcs}   />
        </TabPane>
  
        <TabPane tab={<span>
          <FaVideo size="1rem" style={{ marginRight: 3 }} srcs={srcs}  />
          Videos
        </span>} key="2">
          <MediaComponents type="videos" srcs={srcs} />
        </TabPane>
  
        <TabPane tab={<span>
          <FaFileAudio size="1rem" style={{ marginRight: 3 }} srcs={srcs}  />
          Audios
        </span>} key="3">
          <MediaComponents type="audios" srcs={srcs}  />
        </TabPane>
  
        <TabPane tab={<span>
          <FaFont size="1rem" style={{ marginRight: 3 }} srcs={srcs}   />
          Fonts
        </span>} key="4">
          <MediaComponents type="fonts" srcs={srcs}  />
        </TabPane>
  
        <TabPane tab={<span>
          <FaFile size="1rem" style={{ marginRight: 3 }} srcs={srcs}  />
          Docs
        </span>} key="5">
          <MediaComponents type="docs" srcs={srcs}  />
        </TabPane>

       
  
  
      </Tabs>
  
    </Card>
  
  };