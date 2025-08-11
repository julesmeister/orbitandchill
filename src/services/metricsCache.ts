/* eslint-disable @typescript-eslint/no-unused-vars */
import { PeriodMetrics, MetricsTrends, EnhancedStats, HistoricalDataPoint } from '@/types/metrics';

interface CachedMetricsData {
  metrics: PeriodMetrics;
  trends: MetricsTrends;
  enhancedStats: EnhancedStats;
  historicalData: Record<string, HistoricalDataPoint[]>;
  timestamp: number;
}

export class MetricsCache {
  private static cache: CachedMetricsData | null = null;
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static isCacheValid(): boolean {
    if (!this.cache) return false;
    return Date.now() - this.cache.timestamp < this.CACHE_DURATION;
  }

  static getCachedData() {
    return this.isCacheValid() ? this.cache : null;
  }

  static setCacheData(data: Partial<CachedMetricsData>) {
    this.cache = {
      metrics: data.metrics || this.getEmptyMetrics(),
      trends: data.trends || this.getEmptyTrends(),
      enhancedStats: data.enhancedStats || this.getEmptyEnhancedStats(),
      historicalData: data.historicalData || {},
      timestamp: Date.now()
    };
  }

  static getCachedHistoricalData(period: string): HistoricalDataPoint[] | null {
    if (!this.isCacheValid() || !this.cache) return null;
    return this.cache.historicalData[period] || null;
  }

  static setCachedHistoricalData(period: string, data: HistoricalDataPoint[]) {
    if (!this.cache) return;
    this.cache.historicalData[period] = data;
  }

  static clearCache() {
    this.cache = null;
  }

  private static getEmptyMetrics(): PeriodMetrics {
    return {
      totalUsers: 0,
      newUsers: 0,
      activeUsers: 0,
      chartsGenerated: 0,
      forumPosts: 0,
      newPosts: 0,
      dailyVisitors: 0,
      pageViews: 0
    };
  }

  private static getEmptyTrends(): MetricsTrends {
    return {
      totalUsers: { value: 0, isPositive: false },
      activeUsers: { value: 0, isPositive: false },
      chartsGenerated: { value: 0, isPositive: false },
      forumPosts: { value: 0, isPositive: false },
      dailyVisitors: { value: 0, isPositive: false },
      monthlyGrowth: { value: 0, isPositive: false }
    };
  }

  private static getEmptyEnhancedStats(): EnhancedStats {
    return {
      avgChartsPerUser: '0.0',
      peakActivityTime: 'N/A',
      topLocation: 'Unknown',
      avgSessionDuration: '0m 0s',
      totalPageViews: 0,
      conversionRate: '0%'
    };
  }
}