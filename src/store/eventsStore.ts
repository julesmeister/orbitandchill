import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AstrologicalEvent {
  id: string;
  userId?: string;
  title: string;
  date: string;
  time?: string;
  type: 'benefic' | 'challenging' | 'neutral';
  description: string;
  aspects: string[];
  planetaryPositions: string[];
  score: number;
  isGenerated: boolean;
  createdAt: string;
  priorities?: string[];
  chartData?: {
    planets?: Array<{
      name: string;
      retrograde?: boolean;
      [key: string]: any;
    }>;
    [key: string]: any;
  };
  isBookmarked?: boolean;
  timingMethod?: 'houses' | 'aspects' | 'electional' | 'combined'; // Track which analysis method generated this event
  timeWindow?: {
    startTime: string; // Format: "HH:MM"
    endTime: string;   // Format: "HH:MM"
    duration: string;  // Human readable: "2 hours 30 minutes"
  };
  // Location data for location-specific filtering
  locationName?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  // Enhanced electional astrology metadata for advanced filtering
  electionalData?: {
    mercuryStatus: 'direct' | 'retrograde';
    moonPhase: 'new' | 'waxing_crescent' | 'first_quarter' | 'waxing_gibbous' | 'full' | 'waning_gibbous' | 'last_quarter' | 'waning_crescent';
    beneficsAngular: boolean; // Venus or Jupiter in houses 1, 4, 7, 10
    maleficAspects: string[]; // List of challenging Mars/Saturn/Pluto aspects
    prohibitions: string[]; // Active electional prohibitions
    dignifiedPlanets: { planet: string; dignity: 'exaltation' | 'rulership' | 'detriment' | 'fall' | 'neutral' }[];
    electionalReady: boolean; // Meets traditional electional standards
  };
}

interface EventsState {
  // State
  events: AstrologicalEvent[];
  showCalendar: boolean;
  currentDate: Date;
  selectedType: 'all' | 'benefic' | 'challenging' | 'neutral';
  selectedPriorities: string[];
  showAddForm: boolean;
  showTimingOptions: boolean;
  isGenerating: boolean;
  selectedTab: 'all' | 'bookmarked' | 'manual';
  hideChallengingDates: boolean;
  showCombosOnly: boolean;
  showAspects: boolean;
  showHousesOnly: boolean; // Filter to show only house-based timing
  showAspectsOnly: boolean; // Filter to show only aspect-based timing
  showElectionalOnly: boolean; // Filter to show only electional timing
  isLoading: boolean;
  error: string | null;

  // Actions
  setEvents: (events: AstrologicalEvent[]) => void;
  loadEvents: (userId: string, filters?: any) => Promise<void>;
  addEvent: (event: AstrologicalEvent) => Promise<void>;
  addEvents: (events: AstrologicalEvent[]) => Promise<void>;
  updateEvent: (id: string, updates: Partial<AstrologicalEvent>) => Promise<void>;
  deleteEvent: (id: string, userId?: string) => Promise<void>;
  toggleBookmark: (id: string, userId?: string) => Promise<void>;
  setShowCalendar: (show: boolean) => void;
  setCurrentDate: (date: Date) => void;
  setSelectedType: (type: 'all' | 'benefic' | 'challenging' | 'neutral') => void;
  setSelectedPriorities: (priorities: string[]) => void;
  togglePriority: (priorityId: string) => void;
  setShowAddForm: (show: boolean) => void;
  setShowTimingOptions: (show: boolean) => void;
  setIsGenerating: (generating: boolean) => void;
  clearGeneratedEvents: (userId: string, targetDate?: Date) => Promise<void>;
  clearPersistedEvents: () => void;
  resetForm: () => void;
  setSelectedTab: (tab: 'all' | 'bookmarked' | 'manual') => void;
  setHideChallengingDates: (hide: boolean) => void;
  setShowCombosOnly: (show: boolean) => void;
  setShowAspects: (show: boolean) => void;
  setShowHousesOnly: (show: boolean) => void;
  setShowAspectsOnly: (show: boolean) => void;
  setShowElectionalOnly: (show: boolean) => void;
  setError: (error: string | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useEventsStore = create<EventsState>()(
  persist(
    (set, get) => ({
      // Initial state
      events: [],
      showCalendar: true, // Show calendar by default so users can see toggles
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

      // Actions
      setEvents: (events) => set({ events }),
      setError: (error) => set({ error }),
      setIsLoading: (loading) => set({ isLoading: loading }),

      // Load events from API
      loadEvents: async (userId: string, filters = {}) => {
        try {
          set({ isLoading: true, error: null });
          
          // Get current tab from store state to include in API request
          const { selectedTab } = get();
          
          const params = new URLSearchParams({
            userId,
            tab: selectedTab, // Include the tab parameter
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
            set({ events: data.events, isLoading: false });
          } else {
            throw new Error(data.error || 'Failed to load events');
          }
        } catch (error) {
          console.error('Error loading events:', error);
          console.warn('⚠️ Keeping existing events in state due to load failure');
          
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
            set((state) => ({ 
              events: [data.event, ...state.events] 
            }));
          } else {
            throw new Error(data.error || 'Failed to create event');
          }
        } catch (error) {
          console.error('Error adding event:', error);
          set({ error: error instanceof Error ? error.message : 'Failed to add event' });
          // Still add to local state as fallback
          set((state) => ({ 
            events: [event, ...state.events] 
          }));
        }
      },
      
      // Add multiple events via API using bulk endpoint
      addEvents: async (newEvents: AstrologicalEvent[]) => {
        set({ error: null });
        
        if (newEvents.length === 0) return;
        
        // Deduplicate events based on key characteristics
        const { events: existingEvents } = get();
        const createEventHash = (event: AstrologicalEvent) => 
          `${event.date}-${event.time}-${event.title}-${event.score}-${event.type}`;
        
        const existingHashes = new Set(existingEvents.map(createEventHash));
        const uniqueNewEvents = newEvents.filter(event => {
          const hash = createEventHash(event);
          return !existingHashes.has(hash);
        });
        
        try {
          
          const duplicateCount = newEvents.length - uniqueNewEvents.length;
          if (duplicateCount > 0) {
            console.log(`🔄 Deduplicated ${duplicateCount} duplicate events out of ${newEvents.length}`);
          }
          
          if (uniqueNewEvents.length === 0) {
            console.log('✅ No new unique events to add');
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
          
          // Debug: Log events being sent to API
          console.log(`📤 Sending ${uniqueNewEvents.length} validated unique events to bulk API:`);
          console.log('First event sample:', JSON.stringify(uniqueNewEvents[0], null, 2));
          console.log('Event structure check:', {
            hasUserId: !!uniqueNewEvents[0]?.userId,
            hasTitle: !!uniqueNewEvents[0]?.title,
            hasDate: !!uniqueNewEvents[0]?.date,
            hasType: !!uniqueNewEvents[0]?.type,
            hasDescription: !!uniqueNewEvents[0]?.description,
            typeValue: uniqueNewEvents[0]?.type,
            dateValue: uniqueNewEvents[0]?.date,
            keys: Object.keys(uniqueNewEvents[0] || {})
          });
          
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
              set((state) => ({ 
                events: [...data.events, ...state.events] 
              }));
              
              if (data.localOnly) {
                console.log(`⚠️ Events created as local-only: ${data.events.length} events (database unavailable)`);
                // Set a warning that will be handled by the UI
                set({ 
                  error: `Events generated successfully but database is unavailable. ${data.events.length} events are stored locally and may not persist between sessions.`
                });
              } else {
                console.log(`✅ Successfully saved ${data.events.length} events to database`);
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
          console.error('Error adding events via bulk API:', error);
          set({ error: error instanceof Error ? error.message : 'Failed to add events' });
          
          // Fallback: Add to local state and show user a warning
          console.warn('⚠️ Events added to local state only - they may disappear on page refresh');
          
          // Generate local IDs for unique events since database save failed
          const eventsWithLocalIds = uniqueNewEvents.map((event: AstrologicalEvent, index: number) => ({
            ...event,
            id: `local_${Date.now()}_${index}` // Ensure unique local IDs
          }));
          
          set((state) => ({ 
            events: [...eventsWithLocalIds, ...state.events] 
          }));
          
          // Set a more helpful error message for the user
          const userMessage = error instanceof Error 
            ? `Events generated successfully but not saved to database: ${error.message}. They will disappear on page refresh.`
            : 'Events generated successfully but not saved to database. They will disappear on page refresh.';
          set({ error: userMessage });
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
          set((state) => ({
            events: state.events.map(event => 
              event.id === id ? { ...event, ...data.event } : event
            )
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
            set((state) => ({ 
              events: state.events.filter(e => e.id !== id) 
            }));
          } else {
            throw new Error(data.error || 'Failed to delete event');
          }
        } catch (error) {
          console.error('Error deleting event:', error);
          set({ error: error instanceof Error ? error.message : 'Failed to delete event' });
        }
      },
      
      // Toggle bookmark via API
      toggleBookmark: async (id: string, userId?: string) => {
        try {
          set({ error: null });
          
          if (!userId) {
            throw new Error('User ID is required to toggle bookmark');
          }
          
          const response = await fetch(`/api/events/${id}/bookmark?userId=${userId}`, {
            method: 'POST'
          });
          
          if (!response.ok) {
            throw new Error('Failed to toggle bookmark');
          }
          
          const data = await response.json();
          if (data.success) {
            set((state) => ({
              events: state.events.map(event => 
                event.id === id ? { ...event, isBookmarked: data.event.isBookmarked } : event
              )
            }));
          } else {
            throw new Error(data.error || 'Failed to toggle bookmark');
          }
        } catch (error) {
          console.error('Error toggling bookmark:', error);
          set({ error: error instanceof Error ? error.message : 'Failed to toggle bookmark' });
          // Fallback to local state change
          set((state) => ({
            events: state.events.map(event => 
              event.id === id 
                ? { ...event, isBookmarked: !event.isBookmarked }
                : event
            )
          }));
        }
      },

      // Clear generated events via API
      // Clear any persisted events from localStorage (for data integrity)
      clearPersistedEvents: () => {
        try {
          const storedData = localStorage.getItem('luckstrology-events-storage');
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            if (parsedData.state && parsedData.state.events) {
              console.log('🧹 Clearing persisted events from localStorage...');
              delete parsedData.state.events;
              localStorage.setItem('luckstrology-events-storage', JSON.stringify(parsedData));
            }
          }
        } catch (error) {
          console.warn('⚠️ Could not clear persisted events from localStorage:', error);
        }
      },

      clearGeneratedEvents: async (userId: string, targetDate?: Date) => {
        try {
          set({ error: null });
          
          console.log(`🗑️ Clearing generated events for user ${userId}${targetDate ? ` for ${targetDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : ' (all months)'}...`);
          
          // Clear any persisted events from localStorage first
          const { clearPersistedEvents } = get();
          clearPersistedEvents();
          
          // Build query parameters
          const params = new URLSearchParams({ userId, clearGenerated: 'true' });
          if (targetDate) {
            params.set('month', targetDate.getMonth().toString());
            params.set('year', targetDate.getFullYear().toString());
          }
          
          // Use the bulk delete API endpoint with month filtering
          const response = await fetch(`/api/events?${params.toString()}`, {
            method: 'DELETE'
          });
          
          if (!response.ok) {
            // Try to get detailed error information
            let errorMessage = `HTTP ${response.status}: Failed to clear generated events`;
            try {
              const errorData = await response.json();
              errorMessage = errorData.error || errorMessage;
            } catch (jsonError) {
              // Fallback to status-based message
              console.warn('Could not parse error response:', jsonError);
            }
            throw new Error(errorMessage);
          }
          
          const data = await response.json();
          console.log(`🔄 API Response:`, data);
          
          if (data.success) {
            console.log(`✅ Successfully cleared ${data.deletedCount} generated events from database`);
            
            // Get current state for before/after comparison
            const currentState = get();
            const beforeCount = currentState.events.length;
            
            // Immediately update local state to remove generated events and pattern-matching events
            set((state) => ({
              events: state.events.filter(e => {
                // Keep bookmarked events
                if (e.isBookmarked) return true;
                
                // Remove events marked as generated
                if (e.isGenerated) return false;
                
                // Remove events that match generated patterns (aggressive cleanup)
                const title = e.title || '';
                const isGeneratedPattern = (
                  title.includes('Jupiter') || 
                  title.includes('Venus') || 
                  title.includes('&') ||
                  title.includes('exalted') ||
                  title.includes('House') ||
                  title.includes('Moon') ||
                  title.includes('Mars') ||
                  title.includes('Mercury') ||
                  title.includes('Saturn') ||
                  title.includes('Sun') ||
                  title.includes('Pluto') ||
                  title.includes('Neptune') ||
                  title.includes('Uranus')
                );
                
                return !isGeneratedPattern;
              })
            }));
            
            // Show immediate feedback
            const afterState = get();
            const afterCount = afterState.events.length;
            const localRemovedCount = beforeCount - afterCount;
            
            console.log(`🔄 Local state updated: ${beforeCount} → ${afterCount} events (removed ${localRemovedCount} locally)`);
            
            // Reload events from database to ensure consistency
            console.log('🔄 Reloading events from database to ensure consistency...');
            const { loadEvents } = get();
            await loadEvents(userId);
            
          } else {
            throw new Error(data.error || 'Failed to clear generated events');
          }
          
        } catch (error) {
          console.error('❌ Error clearing generated events:', error);
          set({ error: error instanceof Error ? error.message : 'Failed to clear generated events' });
        }
      },

      
      setShowCalendar: (show) => set({ showCalendar: show }),
      
      setCurrentDate: (date) => set({ currentDate: date }),
      
      setSelectedType: (type) => set({ selectedType: type }),
      
      setSelectedPriorities: (priorities) => set({ selectedPriorities: priorities }),
      
      togglePriority: (priorityId) => set((state) => ({
        selectedPriorities: state.selectedPriorities.includes(priorityId)
          ? state.selectedPriorities.filter(p => p !== priorityId)
          : [...state.selectedPriorities, priorityId]
      })),
      
      setShowAddForm: (show) => set({ showAddForm: show }),
      
      setShowTimingOptions: (show) => set({ showTimingOptions: show }),
      
      setIsGenerating: (generating) => set({ isGenerating: generating }),
      
      resetForm: () => set({
        showAddForm: false,
        showTimingOptions: false,
        selectedPriorities: []
      }),
      
      setSelectedTab: (tab) => set({ selectedTab: tab }),
      
      setHideChallengingDates: (hide) => set({ hideChallengingDates: hide }),
      
      setShowCombosOnly: (show) => set({ showCombosOnly: show }),
      setShowAspects: (show) => set({ showAspects: show }),
      setShowHousesOnly: (show) => set({ showHousesOnly: show }),
      setShowAspectsOnly: (show) => set({ showAspectsOnly: show }),
      setShowElectionalOnly: (show) => set({ showElectionalOnly: show })
    }),
    {
      name: "luckstrology-events-storage",
      // Serialize Date objects properly - EXCLUDE events from persistence
      partialize: (state) => {
        const { events, isLoading, error, ...persistableState } = state;
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
          
          // Ensure events are always empty on rehydration (they come from database)
          state.events = [];
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