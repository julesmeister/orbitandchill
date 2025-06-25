/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface UserActivity {
  id: string;
  activityType: string;
  entityType?: string;
  entityId?: string;
  description: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  pageUrl?: string;
  referrer?: string;
  createdAt: string;
}

interface ActivitySummary {
  totalActivities: number;
  chartActivities: number;
  discussionActivities: number;
  eventActivities: number;
  lastActivity?: string;
  mostActiveDay?: string;
  activityByType: Record<string, number>;
}

interface UserActivityTimelineProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserActivityTimeline({ userId, isOpen, onClose }: UserActivityTimelineProps) {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [summary, setSummary] = useState<ActivitySummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [showSummary, setShowSummary] = useState(true);

  // Fetch user activity data
  const fetchUserActivity = async () => {
    setIsLoading(true);
    try {
      // Fetch summary
      const summaryResponse = await fetch(`/api/users/activity?userId=${userId}&summary=true`);
      if (summaryResponse.ok) {
        const summaryData = await summaryResponse.json();
        setSummary(summaryData.data);
      }

      // Fetch activities
      const activitiesResponse = await fetch(`/api/users/activity?userId=${userId}&limit=50`);
      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json();
        setActivities(activitiesData.data.activities);
      } else {
        toast.error('Failed to fetch user activity');
      }
    } catch (error) {
      console.error('Error fetching user activity:', error);
      toast.error('Failed to fetch user activity');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserActivity();
    }
  }, [isOpen, userId]);

  const getActivityIcon = (activityType: string) => {
    const iconMap: Record<string, string> = {
      chart_generated: '📊',
      chart_viewed: '👁️',
      chart_shared: '📤',
      discussion_created: '💬',
      discussion_viewed: '👀',
      discussion_replied: '↩️',
      discussion_voted: '👍',
      reply_created: '💭',
      reply_voted: '⭐',
      event_created: '📅',
      event_bookmarked: '🔖',
      event_unbookmarked: '📑',
      user_login: '🚪',
      user_logout: '🚶',
      user_registered: '🎉',
      user_updated: '✏️',
      settings_changed: '⚙️',
      page_view: '📄',
      navigation: '🧭',
      search_performed: '🔍',
      premium_activated: '⭐',
      premium_feature_used: '✨'
    };
    return iconMap[activityType] || '📋';
  };

  const getActivityColor = (activityType: string) => {
    if (activityType.includes('chart')) return '#6bdbff';      // Synapsas blue
    if (activityType.includes('discussion') || activityType.includes('reply')) return '#51bd94'; // Synapsas green
    if (activityType.includes('event')) return '#ff91e9';      // Synapsas purple
    if (activityType.includes('user')) return '#f2e356';       // Synapsas yellow
    if (activityType.includes('premium')) return '#19181a';    // Synapsas black
    return '#6bdbff'; // Default blue
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getFilteredActivities = () => {
    if (filter === 'all') return activities;
    return activities.filter(activity => {
      switch (filter) {
        case 'charts':
          return activity.activityType.includes('chart');
        case 'discussions':
          return activity.activityType.includes('discussion') || activity.activityType.includes('reply');
        case 'events':
          return activity.activityType.includes('event');
        case 'user':
          return activity.activityType.includes('user') || activity.activityType.includes('settings');
        default:
          return true;
      }
    });
  };

  const filteredActivities = getFilteredActivities();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border-2 border-black w-full max-w-5xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-black" style={{ backgroundColor: '#6bdbff' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-space-grotesk text-2xl font-bold text-black">User Activity Timeline</h2>
              <p className="font-inter text-lg text-black/80 mt-2">
                Recent activity for user ID: {userId}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-3 text-black hover:bg-black hover:text-white transition-colors border border-black"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Summary Section */}
        {showSummary && summary && (
          <div className="px-8 py-6 border-b border-black" style={{ backgroundColor: '#f2e356' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-space-grotesk text-xl font-bold text-black">Activity Summary (Last 30 Days)</h3>
              <button
                onClick={() => setShowSummary(!showSummary)}
                className="font-inter text-sm text-black border border-black px-3 py-1 hover:bg-black hover:text-white transition-colors"
              >
                Hide Summary
              </button>
            </div>
            <div className="grid grid-cols-4 gap-0 border border-black">
              <div className="bg-white p-6 text-center border-r border-black">
                <div className="font-space-grotesk font-bold text-3xl text-black">{summary.totalActivities}</div>
                <div className="font-inter text-sm text-black/80 mt-2">Total Activities</div>
              </div>
              <div className="p-6 text-center border-r border-black" style={{ backgroundColor: '#6bdbff' }}>
                <div className="font-space-grotesk font-bold text-3xl text-black">{summary.chartActivities}</div>
                <div className="font-inter text-sm text-black/80 mt-2">Chart Actions</div>
              </div>
              <div className="p-6 text-center border-r border-black" style={{ backgroundColor: '#51bd94' }}>
                <div className="font-space-grotesk font-bold text-3xl text-black">{summary.discussionActivities}</div>
                <div className="font-inter text-sm text-black/80 mt-2">Discussion Actions</div>
              </div>
              <div className="p-6 text-center" style={{ backgroundColor: '#ff91e9' }}>
                <div className="font-space-grotesk font-bold text-3xl text-black">{summary.eventActivities}</div>
                <div className="font-inter text-sm text-black/80 mt-2">Event Actions</div>
              </div>
            </div>
            {summary.lastActivity && (
              <div className="mt-4 font-inter text-sm text-black/80">
                Last activity: {formatDate(summary.lastActivity)}
              </div>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="px-8 py-4 border-b border-black bg-white">
          <div className="flex items-center space-x-0 border border-black">
            <div className="px-4 py-3 font-inter text-sm font-medium text-black bg-gray-50 border-r border-black">
              Filter:
            </div>
            {['all', 'charts', 'discussions', 'events', 'user'].map((filterOption, index) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-3 font-inter text-sm font-medium transition-colors ${
                  index < 4 ? 'border-r border-black' : ''
                } ${
                  filter === filterOption
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </button>
            ))}
            <div className="ml-auto px-4 py-3 font-inter text-sm text-black/60">
              {filteredActivities.length} {filteredActivities.length === 1 ? 'activity' : 'activities'}
            </div>
          </div>
        </div>

        {/* Activity List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-300 w-1/2 mx-auto mb-6"></div>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-6 px-8">
                      <div className="w-12 h-12 bg-gray-300 border border-black"></div>
                      <div className="flex-1 space-y-3">
                        <div className="h-4 bg-gray-300 w-3/4"></div>
                        <div className="h-3 bg-gray-300 w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-black">
                <svg className="mx-auto h-16 w-16 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-4 font-space-grotesk text-lg font-bold text-black">No activities found</h3>
                <p className="mt-2 font-inter text-sm text-black/70">This user has no recorded activities matching the current filter.</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-black">
              {filteredActivities.map((activity, index) => (
                <div key={activity.id} className={`px-8 py-6 hover:bg-gray-50 border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <div className="flex items-start space-x-6">
                    {/* Activity Icon */}
                    <div className="flex-shrink-0">
                      <div 
                        className="w-12 h-12 flex items-center justify-center text-xl border border-black"
                        style={{ backgroundColor: getActivityColor(activity.activityType) }}
                      >
                        <span className="text-black">{getActivityIcon(activity.activityType)}</span>
                      </div>
                    </div>

                    {/* Activity Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-inter text-base font-medium text-black">
                          {activity.description}
                        </p>
                        <p className="font-inter text-sm text-black/60">
                          {formatDate(activity.createdAt)}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center space-x-4 text-sm text-black/60">
                        <span className="inline-flex items-center px-3 py-1 border border-black text-xs font-inter font-medium bg-white text-black">
                          {activity.activityType.replace('_', ' ')}
                        </span>
                        {activity.entityType && (
                          <span className="font-inter">Entity: {activity.entityType}</span>
                        )}
                        {activity.sessionId && (
                          <span className="font-inter">Session: {activity.sessionId.slice(-8)}</span>
                        )}
                      </div>

                      {/* Metadata */}
                      {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                        <div className="mt-3 font-inter text-sm text-black/60">
                          <details className="cursor-pointer">
                            <summary className="hover:text-black font-medium">Show details</summary>
                            <div className="mt-2 bg-gray-100 border border-black p-3 text-xs">
                              <pre className="whitespace-pre-wrap font-mono">
                                {JSON.stringify(activity.metadata, null, 2)}
                              </pre>
                            </div>
                          </details>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-black bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="font-inter text-sm text-black/60">
              Showing recent activity for this user
            </p>
            <button
              onClick={() => window.open(`/api/users/activity?userId=${userId}&limit=1000`, '_blank')}
              className="px-4 py-2 font-inter text-sm font-medium bg-white border border-black hover:bg-black hover:text-white transition-colors"
            >
              Export All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}