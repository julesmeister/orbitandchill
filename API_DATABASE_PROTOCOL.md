# API Database Protocol & Integration Patterns

This document captures the established patterns and protocols for API and database integration in the Orbit and Chill application, based on successful implementations like the location persistence system and other core features.

## 📋 Table of Contents

1. [Core Architecture Principles](#core-architecture-principles)
2. [Database Integration Patterns](#database-integration-patterns)
3. [API Endpoint Structure](#api-endpoint-structure)
4. [Frontend Hook Integration](#frontend-hook-integration)
5. [Error Handling & Resilience](#error-handling--resilience)
6. [State Management Patterns](#state-management-patterns)
7. [Implementation Examples](#implementation-examples)
8. [Testing & Validation](#testing--validation)

---

## Core Architecture Principles

### 1. **Resilience First**
- All database operations must handle connectivity failures gracefully
- APIs should provide immediate feedback even if database persistence fails
- Local state updates happen immediately, database sync happens asynchronously
- Fallback strategies for when services are unavailable

### 2. **User Experience Priority**
- Never block user interactions waiting for database operations
- Provide immediate visual feedback for all actions
- Use optimistic updates with rollback on failure
- Clear error messaging that guides user recovery

### 3. **Data Consistency**
- Implement proper data type conversions (camelCase ↔ snake_case)
- Use TypeScript interfaces for type safety across all layers
- Validate data at API boundaries
- Maintain audit trails for critical operations

---

## Database Integration Patterns

### Schema Design Principles

#### **User Data Fields Naming Convention**
```typescript
// Frontend (camelCase)
interface UserData {
  currentLocationName: string;
  currentLatitude: string;
  currentLongitude: string;
  currentLocationUpdatedAt: Date;
}

// Database (snake_case)
// Fields: current_location_name, current_latitude, current_longitude, current_location_updated_at
```

#### **Required Fields for User Data**
- Primary key: `id` (text) - Google ID or generated anonymous ID
- Timestamps: `created_at`, `updated_at` (ISO strings in database, Date objects in frontend)
- Status fields: `is_active`, `deletion_status` for soft deletes
- Foreign key constraints with proper cascading

### Database Service Layer Pattern

```typescript
// Service method structure
export const saveUserLocation = async (userId: string, locationData: LocationData) => {
  try {
    // 1. Validate input data
    if (!userId || !locationData?.coordinates) {
      throw new Error('Invalid input data');
    }
    
    // 2. Convert data format (camelCase → snake_case)
    const dbData = {
      current_location_name: locationData.name,
      current_latitude: locationData.coordinates.lat,
      current_longitude: locationData.coordinates.lon,
      current_location_updated_at: new Date().toISOString()
    };
    
    // 3. Execute database operation with error handling
    const result = await db.update(users)
      .set(dbData)
      .where(eq(users.id, userId))
      .returning();
    
    // 4. Return standardized response
    return { success: true, data: result[0] };
    
  } catch (error) {
    console.error('Database operation failed:', error);
    
    // 5. Return error response (don't throw)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback: true // Indicates client should handle gracefully
    };
  }
};
```

### Connection Management

```typescript
// Database connection with resilience
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export const db = drizzle(client);

// Connection health check pattern
export const checkDatabaseHealth = async () => {
  try {
    await db.select().from(users).limit(1);
    return { healthy: true };
  } catch (error) {
    return { healthy: false, error: error.message };
  }
};
```

---

## API Endpoint Structure

### Endpoint Naming Convention

```
/api/{resource}           - Resource collection (GET, POST)
/api/{resource}/{id}      - Specific resource (GET, PATCH, DELETE)
/api/{resource}/{action}  - Resource actions (POST)

Examples:
/api/users/location       - User location operations
/api/events/bulk          - Bulk event operations  
/api/charts/generate      - Chart generation
/api/admin/metrics        - Admin-specific endpoints
```

### Request/Response Format

#### **Standard Request Structure**
```typescript
// POST /api/users/location
{
  userId: string;
  location: {
    name: string;
    coordinates: { lat: string; lon: string; }
  }
}
```

#### **Standard Response Structure**
```typescript
// Success Response
{
  success: true;
  data?: any;
  message?: string;
  meta?: {
    timestamp: string;
    requestId?: string;
  }
}

// Error Response  
{
  success: false;
  error: string;
  code?: string;
  details?: any;
  fallback?: boolean; // Indicates graceful degradation available
}
```

### Route Implementation Pattern

```typescript
// /api/users/location/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { saveUserLocation, getUserLocation } from '@/db/services/userService';

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate request
    const body = await request.json();
    const { userId, location } = body;
    
    if (!userId || !location) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // 2. Call service layer
    const result = await saveUserLocation(userId, location);
    
    // 3. Handle service response
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
    
    // 4. Return success response
    return NextResponse.json({
      success: true,
      message: 'Location saved successfully',
      meta: { timestamp: new Date().toISOString() }
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }
    
    const result = await getUserLocation(userId);
    
    return NextResponse.json({
      success: true,
      location: result.success ? result.data : null
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## Frontend Hook Integration

### Hook Structure Pattern

```typescript
// useSharedLocation.ts - Example implementation
export const useSharedLocation = () => {
  const { user } = useUserStore();
  const [localState, setLocalState] = useState(initialState);
  
  // 1. Load saved data on mount/user change
  useEffect(() => {
    const loadSavedData = async () => {
      if (user?.id) {
        try {
          const response = await fetch(`/api/users/location?userId=${user.id}`);
          const result = await response.json();
          
          if (result.success && result.location) {
            setLocalState(prev => ({
              ...prev,
              currentLocation: result.location
            }));
            console.log('✅ Loaded saved data from database');
          }
        } catch (error) {
          console.warn('Failed to load saved data:', error);
          // Don't break the UI - continue with local state
        }
      }
    };
    
    loadSavedData();
  }, [user?.id]);
  
  // 2. Update with immediate local state + async persistence
  const updateData = async (newData: DataType) => {
    // Immediate local update for responsive UI
    setLocalState(prev => ({ ...prev, ...newData }));
    
    // Async database persistence
    if (user?.id) {
      try {
        const response = await fetch('/api/users/location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            location: newData
          })
        });
        
        if (!response.ok) {
          console.warn('Failed to save to database:', response.statusText);
          // Could implement retry logic or show user notification
        } else {
          console.log('✅ Data saved to database successfully');
        }
      } catch (error) {
        console.warn('Failed to save to database:', error);
        // UI continues to work with local state
      }
    }
  };
  
  return {
    // State
    ...localState,
    
    // Actions  
    updateData,
    
    // Computed values
    isDataAvailable: Boolean(localState.currentData),
  };
};
```

### State Update Patterns

#### **Optimistic Updates**
```typescript
// Update local state immediately, sync to database async
const handleUpdate = async (newData) => {
  // 1. Immediate UI update
  setLocalState(prev => ({ ...prev, ...newData }));
  
  // 2. Async persistence (non-blocking)
  persistToDatabase(newData).catch(error => {
    console.warn('Persistence failed:', error);
    // Could show toast notification or retry
  });
};
```

#### **Pessimistic Updates (for critical operations)**
```typescript
// Wait for database confirmation before updating UI
const handleCriticalUpdate = async (newData) => {
  setLoading(true);
  
  try {
    const result = await persistToDatabase(newData);
    if (result.success) {
      setLocalState(prev => ({ ...prev, ...newData }));
      showSuccess('Update saved successfully');
    } else {
      showError('Failed to save changes');
    }
  } catch (error) {
    showError('Network error occurred');
  } finally {
    setLoading(false);
  }
};
```

---

## Error Handling & Resilience

### Database Connectivity Resilience

```typescript
// Service layer with graceful degradation
export const createEventWithFallback = async (eventData: EventData) => {
  try {
    // Attempt database save
    const result = await db.insert(events).values(eventData).returning();
    return { 
      success: true, 
      data: result[0], 
      stored: 'database' 
    };
    
  } catch (error) {
    console.warn('Database unavailable, using local-only mode:', error);
    
    // Fallback to local-only with clear indication
    return {
      success: true,
      data: { ...eventData, id: generateLocalId(), localOnly: true },
      stored: 'local',
      message: 'Saved locally - will sync when database is available'
    };
  }
};
```

### API Error Categories

```typescript
// Error classification for appropriate handling
export enum ErrorType {
  VALIDATION = 'validation',      // 400 - User input issues
  AUTHENTICATION = 'auth',        // 401 - Auth required
  AUTHORIZATION = 'authz',        // 403 - Insufficient permissions
  NOT_FOUND = 'not_found',       // 404 - Resource doesn't exist
  RATE_LIMIT = 'rate_limit',     // 429 - Too many requests
  DATABASE = 'database',         // 500 - Database issues
  NETWORK = 'network',           // Network connectivity
  UNKNOWN = 'unknown'            // Unexpected errors
}

// Error handling utility
export const handleApiError = (error: any): FormattedError => {
  if (error.code === 'SQLITE_BUSY') {
    return {
      type: ErrorType.DATABASE,
      message: 'Database is temporarily busy. Please try again.',
      canRetry: true
    };
  }
  
  if (error.message?.includes('fetch failed')) {
    return {
      type: ErrorType.NETWORK,
      message: 'Network connection failed. Check your internet connection.',
      canRetry: true
    };
  }
  
  return {
    type: ErrorType.UNKNOWN,
    message: 'An unexpected error occurred.',
    canRetry: false
  };
};
```

### Retry Logic Pattern

```typescript
// Exponential backoff retry for database operations
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('All retry attempts failed');
};
```

---

## State Management Patterns

### Zustand Store Integration

```typescript
// Store with database persistence
interface StoreState {
  data: DataType[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadData: () => Promise<void>;
  addData: (item: DataType) => Promise<void>;
  updateData: (id: string, updates: Partial<DataType>) => Promise<void>;
  deleteData: (id: string) => Promise<void>;
}

export const useDataStore = create<StoreState>()((set, get) => ({
  data: [],
  isLoading: false,
  error: null,
  
  loadData: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      
      if (result.success) {
        set({ data: result.data, isLoading: false });
      } else {
        set({ error: result.error, isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to load data', isLoading: false });
    }
  },
  
  addData: async (item) => {
    // Optimistic update
    set(state => ({ data: [...state.data, item] }));
    
    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      
      const result = await response.json();
      
      if (!result.success) {
        // Rollback on failure
        set(state => ({ 
          data: state.data.filter(d => d.id !== item.id),
          error: result.error 
        }));
      }
    } catch (error) {
      // Rollback on network error
      set(state => ({ 
        data: state.data.filter(d => d.id !== item.id),
        error: 'Network error occurred' 
      }));
    }
  }
}));
```

### Component Integration Pattern

```typescript
// Component using the store
export const DataComponent = () => {
  const { data, isLoading, error, loadData, addData } = useDataStore();
  const { showSuccess, showError } = useStatusToast();
  
  useEffect(() => {
    loadData().catch(() => {
      showError('Failed to load data');
    });
  }, []);
  
  const handleAdd = async (newItem: DataType) => {
    try {
      await addData(newItem);
      showSuccess('Item added successfully');
    } catch (error) {
      showError('Failed to add item');
    }
  };
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={loadData} />;
  
  return (
    <div>
      {data.map(item => (
        <DataItem key={item.id} data={item} />
      ))}
    </div>
  );
};
```

---

## Implementation Examples

### Example 1: Location Persistence (Completed Implementation)

```typescript
// Hook: /src/hooks/useSharedLocation.ts
export const useSharedLocation = () => {
  // Load saved location from database on mount
  useEffect(() => {
    const loadSavedLocation = async () => {
      if (user?.id) {
        const response = await fetch(`/api/users/location?userId=${user.id}`);
        const result = await response.json();
        
        if (result.success && result.location) {
          setLocationState(prev => ({
            ...prev,
            currentLocation: result.location
          }));
        }
      }
    };
    loadSavedLocation();
  }, [user?.id]);
  
  // Save location with immediate UI update + async persistence
  const setLocation = async (locationData: LocationData) => {
    // Immediate local update
    setLocationState(prev => ({
      ...prev,
      currentLocation: locationData,
      showLocationToast: false
    }));

    // Async database save
    if (user?.id) {
      try {
        await fetch('/api/users/location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            location: {
              name: locationData.name,
              coordinates: locationData.coordinates
            }
          })
        });
        console.log('✅ Location saved to database successfully');
      } catch (error) {
        console.warn('Failed to save location to database:', error);
      }
    }
  };
};
```

### Example 2: Chart Generation with Fallback

```typescript
// API: /api/charts/generate/route.ts
export async function POST(request: NextRequest) {
  try {
    const chartData = await request.json();
    
    // Generate chart (always succeeds)
    const chart = await generateChart(chartData);
    
    // Attempt database save
    try {
      const saved = await saveChartToDatabase(chart);
      return NextResponse.json({
        success: true,
        chart,
        stored: 'database',
        id: saved.id
      });
    } catch (dbError) {
      // Return chart even if database save fails
      console.warn('Database save failed, returning temporary chart:', dbError);
      return NextResponse.json({
        success: true,
        chart,
        stored: 'temporary',
        message: 'Chart generated but not saved - database temporarily unavailable'
      });
    }
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Chart generation failed' },
      { status: 500 }
    );
  }
}
```

---

## Testing & Validation

### Database Testing Pattern

```typescript
// Test database operations
describe('Location Persistence', () => {
  beforeEach(async () => {
    await seedTestDatabase();
  });
  
  it('should save location to database', async () => {
    const locationData = {
      name: 'Test City',
      coordinates: { lat: '40.7128', lon: '-74.0060' }
    };
    
    const result = await saveUserLocation('test-user-id', locationData);
    
    expect(result.success).toBe(true);
    
    // Verify database state
    const saved = await getUserLocation('test-user-id');
    expect(saved.data.current_location_name).toBe('Test City');
  });
  
  it('should handle database connectivity failures', async () => {
    // Simulate database failure
    jest.spyOn(db, 'update').mockRejectedValue(new Error('Connection failed'));
    
    const result = await saveUserLocation('test-user-id', locationData);
    
    expect(result.success).toBe(false);
    expect(result.fallback).toBe(true);
  });
});
```

### API Testing Pattern

```typescript
// Test API endpoints
describe('/api/users/location', () => {
  it('should save user location', async () => {
    const response = await fetch('/api/users/location', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'test-user',
        location: { name: 'Test', coordinates: { lat: '0', lon: '0' } }
      })
    });
    
    const result = await response.json();
    expect(result.success).toBe(true);
  });
  
  it('should handle missing userId', async () => {
    const response = await fetch('/api/users/location', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location: {} })
    });
    
    expect(response.status).toBe(400);
    const result = await response.json();
    expect(result.success).toBe(false);
  });
});
```

---

## Performance Optimization

### Database Query Optimization

```typescript
// Use indexes for frequently queried fields
// Example: /migrations/20250626T05163_add_performance_indexes.sql

-- User location queries
CREATE INDEX IF NOT EXISTS idx_users_location_updated ON users(current_location_updated_at);
CREATE INDEX IF NOT EXISTS idx_users_active_locations ON users(id, current_location_name) 
  WHERE current_location_name IS NOT NULL;

-- Event queries with multiple filters
CREATE INDEX IF NOT EXISTS idx_events_user_date ON astrological_events(user_id, date);
CREATE INDEX IF NOT EXISTS idx_events_bookmarked ON astrological_events(user_id, is_bookmarked) 
  WHERE is_bookmarked = true;
```

### Caching Strategy

```typescript
// In-memory caching for frequently accessed data
import { cache } from '@/utils/cache';

export const getCachedUserLocation = async (userId: string) => {
  const cacheKey = `user_location_${userId}`;
  
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached) return cached;
  
  // Fetch from database
  const location = await getUserLocationFromDB(userId);
  
  // Cache for 1 hour
  cache.set(cacheKey, location, 60 * 60 * 1000);
  
  return location;
};
```

---

## Security Considerations

### Input Validation

```typescript
// Validate all API inputs
import { z } from 'zod';

const LocationSchema = z.object({
  userId: z.string().min(1),
  location: z.object({
    name: z.string().min(1).max(255),
    coordinates: z.object({
      lat: z.string().regex(/^-?\d+\.?\d*$/),
      lon: z.string().regex(/^-?\d+\.?\d*$/)
    })
  })
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = LocationSchema.parse(body);
    
    // Proceed with validated data
    const result = await saveUserLocation(validated.userId, validated.location);
    
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}
```

### Rate Limiting (Future Implementation)

```typescript
// Rate limiting for API endpoints
import { rateLimit } from '@/utils/rateLimiter';

export async function POST(request: NextRequest) {
  const clientId = request.headers.get('x-forwarded-for') || 'unknown';
  
  if (!await rateLimit.check(clientId, 10, 60)) { // 10 requests per minute
    return NextResponse.json(
      { success: false, error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }
  
  // Continue with request processing...
}
```

---

## Monitoring & Logging

### Error Tracking Pattern

```typescript
// Centralized error tracking
export const trackError = (error: Error, context: any) => {
  console.error('Error tracked:', error.message, context);
  
  // Could integrate with external services like Sentry
  // sentry.captureException(error, { extra: context });
  
  // Log to database for admin monitoring
  logToDatabase({
    level: 'error',
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  });
};
```

### Performance Monitoring

```typescript
// Monitor API response times
export const withTiming = (handler: Function) => {
  return async (...args: any[]) => {
    const start = Date.now();
    
    try {
      const result = await handler(...args);
      const duration = Date.now() - start;
      
      if (duration > 1000) {
        console.warn(`Slow operation detected: ${handler.name} took ${duration}ms`);
      }
      
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      console.error(`Operation failed after ${duration}ms:`, error);
      throw error;
    }
  };
};
```

---

## Turso HTTP Client Database Issues & Solutions

### Issue: Drizzle ORM $defaultFn() Not Working with Turso HTTP Client

**Problem**: When using Turso's HTTP client with Drizzle ORM, the `$defaultFn(() => new Date())` functions for `createdAt` and `updatedAt` timestamps don't execute, causing NOT NULL constraint failures.

**Root Cause**: The Turso HTTP client doesn't execute client-side default functions from Drizzle ORM schemas.

**Solution**: Explicitly provide timestamp values in database insert operations.

#### ❌ Broken Pattern
```typescript
// This fails with Turso HTTP client
const [result] = await dbInstance.insert(horaryQuestions).values({
  id: questionId,
  question: questionText,
  // createdAt and updatedAt not provided - relies on $defaultFn()
}).returning();
```

#### ✅ Working Pattern
```typescript
// This works with Turso HTTP client
const now = new Date();
const [result] = await dbInstance.insert(horaryQuestions).values({
  id: questionId,
  question: questionText,
  // Explicitly provide timestamps since Turso HTTP client doesn't execute $defaultFn
  createdAt: now,
  updatedAt: now,
}).returning();
```

### Issue: Foreign Key Constraint Errors in Testing

**Problem**: Test data creation fails with foreign key constraint errors when referencing non-existent users.

**Solution**: Either create valid test users first or use `null` for anonymous operations.

#### ❌ Broken Pattern
```typescript
// Fails if 'debug_test_user' doesn't exist in users table
const testData = {
  userId: 'debug_test_user', // Foreign key constraint violation
  question: 'Test question'
};
```

#### ✅ Working Pattern
```typescript
// Option 1: Create test user first
const testUserId = `debug_user_${Date.now()}`;
const now = new Date();

await dbInstance.insert(users).values({
  id: testUserId,
  username: 'Debug Test User',
  authProvider: 'anonymous',
  createdAt: now,
  updatedAt: now,
});

// Then use the test user
const testData = {
  userId: testUserId,
  question: 'Test question',
  createdAt: now,
  updatedAt: now,
};

// Option 2: Use null for anonymous operations
const testData = {
  userId: null, // No foreign key constraint
  question: 'Test question',
  createdAt: now,
  updatedAt: now,
};
```

### Issue: Browser vs Server-Side Database Initialization

**Problem**: Database initialization code runs in browser context, causing errors when trying to use Node.js modules like `fs`.

**Solution**: Add environment detection to prevent database initialization in browser contexts.

#### ❌ Broken Pattern
```typescript
// This tries to run in browser and fails
import fs from 'fs';
startupInitialization(); // Runs everywhere
```

#### ✅ Working Pattern
```typescript
// Only initialize database on server-side (Node.js environment)
if (typeof window === 'undefined') {
  startupInitialization();
}

// And in initialization code
if (typeof window === 'undefined' && typeof process !== 'undefined' && process.cwd) {
  try {
    const fs = await import('fs');
    // Safe to use Node.js modules here
  } catch (loadError) {
    console.warn('⚠️ Could not load Node.js modules:', loadError);
  }
} else {
  console.log('🌐 Running in browser environment, skipping server-only operations');
}
```

### Debug Testing Pattern for Database Operations

```typescript
// Complete debug test implementation
export async function POST(request: NextRequest) {
  try {
    const dbInstance = db || await getDbAsync();
    
    if (!dbInstance) {
      return NextResponse.json({
        success: false,
        error: 'Database instance not available'
      }, { status: 500 });
    }

    // Test simple query first
    const testQuery = await dbInstance.client.execute('SELECT 1 as test');
    
    // Create test user to avoid foreign key constraints
    const testUserId = `debug_user_${Date.now()}`;
    const now = new Date();
    
    const testUser = await dbInstance.insert(users).values({
      id: testUserId,
      username: 'Debug Test User',
      authProvider: 'anonymous',
      createdAt: now,
      updatedAt: now,
    }).returning();

    // Create test data with explicit timestamps
    const questionId = `horary_debug_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const testData = {
      id: questionId,
      userId: testUserId,
      question: 'Debug test question - database integration test',
      date: now,
      location: 'Test Location',
      latitude: 40.7128,
      longitude: -74.0060,
      timezone: 'America/New_York',
      category: 'test',
      tags: JSON.stringify(['debug', 'test']),
      // Required fields with null values
      answer: null,
      timing: null,
      interpretation: null,
      chartData: null,
      chartSvg: null,
      isRadical: null,
      moonVoidOfCourse: null,
      // Explicitly provide timestamps for Turso HTTP client
      createdAt: now,
      updatedAt: now,
    };

    // Insert test data
    const [result] = await dbInstance.insert(horaryQuestions).values(testData).returning();
    
    // Verify data was saved
    const [savedQuestion] = await dbInstance
      .select()
      .from(horaryQuestions)
      .where(eq(horaryQuestions.id, questionId))
      .limit(1);

    // Cleanup test data
    await dbInstance.delete(horaryQuestions).where(eq(horaryQuestions.id, questionId));
    await dbInstance.delete(users).where(eq(users.id, testUserId));

    return NextResponse.json({
      success: true,
      message: 'Database operation test successful',
      debug: {
        questionId,
        testUserId,
        wasCreated: !!result,
        wasSaved: !!savedQuestion,
        testDataFields: Object.keys(testData),
        resultFields: result ? Object.keys(result) : []
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Database operation test failed',
      debug: {
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined
      }
    }, { status: 500 });
  }
}
```

### Key Takeaways

1. **Always provide timestamps explicitly** when using Turso HTTP client with Drizzle ORM
2. **Handle foreign key constraints** by creating test users or using null for anonymous operations
3. **Add environment detection** to prevent server-side code from running in browser contexts
4. **Implement comprehensive test patterns** with proper cleanup and detailed error reporting
5. **Use proper error handling** that provides actionable debugging information

These solutions resolve common issues when integrating Drizzle ORM with Turso's HTTP client in Next.js applications.

---

## Conclusion

This protocol document captures the proven patterns for building resilient, user-friendly APIs and database integrations. Key principles:

1. **User experience first** - Never block the UI for database operations
2. **Graceful degradation** - Always provide fallback functionality
3. **Consistent patterns** - Use the same structure across all implementations
4. **Comprehensive error handling** - Plan for all failure modes
5. **Type safety** - Use TypeScript throughout the stack
6. **Performance consciousness** - Optimize queries and use caching appropriately
7. **Turso HTTP client compatibility** - Handle timestamp defaults and environment detection properly

These patterns have been successfully implemented in features like location persistence, chart generation, discussion forums, user management systems, and horary question creation.

---

*Last Updated: June 28, 2025*  
*Based on successful implementations in the Luckstrology application, including Turso HTTP client integration solutions*