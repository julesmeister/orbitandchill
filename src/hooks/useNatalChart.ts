/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useUserStore } from '@/store/userStore';
import { usePeopleStore } from '@/store/peopleStore';
import { db } from '@/store/database';
import { BirthData } from '@/types/user';
import { Person } from '@/types/people';
import { generateNatalChart } from '@/utils/natalChart';
// Removed Sonner import - components should handle their own toasts

// Import ChartData type for getUserCharts return type
interface ChartData {
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

interface NatalChartData {
  id: string;
  svg: string;
  metadata: {
    name?: string;
    birthData: BirthData;
    generatedAt: string;
    chartData?: import('../utils/natalChart').NatalChartData;
  };
}

export const useNatalChart = (selectedPerson?: Person | null, enableHookToasts = false) => {
  const { user } = useUserStore();
  const { defaultPerson } = usePeopleStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [cachedChart, setCachedChart] = useState<NatalChartData | null>(null);
  const [hasExistingChart, setHasExistingChart] = useState(false);
  const [isLoadingCache, setIsLoadingCache] = useState(false);

  // Determine which person's data to use
  const activePerson = selectedPerson || defaultPerson;
  
  // Memoize activePersonData to prevent infinite re-renders
  const activePersonData = useMemo(() => {
    return activePerson?.birthData || user?.birthData;
  }, [activePerson?.birthData, user?.birthData]);

  const getUserCharts = useCallback(async () => {
    if (!user) return [];
    
    try {
      const response = await fetch(`/api/charts/user/${user.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user charts');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error('Failed to fetch user charts');
      }

      return result.charts;
    } catch (error) {
      console.error('Error fetching user charts:', error);
      // Fallback to local database
      try {
        return await db.getUserCharts(user.id);
      } catch (localError) {
        console.error('Local database fallback failed:', localError);
        return [];
      }
    }
  }, [user]);

  // Load cached chart on mount if active person has complete data
  useEffect(() => {
    const loadCachedChart = async () => {
      // Only proceed if we have complete birth data
      if (!user || !activePersonData?.dateOfBirth || !activePersonData?.timeOfBirth || !activePersonData?.coordinates?.lat || !activePersonData?.coordinates?.lon) {
        // Don't clear cached chart to prevent chart loss during data transitions
        setHasExistingChart(false);
        setIsLoadingCache(false);
        return;
      }

      // Create cache key for this specific chart
      const personId = activePerson?.id || user.id;
      const normalizedLat = parseFloat(activePersonData.coordinates.lat).toFixed(4);
      const normalizedLon = parseFloat(activePersonData.coordinates.lon).toFixed(4);
      const cacheKey = `natal_chart_${personId}_${activePersonData.dateOfBirth}_${activePersonData.timeOfBirth}_${normalizedLat}_${normalizedLon}`;
      
      // Check if we already have this exact chart cached
      if (cachedChart && cachedChart.metadata?.birthData?.dateOfBirth === activePersonData.dateOfBirth && 
          cachedChart.metadata?.birthData?.timeOfBirth === activePersonData.timeOfBirth &&
          Math.abs(parseFloat(cachedChart.metadata?.birthData?.coordinates?.lat || '0') - parseFloat(activePersonData.coordinates.lat)) < 0.001) {
        // We already have the right chart cached, no need to reload
        setHasExistingChart(true);
        setIsLoadingCache(false);
        return;
      }

      setIsLoadingCache(true);
      setHasExistingChart(true); // We have complete data, so a chart should exist or can be generated
      
      try {
        // First, check local cache
        const cached = await db.getCache<NatalChartData>(cacheKey);
        
        if (cached) {
          setCachedChart(cached);
        } else {
          // Try to load from API if no local cache
          try {
            const charts = await getUserCharts();
            
            if (charts.length > 0) {
              // Find matching chart or use the latest one
              const matchingChart = charts.find((chart: { dateOfBirth: string; timeOfBirth: string; latitude: string; longitude: string; }) => 
                chart.dateOfBirth === activePersonData.dateOfBirth &&
                chart.timeOfBirth === activePersonData.timeOfBirth &&
                Math.abs(parseFloat(chart.latitude) - parseFloat(activePersonData.coordinates.lat)) < 0.001 &&
                Math.abs(parseFloat(chart.longitude) - parseFloat(activePersonData.coordinates.lon)) < 0.001
              );
              
              const chartToLoad = matchingChart || charts[0];
              
              // Transform API chart to local format
              const chartData: NatalChartData = {
                id: chartToLoad.id,
                svg: chartToLoad.chartData,
                metadata: {
                  name: chartToLoad.subjectName,
                  birthData: {
                    dateOfBirth: chartToLoad.dateOfBirth,
                    timeOfBirth: chartToLoad.timeOfBirth,
                    locationOfBirth: chartToLoad.locationOfBirth,
                    coordinates: {
                      lat: chartToLoad.latitude.toString(),
                      lon: chartToLoad.longitude.toString()
                    }
                  },
                  generatedAt: chartToLoad.createdAt,
                  chartData: chartToLoad.metadata?.chartData
                }
              };
              
              // Cache it locally for future use
              await db.setCache(cacheKey, chartData, 1440);
              setCachedChart(chartData);
            }
          } catch (error) {
            console.error('useNatalChart: Error loading charts from API:', error);
          }
        }
      } catch (error) {
        console.error('Error loading cached chart:', error);
      } finally {
        setIsLoadingCache(false);
      }
    };
    
    loadCachedChart();
  }, [user?.id, activePersonData?.dateOfBirth, activePersonData?.timeOfBirth, activePersonData?.coordinates?.lat, activePersonData?.coordinates?.lon]); // Only track essential data changes

  const generateChart = useCallback(async (formData?: {
    name: string;
    dateOfBirth: string;
    timeOfBirth: string;
    locationOfBirth: string;
    coordinates: { lat: string; lon: string };
  }, forceRegenerate: boolean = false, showToasts: boolean = enableHookToasts): Promise<NatalChartData | null> => {
    if (!user) {
      // Component should handle this error
      return null;
    }

    // Use formData if provided, otherwise use active person data
    const dataToUse = formData || (activePersonData ? {
      name: activePerson?.name || user.username || 'Natal Chart',
      dateOfBirth: activePersonData.dateOfBirth,
      timeOfBirth: activePersonData.timeOfBirth,
      locationOfBirth: activePersonData.locationOfBirth,
      coordinates: activePersonData.coordinates
    } : null);

    if (!dataToUse) {
      // Component should handle this error
      return null;
    }

    setIsGenerating(true);

    try {
      const personName = activePerson?.name || user.username || 'User';
      // Component should handle loading states

      // Call the API to generate chart
      const requestData = {
        userId: user.id,
        subjectName: dataToUse.name,
        dateOfBirth: dataToUse.dateOfBirth,
        timeOfBirth: dataToUse.timeOfBirth,
        locationOfBirth: dataToUse.locationOfBirth,
        coordinates: dataToUse.coordinates,
        chartType: 'natal',
        forceRegenerate
      };
      
      const response = await fetch('/api/charts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
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

      // Transform API response to match expected format
      const chartData: NatalChartData = {
        id: result.chart.id,
        svg: result.chart.chartData,
        metadata: {
          name: result.chart.subjectName,
          birthData: {
            dateOfBirth: result.chart.dateOfBirth,
            timeOfBirth: result.chart.timeOfBirth,
            locationOfBirth: result.chart.locationOfBirth,
            coordinates: {
              lat: result.chart.latitude.toString(),
              lon: result.chart.longitude.toString()
            }
          },
          generatedAt: result.chart.createdAt,
          chartData: result.chart.metadata?.chartData
        }
      };

      // Cache the result locally for 24 hours
      const personId = activePerson?.id || user.id;
      // Normalize coordinates to match cache key generation in loadCachedChart
      const normalizedLat = parseFloat(dataToUse.coordinates.lat).toFixed(4);
      const normalizedLon = parseFloat(dataToUse.coordinates.lon).toFixed(4);
      const cacheKey = `natal_chart_${personId}_${dataToUse.dateOfBirth}_${dataToUse.timeOfBirth}_${normalizedLat}_${normalizedLon}`;
      await db.setCache(cacheKey, chartData, 1440);

      setCachedChart(chartData);
      
      if (result.cached) {
        // Component should handle cache info
      } else {
        // Component should handle success
      }
      
      return chartData;

    } catch (error) {
      console.error('Error generating natal chart:', error);
      // Component should handle errors
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [user, activePerson, activePersonData, enableHookToasts]);

  const clearCache = useCallback(async () => {
    setCachedChart(null);
    if (user) {
      // Clear all cached charts for this user
      const charts = await db.getUserCharts(user.id);
      for (const chart of charts) {
        const cacheKey = `natal_chart_${user.id}_${chart.id}`;
        await db.cache.delete(cacheKey);
      }
    }
  }, [user]);

  const deleteChart = useCallback(async (chartId: string) => {
    if (!user) {
      // Component should handle user not found error
      return false;
    }

    try {
      // Call API to delete chart
      const response = await fetch(`/api/charts/${chartId}?userId=${user.id}`, {
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

      // Also delete from local database for consistency
      await db.deleteChart(chartId);
      
      // Clear from cache if it's the current chart
      if (cachedChart?.id === chartId) {
        setCachedChart(null);
      }
      
      // Component should handle success
      return true;
    } catch (error) {
      console.error('Error deleting chart:', error);
      // Component should handle deletion errors
      return false;
    }
  }, [user, cachedChart]);

  const shareChart = useCallback(async (chartId: string) => {
    if (!user) {
      // Component should handle user not found error
      return null;
    }

    try {
      // First, try to get the most recent chart ID from the database
      // This ensures we're always sharing the latest chart, not a cached one
      const userCharts = await getUserCharts();
      
      const latestChart = userCharts.find((chart: ChartData) => 
        activePersonData &&
        chart.dateOfBirth === activePersonData.dateOfBirth &&
        chart.timeOfBirth === activePersonData.timeOfBirth &&
        Math.abs(chart.latitude - parseFloat(activePersonData.coordinates.lat)) < 0.001 &&
        Math.abs(chart.longitude - parseFloat(activePersonData.coordinates.lon)) < 0.001
      );
      
      let actualChartId = latestChart?.id || chartId;
      console.log('Sharing chart - requested ID:', chartId, 'actual ID:', actualChartId);
      console.log('Latest chart found:', latestChart ? { id: latestChart.id, dateOfBirth: latestChart.dateOfBirth } : 'none');
      console.log('Active person data:', activePersonData);
      
      if (!latestChart && userCharts.length > 0) {
        console.log('No matching chart found, using most recent chart instead');
        const mostRecentChart = userCharts[0]; // getUserCharts returns charts sorted by createdAt desc
        console.log('Using most recent chart:', { id: mostRecentChart.id, dateOfBirth: mostRecentChart.dateOfBirth });
        actualChartId = mostRecentChart.id;
      }
      
      const response = await fetch(`/api/charts/${actualChartId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate share link');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error('Share link generation failed');
      }

      // Component should handle success
      return result.shareUrl;
    } catch (error) {
      console.error('Error generating share link:', error);
      // Component should handle share errors
      return null;
    }
  }, [user, activePersonData, getUserCharts]);

  return {
    generateChart,
    getUserCharts,
    deleteChart,
    clearCache,
    shareChart,
    isGenerating,
    cachedChart,
    hasExistingChart,
    isLoadingCache,
  };
};