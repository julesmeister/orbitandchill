/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AstrologicalEvent } from './types';

export const createMonthActions = (set: any, get: any) => ({
  // Helper function to generate month key
  getMonthKey: (month: number, year: number) => `${year}-${String(month + 1).padStart(2, '0')}`,

  // Load events for specific month from API
  loadMonthEvents: async (userId: string, month: number, year: number) => {
    // Prevent multiple simultaneous loads
    if (get().isLoading) {
      return;
    }
    
    const { getMonthKey, cachedMonths } = get();
    const monthKey = getMonthKey(month, year);
    
    // Check if we have cached data for this month (tabs are just UI filters)
    const cached = cachedMonths.get(monthKey);
    const cacheExpiry = 10 * 60 * 1000; // 10 minutes cache
    
    if (cached && (Date.now() - cached.loadedAt < cacheExpiry)) {
      
      // Preserve ALL generated events AND existing persistent events when loading cached data
      const currentState = get();
      const allGeneratedEvents = currentState.generatedEvents;
      const allGeneratedEventIds = currentState.generatedEventIds;
      const existingPersistentEvents = currentState.events || {};
      const existingPersistentEventIds = currentState.eventIds || [];
      
      // Get cached events from main state using cached IDs
      const cachedEventsById = cached.eventIds.reduce((acc: Record<string, AstrologicalEvent>, eventId: string) => {
        const event = currentState.events[eventId];
        if (event) {
          acc[eventId] = event;
        }
        return acc;
      }, {} as Record<string, AstrologicalEvent>);
      
      // CRITICAL: Preserve existing persistent events when using cache
      const mergedCachedEvents = { ...existingPersistentEvents, ...cachedEventsById };
      const mergedCachedEventIds = [...existingPersistentEventIds.filter((id: string) => !cached.eventIds.includes(id)), ...cached.eventIds];
      
      
      // Keep generated events separate from regular events
      set({ 
        events: mergedCachedEvents,
        eventIds: mergedCachedEventIds,
        generatedEvents: allGeneratedEvents,
        generatedEventIds: allGeneratedEventIds
      });
      return;
    }

    try {
      set({ isLoading: true, error: null });
      
      const params = new URLSearchParams({
        userId,
        month: month.toString(),
        year: year.toString(),
        tab: 'all' // Explicitly request all events
      });
      
      const response = await fetch(`/api/events?${params}`);
      if (!response.ok) {
        console.error('❌ Failed to load month events:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url
        });
        
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
        // Preserve ALL generated events when loading fresh data from API
        const currentState = get();
        const allGeneratedEvents = currentState.generatedEvents;
        
        // Convert API events to normalized structure
        const apiEventsById = data.events.reduce((acc: Record<string, AstrologicalEvent>, event: AstrologicalEvent) => {
          acc[event.id] = event;
          return acc;
        }, {} as Record<string, AstrologicalEvent>);
        
        const apiEventIds = new Set(data.events.map((e: AstrologicalEvent) => e.id));
        const allGeneratedEventIds = currentState.generatedEventIds || [];
        const uniqueGeneratedEventIds = allGeneratedEventIds.filter((eventId: string) => !apiEventIds.has(eventId));
        
        if (uniqueGeneratedEventIds.length > 0) {
        }
        
        // Cache the loaded data (tabs are just UI filters, not server data)
        const newCachedMonths = new Map(cachedMonths);
        newCachedMonths.set(monthKey, {
          eventIds: data.events.map((e: AstrologicalEvent) => e.id), // Cache only API event IDs
          loadedAt: Date.now(),
          tab: 'all'
        });
        
        // CRITICAL: Preserve existing persistent events (like bookmarked generated events)
        const existingPersistentEvents = currentState.events || {};
        const existingPersistentEventIds = currentState.eventIds || [];
        
        // Merge API events with existing persistent events, API events take precedence
        const mergedEvents = { ...existingPersistentEvents, ...apiEventsById };
        const apiEventIdArray = data.events.map((e: AstrologicalEvent) => e.id);
        const mergedEventIds = [...existingPersistentEventIds.filter((id: string) => !apiEventIdArray.includes(id)), ...apiEventIdArray];
        
        
        set({ 
          events: mergedEvents, // Merge existing persistent + API events
          eventIds: mergedEventIds, // Merge existing persistent + API event IDs
          generatedEvents: allGeneratedEvents, // Keep generated events separate
          generatedEventIds: uniqueGeneratedEventIds, // Keep generated event IDs
          isLoading: false,
          cachedMonths: newCachedMonths,
          loadedMonths: new Set([...get().loadedMonths, monthKey])
        });
        
      } else {
        throw new Error(data.error || 'Failed to load month events');
      }
    } catch (error) {
      console.error('Error loading month events:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load month events',
        isLoading: false 
      });
    }
  }
});