'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import { MessageList } from './MessageList';
import { VoiceRecorder } from './VoiceRecorder';
import { Send, StopCircle, Trash2, Database } from 'lucide-react';

export default function ChatBox() {
  const { messages, isStreaming, sendMessage, stop, resetSession, sessionId, generateMockData, connectionStatus } = useChat();
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
    // Reset height
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
    }
  };

  const handleVoiceTranscript = (text: string) => {
      setInput((prev) => (prev ? prev + ' ' + text : text));
      // Trigger resize after state update
      setTimeout(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
            textareaRef.current.focus();
        }
      }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
      // Auto resize
      e.target.style.height = 'auto';
      e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header Actions */}
      <div className="flex justify-between items-center px-4 py-2 border-b bg-gray-50/50">
        <span className="text-xs font-medium text-gray-500 font-mono">
            会话 ID: {sessionId?.slice(0, 8)}
        </span>
        <div className="flex gap-2">
            <button
                onClick={() => generateMockData(1000)}
                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                title="生成 1000 条测试数据"
            >
                <Database size={16} />
            </button>
            <button 
                onClick={resetSession} 
                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title="重置会话"
            >
                <Trash2 size={16} />
            </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden relative">
          {messages.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                  <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                      <Send size={24} className="ml-1" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">欢迎使用 AI Vibe</h3>
                  <p className="max-w-xs">开始对话，生成代码、调试或探索新想法。</p>
              </div>
          ) : (
              <MessageList messages={messages} isStreaming={isStreaming} />
          )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white relative">
        {connectionStatus === 'reconnecting' && (
             <div className="absolute bottom-full left-0 w-full bg-amber-50 text-amber-600 text-xs py-1.5 px-4 border-t border-amber-100 flex items-center justify-center animate-pulse">
                 <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                 <span>网络连接不稳定，正在尝试重连...</span>
             </div>
        )}
        {connectionStatus === 'disconnected' && (
             <div className="absolute bottom-full left-0 w-full bg-red-50 text-red-600 text-xs py-1.5 px-4 border-t border-red-100 flex items-center justify-center">
                 <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                 <span>网络已断开，请检查网络连接</span>
             </div>
        )}
        <form onSubmit={handleSubmit} className="relative flex items-end gap-2 border rounded-xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 transition-all bg-white">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="输入任何编程问题..."
            className="flex-1 max-h-32 min-h-[44px] resize-none border-0 bg-transparent py-2.5 px-2 focus:ring-0 text-sm focus:outline-none"
            rows={1}
          />
          <div className="flex items-center pb-1 gap-1">
             <VoiceRecorder onTranscript={handleVoiceTranscript} disabled={isStreaming} />
             {isStreaming ? (
                 <button
                    type="button"
                    onClick={stop}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                 >
                    <StopCircle size={18} />
                 </button>
             ) : (
                 <button
                    type="submit"
                    disabled={!input.trim()}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    <Send size={18} />
                 </button>
             )}
          </div>
        </form>
        <div className="text-center mt-2">
            <p className="text-xs text-gray-400">AI Vibe 可能会犯错，请核实生成的代码。</p>
        </div>
      </div>
    </div>
  );
}
