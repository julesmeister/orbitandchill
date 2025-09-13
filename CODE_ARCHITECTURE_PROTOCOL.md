# CODE ARCHITECTURE PROTOCOL

This document establishes systematic guidelines for refactoring, code splitting, and ensuring reusability across the Orbit and Chill codebase. It provides patterns for minimizing code duplication while maintaining synchronization and optimal file organization.

## Refactoring Decision Tree

```
Code Refactoring Assessment
├── Duplication Detection
│   ├── Identical Logic (>5 lines)
│   │   ├── Extract to Utility Function
│   │   ├── Create Shared Service
│   │   └── Implement Reusable Hook
│   ├── Similar Patterns (>3 files)
│   │   ├── Create Abstract Base Component
│   │   ├── Extract Common Hook Logic
│   │   └── Build Configurable Service
│   └── Repeated API Calls
│       ├── Consolidate in Single Service
│       ├── Implement Centralized Store
│       └── Create Unified Hook Interface
├── Complexity Assessment
│   ├── File Size (>300 lines)
│   │   ├── Split by Logical Concerns
│   │   ├── Extract Custom Hooks
│   │   └── Create Component Modules
│   ├── Multiple Responsibilities
│   │   ├── Single Responsibility Principle
│   │   ├── Separate Data/UI Logic
│   │   └── Create Specialized Services
│   └── Deep Nesting (>3 levels)
│       ├── Flatten Component Hierarchy
│       ├── Extract Sub-components
│       └── Create Layout Components
└── Synchronization Requirements
    ├── Multiple State Sources
    │   ├── Unified Store Architecture
    │   ├── Single Source of Truth
    │   └── Centralized State Management
    ├── Cross-Component Communication
    │   ├── Event-Driven Architecture
    │   ├── Context Providers
    │   └── Custom Hook Bridges
    └── Data Flow Complexity
        ├── Unidirectional Data Flow
        ├── Clear Update Patterns
        └── Predictable State Mutations
```

## File Organization Hierarchy

### Service Layer Architecture
```
/src/services/
├── apiServices/
│   ├── chartApiService.ts          # Chart-specific API operations
│   ├── peopleApiService.ts         # People management API calls
│   ├── discussionApiService.ts     # Forum/discussion API methods
│   └── authApiService.ts           # Authentication API integration
├── dataServices/
│   ├── chartDataService.ts         # Chart data transformation/validation
│   ├── peopleDataService.ts        # People data normalization
│   └── cacheDataService.ts         # Data persistence (if needed)
├── businessServices/
│   ├── chartGenerationService.ts   # Complex chart generation logic
│   ├── astroCalculationService.ts  # Astrological calculations
│   └── notificationService.ts      # User notification management
└── integrationServices/
    ├── storeSyncService.ts          # Store synchronization utilities
    ├── routingService.ts            # Navigation and routing logic
    └── validationService.ts         # Cross-component validation
```

### Utility Organization
```
/src/utils/
├── dataTransformers/
│   ├── personDataTransformers.ts   # Person data shape converters
│   ├── chartDataTransformers.ts    # Chart data format converters
│   └── apiResponseTransformers.ts  # API response normalizers
├── validators/
│   ├── formValidators.ts           # Form validation logic
│   ├── dataValidators.ts           # Data integrity checks
│   └── typeGuards.ts               # TypeScript type guards
├── formatters/
│   ├── dateTimeFormatters.ts       # Date/time display formatting
│   ├── locationFormatters.ts       # Location data formatting
│   └── textFormatters.ts           # Text processing utilities
└── helpers/
    ├── arrayHelpers.ts              # Array manipulation utilities
    ├── objectHelpers.ts             # Object processing helpers
    └── stringHelpers.ts             # String manipulation functions
```

### Hook Architecture
```
/src/hooks/
├── dataHooks/
│   ├── usePeopleData.ts            # Unified people data management
│   ├── useChartData.ts             # Centralized chart data logic
│   └── useDiscussionData.ts        # Forum data management
├── uiHooks/
│   ├── useFormState.ts             # Generic form state management
│   ├── useModalState.ts            # Modal visibility/state control
│   └── useLoadingState.ts          # Loading indicator management
├── integrationHooks/
│   ├── useStoreSync.ts             # Multi-store synchronization
│   ├── useApiIntegration.ts        # API integration patterns
│   └── useCacheManagement.ts       # Cache strategy (if required)
└── businessHooks/
    ├── useChartGeneration.ts        # Chart creation workflow
    ├── usePersonManagement.ts       # Person CRUD operations
    └── useAstroCalculations.ts      # Astrological computation logic
```

## Code Reusability Standards

### Service Creation Guidelines

#### When to Create a Service
1. **Logic appears in 3+ files** → Extract to shared service
2. **Complex business logic** → Create dedicated service
3. **External API integration** → Centralize in API service
4. **Data transformation logic** → Build transformation service

#### Service Implementation Pattern
```typescript
// Template: /src/services/[domain]Service.ts
class DomainService {
  // Private utilities
  private static validateData(data: DomainData): boolean { }
  private static transformData(data: RawData): DomainData { }

  // Public interface
  static async fetchDomainData(params: FetchParams): Promise<DomainData[]> { }
  static async createDomainItem(data: CreateData): Promise<DomainData> { }
  static async updateDomainItem(id: string, data: UpdateData): Promise<DomainData> { }
  static async deleteDomainItem(id: string): Promise<void> { }

  // Business logic methods
  static processDomainLogic(input: ProcessInput): ProcessOutput { }
  static validateDomainRules(data: DomainData): ValidationResult { }
}
```

### Hook Creation Guidelines

#### When to Create a Hook
1. **Stateful logic used in 2+ components** → Extract to custom hook
2. **Complex side effects** → Encapsulate in hook
3. **External service integration** → Create integration hook
4. **Cross-component state sync** → Build synchronization hook

#### Hook Implementation Pattern
```typescript
// Template: /src/hooks/use[Domain][Purpose].ts
export function useDomainPurpose(config?: HookConfig) {
  // Internal state
  const [state, setState] = useState<DomainState>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // External dependencies
  const externalDep = useExternalDependency();

  // Core functionality
  const primaryAction = useCallback(async (params: ActionParams) => {
    setLoading(true);
    setError(null);
    try {
      const result = await DomainService.performAction(params);
      setState(prev => ({ ...prev, ...result }));
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Computed values
  const computedValue = useMemo(() =>
    computeFromState(state), [state]
  );

  // Return interface
  return {
    // State
    ...state,
    loading,
    error,

    // Computed
    computedValue,

    // Actions
    primaryAction,

    // Utils
    reset: () => setState(initialState),
    clear: () => setError(null)
  };
}
```

### Utility Creation Guidelines

#### When to Create a Utility
1. **Pure functions used in 3+ files** → Extract to utility
2. **Data transformation logic** → Create transformer utility
3. **Validation/formatting logic** → Build utility function
4. **Complex calculations** → Isolate in utility module

#### Utility Implementation Pattern
```typescript
// Template: /src/utils/[category]/[purpose]Utils.ts

// Type definitions
export interface UtilityInput { }
export interface UtilityOutput { }

// Core utility functions
export function primaryUtility(input: UtilityInput): UtilityOutput {
  // Pure function implementation
  // No side effects
  // Predictable output
}

export function secondaryUtility(input: UtilityInput): UtilityOutput {
  // Related utility functionality
}

// Helper functions (private)
function helperFunction(data: any): any {
  // Internal implementation details
}

// Constants and configurations
export const UTILITY_CONSTANTS = {
  DEFAULT_VALUE: 'default',
  MAX_ITEMS: 100
} as const;
```

## Anti-Duplication Enforcement

### Code Duplication Detection Matrix

```
Duplication Assessment Protocol
├── Identical Code Blocks (>5 lines)
│   ├── Immediate Refactor Required
│   │   ├── Extract to Shared Function
│   │   ├── Create Utility Module
│   │   └── Implement Service Method
│   ├── Documentation Required
│   │   ├── Add TODO comment for refactor
│   │   ├── Link to extraction ticket
│   │   └── Set refactor deadline
│   └── Testing Requirements
│       ├── Ensure extracted code is testable
│       ├── Maintain existing test coverage
│       └── Add tests for new utilities
├── Similar Logic Patterns (>70% similarity)
│   ├── Abstract Common Pattern
│   │   ├── Create Generic Implementation
│   │   ├── Use Configuration Parameters
│   │   └── Maintain Specific Variations
│   ├── Template Method Pattern
│   │   ├── Define Abstract Base
│   │   ├── Implement Common Steps
│   │   └── Allow Custom Overrides
│   └── Strategy Pattern Application
│       ├── Define Strategy Interface
│       ├── Implement Concrete Strategies
│       └── Use Context for Selection
└── API Call Duplication
    ├── Service Layer Consolidation
    │   ├── Single API Service per Domain
    │   ├── Reusable Request Methods
    │   └── Centralized Error Handling
    ├── Hook-Based Integration
    │   ├── Custom Hook per Resource
    │   ├── Shared State Management
    │   └── Unified Loading States
    └── Type Safety Enforcement
        ├── Shared Type Definitions
        ├── Request/Response Interfaces
        └── Validation Schema Reuse
```

### Refactor Triggers

#### Critical Refactor Signals
- **File exceeds 300 lines** → Mandatory split
- **Function exceeds 50 lines** → Extract sub-functions
- **Component has >8 props** → Consider composition
- **Hook returns >6 values** → Split into multiple hooks
- **Service has >10 methods** → Domain separation needed

#### Refactor Implementation Process
1. **Identify extraction boundaries** → Single responsibility analysis
2. **Create new file structure** → Follow naming conventions
3. **Extract and test incrementally** → Ensure no functionality loss
4. **Update imports across codebase** → Maintain referential integrity
5. **Remove old implementations** → Clean up redundant code
6. **Update documentation** → Reflect new architecture

## Synchronization Architecture

### Multi-Store Synchronization Pattern

```typescript
// Template: /src/services/storeSyncService.ts
export class StoreSyncService {
  static async syncStores<T>(
    primaryStore: Store<T>,
    secondaryStore: Store<T>,
    syncKey: string
  ): Promise<void> {
    // Conflict resolution logic
    const primaryData = primaryStore.getData(syncKey);
    const secondaryData = secondaryStore.getData(syncKey);

    // Merge strategy
    const mergedData = this.mergeData(primaryData, secondaryData);

    // Update both stores
    await Promise.all([
      primaryStore.setData(syncKey, mergedData),
      secondaryStore.setData(syncKey, mergedData)
    ]);
  }

  private static mergeData<T>(primary: T, secondary: T): T {
    // Custom merge logic based on data type and business rules
    // Last write wins, or custom conflict resolution
  }
}
```

### Event-Driven Synchronization

```typescript
// Template: /src/hooks/useStoreSync.ts
export function useStoreSync<T>(
  stores: Array<Store<T>>,
  syncKey: string
) {
  useEffect(() => {
    const unsubscribers = stores.map(store =>
      store.subscribe(syncKey, (data) => {
        // Propagate changes to other stores
        stores.forEach(otherStore => {
          if (otherStore !== store) {
            otherStore.setData(syncKey, data, { skipSync: true });
          }
        });
      })
    );

    return () => unsubscribers.forEach(unsub => unsub());
  }, [stores, syncKey]);
}
```

## Implementation Enforcement

### Pre-Development Checklist

```
Development Phase Gate Checks
├── Before Writing New Code
│   ├── Search for Similar Implementations
│   │   ├── Full-text search across codebase
│   │   ├── Pattern matching in existing utilities
│   │   └── API endpoint duplication check
│   ├── Evaluate Reusability Potential
│   │   ├── Will this be used in multiple places?
│   │   ├── Can this be made more generic?
│   │   └── Should this be a service/utility/hook?
│   └── Architecture Impact Assessment
│       ├── How does this fit existing patterns?
│       ├── What dependencies will this create?
│       └── What synchronization is required?
├── During Implementation
│   ├── Follow Established Patterns
│   │   ├── Use existing service/hook/utility templates
│   │   ├── Maintain consistent naming conventions
│   │   └── Apply standard error handling patterns
│   ├── Minimize File Coupling
│   │   ├── Use dependency injection where possible
│   │   ├── Prefer composition over inheritance
│   │   └── Create clear interface boundaries
│   └── Document Decisions
│       ├── Add inline comments for complex logic
│       ├── Update architecture documentation
│       └── Note future refactoring opportunities
└── Post-Implementation Review
    ├── Code Duplication Analysis
    │   ├── Run duplication detection tools
    │   ├── Manual review for similar patterns
    │   └── Identify refactoring opportunities
    ├── Performance Impact Assessment
    │   ├── Bundle size impact measurement
    │   ├── Runtime performance validation
    │   └── Memory usage optimization check
    └── Integration Testing
        ├── Cross-component functionality verification
        ├── Store synchronization validation
        └── Error handling boundary testing
```

### Code Review Standards

#### Mandatory Review Points
1. **No code duplication** → All duplicates must be extracted
2. **Single responsibility** → Each file/function has one purpose
3. **Consistent patterns** → Follows established templates
4. **Proper abstraction** → Right level of generalization
5. **Clear interfaces** → Well-defined input/output contracts

#### Review Rejection Criteria
- Duplicated logic without justification
- File exceeds size limits without refactoring plan
- Missing error handling in services
- Inconsistent naming conventions
- Lack of type safety in TypeScript files

## Migration Strategy

### Existing Code Refactoring Plan

```
Codebase Modernization Roadmap
├── Phase 1: Critical Duplication Removal (Week 1-2)
│   ├── Identify Top 10 Duplicated Code Blocks
│   │   ├── Extract to utilities/services immediately
│   │   ├── Update all references
│   │   └── Remove redundant implementations
│   ├── Consolidate API Calls
│   │   ├── Create unified API services
│   │   ├── Migrate all components to use services
│   │   └── Remove inline API calls
│   └── Standardize Hook Patterns
│       ├── Extract common hook logic
│       ├── Create reusable hook templates
│       └── Migrate components to use standard hooks
├── Phase 2: File Size Optimization (Week 3-4)
│   ├── Split Oversized Files
│   │   ├── Components >300 lines → Split into modules
│   │   ├── Hooks >200 lines → Extract sub-hooks
│   │   └── Services >400 lines → Domain separation
│   ├── Component Composition
│   │   ├── Break down monolithic components
│   │   ├── Create reusable sub-components
│   │   └── Implement container/presenter pattern
│   └── Utility Organization
│       ├── Group related utilities
│       ├── Create utility modules by domain
│       └── Implement consistent export patterns
└── Phase 3: Synchronization Architecture (Week 5-6)
    ├── Implement Store Sync Service
    │   ├── Create centralized sync utilities
    │   ├── Migrate existing sync patterns
    │   └── Add conflict resolution logic
    ├── Event-Driven Updates
    │   ├── Implement event system for cross-component communication
    │   ├── Replace direct store coupling with events
    │   └── Add debugging and monitoring for sync issues
    └── Documentation and Testing
        ├── Complete architecture documentation
        ├── Add comprehensive test coverage
        └── Create developer onboarding guide
```

## Monitoring and Maintenance

### Automated Quality Checks

#### ESLint Rules for Architecture Enforcement
```javascript
// .eslintrc.js additions for architecture compliance
module.exports = {
  rules: {
    // File size limits
    'max-lines': ['error', { max: 300, skipBlankLines: true }],
    'max-lines-per-function': ['error', { max: 50 }],

    // Duplication prevention
    'no-duplicate-imports': 'error',
    'import/no-duplicates': 'error',

    // Complexity limits
    'complexity': ['error', { max: 10 }],
    'max-depth': ['error', { max: 3 }],
    'max-params': ['error', { max: 5 }],

    // Architecture compliance
    'import/no-cycle': 'error',
    'import/order': ['error', { /* import order rules */ }]
  }
};
```

#### Pre-commit Hooks
```bash
# .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: duplication-check
        name: Code duplication detection
        entry: npx jscpd --threshold 5 --reporters console
        language: system
      - id: file-size-check
        name: File size validation
        entry: find src -name "*.ts" -o -name "*.tsx" | xargs wc -l | awk '$1 > 300 { print "File too large: " $2 " (" $1 " lines)" }'
        language: system
```

### Regular Maintenance Tasks

#### Weekly Code Health Checks
1. **Duplication Analysis** → Run duplication detection tools
2. **File Size Review** → Identify files exceeding size limits
3. **Dependency Analysis** → Check for circular dependencies
4. **Performance Metrics** → Monitor bundle size and runtime performance
5. **Architecture Compliance** → Verify adherence to patterns

#### Monthly Refactoring Reviews
1. **Extract Common Patterns** → Identify new reusable patterns
2. **Update Documentation** → Keep architecture docs current
3. **Performance Optimization** → Optimize based on metrics
4. **Developer Experience** → Improve development workflow
5. **Knowledge Sharing** → Team review of new patterns

This protocol ensures systematic code quality, prevents duplication, and maintains a clean, efficient, and well-organized codebase that scales effectively with team growth and feature additions.