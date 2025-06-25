/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { AUTH_CONFIG } from '@/config/auth';

interface GoogleSignInPromptProps {
  user: User | null;
  isAuthLoading: boolean;
  onGoogleSignIn: () => void;
  onDismiss: () => void;
}

const GoogleSignInPrompt = React.memo(({
  user,
  isAuthLoading,
  onGoogleSignIn,
  onDismiss
}: GoogleSignInPromptProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if auto-prompting is enabled
    if (!AUTH_CONFIG.features.autoPrompt.enabled) {
      return;
    }

    // Only show prompt for anonymous users on first visit
    if (user && user.authProvider === 'anonymous') {
      // Check if this is a first-time visitor (no previous Google dismissal)
      const hasSeenPrompt = AUTH_CONFIG.features.autoPrompt.rememberDismissal 
        ? localStorage.getItem('google-signin-prompt-dismissed')
        : null;
      
      if (!hasSeenPrompt) {
        // Show after configured delay for better UX
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, AUTH_CONFIG.features.autoPrompt.delayMs);
        
        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  const handleDismiss = () => {
    setIsVisible(false);
    // Remember that user dismissed the prompt (if configured to remember)
    if (AUTH_CONFIG.features.autoPrompt.rememberDismissal) {
      localStorage.setItem('google-signin-prompt-dismissed', 'true');
    }
    onDismiss();
  };

  const handleSignIn = () => {
    setIsVisible(false);
    onGoogleSignIn();
  };

  if (!isVisible || !user || user.authProvider !== 'anonymous') {
    return null;
  }

  return (
    <div className="fixed top-16 right-4 z-50 bg-white border border-black shadow-lg max-w-sm">
      {/* Prompt Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-50 border border-blue-200 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-black font-space-grotesk">
              Save Your Charts
            </h3>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Dismiss"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <p className="text-xs text-gray-600 mb-3 font-inter leading-relaxed">
          Sign in with Google to save your natal charts, bookmark optimal timing events, and sync your astrological data across devices.
        </p>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={handleSignIn}
            disabled={isAuthLoading}
            className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white text-xs font-medium border border-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAuthLoading ? (
              <>
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <svg className="w-3 h-3" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Sign in with Google</span>
              </>
            )}
          </button>
          <button
            onClick={handleDismiss}
            className="px-3 py-2 text-xs font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Later
          </button>
        </div>
      </div>

      {/* Arrow pointing to profile */}
      <div className="absolute top-2 -right-2 w-0 h-0 border-l-[8px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent"></div>
      <div className="absolute top-2 -right-[9px] w-0 h-0 border-l-[8px] border-l-black border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent"></div>
    </div>
  );
});

GoogleSignInPrompt.displayName = 'GoogleSignInPrompt';

export default GoogleSignInPrompt;