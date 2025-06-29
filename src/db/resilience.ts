/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Database Resilience Utilities
 * 
 * Provides consistent database availability checking and fallback patterns
 * across all database services in the application.
 */

export interface ResilienceOptions<T> {
  /** Fallback value to return when database is unavailable */
  fallbackValue: T;
  /** Custom warning message (optional) */
  warningMessage?: string;
  /** Service name for logging context */
  serviceName?: string;
  /** Method name for logging context */
  methodName?: string;
}

/**
 * Check if database is available and return appropriate response
 * 
 * @param db Database instance to check
 * @param options Resilience configuration options
 * @returns Object with isAvailable flag and fallback handling
 */
export function checkDatabaseAvailability<T>(
  db: any, 
  options: ResilienceOptions<T>
): { isAvailable: boolean; fallback: () => T } {
  // Check if db exists AND has a properly initialized client
  const isAvailable = !!db && (!!db.client || !!process.env.TURSO_DATABASE_URL);
  
  const fallback = () => {
    const serviceName = options.serviceName || 'Unknown Service';
    const methodName = options.methodName || 'unknown method';
    const defaultMessage = `Database not available in ${serviceName}.${methodName}()`;
    const message = options.warningMessage || defaultMessage;
    
    console.warn(`⚠️ ${message}, returning fallback value`);
    return options.fallbackValue;
  };
  
  return { isAvailable, fallback };
}

/**
 * Execute a database operation with resilience
 * 
 * @param db Database instance
 * @param operation Database operation to execute
 * @param options Resilience configuration
 * @returns Promise resolving to operation result or fallback value
 */
export async function withDatabaseResilience<T>(
  db: any,
  operation: () => Promise<T>,
  options: ResilienceOptions<T>
): Promise<T> {
  const { isAvailable, fallback } = checkDatabaseAvailability(db, options);
  
  if (!isAvailable) {
    return fallback();
  }
  
  try {
    return await operation();
  } catch (error) {
    const serviceName = options.serviceName || 'Unknown Service';
    const methodName = options.methodName || 'unknown method';
    console.error(`❌ Database operation failed in ${serviceName}.${methodName}():`, error);
    throw error;
  }
}

/**
 * Synchronous version of withDatabaseResilience
 */
export function withDatabaseResilienceSync<T>(
  db: any,
  operation: () => T,
  options: ResilienceOptions<T>
): T {
  const { isAvailable, fallback } = checkDatabaseAvailability(db, options);
  
  if (!isAvailable) {
    return fallback();
  }
  
  try {
    return operation();
  } catch (error) {
    const serviceName = options.serviceName || 'Unknown Service';
    const methodName = options.methodName || 'unknown method';
    console.error(`❌ Database operation failed in ${serviceName}.${methodName}():`, error);
    throw error;
  }
}

/**
 * Common fallback values for different data types
 */
export const CommonFallbacks = {
  /** Empty array for list/collection methods */
  emptyArray: <T>(): T[] => [],
  
  /** Null for single item methods */
  null: (): null => null,
  
  /** Zero for count methods */
  zero: (): number => 0,
  
  /** Empty object for object methods */
  emptyObject: <T extends Record<string, any>>(): T => ({} as T),
  
  /** False for boolean methods */
  false: (): boolean => false,
  
  /** True for boolean methods */
  true: (): boolean => true,
  
  /** Empty string for string methods */
  emptyString: (): string => '',
  
  /** Success response for operations that don't return data */
  successResponse: () => ({ success: true, offline: true }),
  
  /** Mock pagination response */
  emptyPagination: <T>() => ({
    data: [] as T[],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  })
};

/**
 * Service-specific resilience helpers
 */
export class ServiceResilience {
  /**
   * Chart service resilience helper
   */
  static chart = {
    async getCharts<T>(db: any, operation: () => Promise<T[]>): Promise<T[]> {
      return withDatabaseResilience(db, operation, {
        fallbackValue: [],
        serviceName: 'ChartService',
        methodName: 'getCharts'
      });
    },
    
    async getChart<T>(db: any, operation: () => Promise<T | null>): Promise<T | null> {
      return withDatabaseResilience(db, operation, {
        fallbackValue: null,
        serviceName: 'ChartService',
        methodName: 'getChart'
      });
    },
    
    async createChart<T>(db: any, operation: () => Promise<T | null>): Promise<T | null> {
      return withDatabaseResilience(db, operation, {
        fallbackValue: null,
        serviceName: 'ChartService',
        methodName: 'createChart',
        warningMessage: 'Database not available, chart cannot be persisted'
      });
    }
  };
  
  /**
   * User service resilience helper
   */
  static user = {
    async getUsers<T>(db: any, operation: () => Promise<T[]>): Promise<T[]> {
      return withDatabaseResilience(db, operation, {
        fallbackValue: [],
        serviceName: 'UserService',
        methodName: 'getUsers'
      });
    },
    
    async getUser<T>(db: any, operation: () => Promise<T | null>): Promise<T | null> {
      return withDatabaseResilience(db, operation, {
        fallbackValue: null,
        serviceName: 'UserService',
        methodName: 'getUser'
      });
    }
  };
  
  /**
   * Category service resilience helper
   */
  static category = {
    async getCategories<T>(db: any, operation: () => Promise<T[]>): Promise<T[]> {
      return withDatabaseResilience(db, operation, {
        fallbackValue: [],
        serviceName: 'CategoryService',
        methodName: 'getCategories'
      });
    }
  };
  
  /**
   * Tag service resilience helper
   */
  static tag = {
    async getTags<T>(db: any, operation: () => Promise<T[]>): Promise<T[]> {
      return withDatabaseResilience(db, operation, {
        fallbackValue: [],
        serviceName: 'TagService',
        methodName: 'getTags'
      });
    }
  };
  
  /**
   * Event service resilience helper
   */
  static event = {
    async getEvents<T>(db: any, operation: () => Promise<T[]>): Promise<T[]> {
      return withDatabaseResilience(db, operation, {
        fallbackValue: [],
        serviceName: 'EventService',
        methodName: 'getEvents'
      });
    }
  };
  
  /**
   * Premium feature service resilience helper
   */
  static premium = {
    async getFeatures<T>(db: any, operation: () => Promise<T[]>): Promise<T[]> {
      return withDatabaseResilience(db, operation, {
        fallbackValue: [],
        serviceName: 'PremiumFeatureService',
        methodName: 'getFeatures'
      });
    }
  };
}

/**
 * Create a resilient service method wrapper
 * 
 * @param serviceName Name of the service for logging
 * @returns Function that wraps service methods with resilience
 */
export function createResilientService(serviceName: string) {
  return {
    /**
     * Wrap a method that returns an array
     */
    async array<T>(
      db: any, 
      methodName: string, 
      operation: () => Promise<T[]>
    ): Promise<T[]> {
      return withDatabaseResilience(db, operation, {
        fallbackValue: [],
        serviceName,
        methodName
      });
    },
    
    /**
     * Wrap a method that returns a single item or null
     */
    async item<T>(
      db: any, 
      methodName: string, 
      operation: () => Promise<T | null>
    ): Promise<T | null> {
      return withDatabaseResilience(db, operation, {
        fallbackValue: null,
        serviceName,
        methodName
      });
    },
    
    /**
     * Wrap a method that returns a count
     */
    async count(
      db: any, 
      methodName: string, 
      operation: () => Promise<number>
    ): Promise<number> {
      return withDatabaseResilience(db, operation, {
        fallbackValue: 0,
        serviceName,
        methodName
      });
    },
    
    /**
     * Wrap a method that returns a boolean
     */
    async boolean(
      db: any, 
      methodName: string, 
      operation: () => Promise<boolean>
    ): Promise<boolean> {
      return withDatabaseResilience(db, operation, {
        fallbackValue: false,
        serviceName,
        methodName
      });
    },
    
    /**
     * Wrap a method that performs an operation (create/update/delete)
     */
    async operation<T>(
      db: any, 
      methodName: string, 
      operation: () => Promise<T>,
      fallbackValue: T
    ): Promise<T> {
      return withDatabaseResilience(db, operation, {
        fallbackValue,
        serviceName,
        methodName
      });
    }
  };
}