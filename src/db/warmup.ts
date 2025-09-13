/* eslint-disable @typescript-eslint/no-unused-vars */
import { getDbAsync } from './index';

/**
 * Database warmup utilities to reduce cold start issues
 */

// Track warmup state
let isWarmedUp = false;
let warmupPromise: Promise<boolean> | null = null;

/**
 * Warm up the database connection and run basic queries
 */
export async function warmupDatabase(): Promise<boolean> {
  if (isWarmedUp) return true;
  
  if (warmupPromise) {
    return warmupPromise;
  }

  warmupPromise = (async () => {
    try {
      const db = await getDbAsync();
      if (!db) {
        return false;
      }

      // Run a simple query to test connection
      await db.client.execute('SELECT 1 as warmup_test');
      
      // Check if critical tables exist
      const tableChecks = [
        'users',
        'discussions', 
        'notifications',
        'analytics_traffic'
      ];
      
      for (const table of tableChecks) {
        try {
          await db.client.execute(`SELECT COUNT(*) FROM ${table} LIMIT 1`);
        } catch (error) {
          // Table not accessible during warmup
        }
      }
      
      isWarmedUp = true;
      return true;
    } catch (error) {
      console.error('❌ Database warmup failed:', error);
      return false;
    }
  })();

  return warmupPromise;
}

/**
 * Check if database has been warmed up
 */
export function isDatabaseWarmedUp(): boolean {
  return isWarmedUp;
}

/**
 * Reset warmup state (for testing)
 */
export function resetWarmupState(): void {
  isWarmedUp = false;
  warmupPromise = null;
}

// Auto-start warmup process
if (typeof window === 'undefined') {
  // Server-side only
  warmupDatabase();
}