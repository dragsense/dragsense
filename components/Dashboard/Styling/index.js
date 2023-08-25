// import React from "react";
// import { DashboardLayout } from "../../Layout";
// import Styling from "./Styling";

// const cssNodesContext = React.createContext();
// import useNodes from "@/lib/hooks/useNodes";
// import useUndos from "@/lib/hooks/useUndos";

// import { addRule, getCssSelector, laodSelecters, loadRootVar } from '@/lib/utils/cssNode'

// export function StylingComponent({ user }) {

//     const { CssNodes, document, isLoading, laodCssNodes, setIframeDocumnet } = useNodes();

//     const {
//         onAddState,
//         goBack: undoStyle,
//         goForward: redoStyle
//       } = useUndos();

//     return (
//         <DashboardLayout user={user}>

//             <cssNodesContext.Provider value={{ CssNodes, document, laodCssNodes, setIframeDocumnet }}>
//                 <Styling isLoading={isLoading} onAddState={onAddState} undoStyle={undoStyle} redoStyle={redoStyle}/>
//             </cssNodesContext.Provider>

//         </DashboardLayout>
//     );
// };

// export function useCssNodeStates() {
//     const { CssNodes, document, laodCssNodes, setIframeDocumnet } = React.useContext(cssNodesContext);

//     const addCssRule = async (value, content = {}, type = 1, breakPoint, keyframe) => {

//         const selector = await addRule(document, value, type, content, breakPoint, keyframe);
//         if (selector)
//             return selector;
//     }

//     const getSelector = (element) => {

//         const sel = getCssSelector(document, element, 1);
//         return sel;
//     }

//     const getElementStyle = (element) => {

//         const el = document.querySelector(element);
//         if (el)
//             return window.getComputedStyle(el, null);
//     }

//     const removeCssRule = (sheet, index) => {

//         return sheet.deleteRule(index);
      
//     }

//     const getSelectors = async (type) => { return await laodSelecters(document, type) }

//     return {
//         CssNodes,
//         setIframeDocumnet,
//         document,
//         laodCssNodes,
//         getSelectors,
//         getSelector,
//         addCssRule,
//         removeCssRule,
//         getElementStyle
//     }
// }


import React from "react";
import { DashboardLayout } from "../../Layout";
import Styling from "./Styling";


export function StylingComponent({ user }) {

    return (
        <DashboardLayout user={user}>
                <Styling />
        </DashboardLayout>
    );
};
