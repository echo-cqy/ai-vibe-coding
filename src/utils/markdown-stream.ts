/**
 * Utility to handle streaming Markdown content.
 * Fixes incomplete syntax (like unclosed code blocks) to prevent layout breakage during streaming.
 */

export function repairIncompleteMarkdown(text: string): string {
    if (!text) return text;
  
    // 1. Fix unclosed code blocks (```)
    // Count occurrences of triple backticks
    const codeBlockMatch = text.match(/```/g);
    const codeBlockCount = codeBlockMatch ? codeBlockMatch.length : 0;
  
    // If odd number of code blocks, we are inside a code block that needs closing
    if (codeBlockCount % 2 !== 0) {
      // Check if the last line is just "```" or "```language", in which case we might not need a newline
      // But generally appending "\n```" is safe for rendering
      return text + '\n```';
    }
  
    // 2. Fix unclosed inline code (`)
    // This is trickier because ` is used frequently. 
    // A simple heuristic: if there's an odd number of backticks (excluding those in code blocks), close it.
    // However, this regex splitting is complex. For stability, we focus mainly on code blocks as they break layout.
  
    // 3. Fix unclosed bold (**) and italic (*)
    // We can use a stack-based approach or regex counting, but complex nested markdown is hard to perfect.
    // Basic bold repair:
    const boldMatch = text.match(/\*\*/g);
    if (boldMatch && boldMatch.length % 2 !== 0) {
        return text + '**';
    }

    return text;
  }
  
  /**
   * Optimized memoization key generator for large markdown content.
   * Instead of using the full content as a key (which is slow to hash/compare),
   * we can use the content length + last 100 chars + message ID/Status.
   */
  export function getMarkdownMemoKey(content: string, status: string, id: string): string {
      const len = content.length;
      const suffix = content.slice(-50);
      return `${id}-${status}-${len}-${suffix}`;
  }
