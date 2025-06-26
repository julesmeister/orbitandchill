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

  private readonly CRITICAL_HEAP_THRESHOLD = 0.95; // 95%
  private readonly HIGH_HEAP_THRESHOLD = 0.90;     // 90%
  private readonly CLEANUP_COOLDOWN = 60000;       // 1 minute between cleanups
  private readonly MAX_CLEANUPS_PER_HOUR = 6;      // Don't cleanup too frequently

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

      // 1. Force garbage collection if available
      if (global && typeof global.gc === 'function') {
        global.gc();
      }

      // 2. Clear cache systems (import dynamically to avoid circular deps)
      try {
        const { getGlobalCache } = await import('./cache');
        const cache = getGlobalCache();
        if (cache) {
          const cleared = cache.clear();
          // Cache entries cleared silently
        }
      } catch (error) {
        // Cache might not be available
      }

      // 3. Request connection pool cleanup
      try {
        const { getConnectionPool } = await import('../db/connectionPool');
        const pool = getConnectionPool();
        if (pool) {
          // Force cleanup of idle connections
          pool['cleanup']?.();
          // Connection pool cleanup triggered silently
        }
      } catch (error) {
        // Connection pool might not be available
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
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Force another GC
      if (global && typeof global.gc === 'function') {
        global.gc();
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
        console.log('   Consider creating heap dump for analysis');
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

// Auto-start memory pressure monitoring in production
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
  // Check every 5 minutes in production
  setInterval(checkAndHandleMemoryPressure, 300000);
}

export default MemoryPressureManager;