# Horary Chart Plotting Technical Documentation

## Overview
This document provides a detailed technical explanation of how the horary chart is plotted in our system, intended for the research team to identify any missing elements or improvements needed.

## Chart Structure

### SVG Canvas Setup
```typescript
<svg
  width="100%"
  height="100%"
  viewBox="-600 -600 1200 1200"
  style={{ maxHeight: '90vh', minHeight: '600px' }}
>
```
- **Coordinate System**: Centered at (0,0) with 600 units in each direction
- **Responsive**: Scales to container while maintaining aspect ratio
- **Size**: 1200x1200 units total

### Three-Ring Architecture

#### 1. Outer Ring: Zodiac Signs (radius: 420-525px)
```typescript
const innerRadius = 420;
const outerRadius = 525;
```

**Zodiac Wedge Calculation**:
```typescript
// Each sign occupies 30 degrees
const angle = index * 30;
const startAngle = (angle - 90) * Math.PI / 180;
const endAngle = ((angle + 30) - 90) * Math.PI / 180;

// Calculate wedge corners
const x1 = Math.cos(startAngle) * innerRadius;
const y1 = Math.sin(startAngle) * innerRadius;
const x2 = Math.cos(startAngle) * outerRadius;
const y2 = Math.sin(startAngle) * outerRadius;
const x3 = Math.cos(endAngle) * outerRadius;
const y3 = Math.sin(endAngle) * outerRadius;
const x4 = Math.cos(endAngle) * innerRadius;
const y4 = Math.sin(endAngle) * innerRadius;
```

**Zodiac Symbols**:
- Custom SVG paths for each zodiac symbol
- Positioned at the center of each wedge
- Size: 27px scaled appropriately

#### 2. Middle Ring: Houses (radius: 320-420px)
```typescript
const innerRadius = 320;
const outerRadius = 420;
```

**House Rotation Based on Question Time**:
```typescript
// Calculate rotation based on question time
const questionTime = question?.date ? new Date(question.date) : new Date();
const hourAngle = (questionTime.getHours() + questionTime.getMinutes() / 60) * 15; // 15 degrees per hour
const baseRotation = hourAngle % 360;

// Generate houses with rotation
houses = Array.from({ length: 12 }, (_, i) => {
  const cuspAngle = (i * 30 + baseRotation) % 360;
  const signIndex = Math.floor(cuspAngle / 30) % 12;
  
  return {
    number: i + 1,
    cusp: cuspAngle,
    sign: signNames[signIndex]
  };
});
```

**House Wedge Drawing**:
- Similar to zodiac wedges but with different radii
- House numbers (1-12) displayed in the center of each wedge
- Earth-tone colors for visual distinction

#### 3. Inner Area: Planets (radius: 280px)
```typescript
const radius = 280; // Planet orbit radius
```

**Planet Position Calculation**:
```typescript
// Convert ecliptic longitude to chart position
const longitude = planet.longitude; // 0-360 degrees
const angle = ((longitude - 90) * Math.PI) / 180; // Adjust for chart orientation
const x = Math.cos(angle) * radius;
const y = Math.sin(angle) * radius;
```

**Planet Display**:
- Unicode symbols for traditional planets (☉☽☿♀♂♃♄)
- Colored according to traditional associations
- Font size: 27px

### Center Circle (radius: 250px)
```typescript
<circle cx="0" cy="0" r="250" fill="white" stroke="#e5e7eb" strokeWidth="3" />
```
- White background for question information
- Displays question summary, answer, and timing

## Aspect Line Calculations

### Aspect Detection
```typescript
const ASPECT_ORBS = {
  conjunction: 8,
  opposition: 8,
  trine: 8,
  square: 7,
  sextile: 6
};

const ASPECT_ANGLES = {
  conjunction: 0,
  sextile: 60,
  square: 90,
  trine: 120,
  opposition: 180
};
```

**Aspect Calculation Algorithm**:
```typescript
for (let i = 0; i < planets.length - 1; i++) {
  for (let j = i + 1; j < planets.length; j++) {
    const planet1 = planets[i];
    const planet2 = planets[j];
    
    // Calculate angular difference
    let angle = Math.abs(planet1.longitude - planet2.longitude);
    if (angle > 180) angle = 360 - angle;
    
    // Check each aspect type
    Object.entries(ASPECT_ANGLES).forEach(([aspectName, aspectAngle]) => {
      const orb = ASPECT_ORBS[aspectName];
      const difference = Math.abs(angle - aspectAngle);
      
      if (difference <= orb) {
        // Aspect found within orb
        const applying = planet1.longitude < planet2.longitude ? 
          (angle < aspectAngle) : (angle > aspectAngle);
        
        aspects.push({
          planet1: planet1.name,
          planet2: planet2.name,
          aspect: aspectName,
          angle: aspectAngle,
          orb: difference,
          applying, // true if planets moving closer
          color: ASPECT_COLORS[aspectName]
        });
      }
    });
  }
}
```

### Aspect Line Drawing
```typescript
// Lines drawn from inner edge of planet ring (250px) not planet positions (280px)
const aspectRadius = 250;

const x1 = Math.cos(angle1) * aspectRadius;
const y1 = Math.sin(angle1) * aspectRadius;
const x2 = Math.cos(angle2) * aspectRadius;
const y2 = Math.sin(angle2) * aspectRadius;
```

**Line Styles**:
- Conjunction/Opposition: Solid lines
- Trine/Sextile: Dashed (4,2)
- Square: Long dashes (8,4)
- Applying aspects: Thicker lines (2.5px vs 1.5px)
- Color-coded by aspect type

## Significator System

### Identification Algorithm
```typescript
const SIGNIFICATOR_HOUSES = {
  career: { querent: 1, quesited: 10 },
  relationships: { querent: 1, quesited: 7 },
  property: { querent: 1, quesited: 4 },
  lost: { querent: 1, quesited: 2 },
  health: { querent: 1, quesited: 6 },
  general: { querent: 1, quesited: 1 }
};
```

**Question Analysis**:
```typescript
function identifySignificators(questionText: string) {
  const lowerQuestion = questionText.toLowerCase();
  
  // Keyword matching for question categorization
  if (lowerQuestion.includes('job') || lowerQuestion.includes('career')) {
    category = 'career';
  } else if (lowerQuestion.includes('relationship') || lowerQuestion.includes('love')) {
    category = 'relationships';
  }
  // ... etc
}
```

**Visual Highlighting**:
```typescript
// Find house rulers based on sign on cusp
const houseRulers = houses.map(house => ({
  house: house.number,
  ruler: SIGN_RULERS[house.sign]
}));

// Highlight significator planets
{isSignificator && (
  <circle
    cx={x} cy={y} r="20"
    fill="none"
    stroke={planet.name === querentRuler ? "#10b981" : "#3b82f6"}
    strokeWidth="3"
    strokeDasharray="4,2"
  />
)}
```

## Current Data Structure

### Sample Planet Data
```typescript
planets = [
  { name: 'sun', longitude: 120, sign: 'leo', house: 5, retrograde: false },
  { name: 'moon', longitude: 240, sign: 'sagittarius', house: 9, retrograde: false },
  { name: 'mercury', longitude: 90, sign: 'cancer', house: 4, retrograde: false },
  { name: 'venus', longitude: 150, sign: 'virgo', house: 6, retrograde: false },
  { name: 'mars', longitude: 300, sign: 'aquarius', house: 11, retrograde: false },
  { name: 'jupiter', longitude: 60, sign: 'gemini', house: 3, retrograde: false },
  { name: 'saturn', longitude: 270, sign: 'capricorn', house: 10, retrograde: false }
];
```
**Note**: Currently using static sample data. Real astronomical calculations not yet integrated.

### House Generation
```typescript
houses = Array.from({ length: 12 }, (_, i) => {
  const cuspAngle = (i * 30 + baseRotation) % 360;
  const signIndex = Math.floor(cuspAngle / 30) % 12;
  
  return {
    number: i + 1,
    cusp: cuspAngle,
    sign: ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
           'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'][signIndex]
  };
});
```
**Note**: Using equal house system (30° each) with rotation. Real house systems (Placidus, Regiomontanus) not implemented.

## Interactive Features

### Tooltip System
- **Planets**: Show name, sign, house, position, retrograde status, significator role
- **Houses**: Show number, sign on cusp, traditional meaning
- **Zodiac**: Show sign name, element, quality, ruler
- **Aspects**: Show planets involved, aspect type, orb, applying/separating

### Hover Effects
- Zodiac wedges: Scale to 1.02, opacity 0.8
- House wedges: Scale to 1.05, opacity 0.7
- Planets: Scale to 1.2 for unpaired elements
- Aspect lines: Hover zones at midpoint

## What's Currently Missing

### 1. Real Astronomical Data
- **Current**: Static sample planetary positions
- **Needed**: Integration with astronomy-engine for accurate positions based on question time/location

### 2. House Systems
- **Current**: Equal houses (30° each) with simple rotation
- **Needed**: Placidus or Regiomontanus calculations based on latitude

### 3. Additional Celestial Points
- **Missing**: North/South Nodes
- **Missing**: Part of Fortune
- **Missing**: Fixed stars (if used in horary)

### 4. Traditional Horary Indicators
- **Missing**: Void of Course Moon indicator
- **Missing**: Planetary hour ruler
- **Missing**: Day ruler
- **Missing**: Ascending degree warnings (too early/too late)

### 5. Dignities and Debilities
- **Missing**: Essential dignity indicators (domicile, exaltation, detriment, fall)
- **Missing**: Accidental dignity factors (angular houses, direct motion)
- **Missing**: Mutual reception indicators

### 6. Advanced Aspect Features
- **Missing**: Antiscia/contra-antiscia
- **Missing**: Translation of light
- **Missing**: Collection of light
- **Missing**: Aspect perfection indicators

### 7. Visual Enhancements
- **Missing**: Retrograde motion indicators (℞ symbol)
- **Missing**: Combust/under rays indicators
- **Missing**: Speed indicators (fast/slow planets)
- **Missing**: Aspect strength visualization

### 8. Chart Metadata
- **Missing**: Location coordinates display
- **Missing**: Sidereal time
- **Missing**: House system used
- **Missing**: Tropical/Sidereal zodiac indicator

## Technical Implementation Notes

### Coordinate System
- 0° is at 3 o'clock position in standard geometry
- Chart 0° (Aries) is at 9 o'clock, requiring -90° adjustment
- All angles converted to radians for trigonometric calculations

### SVG Rendering Order
1. Background circles
2. Zodiac ring (outer)
3. House ring (middle)
4. Center circle (white background)
5. Aspect lines
6. Planets
7. Center text (question info)

### Performance Considerations
- All calculations done in component render
- No memoization currently implemented
- Tooltips use React state, not DOM manipulation

## Questions for Research Team

1. **House System**: Should we implement Regiomontanus (Lilly's preference) or allow multiple house systems?

2. **Planetary Positions**: What level of accuracy is needed? Arc-minutes? Arc-seconds?

3. **Additional Points**: Which non-planetary points are essential for horary work?

4. **Aspect Doctrine**: Are the current orbs correct? Should we include minor aspects?

5. **Visual Priorities**: Which missing elements are most critical for accurate horary judgment?

6. **Traditional vs Modern**: Should we include outer planets (Uranus, Neptune, Pluto) as an option?

7. **Timing Methods**: What timing techniques should be implemented (degrees = time units, etc.)?

8. **Radicality Checks**: Which traditional warnings should prevent chart judgment?