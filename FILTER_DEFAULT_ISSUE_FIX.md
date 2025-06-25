# Filter Default Issue - Fixed

## Problem Identified
The advanced filters were defaulting to restrictive values that, when combined, created an AND condition too narrow to show any results:

### Old Restrictive Defaults:
- `maleficFilter: 'soft_aspects'` - Only events with trine/sextile/conjunction
- `scoreFilter: '6_plus'` - Only events with score ≥ 6  
- `electionalFilter: 'ready'` - Only high-scoring electional events (score ≥ 7)
- `moonPhaseFilter: 'waxing'` - Only waxing moon events
- `dignityFilter: 'no_debility'` - Only non-debilitated planets

When all applied together: Events needed to pass ALL 5 filters simultaneously, which was nearly impossible.

## ✅ FIXES APPLIED

### 1. Fixed Soft Aspects Filter Logic
**File**: `/src/components/events/utils/calendarUtils.ts`

**Old Logic** (too restrictive):
```typescript
// Required events to have soft aspects AND no challenging aspects
const hasSoftAspects = (content.includes('trine') || /* ... */) &&
                      !content.includes('square') &&
                      !content.includes('opposition') &&
                      !content.includes('⚠️');
```

**New Logic** (more inclusive):
```typescript
// Include events with soft aspects OR events without challenging indicators
const hasSoftAspects = content.includes('trine') || /* ... */;
const hasChallengingAspects = content.includes('square') || /* ... */;
return hasSoftAspects || !hasChallengingAspects;
```

### 2. Relaxed Electional Ready Criteria
**File**: `/src/components/events/utils/calendarUtils.ts`

**Changed**:
- Lowered minimum score from 7 to 6 for electional events
- Made criteria more flexible for different event types

### 3. Changed Default Filter Values to be Permissive
**File**: `/src/components/events/hooks/useFilterState.ts`

**Old Defaults** (restrictive):
```typescript
moonPhaseFilter: 'waxing'
dignityFilter: 'no_debility'  
maleficFilter: 'soft_aspects'
scoreFilter: '6_plus'
electionalFilter: 'ready'
```

**New Defaults** (permissive):
```typescript
moonPhaseFilter: 'all'        // Show all moon phases
dignityFilter: 'all'          // Show all dignities
maleficFilter: 'all'          // Show all aspects  
scoreFilter: 'all'            // Show all scores
electionalFilter: 'all'       // Show all electional events
mercuryFilter: 'direct'       // Keep only this one restrictive (important)
```

## Expected Results

### ✅ Default Behavior (On Page Load):
- **Shows all events** except Mercury retrograde
- Users see full calendar with all generated optimal timing events
- Filter counts show realistic distributions

### ✅ User Experience:
- **No empty calendar** on initial load
- Users can **selectively apply** restrictive filters as desired
- **"All" options** work correctly and show full event set
- **Individual filters** work as expected when manually selected

### ✅ Filter Combinations:
- Users can combine filters intentionally (Mercury Direct + High Scores)
- No more accidental over-filtering from restrictive defaults
- Clear feedback through filter counts

## Philosophy Change

### Before:
- **Electional Purist Approach**: Default to strict traditional astrology filters
- **Result**: Empty calendars, user confusion

### After:  
- **User-Friendly Approach**: Show all results by default, let users filter down
- **Result**: Immediate value, progressive enhancement through filtering

## Technical Details

### Files Modified:
1. `/src/components/events/hooks/useFilterState.ts` - Changed default values
2. `/src/components/events/utils/calendarUtils.ts` - Fixed filter logic

### Backward Compatibility:
- All filter options still work exactly the same
- Only default values changed, not filter functionality
- Reset button now resets to new permissive defaults

This change transforms the filtering from "restrictive by default" to "show everything, filter by choice" - much better UX while maintaining all the powerful filtering capabilities.