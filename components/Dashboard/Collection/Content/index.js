import React, { useEffect, useRef, useState } from "react";

import { Button, Modal, theme, Space } from "antd";

import ContentEditor from "./ContentEditor";

//import { CodeEditor } from "@/components/dashboard/JS/CodeEditor";

import SyntaxHighlighter from "@/components/Dashboard/JS/SyntaxHighlighter";
import { dark } from "react-syntax-highlighter/dist/cjs/styles/hljs"
import { EditOutlined } from "@ant-design/icons";

export default function RichTextEditor({ content, onSave, isOnlyHTML = 0 }) {


    const {
        token: { colorPrimary },
    } = theme.useToken();


    const contentRef = useRef();

    const [html, setHtml] = useState('');
    const [type, setType] = useState(isOnlyHTML);

    useEffect(() => {

        if (!contentRef.current)
            return;

        ContentEditor.destroy(null);
        if (type == 0) {
            contentRef.current.innerHTML = html;
            ContentEditor.start(contentRef.current, document.querySelector('body'));
        }

    }, [type]);



    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };



    const handleOk = () => {

        if (type == 1) {
            onSave(html);
        }
        else {
            onSave(contentRef.current.innerHTML);
        }
        setIsModalOpen(false);

        ContentEditor.destroy(null);

    };
    const handleCancel = () => {
        ContentEditor.destroy(null);

        setIsModalOpen(false);
    };

    const handleAfterOpenChange = (visible) => {
        if (visible && contentRef.current) {

            
            ContentEditor.destroy(null);
            if (type == 0) {
                contentRef.current.innerHTML = content;
                ContentEditor.start(contentRef.current, document.querySelector('body'));
            } else
                setHtml(content)
        } else {
            ContentEditor.destroy(null);
        }
    };



    return (
        <>
            <Button onClick={showModal}>
                <EditOutlined style={{ color: colorPrimary }} />
            </Button>
            <Modal width="60%" afterOpenChange={handleAfterOpenChange}
             title="Edit Content"
             okText="Save"
              visible={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}>

                <Space wrap>
                    {isOnlyHTML == 0 && <Button disabled={type == 0}
                        style={type == 0 ? { borderColor: colorPrimary, color: colorPrimary } : {}}
                        onClick={(e) => {
                            e.preventDefault();
                            setType(0)
                        }}
                    > Visual </Button>} <></>
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

                <div style={{ padding: 10, overflow: 'auto', maxHeight: '50vh' }}>

                    {(type == 0 && isOnlyHTML == 0) && <div ref={contentRef} index={0}>
                    </div>}
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
