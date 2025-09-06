/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AstrologicalEvent } from './types';

export const createApiActions = (set: any, get: any) => ({
  // Load events from API
  loadEvents: async (userId: string, tab?: string, filters = {}) => {
    // Prevent multiple simultaneous loads
    if (get().isLoading) {
      return;
    }
    
    try {
      set({ isLoading: true, error: null });
      
      // Use provided tab or get current tab from store state
      const currentTab = tab || get().selectedTab;
      
      const params = new URLSearchParams({
        userId,
        tab: currentTab, // Include the tab parameter
        ...filters
      });
      
      const response = await fetch(`/api/events?${params}`);
      if (!response.ok) {
        console.error('❌ Failed to load events:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url
        });
        
        // Try to get error details
        try {
          const errorData = await response.json();
          console.error('❌ Server error:', errorData);
          throw new Error(errorData.error || `HTTP ${response.status}: Failed to load events`);
        } catch (jsonError) {
          throw new Error(`HTTP ${response.status}: Failed to load events`);
        }
      }
      
      const data = await response.json();
      if (data.success) {
        // For bookmarked/manual tabs, we need to separate generated events from API events
        const apiEvents = data.events.filter((e: AstrologicalEvent) => !e.isGenerated);
        const generatedEventsFromApi = data.events.filter((e: AstrologicalEvent) => e.isGenerated);
        
        // Preserve existing local generated events and merge with any generated events from API
        const currentState = get();
        const existingGeneratedEvents = currentState.generatedEvents;
        const existingGeneratedEventIds = currentState.generatedEventIds;
        
        // Merge generated events, avoiding duplicates
        const allGeneratedEvents = { ...existingGeneratedEvents };
        const allGeneratedEventIds = [...(existingGeneratedEventIds || [])];
        
        generatedEventsFromApi.forEach((event: AstrologicalEvent) => {
          if (!allGeneratedEvents[event.id]) {
            allGeneratedEvents[event.id] = event;
            allGeneratedEventIds.push(event.id);
          }
        });
        
        // Convert API events to normalized structure
        const apiEventsById = apiEvents.reduce((acc: Record<string, AstrologicalEvent>, event: AstrologicalEvent) => {
          acc[event.id] = event;
          return acc;
        }, {} as Record<string, AstrologicalEvent>);
        const apiEventIds = apiEvents.map((e: AstrologicalEvent) => e.id);
        
        set({ 
          events: apiEventsById,
          eventIds: apiEventIds,
          generatedEvents: allGeneratedEvents,
          generatedEventIds: allGeneratedEventIds,
          isLoading: false 
        });
      } else {
        throw new Error(data.error || 'Failed to load events');
      }
    } catch (error) {
      console.error('Error loading events:', error);
      // Keep existing events in state when API load fails
      
      // Don't clear existing events on load failure - keep them in local state
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load events',
        isLoading: false 
        // Note: Not clearing events here - preserves generated events if API fails
      });
    }
  },

  // Add single event via API
  addEvent: async (event: AstrologicalEvent) => {
    try {
      set({ error: null });
      
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create event');
      }
      
      const data = await response.json();
      if (data.success) {
        const newEvent = data.event;
        set((state: any) => ({ 
          events: { ...state.events, [newEvent.id]: newEvent },
          eventIds: [newEvent.id, ...state.eventIds]
        }));
        
        // Update cache for the event's month
        const eventDate = new Date(newEvent.date);
        const monthKey = get().getMonthKey(eventDate.getMonth(), eventDate.getFullYear());
        const cached = get().cachedMonths.get(monthKey);
        if (cached) {
          // Update cached data with new event
          const updatedCache = {
            ...cached,
            eventIds: [newEvent.id, ...cached.eventIds]
          };
          get().cachedMonths.set(monthKey, updatedCache);
        }
      } else {
        throw new Error(data.error || 'Failed to create event');
      }
    } catch (error) {
      console.error('Error adding event:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to add event' });
      // Still add to local state as fallback
      set((state: any) => ({ 
        events: { ...state.events, [event.id]: event },
        eventIds: [event.id, ...state.eventIds]
      }));
      
      // Update cache for fallback too
      const eventDate = new Date(event.date);
      const monthKey = get().getMonthKey(eventDate.getMonth(), eventDate.getFullYear());
      const cached = get().cachedMonths.get(monthKey);
      if (cached) {
        const updatedCache = {
          ...cached,
          eventIds: [event.id, ...cached.eventIds]
        };
        get().cachedMonths.set(monthKey, updatedCache);
      }
    }
  },

  // Update event via API
  updateEvent: async (id: string, updates: Partial<AstrologicalEvent>) => {
    try {
      set({ error: null });
      
      const response = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update event');
      }
      
      const data = await response.json();
      set((state: any) => ({
        events: {
          ...state.events,
          [id]: { ...state.events[id], ...data.event }
        }
      }));
    } catch (error) {
      console.error('Error updating event:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to update event' });
    }
  },

  // Delete event via API
  deleteEvent: async (id: string, userId?: string) => {
    try {
      set({ error: null });
      
      if (!userId) {
        throw new Error('User ID is required to delete event');
      }
      
      const response = await fetch(`/api/events?id=${id}&userId=${userId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete event');
      }
      
      const data = await response.json();
      if (data.success) {
        set((state: any) => {
          // Remove from regular events
          const newEvents = { ...state.events };
          delete newEvents[id];
          const newEventIds = state.eventIds.filter((eventId: string) => eventId !== id);
          
          // CRITICAL FIX: Also remove from generated events (events can exist in both collections)
          const newGeneratedEvents = { ...state.generatedEvents };
          delete newGeneratedEvents[id];
          const newGeneratedEventIds = state.generatedEventIds.filter((eventId: string) => eventId !== id);
          
          // CRITICAL FIX: Clear all cached months to prevent deleted events from reappearing on refresh
          // The cache was preserving deleted events when the page reloaded
          const clearedCachedMonths = new Map();
          const clearedLoadedMonths = new Set<string>();
          
          return { 
            events: newEvents,
            eventIds: newEventIds,
            generatedEvents: newGeneratedEvents,
            generatedEventIds: newGeneratedEventIds,
            cachedMonths: clearedCachedMonths,
            loadedMonths: clearedLoadedMonths
          };
        });
      } else {
        throw new Error(data.error || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to delete event' });
    }
  }
});