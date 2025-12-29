'use client';

import React from 'react';
import { ChevronRight, ChevronDown, FileCode, Folder, FolderOpen } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import { FileNode } from '../types';
import clsx from 'clsx';

interface FileTreeNodeProps {
  node: FileNode;
  depth?: number;
}

const FileTreeNode = ({ node, depth = 0 }: FileTreeNodeProps) => {
  const { toggleFolder, selectFile, activeFileId, expandedFolders } = useEditorStore();
  const isFolder = node.type === 'folder';
  const isActive = activeFileId === node.id;
  const isExpanded = expandedFolders.includes(node.id);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFolder) {
      toggleFolder(node.id);
    } else {
      selectFile(node.id);
    }
  };

  return (
    <div>
      <div
        className={clsx(
          "flex items-center gap-1.5 py-1 px-2 cursor-pointer select-none text-sm transition-colors",
          isActive ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100 text-gray-700",
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={handleClick}
      >
        <span className="text-gray-400 shrink-0">
          {isFolder ? (
            isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
          ) : (
             <span className="w-3.5" /> 
          )}
        </span>
        
        <span className="text-blue-500 shrink-0">
           {isFolder ? (
               isExpanded ? <FolderOpen size={16} /> : <Folder size={16} />
           ) : (
               <FileCode size={16} />
           )}
        </span>

        <span className="truncate">{node.name}</span>
      </div>

      {isFolder && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileExplorer = () => {
  const files = useEditorStore((state) => state.files);

  return (
    <div className="h-full overflow-y-auto py-2 bg-gray-50 border-r border-gray-200">
      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        资源管理器
      </div>
      {files.map((node) => (
        <FileTreeNode key={node.id} node={node} />
      ))}
    </div>
  );
};
