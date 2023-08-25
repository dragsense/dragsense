import { useEffect, useRef } from "react";

export const CodeEditor = ({ placeHolder, onChange, setTextRef }) => {

  const ref = useRef(null);

  useEffect(() => {

    if (ref.current) {
      setTextRef(ref.current);
    }
    

  }, []);

  return (

    <textarea
      ref={ref}
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
      placeholder={placeHolder}
      onChange={onChange}
      spellcheck="false"
      className="code-text-editor"
    >

    </textarea>

  );
};