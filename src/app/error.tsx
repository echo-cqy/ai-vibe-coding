'use client';

import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global Error Boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-red-100 max-w-md w-full">
        <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong!</h2>
        <p className="text-gray-500 mb-6 text-sm">
          {error.message || 'An unexpected error occurred while rendering this page.'}
        </p>

        <div className="flex gap-3 justify-center">
            <button
                onClick={() => reset()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
                Try again
            </button>
            <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
                Reload Page
            </button>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
             <div className="mt-6 text-left bg-gray-900 text-gray-300 p-3 rounded text-xs overflow-auto max-h-32">
                 <code>{error.stack}</code>
             </div>
        )}
      </div>
    </div>
  );
}
