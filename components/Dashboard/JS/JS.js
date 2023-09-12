import React, { useEffect } from "react";
import { useState } from "react";
import { Button, Card, message } from "antd";
import { CodeEditor } from "./CodeEditor";
import SyntaxHighlighter from "./SyntaxHighlighter";
import { dark } from "react-syntax-highlighter/dist/cjs/styles/hljs"
import ThemeServices from "@/lib/services/theme";
import { Controlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/mode/javascript/javascript';



export default function JS() {

    const [jsCode, setJsCode] = useState({ code: '', status: false });
    const [isLoading, setIsLoading] = useState(false);
    //const [textRef, setTextRef] = useState(null);
    const [isChange, setIsChange] = useState(false);



    const load = async () => {
        try {

            setIsLoading(true);
            const res = await ThemeServices.getJsIndex();

            let status = true;
            let code = res.code;

            if (!res.code) {
                code = 'Please Write the Code Here...'
                status = false;
            }
            setJsCode({ code, status });
            //textRef.value = res.code;

        } catch (e) {
            message.error(e?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {

        load();
    }, []);

    const onSave = async (e) => {
        try {

            setIsLoading(true);
            const code = jsCode.status ? jsCode.code : '';
            await ThemeServices.saveJsIndex({ code });
            setIsChange(false);

        } catch (e) {
            message.error(e?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card title={`JS Code Editor:`}
            extra={<Button type="primary" loading={isLoading} disabled={!isChange} onClick={onSave}>Save</Button>}
            headStyle={{ padding: 10 }}>


            <CodeMirror
                style={{ height: 'auto' }}
                value={jsCode.code}
                options={{
                    mode: 'javascript',
                    theme: 'material',
                    lineNumbers: true,
                }} onBeforeChange={(editor, data, value) => {
                    setJsCode({ code: value, status: true });
                    setIsChange(true);

                }}
                onChange={(editor, data, value) => {

                }}
            />


            {/*    <div className="wrapper" style={{ position: 'relative' }}>

                <CodeEditor
                    placeHolder="Type your code here..."
                    onChange={(e) => {

                        const value = e.target.value;

                        if (value == '') {
                            setJsCode({ code: 'Please Write the Code Here...', status: false });
                        }
                        else
                            setJsCode({ code: value, status: true });

                            setIsChange(true);

                    }}
                    setTextRef={setTextRef}
                />
                <SyntaxHighlighter language={"javascript"} theme={dark} className="syntax-highlighter">
                    {jsCode.code}
                </SyntaxHighlighter>
            </div> */}
        </Card>
    );
};
