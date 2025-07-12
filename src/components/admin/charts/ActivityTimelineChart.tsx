/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import LoadingSpinner from '../../reusable/LoadingSpinner';

interface ActivityItem {
  id: string;
  type: 'new_user' | 'new_discussion' | 'system_alert' | 'high_activity' | 'error';
  title: string;
  message: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
}

interface ActivityTimelineChartProps {
  activities?: ActivityItem[];
  isLoading?: boolean;
}

export default function ActivityTimelineChart({ activities, isLoading }: ActivityTimelineChartProps) {
  const [timePeriod, setTimePeriod] = useState<'daily' | 'monthly' | 'yearly'>('daily');
  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center bg-white border border-black">
        <LoadingSpinner
          variant="dots"
          size="sm"
          subtitle="Loading activity..."
          centered={true}
        />
      </div>
    );
  }

  const mockActivities: ActivityItem[] = [
    {
      id: '1',
      type: 'new_user',
      title: 'New User Registration',
      message: 'StarGazer joined the platform',
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      priority: 'low'
    },
    {
      id: '2', 
      type: 'new_discussion',
      title: 'New Discussion',
      message: 'Mercury Retrograde discussion posted',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      priority: 'medium'
    },
    {
      id: '3',
      type: 'system_alert',
      title: 'System Update',
      message: 'Database optimization completed',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      priority: 'low'
    },
    {
      id: '4',
      type: 'new_discussion',
      title: 'Popular Discussion',
      message: 'Mars placement guide gaining traction',
      timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
      priority: 'medium'
    }
  ];

  const timelineData = activities || mockActivities;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'new_user': return '#6bdbff';
      case 'new_discussion': return '#51bd94';
      case 'system_alert': return '#f2e356';
      case 'high_activity': return '#ff91e9';
      case 'error': return '#ff6b6b';
      default: return '#6b7280';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'new_user':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'new_discussion':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'system_alert':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date().getTime();
    const time = new Date(timestamp).getTime();
    const diffMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  // Filter activities based on time period
  const getFilteredActivities = () => {
    const now = new Date();
    let filteredData = [...timelineData];

    switch (timePeriod) {
      case 'daily':
        // Last 24 hours
        filteredData = timelineData.filter(activity => {
          const activityTime = new Date(activity.timestamp);
          return (now.getTime() - activityTime.getTime()) < 24 * 60 * 60 * 1000;
        });
        break;
      case 'monthly':
        // Last 30 days
        filteredData = timelineData.filter(activity => {
          const activityTime = new Date(activity.timestamp);
          return (now.getTime() - activityTime.getTime()) < 30 * 24 * 60 * 60 * 1000;
        });
        break;
      case 'yearly':
        // Last 365 days
        filteredData = timelineData.filter(activity => {
          const activityTime = new Date(activity.timestamp);
          return (now.getTime() - activityTime.getTime()) < 365 * 24 * 60 * 60 * 1000;
        });
        break;
    }

    return filteredData;
  };

  const filteredActivities = getFilteredActivities();

  return (
    // Full width container that spans entire available space
    <div className="w-full">
      <div className="bg-white border border-black p-8">
        {/* Header with time period controls */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-space-grotesk text-xl font-bold text-black">Activity Timeline</h3>
          
          {/* Time period selector */}
          <div className="flex items-center space-x-1 border border-black">
            {(['daily', 'monthly', 'yearly'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimePeriod(period)}
                className={`px-4 py-2 font-open-sans text-sm font-medium transition-colors ${
                  timePeriod === period
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline content with more spacing */}
        <div className="space-y-8">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-open-sans text-black/60">No activity in this time period</p>
            </div>
          ) : (
            filteredActivities.map((activity, index) => (
              <div key={activity.id} className="flex items-start space-x-6">
                {/* Timeline connector with more space */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-12 h-12 border-2 border-black flex items-center justify-center text-white"
                    style={{ backgroundColor: getTypeColor(activity.type) }}
                  >
                    {getTypeIcon(activity.type)}
                  </div>
                  {index < filteredActivities.length - 1 && (
                    <div className="w-px h-12 bg-black/20 mt-4"></div>
                  )}
                </div>

                {/* Activity content with more breathing room */}
                <div className="flex-1 min-w-0">
                  <div className="p-6 border border-black bg-white">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-space-grotesk text-lg font-bold text-black mb-2">
                          {activity.title}
                        </h4>
                        <p className="font-open-sans text-base text-black/80 leading-relaxed">
                          {activity.message}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-3 ml-4">
                        {activity.priority === 'high' && (
                          <span className="px-3 py-1 text-xs font-bold text-white bg-red-500">
                            HIGH PRIORITY
                          </span>
                        )}
                        <span className="font-open-sans text-sm text-black/60 whitespace-nowrap">
                          {getTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Activity type indicator */}
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 border border-black"
                        style={{ backgroundColor: getTypeColor(activity.type) }}
                      ></div>
                      <span className="font-open-sans text-sm text-black/60 capitalize">
                        {activity.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with stats */}
        <div className="mt-8 pt-6 border-t border-black/20">
          <div className="flex items-center justify-between">
            <div className="font-open-sans text-sm text-black/60">
              Showing {filteredActivities.length} activities in the last {timePeriod === 'daily' ? '24 hours' : timePeriod === 'monthly' ? '30 days' : 'year'}
            </div>
            <button className="font-open-sans text-sm text-black hover:underline font-medium">
              View all activity →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}