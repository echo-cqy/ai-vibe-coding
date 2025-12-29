'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, LayoutTemplate, ShoppingCart, ListTodo } from 'lucide-react';

import { WORKSPACE_CASES } from '@/features/workspace/data';

export default function LandingPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!prompt.trim()) return;
    router.push(`/workspace/new?prompt=${encodeURIComponent(prompt)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const examples = [
    {
      id: "ecommerce",
      icon: <ShoppingCart className="text-blue-500" />,
      title: WORKSPACE_CASES["ecommerce"].title,
      prompt: WORKSPACE_CASES["ecommerce"].description
    },
    {
      id: "landing-page",
      icon: <LayoutTemplate className="text-purple-500" />,
      title: WORKSPACE_CASES["landing-page"].title,
      prompt: WORKSPACE_CASES["landing-page"].description
    },
    {
      id: "portfolio",
      icon: <ListTodo className="text-green-500" />,
      title: WORKSPACE_CASES["portfolio"].title,
      prompt: WORKSPACE_CASES["portfolio"].description
    }
  ];

  return (
    <div className="flex flex-col items-center min-h-screen justify-center px-4">
      <div className="w-full max-w-3xl space-y-8 text-center -mt-20">
        
        {/* Header */}
        <div className="space-y-4">
           <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
            What do you want to <span className="text-blue-600">build</span>?
           </h1>
           <p className="text-xl text-gray-500">
             Prompt, generate, edit, and deploy full-stack web apps.
           </p>
        </div>

        {/* Input Area */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-white rounded-xl shadow-xl ring-1 ring-gray-900/5">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your app idea..."
              className="w-full min-h-[120px] p-6 text-lg bg-transparent border-0 focus:ring-0 resize-none placeholder:text-gray-400"
              autoFocus
            />
            <div className="flex items-center justify-between px-4 pb-4">
               <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Sparkles size={14} />
                  <span>AI Powered</span>
               </div>
               <button
                  onClick={() => handleSubmit()}
                  disabled={!prompt.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
               >
                  Generate <ArrowRight size={16} />
               </button>
            </div>
          </div>
        </div>

        {/* Examples */}
        <div className="pt-8">
           <p className="text-sm font-medium text-gray-500 mb-4">Or start with an example:</p>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              {examples.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => router.push(`/workspace/${ex.id}`)}
                  className="p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group bg-white w-full"
                >
                   <div className="mb-3 p-2 bg-gray-50 rounded-lg w-fit group-hover:bg-white transition-colors">
                      {ex.icon}
                   </div>
                   <h3 className="font-semibold text-gray-900 text-sm mb-1">{ex.title}</h3>
                   <p className="text-xs text-gray-500 line-clamp-2 text-left">{ex.prompt}</p>
                </button>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
