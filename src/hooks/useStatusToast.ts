/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback } from 'react';

interface StatusToastState {
  isVisible: boolean;
  title: string;
  message: string;
  status: 'loading' | 'success' | 'error' | 'info';
  showProgress: boolean;
  progress: number;
  duration: number;
}

export function useStatusToast() {
  const [toast, setToast] = useState<StatusToastState>({
    isVisible: false,
    title: '',
    message: '',
    status: 'info',
    showProgress: false,
    progress: 0,
    duration: 0
  });

  const showStatus = useCallback(({
    title,
    message,
    status,
    showProgress = false,
    progress = 0,
    duration = 0
  }: {
    title: string;
    message: string;
    status: 'loading' | 'success' | 'error' | 'info';
    showProgress?: boolean;
    progress?: number;
    duration?: number;
  }) => {
    setToast({
      isVisible: true,
      title,
      message,
      status,
      showProgress,
      progress,
      duration
    });
  }, []);

  const updateProgress = useCallback((progress: number, message?: string) => {
    setToast(prev => ({
      ...prev,
      progress,
      ...(message && { message })
    }));
  }, []);

  const hideStatus = useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }));
  }, []);

  // Convenience methods for common status types
  const showLoading = useCallback((title: string, message: string, showProgress = false) => {
    showStatus({ title, message, status: 'loading', showProgress });
  }, [showStatus]);

  const showSuccess = useCallback((title: string, message: string, duration = 4000) => {
    showStatus({ title, message, status: 'success', duration });
  }, [showStatus]);

  const showError = useCallback((title: string, message: string, duration = 6000) => {
    showStatus({ title, message, status: 'error', duration });
  }, [showStatus]);

  const showInfo = useCallback((title: string, message: string, duration = 3000) => {
    showStatus({ title, message, status: 'info', duration });
  }, [showStatus]);

  return {
    toast,
    showStatus,
    showLoading,
    showSuccess,
    showError,
    showInfo,
    updateProgress,
    hideStatus
  };
}