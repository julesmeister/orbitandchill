/* eslint-disable @typescript-eslint/no-unused-vars */
import { PeriodMetrics, MetricsTrends, EnhancedStats, HistoricalDataPoint } from '@/types/metrics';

export class MetricsFallbackService {
  static getFallbackData() {
    return {
      metrics: this.getFallbackMetrics(),
      trends: this.getFallbackTrends(),
      enhancedStats: this.getFallbackEnhancedStats(),
      historicalData: this.getFallbackHistoricalData()
    };
  }

  private static getFallbackMetrics(): PeriodMetrics {
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

  private static getFallbackTrends(): MetricsTrends {
    return {
      totalUsers: { value: 0, isPositive: false },
      activeUsers: { value: 0, isPositive: false },
      chartsGenerated: { value: 0, isPositive: false },
      forumPosts: { value: 0, isPositive: false },
      dailyVisitors: { value: 0, isPositive: false },
      monthlyGrowth: { value: 0, isPositive: false }
    };
  }

  private static getFallbackEnhancedStats(): EnhancedStats {
    return {
      avgChartsPerUser: '0.0',
      peakActivityTime: 'N/A',
      topLocation: 'Unknown',
      avgSessionDuration: '0m 0s',
      totalPageViews: 0,
      conversionRate: '0%'
    };
  }

  private static getFallbackHistoricalData(): HistoricalDataPoint[] {
    return [];
  }
}