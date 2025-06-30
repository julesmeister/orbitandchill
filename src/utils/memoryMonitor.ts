/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Memory monitoring utility for detecting potential memory leaks
 * Tracks memory usage patterns and provides warnings for unusual behavior
 */

interface MemorySnapshot {
  timestamp: number;
  heapUsed: number;
  heapTotal: number;
  external: number;
  arrayBuffers: number;
  rss: number; // Resident Set Size
}

interface MemoryStats {
  current: MemorySnapshot;
  peak: MemorySnapshot;
  average: {
    heapUsed: number;
    heapTotal: number;
    rss: number;
  };
  trend: 'increasing' | 'stable' | 'decreasing';
  snapshots: MemorySnapshot[];
}

class MemoryMonitor {
  private snapshots: MemorySnapshot[] = [];
  private interval: NodeJS.Timeout | null = null;
  private isRunning = false;
  private maxSnapshots = 10; // Keep last 10 snapshots (reduced from 20)
  private warningThresholds = {
    heapUsage: 0.80, // 80% of max heap (reduced from 85%)
    growthRate: 0.05, // 5% growth per minute (reduced from 10%)
    sustainedGrowth: 3 // 3 consecutive increasing snapshots (reduced from 5)
  };

  constructor() {
    // Only run in Node.js environment
    if (typeof process !== 'undefined' && process.memoryUsage && typeof process.memoryUsage === 'function') {
      this.setupMemoryWarnings();
    }
  }

  /**
   * Start memory monitoring
   */
  start(intervalMs: number = 300000): void { // Default 5 minutes (increased from 3 minutes to reduce overhead)
    if (this.isRunning) {
      console.warn('Memory monitor is already running');
      return;
    }

    if (typeof process === 'undefined' || !process.memoryUsage) {
      console.warn('Memory monitoring not available in this environment');
      return;
    }

    this.isRunning = true;
    // Take initial snapshot
    this.takeSnapshot();

    // Start periodic monitoring
    this.interval = setInterval(() => {
      this.takeSnapshot();
      this.analyzeMemoryTrends();
      
      // Force garbage collection if memory usage is very high
      this.handleHighMemoryUsage();
    }, intervalMs);
  }

  /**
   * Stop memory monitoring
   */
  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
  }

  /**
   * Take a memory snapshot
   */
  private takeSnapshot(): void {
    if (typeof process === 'undefined' || !process.memoryUsage) {
      return;
    }

    const memUsage = process.memoryUsage();
    const snapshot: MemorySnapshot = {
      timestamp: Date.now(),
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      external: memUsage.external,
      arrayBuffers: memUsage.arrayBuffers || 0,
      rss: memUsage.rss
    };

    this.snapshots.push(snapshot);

    // Keep only recent snapshots
    if (this.snapshots.length > this.maxSnapshots) {
      this.snapshots.shift();
    }
  }

  /**
   * Analyze memory trends and detect potential issues
   */
  private analyzeMemoryTrends(): void {
    if (this.snapshots.length < 3) {
      return; // Need at least 3 snapshots for analysis
    }

    const recent = this.snapshots.slice(-3);
    const current = recent[recent.length - 1];
    const previous = recent[recent.length - 2];

    // Check for memory growth
    const heapGrowth = (current.heapUsed - previous.heapUsed) / previous.heapUsed;
    const totalGrowth = (current.heapTotal - previous.heapTotal) / previous.heapTotal;

    // Check heap usage percentage
    const heapUsagePercent = current.heapUsed / current.heapTotal;

    // Detect concerning patterns - only log every 10 minutes to reduce noise
    const now = Date.now();
    const lastHighUsageWarning = this.getLastWarningTime('high_heap_usage');
    const lastGrowthWarning = this.getLastWarningTime('rapid_growth');
    
    if (heapUsagePercent > 0.95 && 
        (!lastHighUsageWarning || now - lastHighUsageWarning > 600000)) {
      console.warn(`Critical heap usage: ${(heapUsagePercent * 100).toFixed(1)}%`);
      this.logMemoryWarning('high_heap_usage', { heapUsagePercent });
      
      // Trigger immediate emergency cleanup if heap usage is critical (97.5%+)
      if (heapUsagePercent > 0.975) {
        console.error('🚨 EMERGENCY: Memory at critical levels - triggering immediate cleanup');
        this.triggerEmergencyCleanup();
      }
    }

    if (heapGrowth > 0.25 && 
        (!lastGrowthWarning || now - lastGrowthWarning > 600000)) {
      console.warn(`Rapid memory growth: ${(heapGrowth * 100).toFixed(1)}% in last interval`);
      this.logMemoryWarning('rapid_growth', { heapGrowth, totalGrowth });
    }

    // Check for sustained growth (potential memory leak)
    const lastFive = this.snapshots.slice(-5);
    if (lastFive.length === 5) {
      const sustainedGrowth = lastFive.every((snapshot, index) => {
        if (index === 0) return true;
        return snapshot.heapUsed > lastFive[index - 1].heapUsed;
      });

      if (sustainedGrowth) {
        const lastSustainedWarning = this.getLastWarningTime('sustained_growth');
        if (!lastSustainedWarning || now - lastSustainedWarning > 900000) {
          console.warn('Potential memory leak detected');
          this.logMemoryWarning('sustained_growth', { 
            growth: lastFive[4].heapUsed - lastFive[0].heapUsed,
            duration: lastFive[4].timestamp - lastFive[0].timestamp
          });
        }
      }
    }
  }

  /**
   * Log memory warning to analytics
   */
  private async logMemoryWarning(type: string, data: any): Promise<void> {
    try {
      // Only log warnings every 5 minutes to avoid spam
      const lastWarning = this.getLastWarningTime(type);
      if (lastWarning && Date.now() - lastWarning < 300000) {
        return;
      }

      this.setLastWarningTime(type, Date.now());

      // Send to analytics (non-blocking) - only in browser environment
      if (typeof window !== 'undefined' && typeof fetch !== 'undefined') {
        try {
          fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event: 'memory_warning',
              data: {
                type,
                ...data,
                currentMemory: this.getCurrentSnapshot(),
                timestamp: new Date().toISOString()
              }
            })
          }).catch(console.warn);
        } catch (error) {
          console.warn('Failed to log memory warning:', error);
        }
      }
    } catch (error) {
      console.warn('Failed to log memory warning:', error);
    }
  }

  /**
   * Get current memory statistics
   */
  getStats(): MemoryStats | null {
    if (this.snapshots.length === 0) {
      return null;
    }

    const current = this.snapshots[this.snapshots.length - 1];
    const peak = this.snapshots.reduce((max, snapshot) => 
      snapshot.heapUsed > max.heapUsed ? snapshot : max
    );

    // Calculate averages
    const total = this.snapshots.reduce((acc, snapshot) => ({
      heapUsed: acc.heapUsed + snapshot.heapUsed,
      heapTotal: acc.heapTotal + snapshot.heapTotal,
      rss: acc.rss + snapshot.rss
    }), { heapUsed: 0, heapTotal: 0, rss: 0 });

    const count = this.snapshots.length;
    const average = {
      heapUsed: total.heapUsed / count,
      heapTotal: total.heapTotal / count,
      rss: total.rss / count
    };

    // Determine trend
    const recentSnapshots = this.snapshots.slice(-5);
    let trend: 'increasing' | 'stable' | 'decreasing' = 'stable';
    
    if (recentSnapshots.length >= 3) {
      const first = recentSnapshots[0].heapUsed;
      const last = recentSnapshots[recentSnapshots.length - 1].heapUsed;
      const change = (last - first) / first;
      
      if (change > 0.05) trend = 'increasing';
      else if (change < -0.05) trend = 'decreasing';
    }

    return {
      current,
      peak,
      average,
      trend,
      snapshots: [...this.snapshots]
    };
  }

  /**
   * Get current memory snapshot
   */
  private getCurrentSnapshot(): MemorySnapshot | null {
    return this.snapshots.length > 0 ? this.snapshots[this.snapshots.length - 1] : null;
  }

  /**
   * Format memory size for display
   */
  static formatBytes(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Setup process memory warnings
   */
  private setupMemoryWarnings(): void {
    if (typeof process === 'undefined') return;

    // Listen for process warnings
    process.on('warning', (warning) => {
      if (warning.name === 'MaxListenersExceededWarning') {
        console.warn('Potential memory leak: Too many event listeners');
        this.logMemoryWarning('max_listeners_exceeded', { 
          warning: warning.message 
        });
      }
    });

    // Monitor uncaught exceptions that might indicate memory issues
    process.on('uncaughtException', (error) => {
      if (error.message.includes('out of memory') || error.message.includes('heap')) {
        console.error('Memory-related uncaught exception:', error.message);
        this.logMemoryWarning('memory_exception', { 
          error: error.message,
          stack: error.stack?.substring(0, 500)
        });
      }
    });
  }

  // Simple storage for warning timestamps (in production, use Redis or similar)
  private warningTimes = new Map<string, number>();

  private getLastWarningTime(type: string): number | undefined {
    return this.warningTimes.get(type);
  }

  private setLastWarningTime(type: string, time: number): void {
    // Limit Map size to prevent unbounded growth
    const MAX_WARNING_ENTRIES = 50;
    
    if (this.warningTimes.size >= MAX_WARNING_ENTRIES) {
      // Remove oldest entry
      const oldestKey = this.warningTimes.keys().next().value;
      if (oldestKey) {
        this.warningTimes.delete(oldestKey);
      }
    }
    
    this.warningTimes.set(type, time);
  }

  /**
   * Trigger emergency memory cleanup immediately
   */
  private async triggerEmergencyCleanup(): Promise<void> {
    try {
      // Dynamic import to avoid circular dependencies
      const { checkAndHandleMemoryPressure } = await import('./memoryPressure');
      await checkAndHandleMemoryPressure();
      
      // Also force garbage collection if available
      if (global.gc) {
        global.gc();
        console.error('🧹 Forced garbage collection');
      }
      
      console.error('✅ Emergency cleanup completed');
    } catch (error) {
      console.error('❌ Emergency cleanup failed:', error);
    }
  }

  /**
   * Handle high memory usage scenarios
   */
  private handleHighMemoryUsage(): void {
    const current = this.getCurrentSnapshot();
    if (!current) return;

    const usage = (current.heapUsed / current.heapTotal) * 100;
    
    // If memory usage is above 95%, try to force garbage collection
    if (usage > 95) {
      try {
        // Force garbage collection if available (Node.js with --expose-gc flag)
        if (global && typeof global.gc === 'function') {
          global.gc();
        }
        
        // Clear old memory snapshots to free up memory
        if (this.snapshots.length > 20) {
          this.snapshots = this.snapshots.slice(-10);
        }
        
        // Clear old warning times
        const now = Date.now();
        this.warningTimes.forEach((time, key) => {
          if (now - time > 300000) { // Clear warnings older than 5 minutes
            this.warningTimes.delete(key);
          }
        });
      } catch (error) {
        console.warn('Failed to handle high memory usage:', error);
      }
    }
  }
}

// Global memory monitor instance (singleton)
let globalMemoryMonitor: MemoryMonitor | null = null;

/**
 * Get or create the global memory monitor instance (singleton pattern)
 */
function getGlobalMemoryMonitor(): MemoryMonitor {
  if (!globalMemoryMonitor) {
    globalMemoryMonitor = new MemoryMonitor();
  }
  return globalMemoryMonitor;
}

/**
 * Start global memory monitoring (singleton - prevents multiple instances)
 */
export function startMemoryMonitoring(intervalMs: number = 30000): void {
  const monitor = getGlobalMemoryMonitor();
  if (!monitor['isRunning']) {
    monitor.start(intervalMs);
  }
}

/**
 * Stop global memory monitoring
 */
export function stopMemoryMonitoring(): void {
  if (globalMemoryMonitor) {
    globalMemoryMonitor.stop();
  }
}

/**
 * Get current memory statistics
 */
export function getMemoryStats(): MemoryStats | null {
  return globalMemoryMonitor ? globalMemoryMonitor.getStats() : null;
}

/**
 * Force a memory snapshot
 */
export function takeMemorySnapshot(): void {
  if (globalMemoryMonitor) {
    globalMemoryMonitor['takeSnapshot']();
  }
}

/**
 * Monitor a specific function for memory usage
 */
export function monitorFunction<T extends (...args: any[]) => any>(
  fn: T,
  functionName?: string
): T {
  const name = functionName || fn.name || 'anonymous';
  
  return ((...args: Parameters<T>): ReturnType<T> => {
    const before = typeof process !== 'undefined' && process.memoryUsage ? 
      process.memoryUsage().heapUsed : 0;
    
    const result = fn(...args);
    
    const after = typeof process !== 'undefined' && process.memoryUsage ? 
      process.memoryUsage().heapUsed : 0;
    
    const diff = after - before;
    
    if (diff > 10 * 1024 * 1024) { // Log if function uses more than 10MB
      console.warn(`Function ${name} used ${MemoryMonitor.formatBytes(diff)} of memory`);
    }
    
    return result;
  }) as T;
}

/**
 * React hook for memory monitoring (import React in your component)
 */
export function useMemoryMonitor() {
  // Note: Import React and useState/useEffect in your component to use this hook
  if (typeof window === 'undefined') {
    return null; // Server-side, no memory stats
  }
  
  // This would be used in a React component like:
  // const [stats, setStats] = useState<MemoryStats | null>(null);
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setStats(getMemoryStats());
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, []);
  
  return null; // Placeholder - implement in component
}

/**
 * Emergency function to clear all memory snapshots
 * Used during critical memory situations
 */
export function clearAllSnapshots(): void {
  const monitor = getGlobalMemoryMonitor();
  if (monitor) {
    monitor['snapshots'] = [];
    monitor['warningTimes'] = new Map<string, number>();
    console.error('🧹 All memory snapshots cleared');
  }
}

// Auto-start removed - memory monitoring now controlled from layout.tsx only
// This prevents duplicate monitoring instances

export default MemoryMonitor;