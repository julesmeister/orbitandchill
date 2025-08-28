/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect, useCallback, useRef } from 'react';

interface MemorySnapshot {
  timestamp: Date;
  heapUsed: number;
  heapTotal: number;
  external: number;
  rss: number;
  heapPercentage: number;
}

interface PerformanceMetrics {
  domNodes: number;
  jsEventListeners: number;
  documents: number;
  frames: number;
}

interface MemoryAnalysis {
  trend: 'increasing' | 'stable' | 'decreasing';
  averageUsage: number;
  peakUsage: number;
  growthRate: number; // bytes per minute
  isLeaking: boolean;
  recommendation: string;
}

interface UseMemoryMonitorOptions {
  interval: number; // milliseconds between snapshots
  maxSnapshots: number; // maximum snapshots to keep
  autoCleanup: boolean; // automatically trigger cleanup when high usage
  thresholds: {
    warning: number; // percentage
    critical: number; // percentage
    emergency: number; // percentage
  };
}

interface UseMemoryMonitorReturn {
  snapshots: MemorySnapshot[];
  currentSnapshot: MemorySnapshot | null;
  performanceMetrics: PerformanceMetrics | null;
  analysis: MemoryAnalysis | null;
  isMonitoring: boolean;
  isHighUsage: boolean;
  isCriticalUsage: boolean;
  
  // Actions
  startMonitoring: () => void;
  stopMonitoring: () => void;
  takeSnapshot: () => Promise<void>;
  clearSnapshots: () => void;
  forceGarbageCollection: () => void;
  exportData: () => string;
  triggerMemoryCleanup: () => Promise<void>;
}

const DEFAULT_OPTIONS: UseMemoryMonitorOptions = {
  interval: 5000, // 5 seconds
  maxSnapshots: 100,
  autoCleanup: false,
  thresholds: {
    warning: 70,
    critical: 85,
    emergency: 95,
  },
};

/**
 * Advanced memory monitoring hook for development and admin use
 * Provides real-time memory tracking, leak detection, and cleanup capabilities
 */
export function useMemoryMonitor(options: Partial<UseMemoryMonitorOptions> = {}): UseMemoryMonitorReturn {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  const [snapshots, setSnapshots] = useState<MemorySnapshot[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastCleanupRef = useRef<Date>(new Date());

  // Get current memory snapshot (client-side estimation)
  const getClientMemorySnapshot = useCallback((): MemorySnapshot | null => {
    if (typeof window === 'undefined') return null;

    // Use Performance API if available (Chrome/Edge)
    if ('memory' in performance && (performance as any).memory) {
      const memory = (performance as any).memory;
      const heapUsed = memory.usedJSHeapSize;
      const heapTotal = memory.totalJSHeapSize;
      const heapLimit = memory.jsHeapSizeLimit;

      return {
        timestamp: new Date(),
        heapUsed,
        heapTotal,
        external: 0, // Not available in browser
        rss: 0, // Not available in browser
        heapPercentage: (heapUsed / heapLimit) * 100,
      };
    }

    // Fallback: estimate based on DOM complexity
    const domNodes = document.querySelectorAll('*').length;
    const estimatedHeapUsed = domNodes * 100; // Rough estimation
    const estimatedHeapTotal = estimatedHeapUsed * 1.5;

    return {
      timestamp: new Date(),
      heapUsed: estimatedHeapUsed,
      heapTotal: estimatedHeapTotal,
      external: 0,
      rss: 0,
      heapPercentage: (estimatedHeapUsed / estimatedHeapTotal) * 100,
    };
  }, []);

  // Get server-side memory snapshot via API
  const getServerMemorySnapshot = useCallback(async (): Promise<MemorySnapshot | null> => {
    try {
      const response = await fetch('/api/monitoring/memory');
      if (!response.ok) return null;
      
      const data = await response.json();
      return {
        timestamp: new Date(data.timestamp),
        heapUsed: data.heapUsed,
        heapTotal: data.heapTotal,
        external: data.external,
        rss: data.rss,
        heapPercentage: (data.heapUsed / data.heapTotal) * 100,
      };
    } catch (error) {
      console.warn('Failed to get server memory snapshot:', error);
      return null;
    }
  }, []);

  // Get performance metrics (client-side)
  const getPerformanceMetrics = useCallback((): PerformanceMetrics | null => {
    if (typeof window === 'undefined') return null;

    try {
      return {
        domNodes: document.querySelectorAll('*').length,
        jsEventListeners: (window as any).getEventListeners 
          ? Object.keys((window as any).getEventListeners(document)).length 
          : 0,
        documents: 1, // Always at least 1 document
        frames: window.frames.length,
      };
    } catch (error) {
      console.warn('Failed to get performance metrics:', error);
      return null;
    }
  }, []);

  // Take a memory snapshot
  const takeSnapshot = useCallback(async () => {
    // Try server-side snapshot first, fallback to client-side
    let snapshot = await getServerMemorySnapshot();
    if (!snapshot) {
      snapshot = getClientMemorySnapshot();
    }

    if (!snapshot) return;

    setSnapshots(prev => {
      const newSnapshots = [...prev, snapshot!];
      // Keep only the most recent snapshots
      return newSnapshots.slice(-mergedOptions.maxSnapshots);
    });

    // Update performance metrics
    setPerformanceMetrics(getPerformanceMetrics());

    // Auto cleanup if enabled and usage is high
    if (mergedOptions.autoCleanup && 
        snapshot.heapPercentage > mergedOptions.thresholds.critical) {
      const timeSinceLastCleanup = Date.now() - lastCleanupRef.current.getTime();
      if (timeSinceLastCleanup > 60000) { // Only cleanup once per minute
        await triggerMemoryCleanup();
        lastCleanupRef.current = new Date();
      }
    }
  }, [getServerMemorySnapshot, getClientMemorySnapshot, getPerformanceMetrics, mergedOptions]);

  // Analyze memory trends
  const analyzeMemoryTrends = useCallback((snapshots: MemorySnapshot[]): MemoryAnalysis | null => {
    if (snapshots.length < 3) return null;

    const recent = snapshots.slice(-10); // Last 10 snapshots
    const heapUsages = recent.map(s => s.heapUsed);
    const timestamps = recent.map(s => s.timestamp.getTime());

    // Calculate trend
    const firstUsage = heapUsages[0];
    const lastUsage = heapUsages[heapUsages.length - 1];
    const totalTime = timestamps[timestamps.length - 1] - timestamps[0];
    const growthRate = ((lastUsage - firstUsage) / totalTime) * 60000; // bytes per minute

    let trend: 'increasing' | 'stable' | 'decreasing';
    if (Math.abs(growthRate) < 1000) { // Less than 1KB/min change
      trend = 'stable';
    } else if (growthRate > 0) {
      trend = 'increasing';
    } else {
      trend = 'decreasing';
    }

    const averageUsage = heapUsages.reduce((a, b) => a + b, 0) / heapUsages.length;
    const peakUsage = Math.max(...heapUsages);

    // Detect potential memory leak
    const isLeaking = trend === 'increasing' && growthRate > 10000; // Growing >10KB/min

    // Generate recommendation
    let recommendation = '';
    if (isLeaking) {
      recommendation = 'Potential memory leak detected. Check for unclosed resources, event listeners, or growing arrays.';
    } else if (trend === 'increasing') {
      recommendation = 'Memory usage is increasing. Monitor for potential leaks.';
    } else if (averageUsage > 100 * 1024 * 1024) { // >100MB
      recommendation = 'High memory usage detected. Consider optimizing data structures or clearing caches.';
    } else {
      recommendation = 'Memory usage appears normal.';
    }

    return {
      trend,
      averageUsage,
      peakUsage,
      growthRate,
      isLeaking,
      recommendation,
    };
  }, []);

  // Start monitoring
  const startMonitoring = useCallback(() => {
    if (intervalRef.current) return; // Already monitoring

    setIsMonitoring(true);
    
    // Take initial snapshot
    takeSnapshot();

    // Set up interval
    intervalRef.current = setInterval(takeSnapshot, mergedOptions.interval);
  }, [takeSnapshot, mergedOptions.interval]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsMonitoring(false);
  }, []);

  // Clear all snapshots
  const clearSnapshots = useCallback(() => {
    setSnapshots([]);
    setPerformanceMetrics(null);
  }, []);

  // Force garbage collection (if available)
  const forceGarbageCollection = useCallback(() => {
    if (typeof window !== 'undefined' && (window as any).gc) {
      try {
        (window as any).gc();
        console.log('🗑️ Forced garbage collection');
      } catch (error) {
        console.warn('Failed to force garbage collection:', error);
      }
    } else {
      console.warn('Garbage collection not available. Run Chrome with --expose-gc flag.');
    }
  }, []);

  // Export monitoring data
  const exportData = useCallback((): string => {
    const data = {
      snapshots,
      performanceMetrics,
      analysis: analyzeMemoryTrends(snapshots),
      exportedAt: new Date().toISOString(),
      options: mergedOptions,
    };

    return JSON.stringify(data, null, 2);
  }, [snapshots, performanceMetrics, analyzeMemoryTrends, mergedOptions]);

  // Trigger memory cleanup
  const triggerMemoryCleanup = useCallback(async () => {
    console.log('🧹 Triggering memory cleanup...');
    
    try {
      // Client-side cleanup
      if (typeof window !== 'undefined') {
        // Force garbage collection if available
        if ((window as any).gc) {
          (window as any).gc();
        }

        // Clear caches
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map(name => caches.delete(name)));
        }
      }

      // Server-side cleanup via API
      try {
        const response = await fetch('/api/monitoring/memory/cleanup', { 
          method: 'POST' 
        });
        if (response.ok) {
          console.log('✅ Server-side cleanup triggered');
        }
      } catch (error) {
        console.warn('Failed to trigger server-side cleanup:', error);
      }

    } catch (error) {
      console.error('Memory cleanup failed:', error);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Computed values
  const currentSnapshot = snapshots[snapshots.length - 1] || null;
  const analysis = analyzeMemoryTrends(snapshots);
  const isHighUsage = currentSnapshot ? 
    currentSnapshot.heapPercentage > mergedOptions.thresholds.warning : false;
  const isCriticalUsage = currentSnapshot ? 
    currentSnapshot.heapPercentage > mergedOptions.thresholds.critical : false;

  return {
    snapshots,
    currentSnapshot,
    performanceMetrics,
    analysis,
    isMonitoring,
    isHighUsage,
    isCriticalUsage,
    
    // Actions
    startMonitoring,
    stopMonitoring,
    takeSnapshot,
    clearSnapshots,
    forceGarbageCollection,
    exportData,
    triggerMemoryCleanup,
  };
}

/**
 * Lightweight memory monitoring hook for production use
 */
export function useLightMemoryMonitor() {
  const [currentUsage, setCurrentUsage] = useState<number | null>(null);
  const [isHigh, setIsHigh] = useState(false);

  const checkMemory = useCallback(() => {
    if (typeof window !== 'undefined' && (performance as any).memory) {
      const memory = (performance as any).memory;
      const percentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      setCurrentUsage(percentage);
      setIsHigh(percentage > 80);
    }
  }, []);

  useEffect(() => {
    checkMemory();
    const interval = setInterval(checkMemory, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [checkMemory]);

  return {
    currentUsage,
    isHigh,
    checkMemory,
  };
}