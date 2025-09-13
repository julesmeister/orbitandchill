/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * In-memory cache utility for API responses and database queries
 * Improves performance by reducing redundant database calls
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize: number;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(maxSize: number = 1000) {
    this.maxSize = maxSize;
    this.startCleanupTimer();
  }

  /**
   * Estimate size in bytes of a cache entry
   */
  private estimateEntrySize(key: string, data: any): number {
    try {
      const keySize = new TextEncoder().encode(key).length;
      const dataSize = new TextEncoder().encode(JSON.stringify(data)).length;
      return keySize + dataSize + 64; // Add overhead for metadata
    } catch {
      return 1024; // Fallback estimate for unstringifiable objects
    }
  }

  /**
   * Get estimated memory usage in bytes
   */
  private getMemoryUsageBytes(): number {
    let totalBytes = 0;
    for (const [key, entry] of this.cache.entries()) {
      totalBytes += this.estimateEntrySize(key, entry.data);
    }
    return totalBytes;
  }

  /**
   * Set cache entry with TTL and memory limit enforcement
   */
  set<T>(key: string, data: T, ttlMs: number = 300000): void { // Default 5 minutes
    const MAX_MEMORY_BYTES = 50 * 1024 * 1024; // 50MB cache limit
    const entrySize = this.estimateEntrySize(key, data);
    
    // Don't cache extremely large objects (> 5MB each)
    if (entrySize > 5 * 1024 * 1024) {
      console.warn(`Cache entry too large (${Math.round(entrySize / 1024 / 1024)}MB), skipping: ${key}`);
      return;
    }

    // Remove entries until we have space (size-based + memory-based eviction)
    while (this.cache.size >= this.maxSize || this.getMemoryUsageBytes() + entrySize > MAX_MEMORY_BYTES) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      } else {
        break; // No more entries to remove
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    });
  }

  /**
   * Get cache entry if not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Delete specific cache entry
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): number {
    const size = this.cache.size;
    this.cache.clear();
    return size;
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    }

    const memoryBytes = this.getMemoryUsageBytes();
    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
      maxSize: this.maxSize,
      memoryUsage: this.estimateMemoryUsage(), // Legacy KB format
      memoryUsageBytes: memoryBytes,
      memoryUsageMB: Math.round(memoryBytes / 1024 / 1024 * 100) / 100
    };
  }

  /**
   * Estimate memory usage (rough calculation)
   */
  private estimateMemoryUsage(): string {
    const entries = Array.from(this.cache.entries());
    const sizeEstimate = entries.reduce((acc, [key, value]) => {
      return acc + key.length + JSON.stringify(value).length;
    }, 0);
    
    return `${Math.round(sizeEstimate / 1024)}KB`;
  }

  /**
   * Start periodic cleanup of expired entries
   */
  private startCleanupTimer(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000); // Cleanup every minute
  }

  /**
   * Remove expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));

    // Cleanup completed silently - only log in development if needed
    if (keysToDelete.length > 10 && process.env.NODE_ENV === 'development') {
      console.log(`Cache cleanup: removed ${keysToDelete.length} expired entries`);
    }
  }

  /**
   * Stop cleanup timer
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.clear();
  }
}

// Global cache instance
const globalCache = new MemoryCache(2000);

/**
 * Cache decorator for async functions
 */
export function cached<T extends (...args: any[]) => Promise<any>>(
  ttlMs: number = 300000,
  keyGenerator?: (...args: Parameters<T>) => string
) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: Parameters<T>): Promise<ReturnType<T>> {
      const cacheKey = keyGenerator 
        ? keyGenerator(...args)
        : `${target.constructor.name}.${propertyName}:${JSON.stringify(args)}`;

      // Check cache first
      const cached = globalCache.get<ReturnType<T>>(cacheKey);
      if (cached !== null) {
        return cached;
      }

      // Execute original method - cache miss
      const result = await originalMethod.apply(this, args);

      // Cache the result
      globalCache.set(cacheKey, result, ttlMs);
      
      return result;
    };

    return descriptor;
  };
}

/**
 * Cache utility functions
 */
export const Cache = {
  /**
   * Get cached value
   */
  get: <T>(key: string): T | null => globalCache.get<T>(key),

  /**
   * Set cached value
   */
  set: <T>(key: string, value: T, ttlMs: number = 300000): void => 
    globalCache.set(key, value, ttlMs),

  /**
   * Check if key exists
   */
  has: (key: string): boolean => globalCache.has(key),

  /**
   * Delete cached value
   */
  delete: (key: string): boolean => globalCache.delete(key),

  /**
   * Clear all cache
   */
  clear: (): number => globalCache.clear(),

  /**
   * Get cache statistics
   */
  getStats: () => globalCache.getStats(),

  /**
   * Cache with async function wrapper
   */
  wrap: async <T>(
    key: string,
    asyncFn: () => Promise<T>,
    ttlMs: number = 300000
  ): Promise<T> => {
    // Check cache first
    const cached = globalCache.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Execute function - cache miss
    const result = await asyncFn();

    // Cache result
    globalCache.set(key, result, ttlMs);
    
    return result;
  },

  /**
   * Invalidate cache entries by pattern
   */
  invalidatePattern: (pattern: string): number => {
    let count = 0;
    const regex = new RegExp(pattern);
    
    for (const key of globalCache['cache'].keys()) {
      if (regex.test(key)) {
        globalCache.delete(key);
        count++;
      }
    }
    
    // Pattern invalidation completed silently
    return count;
  },

  /**
   * Preload cache with data
   */
  preload: <T>(entries: Array<{ key: string; value: T; ttlMs?: number }>): void => {
    entries.forEach(({ key, value, ttlMs = 300000 }) => {
      globalCache.set(key, value, ttlMs);
    });
    // Cache preloading completed silently
  }
};

/**
 * TTL constants for different types of data
 */
export const CacheTTL = {
  VERY_SHORT: 30 * 1000,      // 30 seconds
  SHORT: 5 * 60 * 1000,       // 5 minutes
  MEDIUM: 15 * 60 * 1000,     // 15 minutes
  LONG: 60 * 60 * 1000,       // 1 hour
  VERY_LONG: 24 * 60 * 60 * 1000, // 24 hours
  
  // Specific use cases
  DISCUSSIONS: 5 * 60 * 1000,     // 5 minutes
  USER_PROFILE: 15 * 60 * 1000,   // 15 minutes
  ANALYTICS: 60 * 60 * 1000,      // 1 hour
  CHARTS: 24 * 60 * 60 * 1000,    // 24 hours
  STATIC_DATA: 24 * 60 * 60 * 1000 // 24 hours (categories, etc.)
};

/**
 * Generate cache keys consistently
 */
export const CacheKeys = {
  discussion: (id: string) => `discussion:${id}`,
  discussionsList: (params: Record<string, any>) => 
    `discussions:${Object.entries(params).sort().map(([k, v]) => `${k}=${v}`).join('&')}`,
  userProfile: (id: string) => `user:${id}`,
  replies: (discussionId: string, limit: number, offset: number) => 
    `replies:${discussionId}:${limit}:${offset}`,
  analytics: (type: string, date: string) => `analytics:${type}:${date}`,
  chart: (userId: string, birthData: string) => `chart:${userId}:${birthData}`
};

/**
 * Get the global cache instance
 */
export function getGlobalCache() {
  return globalCache;
}

export default Cache;