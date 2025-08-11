/* eslint-disable @typescript-eslint/no-unused-vars */
import { MetricsService } from './metricsService';
import { TrendCalculator } from './trendCalculator';
import { HistoricalDataService } from './historicalDataService';
import { EnhancedStatsService } from './enhancedStatsService';
import { MetricsCache } from './metricsCache';
import { MetricsResponse, HistoricalPeriod } from '@/types/metrics';

export class MetricsAggregator {
  static async getCompleteMetrics(period?: string | null): Promise<MetricsResponse> {
    try {
      // Check cache first
      const cachedData = MetricsCache.getCachedData();
      if (cachedData && !period) {
        console.log('📊 Using cached metrics data');
        return {
          success: true,
          metrics: cachedData.metrics,
          trends: cachedData.trends,
          enhancedStats: cachedData.enhancedStats,
          historicalData: null,
          lastUpdated: new Date(cachedData.timestamp).toISOString()
        };
      }

      console.log('📊 Fetching fresh metrics data...');

      // Fetch all data in parallel for better performance
      const [currentPeriodData, previousPeriodData, enhancedStats] = await Promise.allSettled([
        MetricsService.getCurrentPeriodMetrics(),
        MetricsService.getPreviousPeriodMetrics(),
        EnhancedStatsService.getEnhancedStats()
      ]);

      // Handle any failed promises
      const metrics = currentPeriodData.status === 'fulfilled' 
        ? currentPeriodData.value 
        : MetricsService.getEmptyMetrics();

      const previousMetrics = previousPeriodData.status === 'fulfilled' 
        ? previousPeriodData.value 
        : MetricsService.getEmptyMetrics();

      const stats = enhancedStats.status === 'fulfilled' 
        ? enhancedStats.value 
        : EnhancedStatsService.getFallbackStats();

      // Calculate trends
      const trends = TrendCalculator.calculateTrends(metrics, previousMetrics);

      // Get historical data if requested
      let historicalData = null;
      if (period) {
        // Check cache for historical data first
        const cachedHistorical = MetricsCache.getCachedHistoricalData(period);
        if (cachedHistorical) {
          console.log(`📊 Using cached historical data for ${period}`);
          historicalData = cachedHistorical;
        } else {
          console.log(`📊 Fetching fresh historical data for ${period}`);
          historicalData = await HistoricalDataService.getHistoricalData(period as HistoricalPeriod);
          MetricsCache.setCachedHistoricalData(period, historicalData);
        }
      }

      // Cache the results (except historical data which is cached separately)
      MetricsCache.setCacheData({
        metrics,
        trends,
        enhancedStats: stats
      });

      return {
        success: true,
        metrics,
        trends,
        enhancedStats: stats,
        historicalData,
        lastUpdated: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error in MetricsAggregator:', error);
      throw error;
    }
  }

  static clearCache() {
    MetricsCache.clearCache();
  }
}