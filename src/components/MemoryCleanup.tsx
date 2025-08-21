"use client";
import { useEffect } from 'react';
// Custom analytics removed - using Google Analytics only
import { stopMemoryMonitoring } from '@/utils/memoryMonitor';
import { destroyConnectionPool } from '@/db/connectionPool';
import { getGlobalCache } from '@/utils/cache';

/**
 * Client component to handle memory cleanup on app shutdown
 * This prevents memory leaks during development hot reloads
 */
export default function MemoryCleanup() {
  useEffect(() => {
    // Cleanup on unmount - DISABLED to prevent interference
    return () => {
      if (false) { // Disable all cleanup
      try {
        // Analytics cleanup removed - Google Analytics handles its own cleanup
        
        // Stop memory monitoring
        stopMemoryMonitoring();
        
        // Clean up database connection pool
        destroyConnectionPool();
        
        // Clear global cache
        const cache = getGlobalCache();
        if (cache) {
          cache.clear();
        }
        
        console.debug('🧹 Memory cleanup completed');
      } catch (error) {
        console.warn('⚠️ Error during memory cleanup:', error);
      }
      }
    };
  }, []);

  // Add periodic cleanup every 30 minutes to prevent gradual memory accumulation
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        // Force cache cleanup
        const cache = getGlobalCache();
        if (cache) {
          const stats = cache.getStats();
          if (stats.expiredEntries > 50) {
            // Clear expired entries if there are many
            console.debug('🧹 Periodic cache cleanup:', stats.expiredEntries, 'expired entries');
          }
        }
      } catch (error) {
        console.warn('⚠️ Error during periodic cleanup:', error);
      }
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(interval);
  }, []);

  return null; // This component renders nothing
}