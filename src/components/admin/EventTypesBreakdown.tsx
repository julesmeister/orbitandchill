/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

interface EventTypesBreakdownProps {
  analytics: {
    eventsByType: {
      benefic: number;
      challenging: number;
      neutral: number;
    };
    generationStats: {
      generated: number;
      manual: number;
    };
    engagementStats: {
      bookmarked: number;
    };
    usageStats: {
      eventsPerUser: number;
    };
  } | null;
}

export default function EventTypesBreakdown({ analytics }: EventTypesBreakdownProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white border border-black p-8">
        <h3 className="font-space-grotesk text-lg font-bold text-black mb-6">Event Types</h3>
        {analytics ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-black" style={{ backgroundColor: '#51bd94' }}>
              <span className="font-open-sans text-sm font-medium text-black">Benefic Events</span>
              <span className="font-open-sans text-sm font-bold text-black">{analytics.eventsByType.benefic}</span>
            </div>
            <div className="flex items-center justify-between p-4 border border-black" style={{ backgroundColor: '#ff6b6b' }}>
              <span className="font-open-sans text-sm font-medium text-black">Challenging Events</span>
              <span className="font-open-sans text-sm font-bold text-black">{analytics.eventsByType.challenging}</span>
            </div>
            <div className="flex items-center justify-between p-4 border border-black" style={{ backgroundColor: '#6bdbff' }}>
              <span className="font-open-sans text-sm font-medium text-black">Neutral Events</span>
              <span className="font-open-sans text-sm font-bold text-black">{analytics.eventsByType.neutral}</span>
            </div>
          </div>
        ) : (
          <div className="p-4 border border-black bg-gray-50">
            <p className="font-open-sans text-sm text-black/60">Loading...</p>
          </div>
        )}
      </div>

      <div className="bg-white border border-black p-8">
        <h3 className="font-space-grotesk text-lg font-bold text-black mb-6">Generation & Engagement</h3>
        {analytics ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-black" style={{ backgroundColor: '#f2e356' }}>
              <span className="font-open-sans text-sm font-medium text-black">Generated Events</span>
              <span className="font-open-sans text-sm font-bold text-black">{analytics.generationStats.generated}</span>
            </div>
            <div className="flex items-center justify-between p-4 border border-black" style={{ backgroundColor: '#ff91e9' }}>
              <span className="font-open-sans text-sm font-medium text-black">Manual Events</span>
              <span className="font-open-sans text-sm font-bold text-black">{analytics.generationStats.manual}</span>
            </div>
            <div className="flex items-center justify-between p-4 border border-black" style={{ backgroundColor: '#6bdbff' }}>
              <span className="font-open-sans text-sm font-medium text-black">Bookmarked Events</span>
              <span className="font-open-sans text-sm font-bold text-black">{analytics.engagementStats.bookmarked}</span>
            </div>
            <div className="flex items-center justify-between p-4 border border-black" style={{ backgroundColor: '#51bd94' }}>
              <span className="font-open-sans text-sm font-medium text-black">Events per User</span>
              <span className="font-open-sans text-sm font-bold text-black">{analytics.usageStats.eventsPerUser}</span>
            </div>
          </div>
        ) : (
          <div className="p-4 border border-black bg-gray-50">
            <p className="font-open-sans text-sm text-black/60">Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
}