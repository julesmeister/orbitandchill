/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

interface EventsAnalytics {
  totalEvents: number;
  eventsThisMonth: number;
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
    averageScore: number;
  };
}

interface EventsAnalyticsProps {
  events: EventsAnalytics | null | undefined;
}

export default function EventsAnalyticsCard({ events }: EventsAnalyticsProps) {
  return (
    <div className="bg-white border border-black p-4 sm:p-6 lg:p-8">
      <h3 className="font-space-grotesk text-base sm:text-lg font-bold text-black mb-4 sm:mb-6">Events Analytics</h3>
      {events ? (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between p-3 sm:p-4 border border-black" style={{ backgroundColor: '#6bdbff' }}>
            <span className="font-open-sans text-xs sm:text-sm font-medium text-black">Events This Month</span>
            <span className="font-open-sans text-xs sm:text-sm font-bold text-black">{events.eventsThisMonth}</span>
          </div>
          <div className="flex items-center justify-between p-3 sm:p-4 border border-black" style={{ backgroundColor: '#51bd94' }}>
            <span className="font-open-sans text-xs sm:text-sm font-medium text-black">Benefic Events</span>
            <span className="font-open-sans text-xs sm:text-sm font-bold text-black">{events.eventsByType.benefic}</span>
          </div>
          <div className="flex items-center justify-between p-3 sm:p-4 border border-black" style={{ backgroundColor: '#ff91e9' }}>
            <span className="font-open-sans text-xs sm:text-sm font-medium text-black">Generated vs Manual</span>
            <span className="font-open-sans text-xs sm:text-sm font-bold text-black">{events.generationStats.generated}/{events.generationStats.manual}</span>
          </div>
          <div className="flex items-center justify-between p-3 sm:p-4 border border-black" style={{ backgroundColor: '#f2e356' }}>
            <span className="font-open-sans text-xs sm:text-sm font-medium text-black">Average Score</span>
            <span className="font-open-sans text-xs sm:text-sm font-bold text-black">{events.engagementStats.averageScore}/10</span>
          </div>
        </div>
      ) : (
        <div className="p-3 sm:p-4 border border-black bg-gray-50">
          <p className="font-open-sans text-xs sm:text-sm text-black/60">No events data available</p>
        </div>
      )}
    </div>
  );
}