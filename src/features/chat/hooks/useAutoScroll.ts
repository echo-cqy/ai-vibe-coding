import { RefObject, useEffect, useState, useCallback } from 'react';
import { VariableSizeList } from 'react-window';

export type ListRef = VariableSizeList;

interface UseAutoScrollProps {
    messagesLength: number;
    isStreaming: boolean;
    listRef: RefObject<ListRef | null>;
    outerRef?: RefObject<HTMLDivElement | null>;
}

export function useAutoScroll({ messagesLength, isStreaming, listRef, outerRef }: UseAutoScrollProps) {
    const [isAtBottom, setIsAtBottom] = useState(true);

    const scrollToBottom = useCallback(() => {
        if (listRef.current && messagesLength > 0) {
            listRef.current.scrollToItem(messagesLength - 1, 'end');
        }
    }, [messagesLength, listRef]);

    // Auto-scroll on new messages if we were at bottom or if streaming just started
    useEffect(() => {
        if (isStreaming || isAtBottom) {
            // Small timeout to ensure DOM is updated (especially for dynamic heights)
            const timeout = setTimeout(scrollToBottom, 50);
            return () => clearTimeout(timeout);
        }
    }, [messagesLength, isStreaming, isAtBottom, scrollToBottom]);

    const handleScroll = useCallback(({ scrollOffset }: { scrollOffset: number }) => {
        if (!outerRef?.current) return;
        
        const { scrollHeight, clientHeight } = outerRef.current;
        // Check if we are close to the bottom (within 50px)
        const isBottom = Math.abs(scrollHeight - clientHeight - scrollOffset) < 50;
        
        // Only update if value changes to avoid unnecessary re-renders
        if (isBottom !== isAtBottom) {
            setIsAtBottom(isBottom);
        }
    }, [isAtBottom, outerRef]);

    const snapToBottom = useCallback(() => {
        setIsAtBottom(true);
        scrollToBottom();
    }, [scrollToBottom]);

    return { handleScroll, snapToBottom, isAtBottom };
}
