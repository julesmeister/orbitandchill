/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { useEventsCompat } from './useEventsCompat';
import { usePremiumFeatures } from './usePremiumFeatures';

export interface EventsLimits {
  // Generation limits
  dailyGenerationLimit: number;
  monthlyGenerationLimit: number;
  dailyGenerationUsed: number;
  monthlyGenerationUsed: number;
  canGenerateEvents: boolean;
  
  // Event storage limits
  maxStoredEvents: number;
  currentStoredEvents: number;
  canAddMoreEvents: boolean;
  
  // Bookmark limits
  maxBookmarks: number;
  currentBookmarks: number;
  canBookmarkMore: boolean;
  
  // Time window access
  canAccessTimeWindows: boolean;
  canAccessElectionalData: boolean;
  canExportEvents: boolean;
  
  // Reset times
  nextResetDaily: Date;
  nextResetMonthly: Date;
  limitMessage?: string;
}

export function useEventsLimits() {
  const { user } = useUserStore();
  const eventsCompat = useEventsCompat();
  const { shouldShowFeature } = usePremiumFeatures();
  
  const [limits, setLimits] = useState<EventsLimits>({
    // Free tier limits
    dailyGenerationLimit: 5,    // 5 event generations per day
    monthlyGenerationLimit: 50, // 50 event generations per month
    dailyGenerationUsed: 0,
    monthlyGenerationUsed: 0,
    canGenerateEvents: true,
    
    maxStoredEvents: 100,       // 100 stored events max
    currentStoredEvents: 0,
    canAddMoreEvents: true,
    
    maxBookmarks: 20,           // 20 bookmarked events max
    currentBookmarks: 0,
    canBookmarkMore: true,
    
    canAccessTimeWindows: false,     // Premium: Time windows
    canAccessElectionalData: false,  // Premium: Electional astrology data
    canExportEvents: false,          // Premium: Export functionality
    
    nextResetDaily: new Date(),
    nextResetMonthly: new Date()
  });
  
  useEffect(() => {
    if (!user) {
      return;
    }
    
    const userIsPremium = user.subscriptionTier === 'premium';
    
    // Set limits based on premium status (DISABLED FOR DEVELOPMENT)
    const dailyGenerationLimit = 999; // userIsPremium ? 999 : 5;
    const monthlyGenerationLimit = 999; // userIsPremium ? 999 : 50;
    const maxStoredEvents = 999; // userIsPremium ? 999 : 100;
    const maxBookmarks = 999; // userIsPremium ? 999 : 20;
    
    // Calculate used generations (from events created today/this month)
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Filter user's generated events
    const allEvents = eventsCompat.getAllEvents();
    const userEvents = allEvents.filter(e => e.userId === user.id);
    const userGeneratedEvents = userEvents.filter(e => e.isGenerated);
    
    const dailyGenerationUsed = userGeneratedEvents.filter(e => {
      const eventDate = new Date(e.createdAt);
      return eventDate >= todayStart;
    }).length;
    
    const monthlyGenerationUsed = userGeneratedEvents.filter(e => {
      const eventDate = new Date(e.createdAt);
      return eventDate >= monthStart;
    }).length;
    
    // Calculate current usage
    const currentStoredEvents = userEvents.length;
    const currentBookmarks = userEvents.filter(e => e.isBookmarked).length;
    
    // Calculate next reset times
    const nextResetDaily = new Date(todayStart);
    nextResetDaily.setDate(nextResetDaily.getDate() + 1);
    
    const nextResetMonthly = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    // Determine what user can do
    const canGenerateEvents = true;
    const canAddMoreEvents = true;
    const canBookmarkMore = true;
    const limitMessage: string | undefined = undefined;
    
    // DEVELOPMENT: All limits disabled
    // if (!userIsPremium) {
    //   // Check generation limits
    //   if (dailyGenerationUsed >= dailyGenerationLimit) {
    //     canGenerateEvents = false;
    //     const hoursUntilReset = Math.ceil((nextResetDaily.getTime() - now.getTime()) / (1000 * 60 * 60));
    //     limitMessage = `Daily generation limit reached (${dailyGenerationLimit}). Resets in ${hoursUntilReset} hours.`;
    //   } else if (monthlyGenerationUsed >= monthlyGenerationLimit) {
    //     canGenerateEvents = false;
    //     const daysUntilReset = Math.ceil((nextResetMonthly.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    //     limitMessage = `Monthly generation limit reached (${monthlyGenerationLimit}). Resets in ${daysUntilReset} days.`;
    //   }
    //   
    //   // Check storage limits
    //   if (currentStoredEvents >= maxStoredEvents) {
    //     canAddMoreEvents = false;
    //     if (!limitMessage) {
    //       limitMessage = `Storage limit reached (${maxStoredEvents} events). Delete some events or upgrade.`;
    //     }
    //   }
    //   
    //   // Check bookmark limits
    //   if (currentBookmarks >= maxBookmarks) {
    //     canBookmarkMore = false;
    //   }
    // }
    
    setLimits({
      dailyGenerationLimit,
      monthlyGenerationLimit,
      dailyGenerationUsed,
      monthlyGenerationUsed,
      canGenerateEvents,
      
      maxStoredEvents,
      currentStoredEvents,
      canAddMoreEvents,
      
      maxBookmarks,
      currentBookmarks,
      canBookmarkMore,
      
      canAccessTimeWindows: userIsPremium || shouldShowFeature('time-windows', userIsPremium),
      canAccessElectionalData: userIsPremium || shouldShowFeature('electional-data', userIsPremium),
      canExportEvents: userIsPremium || shouldShowFeature('export-events', userIsPremium),
      
      nextResetDaily,
      nextResetMonthly,
      limitMessage
    });
  }, [user?.id, shouldShowFeature, eventsCompat]);
  
  return limits;
}

export function formatTimeUntilReset(resetTime: Date): string {
  const now = new Date();
  const diff = resetTime.getTime() - now.getTime();
  
  if (diff <= 0) return 'Now';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
}