/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AstrologicalEvent } from './types';

export const createBookmarkActions = (set: any, get: any) => ({
  // Toggle bookmark via API
  toggleBookmark: async (id: string, userId?: string) => {
    try {
      set({ error: null });
      
      if (!userId) {
        throw new Error('User ID is required to toggle bookmark');
      }
      
      // Check if this is a local/generated event that doesn't exist in the database
      const isLocalEvent = id.startsWith('astro_') || id.startsWith('local_') || id.startsWith('bookmark_');
      
      if (isLocalEvent) {
        // Handle local events without API call
        set((state: any) => {
          // Check both regular events and generated events
          const event = state.events[id] || state.generatedEvents[id];
          
          if (!event) {
            console.error('❌ Event not found for bookmark toggle:', id);
            return state;
          }
          
          // Update the event in the correct location
          const willBeBookmarked = !event.isBookmarked;
          console.log('🔖 Bookmark transition:', {
            from: event.isBookmarked,
            to: willBeBookmarked,
            isInEventsStore: !!state.events[id],
            isInGeneratedStore: !!state.generatedEvents[id]
          });
          
          if (state.events[id]) {
            const result = {
              events: {
                ...state.events,
                [id]: { ...event, isBookmarked: willBeBookmarked }
              }
            };
            return result;
          } else {
            // For generated events, when bookmarking move them to persistent events store
            const updatedEvent = { ...event, isBookmarked: willBeBookmarked };
            
            if (updatedEvent.isBookmarked) {
              const newGeneratedEvents = { ...state.generatedEvents };
              const newGeneratedEventIds = state.generatedEventIds.filter((eid: string) => eid !== id);
              delete newGeneratedEvents[id];
              
              const result = {
                events: {
                  ...state.events,
                  [id]: updatedEvent
                },
                eventIds: [id, ...state.eventIds], // Add to front
                generatedEvents: newGeneratedEvents,
                generatedEventIds: newGeneratedEventIds
              };
              
              console.log('📊 After bookmark update:', {
                newEventsCount: Object.keys(result.events).length,
                newGeneratedCount: Object.keys(result.generatedEvents).length,
                eventNowInEvents: !!result.events[id],
                newBookmarkState: result.events[id]?.isBookmarked
              });
              
              return result;
            } else {
              const newEvents = { ...state.events };
              const newEventIds = state.eventIds.filter((eid: string) => eid !== id);
              delete newEvents[id];
              
              const result = {
                events: newEvents,
                eventIds: newEventIds,
                generatedEvents: {
                  ...state.generatedEvents,
                  [id]: updatedEvent
                },
                generatedEventIds: [id, ...state.generatedEventIds] // Add to front
              };
              
              console.log('📊 After bookmark update (generated):', {
                newEventsCount: Object.keys(result.events).length,
                newGeneratedCount: Object.keys(result.generatedEvents).length,
                eventNowInGenerated: !!result.generatedEvents[id],
                newBookmarkState: result.generatedEvents[id]?.isBookmarked
              });
              
              return result;
            }
          }
        });
        
        // Final state check
        const finalState = get();
        const finalEvent = finalState.events[id] || finalState.generatedEvents[id];
        console.log('🔍 Final bookmark state check:', {
          eventFound: !!finalEvent,
          finalBookmarkState: finalEvent?.isBookmarked,
          nowInEventsStore: !!finalState.events[id],
          nowInGeneratedStore: !!finalState.generatedEvents[id],
          totalEventsInStore: Object.keys(finalState.events).length,
          totalGeneratedInStore: Object.keys(finalState.generatedEvents).length
        });
        
        // CRITICAL: Invalidate cache when bookmarks change to prevent override
        const updatedEvent = finalEvent;
        if (updatedEvent) {
          const eventDate = new Date(updatedEvent.date);
          const monthKey = get().getMonthKey(eventDate.getMonth(), eventDate.getFullYear());
          
          
          // Remove the cached month to force fresh load that includes our migration
          get().cachedMonths.delete(monthKey);
          get().loadedMonths.delete(monthKey);
          
        }
        
        return;
      }
      
      // Handle database events with API call
      const response = await fetch(`/api/events/${id}/bookmark?userId=${userId}`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to toggle bookmark');
      }
      
      const data = await response.json();
      if (data.success) {
        set((state: any) => ({
          events: {
            ...state.events,
            [id]: { ...state.events[id], isBookmarked: data.event.isBookmarked }
          }
        }));
        
        // Update cache for all months that contain this event
        const updatedEvent = get().events[id];
        if (updatedEvent) {
          const eventDate = new Date(updatedEvent.date);
          const monthKey = get().getMonthKey(eventDate.getMonth(), eventDate.getFullYear());
          const cached = get().cachedMonths.get(monthKey);
          if (cached) {
            const updatedCache = {
              ...cached,
              eventIds: cached.eventIds // Keep the same eventIds, main state is updated
            };
            get().cachedMonths.set(monthKey, updatedCache);
          }
        }
      } else {
        throw new Error(data.error || 'Failed to toggle bookmark');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to toggle bookmark' });
      // Fallback to local state change
      set((state: any) => {
        const event = state.events[id] || state.generatedEvents[id];
        if (!event) {
          console.error('Event not found for bookmark toggle:', id);
          return state;
        }
        
        // Update the event in the correct location
        if (state.events[id]) {
          return {
            events: {
              ...state.events,
              [id]: { ...event, isBookmarked: !event.isBookmarked }
            }
          };
        } else {
          // For generated events, when bookmarking move them to persistent events store
          const updatedEvent = { ...event, isBookmarked: !event.isBookmarked };
          
          if (updatedEvent.isBookmarked) {
            // Moving from generatedEvents to events (persistent) when bookmarking
            const newGeneratedEvents = { ...state.generatedEvents };
            const newGeneratedEventIds = state.generatedEventIds.filter((eid: string) => eid !== id);
            delete newGeneratedEvents[id];
            
            return {
              events: {
                ...state.events,
                [id]: updatedEvent
              },
              eventIds: [id, ...state.eventIds], // Add to front
              generatedEvents: newGeneratedEvents,
              generatedEventIds: newGeneratedEventIds
            };
          } else {
            // Moving back to generatedEvents when unbookmarking
            const newEvents = { ...state.events };
            const newEventIds = state.eventIds.filter((eid: string) => eid !== id);
            delete newEvents[id];
            
            return {
              events: newEvents,
              eventIds: newEventIds,
              generatedEvents: {
                ...state.generatedEvents,
                [id]: updatedEvent
              },
              generatedEventIds: [id, ...state.generatedEventIds] // Add to front
            };
          }
        }
      });
      
      // Invalidate cache for fallback too to prevent override
      const updatedEvent = get().events[id] || get().generatedEvents[id];
      if (updatedEvent) {
        const eventDate = new Date(updatedEvent.date);
        const monthKey = get().getMonthKey(eventDate.getMonth(), eventDate.getFullYear());
        
        
        // Remove the cached month to force fresh load that includes our migration
        get().cachedMonths.delete(monthKey);
        get().loadedMonths.delete(monthKey);
      }
    }
  }
});