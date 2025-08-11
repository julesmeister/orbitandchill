/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Format timestamp for display in discussions and replies
 * Optimized for performance with cached date objects
 */
export function formatTimestamp(date: Date | string | number): string {
  let d: Date;
  
  // Handle Unix timestamps (integers from database)
  if (typeof date === 'number') {
    // If it looks like a Unix timestamp (less than year 3000), convert from seconds
    d = date < 32503680000 ? new Date(date * 1000) : new Date(date);
  } else {
    d = new Date(date);
  }
  
  // Fallback for invalid dates
  if (isNaN(d.getTime())) {
    return 'just now';
  }
  
  const now = new Date();
  const diffInMs = now.getTime() - d.getTime();
  const diffInMinutes = diffInMs / (1000 * 60);
  const diffInHours = diffInMinutes / 60;
  const diffInDays = diffInHours / 24;
  
  if (diffInMinutes < 1) {
    return 'just now';
  } else if (diffInMinutes < 60) {
    return `${Math.floor(diffInMinutes)}m ago`;
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`;
  } else if (diffInDays < 2) {
    // For replies from yesterday, show the actual time
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    }
    return `${Math.floor(diffInHours)}h ago`;
  } else if (diffInDays < 7) {
    // For recent days, show day and time
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } else {
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
}

/**
 * Generate avatar initials from user name
 * Optimized for consistent avatar generation
 */
export function generateAvatarFromName(name: string): string {
  if (!name) return 'AN';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

/**
 * Format relative time with caching for better performance
 */
const TIME_CACHE = new Map<string, { formatted: string; expiry: number }>();
const CACHE_DURATION = 60000; // 1 minute cache

export function formatTimestampCached(date: Date | string | number): string {
  const key = typeof date === 'object' ? date.getTime().toString() : date.toString();
  const now = Date.now();
  
  // Check cache first
  const cached = TIME_CACHE.get(key);
  if (cached && cached.expiry > now) {
    return cached.formatted;
  }
  
  // Format timestamp
  const formatted = formatTimestamp(date);
  
  // Cache result
  TIME_CACHE.set(key, {
    formatted,
    expiry: now + CACHE_DURATION
  });
  
  // Clean expired entries periodically
  if (TIME_CACHE.size > 100) {
    for (const [cacheKey, value] of TIME_CACHE.entries()) {
      if (value.expiry <= now) {
        TIME_CACHE.delete(cacheKey);
      }
    }
  }
  
  return formatted;
}