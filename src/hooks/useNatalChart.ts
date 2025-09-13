/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { usePeopleAPI } from '@/hooks/usePeopleAPI';
import { Person } from '@/types/people';
import { BirthData } from '@/types/user';
import { NatalChartData, ChartData, GenerateChartRequest, GenerateChartParams } from '@/types/chart';
import { ChartApiService } from '@/services/chartApiService';

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

    // If coordinates are empty strings but we have a location, try to geocode
    if (dataToUse && (!dataToUse.coordinates?.lat || !dataToUse.coordinates?.lon ||
        dataToUse.coordinates.lat === '' || dataToUse.coordinates.lon === '') &&
        dataToUse.locationOfBirth) {

      console.log('🔍 Attempting to geocode location:', dataToUse.locationOfBirth);

      try {
        // Simple geocoding for Philippines location
        if (dataToUse.locationOfBirth.toLowerCase().includes('zamboanga')) {
          // Zamboanga del Sur approximate coordinates
          dataToUse = {
            ...dataToUse,
            coordinates: {
              lat: '7.3389',
              lon: '122.0621'
            }
          };
          console.log('✅ Applied Zamboanga coordinates:', dataToUse.coordinates);
        }
      } catch (error) {
        console.warn('Failed to geocode location:', error);
      }
    }

    if (!dataToUse || !dataToUse.dateOfBirth || !dataToUse.timeOfBirth ||
        !dataToUse.coordinates?.lat || !dataToUse.coordinates?.lon ||
        dataToUse.coordinates.lat === '' || dataToUse.coordinates.lon === '') {
      console.error('generateChart: Invalid or incomplete birth data', dataToUse);
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

      console.log('🚀 API-only chart generation:', {
        userId: requestData.userId,
        subjectName: requestData.subjectName,
        forceRegenerate: requestData.forceRegenerate
      });

      const result = await ChartApiService.generateChart(requestData);

      if (!result.chart) {
        throw new Error('No chart data returned from API');
      }

      // Transform API response to local format
      const chartData = ChartApiService.transformApiChartToLocal(result.chart);

      // Immediately set the current chart
      setCurrentChart(chartData);

      console.log('✅ Chart generated and set successfully:', {
        chartId: chartData.id,
        hasData: !!chartData
      });

      return chartData;

    } catch (error: any) {
      console.error('❌ Chart generation failed:', error);
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
        console.log('🚫 Skipping cached charts - generating fresh from API only');
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