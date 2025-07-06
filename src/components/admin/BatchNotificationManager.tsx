/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useBatchNotifications, useBatchPreferences } from '@/hooks/useBatchNotifications';

interface BatchNotificationManagerProps {
  className?: string;
}

/**
 * Admin component for managing batch notifications
 */
export const BatchNotificationManager: React.FC<BatchNotificationManagerProps> = ({
  className = ''
}) => {
  const {
    batchStats,
    isLoading,
    getBatchStats,
    processAllBatches,
    clearAllBatches,
    hasPendingBatches,
    pendingCount
  } = useBatchNotifications();

  const {
    batchEnabled,
    setBatchEnabled,
    batchDelay,
    setBatchDelay,
    maxBatchSize,
    setMaxBatchSize
  } = useBatchPreferences();

  const [isProcessing, setIsProcessing] = useState(false);
  const [lastProcessed, setLastProcessed] = useState<Date | null>(null);

  // Auto-refresh stats every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      getBatchStats();
    }, 30000);

    return () => clearInterval(interval);
  }, [getBatchStats]);

  const handleProcessAll = async () => {
    setIsProcessing(true);
    try {
      const success = await processAllBatches();
      if (success) {
        setLastProcessed(new Date());
      }
    } catch (error) {
      console.error('Error processing batches:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear all pending batches? This will process them into notifications.')) {
      return;
    }

    setIsProcessing(true);
    try {
      await clearAllBatches();
      setLastProcessed(new Date());
    } catch (error) {
      console.error('Error clearing batches:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString();
  };

  return (
    <div className={`bg-white rounded-lg border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Batch Notification Manager</h3>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={getBatchStats}
            disabled={isLoading}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
          
          {hasPendingBatches && (
            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
              {pendingCount} pending
            </span>
          )}
        </div>
      </div>

      {/* Batch Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {batchStats?.pendingBatches || 0}
          </div>
          <div className="text-sm text-blue-700">Active Batches</div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">
            {batchStats?.totalPendingNotifications || 0}
          </div>
          <div className="text-sm text-yellow-700">Pending Notifications</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {lastProcessed ? formatTime(lastProcessed) : 'Never'}
          </div>
          <div className="text-sm text-green-700">Last Processed</div>
        </div>
      </div>

      {/* Active Batch Details */}
      {batchStats?.activeBatchKeys && batchStats.activeBatchKeys.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Active Batch Keys</h4>
          <div className="bg-gray-50 p-3 rounded max-h-32 overflow-y-auto">
            {batchStats.activeBatchKeys.map((key, index) => (
              <div key={index} className="text-sm text-gray-600 font-mono mb-1">
                {key}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Batch Settings */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Batch Settings</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={batchEnabled}
                onChange={(e) => setBatchEnabled(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Enable batch notifications</span>
            </label>
          </div>
          
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Batch delay (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={batchDelay}
              onChange={(e) => setBatchDelay(parseInt(e.target.value) || 5)}
              className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Max batch size
            </label>
            <input
              type="number"
              min="2"
              max="50"
              value={maxBatchSize}
              onChange={(e) => setMaxBatchSize(parseInt(e.target.value) || 10)}
              className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="text-sm text-gray-600">
          {hasPendingBatches 
            ? `${pendingCount} notifications waiting to be batched`
            : 'No pending batches'
          }
        </div>
        
        <div className="flex items-center space-x-3">
          {hasPendingBatches && (
            <>
              <button
                onClick={handleProcessAll}
                disabled={isProcessing}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Process All Batches'}
              </button>
              
              <button
                onClick={handleClearAll}
                disabled={isProcessing}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear All
              </button>
            </>
          )}
        </div>
      </div>

      {/* Batch Status Indicator */}
      <div className="mt-4 p-3 rounded-lg bg-gray-50">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Batch Processing Status</span>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              batchEnabled 
                ? (hasPendingBatches ? 'bg-yellow-400' : 'bg-green-400')
                : 'bg-gray-400'
            }`}></div>
            <span className="text-sm text-gray-600">
              {!batchEnabled 
                ? 'Disabled' 
                : hasPendingBatches 
                  ? 'Active' 
                  : 'Idle'
              }
            </span>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h5 className="text-sm font-medium text-blue-900 mb-1">How Batch Notifications Work</h5>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Similar notifications are grouped together to reduce spam</li>
          <li>• Batches are processed after {batchDelay} minutes or when {maxBatchSize} events are reached</li>
          <li>• High-priority notifications (mentions, warnings) are sent immediately</li>
          <li>• Users see grouped messages like "John, Sarah and 3 others liked your post"</li>
        </ul>
      </div>
    </div>
  );
};

export default BatchNotificationManager;