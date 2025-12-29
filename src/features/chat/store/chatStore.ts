import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ChatState, Message } from '../types';
import { indexedDBStorage } from '@/utils/storage';

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      sessionId: '',
      messages: [],
      isStreaming: false,
      connectionStatus: 'connected',

      initSession: () => set((state) => {
         if (state.sessionId) return {};
         return { sessionId: typeof crypto !== 'undefined' ? crypto.randomUUID() : Date.now().toString() };
      }),

      addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
      })),

      appendToken: (token) => set((state) => {
        const messages = [...state.messages];
        const lastMsg = messages[messages.length - 1];
        if (lastMsg && lastMsg.role === 'assistant') {
            messages[messages.length - 1] = {
                ...lastMsg,
                content: lastMsg.content + token,
                status: 'streaming'
            };
        }
        return { messages, connectionStatus: 'connected' };
      }),

      finishMessage: (status = 'done') => set((state) => {
         const messages = [...state.messages];
         const lastMsg = messages[messages.length - 1];
         if (lastMsg) {
             messages[messages.length - 1] = { ...lastMsg, status };
         }
         return { messages, isStreaming: false, connectionStatus: status === 'error' ? 'disconnected' : 'connected' };
      }),

      resetSession: () => set({ 
          sessionId: typeof crypto !== 'undefined' ? crypto.randomUUID() : Date.now().toString(), 
          messages: [], 
          isStreaming: false,
          connectionStatus: 'connected'
      }),
      
      setStreaming: (isStreaming) => set({ isStreaming, connectionStatus: isStreaming ? 'connecting' : 'connected' }),
      setConnectionStatus: (connectionStatus) => set({ connectionStatus }),

      generateMockData: (count) => set((state) => {
        const newMessages: Message[] = [];
        for (let i = 0; i < count; i++) {
            const isUser = i % 2 === 0;
            newMessages.push({
                id: `mock-${Date.now()}-${i}`,
                role: isUser ? 'user' : 'assistant',
                content: isUser 
                    ? `Performance Test Message #${i}: How efficient is the virtual list?`
                    : `Response #${i}: This is a simulated message to test rendering performance. \n\n\`\`\`js\nconst x = ${i};\n\`\`\`\n`,
                status: 'done'
            });
        }
        return { messages: [...state.messages, ...newMessages] };
      }),
    }),
    {
      name: 'ai-vibe-chat-storage',
      // Switch to IndexedDB for large storage support
      storage: createJSONStorage(() => indexedDBStorage),
      partialize: (state) => ({ sessionId: state.sessionId, messages: state.messages }),
    }
  )
);
