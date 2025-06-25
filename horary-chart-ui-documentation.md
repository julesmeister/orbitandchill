# Horary Chart UI Documentation for Replication

## Complete Visual Design Specification

This document provides exact specifications for replicating the horary chart UI, including all visual elements, colors, sizes, animations, and interactions.

## Chart Container Setup

### SVG Container
```jsx
<div ref={containerRef} className={`relative ${className}`}>
  <svg
    width="100%"
    height="100%"
    viewBox="-600 -600 1200 1200"
    style={{ maxHeight: '90vh', minHeight: '600px' }}
  >
```

**Container Specifications:**
- **Position**: Relative positioning for tooltip overlay
- **SVG Viewport**: 1200x1200 units centered at (0,0)
- **Responsive Constraints**: 
  - Maximum height: 90% of viewport height
  - Minimum height: 600px
  - Width: 100% of container

## Three-Ring Design Specifications

### 1. Outer Ring - Zodiac Signs

**Dimensions:**
- Inner radius: 420px
- Outer radius: 525px
- Ring width: 105px

**Visual Properties:**
```typescript
const zodiacColors = {
  "♈": "#ef4444", // Aries - red-500
  "♉": "#10b981", // Taurus - emerald-500
  "♊": "#f59e0b", // Gemini - amber-500
  "♋": "#06b6d4", // Cancer - cyan-500
  "♌": "#f97316", // Leo - orange-500
  "♍": "#84cc16", // Virgo - lime-500
  "♎": "#ec4899", // Libra - pink-500
  "♏": "#dc2626", // Scorpio - red-600
  "♐": "#d97706", // Sagittarius - amber-600
  "♑": "#64748b", // Capricorn - slate-500
  "♒": "#0ea5e9", // Aquarius - sky-500
  "♓": "#22d3ee"  // Pisces - cyan-400
};
```

**Wedge Properties:**
- Base opacity: 0.3
- Hover opacity: 0.8
- Hover scale: 1.02
- Transition: all 0.3s ease
- Cursor: pointer

**Symbol Specifications:**
- Custom SVG paths for each zodiac symbol
- Symbol size: 27px (scaled from 20px base)
- Stroke color: #374151 (gray-700)
- Stroke width: 1.5px
- Fill: none
- Stroke linecap: round
- Stroke linejoin: round

### 2. Middle Ring - Houses

**Dimensions:**
- Inner radius: 320px
- Outer radius: 420px
- Ring width: 100px

**Visual Properties:**
```typescript
const houseColors = {
  1: "#8B4513",  // saddle-brown
  2: "#D2691E",  // chocolate
  3: "#CD853F",  // peru
  4: "#DEB887",  // burlywood
  5: "#F4A460",  // sandy-brown
  6: "#DAA520",  // goldenrod
  7: "#B8860B",  // dark-goldenrod
  8: "#D2691E",  // chocolate
  9: "#8B7355",  // rosybrown
  10: "#A0522D", // sienna
  11: "#8B6914", // dark-goldenrod-4
  12: "#CD853F"  // peru
};
```

**Wedge Properties:**
- Base opacity: 0.4
- Hover opacity: 0.7
- Hover scale: 1.05
- Transition: all 0.3s ease
- Cursor: pointer

**House Number Display:**
```css
text {
  text-anchor: middle;
  dominant-baseline: middle;
  font-size: 24px;
  font-weight: 400;
  fill: #374151;  /* gray-700 */
  font-family: Arial, sans-serif;
  pointer-events: none;
}
```

### 3. Inner Area - Planets

**Dimensions:**
- Orbital radius: 280px
- Planet symbol size: 27px

**Planet Colors:**
```typescript
const planetColors = {
  sun: "#FFD700",     // gold
  moon: "#C0C0C0",    // silver
  mercury: "#FFA500", // orange
  venus: "#FF69B4",   // hot-pink
  mars: "#FF4500",    // orange-red
  jupiter: "#9932CC", // dark-orchid
  saturn: "#8B4513",  // saddle-brown
  uranus: "#4169E1",  // royal-blue
  neptune: "#00CED1", // dark-turquoise
  pluto: "#8B0000"    // dark-red
};
```

**Planet Symbols:**
```typescript
const planetSymbols = {
  sun: "☉",
  moon: "☽",
  mercury: "☿",
  venus: "♀",
  mars: "♂",
  jupiter: "♃",
  saturn: "♄",
  uranus: "♅",
  neptune: "♆",
  pluto: "♇"
};
```

**Text Properties:**
```css
text {
  text-anchor: middle;
  dominant-baseline: middle;
  font-size: 27px;
  font-family: Arial, sans-serif;
  cursor: pointer;
}
```

### 4. Center Circle

**Specifications:**
- Radius: 250px
- Fill: white
- Stroke: #e5e7eb (gray-200)
- Stroke width: 3px

**Center Text Layout:**
```typescript
// Title
<text x="0" y="-40" fontSize="14" fontWeight="bold" fill="#374151">
  Horary Question
</text>

// Date
<text x="0" y="-20" fontSize="12" fill="#6b7280">
  {date}
</text>

// Answer (conditional)
<text x="0" y="10" fontSize="16" fontWeight="bold" 
  fill={answer === 'Yes' ? '#059669' : answer === 'No' ? '#dc2626' : '#d97706'}>
  {answer}
</text>

// Timing (conditional)
<text x="0" y="30" fontSize="12" fill="#6b7280">
  {timing}
</text>

// Aspect count
<text x="0" y="60" fontSize="10" fill="#9ca3af">
  {aspectCount} aspects found
</text>
```

## Aspect Lines Visualization

### Line Properties by Aspect Type

```typescript
const ASPECT_COLORS = {
  conjunction: "#e11d48", // red-600
  sextile: "#059669",     // emerald-600
  square: "#dc2626",      // red-600
  trine: "#2563eb",       // blue-600
  opposition: "#7c2d12"   // orange-800
};

// Stroke dash patterns
const getStrokeDashArray = (aspectType) => {
  switch (aspectType) {
    case 'conjunction':
    case 'opposition':
      return 'none';        // Solid line
    case 'trine':
    case 'sextile':
      return '4,2';         // Short dashes
    case 'square':
      return '8,4';         // Long dashes
    default:
      return '2,2';         // Dots
  }
};
```

**Line Drawing Specifications:**
- **Base stroke width**: 1.5px (separating aspects)
- **Applying stroke width**: 2.5px (applying aspects)
- **Base opacity**: 0.6 (separating)
- **Applying opacity**: 0.8 (applying)
- **Line endpoints**: 250px radius (inner edge of center circle)
- **Midpoint indicator**: 4px radius circle, 0.7 opacity

## Significator Highlighting

**Visual Indicator:**
```jsx
<circle
  cx={x}
  cy={y}
  r="20"
  fill="none"
  stroke={isQuerent ? "#10b981" : "#3b82f6"} // emerald-500 or blue-500
  strokeWidth="3"
  strokeDasharray="4,2"
  opacity="0.8"
/>
```

**Colors:**
- Querent significator: #10b981 (emerald-500)
- Quesited significator: #3b82f6 (blue-500)

## Interactive Hover Effects

### Zodiac Sign Wedges
```css
/* Base state */
opacity: 0.3;
transform: scale(1);
transition: all 0.3s ease;

/* Hover state */
opacity: 0.8;
transform: scale(1.02);
transform-origin: [center of wedge];
```

### House Wedges
```css
/* Base state */
opacity: 0.4;
transform: scale(1);
transition: all 0.3s ease;

/* Hover state */
opacity: 0.7;
transform: scale(1.05);
transform-origin: [center of wedge];
```

### Unpaired Elements (Planets/Text)
```css
/* Base state */
transform: scale(1);
transition: transform 0.3s ease;

/* Hover state */
transform: scale(1.2);
```

## Tooltip Design Specifications

### Tooltip Container
```jsx
<div className="absolute pointer-events-none z-50">
  <div className="relative bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg rounded-lg min-w-[180px] max-w-[280px]">
    <div className="px-4 py-3">
      {/* Content */}
    </div>
  </div>
</div>
```

**Container Properties:**
- Background: white with 95% opacity
- Backdrop blur: sm (4px)
- Border: 1px solid #e5e7eb (gray-200)
- Shadow: shadow-lg
- Border radius: rounded-lg (8px)
- Min width: 180px
- Max width: 280px
- Padding: 16px horizontal, 12px vertical

### Tooltip Header
```jsx
<div className="flex items-center gap-2 mb-1">
  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
  <div className="text-gray-500 text-xs font-medium uppercase tracking-wide">
    {title}
  </div>
</div>
```

### Tooltip Content Styles
```css
/* Title text */
.font-bold.text-base.mb-1 {
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 4px;
}

/* Detail text */
.text-sm {
  font-size: 14px;
}

/* Muted text */
.text-gray-600 {
  color: #4b5563;
}

/* Special states */
.text-red-600 { color: #dc2626; }      /* Retrograde */
.text-emerald-600 { color: #059669; }  /* Querent */
.text-blue-600 { color: #2563eb; }     /* Quesited */
.text-green-600 { color: #16a34a; }    /* Applying */
.text-orange-600 { color: #ea580c; }   /* Separating */
```

### Tooltip Connection Path
```jsx
<svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-40">
  <defs>
    <marker
      id="tooltip-arrowhead"
      markerWidth="10"
      markerHeight="7"
      refX="9"
      refY="3.5"
      orient="auto"
      markerUnits="strokeWidth"
    >
      <polygon points="0 0, 10 3.5, 0 7" fill={tooltip.color} />
    </marker>
  </defs>
  <path
    d={bezierPath}
    stroke={tooltip.color}
    strokeWidth="1.5"
    fill="none"
    markerEnd="url(#tooltip-arrowhead)"
    strokeDasharray="3,3"
  />
  <circle cx={tooltip.x} cy={tooltip.y} r="3" fill={tooltip.color} />
</svg>
```

**Path Properties:**
- Stroke width: 1.5px
- Stroke dash: 3,3
- Arrowhead: 10x7px triangle
- Origin indicator: 3px radius circle

## Background Elements

### Guide Circles
```jsx
<circle cx="0" cy="0" r="525" fill="none" stroke="#e5e7eb" strokeWidth="1.5" />
<circle cx="0" cy="0" r="420" fill="none" stroke="#e5e7eb" strokeWidth="1.5" />
<circle cx="0" cy="0" r="320" fill="none" stroke="#e5e7eb" strokeWidth="1.5" />
```
- Stroke: #e5e7eb (gray-200)
- Stroke width: 1.5px
- Fill: none

### Logo Watermark (when no question)
```jsx
<g transform="translate(0, 0) scale(0.01, -0.01)" fill="#9ca3af" opacity="0.3">
  {/* Luckstrology logo paths */}
</g>
```
- Fill: #9ca3af (gray-400)
- Opacity: 0.3
- Scale: 0.01 (inverted Y)

## Font Specifications

### Primary Font Stack
```css
font-family: Arial, sans-serif;
```

### Font Sizes
- Zodiac symbols: 27px (via SVG scale)
- House numbers: 24px
- Planet symbols: 27px
- Center title: 14px bold
- Center date: 12px
- Answer text: 16px bold
- Timing text: 12px
- Aspect count: 10px

### Font Weights
- Normal text: 400
- Bold text: 700 (bold)
- Significator planets: bold

## Color Palette Summary

### Grayscale
- Text primary: #374151 (gray-700)
- Text secondary: #6b7280 (gray-500)
- Text muted: #9ca3af (gray-400)
- Borders: #e5e7eb (gray-200)
- White: #ffffff

### Status Colors
- Yes/Success: #059669 (emerald-600)
- No/Error: #dc2626 (red-600)
- Maybe/Warning: #d97706 (amber-600)

### Significator Colors
- Querent: #10b981 (emerald-500)
- Quesited: #3b82f6 (blue-500)

## Animation Timings

### Standard Transitions
```css
transition: all 0.3s ease;
```

### Transform Origins
- Wedges: Center of each wedge
- Planets: Center point
- Text: Center point

## Z-Index Layering

1. Background circles (z-index: 0)
2. Zodiac ring (z-index: 1)
3. House ring (z-index: 2)
4. Center circle (z-index: 3)
5. Aspect lines (z-index: 4)
6. Planets (z-index: 5)
7. Center text (z-index: 6)
8. Tooltip connection (z-index: 40)
9. Tooltip box (z-index: 50)

## Responsive Behavior

### Container Scaling
- Maintains aspect ratio
- Scales to fit container width
- Respects max-height of 90vh
- Minimum height of 600px

### Touch Interactions
- All hover effects work on touch
- Tap to show/hide tooltips
- No sticky hover states

## Code Structure for Replication

### Component Hierarchy
```
InteractiveHoraryChart
├── SVG Container
│   ├── Background Circles
│   ├── Zodiac Ring
│   │   └── ZodiacWedge × 12
│   ├── House Ring
│   │   └── HouseWedge × 12
│   ├── Center Circle
│   ├── Aspect Lines
│   ├── Planet Symbols
│   └── Center Text
└── Tooltip Overlay
    ├── Connection SVG
    └── Tooltip Box
```

### Key Implementation Notes

1. **Coordinate System**: 
   - Chart 0° (Aries) is at 9 o'clock position
   - Requires -90° adjustment from standard angles

2. **Text Rendering**:
   - All text uses `text-anchor: middle` and `dominant-baseline: middle`
   - Ensures perfect centering regardless of content

3. **Performance**:
   - Use React.memo for wedge components if needed
   - Batch tooltip state updates
   - Consider useMemo for expensive calculations

4. **Accessibility**:
   - All interactive elements have cursor: pointer
   - Tooltips provide context for all chart elements
   - Color choices meet WCAG contrast requirements

This documentation provides all specifications needed to exactly replicate the horary chart UI in any framework or implementation.