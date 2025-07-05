/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from 'react';

interface StatusToastProps {
  title: string;
  message: string;
  status: 'loading' | 'success' | 'error' | 'info';
  isVisible: boolean;
  onHide: () => void;
  duration?: number; // Auto-hide duration, 0 means no auto-hide
  showProgress?: boolean;
  progress?: number; // 0-100
}

export default function StatusToast({ 
  title,
  message, 
  status,
  isVisible, 
  onHide,
  duration = 0, // Default to no auto-hide for status messages
  showProgress = false,
  progress = 0
}: StatusToastProps) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      if (duration > 0) {
        const timer = setTimeout(() => {
          onHide();
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      // Delay unmounting to allow exit animation
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onHide]);

  if (!shouldRender) return null;

  // Black and white color system
  const getStatusColors = () => {
    switch (status) {
      case 'loading':
        return {
          bg: '#ffffff', // White background
          text: '#000000', // Black text
          progressBg: '#000000' // Black for progress bar
        };
      case 'success':
        return {
          bg: '#ffffff', // White background
          text: '#000000', // Black text
          progressBg: '#000000' // Black for progress bar
        };
      case 'error':
        return {
          bg: '#000000', // Black background for errors
          text: '#ffffff', // White text
          progressBg: '#ffffff' // White for progress bar
        };
      case 'info':
        return {
          bg: '#ffffff', // White background
          text: '#000000', // Black text
          progressBg: '#000000' // Black for progress bar
        };
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return (
          <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'success':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const colors = getStatusColors();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] pointer-events-none">
      <div 
        className={`
          px-6 py-4 border-2 border-black shadow-lg max-w-sm pointer-events-auto
          transform transition-all duration-300 ease-out
          ${isVisible 
            ? 'translate-y-0 opacity-100 scale-100' 
            : 'translate-y-4 opacity-0 scale-95'
          }
        `}
        style={{ backgroundColor: colors.bg }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          {/* Status icon */}
          <div className="flex-shrink-0" style={{ color: colors.text }}>
            {getStatusIcon()}
          </div>
          
          {/* Title */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold font-space-grotesk" style={{ color: colors.text }}>
              {title}
            </h4>
          </div>

          {/* Close button (only for non-loading states) */}
          {status !== 'loading' && (
            <button
              onClick={onHide}
              className="flex-shrink-0 hover:opacity-70 transition-opacity"
              style={{ color: colors.text }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Message */}
        <div className="mb-3">
          <p className="text-sm font-open-sans" style={{ color: colors.text }}>
            {message}
          </p>
        </div>

        {/* Progress bar (only shown when showProgress is true) */}
        {showProgress && (
          <div className="mb-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium" style={{ color: colors.text }}>Progress</span>
              <span className="font-medium" style={{ color: colors.text }}>{Math.round(progress)}%</span>
            </div>
            {/* Sharp, geometric progress bar - no rounded corners */}
            <div className="h-2 bg-white border border-black overflow-hidden">
              <div 
                className="h-full transition-all duration-300"
                style={{ 
                  width: `${Math.max(0, Math.min(100, progress))}%`,
                  backgroundColor: colors.progressBg
                }}
              />
            </div>
          </div>
        )}

        {/* Auto-hide progress bar (only for success/error with duration) */}
        {duration > 0 && status !== 'loading' && (
          <div className="h-0.5 bg-white border-b border-black">
            <div 
              className={`h-full transition-all ease-linear ${isVisible ? 'w-full' : 'w-0'}`}
              style={{ 
                backgroundColor: colors.progressBg,
                transitionDuration: isVisible ? `${duration}ms` : '300ms'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}