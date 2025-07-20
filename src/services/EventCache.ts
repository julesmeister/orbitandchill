/* eslint-disable @typescript-eslint/no-unused-vars */

import type { EventCache, EventCacheEntry } from '../types/events';

/**
 * EventCache handles caching of event data
 * Pure caching logic with configurable TTL
 */
export class EventCacheImpl implements EventCache {
  private cache = new Map<string, EventCacheEntry>();
  private defaultTtl: number;

  constructor(defaultTtlMinutes: number = 60) {
    this.defaultTtl = defaultTtlMinutes * 60 * 1000; // Convert to milliseconds
  }

  /**
   * Get cached entry if not expired
   */
  get(key: string): EventCacheEntry | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      // console.log(`📦 EventCache: Cache miss for ${key}`);
      return null;
    }
    
    if (this.isExpired(entry)) {
      // console.log(`⏰ EventCache: Cache expired for ${key}`);
      this.cache.delete(key);
      return null;
    }
    
    console.log(`✅ EventCache: Cache hit for ${key}`);
    return entry;
  }

  /**
   * Set cache entry with TTL
   */
  set(key: string, entry: EventCacheEntry): void {
    // console.log(`💾 EventCache: Caching ${entry.eventIds.length} events for ${key}`);
    
    const cacheEntry: EventCacheEntry = {
      ...entry,
      loadedAt: Date.now(),
      expiresAt: Date.now() + this.defaultTtl
    };
    
    this.cache.set(key, cacheEntry);
  }

  /**
   * Invalidate specific cache entry
   */
  invalidate(key: string): void {
    const existed = this.cache.has(key);
    this.cache.delete(key);
    
    if (existed) {
      console.log(`🗑️ EventCache: Invalidated cache for ${key}`);
    }
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    console.log(`🧹 EventCache: Cleared ${size} cache entries`);
  }

  /**
   * Check if cache entry is expired
   */
  isExpired(entry: EventCacheEntry): boolean {
    return Date.now() > entry.expiresAt;
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const entries = Array.from(this.cache.values());
    const expired = entries.filter(entry => this.isExpired(entry)).length;
    
    return {
      total: this.cache.size,
      expired,
      valid: this.cache.size - expired
    };
  }

  /**
   * Generate cache key for month events
   */
  static generateMonthKey(userId: string, month: number, year: number): string {
    return `events_${userId}_${year}-${String(month + 1).padStart(2, '0')}`;
  }

  /**
   * Clean up expired entries (call periodically)
   */
  cleanup(): void {
    const before = this.cache.size;
    const keysToDelete: string[] = [];
    
    this.cache.forEach((entry, key) => {
      if (this.isExpired(entry)) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.cache.delete(key));
    
    if (keysToDelete.length > 0) {
      console.log(`🧹 EventCache: Cleaned up ${keysToDelete.length} expired entries`);
    }
  }
}

// Export singleton instance
export const eventCache = new EventCacheImpl(60); // 60 minute TTL

// Set up periodic cleanup (every 10 minutes)
if (typeof window !== 'undefined') {
  setInterval(() => {
    eventCache.cleanup();
  }, 10 * 60 * 1000);
}