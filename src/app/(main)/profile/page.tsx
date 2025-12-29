import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import UserProfile from '@/features/profile/components/UserProfile';
import { SlowStats } from '@/features/profile/components/SlowStats';
import { Header } from '@/components/layout/Header';
import { fetchUserProfile } from '@/features/profile/data';
import { Suspense } from 'react';

export default async function ProfilePage() {
  const queryClient = new QueryClient();

  // 1. Prefetch data on the server (SSR)
  await queryClient.prefetchQuery({
    queryKey: ['user-profile'],
    queryFn: fetchUserProfile,
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        
        {/* 2. Dehydrate state and pass to client component */}
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="max-w-4xl mx-auto w-full p-6">
                <UserProfile />
                
                {/* 3. Streaming SSR Demo */}
                <Suspense fallback={
                    <div className="h-48 bg-gray-200 animate-pulse rounded-xl mt-6 flex items-center justify-center text-gray-400">
                        Loading Advanced Analytics...
                    </div>
                }>
                    <SlowStats />
                </Suspense>
            </div>
        </HydrationBoundary>
    </div>
  );
}
