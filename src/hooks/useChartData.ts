import { useEffect, useState } from 'react';
import { useAdminStore } from '@/store/adminStore';

export interface ChartDataPoint {
  date: string;
  users: number;
  charts: number;
}

export interface UseChartDataOptions {
  /**
   * External data to use instead of fetching
   */
  data?: ChartDataPoint[];
  /**
   * Whether the parent component is loading
   */
  isLoading?: boolean;
  /**
   * Auto-fetch data on mount and period change
   */
  autoFetch?: boolean;
  /**
   * Initial time period
   */
  initialPeriod?: 'daily' | 'monthly' | 'yearly';
}

export interface UseChartDataReturn {
  chartData: ChartDataPoint[];
  timePeriod: 'daily' | 'monthly' | 'yearly';
  setTimePeriod: (period: 'daily' | 'monthly' | 'yearly') => void;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useChartData({
  data,
  isLoading: externalLoading = false,
  autoFetch = true,
  initialPeriod = 'daily'
}: UseChartDataOptions = {}): UseChartDataReturn {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [timePeriod, setTimePeriod] = useState<'daily' | 'monthly' | 'yearly'>(initialPeriod);
  const [historicalLoading, setHistoricalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Access admin store for auth token
  const { authToken } = useAdminStore();

  const fetchHistoricalData = async () => {
    // If external data is provided, use it directly
    if (data && data.length > 0) {
      setChartData(data);
      return;
    }

    if (!autoFetch) {
      return;
    }

    setHistoricalLoading(true);
    setError(null);

    try {
      // Fetching historical growth data

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }

      // Fetch historical data from enhanced metrics API with period parameter
      const response = await fetch(`/api/admin/enhanced-metrics?period=${timePeriod}`, { headers });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();

      if (responseData.success && responseData.historicalData && Array.isArray(responseData.historicalData)) {
        // Historical data fetched successfully
        setChartData(responseData.historicalData);
        setError(null);
      } else {
        console.error('❌ API response structure:', {
          success: responseData.success,
          hasHistoricalData: !!responseData.historicalData,
          isArray: Array.isArray(responseData.historicalData),
          dataKeys: Object.keys(responseData)
        });
        throw new Error(`API returned invalid data structure: ${responseData.error || 'historicalData missing or invalid'}`);
      }
    } catch (fetchError) {
      console.error('❌ Failed to fetch historical growth data:', fetchError);
      const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown error occurred';
      setError(errorMessage);
      
      // Show empty data instead of mock data - force user to see the error
      setChartData([]);
    } finally {
      setHistoricalLoading(false);
    }
  };

  // Auto-fetch data when dependencies change
  useEffect(() => {
    fetchHistoricalData();
  }, [data, timePeriod, authToken, autoFetch]);

  return {
    chartData,
    timePeriod,
    setTimePeriod,
    isLoading: externalLoading || historicalLoading,
    error,
    refetch: fetchHistoricalData
  };
}