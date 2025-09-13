/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useCallback, useMemo } from "react";
import { useUserStore } from "@/store/userStore";
import { useNatalChart } from "@/hooks/useNatalChart";
import { getAvatarByIdentifier } from "@/utils/avatarUtils";

interface StatusToast {
  title: string;
  message: string;
  status: 'success' | 'error' | 'info' | 'loading';
  isVisible: boolean;
  duration?: number;
}

/**
 * Core chart hook - simplified to use API-only approach
 * No more caching complexity - always fresh data from Supabase
 */
export function useChartCore(initialData?: any) {
  const { user } = useUserStore();
  const [statusToast, setStatusToast] = useState<StatusToast>({
    title: '',
    message: '',
    status: 'info',
    isVisible: false,
  });

  // Unified chart operations - API-only, no cache
  const {
    cachedChart,
    isLoadingCache,
    isGenerating,
    generateChart,
    hasExistingChart,
  } = useNatalChart();

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