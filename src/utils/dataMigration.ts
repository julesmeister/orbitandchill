/**
 * Data Migration Utilities
 * 
 * Client-side utilities for migrating user data during brand migration.
 * Handles localStorage, IndexedDB, and other client-side storage.
 */

import { BRAND } from '../config/brand';

// Legacy storage keys (Luckstrology era)
const LEGACY_KEYS = {
  USER_STORAGE: 'luckstrology-user-storage',
  EVENTS_STORAGE: 'luckstrology-events-storage',
  SESSION_KEY: 'luckstrology_session',
  DATABASE_NAME: 'LuckstrologyDB'
} as const;

// New storage keys (using current brand)
const NEW_KEYS = {
  USER_STORAGE: 'orbitandchill-user-storage',
  EVENTS_STORAGE: 'orbitandchill-events-storage', 
  SESSION_KEY: 'orbitandchill_session',
  DATABASE_NAME: 'OrbitAndChillDB'
} as const;

interface MigrationResult {
  success: boolean;
  migratedKeys: string[];
  errors: string[];
  warnings: string[];
}

interface MigrationOptions {
  preserveLegacyData?: boolean;
  skipConfirmation?: boolean;
  dryRun?: boolean;
}

/**
 * Main migration function - orchestrates all data migration
 */
export async function migrateUserData(options: MigrationOptions = {}): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: true,
    migratedKeys: [],
    errors: [],
    warnings: []
  };

  try {
    // Check if migration is needed
    const needsMigration = await checkMigrationNeeded();
    if (!needsMigration) {
      result.warnings.push('No migration needed - data already migrated or no legacy data found');
      return result;
    }

    // Create backup before migration
    if (!options.dryRun) {
      await createDataBackup();
    }

    // Migrate localStorage data
    const localStorageResult = await migrateLocalStorage(options);
    result.migratedKeys.push(...(localStorageResult.migratedKeys || []));
    result.errors.push(...(localStorageResult.errors || []));
    result.warnings.push(...(localStorageResult.warnings || []));

    // Migrate IndexedDB data
    const indexedDBResult = await migrateIndexedDB(options);
    result.migratedKeys.push(...(indexedDBResult.migratedKeys || []));
    result.errors.push(...(indexedDBResult.errors || []));
    result.warnings.push(...(indexedDBResult.warnings || []));

    // Clean up legacy data (if specified)
    if (!options.preserveLegacyData && !options.dryRun && result.errors.length === 0) {
      await cleanupLegacyData();
    }

    result.success = result.errors.length === 0;
    
    if (result.success) {
    } else {
      console.error('❌ User data migration completed with errors');
    }

  } catch (error) {
    result.success = false;
    result.errors.push(`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error('❌ Migration failed:', error);
  }

  return result;
}

/**
 * Check if migration is needed
 */
async function checkMigrationNeeded(): Promise<boolean> {
  // Check localStorage
  const hasLegacyLocalStorage = Object.values(LEGACY_KEYS).some(key => 
    localStorage.getItem(key) !== null
  );

  // Check IndexedDB
  const hasLegacyIndexedDB = await checkLegacyIndexedDB();

  return hasLegacyLocalStorage || hasLegacyIndexedDB;
}

/**
 * Create backup of existing data
 */
async function createDataBackup(): Promise<void> {
  const backup = {
    timestamp: new Date().toISOString(),
    localStorage: {} as Record<string, string>,
    indexedDB: {} as Record<string, any>
  };

  // Backup localStorage
  Object.values(LEGACY_KEYS).forEach(key => {
    const value = localStorage.getItem(key);
    if (value) {
      backup.localStorage[key] = value;
    }
  });

  // Store backup
  const backupKey = `data-backup-${Date.now()}`;
  try {
    localStorage.setItem(backupKey, JSON.stringify(backup));
  } catch (error) {
    console.warn('⚠️ Could not create data backup:', error);
  }
}

/**
 * Migrate localStorage data
 */
async function migrateLocalStorage(options: MigrationOptions): Promise<Partial<MigrationResult>> {
  const result: Partial<MigrationResult> = {
    migratedKeys: [],
    errors: [],
    warnings: []
  };

  const migrations = [
    { from: LEGACY_KEYS.USER_STORAGE, to: NEW_KEYS.USER_STORAGE },
    { from: LEGACY_KEYS.EVENTS_STORAGE, to: NEW_KEYS.EVENTS_STORAGE },
    { from: LEGACY_KEYS.SESSION_KEY, to: NEW_KEYS.SESSION_KEY }
  ];

  for (const migration of migrations) {
    try {
      const data = localStorage.getItem(migration.from);
      
      if (data) {
        if (!options.dryRun) {
          // Validate JSON if applicable
          if (migration.from !== LEGACY_KEYS.SESSION_KEY) {
            try {
              JSON.parse(data); // Validate JSON
            } catch {
              result.warnings?.push(`Data in ${migration.from} is not valid JSON - migrating as-is`);
            }
          }

          // Check if new key already exists
          const existingData = localStorage.getItem(migration.to);
          if (existingData && !options.skipConfirmation) {
            result.warnings?.push(`${migration.to} already exists - skipping migration`);
            continue;
          }

          localStorage.setItem(migration.to, data);
        } else {
        }

        result.migratedKeys?.push(migration.to);
      }
    } catch (error) {
      const errorMsg = `Failed to migrate ${migration.from}: ${error instanceof Error ? error.message : 'Unknown error'}`;
      result.errors?.push(errorMsg);
      console.error('❌', errorMsg);
    }
  }

  return result;
}

/**
 * Check for legacy IndexedDB
 */
async function checkLegacyIndexedDB(): Promise<boolean> {
  if (!window.indexedDB) return false;

  try {
    const databases = await indexedDB.databases();
    return databases.some(db => db.name === LEGACY_KEYS.DATABASE_NAME);
  } catch {
    // Fallback for browsers that don't support indexedDB.databases()
    return new Promise((resolve) => {
      const request = indexedDB.open(LEGACY_KEYS.DATABASE_NAME);
      request.onsuccess = () => {
        request.result.close();
        resolve(true);
      };
      request.onerror = () => resolve(false);
      request.onupgradeneeded = () => {
        request.result.close();
        resolve(false);
      };
    });
  }
}

/**
 * Migrate IndexedDB data
 */
async function migrateIndexedDB(options: MigrationOptions): Promise<Partial<MigrationResult>> {
  const result: Partial<MigrationResult> = {
    migratedKeys: [],
    errors: [],
    warnings: []
  };

  if (!window.indexedDB) {
    result.warnings?.push('IndexedDB not supported - skipping database migration');
    return result;
  }

  try {
    const hasLegacyDB = await checkLegacyIndexedDB();
    
    if (!hasLegacyDB) {
      result.warnings?.push('No legacy IndexedDB found - skipping database migration');
      return result;
    }

    if (options.dryRun) {
      result.migratedKeys?.push('IndexedDB');
      return result;
    }

    // Complex IndexedDB migration would go here
    // This is simplified - actual implementation would need to:
    // 1. Open legacy database
    // 2. Read all data from all object stores
    // 3. Create new database with new name
    // 4. Write all data to new database
    // 5. Verify data integrity
    
    result.warnings?.push('IndexedDB migration requires manual implementation for production use');
    
  } catch (error) {
    result.errors?.push(`IndexedDB migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return result;
}

/**
 * Clean up legacy data after successful migration
 */
async function cleanupLegacyData(): Promise<void> {

  // Remove legacy localStorage keys
  Object.values(LEGACY_KEYS).forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
    }
  });

  // TODO: Remove legacy IndexedDB if migration was successful
}

/**
 * Rollback migration - restore from backup
 */
export async function rollbackMigration(backupKey?: string): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: false,
    migratedKeys: [],
    errors: [],
    warnings: []
  };

  try {
    // Find backup if not specified
    if (!backupKey) {
      const backupKeys = Object.keys(localStorage).filter(key => key.startsWith('data-backup-'));
      if (backupKeys.length === 0) {
        result.errors.push('No backup found to rollback from');
        return result;
      }
      backupKey = backupKeys.sort().pop(); // Get most recent backup
    }

    const backupData = localStorage.getItem(backupKey!);
    if (!backupData) {
      result.errors.push(`Backup not found: ${backupKey}`);
      return result;
    }

    const backup = JSON.parse(backupData);

    // Restore localStorage data
    Object.entries(backup.localStorage).forEach(([key, value]) => {
      localStorage.setItem(key, value as string);
      result.migratedKeys.push(key);
    });

    // Remove new keys
    Object.values(NEW_KEYS).forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
      }
    });

    result.success = true;

  } catch (error) {
    result.errors.push(`Rollback failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error('❌ Rollback failed:', error);
  }

  return result;
}

/**
 * Get migration status
 */
export async function getMigrationStatus(): Promise<{
  hasLegacyData: boolean;
  hasNewData: boolean;
  migrationNeeded: boolean;
  backupAvailable: boolean;
}> {
  const hasLegacyData = Object.values(LEGACY_KEYS).some(key => 
    localStorage.getItem(key) !== null
  );

  const hasNewData = Object.values(NEW_KEYS).some(key => 
    localStorage.getItem(key) !== null
  );

  const backupAvailable = Object.keys(localStorage).some(key => 
    key.startsWith('data-backup-')
  );

  return {
    hasLegacyData,
    hasNewData,
    migrationNeeded: hasLegacyData && !hasNewData,
    backupAvailable
  };
}

// Export for use in components
export const dataMigrationUtils = {
  migrateUserData,
  rollbackMigration,
  getMigrationStatus,
  LEGACY_KEYS,
  NEW_KEYS
};