/* eslint-disable @typescript-eslint/no-unused-vars */
import { BirthData } from '@/types/user';
import { 
  NatalChartData, 
  ChartData, 
  GenerateChartRequest, 
  GenerateChartResponse 
} from '@/types/chart';

/**
 * API service for chart operations
 */
export class ChartApiService {
  /**
   * Generate a new chart via API
   */
  static async generateChart(request: GenerateChartRequest): Promise<GenerateChartResponse> {
    try {
      
      const response = await fetch('/api/charts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        console.error('API response not ok:', response.status, response.statusText);
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          console.error('Failed to parse error response as JSON:', e);
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        throw new Error(errorData.error || 'Failed to generate chart');
      }

      let result;
      try {
        result = await response.json();
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        const responseText = await response.text();
        console.error('Response text:', responseText);
        throw new Error('Invalid response format from server');
      }
      
      if (!result.success || !result.chart) {
        console.error('Chart generation failed. Response:', result);
        throw new Error(`Chart generation failed - no chart data returned. Success: ${result.success}, Chart: ${!!result.chart}`);
      }

      return result;
    } catch (error) {
      console.error('Error in generateChart API call:', error);
      throw error;
    }
  }

  /**
   * Get all charts for a user
   */
  static async getUserCharts(userId: string): Promise<ChartData[]> {
    try {
      // No timeout - let the database query complete naturally
      const response = await fetch(`/api/charts/user/${userId}`, {
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user charts');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error('Failed to fetch user charts');
      }

      const charts = result.charts || [];
      return charts;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Delete a chart
   */
  static async deleteChart(chartId: string, userId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/charts/${chartId}?userId=${userId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete chart');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error('Chart deletion failed');
      }

      return true;
    } catch (error) {
      console.error('Error deleting chart:', error);
      return false;
    }
  }

  /**
   * Generate share link for a chart
   */
  static async shareChart(chartId: string, userId: string): Promise<string | null> {
    try {
      const response = await fetch(`/api/charts/${chartId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate share link');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error('Share link generation failed');
      }

      return result.shareUrl;
    } catch (error) {
      console.error('Error generating share link:', error);
      return null;
    }
  }

  /**
   * Transform API chart data to local format
   */
  static transformApiChartToLocal(apiChart: ChartData): NatalChartData {
    // Log what timezone data is available
    console.log('🔄 Transforming API chart, timezone data:', {
      hasMetadata: !!apiChart.metadata,
      hasTimeZone: !!apiChart.metadata?.timeZone,
      timeZone: apiChart.metadata?.timeZone,
      hasUtcOffset: apiChart.metadata?.utcOffset !== undefined,
      utcOffset: apiChart.metadata?.utcOffset
    });

    const transformed: any = {
      id: apiChart.id,
      svg: apiChart.chartData,
      metadata: {
        name: apiChart.subjectName,
        birthData: {
          dateOfBirth: apiChart.dateOfBirth,
          timeOfBirth: apiChart.timeOfBirth,
          locationOfBirth: apiChart.locationOfBirth,
          coordinates: {
            lat: apiChart.latitude.toString(),
            lon: apiChart.longitude.toString()
          }
        },
        generatedAt: apiChart.createdAt,
        chartData: apiChart.metadata?.chartData,
        // CRITICAL: Extract timezone data from API metadata
        timeZone: apiChart.metadata?.timeZone,
        utcOffset: apiChart.metadata?.utcOffset
      }
    };

    // CRITICAL: Preserve userId for validation
    transformed.userId = apiChart.userId;

    return transformed as NatalChartData;
  }

  /**
   * Find matching chart in a list based on birth data
   */
  static findMatchingChart(
    charts: ChartData[], 
    birthData: BirthData
  ): ChartData | undefined {
    return charts.find(chart => 
      chart.dateOfBirth === birthData.dateOfBirth &&
      chart.timeOfBirth === birthData.timeOfBirth &&
      Math.abs(chart.latitude - parseFloat(birthData.coordinates.lat)) < 0.0001 &&
      Math.abs(chart.longitude - parseFloat(birthData.coordinates.lon)) < 0.0001
    );
  }
}