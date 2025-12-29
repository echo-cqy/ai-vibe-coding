'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Save } from 'lucide-react';
import { useState } from 'react';
import { fetchUserProfile, updateUserProfile } from '../data';

// Component
export default function UserProfile() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [localName, setLocalName] = useState('');

  // 1. React Query Hook (Will be hydrated from server if available)
  const { data: user, isLoading, isFetching, error } = useQuery({
    queryKey: ['user-profile'],
    queryFn: fetchUserProfile,
    staleTime: 60 * 1000, // 1 minute stale time
  });

  // 2. Mutation for CSR updates
  const updateMutation = useMutation({
    mutationFn: async (newName: string) => {
        if (!user) throw new Error('User not found');
        return updateUserProfile(user, newName);
    },
    onSuccess: (newData) => {
        // Optimistic update or set query data
        queryClient.setQueryData(['user-profile'], newData);
        setIsEditing(false);
    }
  });

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="animate-spin mb-2" size={32} />
            <p>Loading Profile...</p>
        </div>
    );
  }

  if (error || !user) {
    return <div className="text-red-500 p-4">Error loading profile</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="opacity-90">{user.email}</p>
            </div>
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <span className="font-mono text-sm">{user.role}</span>
            </div>
        </div>

        {/* Content */}
        <div className="p-6">
            {/* CSR / SSR Hydration Indicator */}
            <div className="flex items-center gap-2 mb-6 text-xs text-gray-400 bg-gray-50 p-2 rounded border border-gray-100">
                <span className={`w-2 h-2 rounded-full ${isFetching ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`} />
                {isFetching ? 'Fetching / Revalidating...' : 'Data Hydrated & Fresh'}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {Object.entries(user.stats).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-gray-800">{value}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">{key}</div>
                    </div>
                ))}
            </div>

            {/* Interactive Section */}
            <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Profile Settings</h3>
                
                {isEditing ? (
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            defaultValue={user.name}
                            onChange={(e) => setLocalName(e.target.value)}
                            className="flex-1 border rounded px-3 py-2"
                        />
                        <button 
                            onClick={() => updateMutation.mutate(localName || user.name)}
                            disabled={updateMutation.isPending}
                            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50"
                        >
                            {updateMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                            Save
                        </button>
                        <button 
                            onClick={() => setIsEditing(false)}
                            className="text-gray-500 px-4 py-2"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="text-gray-600">Display Name: </span>
                            <span className="font-medium text-gray-900">{user.name}</span>
                        </div>
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            Edit
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
