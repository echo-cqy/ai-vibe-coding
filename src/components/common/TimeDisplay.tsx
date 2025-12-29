'use client';

import React, { useEffect, useState } from 'react';

/**
 * TimeDisplay Component
 * 
 * Demonstrates the "Safe Hydration" pattern.
 * Directly rendering `new Date().toLocaleTimeString()` in SSR would cause a mismatch error
 * because the server time differs from the client time.
 * 
 * Solution:
 * 1. Initialize state with null or a consistent server value.
 * 2. Use useEffect to update the state with the client-specific value after mounting.
 */
export const TimeDisplay = () => {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    // Only executed on the client
    setTime(new Date().toLocaleTimeString());
    
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // During SSR and first client render, this returns the fallback (null or skeleton)
  // avoiding the hydration mismatch error.
  if (!time) {
    return <span className="text-gray-300 animate-pulse">--:--:--</span>;
  }

  return <span suppressHydrationWarning>{time}</span>;
};
