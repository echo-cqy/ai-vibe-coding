import { create } from 'zustand';
import { EditorState, FileNode } from '../types';

// Initial Mock Data
const MOCK_FILES: FileNode[] = [
  {
    id: 'root',
    name: 'project',
    type: 'folder',
    children: [
      {
        id: 'src',
        name: 'src',
        type: 'folder',
        parentId: 'root',
        children: [
          {
            id: 'app.tsx',
            name: 'App.tsx',
            type: 'file',
            parentId: 'src',
            language: 'typescript',
            content: `import React from 'react';
import './App.css';

export default function App() {
  return (
    <div className="container">
      <h1>Hello from AI Vibe!</h1>
      <p>Start editing to see some magic happen.</p>
    </div>
  );
}`
          },
          {
            id: 'utils.ts',
            name: 'utils.ts',
            type: 'file',
            parentId: 'src',
            language: 'typescript',
            content: `export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US').format(date);
};`
          },
          {
            id: 'app.css',
            name: 'App.css',
            type: 'file',
            parentId: 'src',
            language: 'css',
            content: `.container {
  padding: 2rem;
  text-align: center;
  font-family: sans-serif;
}

h1 {
  color: #3b82f6;
}`
          }
        ]
      },
      {
        id: 'package.json',
        name: 'package.json',
        type: 'file',
        parentId: 'root',
        language: 'json',
        content: `{
  "name": "demo-project",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}`
      }
    ]
  }
];

// Helper to find file by ID recursively
const findFileById = (files: FileNode[], id: string): FileNode | null => {
  for (const file of files) {
    if (file.id === id) return file;
    if (file.children) {
      const found = findFileById(file.children, id);
      if (found) return found;
    }
  }
  return null;
};

// Helper to update file content recursively
const updateContent = (files: FileNode[], id: string, content: string): FileNode[] => {
  return files.map(file => {
    if (file.id === id) {
      return { ...file, content };
    }
    if (file.children) {
      return { ...file, children: updateContent(file.children, id, content) };
    }
    return file;
  });
};

export const useEditorStore = create<EditorState>((set) => ({
  files: MOCK_FILES,
  activeFileId: 'app.tsx',
  expandedFolders: ['root', 'src'],
  isPreviewMode: false,

  setFiles: (files) => set({ files }),
  
  selectFile: (fileId) => set({ activeFileId: fileId }),
  
  toggleFolder: (folderId) => set((state) => {
    const isExpanded = state.expandedFolders.includes(folderId);
    return {
      expandedFolders: isExpanded 
        ? state.expandedFolders.filter(id => id !== folderId)
        : [...state.expandedFolders, folderId]
    };
  }),

  updateFileContent: (fileId, content) => set((state) => ({
    files: updateContent(state.files, fileId, content)
  })),

  setPreviewMode: (isPreviewMode) => set({ isPreviewMode }),
}));

// Selectors
export const selectActiveFile = (state: EditorState) => {
    if (!state.activeFileId) return null;
    return findFileById(state.files, state.activeFileId);
};
