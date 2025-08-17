/* eslint-disable @typescript-eslint/no-unused-vars */
import { BirthData } from './user';

/**
 * Local chart data structure used throughout the application
 */
export interface NatalChartData {
  id: string;
  svg: string;
  metadata: {
    name?: string;
    birthData: BirthData;
    generatedAt: string;
    chartData?: import('../utils/natalChart').NatalChartData;
  };
}

/**
 * API chart data structure returned from the backend
 */
export interface ChartData {
  id: string;
  userId: string;
  subjectName: string;
  dateOfBirth: string;
  timeOfBirth: string;
  locationOfBirth: string;
  latitude: number;
  longitude: number;
  chartType: string;
  title?: string;
  description?: string;
  theme?: string;
  isPublic?: boolean;
  shareToken?: string;
  chartData: string;
  metadata: any;
  createdAt: string;
  updatedAt: string;
}

/**
 * Chart generation request structure
 */
export interface GenerateChartRequest {
  userId: string;
  subjectName: string;
  dateOfBirth: string;
  timeOfBirth: string;
  locationOfBirth: string;
  coordinates: { lat: string; lon: string };
  chartType: string;
  forceRegenerate?: boolean;
}

/**
 * Chart generation response structure
 */
export interface GenerateChartResponse {
  success: boolean;
  chart?: ChartData;
  cached?: boolean;
  error?: string;
}

/**
 * Parameters for generating a chart
 */
export interface GenerateChartParams {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  locationOfBirth: string;
  coordinates: { lat: string; lon: string };
}

/**
 * Chart sharing response
 */
export interface ShareChartResponse {
  success: boolean;
  shareUrl?: string;
  error?: string;
}

/**
 * Chart deletion response
 */
export interface DeleteChartResponse {
  success: boolean;
  error?: string;
}

/**
 * Cache entry structure
 */
export interface CacheEntry<T = any> {
  key: string;
  data: T;
  expiry: number;
}