/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { PremiumStatsCardsProps } from '@/types/premium';

export default function PremiumStatsCards({ features }: PremiumStatsCardsProps) {
  const getEnabledCount = () => features.filter(f => f.isEnabled).length;
  const getPremiumCount = () => features.filter(f => f.isPremium).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border border-black">
      <div className="p-6 border-black md:border-r" style={{ backgroundColor: '#f0e3ff' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-open-sans text-sm text-black/70">Total Features</p>
            <p className="font-space-grotesk text-2xl font-bold text-black">{features.length}</p>
          </div>
          <div className="w-10 h-10 bg-black flex items-center justify-center">
            <span className="text-white text-lg">⭐</span>
          </div>
        </div>
      </div>
      
      <div className="p-6 border-black md:border-r" style={{ backgroundColor: '#4ade80' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-open-sans text-sm text-black/70">Enabled</p>
            <p className="font-space-grotesk text-2xl font-bold text-black">{getEnabledCount()}</p>
          </div>
          <div className="w-10 h-10 bg-black flex items-center justify-center">
            <span className="text-white text-lg">✅</span>
          </div>
        </div>
      </div>
      
      <div className="p-6 border-black md:border-r" style={{ backgroundColor: '#f2e356' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-open-sans text-sm text-black/70">Premium</p>
            <p className="font-space-grotesk text-2xl font-bold text-black">{getPremiumCount()}</p>
          </div>
          <div className="w-10 h-10 bg-black flex items-center justify-center">
            <span className="text-white text-lg">💎</span>
          </div>
        </div>
      </div>
      
      <div className="p-6" style={{ backgroundColor: '#6bdbff' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-open-sans text-sm text-black/70">Free</p>
            <p className="font-space-grotesk text-2xl font-bold text-black">{features.length - getPremiumCount()}</p>
          </div>
          <div className="w-10 h-10 bg-black flex items-center justify-center">
            <span className="text-white text-lg">🆓</span>
          </div>
        </div>
      </div>
    </div>
  );
}