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

  const fetchSharedCharts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/charts/shared?list=true');
      const result = await response.json();
      
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
    refetch: fetchSharedCharts,
  };
};