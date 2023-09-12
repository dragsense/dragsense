

import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';

import { Button, Card, Dropdown, List, Menu, Tree, message, theme } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import ThemeServices from '@/lib/services/theme';
import SettingServices from '@/lib/services/setting';
import Selection from '../Editor/Element/Selection';
import { CloseOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

import dynamic from 'next/dynamic';

import ContentEditor from '../Editor/Element/ContentEditor';
import { MdElectricalServices } from 'react-icons/md';

const InnerComponent = ({ children, document, onLoad }) => {


  useEffect(() => {

    const _id = localStorage.getItem('activePage');
    const type = localStorage.getItem('pageType');
    loadCSSStyles(type, _id).then((status) => {
      onLoad({ _id }, type);
    }).catch((e) => {
      message.error(e?.message || 'Something went wrong!');
    });



  }, []);

  const loadCSSStyles = async (type, _id) => {
    return new Promise(async (resolve, reject) => {

      try {

        let res = await SettingServices.get();
        if (res?.setting)
          document.head.insertAdjacentHTML("beforeend", res.setting.scripts?.head);

        res = await ThemeServices.getFonts();

        res.fonts?.forEach(async (font) => {
          const { _uid, fontFamily, fontSrc, src, isGoogleFont } = font;

          if (isGoogleFont && src) {
            const linkElement = document.createElement('div');
            linkElement.id = 'google-font-' + _uid;
            linkElement.innerHTML = src;
            document.head.appendChild(linkElement);
          }
          else
            if (Array.isArray(fontSrc)) {
              try {

                const styleElement = document.createElement('style');
                styleElement.textContent = '';

                for (const src of fontSrc) {
                  styleElement.textContent += `
                    @font-face {
                      font-family: "${fontFamily}";
                      src: url("${src.src}");
                    }
                  `;
                }

                document.head.appendChild(styleElement);
              } catch (error) {
                message.error(`Failed to load ${fontFamily} font: ${error}`);
              }
            }
        });





        res = await ThemeServices.getColors()
        const root = document.documentElement;
        for await (let color of res.colors) {
          root.style.setProperty(color.value, color.color);
        }

        let style = document.createElement('style');


        style.textContent = `
     
        html {
          cursor: pointer;
        }
        @keyframes ac-001-pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
        
        `

        document.head.appendChild(style);

        res = await ThemeServices.getStyle();

        style = document.createElement('style');
        style.textContent = res.css;
        document.head.appendChild(style);


        res = await ThemeServices.getPageStyle(type, _id)



        for await (let css of res.css) {
          let style = document.createElement('style');
          style.textContent = css;
          style.id = 'ac-stylesheet-global'
          document.head.appendChild(style);
        }









        resolve(true);

      } catch (e) {
        reject(e?.message);
      }
    })
  }

  return children;

};


const ShadowRootComponent = ({ children }) => {
  const rootRef = useRef();

  return children;
};

export default function IFrame({ state, children, onUpdate, onLoad, node, onClickElement, onAdd, onDelete, onCopy, onMove }) {

  const iframeRef = useRef();
  const overlayRef = useRef();
  const overlayRef2 = useRef();
  const tooltipRef = useRef();

  const {
    token: { colorPrimary, colorPrimaryBg, },
  } = theme.useToken();




  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuElements, setContextMenuElements] = useState([]);

  function createContextMenu(elements, mousePosition) {



    const elementsWithUid = elements.filter(element => element.dataset.id).map(element => ({
      uid: element.dataset.id,
      name: element.dataset.name || element.tagName,
      pos: element.dataset.pos
    }));


    setContextMenuVisible(true);
    setContextMenuPosition({
      x: mousePosition.x,
      y: mousePosition.y,
    });
    setContextMenuElements(elementsWithUid);
  }

  useEffect(() => {

    if (!tooltipRef?.current || !contextMenuVisible)
      return;

    if (!container?.window)
      return;



    const toolTypeStyle = window.getComputedStyle(tooltipRef?.current)

    const tooltipWidth = parseInt(toolTypeStyle.width, 10); // Width of the tooltip
    const tooltipHeight = parseInt(toolTypeStyle.height, 10); // Height of the tooltip

    if (contextMenuPosition.x + tooltipWidth > container.window.innerWidth) {
      contextMenuPosition.x -= tooltipWidth;
    }

    const adjustedX = contextMenuPosition.x;

    if (contextMenuPosition.y + tooltipHeight > container.window.innerHeight) {
      contextMenuPosition.y -= tooltipHeight;
    }
    const adjustedY = contextMenuPosition.y;

    setContextMenuPosition({
      x: adjustedX,
      y: adjustedY,
      visible: true
    });
  }, [contextMenuVisible, contextMenuPosition])


  const [container, setConainer] = useState(null);
  const [gapBarPos, setGapBprPos] = useState(null);

  const handleMenuItemClick = (key) => {
    onClickElement(container?.document, key);
    ContentEditor.destroy();
  };



  useEffect(() => {
    if (!iframeRef.current)
      return;

    const iframe = iframeRef.current;
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    const iframeWindow = iframe.contentWindow;

    setConainer({ window: iframeWindow, mountTarget: iframeDocument.body, document: iframeDocument });
  }, [iframeRef.current])

  useEffect(() => {


    if (!iframeRef.current)
      return;



    const iframe = iframeRef.current;
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

    let isTop = false;


    const onDragOverHandle = (event) => {

      event.preventDefault();
      // event.stopPropagation();


      if (event.ctrlKey) {
        const elements = Array.from(iframeDocument.elementsFromPoint(event.clientX, event.clientY));
        createContextMenu(elements, { x: event.clientX + 10, y: event.clientY + 10 });
      }

      var currentElement = event.target;

      const id = currentElement.dataset.id || currentElement.parentNode.dataset.id;

      if (currentElement === iframeDocument.body || !id) {
        return;
      }
      //const pos = currentElement.dataset.pos;
      const name = currentElement.dataset.name || currentElement.tagName;

      const rect = currentElement.getBoundingClientRect();

      const hoverMiddleY = 10;

      const hoverClientY = event.clientY - rect.top;

      if (hoverClientY < hoverMiddleY) {

        setGapBprPos({
          value: name,
          left: rect.left,
          width: rect.width,
          top: rect.top - 5, height: 5,
          background: colorPrimaryBg,
          borderBottom: `2px solid ${colorPrimary}`,
          display: 'initial'
        });

        isTop = true;

      }
      else {
        setGapBprPos({
          value: name,

          border: `2px solid ${colorPrimary}`, display: 'initial',
          left: rect.left - 2, width: rect.width, top: rect.top - 2, height: rect.height
        });
        isTop = false;


      }





    }

    iframeDocument.body.addEventListener("dragover", onDragOverHandle);

    const onDragLeaveHandle = (event) => {
      event.preventDefault();

      var currentElement = event.target;

      if (currentElement === iframeDocument.body) {
        return;
      }
      isTop = false;

      setGapBprPos(null);
    }

    iframeDocument.body.addEventListener("dragleave", onDragLeaveHandle);

    const onDropHandle = (event) => {
      event.preventDefault();


      var currentElement = event.target;

      if (currentElement === iframeDocument.body) {
        return;
      }

      const id = currentElement.dataset.id || currentElement.parentNode.dataset.id;

      const pos = currentElement.dataset.pos;

      const tag = JSON.parse(event.dataTransfer.getData('text/plain'));


      if (tag.move)
        onMove(id, tag._uid, isTop, pos, tag.dragPos, iframeDocument);
      else
        onAdd(tag, id, isTop, pos, iframeDocument);

      setGapBprPos(null);

      isTop = false;

    }


    iframeDocument.body.addEventListener("drop", onDropHandle);



    let isEditing = false;
    const onClickHandle = (event) => {

      if (isEditing) return;

      const scrollTop = iframeRef.current.contentWindow.pageYOffset;
      const scrollLeft = iframeRef.current.contentWindow.pageXOffset;
      const top = (scrollTop + 44) + 'px';
      const left = (scrollLeft) + 'px';

      overlayRef2.current.style.top = top;
      overlayRef2.current.style.left = left;


      event.preventDefault();
      const id = event.target.dataset.id || event.target.parentNode.dataset.id;
      onClickElement(iframeDocument, id);
      ContentEditor.destroy();


    }

    const onDblClickHandle = (event) => {
      event.preventDefault();

      const currentId = event.target.dataset.id;
      const childElement = event.target.querySelector('[data-child=true]');


      if (currentId && !isEditing && childElement) {
        isEditing = true;
        childElement.style.cursor = "text"
        //childElement.style.pointerEvents = null;

        ContentEditor.start(childElement, overlayRef2.current);
      }


    }


    iframeDocument.body.addEventListener("dblclick", onDblClickHandle);
    iframeDocument.body.addEventListener('click', onClickHandle);

    const handleKeyPress = (event) => {
      if (event.key === "Escape") {

        if (isEditing) {
          const current = ContentEditor.getCurrent();
          onUpdate(current.innerHTML);
        }

        isEditing = false;
        ContentEditor.destroy();
      } else
        if (event.ctrlKey) {
          const elements = Array.from(iframeDocument.elementsFromPoint(event.clientX, event.clientY));
          createContextMenu(elements, { x: event.clientX + 10, y: event.clientY + 10 });
        }
    }

    iframeDocument.body.addEventListener("keydown", handleKeyPress);

    const onScrollHandle = (event) => {


      event.preventDefault();
      const scrollTop = iframeRef.current.contentWindow.pageYOffset;
      const scrollLeft = iframeRef.current.contentWindow.pageXOffset;

      overlayRef.current.style.top = (0 - scrollTop) + 'px';
      overlayRef.current.style.left = (0 - scrollLeft) + 'px';


    }
    iframeRef.current.contentWindow.addEventListener("scroll", onScrollHandle);



    const scrollTop = iframeRef.current.contentWindow.pageYOffset;
    const scrollLeft = iframeRef.current.contentWindow.pageXOffset;
    overlayRef2.current.style.top = (scrollTop + 44) + 'px';
    overlayRef2.current.style.left = (scrollLeft) + 'px';



    const mutationHandler = (mutationsList) => {

      if (isEditing)
        return;

      let isCanvas = false;

      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          for (const addedNode of mutation.addedNodes) {
            if (addedNode.classList?.contains('html2canvas-container')) {
              isCanvas = true;
              break;
            }
          }

          for (const removedNode of mutation.removedNodes) {
            if (removedNode.classList?.contains('html2canvas-container')) {
              isCanvas = true;
              break;
            }
          }
        }
      }

      if (mutationsList.length > 0 && !isCanvas)
        onClickElement(iframeDocument, null, true);
    };

    const observer = new MutationObserver(mutationHandler);
    observer.observe(iframeDocument.body, { childList: true, subtree: true });


    iframeDocument.addEventListener('contextmenu', event => {
      event.preventDefault();
      const elements = Array.from(iframeDocument.elementsFromPoint(event.clientX, event.clientY));
      const mousePosition = { x: event.clientX, y: event.clientY, visible: false };


      createContextMenu(elements, mousePosition);
    });



    return () => {

      if (!iframeRef.current) return;
      observer.disconnect();
      iframeRef.current.contentWindow.removeEventListener('scroll', onScrollHandle);
      iframeDocument.body.removeEventListener("dragover", onDragOverHandle);
      iframeDocument.body.removeEventListener("drop", onDropHandle);
      iframeDocument.body.removeEventListener("dragleave", onDragLeaveHandle);
      iframeDocument.body.removeEventListener("dblclick", onDblClickHandle);
      iframeDocument.body.removeEventListener('click', onClickHandle);
      iframeDocument.body.removeEventListener("keydown", handleKeyPress);
      iframeDocument.removeEventListener('contextmenu', event => { });
    }

  }, [state.page, state.pageUpdated]);


  useEffect(() => {

    if (!container)
      return;

    ContentEditor.init(container.document);

    return () => {
      ContentEditor.destroy(null);
    }
  }, [container]);


  const memoizedSelection = useMemo(() => {



    if (!state)
      return;

    return <Selection
      state={state}
      onAddElement={onAdd}
      onCopyElement={onCopy}
      onDeleteElement={onDelete}
      onUpdate={onUpdate}
    />

  }, [state.node, state.selector]);



  const handleContextMenuMouseLeave = () => {
    setContextMenuVisible(false);
    setGapBprPos(null);
  }

  const handleMenuItemMouseEnter = (uid, isTop) => {

    if (!container?.document)
      return;

    const iframeDocument = container.document;

    const element = iframeDocument.querySelector(`[data-id="${uid}"]`);

    if (!element)
      return;

    const name = element.dataset.name || element.tagName;

    const rect = element.getBoundingClientRect();


    if (isTop)
      setGapBprPos({
        value: name,
        left: rect.left,
        width: rect.width,
        top: rect.top - 5, height: 5,
        background: colorPrimaryBg,
        borderBottom: `2px solid ${colorPrimary}`,
        display: 'initial'
      });
    else
      setGapBprPos({
        value: name,
        border: `2px solid ${colorPrimary}`, display: 'initial',
        left: rect.left - 2, width: rect.width, top: rect.top - 2, height: rect.height
      });
  };

  const handleMenuItemMouseLeave = () => {

  };

  const handleMenuItemDragOver = (e) => {
    e.preventDefault();

  };





  const handleMenuItemDrop = (event, isTop) => {

    event.preventDefault();

    if (!container?.document)
      return;

    const iframeDocument = container.document;

    var currentElement = event.target;

    if (currentElement === iframeDocument.body) {
      return;
    }

    const id = currentElement.dataset.uid || currentElement.parentNode.dataset.uid;

    const pos = currentElement.dataset.pos || currentElement.parentNode.dataset.pos;

    const tag = JSON.parse(event.dataTransfer.getData('text/plain'));

    if (tag.move)
      onMove(id, tag._uid, isTop, pos, tag.dragPos, iframeDocument);
    else
      onAdd(tag, id, isTop, pos, iframeDocument);

    currentElement.style.backgroundColor = 'transparent';


  };


  return <ShadowRootComponent>
    <div ref={overlayRef} style={{ width: '100%', height: '0', top: '0px', left: '0px', position: 'absolute' }}>
      <div ref={overlayRef2} style={{ width: '100%', height: '0', top: '0px', left: '0px', position: 'absolute' }}>
        {memoizedSelection}

        {gapBarPos && <div style={{
          display: 'none', ...gapBarPos, position: 'absolute', pointerEvents: 'none', display: 'flex',
          justifyContent: 'center',
          zIndex: 1000,
          alignItems: 'end'
        }}>

          <Button type="dashed" icon=<PlusOutlined style={{ color: "white", padding: 5, background: colorPrimaryBg }} />>
            {gapBarPos.value}</Button>
        </div>}
        {contextMenuVisible && (

          <Card
            ref={tooltipRef}
            style={{
              zIndex: 1000, maxWidth: 150, position: 'absolute',
              visibility: contextMenuPosition.visible ? 'visible' : 'hidden',
              top: contextMenuPosition.y,
              left: contextMenuPosition.x
            }}
            title={<>Elements {" "}<Button
              size='small'
              style={{ marginLeft: 10 }}
              onDragLeave={handleContextMenuMouseLeave}
              onClick={handleContextMenuMouseLeave}
              icon=<CloseOutlined size="1rem" />></Button></>}
            bordered={false}
            onMouseLeave={handleContextMenuMouseLeave}

          >

            <ul style={{
              listStyle: 'none', paddingInlineStart: 0
            }}>




              {contextMenuElements.map((item, index) => (<>
                <li

                  key={item.uid + index}
                  onDragOver={handleMenuItemDragOver}

                  onDragEnter={(e) => {
                    e.target.style.backgroundColor = colorPrimaryBg;
                    handleMenuItemMouseEnter(item.uid, true)
                    e.preventDefault();

                  }}
                  onDragLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    handleMenuItemMouseLeave()

                    e.preventDefault();

                  }}
                  style={{
                    borderRadius: '5px',
                    height: 10,
                  }}
                  onDrop={(e) => handleMenuItemDrop(e, true)}
                  data-uid={item.uid}
                  data-pos={item.pos}
                >

                </li>
                <li
                >
                  <div onDrop={handleMenuItemDrop}
                    onDragOver={handleMenuItemDragOver}
                    onDragEnter={(e) => {

                      if (state?.node?._uid !== item.uid)
                        e.target.style.backgroundColor = colorPrimaryBg;
                      handleMenuItemMouseEnter(item.uid, false)

                      e.preventDefault();

                    }}
                    onDragLeave={(e) => {
                      if (state?.node?._uid !== item.uid)
                        e.target.style.backgroundColor = 'transparent';
                      handleMenuItemMouseLeave()

                      e.preventDefault();

                    }}
                    key={item.uid}
                    onClick={() => handleMenuItemClick(item.uid)}
                    onMouseEnter={(e) => {
                      e.preventDefault();

                      if (state?.node?._uid !== item.uid)
                        e.target.style.backgroundColor = colorPrimaryBg;
                      handleMenuItemMouseEnter(item.uid)
                    }
                    }
                    onMouseLeave={(e) => {
                      e.preventDefault();

                      if (state?.node?._uid !== item.uid)
                        e.target.style.backgroundColor = 'transparent';
                      handleMenuItemMouseLeave(item.uid)
                    }

                    }

                    data-uid={item.uid}
                    data-pos={item.pos}
                    style={{
                      display: "inline-block",
                      cursor: 'pointer',
                      color: state?.node?._uid === item.uid ? '#000' : '#fff',
                      borderRadius: '10px',
                      padding: '0 5px',
                      marginRight: 5,
                      backgroundColor: state?.node?._uid === item.uid ? colorPrimaryBg : 'transparent',
                    }}>
                    {item.name}
                  </div>
                  <Button

                    onMouseEnter={(e) => {
                      e.preventDefault();
                      handleMenuItemMouseEnter(item.uid)
                    }
                    }
                    onMouseLeave={(e) => {
                      e.preventDefault();
                      handleMenuItemMouseLeave()
                    }

                    }

                    onClick={() => onDelete({ dataset: { id: item.uid, pos: item.pos } })}

                    style={{ float: 'right' }} size="small" icon=<DeleteOutlined size="1rem" /> />
                </li></>
              ))}

            </ul>

          </Card>
        )}

      </div>


    </div>


    <iframe frameBorder={0} id="ac-editor-iframe-doc"
      width="100%"
      height="95%" ref={iframeRef}>
      {container && ReactDOM.createPortal(<InnerComponent onLoad={onLoad} document={container.document}>
        {children}
      </InnerComponent>, container.mountTarget)}
    </iframe>



  </ShadowRootComponent>
}









