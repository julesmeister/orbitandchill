/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { 
  getGeneratedPercentage, 
  getBeneficPercentage, 
  getBookmarkPercentage 
} from '@/utils/analyticsHelpers';

interface UsageInsightsProps {
  analytics: any;
}

export default function UsageInsights({ analytics }: UsageInsightsProps) {
  return (
    <div className="bg-white border border-black p-8">
      <h3 className="font-space-grotesk text-lg font-bold text-black mb-6">Usage Insights</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-6 border border-black">
          <div className="text-3xl font-space-grotesk font-bold text-black mb-2">
            {getGeneratedPercentage(analytics)}%
          </div>
          <div className="font-open-sans text-sm text-black/60">Generated Events</div>
          <div className="font-open-sans text-xs text-black/40 mt-1">
            Users prefer auto-generated optimal timing
          </div>
        </div>
        
        <div className="text-center p-6 border border-black">
          <div className="text-3xl font-space-grotesk font-bold text-black mb-2">
            {getBeneficPercentage(analytics)}%
          </div>
          <div className="font-open-sans text-sm text-black/60">Benefic Events</div>
          <div className="font-open-sans text-xs text-black/40 mt-1">
            Users focus on positive timing
          </div>
        </div>
        
        <div className="text-center p-6 border border-black">
          <div className="text-3xl font-space-grotesk font-bold text-black mb-2">
            {getBookmarkPercentage(analytics)}%
          </div>
          <div className="font-open-sans text-sm text-black/60">Bookmark Rate</div>
          <div className="font-open-sans text-xs text-black/40 mt-1">
            Events saved for later reference
          </div>
        </div>
      </div>
    </div>
  );
}