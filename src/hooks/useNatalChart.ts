/* eslint-disable @typescript-eslint/no-unused-vars */
import { usePeopleStore } from '@/store/peopleStore';
import { Person } from '@/types/people';
import { useChartCache } from './useChartCache';
import { useChartOperations } from './useChartOperations';

export const useNatalChart = (selectedPerson?: Person | null, enableHookToasts = false) => {
  const { defaultPerson } = usePeopleStore();

  // Determine which person's data to use
  const activePerson = selectedPerson || defaultPerson;
  
  // Use the chart cache hook for caching operations
  const {
    cachedChart,
    hasExistingChart,
    isLoadingCache,
    activePersonData,
    clearCache,
    cacheChart,
    removeCachedChart,
  } = useChartCache(activePerson);

  // Use the chart operations hook for API operations
  const {
    isGenerating,
    generateChart,
    getUserCharts,
    deleteChart,
    shareChart,
  } = useChartOperations(
    activePerson,
    activePersonData,
    cacheChart,
    removeCachedChart
  );

  // Export all the functionality with a clean interface
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