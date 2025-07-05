/* eslint-disable @typescript-eslint/no-unused-vars */
import { TrafficData } from '@/store/admin/types';

export type TimeRange = 'Last 24 hours' | 'Last 7 days' | 'Last 30 days';

/**
 * Filters traffic data based on the specified time range
 */
export function getFilteredTrafficData(trafficData: TrafficData[], timeRange: TimeRange): TrafficData[] {
  const now = new Date();
  let daysBack = 30;
  
  switch (timeRange) {
    case 'Last 7 days':
      daysBack = 7;
      break;
    case 'Last 24 hours':
      daysBack = 1;
      break;
    default:
      daysBack = 30;
  }
  
  const cutoffDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
  return trafficData.filter(day => new Date(day.date) >= cutoffDate);
}

/**
 * Calculates daily visitors from filtered traffic data
 */
export function getDailyVisitors(trafficData: TrafficData[]): number {
  return trafficData.length > 0 ? 
    trafficData[trafficData.length - 1]?.visitors || 0 : 0;
}

/**
 * Calculates total page views from filtered traffic data
 */
export function getTotalPageViews(trafficData: TrafficData[]): number {
  return trafficData.reduce((sum, d) => sum + (d.pageViews || 0), 0);
}

/**
 * Calculates total charts generated from filtered traffic data
 */
export function getTotalChartsFromTraffic(trafficData: TrafficData[]): number {
  return trafficData.reduce((sum, d) => sum + (d.chartsGenerated || 0), 0);
}