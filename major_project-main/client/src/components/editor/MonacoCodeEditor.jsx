import React, { useRef, useLayoutEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Send, Code, Settings2, RotateCcw } from 'lucide-react';

export const MonacoCodeEditor = ({
  code,
  onChange,
  language = 'javascript',
  onLanguageChange,
  onRunCode,
  onSubmitCode,
  isRunning = false,
  isSubmitting = false,
  readOnly = false,
  isDark = false,
}) => {
  const editorRef = useRef(null);
  const applyingExternalRef = useRef(false);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    if (code !== undefined && code !== editor.getValue()) {
      applyingExternalRef.current = true;
      editor.setValue(code);
      applyingExternalRef.current = false;
    }
  };

  // Sync external `code` changes (remote peers, question switch, reset) into the editor
  // without clobbering in-flight local typing or moving the cursor to the document end.
  useLayoutEffect(() => {
    const editor = editorRef.current;
    if (!editor || code === undefined) return;
    const model = editor.getModel();
    if (!model || code === model.getValue()) return;

    const position = editor.getPosition();
    applyingExternalRef.current = true;
    if (readOnly) {
      model.setValue(code);
    } else {
      editor.executeEdits('external-sync', [
        { range: model.getFullModelRange(), text: code, forceMoveMarkers: true },
      ]);
      editor.pushUndoStop();
    }
    applyingExternalRef.current = false;
    if (position) editor.setPosition(model.validatePosition(position));
  }, [code, readOnly]);

  const handleChange = (value) => {
    if (applyingExternalRef.current) return;
    onChange(value);
  };

  const handleReset = () => {
    const defaultTemplates = {
      javascript: `function solve(input) {\n  // Write your code solution here...\n  return "15";\n}`,
      python: `def solve(input_data):\n    # Write your code solution here...\n    return "15"`,
      cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "15" << endl;\n    return 0;\n}`,
      java: `class Solution {\n    public static void main(String[] args) {\n        System.out.println("15");\n    }\n}`,
    };
    onChange(defaultTemplates[language] || defaultTemplates.javascript);
  };

  return (
    <div className={`flex flex-col h-full border rounded-xl overflow-hidden shadow-2xl ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
      {/* Editor Header Toolbar */}
      <div className={`flex items-center justify-between px-4 py-2 border-b ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>

          <div className={`h-4 w-px ${isDark ? 'bg-slate-800' : 'bg-slate-300'}`}></div>

          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <Code className="w-3.5 h-3.5 text-indigo-400" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className={`${isDark ? 'bg-slate-950 border-slate-800 text-indigo-300' : 'bg-white border-slate-200 text-slate-700'} text-xs font-mono rounded-md px-2.5 py-1 focus:outline-none focus:border-indigo-500`}
            >
              <option value="javascript">JavaScript (Node.js)</option>
              <option value="python">Python 3.10</option>
              <option value="cpp">C++ 20 (GCC)</option>
              <option value="java">Java 17 (OpenJDK)</option>
            </select>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            title="Reset code template"
            className={`p-1.5 rounded-lg border transition-colors ${isDark ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'}`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onRunCode}
            disabled={isRunning || isSubmitting}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-xs font-semibold text-emerald-400 transition-all disabled:opacity-50 ${isDark ? 'bg-slate-800 hover:bg-slate-700 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 border-slate-200'}`}
          >
            <Play className="w-3.5 h-3.5 fill-emerald-400" />
            {isRunning ? 'Running Docker...' : 'Run Code'}
          </button>

          <button
            onClick={onSubmitCode}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            {isSubmitting ? 'Evaluating...' : 'Submit Solution'}
          </button>
        </div>
      </div>

      {/* Monaco Core Instance */}
      <div className="flex-1 min-h-[350px] relative">
        <Editor
          height="100%"
          language={language === 'cpp' ? 'cpp' : language}
          theme={isDark ? 'vs-dark' : 'vs-light'}
          defaultValue={code}
          onChange={handleChange}
          onMount={handleEditorDidMount}
          options={{
            readOnly,
            fontSize: 14,
            fontFamily: '"Fira Code", monospace',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            padding: { top: 12, bottom: 12 },
            cursorBlinking: 'smooth',
            smoothScrolling: true,
            renderLineHighlight: 'all',
          }}
        />
      </div>
    </div>
  );
};
