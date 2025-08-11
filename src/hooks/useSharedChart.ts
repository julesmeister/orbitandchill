/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback } from 'react';
import { SharedChart, SharedChartUIState, LoadingState, ShareResult } from '@/types/sharedChart';
import { SharedChartService } from '@/services/sharedChartService';
import { SharingService } from '@/services/sharingService';
import { useStatusToast } from './useStatusToast';

export interface UseSharedChartOptions {
  token: string;
  initialChart?: SharedChart | any | null;
}

export interface UseSharedChartReturn {
  // State
  chart: SharedChart | null;
  loadingState: LoadingState;
  error: string | null;
  
  // Computed values
  isLoading: boolean;
  isError: boolean;
  isNotFound: boolean;
  isSuccess: boolean;
  
  // Actions
  loadChart: () => Promise<void>;
  shareChart: () => Promise<void>;
  
  // Toast integration
  toast: ReturnType<typeof useStatusToast>['toast'];
  showSuccess: ReturnType<typeof useStatusToast>['showSuccess'];
  hideStatus: ReturnType<typeof useStatusToast>['hideStatus'];
}

export function useSharedChart({ token, initialChart }: UseSharedChartOptions): UseSharedChartReturn {
  // Convert initialChart to SharedChart format or null
  const convertedInitialChart = initialChart ? (initialChart as SharedChart) : null;
  
  const [uiState, setUIState] = useState<SharedChartUIState>({
    chart: convertedInitialChart,
    loadingState: convertedInitialChart ? 'success' : 'idle',
    error: null
  });

  const { toast, showSuccess, hideStatus } = useStatusToast();

  // Load chart from API
  const loadChart = useCallback(async () => {
    if (!token || convertedInitialChart) return;

    setUIState(prev => ({
      ...prev,
      loadingState: 'loading',
      error: null
    }));

    try {
      const result = await SharedChartService.fetchSharedChart(token);
      
      if (result.success && result.chart) {
        setUIState(prev => ({
          ...prev,
          chart: result.chart!,
          loadingState: 'success',
          error: null
        }));

        // Log chart view for analytics
        SharedChartService.logChartView(token);
      } else {
        const isNotFound = result.error === 'Chart not found';
        setUIState(prev => ({
          ...prev,
          loadingState: isNotFound ? 'not-found' : 'error',
          error: result.error || 'Failed to load chart'
        }));
      }
    } catch (error) {
      console.error('Error loading shared chart:', error);
      setUIState(prev => ({
        ...prev,
        loadingState: 'error',
        error: error instanceof Error ? error.message : 'Network error'
      }));
    }
  }, [token, convertedInitialChart]);

  // Share chart
  const shareChart = useCallback(async () => {
    if (!uiState.chart) return;

    try {
      const result = await SharingService.shareChart(uiState.chart, token);
      
      if (result.success) {
        const toastConfig = SharingService.formatShareSuccessMessage(result);
        showSuccess(toastConfig.title, toastConfig.message, toastConfig.duration);
        
        // Track sharing event
        SharingService.trackSharingEvent(result.method);
      }
    } catch (error) {
      console.error('Error sharing chart:', error);
      showSuccess('Share Error', 'Could not share chart. Please try again.', 3000);
    }
  }, [uiState.chart, token, showSuccess]);

  // Load chart on mount
  useEffect(() => {
    if (uiState.loadingState === 'idle') {
      loadChart();
    }
  }, [loadChart, uiState.loadingState]);

  // Computed values
  const isLoading = uiState.loadingState === 'loading';
  const isError = uiState.loadingState === 'error';
  const isNotFound = uiState.loadingState === 'not-found';
  const isSuccess = uiState.loadingState === 'success';

  return {
    // State
    chart: uiState.chart,
    loadingState: uiState.loadingState,
    error: uiState.error,
    
    // Computed values
    isLoading,
    isError,
    isNotFound,
    isSuccess,
    
    // Actions
    loadChart,
    shareChart,
    
    // Toast integration
    toast,
    showSuccess,
    hideStatus
  };
}