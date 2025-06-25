# Threading Utilities

Legacy utility functions for comment threading visualization. These utilities were originally designed for a more complex threading system but are preserved for reference and potential future use.

## Overview

This module contains utility functions for calculating positions, margins, and styling for threaded comment systems. While the current implementation uses the simpler `ThreadingLines` component, these utilities provide a foundation for more complex threading scenarios.

## Functions

### ThreadingProps Interface

```typescript
export interface ThreadingProps {
  nested: number;              // Nesting level (0, 1, 2, etc.)
  hasChildren: boolean;        // Whether this comment has replies
  isLast: boolean;            // Whether this is the last comment in its level
  isParent?: boolean;         // Whether this comment is a parent
  isLastParent?: boolean;     // Whether this is the last parent comment
  parentCommentLength?: number; // Length of parent comment content
  index?: number;             // Index within siblings
  totalChildren?: number;     // Total number of child comments
}
```

### Core Functions

#### `getVerticalLineHeight(props: ThreadingProps): string`

Calculates the height of vertical threading lines based on comment position.

**Logic:**
- `isLastParent`: Returns `'50%'` to stop at midpoint
- `!isLast && nested === 1`: Returns `'100%'` for continuation
- `!isLast`: Returns `'100%'` for non-terminal comments
- Default: Returns `'50%'` for terminal comments

#### `getLineLeftPosition(props: ThreadingProps): number`

Determines horizontal positioning for threading lines.

**Position Matrix:**
- `nested === 0 && !hasChildren`: `0px`
- `hasChildren && nested === 0`: `12px`
- `hasChildren && nested === 1`: `22px`
- `!hasChildren && nested === 1`: `22px`
- `!hasChildren && nested === 2`: `50px`

#### `getContainerMargin(nested: number): number`

Calculates container margins based on nesting level.

**Values:**
- `nested === 1 || nested === 2`: `12px`
- Default: `22px`

#### `getContentMargin(props: ThreadingProps): number`

Determines content margin to accommodate threading lines.

**Position Matrix:**
- `nested === 0 && !hasChildren`: `0px`
- `hasChildren && nested === 0`: `28px`
- `hasChildren && nested === 1`: `66px`
- `!hasChildren && nested === 1`: `68px`
- `!hasChildren && nested === 2`: `94px`

### Styling Functions

#### `threadingStyles`

Pre-defined style objects for threading elements:

**verticalLine(props):**
```typescript
{
  position: 'absolute',
  left: `${getLineLeftPosition(props)}px`,
  top: 0,
  width: '2px',
  backgroundColor: '#d9d9d9',
  height: getVerticalLineHeight(props),
}
```

**horizontalLine(nested):**
```typescript
{
  position: 'absolute',
  height: nested !== 1 ? '1px' : '2px',
  width: nested === 2 ? '12px' : '10px',
  backgroundColor: '#d9d9d9',
  left: nested === 1 ? '24px' : '50px',
  top: nested !== 1 ? '26px' : '24px',
}
```

**connectionDot:**
```typescript
{
  position: 'absolute',
  width: '8px',
  height: '8px',
  backgroundColor: '#60a5fa',
  borderRadius: '50%',
  border: '2px solid white',
  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
}
```

#### `shouldShowVerticalLine(props: ThreadingProps)`

Complex logic for determining when to show inner and outer vertical lines.

**Returns:**
```typescript
{
  inner: boolean;  // Show inner vertical line
  outer: boolean;  // Show outer vertical line
}
```

## Usage Patterns

### Basic Threading

```typescript
import { threadingStyles, getContentMargin } from '@/utils/threading/threadingUtils';

const props = {
  nested: 1,
  hasChildren: false,
  isLast: false
};

const containerStyle = {
  marginLeft: `${getContentMargin(props)}px`
};

const lineStyle = threadingStyles.verticalLine(props);
```

### Complex Threading Logic

```typescript
import { shouldShowVerticalLine } from '@/utils/threading/threadingUtils';

const lineVisibility = shouldShowVerticalLine({
  nested: 2,
  hasChildren: false,
  isLast: true,
  isParent: false,
  isLastParent: true
});

// Use lineVisibility.inner and lineVisibility.outer
```

## Migration Notes

The current implementation has moved to a simpler SVG-based approach in `ThreadingLines.tsx`. These utilities remain available for:

1. **Legacy Support**: Existing implementations using these utilities
2. **Complex Scenarios**: When more detailed positioning control is needed
3. **Reference**: Understanding the evolution of the threading system
4. **Future Development**: Potential enhanced threading features

## Design Evolution

The threading system has evolved from:

1. **CSS-based positioning** (these utilities) → **SVG-based drawing** (current)
2. **Complex calculation matrix** → **Simplified height/sibling logic**
3. **Multi-property positioning** → **Curve-based connection paths**

## Compatibility

These utilities work with:
- React 16.8+
- TypeScript 4.0+
- Any CSS-in-JS solution
- Standard CSS modules

## Performance Considerations

- **Pure functions**: All utilities are stateless and pure
- **Memoization friendly**: Results can be cached safely
- **Type-safe**: Full TypeScript support with strict typing
- **Tree-shakeable**: Import only needed functions