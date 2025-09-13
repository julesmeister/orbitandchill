/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from 'react';

export const useToastNotifications = () => {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastTitle, setToastTitle] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastStatus, setToastStatus] = useState<'loading' | 'success' | 'error' | 'info'>('info');

  const showToast = (title: string, message: string, status: 'loading' | 'success' | 'error' | 'info') => {
    setToastTitle(title);
    setToastMessage(message);
    setToastStatus(status);
    setToastVisible(true);
  };

  const hideToast = () => {
    setToastVisible(false);
  };

  const showLoadingToast = (title: string, message: string) => {
    showToast(title, message, 'loading');
  };

  const showSuccessToast = (title: string, message: string, autoHide = true) => {
    showToast(title, message, 'success');
    if (autoHide) {
      setTimeout(() => hideToast(), 3000);
    }
  };

  const showErrorToast = (title: string, message: string) => {
    showToast(title, message, 'error');
  };

  const showInfoToast = (title: string, message: string) => {
    showToast(title, message, 'info');
  };

  return {
    // State
    toastVisible,
    toastTitle,
    toastMessage,
    toastStatus,
    
    // Actions
    showToast,
    hideToast,
    showLoadingToast,
    showSuccessToast,
    showErrorToast,
    showInfoToast,
  };
};