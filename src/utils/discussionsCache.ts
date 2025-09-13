/* eslint-disable @typescript-eslint/no-unused-vars */

interface CachedDiscussions {
  discussions: any[];
  timestamp: number;
  userId?: string;
}

interface CacheState {
  isFromCache: boolean;
  isFetchingFresh: boolean;
  cacheTimestamp?: number;
}

export class DiscussionsCache {
  private static CACHE_KEY = 'discussions_cache_v3';
  
  // Get cached discussions data
  static getCached(): { data: any[] | null; isFromCache: boolean; userId?: string; timestamp?: number } {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) {
        return { data: null, isFromCache: false };
      }

      const parsedCache: CachedDiscussions = JSON.parse(cached);
      
      return {
        data: parsedCache.discussions || null,
        isFromCache: true,
        userId: parsedCache.userId,
        timestamp: parsedCache.timestamp
      };
    } catch (error) {
      console.error('Error reading discussions cache:', error);
      return { data: null, isFromCache: false };
    }
  }

  // Set cached discussions data
  static setCached(discussions: any[], userId?: string): void {
    try {
      const cacheData: CachedDiscussions = {
        discussions,
        timestamp: Date.now(),
        userId
      };
      
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error saving discussions cache:', error);
    }
  }

  // Clear cache (for logout, etc.)
  static clearCache(): void {
    try {
      localStorage.removeItem(this.CACHE_KEY);
    } catch (error) {
      console.error('Error clearing discussions cache:', error);
    }
  }

  // Check if cache exists for a different user
  static isCacheForDifferentUser(currentUserId?: string): boolean {
    const { userId } = this.getCached();
    return !!(userId && currentUserId && userId !== currentUserId);
  }

  // Get cache age in milliseconds
  static getCacheAge(): number {
    const { timestamp } = this.getCached();
    if (!timestamp) return 0;
    return Date.now() - timestamp;
  }

  // Format cache age for display
  static formatCacheAge(): string {
    const age = this.getCacheAge();
    if (age === 0) return 'No cache';
    
    const minutes = Math.floor(age / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  }
}