/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { shouldTrackAnalytics } from '@/utils/analyticsConsent';

interface PageViewData {
  page: string;
  title: string;
  referrer: string;
  userAgent: string;
  timestamp: string;
  sessionId: string;
  userId?: string;
}

// Generate session ID that persists during browser session
const getSessionId = (): string => {
  if (typeof window === 'undefined') return 'server';
  
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

// Track page views automatically
export const usePageTracking = (userId?: string) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPage = useRef<string>('');
  const sessionStartTime = useRef<number>(Date.now());

  useEffect(() => {
    const trackPageView = async () => {
      if (typeof window === 'undefined') return;
      
      // Check analytics consent before tracking
      if (!shouldTrackAnalytics()) {
        console.debug('📊 Analytics tracking skipped - no consent');
        return;
      }

      const currentPage = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
      
      // Avoid tracking the same page multiple times
      if (currentPage === lastTrackedPage.current) return;
      lastTrackedPage.current = currentPage;

      const pageViewData: PageViewData = {
        page: currentPage,
        title: document.title || 'Unknown Page',
        referrer: document.referrer || 'direct',
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        sessionId: getSessionId(),
        userId: userId
      };

      try {
        // Send to analytics API
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event: 'page_view',
            data: pageViewData
          }),
        });

        console.debug('📊 Page view tracked:', currentPage);
      } catch (error) {
        // Silent fail - analytics shouldn't break the app
        console.debug('Failed to track page view:', error);
      }
    };

    // Track page view with slight delay to ensure title is set
    const timeoutId = setTimeout(trackPageView, 100);
    
    return () => clearTimeout(timeoutId);
  }, [pathname, searchParams, userId]);

  // Track session duration on unload
  useEffect(() => {
    const trackSessionEnd = () => {
      const sessionDuration = Date.now() - sessionStartTime.current;
      
      // Only track sessions longer than 1 second
      if (sessionDuration < 1000) return;

      const sessionData = {
        sessionId: getSessionId(),
        duration: sessionDuration,
        pages: lastTrackedPage.current ? 1 : 0, // Simplified page count
        userId: userId
      };

      // Use sendBeacon for reliable delivery on page unload (only if user consented)
      if (shouldTrackAnalytics() && navigator.sendBeacon) {
        // Create Blob with correct content-type for sendBeacon
        const blob = new Blob([JSON.stringify({
          event: 'session_end',
          data: sessionData
        })], { type: 'application/json' });
        
        navigator.sendBeacon('/api/analytics/track', blob);
      }
    };

    window.addEventListener('beforeunload', trackSessionEnd);
    window.addEventListener('pagehide', trackSessionEnd);

    return () => {
      window.removeEventListener('beforeunload', trackSessionEnd);
      window.removeEventListener('pagehide', trackSessionEnd);
    };
  }, [userId]);
};

// Track custom events
export const trackEvent = async (eventName: string, eventData: any, userId?: string) => {
  if (typeof window === 'undefined') return;
  
  // Check analytics consent before tracking
  if (!shouldTrackAnalytics()) {
    console.debug('📊 Custom event tracking skipped - no consent:', eventName);
    return;
  }

  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: eventName,
        data: {
          ...eventData,
          timestamp: new Date().toISOString(),
          sessionId: getSessionId(),
          userId: userId,
          page: window.location.pathname
        }
      }),
    });

    console.debug('📊 Custom event tracked:', eventName);
  } catch (error) {
    console.debug('Failed to track custom event:', error);
  }
};

// Track chart generation events
export const trackChartGeneration = async (chartType: string, userId?: string) => {
  await trackEvent('chart_generated', {
    chartType,
    source: 'web_app'
  }, userId);
};

// Track discussion interactions
export const trackDiscussionInteraction = async (action: string, discussionId: string, userId?: string) => {
  await trackEvent('discussion_interaction', {
    action, // 'view', 'reply', 'vote_up', 'vote_down'
    discussionId
  }, userId);
};

// Track horary question submissions
export const trackHoraryQuestion = async (userId?: string) => {
  await trackEvent('horary_question_submitted', {
    source: 'horary_oracle'
  }, userId);
};