/**
 * Cache Invalidation Utilities
 * 
 * Utilities to handle cache invalidation for natal charts,
 * especially important after timezone handling fixes.
 */

import { db } from '@/store/database';
import { toast } from 'sonner';

/**
 * Clear all natal chart caches for a specific user
 */
export async function clearAllNatalChartCaches(userId: string): Promise<void> {
  try {
    // Get all cache keys that start with "natal_chart_"
    const allCacheEntries = await db.cache.toArray();
    const natalChartCacheKeys = allCacheEntries
      .filter(entry => entry.key.startsWith(`natal_chart_${userId}_`))
      .map(entry => entry.key);

    // Delete all natal chart caches for this user
    for (const key of natalChartCacheKeys) {
      await db.cache.delete(key);
    }

  } catch (error) {
    console.error('Error clearing natal chart caches:', error);
    throw error;
  }
}

/**
 * Clear a specific natal chart cache
 */
export async function clearSpecificNatalChartCache(
  personId: string,
  dateOfBirth: string,
  timeOfBirth: string,
  lat: string,
  lon: string
): Promise<void> {
  const cacheKey = `natal_chart_${personId}_${dateOfBirth}_${timeOfBirth}_${lat}_${lon}`;
  await db.cache.delete(cacheKey);
}

/**
 * Check if cache invalidation is needed based on cache creation date
 * (e.g., if cache was created before timezone fix was deployed)
 */
export async function isChartCacheOutdated(cacheKey: string): Promise<boolean> {
  try {
    const cacheEntry = await db.cache.get(cacheKey);
    if (!cacheEntry) return false;

    // Timezone fix deployment date (adjust this to your actual deployment date)
    const TIMEZONE_FIX_DEPLOYMENT_DATE = new Date('2025-01-14T00:00:00Z');
    
    const cacheCreatedAt = new Date(cacheEntry.createdAt);
    return cacheCreatedAt < TIMEZONE_FIX_DEPLOYMENT_DATE;
  } catch (error) {
    console.error('Error checking cache date:', error);
    return true; // Assume outdated if we can't check
  }
}

/**
 * Clear all outdated natal chart caches
 */
export async function clearOutdatedNatalChartCaches(): Promise<number> {
  try {
    const allCacheEntries = await db.cache.toArray();
    const TIMEZONE_FIX_DEPLOYMENT_DATE = new Date('2025-01-14T00:00:00Z');
    let clearedCount = 0;

    for (const entry of allCacheEntries) {
      if (entry.key.startsWith('natal_chart_')) {
        const cacheCreatedAt = new Date(entry.createdAt);
        if (cacheCreatedAt < TIMEZONE_FIX_DEPLOYMENT_DATE) {
          await db.cache.delete(entry.key);
          clearedCount++;
        }
      }
    }

    return clearedCount;
  } catch (error) {
    console.error('Error clearing outdated caches:', error);
    return 0;
  }
}

/**
 * Show a user-friendly prompt to clear caches if timezone issues are suspected
 */
export function showCacheClearPrompt(onClear: () => void): void {
  // Create a simple toast message with action
  toast('Timezone calculations improved! Click to refresh chart data for better accuracy.', {
    duration: 8000,
    position: 'bottom-right',
    action: {
      label: 'Refresh Now',
      onClick: () => {
        onClear();
        toast.success('Chart data refreshed successfully!');
      }
    }
  });
}