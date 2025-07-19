/* eslint-disable @typescript-eslint/no-unused-vars */

import { useMemo } from 'react';
import { useUnifiedEventsStore } from '../store/unifiedEventsStore';
import { toAstrologicalEvent } from '../utils/eventOperations';
import type { AstrologicalEvent } from '../types/events';

/**
 * Compatibility hook that provides the same interface as the old eventsStore
 * This allows us to migrate components gradually
 */
export function useEventsCompat() {
  const store = useUnifiedEventsStore();

  return useMemo(() => ({
    // Convert UnifiedEvents back to AstrologicalEvents for compatibility
    events: store.getAllEvents().map(toAstrologicalEvent),
    generatedEvents: store.getGeneratedEvents().map(toAstrologicalEvent),
    isLoading: store.isLoading,

    // Actions with the same signatures
    addEvent: async (event: AstrologicalEvent) => {
      await store.addEvent(event);
    },

    updateEvent: async (id: string, updates: Partial<AstrologicalEvent>) => {
      await store.updateEvent(id, updates);
    },

    deleteEvent: async (id: string, userId: string) => {
      await store.removeEvent(id);
    },

    toggleBookmark: async (id: string, userId: string) => {
      await store.toggleBookmark(id);
    },

    loadMonthEvents: async (userId: string, month: number, year: number) => {
      await store.loadMonthEvents(userId, month, year);
    },

    clearGeneratedEvents: async (userId: string) => {
      // Remove all generated events
      const generatedEvents = store.getGeneratedEvents();
      for (const event of generatedEvents) {
        await store.removeEvent(event.id);
      }
    },

    // Helper methods
    getAllEvents: () => store.getAllEvents().map(toAstrologicalEvent),
    
    getBookmarkedEvents: () => store.getBookmarkedEvents().map(toAstrologicalEvent),

    // For backwards compatibility with filtering
    getFilteredEvents: (filter: {
      tab?: 'all' | 'bookmarked' | 'generated' | 'manual';
      type?: 'all' | 'benefic' | 'challenging' | 'neutral';
      hideChallengingDates?: boolean;
      showCombosOnly?: boolean;
    }) => {
      let events = store.getAllEvents();

      // Tab filtering
      if (filter.tab === 'bookmarked') {
        events = events.filter(e => e.metadata.isBookmarked);
      } else if (filter.tab === 'generated') {
        events = events.filter(e => e.metadata.source === 'generated');
      } else if (filter.tab === 'manual') {
        events = events.filter(e => e.metadata.source === 'manual');
      }

      // Type filtering
      if (filter.type && filter.type !== 'all') {
        events = events.filter(e => e.type === filter.type);
      }

      // Hide challenging dates
      if (filter.hideChallengingDates) {
        events = events.filter(e => e.type !== 'challenging');
      }

      // Show combos only (high scores)
      if (filter.showCombosOnly) {
        events = events.filter(e => e.score >= 8);
      }

      return events.map(toAstrologicalEvent);
    },

    // Cache management
    clearCache: store.clearCache,
    invalidateMonth: store.invalidateMonth,

    // Statistics
    getStats: store.getEventStats,

    // Additional methods that some components might need
    setEvents: async (events: AstrologicalEvent[]) => {
      // Clear existing and add new events
      const currentEvents = store.getAllEvents();
      for (const event of currentEvents) {
        await store.removeEvent(event.id);
      }
      for (const event of events) {
        await store.addEvent(event);
      }
    },

    loadEvents: async (userId: string, tab?: string) => {
      // For bookmarked/manual tabs, load persisted events instead of month events
      if (tab === 'bookmarked' || tab === 'manual') {
        await store.loadPersistedEvents();
      } else {
        // Load current month events for all/generated tabs
        const now = new Date();
        await store.loadMonthEvents(userId, now.getMonth(), now.getFullYear());
      }
    },

    // Initialize store (load persisted events once)
    initializeStore: async () => {
      await store.loadPersistedEvents();
    },

    addEventsLocal: async (events: AstrologicalEvent[]) => {
      // Add multiple events locally
      for (const event of events) {
        await store.addEvent(event);
      }
    }
  }), [store]);
}

// For components that need the raw unified store
export { useUnifiedEventsStore };