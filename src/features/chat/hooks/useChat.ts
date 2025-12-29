import { useCallback, useEffect } from 'react';
import { useChatStore } from '../store/chatStore';
import { useSSE } from './useSSE';
import { Message } from '../types';
import { cropMessages, mockStreamCompletion } from '@/services/llm';

export function useChat() {
  const messages = useChatStore((state) => state.messages);
  const isStreaming = useChatStore((state) => state.isStreaming);
  const sessionId = useChatStore((state) => state.sessionId);
  
  // Actions are stable in Zustand
  const initSession = useChatStore((state) => state.initSession);
  const resetSession = useChatStore((state) => state.resetSession);
  const addMessage = useChatStore((state) => state.addMessage);
  const setStreaming = useChatStore((state) => state.setStreaming);
  const appendToken = useChatStore((state) => state.appendToken);
  const finishMessage = useChatStore((state) => state.finishMessage);
  const generateMockData = useChatStore((state) => state.generateMockData);

  const setConnectionStatus = useChatStore((state) => state.setConnectionStatus);
  const { stream, stop } = useSSE();

  useEffect(() => {
    // Client-side hydration check
    if (typeof window !== 'undefined') {
        useChatStore.persist.rehydrate();
    }
    initSession();

    // Network Status Monitoring
    const handleOnline = () => {
        if (useChatStore.getState().connectionStatus === 'disconnected') {
            setConnectionStatus('connected');
        }
    };
    const handleOffline = () => {
        setConnectionStatus('disconnected');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
  }, [initSession, setConnectionStatus]);

  const sendMessage = useCallback(async (content: string) => {
    // Access latest state directly to avoid dependency on changing 'messages'
    const state = useChatStore.getState();
    if (!content.trim() || state.isStreaming) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      status: 'done'
    };

    addMessage(userMsg);
    setStreaming(true);

    const assistantMsg: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      status: 'streaming'
    };
    addMessage(assistantMsg);

    // Prepare payload with cropped history
    // Get all previous messages + current user message
    const allMessages = [...state.messages, userMsg];
    
    // Crop context
    const croppedMessages = cropMessages(allMessages.map(m => ({ 
        role: m.role, 
        content: m.content 
    })));

    // Use local mock server if available, otherwise default relative path
    // We use the Next.js API route we just created
    const API_URL = '/api/chat';

    // Batching logic
    let tokenBuffer = '';
    let lastFlushTime = Date.now();
    const FLUSH_INTERVAL = 50; // ms

    await stream(
      API_URL,
      { messages: croppedMessages, sessionId: state.sessionId },
      (token) => {
        tokenBuffer += token;
        const now = Date.now();
        
        if (now - lastFlushTime >= FLUSH_INTERVAL) {
            appendToken(tokenBuffer);
            tokenBuffer = '';
            lastFlushTime = now;
        }
      },
      () => {
        // Flush remaining tokens
        if (tokenBuffer) {
            appendToken(tokenBuffer);
        }
        finishMessage('done');
      },
      (error) => {
        console.error("Stream error, falling back to internal mock:", error);
        
        // Fallback logic: Execute internal mock generator
        (async () => {
             try {
                // We reuse the cropping logic for the mock
                for await (const chunk of mockStreamCompletion(allMessages)) {
                    // Simulate slight network delay for realism if needed, 
                    // but mockStreamCompletion already has some delays.
                    appendToken(chunk);
                }
                finishMessage('done');
             } catch (mockError) {
                 console.error("Mock fallback failed:", mockError);
                 finishMessage('error');
             }
        })();
      },
      (attempt) => {
          setConnectionStatus('reconnecting');
      }
    );
  }, [addMessage, setStreaming, appendToken, finishMessage, stream, setConnectionStatus]);

  const handleStop = useCallback(() => {
    stop();
    finishMessage('done');
  }, [stop, finishMessage]);

  return {
    messages,
    isStreaming,
    connectionStatus: useChatStore((state) => state.connectionStatus),
    sessionId,
    sendMessage,
    stop: handleStop,
    resetSession,
    generateMockData
  };
}
