/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback } from 'react';

interface ErrorToastState {
  isVisible: boolean;
  title: string;
  message: string;
}

interface UseErrorToastReturn {
  errorToast: ErrorToastState;
  showError: (title: string, message: string) => void;
  hideError: () => void;
  clearErrorIfVisible: () => void;
}

export function useErrorToast(): UseErrorToastReturn {
  const [errorToast, setErrorToast] = useState<ErrorToastState>({
    isVisible: false,
    title: '',
    message: ''
  });

  const showError = useCallback((title: string, message: string) => {
    setErrorToast({
      isVisible: true,
      title,
      message
    });
  }, []);

  const hideError = useCallback(() => {
    setErrorToast({
      isVisible: false,
      title: '',
      message: ''
    });
  }, []);

  const clearErrorIfVisible = useCallback(() => {
    setErrorToast(prev => {
      if (prev.isVisible) {
        return {
          isVisible: false,
          title: '',
          message: ''
        };
      }
      return prev;
    });
  }, []);

  return {
    errorToast,
    showError,
    hideError,
    clearErrorIfVisible
  };
}