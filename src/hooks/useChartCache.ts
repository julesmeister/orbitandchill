/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { usePeopleStore } from '@/store/peopleStore';
import { BirthData } from '@/types/user';
import { Person } from '@/types/people';
import { NatalChartData } from '@/types/chart';
import { ChartCacheManager, generateCacheKey } from '@/utils/chartCache';
import { ChartApiService } from '@/services/chartApiService';

/**
 * Hook for managing chart caching and loading operations
 */
export const useChartCache = (selectedPerson?: Person | null) => {
  const { user } = useUserStore();
  const { defaultPerson } = usePeopleStore();
  
  const [cachedChart, setCachedChart] = useState<NatalChartData | null>(null);
  const [hasExistingChart, setHasExistingChart] = useState(false);
  const [isLoadingCache, setIsLoadingCache] = useState(false);

  // Determine which person's data to use
  const activePerson = selectedPerson || defaultPerson;
  const activePersonData = activePerson?.birthData || user?.birthData;

  /**
   * Load cached chart or fetch from API
   */
  const loadCachedChart = useCallback(async () => {
    // Only proceed if we have complete birth data and user
    if (!user?.id || !activePersonData?.dateOfBirth || !activePersonData?.timeOfBirth || 
        !activePersonData?.coordinates?.lat || !activePersonData?.coordinates?.lon) {
      setHasExistingChart(false);
      setIsLoadingCache(false);
      return;
    }

    // Generate secure cache key
    const cacheKey = generateCacheKey(user.id, activePerson?.id || null, activePersonData);
    
    // Check if we already have this exact chart cached
    if (ChartCacheManager.isChartDataMatching(cachedChart, activePersonData)) {
      setHasExistingChart(true);
      setIsLoadingCache(false);
      return;
    }

    setIsLoadingCache(true);
    setHasExistingChart(true);
    
    try {
      // First, check local cache
      const cached = await ChartCacheManager.getCache(cacheKey);
      
      if (cached) {
        setCachedChart(cached);
      } else {
        // Try to load from API if no local cache
        try {
          const charts = await ChartApiService.getUserCharts(user.id);
          
          if (charts.length > 0) {
            // Find matching chart with precise coordinate matching
            const matchingChart = ChartApiService.findMatchingChart(charts, activePersonData);
            const chartToLoad = matchingChart || charts[0];
            
            // Transform API chart to local format
            const chartData = ChartApiService.transformApiChartToLocal(chartToLoad);
            
            // Cache it locally with the new key structure
            await ChartCacheManager.setCache(cacheKey, chartData, 1440);
            setCachedChart(chartData);
          }
        } catch (error) {
          console.error('useChartCache: Error loading charts from API:', error);
        }
      }
    } catch (error) {
      console.error('Error loading cached chart:', error);
    } finally {
      setIsLoadingCache(false);
    }
  }, [user?.id, activePerson?.id, activePersonData, cachedChart]);

  /**
   * Clear all cache for current user
   */
  const clearCache = useCallback(async () => {
    setCachedChart(null);
    if (user?.id) {
      await ChartCacheManager.clearUserCache(user.id);
    }
  }, [user?.id]);

  /**
   * Cache a new chart
   */
  const cacheChart = useCallback(async (chartData: NatalChartData, birthData: BirthData) => {
    if (!user?.id) return;
    
    const cacheKey = generateCacheKey(user.id, activePerson?.id || null, birthData);
    await ChartCacheManager.setCache(cacheKey, chartData, 1440);
    setCachedChart(chartData);
  }, [user?.id, activePerson?.id]);

  /**
   * Remove cached chart and related cache entries
   */
  const removeCachedChart = useCallback(async (chartId: string) => {
    if (cachedChart?.id === chartId) {
      setCachedChart(null);
      
      // Also clear related cache entries
      if (cachedChart.metadata?.birthData && user?.id) {
        const cacheKey = generateCacheKey(
          user.id, 
          activePerson?.id || null, 
          cachedChart.metadata.birthData
        );
        await ChartCacheManager.deleteCache(cacheKey);
      }
    }
  }, [cachedChart, user?.id, activePerson?.id]);

  // Load cached chart when dependencies change
  useEffect(() => {
    loadCachedChart();
  }, [loadCachedChart]);

  return {
    cachedChart,
    hasExistingChart,
    isLoadingCache,
    activePersonData,
    loadCachedChart,
    clearCache,
    cacheChart,
    removeCachedChart,
  };
};