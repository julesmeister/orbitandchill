/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useCallback, useMemo } from "react";
import { useUserStore } from "@/store/userStore";
import { useChartCache } from "@/hooks/useChartCache";
import { useChartOperations } from "@/hooks/useChartOperations";
import { getAvatarByIdentifier } from "@/utils/avatarUtils";

interface StatusToast {
  title: string;
  message: string;
  status: 'success' | 'error' | 'info' | 'loading';
  isVisible: boolean;
  duration?: number;
}

/**
 * Core chart hook - handles essential chart state and operations
 * Split from the monolithic useChartPage for better performance
 */
export function useChartCore(initialData?: any) {
  const { user } = useUserStore();
  const [statusToast, setStatusToast] = useState<StatusToast>({
    title: '',
    message: '',
    status: 'info',
    isVisible: false,
  });

  // Chart data management
  const {
    cachedChart,
    isLoadingCache,
    hasExistingChart: hasCachedChart,
  } = useChartCache();

  // Chart operations
  const {
    isGenerating,
    generateChart,
  } = useChartOperations();

  // Current person and birth data (memoized for performance)
  const personToShow = useMemo(() => {
    if (!cachedChart?.metadata?.name) return null;
    return { name: cachedChart.metadata.name };
  }, [cachedChart?.metadata?.name]);

  const birthDataToShow = useMemo(() => {
    return user?.birthData || null;
  }, [user?.birthData]);

  // Chart subject avatar (memoized)
  const chartSubjectAvatar = useMemo(() => {
    const subjectName = cachedChart?.metadata?.name || personToShow?.name || "Unknown";
    return user?.preferredAvatar || user?.profilePictureUrl || getAvatarByIdentifier(subjectName);
  }, [cachedChart?.metadata?.name, personToShow?.name, user?.preferredAvatar, user?.profilePictureUrl]);

  // Loading state
  const isLoading = useMemo(() => {
    return isLoadingCache || isGenerating;
  }, [isLoadingCache, isGenerating]);

  // Event handlers (useCallback for performance)
  const handlePersonChange = useCallback((person: any) => {
    // Handle person change logic
    console.log('Person changed:', person);
  }, []);

  const handleRegenerateChart = useCallback(async () => {
    try {
      setStatusToast({
        title: 'Regenerating Chart',
        message: 'Creating new chart with latest data...',
        status: 'info',
        isVisible: true,
      });

      // Use generateChart with forceRegenerate = true
      await generateChart(undefined, true);

      setStatusToast({
        title: 'Chart Updated',
        message: 'Your chart has been successfully regenerated!',
        status: 'success',
        isVisible: true,
        duration: 3000,
      });
    } catch (error) {
      setStatusToast({
        title: 'Regeneration Failed',
        message: 'Unable to regenerate chart. Please try again.',
        status: 'error',
        isVisible: true,
        duration: 5000,
      });
    }
  }, [generateChart]);

  const hideStatus = useCallback(() => {
    setStatusToast(prev => ({ ...prev, isVisible: false }));
  }, []);

  return {
    // Chart data
    cachedChart,
    personToShow,
    birthDataToShow,
    chartSubjectAvatar,
    
    // Loading states
    isLoading,
    isGenerating,
    
    // UI state
    statusToast,
    
    // Actions
    handlePersonChange,
    handleRegenerateChart,
    hideStatus,
  };
}