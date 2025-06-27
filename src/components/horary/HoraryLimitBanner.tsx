/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faClock, faCalendarAlt, faStar } from '@fortawesome/free-solid-svg-icons';
import { useHoraryLimits, formatTimeUntilReset } from '@/hooks/useHoraryLimits';
import { useUserStore } from '@/store/userStore';

export default function HoraryLimitBanner() {
  const { user } = useUserStore();
  const limits = useHoraryLimits();
  
  if (!user || user.subscriptionTier === 'premium') {
    return null; // Don't show banner for premium users
  }
  
  const dailyRemaining = Math.max(0, limits.dailyLimit - limits.dailyUsed);
  const monthlyRemaining = Math.max(0, limits.monthlyLimit - limits.monthlyUsed);
  const dailyPercentage = (limits.dailyUsed / limits.dailyLimit) * 100;
  const monthlyPercentage = (limits.monthlyUsed / limits.monthlyLimit) * 100;
  
  return (
    <div className="mb-6">
      {/* Limit Reached Banner */}
      {!limits.canAskQuestion && (
        <div className="bg-yellow-50 border-2 border-yellow-300 p-4 mb-4">
          <div className="flex items-start gap-3">
            <FontAwesomeIcon icon={faLock} className="text-yellow-600 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Question Limit Reached</h3>
              <p className="text-sm text-gray-700 mb-3">{limits.limitMessage}</p>
              <div className="flex items-center gap-4">
                <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-sm hover:from-purple-700 hover:to-pink-700 transition-colors">
                  <FontAwesomeIcon icon={faStar} className="mr-2" />
                  Upgrade to Premium
                </button>
                <span className="text-sm text-gray-600">
                  Get unlimited horary questions
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Usage Stats */}
      <div className="bg-white border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Your Question Limits</h3>
          <span className="text-xs text-gray-500 uppercase tracking-wide">Free Plan</span>
        </div>
        
        <div className="space-y-3">
          {/* Daily Limit */}
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faClock} className="text-gray-400" />
                <span className="text-gray-700">Daily Questions</span>
              </div>
              <span className="font-medium text-gray-900">
                {limits.dailyUsed} / {limits.dailyLimit}
              </span>
            </div>
            <div className="w-full bg-gray-200 h-2 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  dailyPercentage >= 100 ? 'bg-red-500' : 
                  dailyPercentage >= 66 ? 'bg-yellow-500' : 
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min(100, dailyPercentage)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {dailyRemaining > 0 
                ? `${dailyRemaining} question${dailyRemaining !== 1 ? 's' : ''} remaining today`
                : `Resets in ${formatTimeUntilReset(limits.nextResetDaily)}`
              }
            </p>
          </div>
          
          {/* Monthly Limit */}
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
                <span className="text-gray-700">Monthly Questions</span>
              </div>
              <span className="font-medium text-gray-900">
                {limits.monthlyUsed} / {limits.monthlyLimit}
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
                ? `${monthlyRemaining} question${monthlyRemaining !== 1 ? 's' : ''} remaining this month`
                : `Resets in ${formatTimeUntilReset(limits.nextResetMonthly)}`
              }
            </p>
          </div>
        </div>
        
        {/* Upgrade CTA */}
        {(dailyPercentage >= 66 || monthlyPercentage >= 80) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-600 mb-2">
              Running low on questions? Upgrade for unlimited access.
            </p>
            <button className="text-sm font-medium text-purple-600 hover:text-purple-700">
              View Premium Benefits →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}