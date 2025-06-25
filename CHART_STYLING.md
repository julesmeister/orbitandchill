# Chart Styling & Design System

## Overview
This document outlines the visual design system and styling patterns for astrological charts in the Luckstrology application. All charts follow the Synapsas design aesthetic with consistent black borders, structured layouts, and clear visual hierarchy.

## Synapsas Design Aesthetic

### Color Palette
- **Primary Border Color**: `#19181a` (Synapsas black)
- **Border Width**: `strokeWidth="2"` (consistent across all chart elements)
- **Background**: White fills with colored accents

### Border Standards
All chart elements use consistent Synapsas black borders:
- Zodiac wedges: `stroke="#19181a" strokeWidth="2"`
- House wedges: `stroke="#19181a" strokeWidth="2"`
- Planet markers: `stroke="#19181a" strokeWidth="2"`
- Center logo circle: `stroke="#19181a" strokeWidth="2"`

## Chart Component Architecture

### Natal Chart (`/src/components/charts/InteractiveNatalChart.rings.tsx`)

#### Ring Structure (Outside to Inside)
1. **Outer Ring (525px radius)**: Zodiac signs with colored fills and black borders
2. **Middle Ring (420px radius)**: Houses with colored fills and black borders  
3. **Inner Ring (280px radius)**: Planet positions with colored dashed borders
4. **Center Circle (250px radius)**: Logo area with black border

#### Planet Markers Design
```typescript
// Each planet marker has:
<circle
  cx={x}
  cy={y}
  r="18"
  fill="white"
  stroke={planetColors[planet.name]}  // Color-coded dashed borders
  strokeWidth="2"
  strokeDasharray="4,2"              // Dashed pattern
  style={{ cursor: 'pointer' }}
/>
```

**Features**:
- White circular background
- Color-coded dashed borders matching planet colors
- Planet symbols rendered in matching colors
- Hover effects with scale transforms

#### Logo Scaling
```typescript
// Center logo with increased scale for visibility
<g transform="translate(0, 0) scale(0.025, -0.025)" fill="#9ca3af" opacity="0.7">
```

### Horary Chart (`/src/components/horary/InteractiveHoraryChart.tsx`)

#### Planet Information Stack
The horary chart includes detailed planet information rings:

**Ring Layout** (Outside to Inside):
1. **Degrees Ring (340px radius)**: Shows degree within sign
2. **Zodiac Ring (310px radius)**: Zodiac symbols for each planet
3. **Minutes Ring (280px radius)**: Shows minutes within degree
4. **Retrograde Ring (260px radius)**: Retrograde indicators

#### Zodiac Symbol Sizing Fix
**Problem**: Zodiac symbols in planet info stack were too small compared to other text
**Solution**: Enhanced scaling and centering

```typescript
// Fixed zodiac symbol sizing in PlanetInfoStack.tsx
<g transform={`translate(${signPos.x}, ${signPos.y})`}>
  <g transform="scale(1.5) translate(-8, -8)">
    <ZodiacSymbolIcon 
      symbol={ZODIAC_SYMBOLS[Math.floor(longitude / 30)]} 
      size="large" 
      asInlineSVG={true}
    />
  </g>
</g>
```

**Technical Details**:
- `scale(1.5)`: Makes zodiac symbols 50% larger
- `translate(-8, -8)`: Re-centers the scaled symbol
- `size="large"`: Uses largest predefined size
- Proper transform order: position → scale → re-center

## Visual Hierarchy

### Size Relationships
- **Planet symbols**: Largest, most prominent
- **Zodiac symbols in info stack**: 1.5x scaled, well-proportioned to planets
- **Degree/minute text**: Smaller, supporting information
- **Borders**: Consistent 2px width throughout

### Color Coding
- **Planets**: Each has unique color (Sun=gold, Mars=red, Venus=pink, etc.)
- **Zodiac signs**: Synapsas palette variations
- **Houses**: Synapsas palette with transparency
- **Borders**: Always Synapsas black (`#19181a`)

## Component Styling Patterns

### Border Implementation
```typescript
// Standard border pattern used across all chart elements
stroke="#19181a"
strokeWidth="2"
```

### Hover Effects
```typescript
// Consistent hover scaling
transform={isHovered ? 'scale(1.05)' : 'scale(1)'}
opacity={isHovered ? 0.8 : 0.5}
```

### Dashed Borders (Planet Markers)
```typescript
// Subtle dashed pattern for planet markers
strokeDasharray="4,2"
```

## Best Practices

### Consistent Scaling
- Always use transform groups for proper centering: `translate() → scale() → re-center`
- Test scaling at different chart sizes to ensure proportionality

### Color Harmony
- Maintain consistent border color (`#19181a`) across all elements
- Use planet-specific colors for functional differentiation
- Keep backgrounds neutral (white/light gray) for readability

### Accessibility
- Ensure sufficient color contrast
- Provide hover tooltips for all interactive elements
- Use consistent cursor styling (`cursor: 'pointer'` for interactive elements)

## File Locations

### Key Chart Files
- `/src/components/charts/InteractiveNatalChart.rings.tsx` - Main natal chart
- `/src/components/horary/InteractiveHoraryChart.tsx` - Horary chart
- `/src/components/horary/PlanetInfoStack.tsx` - Planet information rings
- `/src/components/horary/tooltips/ZodiacSymbolIcon.tsx` - Reusable zodiac symbols

### Styling References
- `/synapsas.md` - Synapsas design system guidelines
- Color palette and border specifications

## Recent Improvements

### December 2024 Updates
1. **Added Synapsas black borders** to all chart elements for visual consistency
2. **Enhanced planet markers** with color-coded dashed borders
3. **Increased logo size** in center of natal chart (scale 0.025)
4. **Fixed zodiac symbol sizing** in horary chart planet info stack
5. **Improved visual hierarchy** with consistent border widths and spacing

### Solved Issues
- **Overlapping wedges**: Resolved with clear black border separation
- **Inconsistent styling**: Unified all borders to Synapsas black standard
- **Small zodiac symbols**: Fixed with 1.5x scaling and proper centering
- **Visual hierarchy**: Balanced all elements for optimal readability