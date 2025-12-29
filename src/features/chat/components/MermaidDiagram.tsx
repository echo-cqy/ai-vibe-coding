'use client';

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  code: string;
}

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
});

export const MermaidDiagram = ({ code }: MermaidDiagramProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const renderDiagram = async () => {
      if (!code) return;
      
      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, code);
        
        if (isMounted) {
          setSvg(svg);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Mermaid render error:', err);
          // Don't show error to user immediately if it's just incomplete syntax during streaming
          // Only show if it persists (could add debounce here)
          setError('Rendering diagram...'); 
        }
      }
    };

    renderDiagram();

    return () => {
      isMounted = false;
    };
  }, [code]);

  if (error) {
    return (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-500 font-mono">
            {error}
            <pre className="mt-2 opacity-50 whitespace-pre-wrap">{code}</pre>
        </div>
    );
  }

  return (
    <div 
      ref={ref}
      className="mermaid-diagram my-4 overflow-x-auto bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex justify-center"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};
