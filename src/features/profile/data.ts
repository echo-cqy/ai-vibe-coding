import { cache } from 'react';

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: string;
    stats: {
      projects: number;
      messages: number;
      generationTokens: string;
    };
    preferences: {
      theme: 'light' | 'dark';
      notifications: boolean;
    };
  }
  
  export const MOCK_USER_PROFILE: UserProfile = {
    id: 'user_123',
    name: 'Demo User',
    email: 'demo@example.com',
    role: 'Pro Developer',
    stats: {
      projects: 12,
      messages: 1450,
      generationTokens: '1.2M'
    },
    preferences: {
      theme: 'light',
      notifications: true
    }
  };
  
  // React Cache for Request Memoization (Server-Side Optimization)
  export const fetchUserProfile = cache(async (): Promise<UserProfile> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('[Server] Fetching user profile...'); // Verify deduplication
    return MOCK_USER_PROFILE;
  });
  
  export const updateUserProfile = async (user: UserProfile, newName: string): Promise<UserProfile> => {
      await new Promise(resolve => setTimeout(resolve, 800)); // Mock API
      return { ...user, name: newName };
  };
