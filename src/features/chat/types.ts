export type Role = 'user' | 'assistant';
export type MessageStatus = 'streaming' | 'done' | 'error';
export type ConnectionStatus = 'connected' | 'connecting' | 'reconnecting' | 'disconnected';

export interface Message {
  id: string;
  role: Role;
  content: string;
  status?: MessageStatus;
}

export interface ChatState {
  sessionId: string;
  messages: Message[];
  isStreaming: boolean;
  connectionStatus: ConnectionStatus;
  
  initSession: () => void;
  addMessage: (message: Message) => void;
  appendToken: (token: string) => void;
  finishMessage: (status?: MessageStatus) => void;
  resetSession: () => void;
  setStreaming: (isStreaming: boolean) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  generateMockData: (count: number) => void;
}

