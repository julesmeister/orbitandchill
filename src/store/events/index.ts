/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { EventsState } from './types';
import { createGetAllEvents } from './computed';
import { createApiActions } from './apiActions';
import { createBookmarkActions } from './bookmarkActions';
import { createBulkActions } from './bulkActions';
import { createMonthActions } from './monthActions';
import { createUIActions } from './uiActions';

export const useEventsStore = create<EventsState>()(
  persist(
    (set, get) => ({
      // Initial state
      events: {},
      generatedEvents: {},
      eventIds: [],
      generatedEventIds: [],
      cachedMonths: new Map(),
      loadedMonths: new Set(),
      showCalendar: false,
      currentDate: new Date(),
      selectedType: 'all',
      selectedPriorities: [],
      showAddForm: false,
      showTimingOptions: false,
      isGenerating: false,
      selectedTab: 'all',
      hideChallengingDates: false,
      showCombosOnly: false,
      showAspects: true,
      showHousesOnly: false,
      showAspectsOnly: false,
      showElectionalOnly: false,
      isLoading: false,
      error: null,

      // Computed properties
      getAllEvents: createGetAllEvents(get),
      
      // Simple state setter for events array
      setEvents: (events) => {
        const eventsById = events.reduce((acc, event) => {
          acc[event.id] = event;
          return acc;
        }, {} as Record<string, import('./types').AstrologicalEvent>);
        const eventIds = events.map(event => event.id);
        set({ events: eventsById, eventIds });
      },

      // Action modules
      ...createApiActions(set, get),
      ...createBookmarkActions(set, get),
      ...createBulkActions(set, get),
      ...createMonthActions(set, get),
      ...createUIActions(set, get)
    }),
    {
      name: "luckstrology-events-storage",
      // Serialize Date objects properly - EXCLUDE events and caching data from persistence
      partialize: (state) => {
        const { events, generatedEvents, isLoading, error, cachedMonths, loadedMonths, ...persistableState } = state;
        return {
          ...persistableState,
          currentDate: state.currentDate.toISOString(),
        };
      },
      // Deserialize Date objects properly
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Fix Date object deserialization
          if (typeof state.currentDate === 'string') {
            state.currentDate = new Date(state.currentDate);
          }
          
          // Ensure events and cache are always empty on rehydration (they come from database)
          state.events = {};
          state.generatedEvents = {};
          state.eventIds = [];
          state.generatedEventIds = [];
          state.cachedMonths = new Map();
          state.loadedMonths = new Set();
          state.isLoading = false;
          state.error = null;
          
          // Ensure boolean toggle states are properly set
          if (typeof state.hideChallengingDates !== 'boolean') {
            state.hideChallengingDates = false;
          }
          if (typeof state.showCombosOnly !== 'boolean') {
            state.showCombosOnly = false;
          }
          if (typeof state.showAspects !== 'boolean') {
            state.showAspects = true;
          }
          if (typeof state.showHousesOnly !== 'boolean') {
            state.showHousesOnly = false;
          }
          if (typeof state.showAspectsOnly !== 'boolean') {
            state.showAspectsOnly = false;
          }
          if (typeof state.showElectionalOnly !== 'boolean') {
            state.showElectionalOnly = false;
          }
          
          // Store rehydrated successfully
        }
      },
    }
  )
);

// Re-export types for convenience
export type { EventsState, AstrologicalEvent } from './types';