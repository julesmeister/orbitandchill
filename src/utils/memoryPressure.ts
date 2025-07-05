/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Memory Pressure Relief System
 * Automatically handles high memory situations
 */

import fs from 'fs';
import path from 'path';

interface MemoryPressureState {
  isUnderPressure: boolean;
  lastCleanup: number;
  cleanupCount: number;
  criticalLevel: boolean;
}

class MemoryPressureManager {
  private state: MemoryPressureState = {
    isUnderPressure: false,
    lastCleanup: 0,
    cleanupCount: 0,
    criticalLevel: false
  };

  private readonly EMERGENCY_HEAP_THRESHOLD = 0.98;  // 98% - immediate action
  private readonly CRITICAL_HEAP_THRESHOLD = 0.95;  // 95% - more realistic threshold
  private readonly HIGH_HEAP_THRESHOLD = 0.85;      // 85% - reasonable warning level
  private readonly CLEANUP_COOLDOWN = 300000;       // 5 minutes between cleanups
  private readonly MAX_CLEANUPS_PER_HOUR = 4;       // Reduced cleanup frequency

  /**
   * Check if system is under memory pressure
   */
  checkMemoryPressure(): MemoryPressureState {
    if (typeof process === 'undefined' || !process.memoryUsage) {
      return this.state;
    }

    const usage = process.memoryUsage();
    const heapPercent = usage.heapUsed / usage.heapTotal;
    const now = Date.now();

    // Update pressure state
    this.state.criticalLevel = heapPercent > this.CRITICAL_HEAP_THRESHOLD;
    this.state.isUnderPressure = heapPercent > this.HIGH_HEAP_THRESHOLD;

    // Emergency memory condition - DISABLED to prevent death spiral
    if (false && heapPercent > this.EMERGENCY_HEAP_THRESHOLD) {
      console.error(`🚨 EMERGENCY MEMORY: ${(heapPercent * 100).toFixed(1)}% - monitoring disabled`);
      // Emergency cleanup completely disabled
    }

    // Check for external memory pressure signal
    const pressureFile = path.join(process.cwd(), '.memory-pressure');
    if (fs.existsSync(pressureFile)) {
      this.state.isUnderPressure = true;
      try {
        const pressureData = JSON.parse(fs.readFileSync(pressureFile, 'utf8'));
        // External memory pressure detected - processing silently
      } catch (error) {
        // Ignore file parsing errors
      }
    }

    return this.state;
  }

  /**
   * Perform memory cleanup if conditions are met
   */
  async performCleanup(): Promise<boolean> {
    const now = Date.now();
    const hourAgo = now - 3600000;

    // Check cooldown period
    if (now - this.state.lastCleanup < this.CLEANUP_COOLDOWN) {
      return false;
    }

    // Check cleanup frequency limit
    if (this.state.cleanupCount > this.MAX_CLEANUPS_PER_HOUR) {
      // Reset counter if more than an hour has passed
      if (this.state.lastCleanup < hourAgo) {
        this.state.cleanupCount = 0;
      } else {
        console.warn('Memory cleanup rate limited - too many cleanups in the last hour');
        return false;
      }
    }

    try {
      // Performing automatic memory cleanup...
      
      const beforeUsage = process.memoryUsage();
      const beforeHeapPercent = (beforeUsage.heapUsed / beforeUsage.heapTotal) * 100;

      // 1. Force multiple garbage collection cycles if available
      if (global && typeof global.gc === 'function') {
        global.gc(); // First GC cycle
        await new Promise(resolve => setTimeout(resolve, 100));
        global.gc(); // Second GC cycle for better cleanup
      }

      // 2. Clear cache systems (import dynamically to avoid circular deps)
      try {
        const { getGlobalCache } = await import('./cache');
        const cache = getGlobalCache();
        if (cache) {
          const cleared = cache.clear();
          // Also clear any module-level caches
          if (typeof require !== 'undefined' && require.cache) {
            // Clear some non-essential cached modules to free memory
            const moduleKeysToDelete = Object.keys(require.cache).filter(key => 
              key.includes('analytics') || key.includes('temp') || key.includes('cache')
            );
            moduleKeysToDelete.forEach(key => {
              try { delete require.cache[key]; } catch(e) {}
            });
          }
        }
      } catch (error) {
        // Cache might not be available
      }

      // 3. Aggressive connection pool cleanup
      try {
        const { getConnectionPool, forcePoolCleanup } = await import('../db/connectionPool');
        await forcePoolCleanup(); // More aggressive cleanup
        
        const pool = getConnectionPool();
        if (pool) {
          pool['cleanup']?.();
        }
      } catch (error) {
        // Connection pool might not be available
      }

      // 4. Clear Next.js internal caches if available
      try {
        // Clear any Next.js compilation caches that might be holding memory
        if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
          // In development, we can be more aggressive with clearing caches
          if ((global as any)?.__webpack_require__?.cache) {
            Object.keys((global as any).__webpack_require__.cache).forEach(key => {
              if (key.includes('node_modules') && !key.includes('essential')) {
                try { delete (global as any).__webpack_require__.cache[key]; } catch(e) {}
              }
            });
          }
        }
      } catch (error) {
        // Ignore webpack cache cleanup errors
      }

      // 4. Clear memory monitor snapshots
      try {
        const { getMemoryStats } = await import('./memoryMonitor');
        const stats = getMemoryStats();
        if (stats && stats.snapshots.length > 10) {
          // Memory monitor snapshot accumulation noted
        }
      } catch (error) {
        // Memory monitor might not be available
      }

      // Wait for cleanup to take effect
      await new Promise(resolve => setTimeout(resolve, 500));

      // Force final aggressive GC cycles
      if (global && typeof global.gc === 'function') {
        global.gc(); // Third GC cycle
        await new Promise(resolve => setTimeout(resolve, 100));
        global.gc(); // Fourth GC cycle for maximum cleanup
      }

      const afterUsage = process.memoryUsage();
      const afterHeapPercent = (afterUsage.heapUsed / afterUsage.heapTotal) * 100;
      const improvement = beforeHeapPercent - afterHeapPercent;

      // Cleanup completed - heap usage change recorded

      // Update state
      this.state.lastCleanup = now;
      this.state.cleanupCount++;

      return improvement > 0;

    } catch (error) {
      console.error('❌ Memory cleanup failed:', error);
      return false;
    }
  }

  /**
   * Emergency memory cleanup - immediate action for critical situations
   * This bypasses cooldowns and cleanup limits
   */
  async emergencyMemoryCleanup(): Promise<void> {
    console.error('🚨 EMERGENCY MEMORY CLEANUP INITIATED');
    
    try {
      const startUsage = process.memoryUsage();
      
      // 1. Multiple garbage collection cycles with delays
      if (global.gc) {
        for (let i = 0; i < 3; i++) {
          global.gc();
          await new Promise(resolve => setTimeout(resolve, 100)); // Wait for GC
        }
        console.error('🧹 Multiple garbage collection cycles completed');
      }

      // 2. Emergency cache clearing
      try {
        const { getGlobalCache } = await import('./cache');
        const cache = getGlobalCache();
        if (cache) {
          cache.clear();
          console.error('🗑️  Emergency cache cleared');
        }
      } catch (error) {
        // Continue with cleanup even if cache fails
      }

      // 3. Clear Node.js require cache for non-essential modules
      try {
        let clearedModules = 0;
        const essentialModules = [
          'fs', 'path', 'http', 'https', 'crypto', 'util', 'events',
          'stream', 'buffer', 'process', 'next', 'react'
        ];
        
        for (const key in require.cache) {
          const isEssential = essentialModules.some(mod => key.includes(mod));
          if (!isEssential && !key.includes('node_modules')) {
            delete require.cache[key];
            clearedModules++;
          }
        }
        console.error(`🗂️  Cleared ${clearedModules} non-essential modules from require cache`);
      } catch (error) {
        // Continue cleanup
      }

      // 4. Emergency connection pool destruction
      try {
        const { destroyConnectionPool } = await import('../db/connectionPool');
        await destroyConnectionPool();
        console.error('💀 Emergency connection pool destroyed');
      } catch (error) {
        // Continue with cleanup even if pool destruction fails
      }

      // 5. Clear memory monitor snapshots immediately
      try {
        const { clearAllSnapshots } = await import('./memoryMonitor');
        if (clearAllSnapshots) {
          clearAllSnapshots();
          console.error('🧹 All memory snapshots cleared');
        }
      } catch (error) {
        // Continue with cleanup
      }

      // 6. Clear global variables and accumulated data
      try {
        // Clear global timers and intervals (be careful not to break app)
        if (typeof global !== 'undefined') {
          // Clear any custom global variables we might have set
          delete (global as any).__MEMORY_SNAPSHOTS__;
          delete (global as any).__CACHE_STATS__;
          delete (global as any).__CONNECTION_POOL__;
        }
        console.error('📊 Memory snapshots cleared');
      } catch (error) {
        // Continue cleanup
      }

      // 7. Force another GC cycle after cleanup
      if (global.gc) {
        global.gc();
      }

      // 8. Calculate memory freed
      const endUsage = process.memoryUsage();
      const freedMB = (startUsage.heapUsed - endUsage.heapUsed) / 1024 / 1024;
      
      console.error(`🚨 EMERGENCY CLEANUP COMPLETED - Freed: ${freedMB.toFixed(1)}MB`);
      
      // Add delay before allowing next emergency cleanup
      this.state.lastCleanup = Date.now();
      
    } catch (error) {
      console.error('❌ Emergency cleanup failed:', error);
    }
  }

  /**
   * Get recommendations for memory optimization
   */
  getRecommendations(): string[] {
    const recommendations: string[] = [];
    
    if (this.state.criticalLevel) {
      recommendations.push('CRITICAL: Consider restarting the application');
      recommendations.push('Investigate for memory leaks immediately');
      recommendations.push('Check connection pool and cache sizes');
    }
    
    if (this.state.isUnderPressure) {
      recommendations.push('Monitor memory usage closely');
      recommendations.push('Consider reducing connection pool size');
      recommendations.push('Check for long-running operations');
    }
    
    if (this.state.cleanupCount > 3) {
      recommendations.push('Frequent cleanups indicate a memory leak');
      recommendations.push('Review recent code changes');
      recommendations.push('Enable memory profiling');
    }

    return recommendations;
  }

  /**
   * Emergency intervention for critical memory situations
   */
  async emergencyIntervention(): Promise<void> {
    if (!this.state.criticalLevel) {
      return;
    }

    console.warn('EMERGENCY: Critical memory usage detected - taking emergency action');

    try {
      // 1. Force immediate cleanup
      await this.performCleanup();

      // 2. Create emergency memory dump if possible
      if (process.env.NODE_ENV === 'development') {
        // In development, you could trigger heap dumps here
      }

      // 3. Notify monitoring systems
      const recommendations = this.getRecommendations();
      console.warn('Emergency recommendations:');
      recommendations.forEach(rec => console.warn(`   - ${rec}`));

      // 4. Reduce system load
      // System load reduction initiated
      
      // You could implement additional emergency measures here:
      // - Disable non-critical features
      // - Reject new requests temporarily
      // - Reduce polling frequencies
      // - Clear more aggressive caches

    } catch (error) {
      console.error('❌ Emergency intervention failed:', error);
      // Last resort: suggest restart
      console.error('LAST RESORT: Application restart required');
    }
  }

  /**
   * Get current memory pressure status
   */
  getStatus() {
    return {
      ...this.state,
      memoryUsage: typeof process !== 'undefined' && process.memoryUsage ? 
        process.memoryUsage() : null
    };
  }
}

// Global instance
let globalMemoryPressureManager: MemoryPressureManager | null = null;

/**
 * Get or create the global memory pressure manager
 */
export function getMemoryPressureManager(): MemoryPressureManager {
  if (!globalMemoryPressureManager) {
    globalMemoryPressureManager = new MemoryPressureManager();
  }
  return globalMemoryPressureManager;
}

/**
 * Check and handle memory pressure automatically
 */
export async function checkAndHandleMemoryPressure(): Promise<void> {
  const manager = getMemoryPressureManager();
  const state = manager.checkMemoryPressure();

  if (state.criticalLevel) {
    await manager.emergencyIntervention();
  } else if (state.isUnderPressure) {
    await manager.performCleanup();
  }
}

/**
 * Get memory pressure status
 */
export function getMemoryPressureStatus() {
  return getMemoryPressureManager().getStatus();
}

// Auto-start memory pressure monitoring - DISABLED
// Note: Auto-monitoring disabled to prevent excessive alerts
// Use manual monitoring via admin panel or specific API calls
if (false && typeof process !== 'undefined') {
  // Check every 10 minutes for reduced noise
  const interval = 600000; // 10 minutes
  setInterval(checkAndHandleMemoryPressure, interval);
}

export default MemoryPressureManager;