import SyntaxHighlighter from "react-syntax-highlighter";


export default  function _SyntaxHighlighter({ language, theme, children }) {
  return (
    <SyntaxHighlighter
      language={language}
      style={theme}
      className="syntax-highlighter"
    >
      {children}
    </SyntaxHighlighter>
  );
};