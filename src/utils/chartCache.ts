/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from '@/store/database';
import { BirthData } from '@/types/user';
import { NatalChartData } from '@/types/chart';

// Cache version - increment this to invalidate all old cache entries
const CACHE_VERSION = 'v6';

/**
 * Generates a unique, collision-resistant cache key for chart data
 * Always uses the current user's ID to ensure proper isolation between users
 */
export const generateCacheKey = (
  userId: string,
  personId: string | null,
  birthData: BirthData
): string => {
  // Normalize coordinates to prevent floating point precision issues
  const normalizedLat = parseFloat(birthData.coordinates.lat).toFixed(6);
  const normalizedLon = parseFloat(birthData.coordinates.lon).toFixed(6);
  
  // Create a hash of birth data for shorter, more reliable keys
  const birthDataString = `${birthData.dateOfBirth}_${birthData.timeOfBirth}_${normalizedLat}_${normalizedLon}`;
  const birthDataHash = btoa(birthDataString)
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 16);
  
  // Always use userId as the primary identifier to prevent cross-user conflicts
  // Include version to invalidate old cache when security fixes are applied
  const identifier = personId ? `${userId}_person_${personId}` : `${userId}_self`;
  
  return `natal_chart_${CACHE_VERSION}_${identifier}_${birthDataHash}`;
};

/**
 * Cache management utilities for chart data with offline mode support
 */
export class ChartCacheManager {
  // Memory cache for offline fallback
  private static memoryCache = new Map<string, { data: NatalChartData; expiry: number }>();
  /**
   * Get cached chart data
   */
  static async getCache(cacheKey: string): Promise<NatalChartData | null> {
    try {
      const cached = await db.getCache<NatalChartData>(cacheKey);
      if (cached) {
        console.log('✅ ChartCacheManager: Found cached chart for offline use');
        return cached;
      }
    } catch (error) {
      console.warn('⚠️ ChartCacheManager: Database cache failed, trying memory cache:', error);
    }
    
    // Fallback to memory cache
    const memoryEntry = this.memoryCache.get(cacheKey);
    if (memoryEntry && memoryEntry.expiry > Date.now()) {
      console.log('✅ ChartCacheManager: Found chart in memory cache (offline mode)');
      return memoryEntry.data;
    }
    
    // Clean expired memory entries
    this.cleanMemoryCache();
    return null;
  }

  /**
   * Set cached chart data with TTL
   */
  static async setCache(
    cacheKey: string, 
    chartData: NatalChartData, 
    ttlMinutes: number = 1440
  ): Promise<void> {
    try {
      await db.setCache(cacheKey, chartData, ttlMinutes);
      console.log('✅ ChartCacheManager: Chart cached for offline use');
    } catch (error) {
      console.warn('⚠️ ChartCacheManager: Failed to cache chart, will operate in memory only:', error);
      // Store in memory as fallback for offline mode
      this.memoryCache.set(cacheKey, { data: chartData, expiry: Date.now() + (ttlMinutes * 60 * 1000) });
    }
  }

  /**
   * Clear all cache entries for a specific user
   */
  static async clearUserCache(userId: string): Promise<number> {
    try {
      const allCacheKeys = await db.cache.toArray();
      const userCacheKeys = allCacheKeys
        .filter(entry => entry.key.startsWith(`natal_chart_${userId}_`))
        .map(entry => entry.key);
      
      for (const cacheKey of userCacheKeys) {
        await db.cache.delete(cacheKey);
      }
      
      console.log(`Cleared ${userCacheKeys.length} cache entries for user ${userId}`);
      return userCacheKeys.length;
    } catch (error) {
      console.error('Error clearing user cache:', error);
      return 0;
    }
  }

  /**
   * Delete a specific cache entry
   */
  static async deleteCache(cacheKey: string): Promise<void> {
    try {
      await db.cache.delete(cacheKey);
    } catch (error) {
      console.error('Error deleting cache entry:', error);
    }
  }

  /**
   * Clean expired entries from memory cache
   */
  static cleanMemoryCache(): void {
    const now = Date.now();
    for (const [key, entry] of Array.from(this.memoryCache.entries())) {
      if (entry.expiry <= now) {
        this.memoryCache.delete(key);
      }
    }
  }

  /**
   * Check if system is in offline mode (database unavailable)
   */
  static async isOfflineMode(): Promise<boolean> {
    try {
      await db.getCache<any>('test_connection');
      return false;
    } catch (error) {
      return true;
    }
  }

  /**
   * Check if chart data matches cached data (for avoiding unnecessary reloads)
   */
  static isChartDataMatching(
    cachedChart: NatalChartData | null,
    birthData: BirthData
  ): boolean {
    if (!cachedChart?.metadata?.birthData) return false;
    
    const cached = cachedChart.metadata.birthData;
    
    return (
      cached.dateOfBirth === birthData.dateOfBirth &&
      cached.timeOfBirth === birthData.timeOfBirth &&
      Math.abs(
        parseFloat(cached.coordinates?.lat || '0') - 
        parseFloat(birthData.coordinates.lat)
      ) < 0.0001 &&
      Math.abs(
        parseFloat(cached.coordinates?.lon || '0') - 
        parseFloat(birthData.coordinates.lon)
      ) < 0.0001
    );
  }
}