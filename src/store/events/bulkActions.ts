/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AstrologicalEvent } from './types';

export const createBulkActions = (set: any, get: any) => ({
  // Add multiple events via API (with validation and deduplication)
  addEvents: async (newEvents: AstrologicalEvent[]) => {
    if (!Array.isArray(newEvents) || newEvents.length === 0) {
      return;
    }
    
    // Deduplicate events based on key characteristics
    const { events: existingEvents, eventIds } = get();
    const createEventHash = (event: AstrologicalEvent) => 
      `${event.date}-${event.time}-${event.title}-${event.score}-${event.type}`;
    
    const existingEventsArray = (eventIds || []).map((id: string) => existingEvents[id]).filter(Boolean);
    const existingHashes = new Set(existingEventsArray.map(createEventHash));
    const uniqueNewEvents = newEvents.filter(event => {
      const hash = createEventHash(event);
      return !existingHashes.has(hash);
    });
    
    try {
      
      const duplicateCount = newEvents.length - uniqueNewEvents.length;
      if (duplicateCount > 0) {
      }
      
      if (uniqueNewEvents.length === 0) {
        return;
      }
      
      // Validate events before sending to API
      const invalidEvents = uniqueNewEvents.filter(event => {
        return !event.userId || !event.title || !event.date || !event.type || !event.description;
      });
      
      if (invalidEvents.length > 0) {
        console.error('❌ Invalid events found:', invalidEvents.map(e => ({
          id: e.id,
          userId: e.userId,
          title: e.title?.substring(0, 20),
          date: e.date,
          type: e.type,
          hasDescription: !!e.description
        })));
        throw new Error(`${invalidEvents.length} events missing required fields: userId, title, date, type, or description`);
      }
      
      // Check for invalid event types
      const invalidTypes = uniqueNewEvents.filter(event => 
        !['benefic', 'challenging', 'neutral'].includes(event.type)
      );
      
      if (invalidTypes.length > 0) {
        console.error('❌ Invalid event types found:', invalidTypes.map(e => ({
          id: e.id,
          type: e.type,
          title: e.title?.substring(0, 20)
        })));
        throw new Error(`${invalidTypes.length} events have invalid type. Must be: benefic, challenging, or neutral`);
      }
      
      // Send validated events to bulk API endpoint
      
      // Use bulk endpoint for better performance and reliability
      const response = await fetch('/api/events/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: uniqueNewEvents })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Use the events returned from the database (with proper IDs)
          const newEventsById = data.events.reduce((acc: Record<string, AstrologicalEvent>, event: AstrologicalEvent) => {
            acc[event.id] = event;
            return acc;
          }, {});
          
          set((state: any) => ({ 
            events: { ...newEventsById, ...state.events },
            eventIds: [...data.events.map((e: AstrologicalEvent) => e.id), ...state.eventIds]
          }));
          
          if (data.localOnly) {
            // Set a warning that will be handled by the UI
            set({ 
              error: `Events generated successfully but database is unavailable. ${data.events.length} events are stored locally and may not persist between sessions.`
            });
          } else {
          }
        } else {
          throw new Error(data.error || 'Bulk creation failed');
        }
      } else {
        let errorMessage = `HTTP ${response.status}: Failed to save events`;
        try {
          const errorData = await response.json();
          console.error('🚨 Server error response:', errorData);
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          console.error('🚨 Could not parse server error response');
          const responseText = await response.text().catch(() => 'No response text');
          console.error('🚨 Raw response:', responseText);
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error bulk adding events:', error);
      // Set error but also fall back to local storage of valid events
      const errorMessage = error instanceof Error ? error.message : 'Failed to add events';
      set({ error: errorMessage });
      
      // Still add events locally as fallback (only the unique valid ones)
      if (uniqueNewEvents.length > 0) {
        set((state: any) => {
          const newEventsById = uniqueNewEvents.reduce((acc: Record<string, AstrologicalEvent>, event: AstrologicalEvent) => {
            acc[event.id] = event;
            return acc;
          }, {} as Record<string, AstrologicalEvent>);
          
          return {
            events: { ...state.events, ...newEventsById },
            eventIds: [...uniqueNewEvents.map(e => e.id), ...state.eventIds]
          };
        });
      }
    }
  },

  // Add multiple events directly to local state (no API call)
  addEventsLocal: (newEvents: AstrologicalEvent[]) => {
    set((state: any) => {
      const eventsById = newEvents.reduce((acc: Record<string, AstrologicalEvent>, event: AstrologicalEvent) => {
        acc[event.id] = event;
        return acc;
      }, {} as Record<string, AstrologicalEvent>);
      
      const newEventIds = newEvents.map(e => e.id);
      
      // Place generated events in generatedEvents collection
      return {
        generatedEvents: { ...state.generatedEvents, ...eventsById },
        generatedEventIds: [...newEventIds, ...(state.generatedEventIds || [])]
      };
    });
  },

  // Clear generated events (with optional target date filtering)
  clearGeneratedEvents: async (userId: string, targetDate?: Date) => {
    try {
      set({ error: null });
      
      const params = new URLSearchParams({
        userId,
        generated: 'true'
      });
      
      if (targetDate) {
        params.append('date', targetDate.toISOString().split('T')[0]);
      }
      
      // Clear from database first
      const response = await fetch(`/api/events/bulk?${params}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log(`✅ Cleared ${data.deletedCount} generated events from database`);
        }
      } else {
        // Continue with local clearing even if API fails
        console.warn('API clear failed, continuing with local clear');
      }
      
      // Clear from local state (clear all generated or filter by date)
      set((state: any) => {
        const currentGeneratedEvents = state.generatedEvents;
        const currentGeneratedEventIds = state.generatedEventIds || [];
        
        if (!targetDate) {
          // Clear all generated events
          return {
            generatedEvents: {},
            generatedEventIds: []
          };
        } else {
          // Filter by target date
          const targetDateString = targetDate.toISOString().split('T')[0];
          const filteredEventIds = currentGeneratedEventIds.filter((id: string) => {
            const event = currentGeneratedEvents[id];
            return event && event.date !== targetDateString;
          });
          
          const filteredEvents = filteredEventIds.reduce((acc: Record<string, AstrologicalEvent>, id: string) => {
            acc[id] = currentGeneratedEvents[id];
            return acc;
          }, {} as Record<string, AstrologicalEvent>);
          
          return {
            generatedEvents: filteredEvents,
            generatedEventIds: filteredEventIds
          };
        }
      });
      
      // Also clear from cache if we have month info
      if (targetDate) {
        const monthKey = get().getMonthKey(targetDate.getMonth(), targetDate.getFullYear());
        const cachedMonths = new Map(get().cachedMonths);
        cachedMonths.delete(monthKey);
        const loadedMonths = new Set(get().loadedMonths);
        loadedMonths.delete(monthKey);
        
        set({
          cachedMonths,
          loadedMonths
        });
      }
    } catch (error) {
      console.error('Error clearing generated events:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to clear generated events' });
      
      // Fallback: still clear locally even if API failed
      set((state: any) => {
        if (!targetDate) {
          return {
            generatedEvents: {},
            generatedEventIds: []
          };
        } else {
          const targetDateString = targetDate.toISOString().split('T')[0];
          const currentGeneratedEvents = state.generatedEvents;
          const currentGeneratedEventIds = state.generatedEventIds || [];
          
          const filteredEventIds = currentGeneratedEventIds.filter((id: string) => {
            const event = currentGeneratedEvents[id];
            return event && event.date !== targetDateString;
          });
          
          const filteredEvents = filteredEventIds.reduce((acc: Record<string, AstrologicalEvent>, id: string) => {
            acc[id] = currentGeneratedEvents[id];
            return acc;
          }, {} as Record<string, AstrologicalEvent>);
          
          return {
            generatedEvents: filteredEvents,
            generatedEventIds: filteredEventIds
          };
        }
      });
    }
  },

  // Clear persisted events (local state only)
  clearPersistedEvents: () => {
    set({
      events: {},
      eventIds: []
    });
  }
});