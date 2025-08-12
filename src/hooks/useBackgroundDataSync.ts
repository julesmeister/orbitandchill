/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useCallback, useRef } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { db } from '@/store/database';

interface BackgroundSyncOptions {
  interval?: number; // minutes
  enabled?: boolean;
}

const DEFAULT_SYNC_INTERVAL = 3; // 3 minutes

export function useBackgroundDataSync(options: BackgroundSyncOptions = {}) {
  const {
    interval = DEFAULT_SYNC_INTERVAL,
    enabled = true
  } = options;

  const { loadThreads, isLoading } = useAdminStore();
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSyncRef = useRef<number>(Date.now());

  const performSync = useCallback(async () => {
    if (isLoading) return;

    try {
      console.log('🔄 [BackgroundSync] Syncing blog data...');
      await loadThreads();
      
      // Clear expired cache entries
      await db.clearExpiredCache();
      
      lastSyncRef.current = Date.now();
      console.log('✅ [BackgroundSync] Data sync completed');
    } catch (error) {
      console.error('❌ [BackgroundSync] Sync failed:', error);
    }
  }, [loadThreads, isLoading]);

  // Start background sync
  useEffect(() => {
    if (!enabled) return;

    // Initial sync after component mount (delay to avoid blocking initial render)
    const initialSyncTimeout = setTimeout(() => {
      performSync();
    }, 2000);

    // Set up periodic sync
    syncIntervalRef.current = setInterval(() => {
      performSync();
    }, interval * 60 * 1000);

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
      clearTimeout(initialSyncTimeout);
    };
  }, [enabled, interval]); // Remove performSync from dependencies to prevent loops

  // Manual sync function
  const manualSync = useCallback(async () => {
    await performSync();
  }, [performSync]);

  return {
    manualSync,
    lastSync: lastSyncRef.current,
    isEnabled: enabled
  };
}