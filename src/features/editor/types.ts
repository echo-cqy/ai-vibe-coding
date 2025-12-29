export type FileType = 'file' | 'folder';

export interface FileNode {
  id: string;
  name: string;
  type: FileType;
  content?: string; // Only for files
  language?: string; // 'typescript', 'css', 'html', etc.
  children?: FileNode[]; // Only for folders
  parentId?: string;
}

export interface EditorState {
  files: FileNode[];
  activeFileId: string | null;
  expandedFolders: string[];
  isPreviewMode: boolean; // Toggle between Code and Preview

  // Actions
  setFiles: (files: FileNode[]) => void;
  selectFile: (fileId: string) => void;
  toggleFolder: (folderId: string) => void;
  updateFileContent: (fileId: string, content: string) => void;
  setPreviewMode: (isPreview: boolean) => void;
}
