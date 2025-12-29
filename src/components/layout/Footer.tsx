import React from 'react';
import Link from 'next/link';
import { Sparkles, Github, Twitter, Linkedin, Disc } from 'lucide-react';
import { TimeDisplay } from '../common/TimeDisplay';

export const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Ecosystem */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-white">
                <Sparkles size={14} />
              </div>
              <span className="font-bold text-gray-900">AI Vibe</span>
            </Link>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  Build your ideas with Agents
                </Link>
              </li>
              <li>
                <Link href="/open-manus" className="hover:text-blue-600 transition-colors">
                  OpenManus
                </Link>
              </li>
              <li>
                <Link href="/foundation-agents" className="hover:text-blue-600 transition-colors">
                  Foundation Agents
                </Link>
              </li>
            </ul>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="/product" className="hover:text-blue-600 transition-colors">Product</Link></li>
              <li><Link href="/pricing" className="hover:text-blue-600 transition-colors">Pricing</Link></li>
              <li><Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link></li>
              <li><Link href="/changelog" className="hover:text-blue-600 transition-colors">Changelog</Link></li>
              <li><Link href="/use-cases" className="hover:text-blue-600 transition-colors">Use Cases</Link></li>
              <li><Link href="/videos" className="hover:text-blue-600 transition-colors">Videos</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="/help" className="hover:text-blue-600 transition-colors">Help Center</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Community</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="/explorer" className="hover:text-blue-600 transition-colors">Explorer Program</Link></li>
              <li><Link href="/partners" className="hover:text-blue-600 transition-colors">Partners</Link></li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors flex items-center gap-2">
                  X / Twitter
                </a>
              </li>
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors flex items-center gap-2">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors flex items-center gap-2">
                  Discord
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} AI Vibe Coding Platform. All rights reserved.
            <span className="mx-2 text-gray-300">|</span>
            <span className="text-xs font-mono text-gray-400">
                Server Time Check: <TimeDisplay />
            </span>
          </p>
          <div className="flex gap-4">
             <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 transition-colors">
               <Github size={20} />
             </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
