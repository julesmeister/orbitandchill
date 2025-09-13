/* eslint-disable @typescript-eslint/no-unused-vars */

import type { AstrologicalEvent, UnifiedEvent, EventMetadata, EventFilter } from '../types/events';

/**
 * Pure utility functions for event operations
 * No side effects, just data transformations
 */

/**
 * Convert AstrologicalEvent to UnifiedEvent with metadata
 */
export function toUnifiedEvent(
  event: AstrologicalEvent,
  source: 'api' | 'generated' | 'manual',
  isBookmarked = false
): UnifiedEvent {
  const metadata: EventMetadata = {
    source,
    isPersisted: source === 'api' || isBookmarked,
    isBookmarked,
    createdLocally: source === 'generated' || source === 'manual',
    userId: event.userId,
    lastModified: new Date().toISOString(),
    syncStatus: source === 'api' ? 'synced' : 'pending'
  };

  // Remove isBookmarked from the base event since it's now in metadata
  const { isBookmarked: _, ...baseEvent } = event;

  return {
    ...baseEvent,
    metadata
  };
}

/**
 * Convert UnifiedEvent back to AstrologicalEvent for API compatibility
 */
export function toAstrologicalEvent(unifiedEvent: UnifiedEvent): AstrologicalEvent {
  return {
    ...unifiedEvent,
    isBookmarked: unifiedEvent.metadata.isBookmarked
  };
}

/**
 * Toggle bookmark status on a unified event (pure function)
 */
export function toggleEventBookmark(event: UnifiedEvent): UnifiedEvent {
  const newBookmarkStatus = !event.metadata.isBookmarked;
  
  return {
    ...event,
    metadata: {
      ...event.metadata,
      isBookmarked: newBookmarkStatus,
      isPersisted: newBookmarkStatus || event.metadata.source === 'api',
      lastModified: new Date().toISOString(),
      syncStatus: event.metadata.source === 'api' ? 'synced' : 'pending'
    }
  };
}

/**
 * Filter events based on criteria (pure function)
 */
export function filterEvents(events: UnifiedEvent[], filter: EventFilter): UnifiedEvent[] {
  return events.filter(event => {
    // Source filter
    if (filter.source && filter.source !== 'all' && event.metadata.source !== filter.source) {
      return false;
    }

    // Bookmark filter
    if (filter.isBookmarked !== undefined && event.metadata.isBookmarked !== filter.isBookmarked) {
      return false;
    }

    // Type filter
    if (filter.type && filter.type !== 'all' && event.type !== filter.type) {
      return false;
    }

    // User filter
    if (filter.userId && event.metadata.userId !== filter.userId) {
      return false;
    }

    // Date range filter
    if (filter.dateRange) {
      const eventDate = new Date(event.date);
      const startDate = new Date(filter.dateRange.start);
      const endDate = new Date(filter.dateRange.end);
      
      if (eventDate < startDate || eventDate > endDate) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sort events by date (most recent first)
 */
export function sortEventsByDate(events: UnifiedEvent[]): UnifiedEvent[] {
  return [...events].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
    const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * Sort events by score (highest first)
 */
export function sortEventsByScore(events: UnifiedEvent[]): UnifiedEvent[] {
  return [...events].sort((a, b) => b.score - a.score);
}

/**
 * Group events by date
 */
export function groupEventsByDate(events: UnifiedEvent[]): Record<string, UnifiedEvent[]> {
  return events.reduce((groups, event) => {
    const date = event.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {} as Record<string, UnifiedEvent[]>);
}

/**
 * Check if event is local (generated or manual)
 */
export function isLocalEvent(eventId: string): boolean {
  return eventId.startsWith('astro_') || 
         eventId.startsWith('local_') || 
         eventId.startsWith('bookmark_') ||
         eventId.startsWith('manual_');
}

/**
 * Generate unique event ID
 */
export function generateEventId(source: 'generated' | 'manual' | 'bookmark'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  
  switch (source) {
    case 'generated':
      return `astro_${timestamp}_${random}`;
    case 'manual':
      return `manual_${timestamp}_${random}`;
    case 'bookmark':
      return `bookmark_${timestamp}_${random}`;
    default:
      return `event_${timestamp}_${random}`;
  }
}

/**
 * Validate event data
 */
export function validateEvent(event: Partial<AstrologicalEvent>): string[] {
  const errors: string[] = [];

  if (!event.title?.trim()) {
    errors.push('Title is required');
  }

  if (!event.date) {
    errors.push('Date is required');
  } else {
    const date = new Date(event.date);
    if (isNaN(date.getTime())) {
      errors.push('Invalid date format');
    }
  }

  if (event.time && !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(event.time)) {
    errors.push('Invalid time format (use HH:MM)');
  }

  if (event.score !== undefined && (event.score < 0 || event.score > 10)) {
    errors.push('Score must be between 0 and 10');
  }

  if (event.type && !['benefic', 'challenging', 'neutral'].includes(event.type)) {
    errors.push('Invalid event type');
  }

  return errors;
}

/**
 * Merge event arrays, removing duplicates by ID
 */
export function mergeEvents(events1: UnifiedEvent[], events2: UnifiedEvent[]): UnifiedEvent[] {
  const eventMap = new Map<string, UnifiedEvent>();
  
  // Add events from first array
  events1.forEach(event => {
    eventMap.set(event.id, event);
  });
  
  // Add/update events from second array (second array takes precedence)
  events2.forEach(event => {
    eventMap.set(event.id, event);
  });
  
  return Array.from(eventMap.values());
}

/**
 * Calculate event statistics
 */
export function calculateEventStats(events: UnifiedEvent[]) {
  const total = events.length;
  const bookmarked = events.filter(e => e.metadata.isBookmarked).length;
  const generated = events.filter(e => e.metadata.source === 'generated').length;
  const manual = events.filter(e => e.metadata.source === 'manual').length;
  const api = events.filter(e => e.metadata.source === 'api').length;
  
  const benefic = events.filter(e => e.type === 'benefic').length;
  const challenging = events.filter(e => e.type === 'challenging').length;
  const neutral = events.filter(e => e.type === 'neutral').length;
  
  const averageScore = total > 0 
    ? events.reduce((sum, e) => sum + e.score, 0) / total 
    : 0;

  return {
    total,
    bookmarked,
    sources: { generated, manual, api },
    types: { benefic, challenging, neutral },
    averageScore: Math.round(averageScore * 100) / 100
  };
}