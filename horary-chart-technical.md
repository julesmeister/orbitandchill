# InteractiveHoraryChart Technical Documentation

## Overview
This document provides detailed technical analysis of the `InteractiveHoraryChart.tsx` component, focusing on astronomical calculations and coordinate system implementation. The component displays a traditional horary astrology chart with zodiac signs, house cusps, planets, and angular markers.

## Current Issue
The zodiac sign positioning appears to be approximately 180 degrees different from professional astrology software (astroseek.com). This suggests a fundamental coordinate system or reference frame issue.

## Component Architecture

### Core Data Flow
```
Question Date/Time → Astronomical Calculations → Chart Rendering
    ↓
London Coordinates (51.5074°, -0.1278°) → calculatePlanetaryPositions() → SVG Display
```

### Key Coordinate Systems Used

#### 1. Astronomical Longitude System
- **Range**: 0° to 360°
- **Reference**: 0° Aries at vernal equinox point
- **Direction**: Counterclockwise from 0° Aries
- **Usage**: Planet positions, house cusps, astronomical calculations

#### 2. SVG Chart Coordinate System
- **Center**: (0, 0) in SVG viewBox
- **Rotation**: 180° global rotation applied to entire chart
- **Angular conversion**: `angle = (-longitude - 90) * Math.PI / 180`
- **Rationale**: Negative for counterclockwise, -90° offset for chart orientation

## Astronomical Calculations

### Planet Position Calculation
```typescript
// From convertToNatalFormat()
const { calculatePlanetaryPositions } = await import('../../utils/natalChart');
const realChartData = await calculatePlanetaryPositions(questionDate, latitude, longitude);
```

**Input Parameters:**
- `questionDate`: JavaScript Date object for the horary question
- `latitude`: 51.5074 (London)
- `longitude`: -0.1278 (London)

**Output Format:**
```typescript
{
  planets: [
    {
      name: string,
      longitude: number,  // 0-360 degrees
      sign: string,
      house: number,
      retrograde: boolean
    }
  ],
  houses: [
    {
      number: number,
      cusp: number,      // 0-360 degrees
      sign: string
    }
  ],
  ascendant: number,   // 0-360 degrees
  midheaven: number    // 0-360 degrees
}
```

### House Cusp Calculation
Houses use a modified Placidus system with latitude-based variations:

```typescript
// From calculatePlacidusHouses() in natalChart.ts
const latFactor = Math.abs(latitude) / 90;
const houseData = [
  { number: 1, cusp: asc },                                    // ASC
  { number: 2, cusp: (asc + 25 + latFactor * 10) % 360 },    // Varied by latitude
  { number: 3, cusp: (asc + 55 + latFactor * 15) % 360 },
  { number: 4, cusp: ic },                                     // IC
  // ... etc
];
```

### Sidereal Time Calculation
```typescript
// From calculatePlacidusHouses()
const gst = Astronomy.SiderealTime(date);
const lst = (gst + longitude / 15) % 24; // Local sidereal time
const lstDegrees = lst * 15;
const mc = lstDegrees % 360; // Midheaven
```

## Zodiac Sign Positioning

### Current Implementation (PROBLEMATIC)
```typescript
// ZodiacWedge component
const signStartLongitude = index * 30; // 0° for Aries, 30° for Taurus, etc.
const angle = -(signStartLongitude + 180); // TEST: 180° rotation applied
```

**Issue Analysis:**
1. **Fixed Positioning**: Zodiac signs are positioned at fixed 30° intervals regardless of sidereal time
2. **No Sidereal Correction**: Signs don't rotate with the actual astronomical coordinate system
3. **Test Rotation**: Currently testing +180° rotation to match astroseek

### Expected Behavior vs. Actual
**Expected**: Zodiac signs should align with their astronomical positions relative to the current sidereal time and house system.

**Actual**: Signs are positioned in a fixed pattern that doesn't match the house cusps or planet positions from real astronomical calculations.

## Coordinate System Conversions

### From Astronomical to SVG
```typescript
// Planet positioning
const longitude = planet.longitude; // 0-360 astronomical degrees
const angle = ((-longitude - 90) * Math.PI) / 180; // Convert to SVG coordinates
const x = Math.cos(angle) * radius;
const y = Math.sin(angle) * radius;
```

### House Cusp Lines
```typescript
// House cusp visualization
const cuspAngle = (-house.angle - 90) * Math.PI / 180;
// Lines from radius 200 to 420
```

### Angular Markers (AC, IC, MC, DC)
```typescript
const angles = [
  { name: 'ASC', angle: ascendantHouse?.angle ?? chartDataToUse.ascendant ?? 0 },
  { name: 'DSC', angle: descendantHouse?.angle ?? ((chartDataToUse.ascendant ?? 0) + 180) % 360 },
  { name: 'MC', angle: midheavenHouse?.angle ?? chartDataToUse.midheaven ?? 90 },
  { name: 'IC', angle: imumCoeliHouse?.angle ?? ((chartDataToUse.midheaven ?? 90) + 180) % 360 }
];
```

## Potential Issues and Debugging

### 1. Reference Frame Mismatch
**Hypothesis**: The zodiac signs are using a different reference frame than the astronomical calculations.

**Evidence**: 180° offset suggests either:
- Tropical vs. Sidereal zodiac confusion
- Coordinate system orientation difference
- Epoch/equinox reference point difference

### 2. Sidereal Time Synchronization
**Issue**: Zodiac signs don't account for sidereal time rotation.

**Current**: Fixed pattern (Aries at 0°, Taurus at 30°, etc.)
**Should be**: Zodiac rotated based on Local Sidereal Time and chart orientation

### 3. House System Integration
**Problem**: Houses and zodiac signs use different positioning logic.

**Houses**: Real astronomical cusps from Placidus calculations
**Zodiac**: Fixed 30° intervals with test rotation

## Comparison Data for Debugging

### Test Configuration
- **Date**: Use same date/time as astroseek comparison
- **Location**: London (51.5074°, -0.1278°)
- **House System**: Placidus (both systems)
- **Zodiac**: Tropical (standard for Western astrology)

### Debug Output Format
```typescript
console.log('🌟 Chart Comparison Data:');
console.log('Sun longitude:', sunLongitude, '° - should be in', expectedSign);
console.log('Moon longitude:', moonLongitude, '° - should be in', expectedSign);
console.log('Ascendant:', ascendant, '° - should be in', expectedSign);
console.log('Midheaven:', midheaven, '° - should be in', expectedSign);
```

### Astroseek Comparison Points
1. **Sun Sign Position**: Check if Sun longitude places it in correct zodiac sign
2. **Ascendant Sign**: Verify 1st house cusp aligns with correct zodiac boundary
3. **House-Sign Relationships**: Ensure house cusps fall within appropriate zodiac segments

## Potential Solutions

### 1. Sidereal-Based Zodiac Positioning
Instead of fixed positioning, calculate zodiac based on sidereal time:
```typescript
const siderealTimeOffset = calculateSiderealOffset(questionDate, longitude);
const zodiacRotation = siderealTimeOffset * 15; // Convert hours to degrees
const correctedZodiacPosition = (index * 30 + zodiacRotation) % 360;
```

### 2. House-Synchronized Zodiac
Align zodiac with the actual house cusp calculations:
```typescript
// Use the same coordinate system as houses
const zodiacAlignment = houses[0].cusp; // Ascendant-based alignment
const signPosition = (index * 30 + zodiacAlignment) % 360;
```

### 3. Astronomical Library Integration
Use the same astronomy-engine calculations for zodiac positioning:
```typescript
// Calculate zodiac boundaries using same method as planets
const ariesPoint = calculateAriesPoint(questionDate, latitude, longitude);
const signBoundary = (ariesPoint + index * 30) % 360;
```

## Files Requiring Investigation

### 1. `/src/utils/natalChart.ts`
- `calculatePlanetaryPositions()` function
- `calculatePlacidusHouses()` function
- Sidereal time calculations
- Coordinate system conversions

### 2. `/src/components/horary/InteractiveHoraryChart.tsx`
- `ZodiacWedge` component positioning logic
- Global chart rotation (currently 180°)
- Coordinate system consistency

### 3. Astronomy Engine Integration
- Verify astronomy-engine library usage
- Check for coordinate system parameters
- Validate epoch and reference frame settings

## Questions for ChatGPT Analysis

1. **Why might there be a 180° offset between calculated zodiac positions and astroseek.com?**

2. **What is the correct way to synchronize zodiac sign boundaries with Placidus house cusps?**

3. **Should the zodiac signs rotate with sidereal time, or remain fixed relative to the ecliptic?**

4. **What reference frame should be used for tropical zodiac positioning in horary astrology?**

5. **How should the coordinate system conversion account for different software implementations?**

This documentation provides the technical foundation for diagnosing the zodiac alignment discrepancy and implementing the correct astronomical positioning system.