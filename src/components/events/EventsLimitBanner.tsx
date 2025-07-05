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
      {/* Limit Reached Banner - Synapsas Style */}
      {(!limits.canGenerateEvents || !limits.canAddMoreEvents) && (
        <div className="bg-white border-2 border-black mb-4" style={{ backgroundColor: '#f2e356' }}>
          <div className="flex items-start gap-4 p-6">
            <div className="w-10 h-10 bg-black flex items-center justify-center">
              <span className="text-white text-lg">⚠</span>
            </div>
            <div className="flex-1">
              <h3 className="font-space-grotesk text-lg font-bold text-black mb-2">Limit Reached</h3>
              <p className="font-open-sans text-sm text-black mb-4">{limits.limitMessage}</p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-open-sans font-semibold text-sm border-2 border-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25">
                  🚀 Upgrade to Premium
                </button>
                <span className="font-open-sans text-sm text-black font-medium">
                  Get unlimited event generation & storage
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Usage Stats - Synapsas Grid Style */}
      <div className="bg-white border-2 border-black">
        <div className="p-6 border-b-2 border-black">
          <div className="flex items-center justify-between">
            <h3 className="font-space-grotesk text-xl font-bold text-black">Your Event Limits</h3>
            <div className="px-3 py-1 bg-black border-2 border-black">
              <span className="font-open-sans text-xs text-white font-bold uppercase tracking-wide">Free Plan</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t-2 border-black">
          {/* Daily Generation Limit */}
          <div className="p-6 border-black md:border-r-2" style={{ backgroundColor: '#f0e3ff' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-black flex items-center justify-center">
                  <span className="text-white text-sm">🔮</span>
                </div>
                <span className="font-open-sans text-sm text-black font-medium">Daily Generations</span>
              </div>
              <span className="font-space-grotesk text-xl font-bold text-black">
                {limits.dailyGenerationUsed} / {limits.dailyGenerationLimit}
              </span>
            </div>
            <div className="w-full bg-white border-2 border-black h-4 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  dailyPercentage >= 100 ? 'bg-red-500' : 
                  dailyPercentage >= 80 ? 'bg-yellow-500' : 
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min(100, dailyPercentage)}%` }}
              />
            </div>
            <p className="font-open-sans text-xs text-black/70 mt-2">
              {dailyRemaining > 0 
                ? `${dailyRemaining} generation${dailyRemaining !== 1 ? 's' : ''} remaining today`
                : `Resets in ${formatTimeUntilReset(limits.nextResetDaily)}`
              }
            </p>
          </div>
          
          {/* Monthly Generation Limit */}
          <div className="p-6 border-black border-b-2 md:border-b-0" style={{ backgroundColor: '#4ade80' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-black flex items-center justify-center">
                  <span className="text-white text-sm">📅</span>
                </div>
                <span className="font-open-sans text-sm text-black font-medium">Monthly Generations</span>
              </div>
              <span className="font-space-grotesk text-xl font-bold text-black">
                {limits.monthlyGenerationUsed} / {limits.monthlyGenerationLimit}
              </span>
            </div>
            <div className="w-full bg-white border-2 border-black h-4 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  monthlyPercentage >= 100 ? 'bg-red-500' : 
                  monthlyPercentage >= 80 ? 'bg-yellow-500' : 
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min(100, monthlyPercentage)}%` }}
              />
            </div>
            <p className="font-open-sans text-xs text-black/70 mt-2">
              {monthlyRemaining > 0 
                ? `${monthlyRemaining} generation${monthlyRemaining !== 1 ? 's' : ''} remaining this month`
                : `Resets in ${formatTimeUntilReset(limits.nextResetMonthly)}`
              }
            </p>
          </div>
          
          {/* Storage Limit */}
          <div className="p-6 border-black md:border-r-2 border-b-2" style={{ backgroundColor: '#f2e356' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-black flex items-center justify-center">
                  <span className="text-white text-sm">💾</span>
                </div>
                <span className="font-open-sans text-sm text-black font-medium">Stored Events</span>
              </div>
              <span className="font-space-grotesk text-xl font-bold text-black">
                {limits.currentStoredEvents} / {limits.maxStoredEvents}
              </span>
            </div>
            <div className="w-full bg-white border-2 border-black h-4 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  storagePercentage >= 100 ? 'bg-red-500' : 
                  storagePercentage >= 90 ? 'bg-yellow-500' : 
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min(100, storagePercentage)}%` }}
              />
            </div>
            <p className="font-open-sans text-xs text-black/70 mt-2">
              {limits.canAddMoreEvents 
                ? `${limits.maxStoredEvents - limits.currentStoredEvents} slots remaining`
                : 'Storage full - delete events or upgrade'
              }
            </p>
          </div>
          
          {/* Bookmark Limit */}
          <div className="p-6 border-b-2 border-black" style={{ backgroundColor: '#6bdbff' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-black flex items-center justify-center">
                  <span className="text-white text-sm">⭐</span>
                </div>
                <span className="font-open-sans text-sm text-black font-medium">Bookmarks</span>
              </div>
              <span className="font-space-grotesk text-xl font-bold text-black">
                {limits.currentBookmarks} / {limits.maxBookmarks}
              </span>
            </div>
            <div className="w-full bg-white border-2 border-black h-4 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  bookmarkPercentage >= 100 ? 'bg-red-500' : 
                  bookmarkPercentage >= 90 ? 'bg-yellow-500' : 
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min(100, bookmarkPercentage)}%` }}
              />
            </div>
            <p className="font-open-sans text-xs text-black/70 mt-2">
              {limits.canBookmarkMore 
                ? `${limits.maxBookmarks - limits.currentBookmarks} bookmark${limits.maxBookmarks - limits.currentBookmarks !== 1 ? 's' : ''} remaining`
                : 'Bookmark limit reached'
              }
            </p>
          </div>
        </div>
        
        {/* Premium Features Preview - Synapsas Style */}
        <div className="p-6 border-t-2 border-black">
          <div className="flex items-center justify-between mb-4">
            <p className="font-open-sans text-sm text-black font-medium">
              Premium features locked:
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mb-4">
            {!limits.canAccessTimeWindows && (
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-white border-2 border-black">
                <span className="text-sm">🕐</span>
                <span className="font-open-sans text-xs text-black font-medium">Time Windows</span>
              </div>
            )}
            {!limits.canAccessElectionalData && (
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-white border-2 border-black">
                <span className="text-sm">📊</span>
                <span className="font-open-sans text-xs text-black font-medium">Electional Data</span>
              </div>
            )}
            {!limits.canExportEvents && (
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-white border-2 border-black">
                <span className="text-sm">📤</span>
                <span className="font-open-sans text-xs text-black font-medium">Export Events</span>
              </div>
            )}
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-transparent text-black font-open-sans font-semibold text-sm border-2 border-black transition-all duration-300 hover:bg-black hover:text-white hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/15">
            View Premium Benefits →
          </button>
        </div>
      </div>
    </div>
  );
}