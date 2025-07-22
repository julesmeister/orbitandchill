/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { PremiumFeatureCardProps } from '@/types/premium';
import { getCategoryIcon, getCategoryColor } from '@/utils/premiumHelpers';

export default function PremiumFeatureCard({ feature, onToggle }: PremiumFeatureCardProps) {
  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div 
            className="w-10 h-10 flex items-center justify-center border border-black"
            style={{ backgroundColor: getCategoryColor(feature.category) }}
          >
            <span className="text-lg">{getCategoryIcon(feature.category)}</span>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="font-space-grotesk text-lg font-semibold text-black">
                {feature.name}
              </h4>
              <span className="px-2 py-1 text-xs font-medium border border-black bg-white text-black capitalize">
                {feature.category}
              </span>
              {feature.component && (
                <span className="px-2 py-1 text-xs font-medium border border-black bg-gray-100 text-black">
                  {feature.component}
                </span>
              )}
            </div>
            <p className="font-open-sans text-sm text-black/70 mb-3">
              {feature.description}
            </p>
            {feature.section && (
              <p className="font-open-sans text-xs text-black/50">
                Section: {feature.section}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center gap-2">
            <span className="font-open-sans text-sm text-black">Enabled</span>
            <button
              onClick={() => onToggle(feature.id, 'isEnabled')}
              className={`relative w-12 h-6 border-2 border-black transition-colors ${
                feature.isEnabled ? 'bg-black' : 'bg-white'
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 bg-white border border-black transition-transform ${
                  feature.isEnabled ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
          
          {/* Premium Toggle */}
          <div className="flex items-center gap-2">
            <span className="font-open-sans text-sm text-black">Premium</span>
            <button
              onClick={() => onToggle(feature.id, 'isPremium')}
              className={`relative w-12 h-6 border-2 border-black transition-colors ${
                feature.isPremium ? 'bg-black' : 'bg-white'
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 bg-white border border-black transition-transform ${
                  feature.isPremium ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}