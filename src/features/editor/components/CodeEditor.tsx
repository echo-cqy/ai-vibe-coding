'use client';

import React from 'react';
import Editor from '@monaco-editor/react';
import { useEditorStore, selectActiveFile } from '../store/editorStore';

export const CodeEditor = () => {
  const activeFile = useEditorStore(selectActiveFile);
  const updateFileContent = useEditorStore((state) => state.updateFileContent);
  
  const handleEditorChange = (value: string | undefined) => {
    if (activeFile && value !== undefined) {
      updateFileContent(activeFile.id, value);
    }
  };

  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-white">
        <p>选择文件以进行编辑</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-white flex flex-col">
        {/* Simple Tab Header */}
        <div className="flex items-center px-4 h-9 border-b bg-white shrink-0">
            <span className="text-sm text-gray-600 flex items-center gap-2">
                {activeFile.name}
            </span>
        </div>
        
        {/* Editor Area */}
        <div className="flex-1 overflow-hidden">
            <Editor
                height="100%"
                defaultLanguage={activeFile.language || 'javascript'}
                language={activeFile.language || 'javascript'}
                path={activeFile.id} // This helps Monaco manage models/states
                value={activeFile.content}
                onChange={handleEditorChange}
                theme="light"
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    readOnly: false,
                    automaticLayout: true,
                    padding: { top: 10 }
                }}
            />
        </div>
    </div>
  );
};
