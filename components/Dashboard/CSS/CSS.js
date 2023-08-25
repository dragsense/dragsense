import React, { useEffect } from "react";
import { useState } from "react";
import { Button, Card, message } from "antd";
import { CodeEditor } from "./CodeEditor";
import SyntaxHighlighter from "./SyntaxHighlighter";
import { dark } from "react-syntax-highlighter/dist/cjs/styles/hljs"
import ThemeServices from "@/lib/services/theme";


export default function CSS() {

    const [cssCode, setCssCode] = useState({ code: '', status: false });
    const [isLoading, setIsLoading] = useState(false);
    const [textRef, setTextRef] = useState(null);
    const [isChange, setIsChange] = useState(false);


    const load = async () => {
        try {

            setIsLoading(true);
            const res = await ThemeServices.getCssIndex();

            let status = true;
            let code = res.code;

            if (!res.code) {
                code = 'Please Write the Code Here...'
                status = false;
            }
            setCssCode({ code, status });
            textRef.value = res.code; 

        } catch (e) {
            message.error(e?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {

        if (!textRef)
            return;

            load();
     

    }, [textRef]);

    const onSave = async (e) => {
        try {

            setIsLoading(true);
            const code = cssCode.status ? cssCode.code : '';
            await ThemeServices.saveCssIndex({ code });
            setIsChange(false);

        } catch (e) {
            message.error(e?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card  title={`CSS Code Editor:`}
            extra={<Button type="primary" loading={isLoading} disabled={!isChange} onClick={onSave}>Save</Button>}
            headStyle={{ padding: 10 }}>

            <div className="wrapper" style={{ position: 'relative' }}>

                <CodeEditor
                    placeHolder="Type your code here..."
                    onChange={(e) => {

                        const value = e.target.value;

                        if (value == '') {
                            setCssCode({ code: 'Please Write the Code Here...', status: false });
                        }
                        else
                            setCssCode({ code: value, status: true });

                            setIsChange(true)
                    }}
                    setTextRef={setTextRef}
                />
                <SyntaxHighlighter language={"css"} theme={dark} className="syntax-highlighter">
                    {cssCode.code}
                </SyntaxHighlighter>
            </div>
        </Card>
    );
};
