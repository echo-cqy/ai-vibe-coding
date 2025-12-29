'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Settings as SettingsIcon, Github } from 'lucide-react';
import clsx from 'clsx';

export const Header = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Workspace', href: '/workspace' },
    { label: 'Settings', href: '/settings' },
  ];

  return (
    <header className="h-14 border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <Sparkles size={18} />
          </div>
          <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            AI Vibe Coding
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "text-sm font-medium transition-colors hover:text-blue-600",
                pathname === item.href ? "text-blue-600" : "text-gray-600"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-all"
          >
            <Github size={20} />
          </a>
          <Link
             href="/settings"
             className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-all"
          >
             <SettingsIcon size={20} />
          </Link>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 ml-2 cursor-pointer ring-2 ring-white shadow-sm" />
        </div>
      </div>
    </header>
  );
};
