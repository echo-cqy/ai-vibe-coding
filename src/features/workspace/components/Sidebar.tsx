'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Sparkles, 
  Plus, 
  LayoutGrid, 
  MessageSquare, 
  MoreHorizontal, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  LogOut,
  User as UserIcon,
  CreditCard
} from 'lucide-react';
import { useChatStore } from '@/features/chat/store/chatStore';

interface Session {
  id: string;
  title: string;
  updatedAt: string;
}

// Mock Data
const MOCK_SESSIONS: Session[] = [
  { id: 'ecommerce', title: 'E-commerce Dashboard', updatedAt: '2 mins ago' },
  { id: 'landing-page', title: 'SaaS Landing Page', updatedAt: '1 hour ago' },
  { id: 'portfolio', title: 'Developer Portfolio', updatedAt: 'Yesterday' },
  { id: 'blog-cms', title: 'Blog CMS System', updatedAt: '2 days ago' },
  { id: 'task-manager', title: 'Task Manager App', updatedAt: '3 days ago' },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const resetSession = useChatStore((state) => state.resetSession);

  const handleNewChat = () => {
    resetSession();
    router.push('/workspace/new');
  };

  return (
    <div 
      className={`${
        isCollapsed ? 'w-16' : 'w-[260px]'
      } h-full bg-gray-50 border-r border-gray-200 flex flex-col transition-all duration-300 relative group flex-shrink-0`}
    >
      {/* 1. Logo & App Entry */}
      <div className="h-14 flex items-center px-4 border-b border-gray-100 shrink-0">
        <Link href="/" className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm">
            <Sparkles size={18} />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-gray-900 whitespace-nowrap">AI Vibe</span>
          )}
        </Link>
      </div>

      {/* 2. New Chat Button */}
      <div className="p-3 shrink-0">
        <button
          onClick={handleNewChat}
          className={`flex items-center gap-2 w-full bg-white border border-gray-200 hover:border-blue-300 hover:text-blue-600 text-gray-700 px-3 py-2.5 rounded-lg shadow-sm transition-all ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <Plus size={18} className="shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">New Chat</span>}
        </button>
      </div>

      {/* 3. App Navigation */}
      <nav className="px-3 pb-4 shrink-0">
        <ul className="space-y-1">
          <li>
            <Link 
              href="/apps" 
              className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-200/50 rounded-lg transition-colors group/item"
            >
              <LayoutGrid size={18} className="shrink-0 group-hover/item:text-blue-600" />
              {!isCollapsed && <span className="text-sm">App World</span>}
            </Link>
          </li>
        </ul>
      </nav>

      {/* 4. Session List (Scrollable) */}
      <div className="flex-1 overflow-y-auto min-h-0 px-3 pb-2">
        {!isCollapsed && (
          <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Recent Chats
          </div>
        )}
        <ul className="space-y-1">
          {MOCK_SESSIONS.map((session) => {
            const isActive = pathname === `/workspace/${session.id}`;
            return (
              <li key={session.id}>
                <Link
                  href={`/workspace/${session.id}`}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title={session.title}
                >
                  <MessageSquare size={16} className={`shrink-0 ${isActive ? 'fill-blue-200' : ''}`} />
                  {!isCollapsed && (
                    <span className="truncate flex-1">{session.title}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 5. User Info Card (Bottom Fixed) */}
      <div className="p-3 border-t border-gray-200 shrink-0">
        <div className={`rounded-xl bg-white border border-gray-200 p-3 shadow-sm ${isCollapsed ? 'items-center flex flex-col gap-2' : ''}`}>
          
          {/* User Profile */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              U
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-900 truncate">User Name</div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  Free Plan
                </div>
              </div>
            )}
          </div>

          {/* Credits / Progress */}
          {!isCollapsed && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Credits</span>
                <span>5 / 10</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-blue-500 rounded-full"></div>
              </div>
              <button className="w-full mt-2 text-xs flex items-center justify-center gap-1 text-blue-600 hover:bg-blue-50 py-1.5 rounded-md transition-colors font-medium border border-transparent hover:border-blue-100">
                <CreditCard size={12} />
                Upgrade Plan
              </button>
            </div>
          )}
          
          {isCollapsed && (
             <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
          )}
        </div>
      </div>

      {/* Collapse Toggle (Hover Visible) */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm text-gray-400 hover:text-blue-600 hover:border-blue-300 transition-all opacity-0 group-hover:opacity-100 z-50"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </div>
  );
}
