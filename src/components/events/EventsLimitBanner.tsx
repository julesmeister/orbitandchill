/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { useEventsLimits, formatTimeUntilReset } from '@/hooks/useEventsLimits';
import { useUserStore } from '@/store/userStore';

export default function EventsLimitBanner() {
  const { user } = useUserStore();
  const limits = useEventsLimits();
  
  if (!user || user.subscriptionTier === 'premium') {
    return null; // Don't show banner for premium users
  }
  
  const dailyRemaining = Math.max(0, limits.dailyGenerationLimit - limits.dailyGenerationUsed);
  const monthlyRemaining = Math.max(0, limits.monthlyGenerationLimit - limits.monthlyGenerationUsed);
  const dailyPercentage = (limits.dailyGenerationUsed / limits.dailyGenerationLimit) * 100;
  const monthlyPercentage = (limits.monthlyGenerationUsed / limits.monthlyGenerationLimit) * 100;
  const storagePercentage = (limits.currentStoredEvents / limits.maxStoredEvents) * 100;
  const bookmarkPercentage = (limits.currentBookmarks / limits.maxBookmarks) * 100;
  
  // Show banner if user is approaching any limits or has hit limits
  const shouldShow = !limits.canGenerateEvents || 
                    !limits.canAddMoreEvents || 
                    !limits.canBookmarkMore ||
                    dailyPercentage >= 60 || 
                    monthlyPercentage >= 70 ||
                    storagePercentage >= 80 ||
                    bookmarkPercentage >= 80;
  
  if (!shouldShow) return null;
  
  return (
    <div className="mb-6">
      {/* Limit Reached Banner */}
      {(!limits.canGenerateEvents || !limits.canAddMoreEvents) && (
        <div className="bg-yellow-50 border-2 border-yellow-300 p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-yellow-500 flex items-center justify-center mt-0.5">
              <span className="text-white text-sm">⚠</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Limit Reached</h3>
              <p className="text-sm text-gray-700 mb-3">{limits.limitMessage}</p>
              <div className="flex items-center gap-4">
                <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-sm hover:from-purple-700 hover:to-pink-700 transition-colors">
                  🚀 Upgrade to Premium
                </button>
                <span className="text-sm text-gray-600">
                  Get unlimited event generation & storage
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Usage Stats */}
      <div className="bg-white border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Your Event Limits</h3>
          <span className="text-xs text-gray-500 uppercase tracking-wide">Free Plan</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Daily Generation Limit */}
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <div className="flex items-center gap-2">
                <span className="text-gray-700">Daily Generations</span>
                <span className="text-xs text-gray-500">🔮</span>
              </div>
              <span className="font-medium text-gray-900">
                {limits.dailyGenerationUsed} / {limits.dailyGenerationLimit}
              </span>
            </div>
            <div className="w-full bg-gray-200 h-2 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  dailyPercentage >= 100 ? 'bg-red-500' : 
                  dailyPercentage >= 80 ? 'bg-yellow-500' : 
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min(100, dailyPercentage)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {dailyRemaining > 0 
                ? `${dailyRemaining} generation${dailyRemaining !== 1 ? 's' : ''} remaining today`
                : `Resets in ${formatTimeUntilReset(limits.nextResetDaily)}`
              }
            </p>
          </div>
          
          {/* Monthly Generation Limit */}
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <div className="flex items-center gap-2">
                <span className="text-gray-700">Monthly Generations</span>
                <span className="text-xs text-gray-500">📅</span>
              </div>
              <span className="font-medium text-gray-900">
                {limits.monthlyGenerationUsed} / {limits.monthlyGenerationLimit}
              </span>
            </div>
            <div className="w-full bg-gray-200 h-2 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  monthlyPercentage >= 100 ? 'bg-red-500' : 
                  monthlyPercentage >= 80 ? 'bg-yellow-500' : 
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min(100, monthlyPercentage)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {monthlyRemaining > 0 
                ? `${monthlyRemaining} generation${monthlyRemaining !== 1 ? 's' : ''} remaining this month`
                : `Resets in ${formatTimeUntilReset(limits.nextResetMonthly)}`
              }
            </p>
          </div>
          
          {/* Storage Limit */}
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <div className="flex items-center gap-2">
                <span className="text-gray-700">Stored Events</span>
                <span className="text-xs text-gray-500">💾</span>
              </div>
              <span className="font-medium text-gray-900">
                {limits.currentStoredEvents} / {limits.maxStoredEvents}
              </span>
            </div>
            <div className="w-full bg-gray-200 h-2 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  storagePercentage >= 100 ? 'bg-red-500' : 
                  storagePercentage >= 90 ? 'bg-yellow-500' : 
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min(100, storagePercentage)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {limits.canAddMoreEvents 
                ? `${limits.maxStoredEvents - limits.currentStoredEvents} slots remaining`
                : 'Storage full - delete events or upgrade'
              }
            </p>
          </div>
          
          {/* Bookmark Limit */}
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <div className="flex items-center gap-2">
                <span className="text-gray-700">Bookmarks</span>
                <span className="text-xs text-gray-500">⭐</span>
              </div>
              <span className="font-medium text-gray-900">
                {limits.currentBookmarks} / {limits.maxBookmarks}
              </span>
            </div>
            <div className="w-full bg-gray-200 h-2 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  bookmarkPercentage >= 100 ? 'bg-red-500' : 
                  bookmarkPercentage >= 90 ? 'bg-yellow-500' : 
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min(100, bookmarkPercentage)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {limits.canBookmarkMore 
                ? `${limits.maxBookmarks - limits.currentBookmarks} bookmark${limits.maxBookmarks - limits.currentBookmarks !== 1 ? 's' : ''} remaining`
                : 'Bookmark limit reached'
              }
            </p>
          </div>
        </div>
        
        {/* Premium Features Preview */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-600 mb-2">
            Premium features locked:
          </p>
          <div className="flex flex-wrap gap-2">
            {!limits.canAccessTimeWindows && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-xs text-gray-600">
                🕐 Time Windows
              </span>
            )}
            {!limits.canAccessElectionalData && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-xs text-gray-600">
                📊 Electional Data
              </span>
            )}
            {!limits.canExportEvents && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-xs text-gray-600">
                📤 Export Events
              </span>
            )}
          </div>
          <button className="mt-2 text-sm font-medium text-purple-600 hover:text-purple-700">
            View Premium Benefits →
          </button>
        </div>
      </div>
    </div>
  );
}