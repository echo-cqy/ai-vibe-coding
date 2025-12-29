import React from 'react';
import { fetchUserProfile } from '../data';

/**
 * SlowStats Component
 * 
 * Simulates a slow server-side data fetching operation.
 * Used to demonstrate Streaming SSR with Suspense.
 */
export async function SlowStats() {
  // Simulate network delay (3 seconds)
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Re-fetch data (in a real app, Request Memoization would prevent duplicate fetch if used elsewhere)
  const user = await fetchUserProfile();

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Analytics (Slow Load)</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-600 font-medium">Code Efficiency</div>
          <div className="text-2xl font-bold text-blue-900">98.5%</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="text-sm text-purple-600 font-medium">AI Token Usage</div>
          <div className="text-2xl font-bold text-purple-900">{user.stats.generationTokens}</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="text-sm text-green-600 font-medium">Bug Free Rate</div>
          <div className="text-2xl font-bold text-green-900">99.9%</div>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-4">
        * This component was streamed independently from the main profile data.
      </p>
    </div>
  );
}
