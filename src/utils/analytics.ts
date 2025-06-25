/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// Client-side analytics tracking utility

interface AnalyticsEvent {
  event: string;
  data: Record<string, any>;
}

class Analytics {
  private sessionId: string;
  private userId?: string;
  private sessionStart: number;
  private pageViews: Set<string> = new Set();

  constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionStart = Date.now();
    
    // Track page views
    this.trackPageView();
    
    // Track session end on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.trackSessionEnd();
      });
      
      // Track page visibility changes
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          this.trackPageView();
        }
      });
    }
  }

  private generateSessionId(): string {
    return 'session_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private async trackEvent(event: string, data: Record<string, any> = {}) {
    // Only track on client side
    if (typeof window === 'undefined') return;
    
    try {
      const payload = {
        event,
        data: {
          ...data,
          sessionId: this.sessionId,
          userId: this.userId,
          timestamp: Date.now(),
          userAgent: window.navigator.userAgent,
          referrer: document.referrer || undefined
        }
      };

      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Analytics API responded with ${response.status}`);
      }
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  }

  // Public methods for tracking specific events
  
  setUserId(userId: string) {
    this.userId = userId;
  }

  trackPageView(page?: string) {
    if (typeof window === 'undefined') return;
    
    const currentPage = page || window.location.pathname;
    
    // Only track unique page views per session
    if (!this.pageViews.has(currentPage)) {
      this.pageViews.add(currentPage);
      
      this.trackEvent('page_view', {
        page: currentPage,
        title: document.title,
        url: window.location.href
      });
    }
  }

  trackChartGenerated(chartType: string, chartData?: any) {
    this.trackEvent('chart_generated', {
      chartType,
      chartData: chartData ? JSON.stringify(chartData) : undefined
    });
  }

  trackDiscussionViewed(discussionId: string, title?: string) {
    this.trackEvent('discussion_viewed', {
      discussionId,
      title
    });
  }

  trackDiscussionCreated(discussionId: string, title: string, category?: string) {
    this.trackEvent('discussion_created', {
      discussionId,
      title,
      category
    });
  }

  trackReplyPosted(discussionId: string, replyId: string) {
    this.trackEvent('reply_posted', {
      discussionId,
      replyId
    });
  }

  trackSearch(query: string, resultsCount?: number) {
    this.trackEvent('search', {
      query,
      resultsCount
    });
  }

  trackUserAction(action: string, details?: Record<string, any>) {
    this.trackEvent('user_action', {
      action,
      ...details
    });
  }

  private trackSessionEnd() {
    // Only track if we have meaningful data
    if (typeof window === 'undefined') return;
    
    const sessionDuration = Math.floor((Date.now() - this.sessionStart) / 1000);
    
    // Don't send empty or very short sessions
    if (sessionDuration < 1) return;
    
    this.trackEvent('user_session', {
      sessionDuration,
      pageViewsCount: this.pageViews.size,
      isNewUser: !this.userId // Simple heuristic - improve with actual user state
    });
  }
}

// Create singleton instance
const analytics = typeof window !== 'undefined' ? new Analytics() : null;

export default analytics;

// Export individual tracking functions for convenience
export const trackPageView = (page?: string) => {
  if (typeof window === 'undefined') return;
  analytics?.trackPageView(page);
};

export const trackChartGenerated = (chartType: string, chartData?: any) => {
  if (typeof window === 'undefined') return;
  analytics?.trackChartGenerated(chartType, chartData);
};

export const trackDiscussionViewed = (discussionId: string, title?: string) => {
  if (typeof window === 'undefined') return;
  analytics?.trackDiscussionViewed(discussionId, title);
};

export const trackDiscussionCreated = (discussionId: string, title: string, category?: string) => {
  if (typeof window === 'undefined') return;
  analytics?.trackDiscussionCreated(discussionId, title, category);
};

export const trackReplyPosted = (discussionId: string, replyId: string) => {
  if (typeof window === 'undefined') return;
  analytics?.trackReplyPosted(discussionId, replyId);
};

export const trackSearch = (query: string, resultsCount?: number) => {
  if (typeof window === 'undefined') return;
  analytics?.trackSearch(query, resultsCount);
};

export const trackUserAction = (action: string, details?: Record<string, any>) => {
  if (typeof window === 'undefined') return;
  analytics?.trackUserAction(action, details);
};

export const setUserId = (userId: string) => {
  if (typeof window === 'undefined') return;
  analytics?.setUserId(userId);
};