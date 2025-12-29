'use client';

import React from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Code, Eye, Laptop } from 'lucide-react';
import clsx from 'clsx';
import { FileExplorer } from './FileExplorer';
import { CodeEditor } from './CodeEditor';
import { Preview } from './Preview';
import { useEditorStore } from '../store/editorStore';

export const EditorPane = () => {
  const { isPreviewMode, setPreviewMode } = useEditorStore();

  return (
    <div className="h-full w-full bg-white border-l border-gray-200 flex flex-col">
      {/* Top Bar / Tabs */}
      <div className="h-10 border-b flex items-center px-4 justify-between bg-white shrink-0">
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setPreviewMode(false)}
            className={clsx(
              "flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-md transition-all",
              !isPreviewMode 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            <Code size={16} />
            <span>Code</span>
          </button>
          <button
            onClick={() => setPreviewMode(true)}
            className={clsx(
              "flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-md transition-all",
              isPreviewMode 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            <Eye size={16} />
            <span>Preview</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400">
           <Laptop size={14} />
           <span>Web Container</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {isPreviewMode ? (
           <Preview />
        ) : (
          <PanelGroup direction="horizontal">
            <Panel defaultSize={20} minSize={15} maxSize={40} className="flex flex-col">
                <FileExplorer />
            </Panel>
            
            <PanelResizeHandle className="w-1 bg-gray-200 hover:bg-blue-400 transition-colors cursor-col-resize" />
            
            <Panel className="flex flex-col">
                <CodeEditor />
            </Panel>
          </PanelGroup>
        )}
      </div>
    </div>
  );
};
