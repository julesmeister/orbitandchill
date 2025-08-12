# Lint and TypeScript Error Handling System

## 🏗️ Complete Lint & TypeScript Error Handling Tree

```
Error Handling System Architecture
├── 📁 Configuration & Rules
│   ├── Core Principles
│   │   ├── ❌ NEVER auto-fix without review
│   │   ├── 🔒 Preserve intentional eslint-disable comments
│   │   ├── 🎯 Fix root cause, not symptoms
│   │   └── 📊 Warnings vs Errors distinction
│   └── File-Level Disable Comments (INTENTIONAL - DO NOT REMOVE)
│       ├── /* eslint-disable @typescript-eslint/no-unused-vars */
│       ├── /* eslint-disable @typescript-eslint/no-explicit-any */
│       └── Added per CLAUDE.md to reduce development noise
│
├── 🔧 Error Resolution Workflow Tree
│   ├── 1️⃣ TypeScript Error Detection
│   │   ├── Command: NODE_OPTIONS="--max-old-space-size=1024" npx tsc --noEmit --skipLibCheck
│   │   ├── Priority: Fix BEFORE ESLint (TypeScript errors block builds)
│   │   └── Focus Areas:
│   │       ├── Import/export mismatches
│   │       ├── Interface compatibility issues
│   │       ├── Missing required properties
│   │       └── Function signature mismatches
│   │
│   ├── 2️⃣ TypeScript Error Classification Tree
│   │   ├── Import Errors
│   │   │   ├── Pattern: "No exported member 'X'"
│   │   │   ├── Solution: Check correct export name in target file
│   │   │   └── Fix: Update import to match actual export
│   │   ├── Interface Compatibility
│   │   │   ├── Pattern: "Type 'X' is not assignable to type 'Y'"
│   │   │   ├── Root Cause Analysis Tree:
│   │   │   │   ├── Multiple interface definitions (use: grep -r "interface Name" src/)
│   │   │   │   ├── Optional vs required properties (? vs non-?)
│   │   │   │   ├── Union type differences ('a'|'b' vs 'a'|'b'|'c')
│   │   │   │   └── Import path targeting wrong definition
│   │   │   └── Solution Strategy:
│   │   │       ├── Consolidate to single source of truth in src/types/
│   │   │       ├── Update all imports to canonical version
│   │   │       └── Align required/optional properties with usage
│   │   ├── Missing Properties
│   │   │   ├── Pattern: "Property 'X' is missing in type 'Y'"
│   │   │   ├── Mock Object Issues:
│   │   │   │   ├── Add ALL required properties to mock objects
│   │   │   │   └── Use empty strings/defaults for unused props
│   │   │   └── Nested Interface Requirements:
│   │   │       ├── Check complete interface tree structure
│   │   │       └── Include all nested required properties
│   │   └── Function Signature Mismatches
│   │       ├── Generic strings vs literal types
│   │       ├── Solution: Use specific union types
│   │       └── Example: (tab: string) → (tab: 'all' | 'bookmarked')
│   │
│   ├── 3️⃣ ESLint Error Detection
│   │   ├── Command: NODE_OPTIONS="--max-old-space-size=1024" npx eslint --ext .ts,.tsx src/ --quiet
│   │   ├── Flag: --quiet (errors only, NOT warnings)
│   │   └── Priority: Fix AFTER TypeScript errors resolved
│   │
│   ├── 4️⃣ ESLint Error Resolution Tree
│   │   ├── @typescript-eslint/no-require-imports
│   │   │   ├── Solution: Add eslint-disable-next-line above require()
│   │   │   └── Pattern: // eslint-disable-next-line @typescript-eslint/no-require-imports
│   │   ├── prefer-const
│   │   │   ├── Solution: Change let → const for unmodified variables
│   │   │   └── Check: Variable never gets reassigned after declaration
│   │   ├── @typescript-eslint/no-explicit-any
│   │   │   ├── Preferred: Add proper type definitions
│   │   │   └── Fallback: eslint-disable-next-line with justification
│   │   └── React Hook Dependencies (WARNINGS - Handle Carefully)
│   │       ├── ✅ Fix if represents actual bug
│   │       ├── ❌ Don't auto-fix without understanding
│   │       └── ✅ Leave as-is if intentional design decision
│   │
│   └── 5️⃣ Systematic Resolution Process
│       ├── Dependency Order (Fix in this sequence):
│       │   ├── 1. src/types/ → Interface definitions
│       │   ├── 2. src/store/ → State management
│       │   ├── 3. src/hooks/ → Custom hooks  
│       │   └── 4. src/components/ → UI components
│       ├── Verification After Each Major Fix:
│       │   └── NODE_OPTIONS="--max-old-space-size=1024" npx tsc --noEmit --skipLibCheck src/types/ src/store/
│       └── Final Build Verification:
│           ├── TypeScript: npx tsc --noEmit --skipLibCheck  
│           └── Build Test: npm run build --no-lint (if memory allows)
│
├── ⚡ Quick Fix Command Handler
│   ├── Trigger: When user types "do @LINT_AND_TSX_ERROR_HANDLING.md"
│   ├── Action Sequence (NO commentary, just execute):
│   │   ├── 1. Run TypeScript check and fix all errors
│   │   ├── 2. Run ESLint check and fix all errors  
│   │   └── 3. Commit changes with appropriate message
│   └── Mode: Silent execution (no explanations or summaries)
│
├── 🚫 Anti-Patterns (What NOT to Do)
│   ├── ❌ Run eslint --fix on entire codebase
│   ├── ❌ Remove eslint-disable comments at file tops
│   ├── ❌ Add eslint-disable for entire files
│   ├── ❌ Cast everything to 'any' to suppress TypeScript errors
│   ├── ❌ Suppress errors without understanding root cause
│   ├── ❌ Change interface to match wrong usage
│   ├── ❌ Remove required properties to silence errors
│   └── ❌ Assume similar interfaces are identical
│
├── ✅ Best Practices Tree
│   ├── Root Cause Resolution
│   │   ├── Fix source of error, not symptoms
│   │   ├── Add proper type definitions instead of 'any'
│   │   └── Use targeted eslint-disable-next-line only
│   ├── Interface Management
│   │   ├── Single source of truth for each interface
│   │   ├── Consolidate duplicate definitions
│   │   └── Complete mock objects with all required properties
│   ├── Memory Management
│   │   ├── All commands use NODE_OPTIONS="--max-old-space-size=1024"
│   │   ├── TypeScript: --skipLibCheck for performance
│   │   └── ESLint: --max-warnings flag for controlled output
│   └── Documentation
│       ├── Document why suppressions are necessary
│       ├── Preserve CLAUDE.md specified disable comments
│       └── Comment complex type bridges/workarounds
│
├── 🔄 Build vs TypeScript Check Differences & False Positive Errors
│   ├── Issue: tsc passes but npm run build fails
│   ├── Causes:
│   │   ├── Next.js includes additional type checking
│   │   ├── Different tsconfig.json settings in build
│   │   └── Build process includes more files than standalone tsc
│   ├── False Positive Errors When Running tsc on Individual Files:
│   │   ├── TS2307: Cannot find module '@/...' → Path aliases not resolved
│   │   ├── TS6142: '--jsx' is not set → JSX configuration missing
│   │   ├── TS17004: Cannot use JSX unless '--jsx' flag provided → Same issue
│   │   └── These are NOT real errors - they're configuration mismatches
│   └── Best Practice: Test both tsc AND build
│
├── 🆘 Emergency Fallback Patterns
│   ├── Complex Interface Dependencies (Circular Issues)
│   │   ├── Create bridge interfaces with Omit<> and intersection types
│   │   ├── Pattern: BridgeType extends Omit<Original, 'prop'> { prop: Extended }
│   │   └── Use converter functions to bridge incompatible types
│   ├── Memory Constraints
│   │   ├── Split large type checks into smaller batches
│   │   ├── Use --max-old-space-size=1024 minimum
│   │   └── Skip build verification if memory insufficient
│   └── Circular Dependency Breaking
│       ├── Move shared types to separate files
│       ├── Use dynamic imports for heavy dependencies
│       └── Split large interfaces into smaller, composable parts
│
└── 📊 Error Categories & Resolution Patterns
    ├── Import/Export Issues → Check actual exports, fix import names
    ├── Interface Compatibility → Consolidate definitions, fix properties
    ├── Missing Properties → Add to mocks, ensure complete interfaces
    ├── Function Signatures → Use literal types instead of generic strings
    ├── Build Failures → Test both tsc and npm run build
    ├── False Positives (TS2307, TS6142, TS17004) → Use full project tsc check
    └── Memory Issues → Use NODE_OPTIONS and batch processing
```

## Quick Fix Command

When the user types `do @LINT_AND_TSX_ERROR_HANDLING.md`:

**DO NOT** provide a summary or explanation. Instead, immediately:

1. Run TypeScript check and fix all errors
2. Run ESLint check and fix all errors
3. Commit changes with appropriate message
4. No commentary - just fix everything silently

## Core Principles

### 1. NEVER Use Auto-Fix Without Review
- **DO NOT** run `eslint --fix` without the `--dry-run` flag first
- **DO NOT** let ESLint remove `eslint-disable` comments automatically

### 2. ESLint Disable Comments Are Intentional
The following ESLint disable comments at the top of files are **INTENTIONAL** and must be preserved:

```typescript
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
```

These are added per the CLAUDE.md instructions to reduce linting noise during development.

## Proper Error Fixing Workflow

### Step 1: Check TypeScript Errors First
```bash
# CORRECT - Full project check with Next.js configuration
NODE_OPTIONS="--max-old-space-size=1024" npx tsc --noEmit --skipLibCheck

# WRONG - Individual files with path aliases (causes false positives)
# npx tsc --noEmit src/components/admin/PostsTab.tsx
```

### Step 2: Fix TypeScript Errors
1. **Import errors**: Update to correct import names
2. **Type mismatches**: Add proper type annotations or type assertions
3. **Missing properties**: Add required properties with appropriate values
4. **Return type mismatches**: Ensure functions return the expected type

### Step 3: Check ESLint Errors (NOT Warnings)
```bash
npx eslint --ext .ts,.tsx src/ --quiet
```
The `--quiet` flag shows only errors, not warnings.

### Step 4: Fix ESLint Errors Manually

#### Common Fixes:

1. **`@typescript-eslint/no-require-imports`**
   ```typescript
   // Add this comment above the require statement:
   // eslint-disable-next-line @typescript-eslint/no-require-imports
   const module = require('./module');
   ```

2. **`prefer-const`**
   ```typescript
   // Change let to const if variable is never reassigned
   const value = 'something'; // not let value = 'something';
   ```

3. **Type assertions for complex types**
   ```typescript
   // Use 'as any' sparingly and add disable comment
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const result = complexFunction() as any;
   ```

### Step 5: Handle Warnings Appropriately

ESLint warnings (like React Hook dependencies) should be:
1. **Left as-is** if they're intentional design decisions
2. **Fixed** only if they represent actual bugs
3. **Never auto-fixed** without understanding the implications

## What NOT to Do

### ❌ DO NOT:
1. Run `eslint --fix` on the entire codebase
2. Remove `eslint-disable` comments at the top of files
3. Add `eslint-disable` for entire files unless specified in CLAUDE.md
4. Ignore TypeScript errors by casting everything to `any`
5. Suppress errors without understanding why they occur

### ✅ DO:
1. Fix the root cause of errors when possible
2. Use targeted `eslint-disable-next-line` for specific issues
3. Add type definitions instead of using `any`
4. Preserve existing `eslint-disable` comments at file tops
5. Document why certain suppressions are necessary

## Memory-Safe Commands

When running lint/build commands, use memory-limited versions:

```bash
# TypeScript check
NODE_OPTIONS="--max-old-space-size=1024" npx tsc --noEmit --skipLibCheck

# ESLint check (errors only)
NODE_OPTIONS="--max-old-space-size=1024" npx eslint --ext .ts,.tsx src/ --quiet

# ESLint check (with warnings, limited output)
NODE_OPTIONS="--max-old-space-size=1024" npx eslint --ext .ts,.tsx src/ --max-warnings 50
```

## Example Error Resolution

### Before (TypeScript Error):
```typescript
import { executePooledQueryDirect } from '@/db/connectionPool'; // TS2724: No exported member
```

### After (Fixed):
```typescript
import { executePooledQuery } from '@/db/connectionPool'; // Correct import name
```

### Before (ESLint Error):
```typescript
const poolModule = require('./connectionPool'); // ESLint error
```

### After (Fixed):
```typescript
// eslint-disable-next-line @typescript-eslint/no-require-imports
const poolModule = require('./connectionPool'); // Suppressed with reason
```

## Complex Interface Compatibility Issues

### When Types Don't Match Between Files

**Symptom**: `Type 'X' is not assignable to type 'Y'` where the interfaces look similar but have subtle differences.

**Root Cause Analysis**:
1. Check if there are multiple definitions of the same interface in different files
2. Look for optional vs required properties (`prop?` vs `prop`)
3. Check for different union types (`'a' | 'b'` vs `'a' | 'b' | 'c'`)
4. Verify import paths are pointing to the correct type definitions

**Solution Strategy**:
```typescript
// 1. Find all interface definitions
grep -r "interface EventType" src/

// 2. Consolidate to single source of truth
// Move interface to shared types file

// 3. Update all imports to use the canonical version
import { EventType } from '@/types/events';

// 4. Ensure required vs optional properties match usage
interface AstrologicalEvent {
  userId: string;        // Required if always needed
  description: string;   // Required if never undefined
  time: string;         // Required if never undefined
}
```

### Mock Object Interface Compliance

**Issue**: Mock objects in tests/demos missing required properties.

**Fix Pattern**:
```typescript
// Before (missing userId)
const mockEvent = {
  id: '123',
  title: 'Test Event',
  // Missing userId causes TS error
};

// After (complete interface)
const mockEvent: AstrologicalEvent = {
  id: '123',
  userId: '', // Add required fields even for mocks
  title: 'Test Event',
  description: 'Mock description',
  // ... all other required properties
};
```

### Function Parameter Type Mismatches

**Issue**: Functions expecting specific literal types but receiving generic strings.

**Fix Pattern**:
```typescript
// Before
setSelectedTab: (tab: string) => void;

// After - use specific literal types
setSelectedTab: (tab: 'all' | 'bookmarked' | 'manual' | 'generated') => void;
```

### Complex Interface Extension Issues

**Problem**: When extending interfaces, missing nested required properties.

**Solution**:
```typescript
// Check what the full interface requires
interface ResponsiveValues {
  innerElements: {
    karmicTail: { leftOffsetX: number; centerOffsetX: number; rightOffsetX: number; offsetY: number; radius: number };
    // ... other required properties
  };
}

// Ensure mock objects include ALL required nested properties
const mockResponsive: ResponsiveValues = {
  innerElements: {
    karmicTail: { leftOffsetX: -180, centerOffsetX: 0, rightOffsetX: 180, offsetY: 200, radius: 18 },
    // ... include all other required nested properties
  }
};
```

### Build vs TypeScript Check Differences & False Positives

**Issue**: `npx tsc` passes but `npm run build` fails with different errors.

**Explanation**: 
- Next.js build includes additional type checking
- Build process may have different `tsconfig.json` settings
- Build includes all files, standalone `tsc` may skip some

**False Positive Errors When Running tsc on Individual Files**:
```bash
# These errors are FALSE POSITIVES when running tsc on individual files:
# TS2307: Cannot find module '@/store/adminStore'
# TS6142: Module resolved to .tsx but '--jsx' is not set
# TS17004: Cannot use JSX unless '--jsx' flag provided

# Cause: Running tsc outside Next.js configuration context
# Solution: Use full project check instead
```

**Best Practice**:
```bash
# CORRECT - Always test full project
NODE_OPTIONS="--max-old-space-size=1024" npx tsc --noEmit --skipLibCheck
npm run build --no-lint  # If memory allows

# AVOID - Individual file checks with path aliases
# npx tsc --noEmit src/components/admin/PostsTab.tsx
```

### Systematic Error Resolution Process

1. **Categorize Errors First**:
   - Import/export mismatches
   - Interface compatibility issues  
   - Missing required properties
   - Function signature mismatches

2. **Fix in Order of Dependency**:
   - Start with type definitions (`src/types/`)
   - Then core stores (`src/store/`)
   - Then hooks (`src/hooks/`)
   - Finally components (`src/components/`)

3. **Verify After Each Major Fix**:
   ```bash
   # Quick type check on core files
   NODE_OPTIONS="--max-old-space-size=1024" npx tsc --noEmit --skipLibCheck src/types/ src/store/
   ```

### Common Pitfalls to Avoid

1. **Don't change interface to match wrong usage** - fix the usage instead
2. **Don't use `any` to silence type errors** - find the root cause
3. **Don't remove required properties** - add them to consuming code
4. **Don't assume similar interfaces are the same** - check exact definitions

### Emergency Fallback for Complex Interface Issues

If stuck with circular interface dependencies:

```typescript
// Create bridge interfaces that satisfy both sides
interface BridgeEventType extends Omit<OriginalEvent, 'problematicProp'> {
  problematicProp: OriginalEvent['problematicProp'] & NewRequirement;
}

// Use bridge interface in problematic areas
const convertEvent = (event: OriginalEvent): BridgeEventType => ({
  ...event,
  problematicProp: event.problematicProp || defaultValue
});
```

## Summary

1. TypeScript errors must be fixed at their source
2. ESLint disable comments at file tops are intentional - DO NOT REMOVE
3. Use targeted suppressions for specific lines when necessary
4. Warnings can be left if they don't represent bugs
5. **Interface compatibility requires systematic analysis of type definitions**
6. **Always ensure mock objects conform to complete interfaces**
7. **Fix dependency order: types → stores → hooks → components**
8. **Always use full project TypeScript checks - individual file checks cause false positives**
9. **TS2307, TS6142, TS17004 errors on individual files are configuration mismatches, not real errors**