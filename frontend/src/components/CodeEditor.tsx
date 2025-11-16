import Editor from '@monaco-editor/react';
import { useEffect, useRef } from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  highlightedLine?: number;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  highlightedLine,
  readOnly = false
}) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  useEffect(() => {
    if (editorRef.current && highlightedLine !== undefined) {
      // Highlight the current line of execution
      editorRef.current.deltaDecorations(
        [],
        [
          {
            range: {
              startLineNumber: highlightedLine,
              startColumn: 1,
              endLineNumber: highlightedLine,
              endColumn: 1,
            },
            options: {
              isWholeLine: true,
              className: 'highlighted-line',
              glyphMarginClassName: 'highlighted-line-glyph',
            },
          },
        ]
      );

      // Scroll to the highlighted line
      editorRef.current.revealLineInCenter(highlightedLine);
    }
  }, [highlightedLine]);

  return (
    <Editor
      height="100%"
      defaultLanguage="python"
      value={code}
      onChange={(value) => onChange(value || '')}
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        readOnly,
        glyphMargin: true,
      }}
      theme="vs-dark"
    />
  );
};
