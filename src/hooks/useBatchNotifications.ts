/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback } from 'react';

interface BatchStats {
  pendingBatches: number;
  totalPendingNotifications: number;
  activeBatchKeys: string[];
}

interface UseBatchNotificationsReturn {
  // Data
  batchStats: BatchStats | null;
  
  // Loading states
  isLoading: boolean;
  
  // Actions
  getBatchStats: () => Promise<void>;
  processAllBatches: () => Promise<boolean>;
  addToBatch: (notificationData: any) => Promise<boolean>;
  clearAllBatches: () => Promise<boolean>;
  
  // Computed values
  hasPendingBatches: boolean;
  pendingCount: number;
}

/**
 * Hook for managing batch notifications
 */
export const useBatchNotifications = (): UseBatchNotificationsReturn => {
  const [batchStats, setBatchStats] = useState<BatchStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get batch statistics
  const getBatchStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/notifications/batch');
      
      if (!response.ok) {
        throw new Error('Failed to fetch batch stats');
      }
      
      const data = await response.json();
      setBatchStats(data.stats);
    } catch (error) {
      console.error('Error fetching batch stats:', error);
      setBatchStats(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Process all pending batches
  const processAllBatches = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/notifications/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'process_all' })
      });

      if (!response.ok) {
        throw new Error('Failed to process batches');
      }

      // Refresh stats after processing
      await getBatchStats();
      
      return true;
    } catch (error) {
      console.error('Error processing batches:', error);
      return false;
    }
  }, [getBatchStats]);

  // Add notification to batch
  const addToBatch = useCallback(async (notificationData: {
    userId: string;
    type: string;
    entityType: string;
    entityId: string;
    actorName: string;
    contextTitle: string;
  }): Promise<boolean> => {
    try {
      const response = await fetch('/api/notifications/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_to_batch',
          ...notificationData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add to batch');
      }

      // Refresh stats after adding
      await getBatchStats();
      
      return true;
    } catch (error) {
      console.error('Error adding to batch:', error);
      return false;
    }
  }, [getBatchStats]);

  // Clear all batches
  const clearAllBatches = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/notifications/batch', {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to clear batches');
      }

      // Refresh stats after clearing
      await getBatchStats();
      
      return true;
    } catch (error) {
      console.error('Error clearing batches:', error);
      return false;
    }
  }, [getBatchStats]);

  // Auto-fetch stats on mount
  useEffect(() => {
    getBatchStats();
  }, [getBatchStats]);

  // Computed values
  const hasPendingBatches = batchStats ? batchStats.pendingBatches > 0 : false;
  const pendingCount = batchStats ? batchStats.totalPendingNotifications : 0;

  return {
    // Data
    batchStats,
    
    // Loading states
    isLoading,
    
    // Actions
    getBatchStats,
    processAllBatches,
    addToBatch,
    clearAllBatches,
    
    // Computed values
    hasPendingBatches,
    pendingCount
  };
};

/**
 * Hook for batch notification preferences
 */
export const useBatchPreferences = () => {
  const [batchEnabled, setBatchEnabled] = useState(true);
  const [batchDelay, setBatchDelay] = useState(5); // minutes
  const [maxBatchSize, setMaxBatchSize] = useState(10);

  // Load preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('batch-notification-preferences');
    if (saved) {
      try {
        const preferences = JSON.parse(saved);
        setBatchEnabled(preferences.batchEnabled ?? true);
        setBatchDelay(preferences.batchDelay ?? 5);
        setMaxBatchSize(preferences.maxBatchSize ?? 10);
      } catch (error) {
        console.error('Error loading batch preferences:', error);
      }
    }
  }, []);

  // Save preferences to localStorage
  const savePreferences = useCallback(() => {
    const preferences = {
      batchEnabled,
      batchDelay,
      maxBatchSize
    };
    localStorage.setItem('batch-notification-preferences', JSON.stringify(preferences));
  }, [batchEnabled, batchDelay, maxBatchSize]);

  // Auto-save when preferences change
  useEffect(() => {
    savePreferences();
  }, [savePreferences]);

  return {
    batchEnabled,
    setBatchEnabled,
    batchDelay,
    setBatchDelay,
    maxBatchSize,
    setMaxBatchSize,
    savePreferences
  };
};

export default useBatchNotifications;