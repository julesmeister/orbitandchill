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

interface UserActivitySectionProps {
  userId: string;
}

export default function UserActivitySection({ userId }: UserActivitySectionProps) {
  const [recentActivities, setRecentActivities] = useState<UserActivity[]>([]);
  const [summary, setSummary] = useState<ActivitySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

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

      // Fetch recent activities
      const activitiesResponse = await fetch(`/api/users/activity?userId=${userId}&limit=10`);
      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json();
        setRecentActivities(activitiesData.data.activities);
      } else {
        console.warn('Failed to fetch user activity');
      }
    } catch (error) {
      console.error('Error fetching user activity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserActivity();
    }
  }, [userId]);

  const getActivityIcon = (activityType: string) => {
    const iconMap: Record<string, React.JSX.Element> = {
      chart_generated: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      chart_viewed: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      discussion_created: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      discussion_viewed: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      reply_created: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      ),
      event_bookmarked: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      ),
      user_login: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
      ),
      settings_changed: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      page_view: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    };
    return iconMap[activityType] || (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    );
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
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="bg-white">
        <div className="p-6 border-b border-gray-200">
          <p className="font-inter text-black/60">Loading your activity timeline...</p>
        </div>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 bg-gray-50 rounded">
                  <div className="w-8 h-8 bg-gray-300 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="p-6 border-b border-black">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-inter text-black/60">Your platform usage and interaction timeline</p>
          </div>
          {recentActivities.length > 5 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="group relative px-4 py-2 bg-white text-black font-semibold border border-black transition-all duration-300 hover:bg-black hover:text-white overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative text-sm">{showAll ? 'Show Less' : 'Show All'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Activity Summary */}
      {summary && (
        <div className="p-6 border-b border-black">
          <h3 className="font-space-grotesk text-lg font-bold text-black mb-4">Activity Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-black">
            <div className="p-6 text-center border-r border-black" style={{ backgroundColor: '#6bdbff' }}>
              <div className="font-space-grotesk text-3xl font-bold text-black">{summary.chartActivities}</div>
              <div className="font-inter text-sm font-semibold text-black">CHART ACTIONS</div>
            </div>
            <div className="p-6 text-center border-r border-black md:border-r-0 lg:border-r" style={{ backgroundColor: '#51bd94' }}>
              <div className="font-space-grotesk text-3xl font-bold text-black">{summary.discussionActivities}</div>
              <div className="font-inter text-sm font-semibold text-black">DISCUSSION ACTIONS</div>
            </div>
            <div className="p-6 text-center" style={{ backgroundColor: '#ff91e9' }}>
              <div className="font-space-grotesk text-3xl font-bold text-black">{summary.eventActivities}</div>
              <div className="font-inter text-sm font-semibold text-black">EVENT ACTIONS</div>
            </div>
          </div>
        </div>
      )}

      {/* Activity List */}
      <div className="p-6">
        {recentActivities.length === 0 ? (
          <div className="text-center py-16" style={{ backgroundColor: '#f0e3ff' }}>
            <div className="w-16 h-16 bg-white border-2 border-black flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-space-grotesk text-xl font-bold text-black mb-2">No Activity Yet</h3>
            <p className="font-inter text-black/60">Start using the platform to see your activity timeline here</p>
          </div>
        ) : (
          <div className="space-y-0 border border-black">
            {(showAll ? recentActivities : recentActivities.slice(0, 5)).map((activity, index, array) => (
              <div 
                key={activity.id} 
                className={`relative p-6 hover:bg-gray-50 transition-all duration-300 group ${
                  index < array.length - 1 ? 'border-b border-black' : ''
                }`}
              >
                {/* Activity color indicator */}
                <div 
                  className="absolute left-0 top-6 w-1 h-8"
                  style={{ backgroundColor: getActivityColor(activity.activityType) }}
                />
                
                <div className="pl-6 flex items-start space-x-4">
                  {/* Activity Icon */}
                  <div 
                    className="w-8 h-8 border-2 border-black flex items-center justify-center text-black"
                    style={{ backgroundColor: getActivityColor(activity.activityType) }}
                  >
                    {getActivityIcon(activity.activityType)}
                  </div>

                  {/* Activity Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-inter text-base font-semibold text-black mb-2">
                      {activity.description}
                    </p>
                    <div className="flex items-center space-x-3">
                      <span className="px-2 py-1 bg-black text-white text-xs font-semibold border border-black">
                        {activity.activityType.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="font-inter text-sm text-black/60 font-medium">
                        {formatDate(activity.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Last Activity */}
      {summary?.lastActivity && (
        <div className="px-6 py-4 border-t border-black bg-gray-50">
          <p className="font-inter text-sm text-black/60">
            Last activity: <span className="font-semibold text-black">
              {new Date(summary.lastActivity).toLocaleDateString()} at {new Date(summary.lastActivity).toLocaleTimeString()}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}