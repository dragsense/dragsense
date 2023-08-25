
import { v4 as uuid } from 'uuid';
import { nanoid } from 'nanoid';
import addCSS from './addCss';
import { storePage, getAllData, getData, updateData } from './db';
import addComponent, { createMenuItem } from './addComponent';
import { loadPage, } from './manageDB';
import { message } from 'antd';

const addElement = async (tag,
    parentElemet,
    addToAbove,
    currentUid,
    pos,
    state,
    document) => {


    try {

        switch (parentElemet.layout) {
            case 'slides':
                return await createSlide(tag,
                    parentElemet,
                    state,
                    pos,
                    document,);
            case 'tabs-btn':
            case 'tabs-content':
            case 'tabs':
                return await createTab(tag,
                    parentElemet,
                    addToAbove,
                    currentUid,
                    pos,
                    state,
                    document,);
            case 'accordions':
            case 'accordion':
                return await createAccordion(tag,
                    parentElemet,
                    addToAbove,
                    currentUid,
                    pos,
                    state,
                    document,);
            case 'gallery':
                return await createGalleryItem(tag,
                    parentElemet,
                    addToAbove,
                    currentUid,
                    pos,
                    state,
                    document,);

            case 'modal':
                return await createModalItem(tag,
                    parentElemet,
                    addToAbove,
                    currentUid,
                    pos,
                    state,
                    document,);

            case 'sider':
                return await createSiderItem(tag,
                    parentElemet,
                    addToAbove,
                    currentUid,
                    pos,
                    state,
                    document,);
            case 'menu':
                return await createMenuItem(tag,
                    parentElemet,
                    addToAbove,
                    currentUid,
                    pos,
                    state,
                    document,);

            default:
                return await createElement(tag,
                    parentElemet,
                    addToAbove,
                    currentUid,
                    pos,
                    state,
                    document, proeprties[tag.layout] || {})
        }

    } catch (e) {

        throw new Error(e?.message);
    }

}

const createSlide = async (tag,
    parentElemet,
    state,
    pos,
    document,) => {



    const slide_unique_id = uuid();
    const slideElement = {
        _uid: slide_unique_id,
        tagName: 'div',
        name: 'slide',
        type: 'layouts',
        layout: 'slide-item',
        nodeValue: '',
        childNodes: [],
        className: "slide",
        selector: parentElemet.selector + " .slide"
    }

    await createElement(tag,
        slideElement,
        false,
        null,
        pos,
        state,
        document, proeprties[tag.layout] || {})

    parentElemet.childNodes.push(slide_unique_id);
    await updateData(state.page._id, parentElemet);

    return {
        pos,
        parentId: parentElemet._uid,
        newId: slideElement._uid
    };
}

const createTab = async (
    tag,
    parentElemet,
    addToAbove,
    currentUid,
    pos,
    state,
    document,) => {



    let tabsButton = null;
    let tabsContent = null;

    let dragPos = '';
    if (parentElemet.layout === 'tabs-btn') {
        tabsButton = parentElemet;
        tabsContent = await getData(state.page._id, tabsButton.contentRef);
        dragPos = pos + "1";
    } else
        if (parentElemet.layout === 'tabs-content') {
            tabsContent = parentElemet;
            tabsButton = await getData(state.page._id, tabsContent.btnRef);
            dragPos = pos + "0";
        } else {
            tabsButton = await getData(state.page._id, parentElemet.btnRef);
            tabsContent = await getData(state.page._id, parentElemet.contentRef);
            pos = pos + "0"
            dragPos = pos + "1";

        }


    const totalLength = tabsContent.childNodes.length;

    const tab_btn_unique_id = uuid();
    const tabButton = {
        _uid: tab_btn_unique_id,
        tagName: 'button',
        name: 'Tab Button',
        type: 'inputs',
        layout: 'button',
        nodeValue: 'Tab Button',
        childNodes: [],
        attributes: {
            "disabled": {
                "key": "disabled",
                "value": true,
                "conditions": {
                    'cond-0': {
                        key: ["currentIndex"],
                        type: 'STATES',
                        match: '===', value: totalLength, relation: 'AND',

                    }

                }
            },

        },
        onClick: {
            key: ["currentIndex"],
            'type': "STATES",
            "value": totalLength
        },
        className: "tab-btn",
        selector: tabsButton.selector + " .tab-btn"

    }

    tabsButton.childNodes = [...tabsButton.childNodes, tab_btn_unique_id]
    const tab_content_unique_id = uuid();

    const tabContent = {
        _uid: tab_content_unique_id,
        tagName: 'div',
        name: 'Tab Content',
        type: 'layouts',
        layout: 'tab-content',
        nodeValue: 'Tab Content',
        childNodes: [],
        className: "tab-content",
        selector: tabsContent.selector + " .tab-content"
    }
    await createElement(tag,
        tabContent,
        false,
        null,
        pos,
        state,
        document, proeprties[tag.layout] || {})

    tabsContent.childNodes = [...tabsContent.childNodes, tab_content_unique_id]

    await updateData(state.page._id, tabButton);
    await updateData(state.page._id, tabsButton);
    await updateData(state.page._id, tabsContent);

    return {
        pos: pos,
        dragPos: dragPos,
        currentId: tabsContent._uid,
        parentId: tabsButton._uid,
        newId: tabButton._uid
    };
}

const createAccordion = async (tag,
    parentElemet,
    addToAbove,
    currentUid,
    pos,
    state,
    document,) => {


    if (parentElemet.layout === 'accordion') {
        parentElemet = await getData(state.page._id, parentElemet.parent);

    }

    const accordion_content_unique_id = uuid();

    const accordionContent = {
        _uid: accordion_content_unique_id,
        tagName: 'div',
        name: 'Accordion Content',
        type: 'layouts',
        layout: 'div',
        nodeValue: '',
        childNodes: [],

        className: "accordion-content",
        selector: parentElemet.selector + " .accordion-content"

    }

    const accordion_header_unique_id = uuid();

    const accordionHeader = {
        _uid: accordion_header_unique_id,
        tagName: 'div',
        name: 'Accordion Header',
        type: 'inputs',
        layout: 'div',
        nodeValue: 'Accordion Header',
        childNodes: [],
        className: "accordion-header",
        selector: parentElemet.selector + " .accordion-header",
        onClick: {
            key: ["currentIndex"],
            'type': "STATES",
            "value": "0",
            "statetype": "MAPINDEX",

        },

    }



    const accordion_unique_id = uuid();

    const accordionElement = {
        _uid: accordion_unique_id,
        tagName: 'div',
        name: 'Accordion Item',
        type: 'layouts',
        layout: 'accordion',
        nodeValue: '',
        childNodes: [accordion_header_unique_id, accordion_content_unique_id],
        className: "accordion",
        selector: parentElemet.selector + " .accordion"

    }
    accordionHeader.parent = accordion_unique_id;
    accordionContent.parent = accordion_unique_id;


    await createElement(tag,
        accordionContent,
        false,
        null,
        pos,
        state,
        document, proeprties[tag.layout] || {})

    if (addToAbove) {
        const index = parentElemet.childNodes.indexOf(currentUid);
        parentElemet.childNodes.splice(index, 0, accordion_unique_id);
    }
    else
        parentElemet.childNodes.push(accordion_unique_id);

    accordionElement.parent = parentElemet._uid;

    await updateData(state.page._id, accordionHeader);

    await updateData(state.page._id, accordionElement);
    await updateData(state.page._id, parentElemet);

    return {
        pos: pos,
        parentId: parentElemet._uid,
        newId: accordionElement._uid
    };
}

const createGalleryItem = async (tag,
    parentElemet,
    addToAbove,
    currentUid,
    pos,
    state,
    document,) => {


    const img_unique_id = uuid();

    const image = {
        _uid: img_unique_id,
        tagName: 'img',
        name: 'Image',
        type: 'media',
        layout: 'img',
        nodeValue: '',
        childNodes: [],
        className: "gallery-img",
        selector: parentElemet.selector + " .gallery-img"

    }

    const gallery_item_unique_id = uuid();

    const galleryItem = {
        _uid: gallery_item_unique_id,
        tagName: 'div',
        name: 'Gallery Item',
        type: 'layouts',
        layout: 'div',
        nodeValue: '',
        childNodes: [img_unique_id],
        className: "gallery-item",
        selector: parentElemet.selector + " .gallery-item",
        onClick: {
            key: ["currentIndex"],
            'type': "STATES",
            "value": 0,
            "statetype": "MAPINDEX",

        },

    }
    image.parent = gallery_item_unique_id;



    if (addToAbove) {
        const index = parentElemet.childNodes.indexOf(currentUid);
        parentElemet.childNodes.splice(index, 0, gallery_item_unique_id);
    }
    else
        parentElemet.childNodes.push(gallery_item_unique_id);

    galleryItem.parent = parentElemet._uid;

    await updateData(state.page._id, image);
    await updateData(state.page._id, galleryItem);
    await updateData(state.page._id, parentElemet);

    return {
        pos: pos,
        parentId: parentElemet._uid,
        newId: galleryItem._uid
    };
}

const createModalItem = async (tag,
    parentElemet,
    addToAbove,
    currentUid,
    pos,
    state,
    document,) => {


    const modal = await getData(state.page._id, parentElemet.bodyRef);

    return await createElement(tag,
        modal,
        false,
        null,
        pos + "0",
        state,
        document, proeprties[tag.layout] || {})

}


const createSiderItem = async (tag,
    parentElemet,
    addToAbove,
    currentUid,
    pos,
    state,
    document,) => {

    const siderContent = await getData(state.page._id, parentElemet.contentRef);


    return await createElement(tag,
        siderContent,
        false,
        null,
        pos,
        state,
        document, proeprties[tag.layout] || {})
}



const createElement = async (tag,
    parentElemet,
    addToAbove,
    currentUid,
    pos,
    state,
    document, cssText) => {

    let newElement = null;
    if (tag.type === 'component')
        newElement = await addComponent(tag, state, document);
    else {
        const unique_id = uuid();


        if (tag.page) {
            newElement = {
                ...tag,
                _uid: unique_id
            }
        } else {
            let id = nanoid(8);
            const className = "ac" + "-elem-" + id;
            newElement = {
                _uid: unique_id,
                tagName: tag.tag,
                name: tag.layout,
                type: tag.type,
                layout: tag.layout,
                attributes: tag.attributes,
                state: tag.state,
                map: tag.map,
                nodeValue: tag.nodeValue ? tag.nodeValue : tag.text ? tag.text : '',
                childNodes: [],
                classes: tag.classes,
                className: className,
                selector: "." + className,
                page: tag.page

            };
        }


        await addCSS(document, { ...newElement, cssText });
    }


    newElement.parent = parentElemet._uid;

    if (addToAbove) {
        const index = parentElemet.childNodes.indexOf(currentUid);
        parentElemet.childNodes.splice(index, 0, newElement._uid);
    }
    else
        parentElemet.childNodes.push(newElement._uid);

    await updateData(state.page._id, newElement);
    await updateData(state.page._id, parentElemet);


    return {
        pos: pos,
        parentId: parentElemet._uid,
        newId: newElement._uid,

    };
}


const proeprties = {

    "normal": {},


    'main': {

        'background-color': {
            value: '#f2f2f2'
        },
        'padding': {
            value: '10px'
        },
    },

    'icon': {
        'font-size': {
            value: '27.6px'
        },
        'display': {
            value: 'inline-block'
        },
     
     
    },
    'svg-icon': {
     
        'display': {
            value: 'inline-block'
        },
        'width': {
            value: '24px'
        },
    
    },

    'img': {
        'max-width': {
            value: '100%'
        },
        'height': {
            value: 'auto'
        },
    },

}




export default addElement;