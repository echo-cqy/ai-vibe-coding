'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Home, Settings } from 'lucide-react';

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      {/* Workspace TopBar (Restored) */}
      <header className="h-12 border-b border-gray-200 flex items-center justify-between px-4 bg-white shrink-0 z-10">
        <div className="flex items-center gap-4">
           <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
              <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-white">
                <Sparkles size={14} />
              </div>
              <span className="font-semibold text-sm">AI Vibe Coding</span>
           </Link>
           <div className="h-4 w-px bg-gray-200" />
           <span className="text-xs text-gray-500">Workspace</span>
        </div>

        <div className="flex items-center gap-2">
           <Link href="/" title="Back to Home" className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
              <Home size={18} />
           </Link>
           <Link href="/settings" title="Settings" className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
              <Settings size={18} />
           </Link>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 overflow-hidden relative flex flex-col min-w-0">
        {children}
      </main>
    </div>
  );
}
