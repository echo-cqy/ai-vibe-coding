import React, { useEffect, useRef, useMemo } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '../types';
import clsx from 'clsx';
import { repairIncompleteMarkdown } from '@/utils/markdown-stream';
import { MermaidDiagram } from './MermaidDiagram';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MessageItemProps {
  message: Message;
  style: React.CSSProperties;
  index: number;
  setSize?: (index: number, size: number) => void;
}

export const MessageItem = React.memo(({ message, style, index, setSize }: MessageItemProps) => {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rowRef.current && setSize) {
      setSize(index, rowRef.current.getBoundingClientRect().height);
    }
  }, [message.content, message.status, setSize, index]);

  // Custom components for ReactMarkdown
  const components: Components = useMemo(() => ({
    code({ node, inline, className, children, ...props }: { node?: unknown; inline?: boolean; className?: string; children?: React.ReactNode } & React.HTMLAttributes<HTMLElement>) {
        const match = /language-(\w+)/.exec(className || '');
        const language = match ? match[1] : '';
        const codeContent = String(children).replace(/\n$/, '');

        // 1. Mermaid Diagram Support
        if (!inline && language === 'mermaid') {
            return <MermaidDiagram code={codeContent} />;
        }

        // 2. Syntax Highlighting
        if (!inline && match) {
            return (
                <SyntaxHighlighter
                    style={vscDarkPlus as any}
                    language={language}
                    PreTag="div"
                    {...props}
                >
                    {codeContent}
                </SyntaxHighlighter>
            );
        }

        return (
            <code className={className} {...props}>
                {children}
            </code>
        );
    },
    // 3. Image Optimization
    img({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
                src={src} 
                alt={alt} 
                className="max-w-full h-auto rounded-lg shadow-sm my-2 border border-gray-200"
                loading="lazy"
                {...props} 
            />
        );
    }
  }), []);

  // Optimization 1: Memoize markdown rendering
  // Optimization 2: Repair incomplete markdown during streaming (e.g. unclosed code blocks)
  const renderedContent = useMemo(() => {
    const safeContent = message.status === 'streaming' 
        ? repairIncompleteMarkdown(message.content) 
        : message.content;

    return (
        <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={components}
        >
            {safeContent}
        </ReactMarkdown>
    );
  }, [message.content, message.status, components]);

  // We remove height/width to let the content determine the size
  // React-window will position it absolutely using 'top'
  const { height, width, ...restStyle } = style;

  return (
    <div 
        ref={rowRef} 
        className="px-4 py-2" 
        style={{
            ...restStyle,
            width: '100%', // Ensure full width
        }}
    >
      <div className={clsx(
        "flex flex-col w-full max-w-[85%] rounded-2xl p-4 shadow-sm",
        message.role === 'user' 
            ? "ml-auto bg-blue-600 text-white rounded-br-none" 
            : "bg-gray-100 text-gray-900 rounded-bl-none border border-gray-200"
      )}>
        <div className="text-xs font-bold mb-1 opacity-75 uppercase tracking-wider">
            {message.role === 'assistant' ? 'AI 助手' : '你'}
        </div>
        
        {/* Optimization 3: content-visibility for large renders (CSS-in-JS or Class) */}
        {/* We add 'contain-content' to help browser optimize layout recalculations */}
        {/* REMOVED content-visibility: auto to fix flickering and overlap in virtual list */}
        <div className={clsx(
            "prose prose-sm max-w-none break-words",
            message.role === 'user' ? "prose-invert" : ""
        )}>
            {renderedContent}
        </div>
        
        {message.status === 'streaming' && (
            <div className="mt-2 flex gap-1">
                <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}/>
                <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}/>
                <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}/>
            </div>
        )}
      </div>
    </div>
  );
});

MessageItem.displayName = 'MessageItem';
