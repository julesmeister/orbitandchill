/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface UserActivity {
  id: string;
  activityType?: string;
  activity_type?: string;  // Support both camelCase and snake_case
  entityType?: string;
  entity_type?: string;
  entityId?: string;
  entity_id?: string;
  description: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  ip_address?: string;
  userAgent?: string;
  user_agent?: string;
  sessionId?: string;
  session_id?: string;
  pageUrl?: string;
  page_url?: string;
  referrer?: string;
  createdAt?: string;
  created_at?: string;    // Support both camelCase and snake_case
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

  // Helper functions to handle both camelCase and snake_case field names
  const getActivityType = (activity: UserActivity): string => {
    return activity.activityType || activity.activity_type || '';
  };

  const getCreatedAt = (activity: UserActivity): string => {
    return activity.createdAt || activity.created_at || '';
  };

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
        setActivities(activitiesData.data.activities || []);
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
    if (!activityType) return '#6bdbff'; // Default blue if undefined
    if (activityType.includes('chart')) return '#6bdbff';      // Synapsas blue
    if (activityType.includes('discussion') || activityType.includes('reply')) return '#51bd94'; // Synapsas green
    if (activityType.includes('event')) return '#ff91e9';      // Synapsas purple
    if (activityType.includes('user')) return '#f2e356';       // Synapsas yellow
    if (activityType.includes('premium')) return '#19181a';    // Synapsas black
    return '#6bdbff'; // Default blue
  };

  const formatDate = (dateString: string) => {
    if (!dateString) {
      return 'No date';
    }
    
    // Handle both string and numeric timestamps
    const date = new Date(typeof dateString === 'number' ? dateString * 1000 : dateString);
    
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    // Long form date format
    const formatted = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    return formatted;
  };

  const getFilteredActivities = () => {
    if (filter === 'all') return activities;
    return activities.filter(activity => {
      const activityType = getActivityType(activity);
      if (!activityType) return false;
      switch (filter) {
        case 'charts':
          return activityType.includes('chart');
        case 'discussions':
          return activityType.includes('discussion') || activityType.includes('reply');
        case 'events':
          return activityType.includes('event');
        case 'user':
          return activityType.includes('user') || activityType.includes('settings');
        default:
          return true;
      }
    });
  };

  const filteredActivities = getFilteredActivities();

  if (!isOpen) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Compact Header */}
      <div className="px-4 py-3 border-b border-black bg-gray-50">
        <h3 className="font-space-grotesk text-sm font-bold text-black">User ID: {userId}</h3>
      </div>

      {/* Compact Summary Section */}
      {showSummary && summary && (
        <div className="px-3 py-2 border-b border-black bg-yellow-50">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-space-grotesk text-xs font-bold text-black">Summary</h4>
            <button
              onClick={() => setShowSummary(!showSummary)}
              className="font-inter text-xs text-black hover:underline"
            >
              Hide
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white p-2 text-center border border-black">
              <div className="font-space-grotesk font-bold text-lg text-black">{summary.totalActivities}</div>
              <div className="font-inter text-xs text-black/80">Total</div>
            </div>
            <div className="p-2 text-center border border-black" style={{ backgroundColor: '#6bdbff' }}>
              <div className="font-space-grotesk font-bold text-lg text-black">{summary.chartActivities}</div>
              <div className="font-inter text-xs text-black/80">Charts</div>
            </div>
          </div>
        </div>
      )}

      {/* Compact Filters */}
      <div className="px-3 py-2 border-b border-black bg-white">
        <div className="flex items-center space-x-1">
          <span className="font-inter text-xs font-medium text-black">Filter:</span>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="font-inter text-xs bg-white border border-black px-2 py-1"
          >
            <option value="all">All</option>
            <option value="charts">Charts</option>
            <option value="discussions">Discussions</option>
            <option value="events">Events</option>
            <option value="user">User</option>
          </select>
          <span className="ml-auto font-inter text-xs text-black/60">
            {filteredActivities.length} items
          </span>
        </div>
      </div>

      {/* Activity List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center">
            <div className="animate-pulse">
              <div className="h-3 bg-gray-300 w-1/2 mx-auto mb-3"></div>
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-2 px-2">
                    <div className="w-6 h-6 bg-gray-300 border border-black"></div>
                    <div className="flex-1 space-y-1">
                      <div className="h-3 bg-gray-300 w-3/4"></div>
                      <div className="h-2 bg-gray-300 w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="p-4 text-center">
            <div className="text-black">
              <svg className="mx-auto h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h4 className="mt-2 font-space-grotesk text-sm font-bold text-black">No activities</h4>
              <p className="mt-1 font-inter text-xs text-black/70">No activities found for this filter.</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredActivities.slice(0, 20).map((activity, index) => (
              <div key={activity.id} className={`px-3 py-2 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <div className="flex items-start space-x-2">
                  {/* Activity Icon */}
                  <div className="flex-shrink-0">
                    <div 
                      className="w-6 h-6 flex items-center justify-center text-xs border border-black"
                      style={{ backgroundColor: getActivityColor(getActivityType(activity)) }}
                    >
                      <span className="text-black">{getActivityIcon(getActivityType(activity))}</span>
                    </div>
                  </div>

                  {/* Activity Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-inter text-xs font-medium text-black truncate">
                        {activity.description}
                      </p>
                      <p className="font-inter text-xs text-black/60 ml-2">
                        {getCreatedAt(activity) ? formatDate(getCreatedAt(activity)) : 'No date'}
                      </p>
                    </div>
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 border border-black text-xs font-inter font-medium bg-white text-black">
                        {getActivityType(activity)?.replace(/_/g, ' ') || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}