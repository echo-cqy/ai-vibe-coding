'use client';

import React, { useState, useEffect } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export const VoiceRecorder = ({ onTranscript, disabled }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock recording effect
  useEffect(() => {
    // In a real implementation, we would start/stop the MediaRecorder here
    return () => {
      // Cleanup
    };
  }, [isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      setIsProcessing(true);
      
      // Mock processing delay and result
      setTimeout(() => {
        const mockTranscripts = [
            "帮我写一个 React 计数器组件",
            "解释一下什么是 React Hooks",
            "如何优化 Next.js 的首屏加载性能？",
            "用 Tailwind CSS 写一个响应式导航栏"
        ];
        const randomTranscript = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
        
        onTranscript(randomTranscript);
        setIsProcessing(false);
      }, 1000);
    } else {
      // Start recording
      setIsRecording(true);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleRecording}
      disabled={disabled || isProcessing}
      className={`
        p-2 rounded-lg transition-all flex items-center justify-center
        ${isRecording 
          ? 'bg-red-100 text-red-600 animate-pulse' 
          : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      title={isRecording ? "停止录音" : "开始语音输入"}
    >
      {isProcessing ? (
        <Loader2 size={18} className="animate-spin text-blue-500" />
      ) : isRecording ? (
        <Square size={18} fill="currentColor" />
      ) : (
        <Mic size={18} />
      )}
    </button>
  );
};
