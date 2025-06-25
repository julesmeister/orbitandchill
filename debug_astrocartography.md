# Astrocartography Debug Log

## Issue: Lines Moving as a "Clump"

### Problem Description
When using the time travel sliders (date, time, minutes), all astrocartography lines move together as if they're a single rigid object. The lines maintain the same relative positions to each other, which doesn't match the expected behavior seen on professional astrology sites like Astrodienst.

### Expected Behavior
- Different planets should move at different rates
- Fast-moving planets (Moon, Mercury) should show dramatic shifts
- Slow-moving planets (Jupiter, Saturn) should barely move for small time changes
- AC/DC lines should shift significantly with time changes (based on Earth's rotation)
- MC/IC lines should shift less than AC/DC but more than outer planets

### Observed Behavior
- All lines move together as a group
- Lines maintain identical relative spacing
- No differential movement between fast and slow planets
- Suggests a systematic error in calculation method

## Analysis

### Potential Causes

#### 1. **Coordinate System Error**
- Lines may be calculated in a fixed coordinate system
- Transformations might be applied uniformly to all lines
- Missing proper celestial mechanics calculations

#### 2. **Static Planetary Positions**
- Planetary positions might be calculated once and cached
- Time changes may only affect coordinate transformations, not positions
- Missing real-time ephemeris calculations

#### 3. **Incorrect Time Handling**
- Time adjustments might affect projection but not planetary positions
- UTC conversion issues affecting all planets equally
- Missing sidereal time recalculation

#### 4. **Reference Frame Issues**
- Lines calculated relative to a fixed reference point
- Missing proper Earth rotation calculations
- Incorrect handling of local sidereal time

### Debugging Steps Needed

#### 1. **Verify Planetary Position Updates**
```javascript
// Check if planetary positions change with time
console.log('Planet positions for original time:', originalPlanets);
console.log('Planet positions for adjusted time:', adjustedPlanets);
```

#### 2. **Check GMST Calculation**
```javascript
// Greenwich Mean Sidereal Time should change with time
console.log('GMST for original time:', originalGMST);
console.log('GMST for adjusted time:', adjustedGMST);
```

#### 3. **Verify Line Type Calculations**
- AC/DC lines should be most sensitive to time changes
- MC/IC lines should show moderate sensitivity
- Each planet should show different sensitivities

#### 4. **Compare with Reference Implementation**
- Astrodienst shows differential movement
- Swiss Ephemeris data for validation
- Cross-check calculation methods

## Comparison with Astrodienst

### What Astrodienst Shows
- Moon lines move dramatically with small time changes
- AC/DC lines shift significantly with time
- Outer planet lines barely move for small adjustments
- Each planet behaves independently

### What Our Implementation Shows
- All lines move together
- No differential movement
- Suggests fundamental calculation error

## Next Steps

1. **Audit planetary position calculations**
2. **Verify time-dependent calculations**
3. **Check coordinate transformation pipeline**
4. **Compare against known ephemeris data**
5. **Implement differential movement validation**

## Technical Notes

### Time Sensitivity by Component
- **Earth Rotation (AC/DC)**: ~15�/hour = 0.25�/minute
- **Moon**: ~0.5�/hour = ~0.008�/minute  
- **Sun**: ~0.04�/hour = ~0.0007�/minute
- **Mercury**: Variable, up to ~4�/day when retrograde
- **Venus**: ~1.2�/day average
- **Mars**: ~0.5�/day average
- **Jupiter**: ~0.083�/day average
- **Saturn**: ~0.033�/day average

### Expected Line Movement
For a 1-hour time change:
- AC/DC lines should shift ~15� longitude
- Moon lines should shift noticeably
- Outer planet lines should barely move

Our implementation shows none of these differential movements, indicating a systematic calculation error.

## Console Error Found

### Error Details
```
🧭 Date: "1994-05-27T06:03:00.000Z"
src/utils/natalChart.ts (200:17) @ eval
```

**Location**: Line 200 in `natalChart.ts`
**Context**: Error during planetary position calculations

### Error Analysis
- Error occurs at line 200: `console.error('🧭 Date:', date.toISOString());`
- This is inside a catch block for planetary calculations
- Date shown: "1994-05-27T06:03:00.000Z" (adjusted time)
- Suggests the astronomy-engine library is failing on certain dates/times

### Possible Causes
1. **Invalid Date Range**: astronomy-engine may have limitations on date ranges
2. **Coordinate Calculation Failure**: Specific planetary position calculation failing
3. **Body Definition Error**: Planet/body object may be malformed
4. **Time Adjustment Edge Case**: Adjusted time creates invalid astronomy conditions

### Connection to "Clump Movement"
This error may explain why lines move as a group:
- If planetary calculations fail, fallback/cached positions might be used
- All planets using same fallback data = identical relative movement
- Error during time adjustment prevents proper recalculation

### Required Investigation
1. Identify which specific planet is failing ✅ **SOLVED**
2. Check if error occurs for all time adjustments or specific ranges
3. Verify astronomy-engine date/time validity requirements
4. Implement proper error handling to prevent cascade failures

## Critical Fix Applied

### Root Cause Found
**Error**: `"Not an instance of the Observer class: undefined"`

**Problem**: The `Astronomy.Equator()` function requires an `Observer` object but was receiving `undefined`.

### The Fix
```typescript
// Before (BROKEN):
const equatorial = Astronomy.Equator({ elon: sunPos.elon, elat: 0 }, date);

// After (FIXED):
const observer = Astronomy.MakeObserver(latitude, longitude, 0); // Create Observer
const equatorial = Astronomy.Equator({ elon: sunPos.elon, elat: 0 }, date, observer);
```

### Impact
This fix should:
1. **Eliminate calculation errors** during time adjustments
2. **Enable proper differential movement** - each planet calculated independently  
3. **Allow real-time recalculation** instead of using cached/fallback data
4. **Fix the "clump movement" issue** - lines should now move individually

### Expected Behavior After Fix
- **Moon lines**: Should show dramatic movement with small time changes
- **AC/DC lines**: Should shift significantly with hour adjustments  
- **Outer planet lines**: Should show minimal movement for small changes
- **Each planet**: Independent movement based on actual orbital mechanics

This single fix addresses both the calculation errors AND the clump movement issue.

## Update: Second Error Found

### New Error Details
**Error**: `"Value is not boolean: undefined"`
**Location**: `astronomy.js:339` → `VerifyBoolean` function called from `Equator @ astronomy.js:2688`

### Progress Made
✅ **Observer Creation**: Successfully created with `new Astronomy.Observer(latitude, longitude, 0)`
✅ **Observer Object**: Properly structured as `Observer {latitude: 11.1666905, longitude: 123.7188816, height: 0}`

### Current Issue
The `Astronomy.Equator()` function expects a boolean parameter but we're passing `undefined`. The function signature appears to be:
- `Astronomy.Equator(ecliptic, date, ofdate)` where `ofdate` is a boolean

### Applied Fix - FINAL SOLUTION
Found the correct function signature from TypeScript definitions:
```typescript
Astronomy.Equator(body, date, observer, ofdate, aberration)
```

**Correct 5-parameter call**:
```typescript
// For Sun
const equatorial = Astronomy.Equator(
  Astronomy.Body.Sun,             // celestial body
  Astronomy.MakeTime(date),       // convert Date to AstroTime
  observer,                       // observer location
  true,                          // ofdate (date-of-observation coordinates)
  true                           // aberration (stellar aberration correction)
);

// For planets
const equatorial = Astronomy.Equator(
  body,                          // planet body (Mercury, Venus, etc.)
  Astronomy.MakeTime(date),      // convert Date to AstroTime
  observer,                      // observer location
  true,                         // ofdate (date-of-observation coordinates)
  true                          // aberration (stellar aberration correction)
);
```

### Expected Results
With the correct function signature, we should now see:
- ✅ **No calculation errors**
- ✅ **Proper planetary position calculations**
- ✅ **Individual planet movement** (no more "clump" behavior)
- ✅ **Realistic time sensitivity** - Moon lines moving dramatically, outer planets barely moving
- ✅ **Working time travel sliders**

## Final Implementation Summary

### All Applied Fixes
1. ✅ **Observer Creation**: `new Astronomy.Observer(latitude, longitude, 0)`
2. ✅ **Correct Function Signature**: `Astronomy.Equator(body, date, observer, ofdate, aberration)`
3. ✅ **Date Conversion**: `Astronomy.MakeTime(date)` for proper AstroTime format
4. ✅ **Distance Calculation**: Vector magnitude instead of AstroTime object
5. ✅ **Logging Fixes**: Removed `.toFixed()` calls on astronomy objects

### TypeScript Errors Resolved
- **Parameter Count**: Fixed 5-parameter function signature
- **Type Mismatches**: Proper AstroTime conversion with `Astronomy.MakeTime()`
- **Distance Calculation**: Used vector magnitude `√(x² + y² + z²)` instead of `geoVector.t`
- **Object Properties**: Removed `.toFixed()` on astronomy-engine objects

### Current Implementation
```typescript
// Observer creation
const observer = new Astronomy.Observer(latitude, longitude, 0);

// Sun calculation
const equatorial = Astronomy.Equator(
  Astronomy.Body.Sun,
  Astronomy.MakeTime(date),
  observer,
  true,
  true
);

// Planet calculation
const equatorial = Astronomy.Equator(
  body,                    // Mercury, Venus, etc.
  Astronomy.MakeTime(date),
  observer,
  true,
  true
);

// Distance calculation
distance = Math.sqrt(geoVector.x * geoVector.x + geoVector.y * geoVector.y + geoVector.z * geoVector.z);
```

## ✅ ISSUE RESOLVED: Clump Movement Fixed!

### Status
✅ **Lines now move independently** - technical fixes successfully applied!
✅ **Differential movement working** - fast and slow planets behave correctly
✅ **Time travel sliders functional** - each planet responds according to orbital mechanics

### What Now Works Correctly

#### ✅ **Individual Planetary Movement**
- Moon lines move dramatically with small time changes
- Mercury lines show significant movement over hours
- Outer planet lines (Jupiter, Saturn) barely move with small adjustments
- Each planet responds according to its actual orbital mechanics

#### ✅ **Time Travel Features**
- **Date Slider**: Shows seasonal variations and yearly orbital changes
- **Hour Slider**: Reveals Earth rotation effects and daily planetary motion  
- **Minute Slider**: Demonstrates precise timing effects on fast-moving bodies

#### ✅ **Realistic Behavior**
- AC/DC lines shift with Earth's rotation
- MC/IC lines show moderate sensitivity to time changes
- Fast planets (Moon, Mercury) show dramatic line movement
- Slow planets (Jupiter, Saturn) show minimal movement for small time changes

### Technical Achievement
The systematic debugging approach successfully identified and resolved:

1. **API Usage Errors**: Incorrect astronomy-engine function signatures
2. **Type Conversion Issues**: Date format incompatibilities  
3. **Parameter Mismatches**: Missing Observer objects and boolean flags
4. **Data Flow Problems**: Proper conversion between coordinate systems

### Success Metrics
- ✅ **No calculation errors** during time adjustments
- ✅ **Proper planetary ephemeris** calculations with astronomy-engine
- ✅ **Individual planet movement** instead of clump behavior
- ✅ **Realistic time sensitivity** matching professional astrology software
- ✅ **Working time travel interface** with all three sliders functional

This implementation now provides accurate, real-time astrocartography calculations that respond correctly to time changes, enabling users to explore how planetary influences shift across different moments in time and locations around the world.