/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { Activity, RefreshCw, Zap } from 'lucide-react';

interface MemoryStats {
  current: {
    heapUsed: number;
    heapTotal: number;
    external: number;
    rss: number;
    timestamp: string;
  };
  peak: {
    heapUsed: number;
    heapTotal: number;
    timestamp: string;
  };
  averages: {
    heapUsed: number;
    heapTotal: number;
    rss: number;
  };
  trend: 'increasing' | 'stable' | 'decreasing';
  snapshotCount: number;
  formatted: {
    currentHeapUsed: string;
    currentHeapTotal: string;
    currentRSS: string;
    peakHeapUsed: string;
    averageHeapUsed: string;
  };
}

interface MemoryMonitorProps {
  refreshInterval?: number;
}

export default function MemoryMonitor({ refreshInterval = 30000 }: MemoryMonitorProps) {
  const [stats, setStats] = useState<MemoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchMemoryStats = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch('/api/monitoring/memory');
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
        setError(null);
      } else {
        setError(result.message || 'Failed to fetch memory stats');
      }
    } catch (err) {
      setError('Error fetching memory statistics');
      console.error('Memory stats error:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const forceGarbageCollection = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch('/api/monitoring/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'gc' })
      });
      
      const result = await response.json();
      if (result.success) {
        // Refresh stats after GC
        setTimeout(fetchMemoryStats, 1000);
      } else {
        setError(result.message || 'Failed to force garbage collection');
      }
    } catch (err) {
      setError('Error forcing garbage collection');
      console.error('GC error:', err);
    }
  };

  useEffect(() => {
    fetchMemoryStats();
    
    const interval = setInterval(fetchMemoryStats, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Activity className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Memory Monitor</h3>
        </div>
        <div className="text-center text-gray-500">Loading memory statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-red-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Activity className="h-5 w-5 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">Memory Monitor</h3>
        </div>
        <div className="text-red-600 text-center">{error}</div>
        <button
          onClick={fetchMemoryStats}
          className="mt-4 w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Activity className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Memory Monitor</h3>
        </div>
        <div className="text-center text-gray-500">Memory monitoring not available</div>
      </div>
    );
  }

  const heapUsagePercent = ((stats.current.heapUsed / stats.current.heapTotal) * 100).toFixed(1);
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-red-600';
      case 'decreasing': return 'text-green-600';
      default: return 'text-blue-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return '↗️';
      case 'decreasing': return '↘️';
      default: return '➡️';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Memory Monitor</h3>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={fetchMemoryStats}
            disabled={isRefreshing}
            className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={forceGarbageCollection}
            disabled={isRefreshing}
            className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors disabled:opacity-50"
          >
            <Zap className="h-4 w-4" />
            <span>Force GC</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Current Memory Usage */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Current Usage</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Heap Used:</span>
              <span className="text-sm font-medium">{stats.formatted.currentHeapUsed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Heap Total:</span>
              <span className="text-sm font-medium">{stats.formatted.currentHeapTotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">RSS:</span>
              <span className="text-sm font-medium">{stats.formatted.currentRSS}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Usage:</span>
              <span className={`text-sm font-medium ${heapUsagePercent > '85' ? 'text-red-600' : 'text-green-600'}`}>
                {heapUsagePercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Peak Usage */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Peak Usage</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Peak Heap:</span>
              <span className="text-sm font-medium">{stats.formatted.peakHeapUsed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Time:</span>
              <span className="text-sm font-medium">
                {new Date(stats.peak.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        {/* Trends */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Trends</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Trend:</span>
              <span className={`text-sm font-medium ${getTrendColor(stats.trend)}`}>
                {getTrendIcon(stats.trend)} {stats.trend}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Avg Heap:</span>
              <span className="text-sm font-medium">{stats.formatted.averageHeapUsed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Snapshots:</span>
              <span className="text-sm font-medium">{stats.snapshotCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Memory Usage Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Heap Usage</span>
          <span>{heapUsagePercent}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              parseFloat(heapUsagePercent) > 85
                ? 'bg-red-500'
                : parseFloat(heapUsagePercent) > 70
                ? 'bg-yellow-500'
                : 'bg-green-500'
            }`}
            style={{ width: `${heapUsagePercent}%` }}
          />
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        Last updated: {new Date(stats.current.timestamp).toLocaleString()}
      </div>
    </div>
  );
}