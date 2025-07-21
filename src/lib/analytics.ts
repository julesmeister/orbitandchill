/* eslint-disable @typescript-eslint/no-unused-vars */

// Google Analytics utility functions
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const event = (action: string, parameters?: {
  event_category?: string;
  event_label?: string;
  value?: number;
  [key: string]: any;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, parameters);
  }
};

// Track astrology-specific events
export const trackChartGeneration = (chartType: string) => {
  event('generate_chart', {
    event_category: 'astrology',
    event_label: chartType,
    value: 1
  });
};

export const trackBlogPost = (postTitle: string, category: string) => {
  event('view_blog_post', {
    event_category: 'blog',
    event_label: postTitle,
    custom_parameter_1: category
  });
};

export const trackDiscussionView = (discussionId: string, category: string) => {
  event('view_discussion', {
    event_category: 'forum',
    event_label: discussionId,
    custom_parameter_1: category
  });
};

export const trackUserRegistration = (method: 'google' | 'anonymous' | 'email' | 'firebase') => {
  event('sign_up', {
    method: method
  });
};

export const trackSearch = (searchTerm: string, resultsCount: number) => {
  event('search', {
    search_term: searchTerm,
    value: resultsCount
  });
};