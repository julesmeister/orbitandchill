/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Format event date for display
 */
export function formatEventDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Format event time for display
 */
export function formatEventTime(timeString: string): string {
  return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Get event type display text and icon
 */
export function getEventTypeDisplay(type: 'benefic' | 'challenging' | 'neutral'): { text: string; icon: string } {
  switch (type) {
    case 'benefic':
      return { text: 'Favorable', icon: '✓' };
    case 'challenging':
      return { text: 'Challenging', icon: '⚠' };
    default:
      return { text: 'Neutral', icon: '•' };
  }
}

/**
 * Filter events by tab type
 */
export function filterEventsByTab(
  events: Array<{ isGenerated: boolean; isBookmarked?: boolean }>,
  tab: string
): Array<{ isGenerated: boolean; isBookmarked?: boolean }> {
  switch (tab) {
    case 'generated':
      return events.filter(e => e.isGenerated && !e.isBookmarked);
    case 'bookmarked':
      return events.filter(e => e.isBookmarked);
    case 'manual':
      return events.filter(e => !e.isGenerated && !e.isBookmarked);
    default:
      return events;
  }
}

/**
 * Get tab count for a specific tab
 */
export function getTabCount(
  events: Array<{ isGenerated: boolean; isBookmarked?: boolean }>,
  tab: string
): number {
  return filterEventsByTab(events, tab).length;
}