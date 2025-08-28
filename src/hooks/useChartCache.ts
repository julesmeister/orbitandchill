/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback, useEffect, useRef } from 'react';
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
  
  // Use a ref to track the last loaded birth data to prevent unnecessary reloads
  const lastLoadedDataRef = useRef<string>('');
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      setCachedChart(null);
      return;
    }

    // Generate secure cache key
    const cacheKey = generateCacheKey(user.id, activePerson?.id || null, activePersonData);
    
    setIsLoadingCache(true);
    setHasExistingChart(true);
    
    try {
      // First, check local cache
      const cached = await ChartCacheManager.getCache(cacheKey);
      
      if (cached) {
        // Check if this is actually different from what we already have
        setCachedChart(prevChart => {
          if (ChartCacheManager.isChartDataMatching(prevChart, activePersonData)) {
            return prevChart; // Keep existing if it matches
          }
          return cached; // Update with new cached data
        });
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
          } else {
            // No charts found, clear cached chart
            setCachedChart(null);
            setHasExistingChart(false);
          }
        } catch (error) {
          console.error('useChartCache: Error loading charts from API:', error);
          setCachedChart(null);
          setHasExistingChart(false);
        }
      }
    } catch (error) {
      console.error('Error loading cached chart:', error);
      setCachedChart(null);
      setHasExistingChart(false);
    } finally {
      setIsLoadingCache(false);
    }
  }, [user?.id, activePerson?.id, activePersonData]);

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

  // Load cached chart when dependencies change with debouncing
  useEffect(() => {
    // Create a unique string representation of the current birth data
    const currentDataString = activePersonData ? 
      `${activePersonData.dateOfBirth}_${activePersonData.timeOfBirth}_${activePersonData.coordinates?.lat}_${activePersonData.coordinates?.lon}` : 
      '';
    
    // Skip if this is the same data we just loaded
    if (currentDataString === lastLoadedDataRef.current) {
      return;
    }
    
    // Clear any pending load
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
    
    // If we don't have complete data, clear immediately
    if (!activePersonData?.dateOfBirth || !activePersonData?.timeOfBirth || 
        !activePersonData?.coordinates?.lat || !activePersonData?.coordinates?.lon) {
      setHasExistingChart(false);
      setIsLoadingCache(false);
      setCachedChart(null);
      lastLoadedDataRef.current = '';
      return;
    }
    
    // Debounce the load to prevent rapid reloads when typing
    loadTimeoutRef.current = setTimeout(() => {
      lastLoadedDataRef.current = currentDataString;
      loadCachedChart();
    }, 200); // Reduced to 200ms for faster response
    
    // Cleanup timeout on unmount or when dependencies change
    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, [activePersonData, loadCachedChart]);

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