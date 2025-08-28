/* eslint-disable @typescript-eslint/no-unused-vars */

import { useCallback } from 'react';
import { useUserStore } from '@/store/userStore';

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: string;
}

interface AnalyticsConfig {
  enabled: boolean;
  debug: boolean;
  batchSize: number;
  flushInterval: number;
}

interface UseAnalyticsReturn {
  track: (event: string, properties?: Record<string, any>) => Promise<void>;
  trackPageView: (page: string, additionalProps?: Record<string, any>) => Promise<void>;
  trackUserAction: (action: string, target: string, additionalProps?: Record<string, any>) => Promise<void>;
  trackError: (error: Error, context?: Record<string, any>) => Promise<void>;
  trackTiming: (category: string, variable: string, value: number, label?: string) => Promise<void>;
  identify: (userId: string, traits?: Record<string, any>) => Promise<void>;
  isEnabled: boolean;
}

// Global analytics configuration
const DEFAULT_CONFIG: AnalyticsConfig = {
  enabled: typeof window !== 'undefined' && process.env.NODE_ENV === 'production',
  debug: process.env.NODE_ENV === 'development',
  batchSize: 10,
  flushInterval: 5000, // 5 seconds
};

// Event queue for batching (in production, you might want to use a more sophisticated queue)
let eventQueue: AnalyticsEvent[] = [];

/**
 * Modern analytics hook for client-side event tracking
 * Provides type-safe, batch-enabled analytics with automatic user context
 */
export function useAnalytics(config: Partial<AnalyticsConfig> = {}): UseAnalyticsReturn {
  const { user } = useUserStore();
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  // Send events to the analytics API
  const sendEvent = useCallback(async (event: AnalyticsEvent): Promise<void> => {
    if (!mergedConfig.enabled) {
      if (mergedConfig.debug) {
        console.log('📊 Analytics (disabled):', event);
      }
      return;
    }

    try {
      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          timestamp: event.timestamp || new Date().toISOString(),
          userId: event.userId || user?.id || 'anonymous',
        }),
      });

      if (!response.ok) {
        throw new Error(`Analytics API error: ${response.status}`);
      }

      if (mergedConfig.debug) {
        console.log('📊 Analytics event sent:', event);
      }
    } catch (error) {
      // Fail silently in production to avoid breaking user experience
      if (mergedConfig.debug || process.env.NODE_ENV === 'development') {
        console.error('Analytics tracking failed:', error);
      }
    }
  }, [mergedConfig, user?.id]);

  // Generic track function
  const track = useCallback(async (
    event: string, 
    properties: Record<string, any> = {}
  ): Promise<void> => {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        // Add default context
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        referrer: typeof document !== 'undefined' ? document.referrer : undefined,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        timestamp: new Date().toISOString(),
      },
    };

    await sendEvent(analyticsEvent);
  }, [sendEvent]);

  // Track page views
  const trackPageView = useCallback(async (
    page: string, 
    additionalProps: Record<string, any> = {}
  ): Promise<void> => {
    await track('page_view', {
      page,
      title: typeof document !== 'undefined' ? document.title : undefined,
      ...additionalProps,
    });
  }, [track]);

  // Track user actions (clicks, form submissions, etc.)
  const trackUserAction = useCallback(async (
    action: string,
    target: string,
    additionalProps: Record<string, any> = {}
  ): Promise<void> => {
    await track('user_action', {
      action,
      target,
      ...additionalProps,
    });
  }, [track]);

  // Track errors for monitoring
  const trackError = useCallback(async (
    error: Error,
    context: Record<string, any> = {}
  ): Promise<void> => {
    await track('error', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      ...context,
    });
  }, [track]);

  // Track performance timings
  const trackTiming = useCallback(async (
    category: string,
    variable: string,
    value: number,
    label?: string
  ): Promise<void> => {
    await track('timing', {
      category,
      variable,
      value,
      label,
    });
  }, [track]);

  // Identify users (when they log in, register, etc.)
  const identify = useCallback(async (
    userId: string,
    traits: Record<string, any> = {}
  ): Promise<void> => {
    await track('identify', {
      userId,
      traits,
    });
  }, [track]);

  return {
    track,
    trackPageView,
    trackUserAction,
    trackError,
    trackTiming,
    identify,
    isEnabled: mergedConfig.enabled,
  };
}

// Convenience hooks for common analytics patterns

/**
 * Hook for tracking form interactions
 */
export function useFormAnalytics() {
  const { track } = useAnalytics();

  const trackFormStart = useCallback((formName: string) => {
    track('form_start', { form_name: formName });
  }, [track]);

  const trackFormSubmit = useCallback((formName: string, success: boolean = true) => {
    track('form_submit', { form_name: formName, success });
  }, [track]);

  const trackFormError = useCallback((formName: string, error: string) => {
    track('form_error', { form_name: formName, error });
  }, [track]);

  const trackFieldInteraction = useCallback((formName: string, fieldName: string, action: 'focus' | 'blur' | 'change') => {
    track('form_field_interaction', { form_name: formName, field_name: fieldName, action });
  }, [track]);

  return {
    trackFormStart,
    trackFormSubmit,
    trackFormError,
    trackFieldInteraction,
  };
}

/**
 * Hook for tracking chart and astrology-specific events
 */
export function useChartAnalytics() {
  const { track } = useAnalytics();

  const trackChartGeneration = useCallback((chartType: string, duration?: number) => {
    track('chart_generated', { chart_type: chartType, generation_duration: duration });
  }, [track]);

  const trackChartView = useCallback((chartType: string, userId?: string) => {
    track('chart_viewed', { chart_type: chartType, chart_user_id: userId });
  }, [track]);

  const trackChartShare = useCallback((chartType: string, shareMethod: string) => {
    track('chart_shared', { chart_type: chartType, share_method: shareMethod });
  }, [track]);

  const trackLocationSearch = useCallback((query: string, resultsCount: number) => {
    track('location_search', { query, results_count: resultsCount });
  }, [track]);

  return {
    trackChartGeneration,
    trackChartView,
    trackChartShare,
    trackLocationSearch,
  };
}

/**
 * Auto-track page views on route changes (for use with Next.js router)
 */
export function usePageViewTracking() {
  const { trackPageView } = useAnalytics();

  // This would typically integrate with Next.js router events
  // useRouter().events.on('routeChangeComplete', trackPageView);

  return { trackPageView };
}