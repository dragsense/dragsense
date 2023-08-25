import React, { useEffect, useRef, useState, forwardRef } from "react";
import ReactDOM from 'react-dom';

import { Button, Modal, theme, Space } from "antd";

import SyntaxHighlighter from "@/components/Dashboard/JS/SyntaxHighlighter";
import { dark } from "react-syntax-highlighter/dist/cjs/styles/hljs"
import { EditOutlined } from "@ant-design/icons";


export default function HTMLEditor({ title, content, onSave }) {

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
                 <EditOutlined style={{ color: colorPrimary }} />
            </Button>
            <Modal width="60%" afterOpenChange={handleAfterOpenChange}
            okText="Save"
             title={`Edit ${title}`} visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>


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