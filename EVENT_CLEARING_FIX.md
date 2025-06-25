# Event Clearing Fix Documentation

## Problem Description
Events would "reappear" after being cleared from the calendar. The clear operation would show 0 events deleted, but then 233 events would reload from the database.

## Root Causes Identified

### 1. WHERE Clause Was Completely Skipped
**File**: `src/db/index-turso-http.ts`
**Issue**: The mock database implementation was skipping WHERE clause parsing entirely
```typescript
// BROKEN CODE - DO NOT REVERT TO THIS
where: (condition: any) => {
  // Skip WHERE parsing for now to avoid breaking discussions
  console.log('🔍 Skipping WHERE condition for now');
  // Just return the chain without setting WHERE clause
  // This will make all SELECT queries return all rows
```

### 2. Global Event Pool Design Flaw
**File**: `src/app/api/events/route.ts`
**Issue**: The API was loading ALL generated events from ALL users, not just the current user
```typescript
// BROKEN CODE - DO NOT REVERT TO THIS
const allGeneratedEvents = await EventService.getEvents({
  ...filters,
  isGenerated: true // Everyone's generated events
  // No userId filter for generated events
});
```

### 3. Zustand Persistence Issue
**File**: `src/store/eventsStore.ts`
**Issue**: Events were being persisted to localStorage and restored on page load
```typescript
// The persist middleware was saving events to localStorage
// When the store rehydrated, old events would come back
```

## Solutions Applied

### 1. Implemented Proper WHERE Clause Parsing
**File**: `src/db/index-turso-http.ts` (lines 271-355)
- Added support for Drizzle's `eq()` conditions
- Added support for `and()` conditions
- Proper field name conversion (camelCase → snake_case)
- Proper parameter binding with placeholders

### 2. Fixed API to Filter by User
**File**: `src/app/api/events/route.ts` (line 80)
```typescript
// CORRECT CODE - KEEP THIS
const allGeneratedEvents = await EventService.getEvents({
  ...filters,
  userId, // FIXED: Only get generated events for THIS user
  isGenerated: true // User's generated events only
});
```

### 3. Excluded Events from Persistence
**File**: `src/store/eventsStore.ts` (lines 529-535)
```typescript
// CORRECT CODE - KEEP THIS
partialize: (state) => {
  const { events, isLoading, error, ...persistableState } = state;
  return {
    ...persistableState,
    currentDate: state.currentDate.toISOString(),
  };
},
```

### 4. Force Fresh Events on Rehydration
**File**: `src/store/eventsStore.ts` (lines 566-569)
```typescript
// CORRECT CODE - KEEP THIS
onRehydrateStorage: () => (state) => {
  if (state) {
    // Ensure events are always empty on rehydration (they come from database)
    state.events = [];
    state.isLoading = false;
    state.error = null;
```

### 5. Fixed Boolean Type Conversions
**File**: `src/db/services/eventService.ts`
```typescript
// Converting to SQLite format (line 123)
isGenerated: eventData.isGenerated ? 1 : 0,
isBookmarked: 0,

// Converting from SQLite format (lines 99, 102)
isGenerated: Boolean(row.isGenerated),
isBookmarked: Boolean(row.isBookmarked),
```

## Key Principles to Remember

1. **Always Filter by UserId**: Generated events should be scoped to individual users
2. **Don't Persist Events**: Events should always come fresh from the database
3. **Test WHERE Clauses**: Always verify that database queries are properly filtered
4. **Check Data Types**: SQLite uses integers for booleans (0/1), not true/false

## Testing Checklist

✅ Generate events for a user
✅ Clear events - should delete only that user's events
✅ Refresh page - events should stay cleared
✅ Check console logs for proper userId filtering
✅ Verify WHERE clauses are being applied in SQL queries

## Common Pitfalls to Avoid

❌ Don't skip WHERE clause parsing in the database layer
❌ Don't load events without userId filter
❌ Don't persist events array to localStorage
❌ Don't mix events from multiple users
❌ Don't forget boolean/integer conversions for SQLite

## Debugging Commands

If events reappear again, check these logs:
```
🔍 EventService.getEvents called with filters: {userId: "anon_xxx"}
🎯 Adding userId filter: anon_xxx
🔍 Simple eq WHERE: user_id = ? param: anon_xxx
📊 EventService.getEvents returning X events for filters: {userId: "anon_xxx"}
```

If you see events being returned without userId in the filters, that's the problem!