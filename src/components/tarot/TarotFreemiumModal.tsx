/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import Link from 'next/link';

interface TarotFreemiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  interpretationsToday: number;
  remainingPlays: number;
  onUpgrade?: () => void;
}

export default function TarotFreemiumModal({
  isOpen,
  onClose,
  interpretationsToday,
  remainingPlays,
  onUpgrade
}: TarotFreemiumModalProps) {
  if (!isOpen) return null;

  const resetTime = new Date();
  resetTime.setDate(resetTime.getDate() + 1);
  resetTime.setHours(0, 0, 0, 0);
  
  const formatResetTime = () => {
    const now = new Date();
    const hoursUntilReset = Math.ceil((resetTime.getTime() - now.getTime()) / (1000 * 60 * 60));
    return `${hoursUntilReset} hour${hoursUntilReset !== 1 ? 's' : ''}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border-2 border-black p-8 max-w-md w-full">
        <div className="text-center">
          {remainingPlays > 0 ? (
            <>
              {/* Still has plays left */}
              <div className="text-6xl mb-4">🔮</div>
              <h2 className="text-2xl font-bold mb-4 font-space-grotesk text-black">
                Welcome to Tarot Learning!
              </h2>
              <div className="bg-blue-50 border border-blue-200 p-4 mb-6">
                <p className="text-blue-800 font-inter">
                  <strong>Free Daily Limit:</strong> You can play <strong>{remainingPlays}</strong> more interpretation{remainingPlays !== 1 ? 's' : ''} today!
                </p>
              </div>
              <p className="text-black/70 mb-6 font-inter">
                Practice interpreting tarot cards with AI-powered scenarios. Free users get 1 interpretation per day.
              </p>
            </>
          ) : (
            <>
              {/* Used up daily limit */}
              <div className="text-6xl mb-4">⏰</div>
              <h2 className="text-2xl font-bold mb-4 font-space-grotesk text-black">
                Daily Limit Reached
              </h2>
              <div className="bg-orange-50 border border-orange-200 p-4 mb-6">
                <p className="text-orange-800 font-inter">
                  You've used your <strong>1 free interpretation</strong> for today.
                </p>
                <p className="text-orange-600 text-sm mt-2">
                  Reset in approximately {formatResetTime()}
                </p>
              </div>
              <p className="text-black/70 mb-6 font-inter">
                Come back tomorrow for another free interpretation, or upgrade to premium for unlimited access!
              </p>
            </>
          )}

          {/* Premium Benefits */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="font-bold mb-3 font-space-grotesk text-black">Premium Benefits</h3>
            <ul className="text-left space-y-2 text-sm text-black/70 font-inter">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                Unlimited daily interpretations
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                Access to full leaderboard rankings
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                Advanced card mastery tracking
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                Future: 3-card & Celtic Cross spreads
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {remainingPlays > 0 ? (
              <>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-black text-white font-semibold hover:bg-gray-800 transition-colors font-space-grotesk"
                >
                  Start Playing
                </button>
                <button
                  onClick={() => {
                    onUpgrade?.();
                    onClose();
                  }}
                  className="flex-1 px-4 py-3 bg-white text-black border-2 border-black font-semibold hover:bg-black hover:text-white transition-colors font-space-grotesk"
                >
                  Upgrade
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-white text-black border-2 border-black font-semibold hover:bg-gray-100 transition-colors font-space-grotesk"
                >
                  Maybe Later
                </button>
                <button
                  onClick={() => {
                    onUpgrade?.();
                    onClose();
                  }}
                  className="flex-1 px-4 py-3 bg-black text-white font-semibold hover:bg-gray-800 transition-colors font-space-grotesk"
                >
                  Upgrade Now
                </button>
              </>
            )}
          </div>

          {remainingPlays === 0 && (
            <p className="text-xs text-black/50 mt-4 font-inter">
              Your daily limit resets at midnight
            </p>
          )}
        </div>
      </div>
    </div>
  );
}