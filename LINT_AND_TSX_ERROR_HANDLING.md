# Lint and TypeScript Error Handling Guide

This guide establishes rules for fixing linting and TypeScript errors in the codebase.

## Quick Fix Command

When the user types `do @LINT_AND_TSX_ERROR_HANDLING.md`:

**DO NOT** provide a summary or explanation. Instead, immediately:

1. Run TypeScript check and fix all errors
2. Run ESLint check and fix all errors
3. No commentary - just fix everything silently

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
npx tsc --noEmit --skipLibCheck
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

## Summary

1. TypeScript errors must be fixed at their source
2. ESLint disable comments at file tops are intentional - DO NOT REMOVE
3. Use targeted suppressions for specific lines when necessary
4. Warnings can be left if they don't represent bugs