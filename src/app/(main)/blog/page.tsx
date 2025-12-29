import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Image from 'next/image';
import { User, BookOpen, Calendar, Clock, ArrowRight } from 'lucide-react';
import { BLOG_CATEGORIES, BLOG_POSTS, BlogCategory } from '@/features/blog/data';
import Link from 'next/link';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function BlogPage() {
  const posts = BLOG_POSTS;
  const renderTime = new Date().toLocaleTimeString();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      <main className="flex-1 max-w-4xl mx-auto w-full p-6">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Engineering Blog</h1>
            <div className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full border border-yellow-200">
                ISR Active: Cache updates every 60s
            </div>
        </div>

        <p className="text-sm text-gray-500 mb-6">
            Page Generated At (Server Time): <span className="font-mono font-bold text-gray-700">{renderTime}</span>
            <br/>
            <span className="text-xs">Refresh the page. This time will stay static for 60 seconds.</span>
        </p>

        <div className="grid gap-6">
            {posts.map(post => (
            <Link href={`/blog/${post.id}`} key={post.id} className="block group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    {post.image && (
                        <div className="relative w-full md:w-48 h-48 md:h-auto shrink-0 bg-gray-200">
                            <Image 
                                src={post.image} 
                                alt={post.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 768px) 100vw, 200px"
                            />
                        </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-2">
                             <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                {post.category}
                             </span>
                             <span className="text-xs text-gray-400">• {post.readTime}</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{post.title}</h2>
                        <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{post.summary}</p>
                        
                        <div className="mt-auto flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                                {post.author.name.charAt(0)}
                            </div>
                            <span className="text-xs text-gray-500">{post.author.name}</span>
                            <span className="ml-auto text-xs text-gray-400">{post.date}</span>
                        </div>
                    </div>
                </div>
            </Link>
            ))}
        </div>
      </main>

    </div>
  );
}
