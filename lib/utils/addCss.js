

import { v4 as uuid } from 'uuid';

import { updateStyleData } from "./db";

const addCSS = async (document, newElement) => {


    try {
        const cssText = await getCSS(document, newElement);

    } catch (e) {
        throw new Error(e?.message);
    }

}

const getCSS = async (document, newElement) => {


    return await createCSS(document, newElement.cssText || {}, newElement);


}

const createCSS = async (document, properties, newElement) => {

    let sheet = document.styleSheets[0];
    const cssRules = sheet.cssRules || sheet.rules;

    let cssText = '';
    for (const property in properties) {
        if (properties.hasOwnProperty(property)) {
            const value = properties[property].value;
            cssText += `${property}: ${value}; `;
        }
    }

    const selectorText = newElement.selector;
    const elementType = newElement.tagName;


    const index = sheet.insertRule(`${selectorText} {${cssText}}`, cssRules.length);

    const selector = { selectorText, properties, index };
    await updateStyleData({ type: 'normal', elementType, ...selector }, ['normal', elementType]);


    return cssText;
}



export default addCSS;