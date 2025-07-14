/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from 'react';

interface DailyUsage {
  date: string;
  interpretationsCount: number;
  lastReset: string;
}

interface UseDailyUsageReturn {
  interpretationsToday: number;
  canPlayToday: boolean;
  remainingPlays: number;
  dailyLimit: number;
  incrementUsage: () => void;
  resetIfNewDay: () => void;
}

export function useDailyUsage(userId?: string, isPremium: boolean = false): UseDailyUsageReturn {
  const [dailyUsage, setDailyUsage] = useState<DailyUsage>({
    date: new Date().toDateString(),
    interpretationsCount: 0,
    lastReset: new Date().toISOString()
  });

  const dailyLimit = isPremium ? Infinity : 1; // Premium users have unlimited plays

  useEffect(() => {
    if (userId) {
      loadDailyUsage();
    }
  }, [userId]);

  const getStorageKey = () => `tarot_daily_usage_${userId}`;

  const loadDailyUsage = () => {
    if (!userId) return;

    try {
      const stored = localStorage.getItem(getStorageKey());
      if (stored) {
        const parsed: DailyUsage = JSON.parse(stored);
        const today = new Date().toDateString();
        
        // Reset if it's a new day
        if (parsed.date !== today) {
          const newUsage = {
            date: today,
            interpretationsCount: 0,
            lastReset: new Date().toISOString()
          };
          setDailyUsage(newUsage);
          localStorage.setItem(getStorageKey(), JSON.stringify(newUsage));
        } else {
          setDailyUsage(parsed);
        }
      } else {
        // Initialize for new user
        const newUsage = {
          date: new Date().toDateString(),
          interpretationsCount: 0,
          lastReset: new Date().toISOString()
        };
        setDailyUsage(newUsage);
        localStorage.setItem(getStorageKey(), JSON.stringify(newUsage));
      }
    } catch (error) {
      console.warn('Failed to load daily usage:', error);
    }
  };

  const resetIfNewDay = () => {
    const today = new Date().toDateString();
    if (dailyUsage.date !== today) {
      const newUsage = {
        date: today,
        interpretationsCount: 0,
        lastReset: new Date().toISOString()
      };
      setDailyUsage(newUsage);
      if (userId) {
        localStorage.setItem(getStorageKey(), JSON.stringify(newUsage));
      }
    }
  };

  const incrementUsage = () => {
    if (!userId) return;

    resetIfNewDay();

    const newUsage = {
      ...dailyUsage,
      interpretationsCount: dailyUsage.interpretationsCount + 1
    };
    
    setDailyUsage(newUsage);
    localStorage.setItem(getStorageKey(), JSON.stringify(newUsage));
  };

  const interpretationsToday = dailyUsage.interpretationsCount;
  const canPlayToday = isPremium || interpretationsToday < dailyLimit;
  const remainingPlays = isPremium ? Infinity : Math.max(0, dailyLimit - interpretationsToday);

  return {
    interpretationsToday,
    canPlayToday,
    remainingPlays,
    dailyLimit,
    incrementUsage,
    resetIfNewDay
  };
}