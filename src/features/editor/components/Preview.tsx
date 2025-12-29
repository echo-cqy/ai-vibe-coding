'use client';

import React from 'react';
import { Loader2, RefreshCw } from 'lucide-react';

export const Preview = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [key, setKey] = React.useState(0);

  const handleRefresh = () => {
    setIsLoading(true);
    setKey(k => k + 1);
    setTimeout(() => setIsLoading(false), 800);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Browser Toolbar Mock */}
      <div className="flex items-center gap-2 px-4 h-10 border-b bg-gray-50">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        
        <div className="flex-1 ml-4 flex items-center bg-white border rounded-md px-3 h-7 text-xs text-gray-500">
          http://localhost:3000/
        </div>

        <button 
          onClick={handleRefresh}
          className="p-1 hover:bg-gray-200 rounded-md transition-colors"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Preview Content */}
      <div className="flex-1 relative bg-white overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <Loader2 className="animate-spin text-blue-500" size={32} />
          </div>
        ) : (
          <div key={key} className="h-full w-full p-8 animate-in fade-in duration-500">
             {/* Mock Content that looks like the App.tsx content */}
             <div className="max-w-md mx-auto text-center font-sans p-8 border rounded-xl shadow-sm bg-white">
                <h1 className="text-3xl font-bold text-blue-600 mb-4">Hello from AI Vibe!</h1>
                <p className="text-gray-600 mb-6">Start editing to see some magic happen.</p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                    Click Me
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
