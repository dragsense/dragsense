import React, { useEffect, useRef, useState, forwardRef } from "react";
import ReactDOM from 'react-dom';

import { Button, Modal, theme, Space } from "antd";

import ContentEditor from "./ContentEditor";

//import { CodeEditor } from "@/components/dashboard/JS/CodeEditor";

import SyntaxHighlighter from "@/components/Dashboard/JS/SyntaxHighlighter";
import { dark } from "react-syntax-highlighter/dist/cjs/styles/hljs"
import { EditOutlined } from "@ant-design/icons";


const IFrame = forwardRef(({ html, headCode, footerCode }, ref) => {

    const iframeRef = useRef();
    const overlayRef = useRef();

    const [mountTarget, setMountTarget] = useState(null);

    useEffect(() => {

        if (!iframeRef.current)
            return;
        try {
            const iframe = iframeRef.current;
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            ContentEditor.init(iframeDocument);
            setMountTarget({body: iframeDocument.body, head: iframeDocument.head});
        } catch (e) {
        }

        return () => {
            ContentEditor.destroy(null);
        }


    }, [iframeRef.current])

    useEffect(() => {

        if (!ref.current)
            return;

        try {

            const head = mountTarget.head;
            head.innerHTML = headCode;
            let footer = document.querySelector('footer');
            if (!footer)
                footer = document.createElement('footer');

            footer.innerHTML = footerCode;
            mountTarget.body.appendChild(footer);

            ContentEditor.destroy(null);
            ref.current.innerHTML = html;
            ContentEditor.start(ref.current, overlayRef.current);
        } catch (e) {
        }

        return () => {
            ContentEditor.destroy(null);
        }


    }, [ref.current, html]);


    return <>
        <div ref={overlayRef} style={{ position: 'relative', top: "-82.5vh" }}></div>

        <iframe frameBorder={0} id="ac-editor-iframe-doc"
            width="100%"
            height="95%" ref={iframeRef}>
            {mountTarget && ReactDOM.createPortal(

                <div ref={ref}></div>, mountTarget.body)}
        </iframe>


    </>
})


export default function RichTextEditor({ title, content, onSave, head, footer }) {


    const {
        token: { colorPrimary },
    } = theme.useToken();


    const contentRef = useRef();

    const [html, setHtml] = useState('');
    const [type, setType] = useState(0);



    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };



    const handleOk = () => {

        if(type == 1)
        onSave(html);
        else
        onSave(contentRef.current.innerHTML)
        setIsModalOpen(false);

    };
    const handleCancel = () => {

        setIsModalOpen(false);
    };

    const handleAfterOpenChange = (visible) => {
        if (visible)
            setHtml(content)

    };



    return (
        <>
            <Button onClick={showModal}>
                {title} <EditOutlined style={{ color: colorPrimary }} />
            </Button>
            <Modal width="60%" 
            centered={true}
            afterOpenChange={handleAfterOpenChange}
             title="Edit Content" 
             okText="Save"
             visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>

                <Space wrap>
                    <Button disabled={type == 0}
                        style={type == 0 ? { borderColor: colorPrimary, color: colorPrimary } : {}}
                        onClick={(e) => {
                            e.preventDefault();
                            setHtml(html)
                            setType(0)
                        }}
                    > Visual </Button> <></>
                    <Button disabled={type == 1}
                        style={type == 1 ? { borderColor: colorPrimary, color: colorPrimary } : {}}

                        onClick={(e) => {
                            e.preventDefault();

                            if (contentRef.current)
                                setHtml(contentRef.current.innerHTML)

                            setType(1);
                        }}
                    > html </Button>
                </Space>

                <br />
                <br />

                <div style={{ padding: 10, height: '80vh' }}>

                    {type == 0 &&
                       
                            <IFrame ref={contentRef} html={html} headCode={head} footerCode={footer}>

                            </IFrame>}
                    {type == 1 && <div style={{ position: 'relative' }} index={1}>
                        <textarea
                            style={{
                                caretColor: 'white',
                                margin: '0px',
                                border: '0px',
                                background: 'none',
                                boxSizing: 'inherit',
                                display: 'inherit',
                                fontSize: '1em',
                                fontFamily: `'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace`,
                                fontStyle: 'inherit',
                                fontVariantLigatures: 'inherit',
                                fontWeight: 'inherit',
                                letterSpacing: 'inherit',
                                lineHeight: 'inherit',
                                tabSize: 'inherit',
                                textIndent: 'inherit',
                                textRendering: 'inherit',
                                textTransform: 'inherit',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'keep-all',
                                overflowWrap: 'break-word',
                                position: 'absolute',
                                top: '0px',
                                left: '0px',
                                width: '100%',
                                height: '100%',
                                resize: 'none',
                                color: 'inherit',
                                overflow: 'hidden',
                                '-webkit-font-smoothing': 'antialiased',
                                '-webkit-text-fill-color': 'transparent',
                                padding: '0.5rem',
                            }}
                            placeholder="Type your code here..."
                            value={html}
                            spellcheck="false"
                            className="code-text-editor"
                            onChange={(e) => {
                                e.preventDefault();
                                setHtml(e.target.value);
                            }}
                        >

                        </textarea>

                        <SyntaxHighlighter language={"html"} theme={dark} className="syntax-highlighter">
                            {html}
                        </SyntaxHighlighter>

                    </div>}


                </div>
            </Modal>
        </>
    );
};


export function HTMLEditor({ title, content, onSave }) {

    const {
        token: { colorPrimary },
    } = theme.useToken();

    const [html, setHtml] = useState('');


    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };


    const handleOk = () => {

        onSave(html);

        setIsModalOpen(false);


    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleAfterOpenChange = (visible) => {
        if (visible) {
            setHtml(content)
        }
    };



    return (
        <>
            <Button onClick={showModal}>
                {title} <EditOutlined style={{ color: colorPrimary }} />
            </Button>
            <Modal width="60%" afterOpenChange={handleAfterOpenChange} title={`Edit ${title}`} visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>


                <div style={{ padding: 10, overflow: 'auto', maxHeight: '50vh' }}>
                    <div style={{ position: 'relative' }} index={1}>
                        <textarea
                            style={{
                                caretColor: 'white',
                                margin: '0px',
                                border: '0px',
                                background: 'none',
                                boxSizing: 'inherit',
                                display: 'inherit',
                                fontSize: '1em',
                                fontFamily: `'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace`,
                                fontStyle: 'inherit',
                                fontVariantLigatures: 'inherit',
                                fontWeight: 'inherit',
                                letterSpacing: 'inherit',
                                lineHeight: 'inherit',
                                tabSize: 'inherit',
                                textIndent: 'inherit',
                                textRendering: 'inherit',
                                textTransform: 'inherit',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'keep-all',
                                overflowWrap: 'break-word',
                                position: 'absolute',
                                top: '0px',
                                left: '0px',
                                width: '100%',
                                height: '100%',
                                resize: 'none',
                                color: 'inherit',
                                overflow: 'hidden',
                                '-webkit-font-smoothing': 'antialiased',
                                '-webkit-text-fill-color': 'transparent',
                                padding: '0.5rem',
                            }}
                            placeholder="Type your code here..."
                            value={html}
                            spellcheck="false"
                            className="code-text-editor"
                            onChange={(e) => {
                                e.preventDefault();
                                setHtml(e.target.value);
                            }}
                        >

                        </textarea>

                        <SyntaxHighlighter language={"html"} theme={dark} className="syntax-highlighter">
                            {html}
                        </SyntaxHighlighter>
                    </div>
                </div>


            </Modal>
        </>
    );
};