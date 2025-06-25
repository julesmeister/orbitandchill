/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useUserStore } from '@/store/userStore';
import { usePeopleStore } from '@/store/peopleStore';
import { db } from '@/store/database';
import { BirthData } from '@/types/user';
import { Person } from '@/types/people';
import { generateNatalChart } from '@/utils/natalChart';
// Removed Sonner import - components should handle their own toasts

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
      console.log('useNatalChart: Loading cached chart check:', {
        user: !!user,
        activePersonData,
        activePerson: activePerson?.name
      });
      
      if (user && activePersonData?.dateOfBirth && activePersonData?.timeOfBirth && activePersonData?.coordinates?.lat && activePersonData?.coordinates?.lon) {
        const personId = activePerson?.id || user.id;
        const cacheKey = `natal_chart_${personId}_${activePersonData.dateOfBirth}_${activePersonData.timeOfBirth}_${activePersonData.coordinates.lat}_${activePersonData.coordinates.lon}`;
        console.log('useNatalChart: Cache key:', cacheKey);
        
        try {
          const cached = await db.getCache<NatalChartData>(cacheKey);
          console.log('useNatalChart: Cached chart found:', !!cached);
          
          if (cached) {
            setCachedChart(cached);
          } else {
            // Clear cached chart if person changed and no cache exists
            setCachedChart(null);
            
            // Try to load from API if no local cache
            console.log('useNatalChart: No local cache, trying to load existing charts from API');
            try {
              const charts = await getUserCharts();
              console.log('useNatalChart: API charts found:', charts.length);
              
              if (charts.length > 0) {
                // Find matching chart or use the latest one
                const matchingChart = charts.find((chart: { dateOfBirth: string; timeOfBirth: string; latitude: string; longitude: string; }) => 
                  chart.dateOfBirth === activePersonData.dateOfBirth &&
                  chart.timeOfBirth === activePersonData.timeOfBirth &&
                  Math.abs(parseFloat(chart.latitude) - parseFloat(activePersonData.coordinates.lat)) < 0.001 &&
                  Math.abs(parseFloat(chart.longitude) - parseFloat(activePersonData.coordinates.lon)) < 0.001
                );
                
                const chartToLoad = matchingChart || charts[0];
                console.log('useNatalChart: Loading chart from API:', chartToLoad.id);
                
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
                
                // Cache it locally
                await db.setCache(cacheKey, chartData, 1440);
                setCachedChart(chartData);
              }
            } catch (error) {
              console.error('useNatalChart: Error loading charts from API:', error);
            }
          }
        } catch (error) {
          console.error('Error loading cached chart:', error);
        }
      } else {
        // Clear cached chart if no valid person data
        console.log('useNatalChart: Clearing cached chart - no valid person data');
        setCachedChart(null);
      }
    };
    
    loadCachedChart();
  }, [user, activePerson, activePersonData]);

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
      
      console.log('Sending chart generation request:', requestData);
      
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
      
      console.log('Chart generation API response:', result);
      
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
      const cacheKey = `natal_chart_${personId}_${dataToUse.dateOfBirth}_${dataToUse.timeOfBirth}_${dataToUse.coordinates.lat}_${dataToUse.coordinates.lon}`;
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
      setIsGenerating(false);
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
      const response = await fetch(`/api/charts/${chartId}/share`, {
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
  }, [user]);

  return {
    generateChart,
    getUserCharts,
    deleteChart,
    clearCache,
    shareChart,
    isGenerating,
    cachedChart,
  };
};