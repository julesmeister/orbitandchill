/**
 * Date formatting utilities for admin and content management interfaces
 * Provides consistent date formatting across the application
 */

/**
 * Format a date string to relative time (e.g., "2 hours ago", "3 days ago")
 * @param dateString - ISO date string to format
 * @returns Human-readable relative time string
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
  } else {
    return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
  }
}

/**
 * Format a date string to detailed date and time with timezone
 * @param dateString - ISO date string to format
 * @returns Detailed formatted date string (e.g., "Monday, July 22, 2025, 10:30:45 AM PST")
 */
export function formatDetailedDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  });
}

/**
 * Format a date string to simple date (e.g., "July 22, 2025")
 * @param dateString - ISO date string to format
 * @returns Simple formatted date string
 */
export function formatSimpleDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format a date string to compact date (e.g., "07/22/25")
 * @param dateString - ISO date string to format
 * @returns Compact formatted date string
 */
export function formatCompactDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit'
  });
}

/**
 * Format a date string to time only (e.g., "10:30 AM")
 * @param dateString - ISO date string to format
 * @returns Time-only formatted string
 */
export function formatTimeOnly(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Format current time for UI display (e.g., "10:30")
 * @returns Current time in HH:MM format
 */
export function formatCurrentTime(): string {
  return new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
}

/**
 * Calculate and format duration between two dates (e.g., "3w", "2m", "1y")
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Formatted duration string
 */
export function formatDurationBetweenDates(startDate: Date, endDate: Date): string {
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30.44);
  const diffYears = Math.floor(diffDays / 365.25);
  
  if (diffYears >= 1) {
    return `${diffYears}y`;
  } else if (diffMonths >= 1) {
    return `${diffMonths}m`;
  } else if (diffWeeks >= 1) {
    return `${diffWeeks}w`;
  } else if (diffDays >= 1) {
    return `${diffDays}d`;
  } else {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    return `${diffHours}h`;
  }
}