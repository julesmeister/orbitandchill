/* eslint-disable @typescript-eslint/no-unused-vars */
import { PeriodMetrics, MetricsTrends, TrendValue } from '@/types/metrics';

export class TrendCalculator {
  static calculateTrends(current: PeriodMetrics, previous: PeriodMetrics): MetricsTrends {
    return {
      totalUsers: this.calculateTrendValue(current.totalUsers, previous.totalUsers),
      activeUsers: this.calculateTrendValue(current.activeUsers, previous.activeUsers),
      chartsGenerated: this.calculateTrendValue(current.chartsGenerated, previous.chartsGenerated),
      forumPosts: this.calculateTrendValue(current.forumPosts, previous.forumPosts),
      dailyVisitors: this.calculateTrendValue(current.dailyVisitors, previous.dailyVisitors),
      monthlyGrowth: this.calculateTrendValue(current.newUsers, previous.newUsers)
    };
  }

  private static calculateTrendValue(current: number, previous: number): TrendValue {
    const percentChange = this.calculatePercentChange(current, previous);
    
    return {
      value: percentChange,
      isPositive: current >= previous
    };
  }

  private static calculatePercentChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }
}