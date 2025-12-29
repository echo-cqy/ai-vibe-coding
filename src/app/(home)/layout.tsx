'use client';

import React from 'react';
import Sidebar from '@/features/workspace/components/Sidebar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar for Home/Dashboard */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50/50">
          {children}
          <Footer />
        </main>
      </div>
    </div>
  );
}
