/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { usePeopleAPI } from '@/hooks/usePeopleAPI';
import { Person } from '@/types/people';
import { BirthData } from '@/types/user';
import { NatalChartData, ChartData, GenerateChartRequest, GenerateChartParams } from '@/types/chart';
import { ChartApiService } from '@/services/chartApiService';
import { getValidCoordinates, areCoordinatesValid } from '@/utils/geocoding';

/**
 * Simplified chart hook that works directly with Supabase API
 * No caching - always fresh data from the source of truth
 */
export const useNatalChart = (selectedPerson?: Person | null) => {
  const { user } = useUserStore();
  const { defaultPerson } = usePeopleAPI();

  // State for the current chart and loading
  const [currentChart, setCurrentChart] = useState<NatalChartData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingChart, setIsLoadingChart] = useState(false);

  // Determine which person's data to use
  const activePerson = selectedPerson || defaultPerson;

  // Get active person's birth data
  const activePersonData = (() => {
    // If selectedPerson exists and it's NOT representing the user's own data, use it
    if (selectedPerson && selectedPerson.relationship !== 'self') {
      return selectedPerson.birthData;
    }

    // For user's own chart, prioritize user birthData for freshness
    if (user?.birthData?.dateOfBirth && user?.birthData?.timeOfBirth &&
        user?.birthData?.coordinates?.lat && user?.birthData?.coordinates?.lon) {
      return user.birthData;
    }

    // Fall back to selectedPerson data if user data is incomplete
    if (selectedPerson?.birthData) {
      return selectedPerson.birthData;
    }

    // Final fallback to defaultPerson
    return (defaultPerson?.userId === user?.id ? defaultPerson?.birthData : null);
  })();

  /**
   * Generate a new chart directly via API
   */
  const generateChart = useCallback(async (
    formData?: GenerateChartParams,
    forceRegenerate: boolean = false
  ): Promise<NatalChartData | null> => {
    if (isGenerating && !forceRegenerate) {
      console.log('generateChart: Already generating, skipping duplicate request');
      return null;
    }

    // Ensure we have a user
    let currentUser = user;
    if (!currentUser?.id) {
      const userStore = useUserStore.getState();
      await userStore.ensureAnonymousUser();
      currentUser = userStore.user;

      if (!currentUser?.id) {
        console.error('generateChart: Failed to create anonymous user');
        return null;
      }
    }

    // Use formData if provided, otherwise use active person data
    let dataToUse = formData || (activePersonData ? {
      name: ((activePerson as any)?.name || currentUser?.username || 'Natal Chart') as string,
      dateOfBirth: activePersonData.dateOfBirth,
      timeOfBirth: activePersonData.timeOfBirth,
      locationOfBirth: activePersonData.locationOfBirth,
      coordinates: activePersonData.coordinates
    } : null);

    // If coordinates are invalid or empty, try to geocode the location
    if (dataToUse && !areCoordinatesValid(dataToUse.coordinates) && dataToUse.locationOfBirth) {
      try {
        const geocodedCoordinates = await getValidCoordinates(
          dataToUse.locationOfBirth,
          dataToUse.coordinates
        );

        if (geocodedCoordinates) {
          dataToUse = {
            ...dataToUse,
            coordinates: geocodedCoordinates
          };
        }
      } catch (error) {
        console.error('Failed to geocode location:', error);
      }
    }

    // Final validation after geocoding attempt
    if (!dataToUse || !dataToUse.dateOfBirth || !dataToUse.timeOfBirth || !areCoordinatesValid(dataToUse.coordinates)) {
      console.error('generateChart: Invalid or incomplete birth data after geocoding attempt', {
        hasData: !!dataToUse,
        dateOfBirth: dataToUse?.dateOfBirth,
        timeOfBirth: dataToUse?.timeOfBirth,
        coordinates: dataToUse?.coordinates,
        locationOfBirth: dataToUse?.locationOfBirth
      });
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

      const result = await ChartApiService.generateChart(requestData);

      if (!result.chart) {
        throw new Error('No chart data returned from API');
      }

      // Transform API response to local format
      const chartData = ChartApiService.transformApiChartToLocal(result.chart);

      // Immediately set the current chart
      setCurrentChart(chartData);

      return chartData;

    } catch (error: any) {
      console.error('Chart generation failed:', error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [user?.id, activePerson?.name, user?.username, activePersonData, isGenerating]);

  /**
   * Load existing charts for the user
   */
  const getUserCharts = useCallback(async (): Promise<ChartData[]> => {
    if (!user?.id) return [];

    setIsLoadingChart(true);
    try {
      const charts = await ChartApiService.getUserCharts(user.id);
      const userCharts = charts.filter(chart => chart.userId === user.id);

      // Load existing charts and check if they have celestial points
      if (userCharts.length > 0 && !currentChart) {
        // Try to find a matching chart if we have person data
        let chartToDisplay = null;

        if (activePersonData) {
          chartToDisplay = ChartApiService.findMatchingChart(userCharts, activePersonData);
        }

        // If no matching chart found, use the most recent chart
        if (!chartToDisplay) {
          chartToDisplay = userCharts[0]; // Charts are ordered by createdAt desc
        }

        // SKIP CACHED CHARTS - Always generate fresh from API as requested
      }

      return userCharts;
    } catch (error) {
      console.error('Error fetching user charts:', error);
      return [];
    } finally {
      setIsLoadingChart(false);
    }
  }, [user?.id, currentChart, activePersonData]);

  /**
   * Delete a chart
   */
  const deleteChart = useCallback(async (chartId: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const success = await ChartApiService.deleteChart(chartId, user.id);

      if (success && currentChart?.id === chartId) {
        setCurrentChart(null);
      }

      return success;
    } catch (error) {
      console.error('Error deleting chart:', error);
      return false;
    }
  }, [user?.id, currentChart?.id]);

  /**
   * Generate share link for a chart
   */
  const shareChart = useCallback(async (chartId: string): Promise<string | null> => {
    if (!user?.id) return null;

    try {
      const userCharts = await getUserCharts();
      const latestChart = activePersonData ?
        ChartApiService.findMatchingChart(userCharts, activePersonData) :
        null;

      const actualChartId = latestChart?.id || chartId || currentChart?.id;

      if (!actualChartId) return null;

      return await ChartApiService.shareChart(actualChartId, user.id);
    } catch (error) {
      console.error('Error generating share link:', error);
      return null;
    }
  }, [user?.id, activePersonData, getUserCharts, currentChart?.id]);

  /**
   * Clear current chart (for person switching)
   */
  const clearChart = useCallback(() => {
    setCurrentChart(null);
  }, []);

  // Load chart when user or person data changes
  useEffect(() => {
    if (user?.id && activePersonData?.dateOfBirth) {
      getUserCharts();
    }
  }, [user?.id, activePersonData?.dateOfBirth, getUserCharts]);

  return {
    // Chart data
    cachedChart: currentChart, // Keep same interface name for compatibility

    // Loading states
    isGenerating,
    isLoadingCache: isLoadingChart, // Keep same interface name for compatibility
    hasExistingChart: !!currentChart,

    // Operations
    generateChart,
    getUserCharts,
    deleteChart,
    shareChart,
    clearCache: clearChart, // Keep same interface name for compatibility
  };
};