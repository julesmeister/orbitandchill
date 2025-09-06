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

  // Determine which person's data to use
  // PRIORITY: selectedPerson > defaultPerson (only if same user and is self) > user's own birthData
  const activePerson = selectedPerson || (defaultPerson?.userId === user?.id ? defaultPerson : null);
  
  // CRITICAL FIX: When viewing own chart (no selectedPerson or selectedPerson is self), 
  // prioritize fresh user birthData over potentially stale person data
  const activePersonData = (() => {
    // If selectedPerson exists and it's NOT representing the user's own data, use it
    if (selectedPerson && selectedPerson.relationship !== 'self') {
      return selectedPerson.birthData;
    }
    
    // For user's own chart (selectedPerson is null or is 'self'), prioritize user birthData
    // This ensures fresh data from forms takes precedence over stale person cache
    if (user?.birthData?.dateOfBirth && user?.birthData?.timeOfBirth && 
        user?.birthData?.coordinates?.lat && user?.birthData?.coordinates?.lon) {
      return user.birthData;
    }
    
    // Fall back to selectedPerson data if user data is incomplete
    if (selectedPerson?.birthData) {
      return selectedPerson.birthData;
    }
    
    // Final fallback to defaultPerson if it belongs to current user
    return (defaultPerson?.userId === user?.id ? defaultPerson?.birthData : null);
  })();

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
        
        // CRITICAL: Verify the cached chart belongs to the current user
        // Multiple validation layers to prevent cross-user contamination
        const chartUserId = (cached as any).userId;
        const chartName = cached.metadata?.name;
        const currentUsername = user.username;
        
        // Contamination detection rules:
        // 1. Chart has userId that doesn't match current user
        // 2. No userId but name is "Orbit Chill" (admin) and current user isn't admin
        // 3. No userId and chart name doesn't match current username (excluding shared charts)
        // 4. Chart birth data doesn't match user's birth data when it should
        const isContaminated = 
          (chartUserId && chartUserId !== user.id) ||
          (!chartUserId && chartName === 'Orbit Chill' && currentUsername !== 'Orbit Chill') ||
          (!chartUserId && chartName && currentUsername && 
           chartName !== currentUsername && 
           !chartName.includes('Shared') && 
           activePersonData && 
           !ChartCacheManager.isChartDataMatching(cached, activePersonData));
          
        if (isContaminated) {
          console.error('🚨 CRITICAL: Cached chart contamination detected!');
          console.error('🚨 Current user:', user.id, 'Username:', currentUsername);
          console.error('🚨 Chart userId:', chartUserId, 'Chart name:', chartName);
          console.error('🚨 Active birth data:', activePersonData?.dateOfBirth, activePersonData?.timeOfBirth);
          console.error('🚨 Clearing contaminated cache and all user cache...');
          
          // Clear this specific contaminated entry
          await ChartCacheManager.deleteCache(cacheKey);
          
          // Also clear ALL cache for this user to ensure complete cleanup
          await ChartCacheManager.clearUserCache(user.id);
          
          setCachedChart(null);
          setHasExistingChart(false);
          return;
        }
        
        // Additional validation: Verify birth data matches if we have it
        if (activePersonData && cached.metadata?.birthData) {
          const dataMatches = ChartCacheManager.isChartDataMatching(cached, activePersonData);
          if (!dataMatches) {
            console.warn('⚠️ Cached chart birth data mismatch, clearing cache');
            console.warn('📊 Cached birth data:', cached.metadata.birthData);
            console.warn('📊 Current birth data:', activePersonData);
            await ChartCacheManager.deleteCache(cacheKey);
            setCachedChart(null);
            setHasExistingChart(false);
            setIsLoadingCache(false); // CRITICAL: Stop loading state so chart can regenerate
            return;
          }
        }
        
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
          
          // CRITICAL DEBUG: Check if any charts don't belong to current user
          const invalidCharts = charts.filter(c => c.userId !== user.id);
          if (invalidCharts.length > 0) {
            console.error('🚨 CRITICAL: getUserCharts returned charts for different users!');
            console.error('🚨 Current user:', user.id);
            console.error('🚨 Invalid charts:', invalidCharts.map(c => ({ id: c.id, userId: c.userId, subjectName: c.subjectName })));
          }
          
          if (charts.length > 0) {
            // Find matching chart with precise coordinate matching
            const matchingChart = ChartApiService.findMatchingChart(charts, activePersonData);
            
            // CRITICAL FIX: Only use charts that actually belong to this user
            const userCharts = charts.filter(chart => chart.userId === user.id);
            
            if (userCharts.length === 0) {
              setCachedChart(null);
              setHasExistingChart(false);
              return;
            }
            
            const userMatchingChart = userCharts.find(chart => 
              chart.dateOfBirth === activePersonData.dateOfBirth &&
              chart.timeOfBirth === activePersonData.timeOfBirth &&
              Math.abs(chart.latitude - parseFloat(activePersonData.coordinates.lat)) < 0.0001 &&
              Math.abs(chart.longitude - parseFloat(activePersonData.coordinates.lon)) < 0.0001
            );
            
            const chartToLoad = userMatchingChart || userCharts[0];
            
            // Transform API chart to local format
            const chartData = ChartApiService.transformApiChartToLocal(chartToLoad);
            
            
            // CRITICAL: Store userId with chart data for validation
            (chartData as any).userId = chartToLoad.userId;
            
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
    
    // CRITICAL: Validate chart belongs to current user before caching
    if ((chartData as any).userId && (chartData as any).userId !== user.id) {
      console.error('🚨 CRITICAL: Attempting to cache chart from different user!');
      console.error('🚨 Current user:', user.id);
      console.error('🚨 Chart userId:', (chartData as any).userId);
      return; // Refuse to cache wrong user's chart
    }
    
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

  // One-time cleanup of old contaminated cache entries (with flag to prevent repeated clearing)
  useEffect(() => {
    const cleanupOldCache = async () => {
      if (user?.id) {
        // Check if we've already cleaned for this session
        const cleanupKey = `cache_cleanup_${user.id}_v2`;
        const alreadyCleaned = sessionStorage.getItem(cleanupKey);
        
        if (!alreadyCleaned) {
          // Clear all cache for this user to remove contaminated entries
          const cleared = await ChartCacheManager.clearUserCache(user.id);
          sessionStorage.setItem(cleanupKey, 'true');
        }
      }
    };
    cleanupOldCache();
  }, [user?.id]);
  
  // Load cached chart when dependencies change with debouncing
  useEffect(() => {
    // Create a unique string representation of the current birth data
    const currentDataString = activePersonData ? 
      `${activePersonData.dateOfBirth}_${activePersonData.timeOfBirth}_${activePersonData.coordinates?.lat}_${activePersonData.coordinates?.lon}` : 
      '';
    
    
    // Skip if this is the same data we just loaded AND we already have a cached chart
    // This prevents unnecessary loads but allows loading when no chart is cached
    if (currentDataString === lastLoadedDataRef.current && cachedChart) {
      return;
    }
    
    // If same data but no cached chart, we need to load
    if (currentDataString === lastLoadedDataRef.current && !cachedChart) {
    }
    
    // CRITICAL FIX: If birth data has changed, immediately clear cached chart
    // This forces fresh chart generation with new data instead of using stale cache
    if (lastLoadedDataRef.current && currentDataString !== lastLoadedDataRef.current && cachedChart) {
      setCachedChart(null);
      setHasExistingChart(false);
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
    
    // Immediate load for fastest performance
    lastLoadedDataRef.current = currentDataString;
    loadCachedChart();
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