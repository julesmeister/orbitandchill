/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { SharedChart } from '../types/people';

interface UseSharedChartsReturn {
  sharedCharts: SharedChart[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useSharedCharts = (): UseSharedChartsReturn => {
  const [sharedCharts, setSharedCharts] = useState<SharedChart[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  const fetchSharedCharts = async (forceRefresh: boolean = false) => {
    // Don't refetch if we already have data and it's less than 5 minutes old
    const now = Date.now();
    if (!forceRefresh && sharedCharts.length > 0 && (now - lastFetchTime) < 300000) {
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/charts/shared?list=true');
      const result = await response.json();
      
      // Debug log to see what shared charts are returned
      console.log('=== SHARED CHARTS API DEBUG ===');
      console.log('API response:', result);
      console.log('Charts returned:', result.charts);
      result.charts?.forEach((chart: any, index: number) => {
        console.log(`Chart ${index + 1}:`, {
          id: chart.id,
          subjectName: chart.subjectName,
          dateOfBirth: chart.dateOfBirth,
          timeOfBirth: chart.timeOfBirth,
          locationOfBirth: chart.locationOfBirth,
          shareToken: chart.shareToken,
          createdAt: chart.createdAt
        });
      });
      console.log('===============================');
      
      if (result.success && result.charts) {
        // Convert chart data to SharedChart format
        const convertedCharts: SharedChart[] = result.charts.map((chart: any) => ({
          id: chart.id,
          shareToken: chart.shareToken,
          title: chart.title,
          subjectName: chart.subjectName,
          dateOfBirth: chart.dateOfBirth,
          timeOfBirth: chart.timeOfBirth,
          locationOfBirth: chart.locationOfBirth,
          latitude: chart.latitude,
          longitude: chart.longitude,
          chartData: chart.chartData,
          createdAt: chart.createdAt,
          metadata: chart.metadata,
        }));
        
        setSharedCharts(convertedCharts);
        setLastFetchTime(now);
      } else {
        setError(result.error || 'Failed to fetch shared charts');
      }
    } catch (err) {
      console.error('Error fetching shared charts:', err);
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSharedCharts();
  }, []);

  return {
    sharedCharts,
    isLoading,
    error,
    refetch: () => fetchSharedCharts(true),
  };
};