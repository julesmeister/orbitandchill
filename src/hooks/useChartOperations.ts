/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback } from 'react';
import { useUserStore } from '@/store/userStore';
import { BirthData } from '@/types/user';
import { Person } from '@/types/people';
import { 
  NatalChartData, 
  ChartData,
  GenerateChartRequest, 
  GenerateChartParams 
} from '@/types/chart';
import { ChartApiService } from '@/services/chartApiService';
import { db } from '@/store/database';

/**
 * Hook for chart generation and manipulation operations
 */
export const useChartOperations = (
  activePerson?: Person | null,
  activePersonData?: BirthData | null,
  onChartCached?: (chartData: NatalChartData, birthData: BirthData) => Promise<void>,
  onChartRemoved?: (chartId: string) => Promise<void>
) => {
  const { user } = useUserStore();
  const [isGenerating, setIsGenerating] = useState(false);

  /**
   * Generate a new chart
   */
  const generateChart = useCallback(async (
    formData?: GenerateChartParams,
    forceRegenerate: boolean = false
  ): Promise<NatalChartData | null> => {
    // Prevent concurrent generations unless force regenerating
    if (isGenerating && !forceRegenerate) {
      console.log('generateChart: Already generating, skipping duplicate request');
      return null;
    }

    // Ensure we have a user (create anonymous if needed)
    let currentUser = user;
    if (!currentUser?.id) {
      console.log('generateChart: No user found, ensuring anonymous user...');
      
      // Try to ensure anonymous user
      const userStore = useUserStore.getState();
      await userStore.ensureAnonymousUser();
      currentUser = userStore.user;
      
      // Check again after ensuring
      if (!currentUser?.id) {
        console.error('generateChart: Failed to create anonymous user');
        return null;
      }
    }

    // Use formData if provided, otherwise use active person data
    const dataToUse = formData || (activePersonData ? {
      name: (formData?.name || (activePerson as any)?.name || currentUser?.username || 'Natal Chart') as string,
      dateOfBirth: activePersonData.dateOfBirth,
      timeOfBirth: activePersonData.timeOfBirth,
      locationOfBirth: activePersonData.locationOfBirth,
      coordinates: activePersonData.coordinates
    } : null);

    if (!dataToUse) {
      console.error('generateChart: No birth data available');
      return null;
    }

    // Validate birth data completeness
    if (!dataToUse.dateOfBirth || !dataToUse.timeOfBirth || 
        !dataToUse.coordinates?.lat || !dataToUse.coordinates?.lon) {
      console.error('generateChart: Incomplete birth data', dataToUse);
      return null;
    }

    setIsGenerating(true);

    try {
      // Prepare API request
      const requestData: GenerateChartRequest = {
        userId: currentUser.id,
        subjectName: dataToUse.name,
        dateOfBirth: dataToUse.dateOfBirth,
        timeOfBirth: dataToUse.timeOfBirth,
        locationOfBirth: dataToUse.locationOfBirth,
        coordinates: dataToUse.coordinates,
        chartType: 'natal',
        forceRegenerate
      };
      
      // Call API to generate chart
      const result = await ChartApiService.generateChart(requestData);
      
      if (!result.chart) {
        throw new Error('No chart data returned from API');
      }

      // Transform API response to local format
      const chartData = ChartApiService.transformApiChartToLocal(result.chart);

      // Cache the result
      const birthDataForCache: BirthData = {
        dateOfBirth: dataToUse.dateOfBirth,
        timeOfBirth: dataToUse.timeOfBirth,
        locationOfBirth: dataToUse.locationOfBirth,
        coordinates: dataToUse.coordinates
      };
      
      if (onChartCached) {
        await onChartCached(chartData, birthDataForCache);
      }
      
      return chartData;

    } catch (error) {
      console.error('Error generating natal chart:', error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [user?.id, activePerson?.name, user?.username, activePersonData, onChartCached, isGenerating]);

  /**
   * Get all charts for current user
   */
  const getUserCharts = useCallback(async (): Promise<ChartData[]> => {
    if (!user?.id) return [];
    
    try {
      const charts = await ChartApiService.getUserCharts(user.id);
      console.log('useChartOperations.getUserCharts: Loading charts for userId:', user.id);
      console.log('useChartOperations.getUserCharts: API returned charts:', charts.map(c => ({ id: c.id, userId: c.userId, subjectName: c.subjectName })));
      
      // CRITICAL FIX: Filter to only return charts that belong to this user
      const userCharts = charts.filter(chart => chart.userId === user.id);
      console.log('useChartOperations.getUserCharts: Filtered user charts:', userCharts.map(c => ({ id: c.id, userId: c.userId, subjectName: c.subjectName })));
      
      return userCharts;
    } catch (error) {
      console.error('Error fetching user charts:', error);
      // Fallback to local database
      try {
        const localCharts = await db.getUserCharts(user.id);
        // Note: Local database returns NatalChartStorage which doesn't have all ChartData fields
        // Return empty array to force API usage
        console.warn('Local database fallback has limited data - returning empty array to force API usage');
        return [];
      } catch (localError) {
        console.error('Local database fallback failed:', localError);
        return [];
      }
    }
  }, [user?.id]);

  /**
   * Delete a chart
   */
  const deleteChart = useCallback(async (chartId: string): Promise<boolean> => {
    if (!user?.id) {
      console.error('deleteChart: User not found or invalid user ID');
      return false;
    }

    try {
      // Call API to delete chart
      const success = await ChartApiService.deleteChart(chartId, user.id);
      
      if (success) {
        // Also delete from local database for consistency
        await db.deleteChart(chartId);
        
        // Remove from cache
        if (onChartRemoved) {
          await onChartRemoved(chartId);
        }
      }
      
      return success;
    } catch (error) {
      console.error('Error deleting chart:', error);
      return false;
    }
  }, [user?.id, onChartRemoved]);

  /**
   * Generate share link for a chart
   */
  const shareChart = useCallback(async (chartId: string): Promise<string | null> => {
    if (!user?.id) {
      console.error('shareChart: User not found or invalid user ID');
      return null;
    }

    try {
      // Get the most recent chart ID to ensure we're sharing the right one
      const userCharts = await getUserCharts();
      
      const latestChart = activePersonData ? 
        ChartApiService.findMatchingChart(userCharts, activePersonData) : 
        null;
      
      let actualChartId = latestChart?.id || chartId;
      
      if (!latestChart && userCharts.length > 0) {
        // Fallback to most recent chart
        actualChartId = userCharts[0].id;
      }
      
      return await ChartApiService.shareChart(actualChartId, user.id);
    } catch (error) {
      console.error('Error generating share link:', error);
      return null;
    }
  }, [user?.id, activePersonData, getUserCharts]);

  return {
    isGenerating,
    generateChart,
    getUserCharts,
    deleteChart,
    shareChart,
  };
};