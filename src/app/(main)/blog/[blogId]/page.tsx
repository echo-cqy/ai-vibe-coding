import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getBlogPost, getRelatedPosts, BLOG_POSTS } from '@/features/blog/data';
import { ArrowLeft, Calendar, Clock, Tag, Share2, Linkedin, Twitter } from 'lucide-react';
import { Metadata } from 'next';

interface Props {
  params: Promise<{
    blogId: string;
  }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    blogId: post.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { blogId } = await params;
  const post = getBlogPost(blogId);
  if (!post) return { title: 'Blog Not Found' };
  
  return {
    title: `${post.title} | AI Vibe Blog`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      images: post.image ? [post.image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { blogId } = await params;
  const post = getBlogPost(blogId);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post.category, post.id);

  return (
    <article className="min-h-screen bg-white pb-20">
      {/* Header / Hero */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link 
            href="/blog"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-8 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Blog
          </Link>
          
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
              {post.category}
            </span>
            <span className="text-gray-400 text-sm">•</span>
            <span className="flex items-center text-gray-500 text-sm gap-1">
              <Calendar size={14} />
              {post.date}
            </span>
            <span className="text-gray-400 text-sm">•</span>
            <span className="flex items-center text-gray-500 text-sm gap-1">
              <Clock size={14} />
              {post.readTime}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-between border-t border-gray-200 pt-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                {post.author.avatar ? (
                  <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-blue-600 font-bold text-lg">{post.author.name[0]}</span>
                )}
              </div>
              <div>
                <div className="font-bold text-gray-900">{post.author.name}</div>
                <div className="text-sm text-gray-500">{post.author.role}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all">
                <Share2 size={20} />
              </button>
              <button className="p-2 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all">
                <Linkedin size={20} />
              </button>
              <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all">
                <Twitter size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {post.image && (
          <div className="relative w-full h-[400px] mb-12 rounded-2xl shadow-lg overflow-hidden">
            <Image 
                src={post.image} 
                alt={post.title} 
                fill
                className="object-cover"
                priority
            />
          </div>
        )}

        <div 
          className="prose prose-lg max-w-none prose-blue prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-500"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-gray-100">
          {post.tags.map(tag => (
            <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer">
              <Tag size={12} className="mr-1.5" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="bg-gray-50 py-16 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map(related => (
                <Link key={related.id} href={`/blog/${related.id}`} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className="h-40 bg-gray-200 overflow-hidden relative">
                    {related.image && (
                      <Image 
                        src={related.image} 
                        alt={related.title} 
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="text-xs text-blue-600 font-semibold mb-2">{related.category}</div>
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                    <div className="text-xs text-gray-500">{related.date} • {related.readTime}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
