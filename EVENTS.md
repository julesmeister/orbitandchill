# Events System Architecture Documentation

## Table of Contents
1. [Overview](#overview)
2. [File Tree Map & Architecture](#file-tree-map--architecture)
3. [Data Architecture](#data-architecture)
4. [State Management](#state-management)
5. [API Endpoints](#api-endpoints)
6. [Event Generation Flow](#event-generation-flow)
7. [Tab System & Navigation](#tab-system--navigation)
8. [Persistence & Caching](#persistence--caching)
9. [Known Issues & Fixes](#known-issues--fixes)
10. [Development Guidelines](#development-guidelines)

## Overview

The Events system is a comprehensive astrological event management platform that allows users to:
- Generate optimal timing events based on astrological calculations
- Manually create and manage events
- Bookmark important events
- Filter and view events by various criteria
- Navigate between different event categories via tabs

### Key Features
- **Real-time event generation** with progress tracking
- **Separation of concerns** between generated and regular events
- **Month-based caching** for performance
- **Tab-based navigation** (All, Generated, Bookmarked, Manual)
- **Advanced filtering** by type, priority, and timing method

## File Tree Map & Architecture

The Events system consists of **67+ files** across multiple directories. Here's the comprehensive structure:

### 📁 Core System Files
```
/src/
├── app/
│   ├── events/
│   │   └── page.tsx                          # 🎯 MAIN EVENTS PAGE (central hub)
│   └── api/
│       └── events/
│           ├── route.ts                      # 🚀 Primary API endpoint
│           ├── [id]/
│           │   ├── route.ts                  # Single event CRUD
│           │   └── bookmark/
│           │       └── route.ts              # Bookmark toggle
│           └── bulk/
│               └── route.ts                  # Bulk operations
├── store/
│   └── eventsStore.ts                        # 🧠 ZUSTAND STORE (state management)
├── db/
│   └── services/
│       └── eventService.ts                   # 🗄️ Database operations
└── hooks/
    └── [16 event-related hooks]             # 🔗 Business logic hooks
```

### 🎭 Component Architecture (29 files)
```
/src/components/events/
├── 🏠 LAYOUT COMPONENTS
│   ├── EventsLeftPanel.tsx                  # Controls & filters sidebar
│   ├── EventsRightPanel.tsx                 # Events display area
│   ├── EventsHeader.tsx                     # Page header
│   └── EventsTable.tsx                      # 📊 MAIN TABLE COMPONENT
│
├── 📅 CALENDAR COMPONENTS
│   ├── EventsCalendar.tsx                   # Calendar view
│   ├── CalendarGrid.tsx                     # Grid layout
│   ├── CalendarHeader.tsx                   # Navigation controls
│   ├── CalendarDay.tsx                      # Individual day cell
│   ├── CalendarEventItem.tsx                # Event in calendar
│   └── CalendarLegend.tsx                   # Color coding legend
│
├── 🔍 FILTER COMPONENTS
│   ├── AdvancedFilters.tsx                  # Complex filtering UI
│   ├── EventsCalendarFilters.tsx            # Calendar-specific filters
│   ├── TimingMethodsFilter.tsx              # Timing method selection
│   ├── QuickFilters.tsx                     # Quick filter buttons
│   ├── FilterHeader.tsx                     # Filter section header
│   ├── FilterLegend.tsx                     # Filter explanations
│   └── TimeSelectionControls.tsx            # Time range controls
│
├── 📝 FORM COMPONENTS
│   ├── AddEventForm.tsx                     # Manual event creation
│   ├── EventTimePicker.tsx                  # Time selection widget
│   └── EventModal.tsx                       # Event details modal
│
├── 🎨 DISPLAY COMPONENTS
│   ├── EventCard.tsx                        # Event card layout
│   ├── EventItem.tsx                        # Individual event display
│   ├── EventHeader.tsx                      # Event header section
│   ├── AspectItem.tsx                       # Astrological aspect display
│   └── NextBookmarkedEventCountdown.tsx     # Countdown timer
│
├── 📊 UTILITY COMPONENTS
│   ├── EventsEmptyState.tsx                 # No events message
│   ├── EventsLimitBanner.tsx                # Usage limit warnings
│   ├── ProfileCompletePrompt.tsx            # Profile completion prompt
│   └── MagicFormulaStatus.tsx               # Algorithm status
│
└── 🔧 SUPPORT FILES
    ├── config/
    │   └── filterConfigs.tsx                # Filter configuration
    ├── types/
    │   └── filterTypes.ts                   # TypeScript types
    ├── hooks/
    │   └── useFilterState.ts                # Filter state management
    └── utils/
        └── calendarUtils.ts                 # Calendar calculations
```

### 🎯 Hooks Architecture (16 files)
```
/src/hooks/
├── 🏭 CORE EVENT HOOKS
│   ├── useEventActions.ts                   # Event CRUD operations
│   ├── useEventFiltering.ts                 # Event filtering logic
│   ├── useEventNavigation.ts                # Event navigation
│   ├── useEventStats.ts                     # Event statistics
│   └── useEventsLimits.ts                   # Usage limits
│
├── 🎛️ FORM & UI HOOKS
│   ├── useEventForm.ts                      # Form management
│   ├── useEventSelection.ts                 # Event selection
│   ├── useEventFilters.ts                   # Filter management
│   └── useEventsFilters.ts                  # Alternative filter hook
│
├── 🔧 SPECIALIZED HOOKS
│   ├── useManualEventAnalysis.ts            # Manual event analysis
│   ├── useManualEventHandler.ts             # Manual event handling
│   ├── useAstrologicalEvents.ts             # Astrological calculations
│   └── useMatrixEventHandlers.ts            # Matrix event handling
│
├── 🚀 GENERATION HOOKS
│   ├── useOptimalTiming.ts                  # 🎯 CORE GENERATION LOGIC
│   └── useOptimalTimingHandler.ts           # Generation orchestration
│
└── 🛠️ ADMIN HOOKS
    ├── useAdminEvents.ts                    # Admin event management
    └── useAdminEventForm.ts                 # Admin form handling
```

### 🛠️ Utility & Support Files (22 files)
```
/src/utils/
├── eventUtils.ts                            # General event utilities
├── eventStatistics.ts                      # Statistical calculations
├── eventLocationUtils.ts                   # Location-based utilities
├── astrological/
│   ├── eventData.ts                        # Astrological data
│   └── eventInterpretations.ts             # Event interpretations
└── optimalTiming/
    └── eventCreation.ts                     # Event creation logic
```

### 📊 Data Flow Architecture
```
USER INTERACTION
        ↓
    EVENTS PAGE (page.tsx)
        ↓
    EVENTS STORE (eventsStore.ts)
        ↓
    ┌─────────────────────────┐
    │                         │
    ↓                         ↓
API LAYER                 HOOKS LAYER
(route.ts files)         (16 hooks)
    ↓                         ↓
DATABASE LAYER           COMPONENT LAYER
(eventService.ts)        (29 components)
    ↓                         ↓
PERSISTENCE              UI RENDERING
(Turso DB)               (React components)
```

### 🔗 Critical Dependencies
```
📋 EVENTS PAGE depends on:
├── eventsStore.ts (state)
├── useOptimalTimingHandler.ts (generation)
├── useEventActions.ts (CRUD operations)
├── useEventFiltering.ts (filtering)
├── EventsLeftPanel.tsx (controls)
├── EventsRightPanel.tsx (display)
└── EventsTable.tsx (table view)

🧠 EVENTS STORE depends on:
├── API endpoints (/api/events/*)
├── eventService.ts (database operations)
├── Browser localStorage (persistence)
└── Zustand middleware (state management)

🔗 HOOKS depend on:
├── eventsStore.ts (state access)
├── userStore.ts (user data)
├── Various utility files
└── External libraries (astronomy-engine, etc.)
```

### 🚨 Complexity Indicators
- **Total Files**: 67+ files across 8 directories
- **Component Depth**: Up to 4 levels deep
- **Hook Dependencies**: 16 interconnected hooks
- **API Endpoints**: 6 different routes
- **State Layers**: 3 levels (Store → Cache → Components)
- **Data Flows**: 5 major data flow patterns

### 🔄 Recent Fixes Applied
The following issues were identified and fixed in the complex file structure:

#### 1. Tab Switching Event Loss
**Affected Files:**
- `src/app/events/page.tsx` (lines 188-197) - useEffect dependency fix
- `src/store/eventsStore.ts` - Dual-array architecture implementation
- `src/hooks/useEventFiltering.ts` - Filter logic updates

**Problem:** Generated events disappeared when switching tabs
**Solution:** Separated `events` and `generatedEvents` arrays

#### 2. Infinite Loop on Manual Tab
**Affected Files:**
- `src/app/events/page.tsx` - useEffect dependencies
- `src/store/eventsStore.ts` - Guard checks in load functions

**Problem:** Continuous API calls when viewing manual tab
**Solution:** Removed `isLoading` from dependencies, added load guards

#### 3. Event Duplication
**Affected Files:**
- `src/store/eventsStore.ts` - `getAllEvents()` deduplication
- `src/hooks/useOptimalTimingHandler.ts` - Logging improvements

**Problem:** Events appeared multiple times after tab switches
**Solution:** Added ID-based deduplication in `getAllEvents()`

### 📁 Related Documentation Files
- `EVENT_CLEARING_FIX.md` - Specific bug fix documentation
- `CLAUDE.md` - General development guidelines
- `EVENTS.md` - This comprehensive documentation (you are here)

## Data Architecture

### Event Interface (`/src/store/eventsStore.ts`)
```typescript
interface AstrologicalEvent {
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
  chartData?: { /* planetary data */ };
  isBookmarked?: boolean;
  timingMethod?: 'houses' | 'aspects' | 'electional' | 'combined';
  timeWindow?: { startTime: string; endTime: string; duration: string; };
  locationName?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  electionalData?: { /* advanced astrology data */ };
}
```

### Storage Architecture
The system uses a **dual-array architecture** for event storage:

1. **`events`**: Regular events (manual, bookmarked, from API)
2. **`generatedEvents`**: Locally generated events (temporary, not persisted)

This separation prevents:
- Generated events from being persisted to database
- Mixing of temporary and permanent events
- Duplication when switching tabs

## State Management

### Zustand Store Structure (`/src/store/eventsStore.ts`)
```typescript
interface EventsState {
  // Core state
  events: AstrologicalEvent[];              // Regular events from API
  generatedEvents: AstrologicalEvent[];     // Locally generated events
  
  // Caching
  cachedMonths: Map<string, {
    events: AstrologicalEvent[];
    loadedAt: number;
    tab: 'all' | 'bookmarked' | 'manual';
  }>;
  
  // UI state
  selectedTab: 'all' | 'bookmarked' | 'manual' | 'generated';
  selectedType: 'all' | 'benefic' | 'challenging' | 'neutral';
  hideChallengingDates: boolean;
  showCombosOnly: boolean;
  // ... other filters
  
  // Actions
  getAllEvents: () => AstrologicalEvent[];  // Combines both arrays
  loadEvents: (userId: string, tab?: string) => Promise<void>;
  loadMonthEvents: (userId: string, month: number, year: number) => Promise<void>;
  addEventsLocal: (events: AstrologicalEvent[]) => void;
  // ... other actions
}
```

### Key Store Functions

#### `getAllEvents()`
```typescript
getAllEvents: () => {
  const { events, generatedEvents } = get();
  const allEvents = [...events, ...generatedEvents];
  // Deduplication by ID
  const uniqueEvents = allEvents.filter((event, index, self) => 
    index === self.findIndex(e => e.id === event.id)
  );
  return uniqueEvents;
}
```

#### `addEventsLocal()`
- Adds events to `generatedEvents` array only
- Performs deduplication check
- Does not trigger API calls
- Used for real-time event generation

## API Endpoints

### GET `/api/events`
**Parameters:**
- `userId`: Required user identifier
- `tab`: Optional filter ('all', 'bookmarked', 'manual')
- `month`: Optional month filter
- `year`: Optional year filter

**Response:**
```json
{
  "success": true,
  "events": [/* array of events */]
}
```

### POST `/api/events`
Creates a single event in the database.

### POST `/api/events/bulk`
Creates multiple events efficiently.

### DELETE `/api/events`
Deletes events with optional filters.

## Event Generation Flow

### 1. User Initiates Generation
```typescript
// In useOptimalTimingHandler
handleGenerateOptimalTiming() {
  // 1. Validate prerequisites (priorities, location)
  // 2. Clear existing generated events
  // 3. Show loading UI with progress
  // 4. Call generateOptimalTiming with callbacks
}
```

### 2. Real-time Event Addition
```typescript
onEventGenerated: async (newEvent) => {
  // Called for each generated event
  addEventsLocal([newEvent]); // Adds to generatedEvents array
}
```

### 3. Generation Complete
```typescript
onEventsGenerated: async (events) => {
  // Final callback with all events
  // Show success message
  // Scroll to results
}
```

## Tab System & Navigation

### Tab Loading Strategy
```typescript
useEffect(() => {
  if (user?.id) {
    if (selectedTab === 'bookmarked' || selectedTab === 'manual') {
      loadEvents(user.id, selectedTab); // Load all events
    } else {
      loadMonthEvents(user.id, currentDate.getMonth(), currentDate.getFullYear());
    }
  }
}, [user?.id, selectedTab, stableCurrentDate]);
```

### Tab Behavior
- **All Tab**: Shows all events (regular + generated)
- **Generated Tab**: Shows only `isGenerated === true` events
- **Bookmarked Tab**: Shows only `isBookmarked === true` events
- **Manual Tab**: Shows only `isGenerated === false` events

### Preserving Generated Events
When switching tabs, generated events are preserved:
1. `loadEvents()` separates API events from generated events
2. `loadMonthEvents()` preserves existing generated events
3. Both maintain the dual-array structure

## Persistence & Caching

### Zustand Persistence
```typescript
partialize: (state) => {
  // Exclude transient data from persistence
  const { events, generatedEvents, isLoading, error, cachedMonths, loadedMonths, ...persistableState } = state;
  return {
    ...persistableState,
    currentDate: state.currentDate.toISOString(),
  };
}
```

**Important**: Generated events are NOT persisted to localStorage.

### Month-based Caching
```typescript
cachedMonths: Map<string, {
  events: AstrologicalEvent[];
  loadedAt: number;
  tab: 'all' | 'bookmarked' | 'manual';
}>
```
- Cache expiry: 10 minutes
- Keyed by "YYYY-MM" format
- Only caches API events, not generated ones

### Rehydration
```typescript
onRehydrateStorage: () => (state) => {
  if (state) {
    // Clear all event data on rehydration
    state.events = [];
    state.generatedEvents = [];
    state.cachedMonths = new Map();
    // Events will be loaded fresh from API
  }
}
```

## Known Issues & Fixes

### 1. Event Clearing Fix (see EVENT_CLEARING_FIX.md)
**Problem**: Events would reappear after being cleared
**Solution**: 
- Fixed WHERE clause parsing in database layer
- Added proper userId filtering
- Excluded events from persistence

### 2. Tab Switching Event Loss
**Problem**: Generated events disappeared when switching tabs
**Solution**:
- Separated generated events into their own array
- Preserved generated events during tab switches
- Fixed deduplication logic

### 3. Infinite Loop on Manual Tab
**Problem**: Continuous API calls when viewing manual tab
**Solution**:
- Removed `isLoading` from useEffect dependencies
- Added guard checks to prevent simultaneous loads

### 4. Hot Reload Event Loss
**Behavior**: Generated events are lost during hot reload
**Status**: This is expected behavior in development
**Reason**: Generated events are temporary and not persisted

## Development Guidelines

### 1. Event ID Generation
- API events: Database-generated IDs
- Generated events: `local_${timestamp}_${index}` format
- Always check for ID uniqueness

### 2. Adding New Event Types
1. Update `AstrologicalEvent` interface
2. Update filtering logic in `useEventFiltering`
3. Add UI controls for new filters
4. Update API endpoints if needed

### 3. Performance Considerations
- Use `getAllEvents()` sparingly (involves array merging)
- Leverage month-based caching
- Batch event operations when possible
- Use `addEventsLocal()` for generated events

### 4. Testing Checklist
- [ ] Generate events and verify count
- [ ] Switch between all tabs
- [ ] Verify generated events persist across tab switches
- [ ] Check that bookmarking works
- [ ] Verify manual event creation
- [ ] Test event deletion
- [ ] Refresh page and verify state

### 5. Debugging Tips
```javascript
// Check event counts
console.log('Regular events:', useEventsStore.getState().events.length);
console.log('Generated events:', useEventsStore.getState().generatedEvents.length);
console.log('Total events:', useEventsStore.getState().getAllEvents().length);

// Monitor state changes
useEventsStore.subscribe((state) => {
  console.log('Events state changed:', state);
});
```

## Common Pitfalls to Avoid

1. **Don't mix event arrays**: Keep `events` and `generatedEvents` separate
2. **Don't persist generated events**: They should be temporary
3. **Don't forget deduplication**: When combining arrays, remove duplicates
4. **Don't skip loading guards**: Prevent simultaneous API calls
5. **Don't modify cached data**: Cache should be read-only

## Future Enhancements

1. **Event Sharing**: Allow users to share generated events
2. **Event Templates**: Save common event patterns
3. **Bulk Operations**: Select multiple events for actions
4. **Advanced Filtering**: More sophisticated filter combinations
5. **Event Export**: Export events to calendar formats

## Related Documentation

- [EVENT_CLEARING_FIX.md](./EVENT_CLEARING_FIX.md) - Details on the event clearing bug fix
- [CLAUDE.md](./CLAUDE.md) - General codebase guidelines
- API documentation in `/src/app/api/events/`