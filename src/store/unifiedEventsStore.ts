/* eslint-disable @typescript-eslint/no-unused-vars */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  AstrologicalEvent, 
  UnifiedEvent, 
  EventsState, 
  EventFilter, 
  EventCacheEntry 
} from '../types/events';
import { eventService } from '../services/EventService';
import { eventCache, EventCacheImpl } from '../services/EventCache';
import { eventPersistence } from '../services/EventPersistence';
import {
  toUnifiedEvent,
  toAstrologicalEvent,
  toggleEventBookmark,
  filterEvents,
  sortEventsByDate,
  isLocalEvent,
  generateEventId,
  mergeEvents,
  validateEvent
} from '../utils/eventOperations';

interface EventsStore extends EventsState {
  // Core actions
  addEvent: (event: AstrologicalEvent) => Promise<void>;
  updateEvent: (id: string, updates: Partial<AstrologicalEvent>) => Promise<void>;
  removeEvent: (id: string) => Promise<void>;
  toggleBookmark: (id: string) => Promise<void>;
  
  // Data loading
  loadMonthEvents: (userId: string, month: number, year: number) => Promise<void>;
  loadPersistedEvents: () => Promise<void>;
  
  // Getters with filtering
  getEventsByFilter: (filter: EventFilter) => UnifiedEvent[];
  getAllEvents: () => UnifiedEvent[];
  getBookmarkedEvents: () => UnifiedEvent[];
  getGeneratedEvents: () => UnifiedEvent[];
  getManualEvents: () => UnifiedEvent[];
  
  // Cache management
  clearCache: () => void;
  invalidateMonth: (userId: string, month: number, year: number) => void;
  
  // Utilities
  getEventById: (id: string) => UnifiedEvent | undefined;
  getEventStats: () => ReturnType<typeof import('../utils/eventOperations').calculateEventStats>;
  
  // Loading flags
  isLoadingPersisted: boolean;
}

export const useUnifiedEventsStore = create<EventsStore>()(
  persist(
    (set, get) => ({
      // Initial state
      allEvents: {},
      allEventIds: [],
      isLoading: false,
      syncStatus: 'idle',
      cache: new Map(),
      loadedMonths: new Set(),
      isLoadingPersisted: false,

      // Add new event
      addEvent: async (event: AstrologicalEvent) => {
        console.log(`➕ UnifiedStore: Adding event ${event.id}`);
        
        const state = get();
        const source = event.isGenerated ? 'generated' : 'manual';
        const unifiedEvent = toUnifiedEvent(event, source, event.isBookmarked || false);
        
        // Skip validation for manual events - users should be able to save whatever they want
        if (event.isGenerated) {
          const errors = validateEvent(event);
          if (errors.length > 0) {
            throw new Error(`Invalid event: ${errors.join(', ')}`);
          }
        }
        
        // Update store
        const newEvents = { ...state.allEvents };
        newEvents[event.id] = unifiedEvent;
        
        const newEventIds = [...state.allEventIds];
        if (!newEventIds.includes(event.id)) {
          newEventIds.push(event.id);
        }
        
        set({
          allEvents: newEvents,
          allEventIds: newEventIds
        });
        
        // Persist if needed
        if (unifiedEvent.metadata.isPersisted) {
          try {
            await eventPersistence.saveEvent(unifiedEvent);
            console.log(`💾 UnifiedStore: Event ${event.id} persisted`);
          } catch (error) {
            console.error(`❌ UnifiedStore: Failed to persist event ${event.id}:`, error);
          }
        }
        
        // Sync to API if not local
        if (!isLocalEvent(event.id)) {
          try {
            await eventService.saveEvent(event);
            console.log(`🌐 UnifiedStore: Event ${event.id} synced to API`);
          } catch (error) {
            console.error(`❌ UnifiedStore: Failed to sync event ${event.id}:`, error);
          }
        }
      },

      // Update existing event
      updateEvent: async (id: string, updates: Partial<AstrologicalEvent>) => {
        console.log(`✏️ UnifiedStore: Updating event ${id}`);
        
        const state = get();
        const existingEvent = state.allEvents[id];
        
        if (!existingEvent) {
          throw new Error(`Event ${id} not found`);
        }
        
        // Merge updates
        const updatedEvent: UnifiedEvent = {
          ...existingEvent,
          ...updates,
          metadata: {
            ...existingEvent.metadata,
            lastModified: new Date().toISOString(),
            syncStatus: 'pending'
          }
        };
        
        // Validate updated event
        const astroEvent = toAstrologicalEvent(updatedEvent);
        const errors = validateEvent(astroEvent);
        if (errors.length > 0) {
          throw new Error(`Invalid event update: ${errors.join(', ')}`);
        }
        
        // Update store
        const newEvents = { ...state.allEvents };
        newEvents[id] = updatedEvent;
        
        set({ allEvents: newEvents });
        
        // Persist if needed
        if (updatedEvent.metadata.isPersisted) {
          try {
            await eventPersistence.saveEvent(updatedEvent);
            console.log(`💾 UnifiedStore: Event ${id} update persisted`);
          } catch (error) {
            console.error(`❌ UnifiedStore: Failed to persist event update ${id}:`, error);
          }
        }
        
        // Sync to API if not local
        if (!isLocalEvent(id)) {
          try {
            await eventService.saveEvent(astroEvent);
            console.log(`🌐 UnifiedStore: Event ${id} update synced to API`);
          } catch (error) {
            console.error(`❌ UnifiedStore: Failed to sync event update ${id}:`, error);
          }
        }
      },

      // Remove event
      removeEvent: async (id: string) => {
        console.log(`🗑️ UnifiedStore: Removing event ${id}`);
        
        const state = get();
        const event = state.allEvents[id];
        
        if (!event) {
          console.warn(`Event ${id} not found for removal`);
          return;
        }
        
        // Update store
        const newEvents = { ...state.allEvents };
        delete newEvents[id];
        
        const newEventIds = state.allEventIds.filter(eventId => eventId !== id);
        
        set({
          allEvents: newEvents,
          allEventIds: newEventIds
        });
        
        // Remove from persistence
        try {
          await eventPersistence.removeEvent(id);
          console.log(`💾 UnifiedStore: Event ${id} removed from persistence`);
        } catch (error) {
          console.error(`❌ UnifiedStore: Failed to remove event ${id} from persistence:`, error);
        }
        
        // Remove from API if not local
        if (!isLocalEvent(id)) {
          try {
            await eventService.deleteEvent(id, event.metadata.userId);
            console.log(`🌐 UnifiedStore: Event ${id} removed from API`);
          } catch (error) {
            console.error(`❌ UnifiedStore: Failed to remove event ${id} from API:`, error);
          }
        }
      },

      // Toggle bookmark status
      toggleBookmark: async (id: string) => {
        console.log(`🔖 UnifiedStore: Toggling bookmark for ${id}`);
        
        const state = get();
        const event = state.allEvents[id];
        
        if (!event) {
          throw new Error(`Event ${id} not found`);
        }
        
        // Toggle bookmark (pure function)
        const updatedEvent = toggleEventBookmark(event);
        
        // Update store
        const newEvents = { ...state.allEvents };
        newEvents[id] = updatedEvent;
        
        set({ allEvents: newEvents });
        
        console.log(`🔖 UnifiedStore: Event ${id} bookmark toggled to ${updatedEvent.metadata.isBookmarked}`);
        
        // Persist the change
        try {
          await eventPersistence.saveEvent(updatedEvent);
          console.log(`💾 UnifiedStore: Bookmark change persisted for ${id}`);
        } catch (error) {
          console.error(`❌ UnifiedStore: Failed to persist bookmark change for ${id}:`, error);
        }
        
        // Sync to API if not local
        if (!isLocalEvent(id)) {
          try {
            await eventService.toggleBookmark(id, event.metadata.userId);
            
            // Update sync status
            const finalEvent = { ...updatedEvent };
            finalEvent.metadata.syncStatus = 'synced';
            
            const syncedEvents = { ...get().allEvents };
            syncedEvents[id] = finalEvent;
            set({ allEvents: syncedEvents });
            
            console.log(`🌐 UnifiedStore: Bookmark change synced to API for ${id}`);
          } catch (error) {
            console.error(`❌ UnifiedStore: Failed to sync bookmark change for ${id}:`, error);
          }
        }
      },

      // Load events for a specific month
      loadMonthEvents: async (userId: string, month: number, year: number) => {
        const monthKey = EventCacheImpl.generateMonthKey(userId, month, year);
        // console.log(`📅 UnifiedStore: Loading events for ${monthKey}`);
        
        set({ isLoading: true });
        
        try {
          // Check cache first
          const cached = eventCache.get(monthKey);
          if (cached) {
            console.log(`📦 UnifiedStore: Using cached events for ${monthKey}`);
            set({ 
              isLoading: false,
              loadedMonths: new Set(Array.from(get().loadedMonths).concat([monthKey]))
            });
            return;
          }
          
          // Load from API
          const apiEvents = await eventService.loadMonthEvents(userId, month, year);
          const unifiedEvents = apiEvents.map(event => toUnifiedEvent(event, 'api', event.isBookmarked));
          
          // Merge with existing events
          const state = get();
          const existingEvents = Object.values(state.allEvents);
          const mergedEvents = mergeEvents(existingEvents, unifiedEvents);
          
          // Update store
          const eventsById = mergedEvents.reduce((acc, event) => {
            acc[event.id] = event;
            return acc;
          }, {} as Record<string, UnifiedEvent>);
          
          const eventIds = mergedEvents.map(event => event.id);
          
          set({
            allEvents: eventsById,
            allEventIds: eventIds,
            isLoading: false,
            loadedMonths: new Set(Array.from(state.loadedMonths).concat([monthKey]))
          });
          
          // Cache the result
          eventCache.set(monthKey, {
            eventIds: apiEvents.map(e => e.id),
            loadedAt: Date.now(),
            expiresAt: Date.now() + (60 * 60 * 1000), // 1 hour
            monthKey
          });
          
          // console.log(`✅ UnifiedStore: Loaded ${apiEvents.length} events for ${monthKey}`);
          
        } catch (error) {
          console.error(`❌ UnifiedStore: Failed to load events for ${monthKey}:`, error);
          set({ isLoading: false });
          throw error;
        }
      },

      // Load persisted events from IndexedDB
      loadPersistedEvents: async () => {
        const state = get();
        
        // Prevent multiple simultaneous loads
        if (state.isLoadingPersisted) {
          console.log('💾 UnifiedStore: Already loading persisted events, skipping');
          return;
        }
        
        set({ isLoadingPersisted: true });
        console.log('💾 UnifiedStore: Loading persisted events');
        
        try {
          const persistedEvents = await eventPersistence.loadEvents();
          
          if (persistedEvents.length === 0) {
            console.log('💾 UnifiedStore: No persisted events found');
            set({ isLoadingPersisted: false });
            return;
          }
          
          // Merge with existing events
          const currentState = get();
          const existingEvents = Object.values(currentState.allEvents);
          const mergedEvents = mergeEvents(existingEvents, persistedEvents);
          
          // Update store
          const eventsById = mergedEvents.reduce((acc, event) => {
            acc[event.id] = event;
            return acc;
          }, {} as Record<string, UnifiedEvent>);
          
          const eventIds = mergedEvents.map(event => event.id);
          
          set({
            allEvents: eventsById,
            allEventIds: eventIds,
            isLoadingPersisted: false
          });
          
          console.log(`✅ UnifiedStore: Loaded ${persistedEvents.length} persisted events`);
          
        } catch (error) {
          console.error('❌ UnifiedStore: Failed to load persisted events:', error);
          set({ isLoadingPersisted: false });
        }
      },

      // Get events by filter
      getEventsByFilter: (filter: EventFilter) => {
        const state = get();
        const allEvents = Object.values(state.allEvents);
        return filterEvents(allEvents, filter);
      },

      // Get all events
      getAllEvents: () => {
        const state = get();
        return Object.values(state.allEvents);
      },

      // Get bookmarked events
      getBookmarkedEvents: () => {
        return get().getEventsByFilter({ isBookmarked: true });
      },

      // Get generated events
      getGeneratedEvents: () => {
        return get().getEventsByFilter({ source: 'generated' });
      },

      // Get manual events
      getManualEvents: () => {
        return get().getEventsByFilter({ source: 'manual' });
      },

      // Clear cache
      clearCache: () => {
        eventCache.clear();
        set({ 
          cache: new Map(),
          loadedMonths: new Set()
        });
        console.log('🧹 UnifiedStore: Cache cleared');
      },

      // Invalidate specific month
      invalidateMonth: (userId: string, month: number, year: number) => {
        const monthKey = EventCacheImpl.generateMonthKey(userId, month, year);
        eventCache.invalidate(monthKey);
        
        const state = get();
        const newLoadedMonths = new Set(state.loadedMonths);
        newLoadedMonths.delete(monthKey);
        
        set({ loadedMonths: newLoadedMonths });
        console.log(`🗑️ UnifiedStore: Invalidated cache for ${monthKey}`);
      },

      // Get event by ID
      getEventById: (id: string) => {
        return get().allEvents[id];
      },

      // Get event statistics
      getEventStats: () => {
        const events = get().getAllEvents();
        return (global as any).calculateEventStats?.(events) || {
          total: events.length,
          bookmarked: events.filter(e => e.metadata.isBookmarked).length,
          sources: { generated: 0, manual: 0, api: 0 },
          types: { benefic: 0, challenging: 0, neutral: 0 },
          averageScore: 0
        };
      }
    }),
    {
      name: 'unified-events-storage',
      partialize: (state) => ({
        // Only persist the event data, not cache or loading state
        allEvents: state.allEvents,
        allEventIds: state.allEventIds
      })
    }
  )
);