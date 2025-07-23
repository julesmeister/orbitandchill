/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

interface EventStatsCardsProps {
  analytics: {
    totalEvents: number;
    eventsThisMonth: number;
    usageStats: {
      activeUsers: number;
    };
    engagementStats: {
      averageScore: number;
    };
  } | null;
}

export default function EventStatsCards({ analytics }: EventStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white border border-black p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-open-sans text-sm text-black/60 mb-1">Total Events</p>
            <p className="font-space-grotesk text-2xl font-bold text-black">
              {analytics?.totalEvents || 0}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white border border-black p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-open-sans text-sm text-black/60 mb-1">This Month</p>
            <p className="font-space-grotesk text-2xl font-bold text-black">
              {analytics?.eventsThisMonth || 0}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white border border-black p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-open-sans text-sm text-black/60 mb-1">Active Users</p>
            <p className="font-space-grotesk text-2xl font-bold text-black">
              {analytics?.usageStats.activeUsers || 0}
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white border border-black p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-open-sans text-sm text-black/60 mb-1">Average Score</p>
            <p className="font-space-grotesk text-2xl font-bold text-black">
              {analytics?.engagementStats.averageScore || 0}/10
            </p>
          </div>
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}