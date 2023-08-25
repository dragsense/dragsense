
import { v4 as uuid } from 'uuid';
import { nanoid } from 'nanoid';
import { storeData, updateData } from './db';
import addCSS from './addCss';

const addComponent = async (tag, state, document) => {


    try {

        return getComponent(tag, state, document);

    } catch (e) {

        throw new Error(e?.message);
    }

}


const getComponent = async (tag, state, document) => {

    switch (tag.component) {
        case 'formInput':
            return await createInput(tag, state, document);
            break;
        case 'menu':
            return await createMenu(tag, state, document);

            break;
        case 'flex':
            return await createFlex(state, document);
            break;
        case 'grid':
            return await createGrid(state, document);
            break;
        case 'container':
            return await createContainer(state, document);
            break;
        case 'slider':
            return await createSlider(state, document);
            break;
        case 'tabs':
            return await createTabs(state, document);
        case 'accordion':
            return await createAccordion(state, document);
            break;
        case 'gallery':
            return await createGallery(state, document);
            break;
        case 'modal':
            return await createModalTrigger(state, document);
            break;
        case 'sider':
            return await createSider(state, document);
            break;
        case 'dropdown':
            return await createDropDownTrigger(state, document);
            break;
        case 'gototop':
            return await createGoToTop(state, document);
            break;
        case 'observable':
            return await createObservable(state, document);
            break;
        case 'searchable':
            return await createSearchale(state, document);
            break;
        default: return ''
    }
}


const createInput = async (tag, state, document) => {

    const input_unique_id = uuid();
    let id = nanoid(8);

    let inputId = nanoid(4);
    const className = "ac" + "-form-group-" + id;
    const className2 = "ac" + "-input-container-" + id;

    const inputElement = {
        _uid: input_unique_id,
        tagName: tag.tag,
        name: tag.key + "_input",
        type: tag.type,
        layout: tag.layout,
        options: tag.options,
        attributes: { ...tag.attributes, id: { key: "id", value: inputId + "_" + tag.key } },
        state: {
            type: 'FORMSTATES',
            key: [tag.key, "defaultValue"]
        },
        onChange: {
            type: 'FORMSTATES',
            key: [tag.key, "key"]
        },
        labelPos: tag.labelPos,
        nodeValue: tag.nodeValue,
        childNodes: [],
        className: "",
        selector: "." + className2 + " input"

    };

    const label_unique_id = uuid();


    const labelElement = {
        _uid: label_unique_id,
        tagName: "label",
        name: tag.key + "_label",
        type: "texts",
        layout: "form-label",
        nodeValue: tag.label,
        attributes: { htmlFor: { key: "htmlFor", value: inputId + "_" + tag.key } },
        childNodes: [],
        className: "",
        selector: "." + className + " label"
    };

    const error_unique_id = uuid();


    const errorElement = {
        _uid: error_unique_id,
        tagName: "span",
        name: tag.key + "_error",
        type: "texts",
        nodeValue: tag.errorMessage,
        state: {
            type: 'FORMSTATES',
            key: [tag.key, "errorMessage"]
        },
        conditions: {
            'cond-0': {
                key: [tag.key, "error"],
                type: 'FORMSTATES',
                match: '===', value: '1', relation: 'AND',
                valueState: undefined
            }

        },

        childNodes: [],
        layout: "form-error-message",
        className: "error-message",
        selector: "." + className2 + " .error-message"

    };

    const input_wrraper_unique_id = uuid();


    const inputWrapperElement = {
        _uid: input_wrraper_unique_id,
        tagName: 'div',
        name: "div",
        type: "layouts",
        nodeValue: '',
        layout: "form-input-container",
        childNodes: [input_unique_id, error_unique_id],
        className: className2,
        selector: "." + className2

    };

    let childNodes = [];

    if (tag.labelPos === 0)
        childNodes = [label_unique_id, input_wrraper_unique_id]
    else
        childNodes = [input_wrraper_unique_id, label_unique_id]

    const wrraper_unique_id = uuid();



    const wrapperElement = {
        _uid: wrraper_unique_id,
        tagName: 'div',
        name: "div",
        type: "layouts",
        layout: "form-group",
        nodeValue: '',
        childNodes: childNodes,
        className: className,
        selector: "." + className,


    };

    await updateData(state.page._id, inputElement);
    await addCSS(document, {
        ...inputElement, cssText: {
            'padding': {
                value: '5px'
            },
            'border': {
                value: '1px solid #ccc'
            },
            'margin-right': {
                value: '5px'
            },
            'width': {
                value: '100%'
            }
        }
    });
    await updateData(state.page._id, labelElement);
    await addCSS(document, {
        ...labelElement, cssText: {
            'display': {
                value: 'inline-block'
            },
            'margin-right': {
                value: '5px'
            },
            'color': {
                value: '#333'
            },
        }
    });
    await updateData(state.page._id, errorElement);
    await addCSS(document, {
        ...errorElement, cssText: {
            'color': {
                value: '#ff0000'
            },
            'font-size': {
                value: '12px'
            },
        }
    });
    await updateData(state.page._id, inputWrapperElement);
    await addCSS(document, {
        ...inputWrapperElement,
        cssText: {
            'display': {
                value: 'flex'
            },
            'justify-content': {
                value: 'center'
            },
            'flex-direction': {
                value: 'column'
            }
        }

    });
    await updateData(state.page._id, wrapperElement);
    await addCSS(document, {
        ...wrapperElement,
        cssText: {
            'margin-right': {
                value: '10px'
            },
        }
    });

    return wrapperElement;
}



const createMenu = async (tag, state, document) => {

    const componentStates = { ...states['global'], ...states['menu'] };


    let id = nanoid(8);

    const className = "ac" + "-menu-" + id;

    const list_item_link_unique_id = uuid();

    const listItemLink = {
        _uid: list_item_link_unique_id,
        tagName: "a",
        name: "Menu Item Link 1",
        type: "texts",
        layout: "link",
        nodeValue: "Link 1",
        childNodes: [],
        attributes: {
            "href": {
                "key": "href",
                "value": "#",
            },
            "target": {
                "key": "target",
                "value": "_self",
            }
        },
        className: "menu-link",
        selector: "." + className + " .menu .menu-link"
    };


    const list_item_unique_id = uuid();

    const listItem = {
        _uid: list_item_unique_id,
        tagName: "li",
        name: "Menu Item 1",
        type: "texts",
        layout: "text",
        nodeValue: "",
        childNodes: [list_item_link_unique_id],
        className: "menu-item",
        selector: "." + className + " .menu .menu-item"
    };

    const list_unique_id = uuid();

    const list = {
        _uid: list_unique_id,
        tagName: "ul",
        name: "List",
        type: "texts",
        layout: "menu",
        nodeValue: "",
        childNodes: [list_item_unique_id],
        menus: [{
            key: '1',
            title: 'Link 1',
            link: '#',
            target: '_self',
            children: [],
        }],
        className: "menu",
        selector: "." + className + " .menu"
    };


    const childNodes = [list_unique_id]
    const wrraper_unique_id = uuid();

    const wrapperElement = {
        _uid: wrraper_unique_id,
        tagName: tag.tag,
        name: "Menu",
        type: "component",
        layout: "nav",
        nodeValue: "",
        childNodes: childNodes,
        className: className,
        selector: "." + className,
        states: componentStates

    };

    await updateData(state.page._id, listItemLink);
    await addCSS(document, {
        ...listItemLink,
        cssText: {
            'color': { value: 'inherit' },
            'text-decoration': { value: 'none' },
        }
    });
    await updateData(state.page._id, listItem);
    await addCSS(document, {
        ...listItem,
        cssText: {
            'margin': {
                value: '0px'
            },
            'padding': {
                value: '5px 10px'
            },
        }

    });
    await updateData(state.page._id, list);
    await addCSS(document, {
        ...list,
        cssText: {
            'display': {
                value: 'flex'
            },
            'gap': {
                value: '10px'
            },
            'list-style-type': {
                value: 'none'
            },

        }

    });
    await updateData(state.page._id, wrapperElement);
    await addCSS(document, wrapperElement);

    return wrapperElement;



}

const createFlex = async (state, document, childs = 2) => {

    const componentStates = {};

    let id = nanoid(8);
    const className = "ac" + "-flex-" + id;

    const childItem = {
        tagName: "div",
        name: "Flex Child",
        type: "layouts",
        layout: "flex-child",
        childNodes: [],
        className: "flex-child",
        selector: "." + className + " .flex-child"
    };

    const childNodes = [];
    const childsElement = [];
    for (let i = 0; i < childs; i++) {
        const unique_id = uuid();

        const child = {
            ...childItem,
            nodeValue: "",
            _uid: unique_id,
        };

        childNodes.push(unique_id);
        childsElement.push(child)
    }


    const wrraper_unique_id = uuid();

    const wrapperElement = {
        _uid: wrraper_unique_id,
        tagName: "div",
        name: "FlexBox",
        type: 'component',
        layout: "flex",
        nodeValue: "",
        childNodes: childNodes,
        className: className,
        selector: "." + className,
        states: componentStates

    };

    childsElement.forEach(async (child) => {
        await updateData(state.page._id, child);
        await addCSS(document, {
            ...child,
            cssText: {
                'flex': {
                    value: '1'
                },
                'padding': {
                    value: '5px'
                }
            }
        });
    })


    await updateData(state.page._id, wrapperElement);
    await addCSS(document, {
        ...wrapperElement,
        cssText: {
            'display': {
                value: 'flex'
            },
        }

    });

    return wrapperElement;



}

const createGrid = async (state, document, childs = 4) => {
    const componentStates = {};

    let id = nanoid(8);
    const className = "ac" + "-grid-" + id;


    const childItem = {
        tagName: "div",
        name: "Grid Child",
        type: "layouts",
        layout: "grid-child",
        childNodes: [],
        className: "grid-child",
        selector: "." + className + " .grid-child"
    };

    const childNodes = [];
    const childsElement = [];
    for (let i = 0; i < childs; i++) {
        const unique_id = uuid();

        const child = {
            ...childItem,
            nodeValue: "",
            _uid: unique_id,
        };

        childNodes.push(unique_id);
        childsElement.push(child)
    }
    const wrraper_unique_id = uuid();

    const wrapperElement = {
        _uid: wrraper_unique_id,
        tagName: 'div',
        name: "Grid",
        type: "component",
        layout: "grid",
        nodeValue: "",
        childNodes: childNodes,
        className: className,
        selector: "." + className,
        states: componentStates

    };

    childsElement.forEach(async (child) => {
        await updateData(state.page._id, child);
        await addCSS(document, {
            ...child,
            cssText: {
                'padding': {
                    value: '5px'
                }
            }
        });
    })
    await updateData(state.page._id, wrapperElement);
    await addCSS(document, {
        ...wrapperElement, cssText: {
            'display': {
                value: 'grid'
            },
            'grid-template-columns':
            {
                value: 'repeat(2, 1fr)'
            },
            'grid-gap': {
                value: '10px'
            }
        }
    });

    return wrapperElement;



}



const createContainer = async (state, document) => {

    const componentStates = {};


    let id = nanoid(8);
    const className = "ac" + "-container-" + id;


    const wrraper_unique_id = uuid();

    const wrapperElement = {
        _uid: wrraper_unique_id,
        tagName: "div",
        name: "Container",
        type: "component",
        layout: "container",
        nodeValue: "",
        childNodes: [],
        className: className,
        selector: "." + className,
        states: componentStates

    };


    await updateData(state.page._id, wrapperElement);
    await addCSS(document, {
        ...wrapperElement, cssText: {
            'max-width': {
                value: '1200px'
            },
            'position': {
                value: 'static'
            },
            'margin-left': {
                value: 'auto'
            },
            'margin-right': {
                value: 'auto'
            },
            'padding-left': {
                value: '15px',
                unit: 'px'
            },
            'padding-right': {
                value: '15px',
                unit: 'px'
            },
        }
    });

    return wrapperElement;



}



const createSlider = async (state, document) => {

    const componentStates = { ...states['global'], ...states['slider'] };



    let id = nanoid(8);
    const className = "ac" + "-slider-" + id;

    const slide_unique_id = uuid();
    const slideElement = {
        _uid: slide_unique_id,
        tagName: 'div',
        name: 'slide',
        type: 'layouts',
        layout: 'slide',
        nodeValue: '',
        childNodes: [],
        className: "slide",
        selector: "." + className + " .slides .slide"
    }

    const slides_unique_id = uuid();
    const slidesElement = {
        _uid: slides_unique_id,
        tagName: 'div',
        name: 'slides',
        type: 'layouts',
        layout: 'slides',
        nodeValue: '',
        childNodes: [slide_unique_id],
        className: "slides",
        selector: "." + className + " .slides"
    }

    slideElement.parent = slides_unique_id;



    const left_btn_unique_id = uuid();

    const slidesLeftButton = {
        _uid: left_btn_unique_id,
        tagName: 'button',
        name: 'Left',
        type: 'inputs',
        layout: 'button',
        nodeValue: 'Left',
        childNodes: [],
        attributes: {
            "disabled": {
                "key": "disabled",
                "value": true,
                "conditions": {
                    'cond-0': {
                        key: ["currentIndex"],
                        type: 'STATES',
                        match: '<=', value: '0', relation: 'AND',
                        valueState: undefined
                    }

                }
            },

        },
        onClick: {
            "key": ["currentIndex"],

            'type': "STATES",
            "withtype": "STATES",
            "withkey": ["currentIndex"],
            "value": "-1"
        },
        className: "slider-left-btn",
        selector: "." + className + " .slider-left-btn"

    }

    const right_btn_unique_id = uuid();

    const slidesRightButton = {
        _uid: right_btn_unique_id,
        tagName: 'button',
        name: 'Right',
        type: 'inputs',
        layout: 'button',
        nodeValue: 'Right',
        attributes: {
            "disabled": {
                "key": "disabled",
                "value": true,
                "conditions": {
                    'cond-0': {
                        key: ["currentIndex"],
                        type: 'STATES',
                        match: '>', value: 0, relation: 'AND',
                        valueState: { type: 'STATES', key: ['total'] }
                    }

                }
            },

        },
        onClick: {
            "key": ["currentIndex"],
            'type': "STATES",
            "withtype": "STATES",
            "withkey": ["currentIndex"],
            "value": "+1"
        },
        childNodes: [],
        className: "slider-right-btn",
        selector: "." + className + " .slider-right-btn"

    }


    const slider_dot_unique_id = uuid();

    const slidesDots = {
        _uid: slider_dot_unique_id,
        tagName: 'div',
        name: 'Slide dot',
        type: 'layouts',
        layout: 'div',
        onClick: {
            "key": ["currentIndex"],
            'type': "STATES",
            "statetype": "MAPINDEX",
            "value": "0"
        },
        conditions: {
            'cond-0': {
                key: ["currentIndex"],
                type: 'STATES',
                match: '!==', value: '0', relation: 'AND',
                valueState: { type: 'MAPVALUE' }
            }

        },
        map: {
            "key": ["items"],
            "type": "STATES"
        },
        childNodes: [],
        nodeValue: '',
        className: "slide-nav-item",
        selector: "." + className + " .slide-nav-item"

    }

    const dots_conatienr_id = uuid();

    const slidesDotsContainer = {
        _uid: dots_conatienr_id,
        tagName: 'div',
        name: 'Slides Dots',
        type: 'layouts',
        layout: 'div',
        childNodes: [slider_dot_unique_id],
        nodeValue: '',
        className: "slider-nav-container",
        selector: "." + className + " .slider-nav-container"

    }
    slidesDots.parent = dots_conatienr_id;
    const childNodes = [slides_unique_id, dots_conatienr_id, left_btn_unique_id, right_btn_unique_id];

    const wrraper_unique_id = uuid();
    slidesLeftButton.parent = wrraper_unique_id;
    slidesRightButton.parent = wrraper_unique_id;
    slidesDotsContainer.parent = wrraper_unique_id;
    slidesElement.parent = wrraper_unique_id;


    const wrapperElement = {
        _uid: wrraper_unique_id,
        tagName: "div",
        name: "Slider",
        layout: "slider",
        nodeValue: "",
        type: "component",
        childNodes: childNodes,
        className: className,
        selector: "." + className,
        states: componentStates

    };

    await updateData(state.page._id, slideElement);
    await addCSS(document, {
        ...slideElement,
        cssText: {
            'height': {
                value: '100%'
            },
        }
    });

    await updateData(state.page._id, slidesElement);
    await addCSS(document, {
        ...slidesElement,
        cssText: {
            'position': {
                value: 'relative'
            },
            'height': {
                value: '400px',
            },
        }
    });

    await updateData(state.page._id, slidesLeftButton);
    await addCSS(document, {
        ...slidesLeftButton,
        cssText: {

            position: {
                value: 'absolute',
            },
            top: {
                value: '50%',
            },
            left: {
                value: '10px',
            },
            transform: {
                value: 'translateY(-50%)',
            },
        },
    });

    // Add styles for the right button
    await updateData(state.page._id, slidesRightButton);
    await addCSS(document, {
        ...slidesRightButton,
        cssText: {

            position: {
                value: 'absolute',
            },
            top: {
                value: '50%',
            },
            right: {
                value: '10px',
            },
            transform: {
                value: 'translateY(-50%)',
            },
        },
    });


    await updateData(state.page._id, slidesDots);
    await addCSS(document, {
        ...slidesDots, cssText: {
            'width': {
                value: '10px'
            },
            'height': {
                value: '10px'
            },
            'border-radius': {
                value: '50%'
            },
            ' background-color': {
                value: '#ccc;'
            },
            'margin': {
                value: '0 5px'
            },
            'cursor': {
                value: 'pointer'
            },
        }
    });

    await updateData(state.page._id, slidesDotsContainer);
    await addCSS(document, {
        ...slidesDotsContainer, cssText: {
            'position': {
                value: 'absolute'
            },
            'bottom': {
                value: '10px'
            },
            'left': {
                value: '50%'
            },
            'transform': {
                value: 'translateX(-50%)'
            },
            'display': {
                value: 'flex'
            },
        }
    });

    await updateData(state.page._id, wrapperElement);
    await addCSS(document, {
        ...wrapperElement, cssText: {
            'position': {
                value: 'relative'
            },

        }
    });

    return wrapperElement;
}


const createTabs = async (state, document) => {

    const componentStates = { ...states['global'], ...states['tabs'] };


    let id = nanoid(8);
    const className = "ac" + "-tabs-" + id;

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
                        match: '===', value: '0', relation: 'AND',
                    }

                }
            },

        },
        onClick: {
            key: ["currentIndex"],
            'type': "STATES",
            "value": "0"
        },
        className: "tab-btn",
        selector: "." + className + " .tabs-btn .tab-btn"

    }

    const tabs_btn_unique_id = uuid();

    const tabsButton = {
        _uid: tabs_btn_unique_id,
        tagName: 'div',
        name: 'Tabs Button',
        type: 'layouts',
        layout: 'tabs-btn',
        nodeValue: '',
        childNodes: [tab_btn_unique_id],
        className: "tabs-btn",
        selector: "." + className + " .tabs-btn"

    }
    tabButton.parent = tabs_btn_unique_id;

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
        selector: "." + className + " .tabs-content .tab-content"

    }

    const tabs_content_unique_id = uuid();
    tabsButton.contentRef = tabs_content_unique_id;

    const tabsContentElement = {
        _uid: tabs_content_unique_id,
        tagName: 'div',
        name: 'Tabs Content',
        type: 'layouts',
        layout: 'tabs-content',
        nodeValue: '',
        childNodes: [tab_content_unique_id],
        className: "tabs-content",
        selector: "." + className + " .tabs-content"

    }
    tabContent.parent = tabs_content_unique_id;
    tabsContentElement.btnRef = tabs_btn_unique_id;

    const tabs_unique_id = uuid();

    const tabs = {
        _uid: tabs_unique_id,
        tagName: 'div',
        name: 'Tabs Body',
        type: 'layouts',
        layout: 'tabs',
        nodeValue: '',
        childNodes: [tabs_btn_unique_id, tabs_content_unique_id],
        className: "tabs",
        selector: "." + className + " .tabs"

    }
    tabs.btnRef = tabs_btn_unique_id;
    tabs.contentRef = tabs_content_unique_id;


    const wrraper_unique_id = uuid();

    tabs.parent = wrraper_unique_id;
    const childNodes = [tabs_unique_id];


    const wrapperElement = {
        _uid: wrraper_unique_id,
        tagName: "div",
        name: "Tabs",
        type: "layouts",
        layout: "tabs",
        nodeValue: "",
        type: "component",
        childNodes: childNodes,
        className: className,
        selector: "." + className,
        states: componentStates

    };

    await updateData(state.page._id, tabButton);
    await addCSS(document, {
        ...tabButton,
        cssText: {

            border: {
                value: 'none',
            },
            outline: {
                value: 'none',
            },
            "background-color": {
                value: '#f2f2f2',
            },

            padding: {
                value: '10px 20px',
            },
            cursor: {
                value: 'pointer',
            },
        },
    });

    await updateData(state.page._id, tabsButton);
    await addCSS(document, {
        ...tabsButton,
        cssText: {
        },
    });

    await updateData(state.page._id, tabContent);
    await addCSS(document, {
        ...tabContent,
        cssText: {
            padding: {
                value: '20px',
            },
            border: {
                value: '1px solid #ccc',
            },
            "background-color": {
                value: '#f2f2f2',
            },

        },
    });


    await updateData(state.page._id, tabsContentElement);
    await addCSS(document, {
        ...tabsContentElement, cssText: {

        }
    });


    await updateData(state.page._id, tabs);
    await addCSS(document, {
        ...tabs,
        cssText: {
        },
    });

    await updateData(state.page._id, wrapperElement);
    await addCSS(document, {
        ...wrapperElement, cssText: {
            'position': {
                value: 'relative'
            },
            'height': {
                value: '400px',
            },
        }
    });

    return wrapperElement;
}

const createAccordion = async (state, document) => {

    const componentStates = { ...states['global'], ...states['accordion'] };

    let id = nanoid(8);
    const className = "ac" + "-accordion-" + id;

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
        selector: "." + className + " .accordion .accordion-content"

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
        selector: "." + className + " .accordion .accordion-header",
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
        selector: "." + className + " .accordion"

    }
    accordionHeader.parent = accordion_unique_id;
    accordionContent.parent = accordion_unique_id;

    const accordions_unique_id = uuid();

    const accordionsElement = {
        _uid: accordions_unique_id,
        tagName: 'div',
        name: 'Accordion Body',
        type: 'layouts',
        layout: 'accordions',
        nodeValue: '',
        childNodes: [accordion_unique_id],
        className: "accordion-items",
        selector: "." + className + " .accordions-items"

    }
    accordionElement.parent = accordions_unique_id;


    const wrraper_unique_id = uuid();
    accordionsElement.parent = wrraper_unique_id;
    const childNodes = [accordions_unique_id];

    const wrapperElement = {
        _uid: wrraper_unique_id,
        tagName: "div",
        name: "Accordion",
        type: "layouts",
        layout: "component",
        nodeValue: "",
        type: "component",
        childNodes: childNodes,
        className: className,
        selector: "." + className,
        states: componentStates

    };

    await updateData(state.page._id, accordionHeader);
    await addCSS(document, {
        ...accordionHeader,
        cssText: {

            display: {
                value: 'flex',
            },
            "align-items": {
                value: 'center',
            },
            "background-color": {
                value: '#f2f2f2',
            },

            padding: {
                value: '10px',
            },
            cursor: {
                value: 'pointer',
            },
        },
    });

    await updateData(state.page._id, accordionContent);
    await addCSS(document, {
        ...accordionContent,
        cssText: {
            "background-color": {
                value: '#fff',
            },

            padding: {
                value: '10px',
            },

        },
    });

    await updateData(state.page._id, accordionElement);
    await addCSS(document, {
        ...accordionElement,
        cssText: {
            "margin-bottom": {
                value: '10px',
            },

        },
    });

    await updateData(state.page._id, accordionsElement);
    await addCSS(document, {
        ...accordionsElement,
        cssText: {

        },
    });


    await updateData(state.page._id, wrapperElement);
    await addCSS(document, {
        ...wrapperElement, cssText: {
            'position': {
                value: 'relative'
            },
        }
    });

    return wrapperElement;
}


const createGallery = async (state, document) => {

    const componentStates = { ...states['global'], ...states['gallery'] };

    let id = nanoid(8);
    const className = "ac" + "-gallery-" + id;

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
        selector: "." + className + " .gallery .gallery-img"

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
        selector: "." + className + " .gallery .gallery-item",
        onClick: {
            key: ["currentIndex"],
            'type': "STATES",
            "value": 0,
            "statetype": "MAPINDEX",

        },

    }
    image.parent = gallery_item_unique_id;


    const gallery_unique_id = uuid();

    const galleryElement = {
        _uid: gallery_unique_id,
        tagName: 'div',
        name: 'Gallery Body',
        type: 'layouts',
        layout: 'gallery',
        nodeValue: '',
        childNodes: [gallery_item_unique_id],
        className: "gallery",
        selector: "." + className + " .gallery"

    }

    galleryItem.parent = gallery_unique_id;


    const wrraper_unique_id = uuid();

    const modalElement = await createModal(state, document, className, {
        key: ["activeItem"],
        'type': "STATES",
    },);

    modalElement.parent = wrraper_unique_id;
    galleryElement.parent = wrraper_unique_id;
    const childNodes = [gallery_unique_id, modalElement._uid];

    const wrapperElement = {
        _uid: wrraper_unique_id,
        tagName: "div",
        name: "Gallery",
        type: "layouts",
        layout: "div",
        nodeValue: "",
        type: "component",
        childNodes: childNodes,
        className: className,
        selector: "." + className,
        states: componentStates

    };





    await updateData(state.page._id, modalElement);

    await updateData(state.page._id, image);
    await addCSS(document, {
        ...image,
        cssText: {
            'max-width': {
                value: '100%'
            },
            'height': {
                value: '100%'
            },

        },
    });


    await updateData(state.page._id, galleryItem);
    await addCSS(document, {
        ...galleryItem,
        cssText: {
            "margin-bottom": {
                value: '10px',
            },

        },
    });

    await updateData(state.page._id, galleryElement);
    await addCSS(document, {
        ...galleryElement,
        cssText: {
            "display": {
                value: 'grid',
            },

            "grid-template-columns": {
                value: 'repeat(auto-fill, minmax(250px, 1fr))',
            },
            "grid-gap": {
                value: '10px',
            }

        },
    });


    await updateData(state.page._id, wrapperElement);
    await addCSS(document, {
        ...wrapperElement, cssText: {
            'position': {
                value: 'relative'
            },
        }
    });

    return wrapperElement;
}

const createModalTrigger = async (state, document) => {

    const componentStates = { ...states['modal'] };


    let id = nanoid(8);
    const className = "ac" + "-modal-" + id;

    const modal_trigger_unique_id = uuid();

    const modalTrigger = {
        _uid: modal_trigger_unique_id,
        tagName: 'button',
        name: 'Modal Trigger',
        type: 'inputs',
        layout: 'button',
        nodeValue: 'Open Modal',
        childNodes: [],
        className: "modal-trigger",
        selector: "." + className + " .modal-trigger",
        onClick: {
            key: ["openModal"],
            'type': "STATES",
            "value": 1,
        },

    }
    const modalElement = await createModal(state, document, className, null);

    const wrraper_unique_id = uuid();
    modalElement.parent = wrraper_unique_id;
    modalTrigger.parent = wrraper_unique_id;

    const childNodes = [modal_trigger_unique_id, modalElement._uid];

    const wrapperElement = {
        _uid: wrraper_unique_id,
        tagName: "div",
        name: "Modal Button Wrapper",
        type: "layouts",
        layout: "div",
        nodeValue: "",
        type: "component",
        childNodes: childNodes,
        className: className,
        selector: "." + className,
        states: componentStates
    };



    await updateData(state.page._id, modalElement);

    await updateData(state.page._id, modalTrigger);
    await addCSS(document, {
        ...modalTrigger,
        cssText: {
            "margin-bottom": {
                value: '10px',
            },

        },
    });


    await updateData(state.page._id, wrapperElement);
    await addCSS(document, {
        ...wrapperElement, cssText: {
            "postion": {
                value: 'relative',
            },
            "display": {
                value: 'inline-block',
            },

        }
    });

    return wrapperElement;
}

const createModal = async (state, document, className, valueState) => {



    const modal_close_unique_id = uuid();

    const modalClose = {
        _uid: modal_close_unique_id,
        tagName: 'span',
        name: 'Modal Close',
        type: 'text',
        layout: 'text',
        nodeValue: '&times;',
        childNodes: [],
        className: "modal-close",
        selector: "." + className + " .modal-close",
        onClick: {
            key: ["openModal"],
            'type': "STATES",
            "value": 0,
        },

    }

    const modal_unique_id = uuid();
    modalClose.parent = modal_unique_id;

    const modal = {
        _uid: modal_unique_id,
        tagName: 'div',
        name: 'Modal Body',
        type: 'layouts',
        layout: 'div',
        nodeValue: '',
        childNodes: [modal_close_unique_id],
        className: "modal-body",
        selector: "." + className + " .modal .modal-body",
        state: valueState

    }

    const modal_element_unique_id = uuid();
    modal.parent = modal_element_unique_id;

    const modalElement = {
        _uid: modal_element_unique_id,
        tagName: 'div',
        name: 'Modal',
        type: 'layouts',
        layout: 'modal',
        bodyRef: modal_unique_id,
        nodeValue: '',

        childNodes: [modal_unique_id],
        className: "modal",
        selector: "." + className + " .modal",

    }



    await updateData(state.page._id, modal);
    await addCSS(document, {
        ...modal,
        cssText: {
            "position": {
                value: 'relative',
            },
            'background-color': {
                value: '#fefefe'
            },
            'padding': {
                value: '20px'
            },
            'border-radius': {
                value: '4px'
            },
            'width': {
                value: '50%'
            },
            'height': {
                value: '50%'
            },

        },
    });


    await updateData(state.page._id, modalElement);
    await addCSS(document, {
        ...modalElement,
        cssText: {
            'width': {
                value: '100%'
            },
            'height': {
                value: '100%'
            },
            ' background-color': {
                value: 'rgba(0, 0, 0, 0.5)'
            },
            'display': {
                value: 'flex'
            },
            'justify-content': {
                value: 'center'
            },
            'align-items': {
                value: 'center'
            },
        },
    });




    await updateData(state.page._id, modalClose);
    await addCSS(document, {
        ...modalClose,
        cssText: {
            "position": {
                value: 'absolute',
            },
            "top": {
                value: '10px',
            },
            "right": {
                value: '10px',
            },
            "font-size": {
                value: 'absolute',
            },
            "cursor": {
                value: 'pointer',
            },

        },
    });


    return modalElement;
}

const createSider = async (state, document) => {

    const componentStates = { ...states['sider'] };

    let id = nanoid(8);
    const className = "ac" + "-sider-" + id;

    const sider_content_unique_id = uuid();

    const siderContent = {
        _uid: sider_content_unique_id,
        tagName: 'div',
        name: 'Sider Content',
        type: 'layouts',
        layout: 'div',
        nodeValue: '',
        childNodes: [],

        className: "sider-content",
        selector: "." + className + " .sider .sider-content"

    }

    const sider_trigger_unique_id = uuid();

    const siderTrigger = {
        _uid: sider_trigger_unique_id,
        tagName: 'button',
        name: 'Sider Trigger',
        type: 'inputs',
        layout: 'button',
        nodeValue: 'Sider Button',
        childNodes: [],
        className: "sider-trigger",
        selector: "." + className + " .sider .sider-trigger",
        onClick: {
            key: ["openSider"],
            'type': "STATES",
            "value": "0",
        },

    }



    const sider_body_unique_id = uuid();

    const siderElement = {
        _uid: sider_body_unique_id,
        tagName: 'div',
        name: 'Sider Body',
        type: 'layouts',
        layout: 'sider',
        nodeValue: '',
        contentRef: sider_content_unique_id,
        childNodes: [sider_trigger_unique_id, sider_content_unique_id],
        className: "sider",
        selector: "." + className + " .sider"

    }
    siderTrigger.parent = sider_body_unique_id;
    siderContent.parent = sider_body_unique_id;



    const wrraper_unique_id = uuid();
    siderElement.parent = wrraper_unique_id;
    const childNodes = [sider_body_unique_id];

    const wrapperElement = {
        _uid: wrraper_unique_id,
        tagName: "div",
        name: "SideBar",
        type: "layouts",
        layout: "div",
        nodeValue: "",
        type: "component",
        childNodes: childNodes,
        className: className,
        selector: "." + className,
        states: componentStates

    };

    await updateData(state.page._id, siderContent);
    await addCSS(document, {
        ...siderContent,
        cssText: {

            width: {
                value: '100%',
            },
            height: {
                value: '100%',
            },
            'background-color': {
                value: '#f2f2f2',
            },

        },
    });

    await updateData(state.page._id, siderTrigger);
    await addCSS(document, {
        ...siderTrigger,
        cssText: {
            "margin": {
                value: '10px',
            },

        },
    });

    await updateData(state.page._id, siderElement);
    await addCSS(document, {
        ...siderElement,
        cssText: {
            "padding": {
                value: '20px',
            },

        },
    });


    await updateData(state.page._id, wrapperElement);
    await addCSS(document, {
        ...wrapperElement, cssText: {
            'position': {
                value: 'relative'
            },
            'display': {
                value: 'inline-block'
            },
        }
    });

    return wrapperElement;
}

const createDropDownTrigger = async (state, document) => {

    const componentStates = { ...states['dropdown'] };

    let id = nanoid(8);
    const className = "ac" + "-dropdown-" + id;

    const trigger_unique_id = uuid();

    const siderTrigger = {
        _uid: trigger_unique_id,
        tagName: 'button',
        name: 'Dropdown Trigger',
        type: 'inputs',
        layout: 'button',
        nodeValue: 'Dropdown Button',
        childNodes: [],
        className: "dropdown-trigger",
        selector: "." + className + " .dropdown-trigger",
        onClick: {
            key: ["openDropdown"],
            'type': "STATES",
            "value": "0",
        },

    }

    const dropDownContent = await createDropDown(state, document, className);

    const wrraper_unique_id = uuid();
    dropDownContent.parent = wrraper_unique_id;
    siderTrigger.parent = wrraper_unique_id;

    const childNodes = [trigger_unique_id, dropDownContent._uid];

    const wrapperElement = {
        _uid: wrraper_unique_id,
        tagName: "div",
        name: "Dropdown",
        type: "layouts",
        layout: "div",
        nodeValue: "",
        type: "component",
        childNodes: childNodes,
        className: className,
        selector: "." + className,
        states: componentStates

    };

    await updateData(state.page._id, dropDownContent);

    await updateData(state.page._id, siderTrigger);
    await addCSS(document, {
        ...siderTrigger,
        cssText: {
            "padding": {
                value: '8px 16px',
            },
            "background-color": {
                value: '#f2f2f2',
            },
            "border": {
                value: '1px solid #ccc',
            },
            "cursor": {
                value: 'pointer',
            },
        },
    });


    await updateData(state.page._id, wrapperElement);
    await addCSS(document, {
        ...wrapperElement, cssText: {
            'position': {
                value: 'relative'
            },
            'display': {
                value: 'inline-block'
            },
        }
    });

    return wrapperElement;
}

const createDropDown = async (state, document, className) => {

    const dropdown_content_unique_id = uuid();

    const dropDownContent = {
        _uid: dropdown_content_unique_id,
        tagName: 'div',
        name: 'Dropdown Content',
        type: 'layouts',
        layout: 'dropdown',
        nodeValue: '',
        childNodes: [],

        className: "dropdown-content",
        selector: "." + className + " .dropdown-content"

    }



    await updateData(state.page._id, dropDownContent);
    await addCSS(document, {
        ...dropDownContent,
        cssText: {

            'padding': {
                value: '5px'
            },
            'margin': {
                value: 0
            },
            'background-color': {
                value: '#fff'
            },
            'border': {
                value: '1px solid #ccc'
            },
            'border-top': {
                value: 'none'
            }
        },
    });



    return dropDownContent;
}


export const createMenuItem = async (
    tag,
    parentElemet,
    addToAbove,
    currentUid,
    pos,
    state
) => {
    const menus = parentElemet.menus;

    parentElemet.childNodes = [];

    for (let i = 0; i < menus.length; i++) {
        const element = menus[i];

        const list_link_unique_id = uuid();

        const listItemLink = {
            _uid: list_link_unique_id,
            tagName: "a",
            name: "Menu Item Link " + (i + 1),
            type: "texts",
            layout: "link",
            nodeValue: element.title,
            childNodes: [],
            attributes: {
                href: {
                    key: "href",
                    value: element.link,
                },
                target: {
                    key: "target",
                    value: element.target,
                },
            },
            className: "menu-link",
            selector: parentElemet.selector + " .menu-link",
        };

        const list_item_unique_id = uuid();

        const listItem = {
            _uid: list_item_unique_id,
            tagName: "li",
            name: "Menu Item " + (i + 1),
            type: "texts",
            layout: "text",
            nodeValue: "",
            childNodes: [list_link_unique_id],
            className: "menu-item",
            selector: parentElemet.selector + " .menu-item",
        };

        if (element.children && element.children.length > 0) {
            const componentStates = { ...states["dropdown"] };
            listItem.states = componentStates;
            listItem.type = "component";

            listItem.onClick = {
                key: ["openDropdown"],
                'type': "STATES",
                "value": "0",
            }

            const dropDownContent = await createDropDown(
                state,
                document,
                listItem.className
            );
            listItem.childNodes.push(dropDownContent._uid);
            dropDownContent.parent = list_item_unique_id;

            const list_unique_id = uuid();

            const list = {
                _uid: list_unique_id,
                tagName: "ul",
                name: "List",
                type: "texts",
                layout: "menu",
                nodeValue: "",
                childNodes: [],
                menus: element.children,
                className: "sub-menu",
                selector: parentElemet.selector + " .sub-menu",
            };
            dropDownContent.childNodes = [list_unique_id];
            list.parent = dropDownContent._uid;
            await updateData(state.page._id, dropDownContent);

            await createMenuItem({}, list, false, null, "", state);
        }

        listItemLink.parent = list_item_unique_id;
        parentElemet.childNodes.push(list_item_unique_id);

        listItem.parent = parentElemet._uid;

        await updateData(state.page._id, listItemLink);
        await updateData(state.page._id, listItem);
    }

    await updateData(state.page._id, parentElemet);

    return {
        pos: pos,
        parentId: parentElemet._uid,
        newId: parentElemet._uid,
    };
};

const createGoToTop = async (state, document) => {

    const componentStates = { ...states['gototop'] };

    let id = nanoid(8);
    const className = "ac" + "-gototop-" + id;

    const unique_id = uuid();

    const button = {
        _uid: unique_id,
        tagName: 'button',
        name: 'Go To Top',
        type: 'inputs',
        layout: "gototop",
        nodeValue: 'Go to Top',
        childNodes: [],
        className: className,
        selector: "." + className,
        states: componentStates

    }


    await updateData(state.page._id, button);
    await addCSS(document, {
        ...button, cssText: {
            'position': {
                value: 'fixed'
            },
            'bottom': {
                value: '20px'
            },
            'right': {
                value: '20px'
            },
            'padding': {
                value: '20px'
            },
            'border': {
                value: 'none'
            },
            'border-radius': {
                value: '50%'
            },
            'background-color': {
                value: '#333'
            },
            'color': {
                value: '#fff'
            },
            'font-size': {
                value: '16px'
            },
            'cursor': {
                value: 'pointer'
            },

        }
    });

    return button;
}


const createObservable = async (state, document) => {

    const componentStates = { ...states['observable'] };

    let id = nanoid(8);
    const className = "ac" + "-observable-" + id;

    const unique_id = uuid();

    const wrapperElement = {
        _uid: unique_id,
        tagName: 'div',
        name: 'Observable',
        type: 'component',
        layout: "observable",
        nodeValue: '',
        childNodes: [],
        classes: [],
        className: className,
        selector: "." + className,
        states: componentStates

    }


    await updateData(state.page._id, wrapperElement);
    await addCSS(document, {
        ...wrapperElement, cssText: {
            'position': {
                value: 'relative'
            },
        }
    });

    return wrapperElement;
}

const createSearchale = async (state, document) => {

    const componentStates = { ...states['global'], ...states['searchable'] };

    let id = nanoid(8);
    const className = "ac" + "-searchable-" + id;

    const input_unique_id = uuid();


    const inputElement = {
        _uid: input_unique_id,
        tagName: 'input',
        name: "search input",
        type: 'inputs',
        layout: "input",
        attributes: { type: { key: "type", value: 'text' }, placeholder: { key: "placeholder", value: "Search..." } },
        state: {
            type: 'STATES',
            key: ["searchText", "defaultValue"]
        },
        onChange: {
            type: 'STATES',
            key: ["searchText", "defaultValue"]
        },
        nodeValue: "",
        childNodes: [],
        className: "search-input",
        selector: "." + className + " .search-input"

    };
    const button_unique_id = uuid();

    const buttonElement = {
        _uid: button_unique_id,
        tagName: 'button',
        name: "search input",
        type: 'inputs',
        layout: "button",
        attributes: {
            type: { key: "type", value: 'button' }
        },
        onClick: {
            type: 'STATES',
            key: ["search", "defaultValue"],
            statetype: 'STATES',
            statekey: ["searchText", "defaultValue"],
            value: ''
        },
        nodeValue: "Submit",
        childNodes: [],
        className: ".search-btn",
        selector: "." + className + " .search-btn"

    };


    const search_unique_id = uuid();


    inputElement.parent = search_unique_id;
    buttonElement.parent = search_unique_id;

    const searchElement = {
        _uid: search_unique_id,
        tagName: 'div',
        name: 'Search',
        type: 'layouts',
        layout: "div",
        nodeValue: '',
        childNodes: [input_unique_id, button_unique_id],
        classes: [],
        className: "search",
        selector: "." + className + " .search"

    }
    const results_unique_id = uuid();

    const resultsElement = {
        _uid: results_unique_id,
        tagName: 'div',
        name: 'Results',
        type: 'layouts',
        layout: "div",
        nodeValue: '',
        childNodes: [],
        classes: [],
        map: {
            "key": ["pages"],
            "type": "STATES"
        },
        className: "results",
        selector: "." + className + " .results"

    }

    const wrraper_unique_id = uuid();

    searchElement.parent = wrraper_unique_id;
    resultsElement.parent = wrraper_unique_id;

    const childNodes = [search_unique_id, results_unique_id];

    const wrapperElement = {
        _uid: wrraper_unique_id,
        tagName: 'div',
        name: 'Searchable',
        type: 'component',
        layout: "searchable",
        nodeValue: '',
        childNodes: childNodes,
        classes: [],
        className: className,
        selector: "." + className,
        states: componentStates

    }


    await updateData(state.page._id, inputElement);
    await addCSS(document, {
        ...inputElement, cssText: {

        }
    });
    await updateData(state.page._id, buttonElement);
    await addCSS(document, {
        ...buttonElement, cssText: {

        }
    });
    await updateData(state.page._id, searchElement);
    await addCSS(document, {
        ...searchElement, cssText: {


        }
    });
    await updateData(state.page._id, resultsElement);
    await addCSS(document, {
        ...resultsElement, cssText: {


        }
    });

    await updateData(state.page._id, wrapperElement);
    await addCSS(document, {
        ...wrapperElement, cssText: {
            'position': {
                value: 'relative'
            },
        }
    });

    return wrapperElement;
}

const states = {

    global: {

        currentIndex: { key: 'currentIndex', defaultValue: 0, type: 'number', min: 0, max: 0 },
        total: { key: 'total', defaultValue: 0, type: 'number', min: 0, max: 0 },
    },

    slider: {
        items: {
            key: 'items', defaultValue: "0", states: [], text: "Slider", type: 'array',

        },
        type: { key: 'type', defaultValue: 'slide', type: 'dropdown', values: ['slide', 'fade'] },

        numColumns: { key: 'numColumns', defaultValue: 1, type: 'number' },
        moveColumns: { key: 'moveColumns', defaultValue: 1, type: 'number' },
        loop: { key: 'loop', defaultValue: true, type: 'boolean' },
        autoPlay: { key: 'autoPlay', defaultValue: false, type: 'boolean' },
        interval: { key: 'interval', defaultValue: 2000, type: 'number' },
        hoverStop: { key: 'hoverStop', defaultValue: false, type: 'boolean' },
        duration: { key: 'duration', defaultValue: 300, type: 'number' },



        activeItem: { key: 'activeItem', defaultValue: null, type: 'node' },

    },

    tabs: {
        items: {
            key: 'items', defaultValue: "0", states: [], text: "Tab", type: 'array',

        },
    },

    accordion: {
        items: {
            key: 'items', defaultValue: "0", states: [], text: "Accordion", type: 'array',

        },
    },

    gallery: {
        items: {
            key: 'items', defaultValue: "0", states: [], text: "Gallery Item", type: 'array',

        },
        openModal: { key: 'openModal', defaultValue: 0, type: 'boolean' },
        activeItem: { key: 'activeItem', defaultValue: null, type: 'node' },
        modal: { key: 'modal', defaultValue: false, type: 'boolean' },
        type: { key: 'type', defaultValue: 'fade', type: 'dropdown', values: ['fade'] },

        duration: { key: 'duration', defaultValue: 300, type: 'number' },


    },

    modal: {
        openModal: { key: 'openModal', defaultValue: 0, type: 'boolean' },
        type: { key: 'type', defaultValue: 'fade', type: 'dropdown', values: ['fade'] },

        duration: { key: 'duration', defaultValue: 300, type: 'number' },
    },
    dropdown: {
        openDropdown: { key: 'openDropdown', defaultValue: 0, type: 'boolean' },
        type: { key: 'type', defaultValue: 'fade', type: 'dropdown', values: ['fade'] },

        openSide: {
            key: 'openSide', defaultValue: "topLeft", type: 'dropdown', values: [
                'topRight',
                'topLeft',
                'bottomLeft',
                'bottomRight',
            ]
        },
        leftOffset: { key: 'leftOffset', defaultValue: '15px', type: 'text' },
        topOffset: { key: 'topOffset', defaultValue: '50px', type: 'text' },
        duration: { key: 'duration', defaultValue: 300, type: 'number' },


    },
    sider: {
        openSider: { key: 'openSider', defaultValue: 0, type: 'boolean' },
        type: { key: 'type', defaultValue: 'expandRight', type: 'dropdown', values: ['expandLeft', 'expandRight', 'expandTop', 'expandBottom'] },

        intialValue: { key: 'intialValue', defaultValue: '200px', type: 'text' },
        expandValue: { key: 'expandValue', defaultValue: '400px', type: 'text' },

        duration: { key: 'duration', defaultValue: 300, type: 'number' },


    },
    gototop: {
    },
    observable: {
        tagName: {
            key: 'tagName', defaultValue: 'div', type: 'dropdown',
            values: ['div', 'button']
        },

        onScroll: { key: 'onScroll', defaultValue: 0, type: 'boolean' },
        scrollTop: { key: 'scrollTop', defaultValue: 50, type: 'number' },
        scrollLeft: { key: 'scrollLeft', defaultValue: 100, type: 'number' },
        scrollTopClass: { key: 'scrollTopClass', defaultValue: '', type: 'text' },
        scrollLeftClass: { key: 'scrollLeftClass', defaultValue: '', type: 'text' },

        onVisible: { key: 'onVisible', defaultValue: 0, type: 'boolean' },
        visible: { key: 'visible', defaultValue: 0.1, step: 0.1, min: 0, max: 1, type: 'slider' },
        oneTime: { key: 'oneTime', defaultValue: 0, type: 'boolean' },

        visibleClass: { key: 'visibleClass', defaultValue: '', type: 'text' },
        inVisibleClass: { key: 'inVisibleClass', defaultValue: '', type: 'text' },



    },
    searchable: {
        items: {
            key: 'items', defaultValue: "0", states: [], text: "Search Item", type: 'array',

        },
        pages: {
            key: 'pages', defaultValue: "0", states: [], text: "Results", type: 'array',

        },
        trigger: { key: 'trigger', defaultValue: 0, type: 'boolean' },

        searchText: { key: 'searchText', defaultValue: '', type: 'search' },
        search: { key: 'search', defaultValue: '', type: 'search' },

        limit: { key: 'limit', defaultValue: '', type: 'number' },
        page: { key: 'page', defaultValue: '', type: 'number' },


    },
    menu: {
        items: {
            key: 'items',
            type: 'array',
            defaultValue: "",
            states: [],
            text: "Menu Item",

        },


    }
}




export default addComponent;