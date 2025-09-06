/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Chart Prefetching Utility
 * Proactively loads chart data in the background to improve perceived performance
 */

import { ChartApiService } from '../services/chartApiService';
import { Person } from '../types/people';

interface PrefetchCache {
  [key: string]: {
    data: any;
    timestamp: number;
    isLoading: boolean;
  };
}

class ChartPrefetcher {
  private cache: PrefetchCache = {};
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_CACHE_ENTRIES = 20;

  /**
   * Generate a cache key for a person's chart data
   */
  private getCacheKey(person: Person): string {
    if (!person?.birthData) return '';
    
    const { dateOfBirth, timeOfBirth, coordinates } = person.birthData;
    return `${dateOfBirth}_${timeOfBirth}_${coordinates?.lat}_${coordinates?.lon}`;
  }

  /**
   * Check if cached data is still valid
   */
  private isCacheValid(entry: any): boolean {
    if (!entry) return false;
    return (Date.now() - entry.timestamp) < this.CACHE_DURATION;
  }

  /**
   * Clean up old cache entries
   */
  private cleanupCache(): void {
    const entries = Object.entries(this.cache);
    
    // Remove expired entries
    entries.forEach(([key, entry]) => {
      if (!this.isCacheValid(entry)) {
        delete this.cache[key];
      }
    });

    // If still too many entries, remove oldest ones
    const remainingEntries = Object.entries(this.cache);
    if (remainingEntries.length > this.MAX_CACHE_ENTRIES) {
      remainingEntries
        .sort((a, b) => a[1].timestamp - b[1].timestamp)
        .slice(0, remainingEntries.length - this.MAX_CACHE_ENTRIES)
        .forEach(([key]) => delete this.cache[key]);
    }
  }

  /**
   * Prefetch chart data for a person
   */
  async prefetchChart(person: Person): Promise<void> {
    const cacheKey = this.getCacheKey(person);
    if (!cacheKey || !person.birthData) return;

    const cachedEntry = this.cache[cacheKey];
    
    // Don't prefetch if we already have valid data or are currently loading
    if (this.isCacheValid(cachedEntry) || cachedEntry?.isLoading) {
      return;
    }

    // Mark as loading to prevent duplicate requests
    this.cache[cacheKey] = {
      data: null,
      timestamp: Date.now(),
      isLoading: true
    };

    try {
      // Attempt to prefetch existing chart first (faster)
      const existingCharts = await ChartApiService.getUserCharts(person.userId);
      
      if (existingCharts.length > 0) {
        // Use most recent chart
        const recentChart = existingCharts.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];

        this.cache[cacheKey] = {
          data: recentChart,
          timestamp: Date.now(),
          isLoading: false
        };
        return;
      }

      // If no existing chart, we could prefetch generation but that's expensive
      // Instead, just mark that we checked and no chart exists
      this.cache[cacheKey] = {
        data: null,
        timestamp: Date.now(),
        isLoading: false
      };

    } catch (error) {
      console.warn('Chart prefetch failed:', error);
      // Remove loading entry on error
      delete this.cache[cacheKey];
    } finally {
      // Cleanup old entries periodically
      this.cleanupCache();
    }
  }

  /**
   * Get prefetched chart data if available
   */
  getPrefetchedChart(person: Person): any | null {
    const cacheKey = this.getCacheKey(person);
    if (!cacheKey) return null;

    const cachedEntry = this.cache[cacheKey];
    if (this.isCacheValid(cachedEntry) && !cachedEntry.isLoading) {
      return cachedEntry.data;
    }

    return null;
  }

  /**
   * Check if chart data is currently being prefetched
   */
  isPrefetching(person: Person): boolean {
    const cacheKey = this.getCacheKey(person);
    if (!cacheKey) return false;

    const cachedEntry = this.cache[cacheKey];
    return cachedEntry?.isLoading === true;
  }

  /**
   * Clear all prefetch cache
   */
  clearCache(): void {
    this.cache = {};
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    const entries = Object.values(this.cache);
    return {
      totalEntries: entries.length,
      validEntries: entries.filter(entry => this.isCacheValid(entry)).length,
      loadingEntries: entries.filter(entry => entry.isLoading).length,
      cacheHitRate: entries.length > 0 ? 
        entries.filter(entry => entry.data !== null).length / entries.length : 0
    };
  }
}

// Global chart prefetcher instance
export const chartPrefetcher = new ChartPrefetcher();

export default ChartPrefetcher;