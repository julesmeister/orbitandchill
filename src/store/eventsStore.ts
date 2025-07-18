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
  // Normalized state structure
  events: Record<string, AstrologicalEvent>; // Events by ID for O(1) lookup
  generatedEvents: Record<string, AstrologicalEvent>; // Generated events by ID
  eventIds: string[]; // Array of regular event IDs for ordering
  generatedEventIds: string[]; // Array of generated event IDs for ordering
  
  // Month-based caching: key is "YYYY-MM" format
  cachedMonths: Map<string, { 
    eventIds: string[]; // Just store IDs, events are in main state
    loadedAt: number; // timestamp
    tab: 'all' | 'bookmarked' | 'manual'; // which tab was active when loaded
  }>;
  loadedMonths: Set<string>; // Track which months have been loaded
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

  // Computed properties
  getAllEvents: () => AstrologicalEvent[];
  
  // Actions
  setEvents: (events: AstrologicalEvent[]) => void;
  loadEvents: (userId: string, tab?: string, filters?: any) => Promise<void>;
  loadMonthEvents: (userId: string, month: number, year: number) => Promise<void>;
  getMonthKey: (month: number, year: number) => string;
  addEvent: (event: AstrologicalEvent) => Promise<void>;
  addEvents: (events: AstrologicalEvent[]) => Promise<void>;
  addEventsLocal: (events: AstrologicalEvent[]) => void;
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
      events: {},
      generatedEvents: {},
      eventIds: [],
      generatedEventIds: [],
      cachedMonths: new Map(),
      loadedMonths: new Set(),
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

      // Computed properties - Memoized to prevent unnecessary re-renders
      getAllEvents: (() => {
        let cachedEvents: AstrologicalEvent[] = [];
        let lastEventIdsLength = 0;
        let lastGeneratedEventIdsLength = 0;
        let lastEventIdsHash = '';
        let lastGeneratedEventIdsHash = '';
        
        return () => {
          const { events, generatedEvents, eventIds, generatedEventIds } = get();
          
          // Quick length check first
          if ((eventIds?.length || 0) === lastEventIdsLength && (generatedEventIds?.length || 0) === lastGeneratedEventIdsLength) {
            // Create simple hash for deeper comparison
            const eventIdsHash = (eventIds || []).join(',');
            const generatedEventIdsHash = (generatedEventIds || []).join(',');
            
            if (eventIdsHash === lastEventIdsHash && generatedEventIdsHash === lastGeneratedEventIdsHash) {
              return cachedEvents;
            }
          }
          
          // Recalculate only when needed
          const regularEvents = (eventIds || []).map(id => events[id]).filter(Boolean);
          const generatedEventsArray = (generatedEventIds || []).map(id => generatedEvents[id]).filter(Boolean);
          const allEvents = [...regularEvents, ...generatedEventsArray];
          
          // Update cache
          cachedEvents = allEvents;
          lastEventIdsLength = eventIds?.length || 0;
          lastGeneratedEventIdsLength = generatedEventIds?.length || 0;
          lastEventIdsHash = (eventIds || []).join(',');
          lastGeneratedEventIdsHash = (generatedEventIds || []).join(',');
          
          return allEvents;
        };
      })(),
      
      // Actions
      setEvents: (events) => {
        const eventsById = events.reduce((acc, event) => {
          acc[event.id] = event;
          return acc;
        }, {} as Record<string, AstrologicalEvent>);
        const eventIds = events.map(event => event.id);
        set({ events: eventsById, eventIds });
      },
      setError: (error) => set({ error }),
      setIsLoading: (loading) => set({ isLoading: loading }),

      // Helper function to generate month key
      getMonthKey: (month: number, year: number) => `${year}-${String(month + 1).padStart(2, '0')}`,

      // Load events for specific month from API
      loadMonthEvents: async (userId: string, month: number, year: number) => {
        // Prevent multiple simultaneous loads
        if (get().isLoading) {
          console.log('⏳ Already loading events, skipping month load...');
          return;
        }
        
        const { getMonthKey, cachedMonths } = get();
        const monthKey = getMonthKey(month, year);
        
        // Check if we have cached data for this month (tabs are just UI filters)
        const cached = cachedMonths.get(monthKey);
        const cacheExpiry = 10 * 60 * 1000; // 10 minutes cache
        
        if (cached && (Date.now() - cached.loadedAt < cacheExpiry)) {
          console.log(`📋 Using cached events for ${monthKey} (${cached.eventIds.length} events)`);
          
          // Preserve ALL generated events when loading cached data
          const currentState = get();
          const allGeneratedEvents = currentState.generatedEvents;
          const allGeneratedEventIds = currentState.generatedEventIds;
          
          // Get cached events from main state using cached IDs
          const cachedEventsById = cached.eventIds.reduce((acc, eventId) => {
            const event = currentState.events[eventId];
            if (event) {
              acc[eventId] = event;
            }
            return acc;
          }, {} as Record<string, AstrologicalEvent>);
          const cachedEventIds = cached.eventIds;
          
          // Keep generated events separate from regular events
          set({ 
            events: cachedEventsById,
            eventIds: cachedEventIds,
            generatedEvents: allGeneratedEvents,
            generatedEventIds: allGeneratedEventIds
          });
          console.log(`📊 State after cached load: ${cached.eventIds.length} regular, ${allGeneratedEventIds?.length || 0} generated`);
          return;
        }

        try {
          set({ isLoading: true, error: null });
          console.log(`🔄 Loading events for ${monthKey} (month: ${month}, year: ${year})`);
          
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
            const uniqueGeneratedEventIds = allGeneratedEventIds.filter(eventId => !apiEventIds.has(eventId));
            
            if (uniqueGeneratedEventIds.length > 0) {
              console.log(`🔄 Merged ${uniqueGeneratedEventIds.length} generated events with API data`);
            }
            
            // Cache the loaded data (tabs are just UI filters, not server data)
            const newCachedMonths = new Map(cachedMonths);
            newCachedMonths.set(monthKey, {
              eventIds: data.events.map((e: AstrologicalEvent) => e.id), // Cache only API event IDs
              loadedAt: Date.now(),
              tab: 'all'
            });
            
            set({ 
              events: apiEventsById, // Keep only API events in normalized structure
              eventIds: data.events.map((e: AstrologicalEvent) => e.id), // API event IDs
              generatedEvents: allGeneratedEvents, // Keep generated events separate
              generatedEventIds: uniqueGeneratedEventIds, // Keep generated event IDs
              isLoading: false,
              cachedMonths: newCachedMonths,
              loadedMonths: new Set([...get().loadedMonths, monthKey])
            });
            
            console.log(`✅ Loaded and cached ${data.events.length} events for ${monthKey}, total generated: ${allGeneratedEvents.length}`);
            console.log(`📊 State after API load: ${data.events.length} regular, ${allGeneratedEvents.length} generated`);
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
      },

      // Load events from API
      loadEvents: async (userId: string, tab?: string, filters = {}) => {
        // Prevent multiple simultaneous loads
        if (get().isLoading) {
          console.log('⏳ Already loading events, skipping...');
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
            console.log(`📊 LoadEvents - State after load: ${apiEvents.length} regular, ${allGeneratedEventIds.length} generated`);
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
            const newEvent = data.event;
            set((state) => ({ 
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
          set((state) => ({ 
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
      
      // Add multiple events locally only (for generated events)
      addEventsLocal: (newEvents: AstrologicalEvent[]) => {
        if (newEvents.length === 0) return;
        
        // Deduplicate events based on key characteristics
        const { events: existingEvents, generatedEvents: existingGeneratedEvents, eventIds, generatedEventIds } = get();
        const createEventHash = (event: AstrologicalEvent) => 
          `${event.date}-${event.time}-${event.score}-${event.type}`;
        
        const existingEventsArray = (eventIds || []).map(id => existingEvents[id]).filter(Boolean);
        const existingGeneratedEventsArray = (generatedEventIds || []).map(id => existingGeneratedEvents[id]).filter(Boolean);
        const existingHashes = new Set([...existingEventsArray, ...existingGeneratedEventsArray].map(createEventHash));
        const uniqueNewEvents = newEvents.filter(event => {
          const hash = createEventHash(event);
          return !existingHashes.has(hash);
        });
        
        const duplicateCount = newEvents.length - uniqueNewEvents.length;
        if (duplicateCount > 0) {
          console.log(`🔄 Deduplicated ${duplicateCount} duplicate events out of ${newEvents.length}`);
        }
        
        if (uniqueNewEvents.length === 0) {
          console.log('✅ No new unique events to add locally');
          return;
        }
        
        // Generate local IDs for unique events
        const eventsWithLocalIds = uniqueNewEvents.map((event: AstrologicalEvent, index: number) => ({
          ...event,
          id: event.id || `local_${Date.now()}_${index}` // Use existing ID or generate local ID
        }));
        
        // Separate generated and non-generated events
        const generatedEventsToAdd = eventsWithLocalIds.filter(e => e.isGenerated);
        const nonGeneratedEventsToAdd = eventsWithLocalIds.filter(e => !e.isGenerated);
        
        // Add to local state with normalized structure
        set((state) => {
          const newEvents = { ...state.events };
          const newEventIds = [...(state.eventIds || [])];
          const newGeneratedEvents = { ...state.generatedEvents };
          const newGeneratedEventIds = [...(state.generatedEventIds || [])];
          
          // Add non-generated events
          nonGeneratedEventsToAdd.forEach(event => {
            newEvents[event.id] = event;
            newEventIds.unshift(event.id);
          });
          
          // Add generated events
          generatedEventsToAdd.forEach(event => {
            newGeneratedEvents[event.id] = event;
            newGeneratedEventIds.unshift(event.id);
          });
          
          return {
            events: newEvents,
            eventIds: newEventIds,
            generatedEvents: newGeneratedEvents,
            generatedEventIds: newGeneratedEventIds
          };
        });
        
        console.log(`✅ Added ${eventsWithLocalIds.length} events to local state (no database save)`);
        console.log(`📊 Total events in store after local add: ${get().getAllEvents().length} (${get().eventIds?.length || 0} regular + ${get().generatedEventIds?.length || 0} generated)`);
      },

      // Add multiple events via API using bulk endpoint
      addEvents: async (newEvents: AstrologicalEvent[]) => {
        set({ error: null });
        
        if (newEvents.length === 0) return;
        
        // Deduplicate events based on key characteristics
        const { events: existingEvents, eventIds } = get();
        const createEventHash = (event: AstrologicalEvent) => 
          `${event.date}-${event.time}-${event.title}-${event.score}-${event.type}`;
        
        const existingEventsArray = (eventIds || []).map(id => existingEvents[id]).filter(Boolean);
        const existingHashes = new Set(existingEventsArray.map(createEventHash));
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
              const newEventsById = data.events.reduce((acc: Record<string, AstrologicalEvent>, event: AstrologicalEvent) => {
                acc[event.id] = event;
                return acc;
              }, {});
              
              set((state) => ({ 
                events: { ...newEventsById, ...state.events },
                eventIds: [...data.events.map((e: AstrologicalEvent) => e.id), ...state.eventIds]
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
          
          const eventsById = eventsWithLocalIds.reduce((acc: Record<string, AstrologicalEvent>, event: AstrologicalEvent) => {
            acc[event.id] = event;
            return acc;
          }, {});
          
          set((state) => ({ 
            events: { ...eventsById, ...state.events },
            eventIds: [...eventsWithLocalIds.map(e => e.id), ...state.eventIds]
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
            set((state) => {
              const newEvents = { ...state.events };
              delete newEvents[id];
              const newEventIds = state.eventIds.filter(eventId => eventId !== id);
              return { 
                events: newEvents,
                eventIds: newEventIds
              };
            });
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
          set((state) => {
            const event = state.events[id];
            if (!event) {
              console.error('Event not found for bookmark toggle:', id);
              return state;
            }
            return {
              events: {
                ...state.events,
                [id]: { ...event, isBookmarked: !event.isBookmarked }
              }
            };
          });
          
          // Update cache for fallback too
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
          
          // Use the bulk delete API endpoint with month filtering and timeout handling
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
          
          let response;
          try {
            response = await fetch(`/api/events?${params.toString()}`, {
              method: 'DELETE',
              signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
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
              
              // If it's a timeout or connection error, handle gracefully
              if (response.status >= 500 || errorMessage.includes('timeout') || errorMessage.includes('Connection acquisition timeout')) {
                console.warn('⚠️ Database timeout during clear, proceeding with local cleanup only');
                // Don't throw error, just continue with local cleanup
                set((state) => {
                  const newEvents: Record<string, AstrologicalEvent> = {};
                  const newEventIds: string[] = [];
                  
                  (state.eventIds || []).forEach(eventId => {
                    const event = state.events[eventId];
                    if (!event) return;
                    
                    // Keep bookmarked events and manual events
                    if (event.isBookmarked || !event.isGenerated) {
                      newEvents[eventId] = event;
                      newEventIds.push(eventId);
                    }
                  });
                  
                  return {
                    events: newEvents,
                    eventIds: newEventIds,
                    generatedEvents: {}, // Clear all generated events
                    generatedEventIds: []
                  };
                });
                return; // Exit successfully with local cleanup
              }
              
              throw new Error(errorMessage);
            }
            
            const data = await response.json();
            console.log(`🔄 API Response:`, data);
            
            if (data.success) {
              console.log(`✅ Successfully cleared ${data.deletedCount} generated events from database`);
              
              // Get current state for before/after comparison
              const currentState = get();
              const beforeCount = currentState.eventIds?.length || 0;
              
              // Immediately update local state to remove generated events and pattern-matching events
              set((state) => {
                const newEvents: Record<string, AstrologicalEvent> = {};
                const newEventIds: string[] = [];
                
                (state.eventIds || []).forEach(eventId => {
                  const event = state.events[eventId];
                  if (!event) return;
                  
                  // Keep bookmarked events
                  if (event.isBookmarked) {
                    newEvents[eventId] = event;
                    newEventIds.push(eventId);
                    return;
                  }
                  
                  // Remove events marked as generated
                  if (event.isGenerated) return;
                  
                  // Remove events that match generated patterns (aggressive cleanup)
                  const title = event.title || '';
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
                  
                  if (!isGeneratedPattern) {
                    newEvents[eventId] = event;
                    newEventIds.push(eventId);
                  }
                });
                
                return {
                  events: newEvents,
                  eventIds: newEventIds,
                  generatedEvents: {}, // Clear all generated events
                  generatedEventIds: []
                };
              });
              
              // Show immediate feedback
              const afterState = get();
              const afterCount = afterState.eventIds?.length || 0;
              const localRemovedCount = beforeCount - afterCount;
              
              console.log(`🔄 Local state updated: ${beforeCount} → ${afterCount} events (removed ${localRemovedCount} locally)`);
              
              // Reload events from database to ensure consistency
              console.log('🔄 Reloading events from database to ensure consistency...');
              const { loadEvents } = get();
              await loadEvents(userId);
              
            } else {
              throw new Error(data.error || 'Failed to clear generated events');
            }
          } catch (fetchError) {
            clearTimeout(timeoutId);
            
            // Handle AbortError (timeout) or network errors gracefully
            if (fetchError instanceof Error && (fetchError.name === 'AbortError' || fetchError.message.includes('timeout'))) {
              console.warn('⚠️ Clear operation timed out, proceeding with local cleanup only');
              // Don't throw error, just continue with local cleanup
              set((state) => {
                const newEvents: Record<string, AstrologicalEvent> = {};
                const newEventIds: string[] = [];
                
                (state.eventIds || []).forEach(eventId => {
                  const event = state.events[eventId];
                  if (!event) return;
                  
                  // Keep bookmarked events and manual events
                  if (event.isBookmarked || !event.isGenerated) {
                    newEvents[eventId] = event;
                    newEventIds.push(eventId);
                  }
                });
                
                return {
                  events: newEvents,
                  eventIds: newEventIds,
                  generatedEvents: {}, // Clear all generated events
                  generatedEventIds: []
                };
              });
              return; // Exit successfully with local cleanup
            }
            
            // Re-throw other errors
            throw fetchError;
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