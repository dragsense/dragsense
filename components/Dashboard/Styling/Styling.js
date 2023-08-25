// import { Button, Space, Tabs } from "antd";
// import { QuestionCircleFilled } from "@ant-design/icons";
// import { useState } from "react";

// import { AiFillLayout, AiOutlineFontSize } from 'react-icons/ai';
// import { MdOutlineInvertColors } from 'react-icons/md';
// import { FaFont } from 'react-icons/fa';

// import { LayoutComponent, LayoutPreview } from "./Layout";
// import StyleComponent from "./Style";
// import GlobalStyleComponent from "./Global";
// import { FontComponent } from "./Fonts";


// import SwitchComponents from "@/components/Panel";
// import ThemeServices from "@/lib/services/theme";

// import { useCssNodeStates } from ".";
// import { createCSS } from "@/lib/utils/cssNode";
// const { TabPane } = Tabs;

// import { fetcher } from "@/lib/fetch";

// export default function Styling({ isLoading, setUState, undoStyle, redoStyle }) {

//   const [avtiveTab, setActiveTab] = useState('1');
//   const { document } = useCssNodeStates();

//   const onSave = async (e) => {
//     e.preventDefault();

//     const id = localStorage.getItem("project");
//     const response = await fetcher('/api/projects/' + id, {
//       method: 'GET'
//     });

//     const url = `http://${response.project.domain}:${response.project.port}`;
//     const api_key = response.project.apikey;

//     const sheet = document.styleSheets[0];
//     const cssRules = sheet.cssRules || sheet.rules;

//     //const CssNodes = await laodCssNodes();
//     const css = await createCSS(cssRules);
//     //console.log(CssNodes, "CssNodes")
//     await ThemeServices.saveStyle({ name: 'global', content: css }, url, api_key);

//   }

//   return <div className="outter-box" >
//     <div className="inner-box" style={{ padding: 0 }}>
//       <h2> Styling <QuestionCircleFilled /></h2>

//       {avtiveTab == '3' && <Space>
//         <Button


//         > Cancel </Button>
//         <Button
//           onClick={onSave}
//           type="primary"
//         > Save </Button>
//       </Space>}
//     </div>

//     <div className="wrapper">

//       <Tabs
//         defaultActiveKey="1" tabBarStyle={{ color: '#000' }} onChange={(key) => setActiveTab(key)}>

//         <TabPane tab={<span>
//           <AiFillLayout size="1rem" style={{ marginRight: 3 }} />
//           Layout
//         </span>} key="1">

//           <LayoutComponent index="1" />
//         </TabPane>
//         <TabPane tab={<span>
//           <MdOutlineInvertColors size="1rem" style={{ marginRight: 3 }} />
//           Global
//         </span>} key="2">
//           <GlobalStyleComponent index="2" />
//         </TabPane>
//         <TabPane tab={<span>
//           <AiOutlineFontSize size="1rem" style={{ marginRight: 3 }} />
//           Style
//         </span>} key="3">
//           <StyleComponent index="3" isLoading={isLoading} setUState={setUState} undoStyle={undoStyle} redoStyle={redoStyle}/>
//         </TabPane>
//         <TabPane tab={<span>
//           <FaFont size="1rem" style={{ marginRight: 3 }} />
//           Fonts
//         </span>} key="4">
//           <FontComponent index="4" />
//         </TabPane>
//       </Tabs>


//     </div>


//   </div>

// }

import { Tabs, theme } from "antd";

import { AiFillLayout, AiOutlineFontSize, AiOutlineCheckCircle } from 'react-icons/ai';
import { MdOutlineInvertColors, MdOutlineAnimation } from 'react-icons/md';
import { FaFont } from 'react-icons/fa';

import  LayoutComponent from "./Layout";
import StyleComponent from "./Style";
import GlobalStyleComponent from "./Global";
import FontComponent from "./Fonts";
import AnimationsComponent from './Animations';
import IconsComponent from './Icons';
const { TabPane } = Tabs;


export default function Styling() {

  const {
    token: { colorText },
} = theme.useToken();


  return <Tabs
      defaultActiveKey="1" tabBarStyle={{ color: colorText }}>

      <TabPane tab={<span>
        <AiFillLayout size="1rem" style={{ marginRight: 3 }} />
        Layout
      </span>} key="1">

        <LayoutComponent index="1" />
      </TabPane>
      <TabPane tab={<span>
        <MdOutlineInvertColors size="1rem" style={{ marginRight: 3 }} />
        Global
      </span>} key="2">
        <GlobalStyleComponent index="2" />
      </TabPane>
      <TabPane tab={<span>
        <AiOutlineFontSize size="1rem" style={{ marginRight: 3 }} />
        Style
      </span>} key="3">
        <StyleComponent index="3" />
      </TabPane>
      <TabPane tab={<span>
        <MdOutlineAnimation size="1rem" style={{ marginRight: 3 }} />
        Animations
      </span>} key="4">
        <AnimationsComponent index="4" />
      </TabPane>
      <TabPane tab={<span>
        <AiOutlineCheckCircle size="1rem" style={{ marginRight: 3 }} />
        Icons
      </span>} key="5">
        <IconsComponent index="5" />
      </TabPane>
      <TabPane tab={<span>
        <FaFont size="1rem" style={{ marginRight: 3 }} />
        Fonts
      </span>} key="6">
        <FontComponent index="6" />
      </TabPane>
    </Tabs>
}

