# Electional Astrology - Events System File Structure

This document outlines the file structure and architecture of the events system used for electional astrology (timing selection) in the Luckstrology application.

## File Structure Tree

```
src/
├── app/
│   └── events/
│       └── page.tsx                           # Main events page with calendar view
│
├── components/
│   └── events/
│       ├── AdvancedFilters.tsx                # Complex filtering interface
│       ├── AspectItem.tsx                     # Individual aspect display component
│       ├── CalendarDay.tsx                    # Single day in calendar grid
│       ├── CalendarGrid.tsx                   # Calendar month grid layout
│       ├── CalendarHeader.tsx                 # Calendar navigation header
│       ├── CalendarLegend.tsx                 # Legend for calendar symbols/colors
│       ├── EventItem.tsx                      # Individual event display component
│       ├── EventsCalendar.tsx                 # Main calendar component
│       ├── EventsCalendarFilters.tsx          # Calendar-specific filters
│       ├── EventsEmptyState.tsx               # Empty state when no events
│       ├── EventsHeader.tsx                   # Page header with title/actions
│       ├── EventsTable.tsx                    # Tabular event list view
│       ├── FilterHeader.tsx                   # Filter section header
│       ├── FilterLegend.tsx                   # Legend for filter meanings
│       ├── NextBookmarkedEventCountdown.tsx   # Countdown to next bookmarked event
│       ├── ProfileCompletePrompt.tsx          # Prompt to complete birth data
│       ├── QuickFilters.tsx                   # Quick filter buttons
│       ├── TimeSelectionControls.tsx          # Time range selection controls
│       ├── TimingMethodsFilter.tsx            # Electional timing method filters
│       │
│       ├── config/
│       │   └── filterConfigs.tsx              # Filter configuration definitions
│       │
│       ├── hooks/
│       │   └── useFilterState.ts              # Filter state management hook
│       │
│       ├── types/
│       │   └── filterTypes.ts                 # TypeScript type definitions for filters
│       │
│       └── utils/
│           └── calendarUtils.ts               # Calendar utility functions
│
└── hooks/
    ├── optimalTiming/
    │   ├── index.ts                           # Main optimal timing hook export
    │   ├── astrologicalUtils.ts               # Astrological calculation utilities
    │   ├── chartAnalyzers.ts                  # Chart analysis functions
    │   ├── electionalProhibitions.ts          # Electional prohibition rules
    │   ├── priorities.ts                      # Timing priority calculations
    │   ├── titleGenerators.ts                 # Event title generation
    │   └── types.ts                           # TypeScript type definitions
    │
    ├── useAstronomicalContext.ts              # Astronomical context hook
    ├── useManualEventAnalysis.ts              # Manual event analysis hook
    └── useOptimalTiming.ts                    # Main optimal timing hook
```

## System Architecture Overview

### Core Components
- **Events Page** (`src/app/events/page.tsx`): Main entry point for electional astrology features
- **Calendar System**: Grid-based calendar with day-by-day astrological events
- **Filter System**: Complex filtering for aspects, timing methods, and event types
- **Event Analysis**: Manual and automated analysis of astrological timing

### Key Features
1. **Calendar View**: Month/week/day views of astrological events
2. **Advanced Filtering**: Filter by aspects, planets, timing methods
3. **Bookmarking**: Save important electional events
4. **Countdown Timers**: Track time to significant events
5. **Profile Integration**: Personalized timing based on birth data

### Electional Timing Logic
- **Optimal Timing Hook**: Analyzes best times for activities
- **Prohibition Rules**: Identifies unfavorable timing periods
- **Chart Analysis**: Evaluates astrological conditions
- **Priority System**: Ranks timing options by quality

## Filter System Architecture

The events system includes a sophisticated multi-layer filtering architecture designed for electional astrology timing selection:

### Filter Types & Hierarchy

#### 1. Quick Filters (`QuickFilter`)
Basic on/off toggle filters for immediate event filtering:
- **Hide Challenging**: Removes difficult planetary alignments (Mars-Saturn conflicts)
- **Combos Only**: Shows only powerful planetary combinations (Venus-Jupiter alignments)
- **Daily Aspects**: Displays daily planetary conversations (aspects)

#### 2. Timing Method Filters (`TimingMethod`)
Filter by astrological analysis method:
- **Houses**: Focus on house-based timing
- **Aspects**: Focus on aspect-based timing  
- **Electional**: Traditional electional astrology rules

#### 3. Advanced Filters (`AdvancedFilter`)
Detailed planetary condition filters with multiple options:

##### Mercury Filter
- **Direct**: Mercury moving forward (smooth communication)
- **All**: Include Mercury retrograde periods

##### Moon Phase Filter
- **Waxing**: Building energy, best for starting projects
- **New**: Fresh starts but weak energy
- **Full**: Peak energy but crisis-prone
- **Waning**: Good for clearing/ending
- **All**: All lunar phases

##### Dignity Filter
- **Exalted**: Super-powered planets only
- **Strong**: Well-dignified planets (no debility)
- **All**: All planetary dignities

##### Malefics Filter
- **Avoid**: Exclude harsh Mars-Saturn combinations
- **Soft**: Include only gentle aspects (trine/sextile)
- **All**: Include all Mars-Saturn aspects

##### Score Filter
- **8+**: Excellent timing (rare but powerful)
- **6+**: Good timing (balanced)
- **All**: All quality scores

##### Traditional Electional Filter
- **Ready**: High-scoring events meeting ancient standards
- **Angular**: Benefic planets (Jupiter/Venus) in powerful houses
- **All**: Any electional timing

### Filter State Management

#### Core Interfaces

```typescript
// Main filter state container
interface FilterState {
  hideChallengingDates: boolean;
  showCombosOnly: boolean;
  showAspects: boolean;
  showHousesOnly: boolean;
  showAspectsOnly: boolean;
  showElectionalOnly: boolean;
}

// Advanced filter state
interface AdvancedFilterState {
  mercuryFilter: 'direct' | 'all';
  moonPhaseFilter: 'waxing' | 'new' | 'full' | 'waning' | 'all';
  dignityFilter: 'exalted' | 'no_debility' | 'all';
  maleficFilter: 'no_mars_saturn' | 'soft_aspects' | 'all';
  scoreFilter: '8_plus' | '6_plus' | 'all';
  electionalFilter: 'ready' | 'benefics_angular' | 'all';
}
```

#### Filter State Hook (`useFilterState.ts`)
Centralized filter management with:
- **Real-time Updates**: Filters update immediately
- **Toast Notifications**: User feedback for filter changes
- **Reset Functionality**: Return to optimal defaults
- **Active Filter Tracking**: Monitor which filters are applied

### Filter Configuration System

#### Static Configuration (`filterConfigs.tsx`)
- **QUICK_FILTERS**: Array of quick filter definitions with icons and tooltips
- **TIMING_METHODS**: Array of timing method options
- **ADVANCED_FILTERS**: Detailed filter configurations with:
  - Multiple option sets
  - Explanatory tooltips with astrological guidance
  - Color coding for visual organization

#### Filter Defaults Strategy
- **Permissive Defaults**: Show all events by default to ensure results
- **Mercury Direct Priority**: Default to Mercury direct for optimal communication
- **User-Guided Refinement**: Allow users to narrow results based on needs

### Filter Component Architecture

#### Filter Components
- **QuickFilters.tsx**: Toggle buttons for basic filtering
- **AdvancedFilters.tsx**: Dropdown selectors for detailed filtering
- **TimingMethodsFilter.tsx**: Radio buttons for timing method selection
- **EventsCalendarFilters.tsx**: Master filter container component

#### Integration Points
- **Calendar Grid**: Filters applied to daily event display
- **Events Table**: Tabular view respects all filter settings
- **Event Analysis**: Filtering affects optimal timing calculations

### Filter UX Design

#### Visual Feedback
- **Active State Indicators**: Clear visual feedback for applied filters
- **Filter Counts**: Show how many events match current filters
- **Reset Button**: Quick return to default state
- **Filter Legend**: Explain filter meanings and astrological concepts

#### Tooltip System
Comprehensive astrological education through filter tooltips:
- **Practical Guidance**: When to use each filter option
- **Astrological Context**: Why certain combinations work better
- **Traditional Wisdom**: Ancient electional astrology principles
- **Modern Application**: How to apply filters for contemporary needs

### Future Filter Enhancements

1. **Saved Filter Sets**: Allow users to save and recall filter combinations
2. **Smart Recommendations**: AI-suggested filters based on user goals
3. **Filter Analytics**: Track which filters produce best outcomes
4. **Custom Filters**: User-defined filter criteria
5. **Bulk Filter Operations**: Apply multiple filters simultaneously
6. **Filter Sharing**: Share effective filter combinations with community

## Latest Update: Magic Formula System Status (January 2025)

### Magic Formula System Temporarily Disabled
Based on **astronomical reality**, the Magic Formula system has been temporarily disabled to prevent false positives.

#### Astronomical Context:
- **Jupiter-Pluto Separation (2025)**: ~215° apart - no aspect possible
- **Last Active Period**: 2020 (Jupiter-Pluto conjunction in Capricorn)
- **Next Active Period**: ~2033-2035 (next Jupiter-Pluto conjunction cycle)
- **Current Status**: All Magic Formula bonuses disabled until aspects return

### Changes Made to Filter System

#### 1. Magic Formula Scoring Disabled:
```typescript
const calculateMagicFormulaBonus = (): number => {
  // Magic Formula disabled - Jupiter and Pluto are not in aspect during 2025
  return 0; // No Magic Formula bonus until Jupiter-Pluto aspects return
};
```

#### 2. Filter Integration Updated:
- **Magic Formula filter options**: Remain available but return no results
- **Special symbols**: 🎭 ⚡ preserved for future use
- **Filter tooltips**: Updated to explain astronomical limitation
- **Priority system**: Magic Formula infrastructure preserved but inactive

#### 3. Moon Sign Electional Integration Enhanced:
Instead of Magic Formula events, the system now emphasizes **Moon sign electional context** in event titles:

```typescript
// Enhanced Moon electional context in event titles
const getMoonElectionalContext = (moonSign: string): string | null => {
  if (['cancer', 'scorpio', 'pisces'].includes(sign)) {
    return '🌊 Growth Moon'; // Water signs for growth
  } else if (sign === 'taurus') {
    return '🌱 Strength Moon'; // Earth sign for strength
  }
  // ... additional Moon contexts
};
```

**Current Event Title Examples:**
- "Jupiter 2nd · 🌊 Growth Moon"
- "Venus 7th · 🎨 Creative Moon"  
- "Mars 10th · 🎯 Action Moon"

### Moon Sign Electional Filter (Commented Out)

The Moon sign filter has been **commented out** per user request, with Moon information moved to event titles instead:

```typescript
// Moon Sign Filter commented out per user request - info added to event titles instead
// {
//   key: 'moonSignFilter',
//   label: '🌙 Moon Sign',
//   options: [
//     { value: 'haircut_growth', label: 'Hair Growth' },
//     { value: 'travel_flexible', label: 'Travel (Flexible)' },
//     { value: 'creativity', label: 'Creative Work' },
//     // ... etc
//   ]
// }
```

#### Moon Electional Contexts Available:
- **🌊 Growth Moon**: Water signs (Cancer, Scorpio, Pisces) for growth activities
- **🌱 Strength Moon**: Taurus for strength and stability
- **✂️ Precision Moon**: Virgo for maintenance and precision work
- **✈️ Travel Moon**: Mutable signs (Gemini, Sagittarius) for flexibility
- **🎯 Action Moon**: Cardinal signs (Aries, Libra, Capricorn) for initiation
- **🎨 Creative Moon**: Leo for creative expression
- **💫 Intuitive Moon**: Pisces for intuition and spirituality
- **🔒 Stable Moon**: Fixed signs for stability

### Filter System Current Status

#### Active Filter Categories:
1. **Mercury Filter**: Direct vs All (Mercury retrograde considerations)
2. **Moon Phase Filter**: Waxing/New/Full/Waning timing
3. **Dignity Filter**: Planetary strength considerations
4. **Malefics Filter**: Mars-Saturn aspect filtering
5. **Score Filter**: Quality threshold filtering
6. **Electional Filter**: Traditional electional astrology rules
7. **Jupiter Sector Filter**: Current Jupiter sign industry preferences
8. **Void Moon Filter**: Void of course Moon periods
9. **Ingress Filter**: Planetary sign change windows
10. **Economic Cycle Filter**: Outer planet economic indicators

#### Disabled/Modified:
- **Magic Formula Filter**: Inactive until Jupiter-Pluto aspects return
- **Moon Sign Filter**: Moved to event title context

### System Readiness for Future Magic Formula Activation

The complete Magic Formula infrastructure remains preserved:

#### Preserved Components:
- **detectMagicFormula()**: Full detection logic at `/src/hooks/optimalTiming/financialAstrologyCalculations.ts`
- **Scoring bonuses**: Can be reactivated by removing the `return 0;` override
- **Title generation**: Ready for 🎭 ⚡ symbols when aspects return
- **Filter integration**: All UI components and state management intact
- **Priority override**: System ready for future Jupiter-Pluto conjunctions

#### Quick Reactivation Process (~2033-2035):
1. Remove `return 0;` from `calculateMagicFormulaBonus()`
2. Uncomment Magic Formula checks in `generateAstrologicalTitle()`
3. Update filter tooltips to reflect active status
4. System will automatically detect and prioritize Magic Formula events

### Current Filter Performance

#### Optimizations Maintained:
- **Debounced Updates**: Prevent excessive recalculation during filter changes
- **Client-Side Filtering**: Fast filtering without server round-trips
- **Filter Count Display**: Real-time event counts for each filter option
- **Progressive Enhancement**: Graceful degradation when certain data unavailable

#### Enhanced User Experience:
- **Moon Context Clarity**: Electional guidance visible in every event title
- **Clean Console**: All debug logging removed for production readiness
- **Accurate Filtering**: No false positives from inactive astronomical configurations
- **Educational Tooltips**: Clear explanations of when Magic Formula will return

This updated filter architecture maintains full functionality while accurately reflecting current astronomical conditions, ensuring users receive reliable electional astrology guidance based on real planetary positions rather than theoretical configurations.

## Performance Considerations

### Filter Optimization
- **Debounced Updates**: Prevent excessive recalculation during rapid filter changes
- **Memoized Results**: Cache filtered results for identical filter states
- **Progressive Loading**: Load filtered results incrementally for large datasets
- **Client-Side Filtering**: Fast filtering without server round-trips

## Future Enhancement Areas

This structure provides a solid foundation for expanding electional astrology features:

1. **Event Creation**: Allow users to create custom electional events
2. **Notification System**: Alerts for optimal timing windows
3. **Activity Categories**: Specialized timing for business, relationships, travel, etc.
4. **Export Features**: Export optimal timing reports
5. **Integration**: Connect with calendar applications
6. **Advanced Analytics**: Historical timing success tracking

## Related Files

- Database schema for events: `src/db/schema.ts`
- Event service layer: `src/db/services/eventService.ts`
- Store management: `src/store/eventsStore.ts`

---

*This documentation serves as a roadmap for understanding and extending the electional astrology features in the Luckstrology application.*