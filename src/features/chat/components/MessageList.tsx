'use client';

import React, { useRef, useCallback, useEffect } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Message } from '../types';
import { MessageItem } from './MessageItem';
import { useAutoScroll, ListRef } from '../hooks/useAutoScroll';
import { ArrowDown } from 'lucide-react';
import { VariableSizeList as List } from 'react-window';

interface MessageListProps {
  messages: Message[];
  isStreaming: boolean;
}

interface RowComponentProps {
    index: number;
    style: React.CSSProperties;
    data: Message[];
}

const Row = ({ index, style, data }: RowComponentProps) => {
    return (
        <MessageItem
            index={index}
            style={style}
            message={data[index]}
        />
    );
};

export const MessageList = ({ messages, isStreaming }: MessageListProps) => {
  const listRef = useRef<ListRef>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const sizeMap = useRef<{ [index: number]: number }>({});

  const setSize = useCallback((index: number, size: number) => {
    sizeMap.current = { ...sizeMap.current, [index]: size };
    listRef.current?.resetAfterIndex(index);
  }, []);

  const getSize = (index: number) => sizeMap.current[index] || 100;

  const { handleScroll, snapToBottom, isAtBottom } = useAutoScroll({ 
      messagesLength: messages.length, 
      isStreaming,
      listRef,
      outerRef
  });

  return (
    <div className="flex-1 relative h-full w-full">
      <AutoSizer className="w-full h-full">
        {({ height, width }: { height: number; width: number }) => (
          <List
              ref={listRef}
              outerRef={outerRef}
              height={height}
              width={width}
              itemCount={messages.length}
              itemSize={getSize}
              onScroll={handleScroll}
              itemData={messages}
              overscanCount={5}
          >
              {({ index, style, data }) => (
                  <MessageItem
                      index={index}
                      style={style}
                      message={data[index]}
                      setSize={setSize}
                  />
              )}
          </List>
        )}
      </AutoSizer>
      
      {!isAtBottom && (
          <button 
            onClick={snapToBottom}
            className="absolute bottom-4 right-4 bg-white border shadow-lg rounded-full p-2 text-blue-600 hover:bg-gray-50 transition-all z-10"
            aria-label="Scroll to bottom"
          >
            <ArrowDown size={20} />
          </button>
      )}
    </div>
  );
};
