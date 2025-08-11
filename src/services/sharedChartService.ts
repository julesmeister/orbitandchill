/* eslint-disable @typescript-eslint/no-unused-vars */
import { SharedChart, SharedChartResponse, BirthData } from '@/types/sharedChart';

export class SharedChartService {
  /**
   * Fetch shared chart by token
   */
  static async fetchSharedChart(token: string): Promise<SharedChartResponse> {
    try {
      if (!token) {
        return {
          success: false,
          error: 'Share token is required'
        };
      }

      const response = await fetch(`/api/charts/shared?shareToken=${token}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return {
            success: false,
            error: 'Chart not found'
          };
        }
        
        return {
          success: false,
          error: `Failed to fetch chart: ${response.status}`
        };
      }

      const result = await response.json();
      
      if (result.success && result.chart) {
        return {
          success: true,
          chart: result.chart
        };
      }
      
      return {
        success: false,
        error: result.error || 'Chart not available'
      };
    } catch (error) {
      console.error('Error fetching shared chart:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  /**
   * Validate share token format
   */
  static validateShareToken(token: string): boolean {
    return typeof token === 'string' && token.length > 0;
  }

  /**
   * Convert chart data to birth data format
   */
  static chartToBirthData(chart: SharedChart): BirthData {
    return {
      dateOfBirth: chart.dateOfBirth || '',
      timeOfBirth: chart.timeOfBirth || '',
      locationOfBirth: chart.locationOfBirth || '',
      coordinates: {
        lat: chart.latitude?.toString() || '',
        lon: chart.longitude?.toString() || ''
      }
    };
  }

  /**
   * Parse chart metadata safely
   */
  static parseChartMetadata(metadata: any): any | null {
    if (!metadata) return null;
    
    try {
      if (typeof metadata === 'string') {
        return JSON.parse(metadata);
      }
      return metadata;
    } catch (error) {
      console.warn('Failed to parse chart metadata:', error);
      return null;
    }
  }

  /**
   * Check if chart is expired
   */
  static isChartExpired(chart: SharedChart): boolean {
    if (!chart.expiresAt) return false;
    
    const expiryDate = new Date(chart.expiresAt);
    return expiryDate < new Date();
  }

  /**
   * Get chart display name
   */
  static getChartDisplayName(chart: SharedChart): string {
    return chart.subjectName || "Natal Chart";
  }

  /**
   * Get chart share title
   */
  static getChartShareTitle(chart: SharedChart): string {
    const name = chart.subjectName || 'Someone';
    return `${name}'s Natal Chart`;
  }

  /**
   * Validate chart data completeness
   */
  static validateChartData(chart: SharedChart): {
    isValid: boolean;
    missingFields: string[];
  } {
    const requiredFields = ['shareToken', 'chartData'];
    const missingFields = requiredFields.filter(field => !chart[field as keyof SharedChart]);
    
    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  }

  /**
   * Get chart creation info
   */
  static getChartInfo(chart: SharedChart): {
    hasMetadata: boolean;
    hasBirthData: boolean;
    isComplete: boolean;
  } {
    const hasBirthData = !!(
      chart.dateOfBirth && 
      chart.timeOfBirth && 
      chart.locationOfBirth
    );

    const hasMetadata = !!(chart.metadata);
    const isComplete = hasBirthData && hasMetadata && !!chart.chartData;

    return {
      hasMetadata,
      hasBirthData,
      isComplete
    };
  }

  /**
   * Format chart coordinates for display
   */
  static formatCoordinates(chart: SharedChart): string | null {
    if (typeof chart.latitude !== 'number' || typeof chart.longitude !== 'number') {
      return null;
    }

    const lat = chart.latitude.toFixed(4);
    const lon = chart.longitude.toFixed(4);
    const latDir = chart.latitude >= 0 ? 'N' : 'S';
    const lonDir = chart.longitude >= 0 ? 'E' : 'W';

    return `${Math.abs(parseFloat(lat))}°${latDir}, ${Math.abs(parseFloat(lon))}°${lonDir}`;
  }

  /**
   * Get chart URL
   */
  static getChartUrl(token: string, baseUrl?: string): string {
    const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
    return `${base}/chart/shared/${token}`;
  }

  /**
   * Log chart view (for analytics)
   */
  static logChartView(token: string): void {
    // Could be extended to track chart views
    console.log(`Shared chart viewed: ${token}`);
  }
}