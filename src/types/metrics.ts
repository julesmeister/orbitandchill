/* eslint-disable @typescript-eslint/no-unused-vars */

export interface PeriodMetrics {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  chartsGenerated: number;
  forumPosts: number;
  newPosts: number;
  dailyVisitors: number;
  pageViews: number;
}

export interface TrendValue {
  value: number;
  isPositive: boolean;
}

export interface MetricsTrends {
  totalUsers: TrendValue;
  activeUsers: TrendValue;
  chartsGenerated: TrendValue;
  forumPosts: TrendValue;
  dailyVisitors: TrendValue;
  monthlyGrowth: TrendValue;
}

export interface EnhancedStats {
  avgChartsPerUser: string;
  peakActivityTime: string;
  topLocation: string;
  avgSessionDuration: string;
  totalPageViews: number;
  conversionRate: string;
}

export interface HistoricalDataPoint {
  date: string;
  users: number;
  charts: number;
}

export interface MetricsResponse {
  success: boolean;
  metrics: PeriodMetrics;
  trends: MetricsTrends;
  enhancedStats: EnhancedStats;
  historicalData: HistoricalDataPoint[] | null;
  lastUpdated: string;
}

export interface UserMetrics {
  totalUsers: number;
  newThisMonth: number;
  activeUsers: number;
  usersWithCharts: number;
}

export interface ChartMetrics {
  total: number;
  thisMonth: number;
}

export type HistoricalPeriod = 'daily' | 'monthly' | 'yearly';