/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * URL parameter utilities for event chart navigation
 */

export interface EventParams {
  date: string | null;
  time: string;
  title: string;
  isOptimal: boolean;
  optimalScore: number | null;
  startTime: string | null;
  endTime: string | null;
  duration: string | null;
}

/**
 * Parse event parameters from URL search params
 * 
 * @param searchParams - URLSearchParams object
 * @returns Parsed event parameters
 */
export function parseEventParams(searchParams: URLSearchParams): EventParams {
  const date = searchParams.get('date');
  const time = searchParams.get('time') || '12:00';
  const title = searchParams.get('title') || 'Event Chart';
  const isOptimal = searchParams.get('isOptimal') === 'true';
  const scoreParam = searchParams.get('score');
  const optimalScore = scoreParam ? parseInt(scoreParam) : null;
  
  // Time window parameters
  const startTime = searchParams.get('startTime');
  const endTime = searchParams.get('endTime');
  const duration = searchParams.get('duration');
  
  return {
    date,
    time,
    title,
    isOptimal,
    optimalScore,
    startTime,
    endTime,
    duration
  };
}

/**
 * Build event chart URL with parameters
 * 
 * @param params - Event parameters to include in URL
 * @returns URL string for event chart
 */
export function buildEventChartUrl(params: Partial<EventParams>): string {
  const searchParams = new URLSearchParams();
  
  if (params.date) searchParams.set('date', params.date);
  if (params.time) searchParams.set('time', params.time);
  if (params.title) searchParams.set('title', params.title);
  if (params.isOptimal) searchParams.set('isOptimal', 'true');
  if (params.optimalScore) searchParams.set('score', params.optimalScore.toString());
  if (params.startTime) searchParams.set('startTime', params.startTime);
  if (params.endTime) searchParams.set('endTime', params.endTime);
  if (params.duration) searchParams.set('duration', params.duration);
  
  return `/event-chart?${searchParams.toString()}`;
}

/**
 * Validate required event parameters
 * 
 * @param params - Event parameters to validate
 * @returns Validation result with errors
 */
export function validateEventParams(params: EventParams): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!params.date) {
    errors.push('Event date is required');
  }
  
  if (!params.time) {
    errors.push('Event time is required');
  } else {
    // Validate time format (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(params.time)) {
      errors.push('Invalid time format. Use HH:MM format.');
    }
  }
  
  if (!params.title || params.title.trim().length === 0) {
    errors.push('Event title is required');
  }
  
  if (params.optimalScore !== null && (params.optimalScore < 1 || params.optimalScore > 10)) {
    errors.push('Optimal score must be between 1 and 10');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Get event parameters from current URL
 * 
 * @returns Event parameters from current page URL
 */
export function getCurrentEventParams(): EventParams | null {
  if (typeof window === 'undefined') return null;
  
  const url = new URL(window.location.href);
  return parseEventParams(url.searchParams);
}