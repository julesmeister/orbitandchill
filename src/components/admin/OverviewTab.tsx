import MetricsCard from './MetricsCard';
import GrowthChart from './charts/GrowthChart';
import SystemHealthChart from './charts/SystemHealthChart';
import ActivityTimelineChart from './charts/ActivityTimelineChart';

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
  usageStats: {
    activeUsers: number;
    eventsPerUser: number;
  };
}

interface SiteMetrics {
  totalUsers: number;
  activeUsers: number;
  chartsGenerated: number;
  forumPosts: number;
  dailyVisitors: number;
  monthlyGrowth: number;
  events?: EventsAnalytics | null;
}

interface HealthMetrics {
  status: 'healthy' | 'degraded' | 'down';
  uptime: number;
  uptimePercentage: string;
  lastChecked: string;
  database: {
    status: 'connected' | 'disconnected' | 'error';
    responseTime?: number;
  };
  api: {
    status: 'operational' | 'slow' | 'error';
    responseTime?: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
}

interface NotificationSummary {
  total: number;
  unread: number;
  hasHigh: boolean;
  recent: Array<{
    id: string;
    type: 'new_user' | 'new_discussion' | 'system_alert' | 'high_activity' | 'error';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    priority: 'low' | 'medium' | 'high';
    actionUrl?: string;
  }>;
}

interface OverviewTabProps {
  siteMetrics: SiteMetrics;
  healthMetrics: HealthMetrics | null;
  notifications: NotificationSummary | null;
  isLoading: boolean;
}

export default function OverviewTab({ siteMetrics, healthMetrics, notifications, isLoading }: OverviewTabProps) {
  const metricsData = [
    {
      title: 'Total Users',
      value: siteMetrics.totalUsers,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      color: 'blue' as const,
      trend: { value: 12, isPositive: true }
    },
    {
      title: 'Charts Generated',
      value: siteMetrics.chartsGenerated,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'green' as const,
      trend: { value: 8, isPositive: true }
    },
    {
      title: 'Forum Posts',
      value: siteMetrics.forumPosts,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      color: 'purple' as const,
      trend: { value: 15, isPositive: true }
    },
    {
      title: 'Daily Visitors',
      value: siteMetrics.dailyVisitors,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      color: 'yellow' as const,
      trend: { value: 5, isPositive: true }
    },
    {
      title: 'Active Users',
      value: siteMetrics.activeUsers,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'indigo' as const,
      trend: { value: 22, isPositive: true }
    },
    {
      title: 'Monthly Growth',
      value: `${siteMetrics.monthlyGrowth}%`,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: 'green' as const,
      trend: { value: 3, isPositive: true }
    },
    {
      title: 'Astrological Events',
      value: siteMetrics.events?.totalEvents || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'purple' as const,
      trend: { value: siteMetrics.events?.eventsThisMonth || 0, isPositive: true }
    }
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Metrics Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
        {metricsData.map((metric, index) => (
          <div key={index} className="xl:col-span-1">
            <MetricsCard
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              color={metric.color}
              trend={metric.trend}
              isLoading={isLoading}
            />
          </div>
        ))}
      </div>

      {/* Growth Chart - Full Width */}
      <div className="bg-white border border-black p-4 sm:p-6 lg:p-8">
        <GrowthChart isLoading={isLoading} />
      </div>

      {/* Other Charts Section - Better medium screen layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6">

        {/* Events Analytics */}
        <div className="bg-white border border-black p-4 sm:p-6 lg:p-8">
          <h3 className="font-space-grotesk text-base sm:text-lg font-bold text-black mb-4 sm:mb-6">Events Analytics</h3>
          {siteMetrics.events ? (
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between p-3 sm:p-4 border border-black" style={{ backgroundColor: '#6bdbff' }}>
                <span className="font-inter text-xs sm:text-sm font-medium text-black">Events This Month</span>
                <span className="font-inter text-xs sm:text-sm font-bold text-black">{siteMetrics.events.eventsThisMonth}</span>
              </div>
              <div className="flex items-center justify-between p-3 sm:p-4 border border-black" style={{ backgroundColor: '#51bd94' }}>
                <span className="font-inter text-xs sm:text-sm font-medium text-black">Benefic Events</span>
                <span className="font-inter text-xs sm:text-sm font-bold text-black">{siteMetrics.events.eventsByType.benefic}</span>
              </div>
              <div className="flex items-center justify-between p-3 sm:p-4 border border-black" style={{ backgroundColor: '#ff91e9' }}>
                <span className="font-inter text-xs sm:text-sm font-medium text-black">Generated vs Manual</span>
                <span className="font-inter text-xs sm:text-sm font-bold text-black">{siteMetrics.events.generationStats.generated}/{siteMetrics.events.generationStats.manual}</span>
              </div>
              <div className="flex items-center justify-between p-3 sm:p-4 border border-black" style={{ backgroundColor: '#f2e356' }}>
                <span className="font-inter text-xs sm:text-sm font-medium text-black">Average Score</span>
                <span className="font-inter text-xs sm:text-sm font-bold text-black">{siteMetrics.events.engagementStats.averageScore}/10</span>
              </div>
            </div>
          ) : (
            <div className="p-3 sm:p-4 border border-black bg-gray-50">
              <p className="font-inter text-xs sm:text-sm text-black/60">No events data available</p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white border border-black p-4 sm:p-6 lg:p-8">
          <h3 className="font-space-grotesk text-base sm:text-lg font-bold text-black mb-4 sm:mb-6">Quick Stats</h3>
          <div className="space-y-3 sm:space-y-4">
            {[
              { label: 'Average Charts per User', value: '3.2', color: '#6bdbff' },
              { label: 'Most Active Time', value: '2-4 PM', color: '#51bd94' },
              { label: 'Top Location', value: 'United States', color: '#ff91e9' },
              { label: 'Avg. Session Duration', value: '8m 32s', color: '#f2e356' }
            ].map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-3 sm:p-4 border border-black" style={{ backgroundColor: stat.color }}>
                <span className="font-inter text-xs sm:text-sm font-medium text-black">{stat.label}</span>
                <span className="font-inter text-xs sm:text-sm font-bold text-black">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* System Health Chart */}
        <SystemHealthChart healthMetrics={healthMetrics || undefined} isLoading={isLoading} />
        
        {/* Performance Metrics */}
        <div className="bg-white border border-black p-4 sm:p-6">
          <h3 className="font-space-grotesk text-base sm:text-lg font-bold text-black mb-3 sm:mb-4">Performance Overview</h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between p-2.5 sm:p-3 border border-black">
              <span className="font-inter text-xs sm:text-sm text-black">Avg. Response Time</span>
              <span className="font-space-grotesk text-xs sm:text-sm font-bold text-black">
                {healthMetrics?.api.responseTime ? `${healthMetrics.api.responseTime}ms` : '< 100ms'}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 sm:p-3 border border-black">
              <span className="font-inter text-xs sm:text-sm text-black">Database Queries</span>
              <span className="font-space-grotesk text-xs sm:text-sm font-bold text-black">
                {healthMetrics?.database.responseTime ? `${healthMetrics.database.responseTime}ms` : '< 50ms'}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 sm:p-3 border border-black">
              <span className="font-inter text-xs sm:text-sm text-black">Memory Usage</span>
              <span className="font-space-grotesk text-xs sm:text-sm font-bold text-black">
                {healthMetrics?.memory ? `${healthMetrics.memory.percentage.toFixed(1)}%` : '45.2%'}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 sm:p-3 border border-black">
              <span className="font-inter text-xs sm:text-sm text-black">Active Connections</span>
              <span className="font-space-grotesk text-xs sm:text-sm font-bold text-black">
                {siteMetrics.activeUsers || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* System Health Status */}
      {healthMetrics && (
        <div className="bg-white border border-black p-8">
          <h3 className="font-space-grotesk text-lg font-bold text-black mb-6">System Health</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Overall Status */}
            <div className="p-4 border border-black" style={{ 
              backgroundColor: healthMetrics.status === 'healthy' ? '#51bd94' : 
                             healthMetrics.status === 'degraded' ? '#f2e356' : '#ff6b6b' 
            }}>
              <div className="text-center">
                <div className="font-inter text-sm font-bold text-black">
                  {healthMetrics.status.toUpperCase()}
                </div>
                <div className="font-inter text-xs text-black/60">System Status</div>
              </div>
            </div>

            {/* Database Status */}
            <div className="p-4 border border-black" style={{ 
              backgroundColor: healthMetrics.database.status === 'connected' ? '#51bd94' : '#ff6b6b' 
            }}>
              <div className="text-center">
                <div className="font-inter text-sm font-bold text-black">
                  {healthMetrics.database.status.toUpperCase()}
                </div>
                <div className="font-inter text-xs text-black/60">
                  Database {healthMetrics.database.responseTime ? `(${healthMetrics.database.responseTime}ms)` : ''}
                </div>
              </div>
            </div>

            {/* Memory Usage */}
            <div className="p-4 border border-black" style={{ 
              backgroundColor: healthMetrics.memory.percentage > 80 ? '#ff6b6b' : 
                             healthMetrics.memory.percentage > 60 ? '#f2e356' : '#51bd94' 
            }}>
              <div className="text-center">
                <div className="font-inter text-sm font-bold text-black">
                  {healthMetrics.memory.percentage.toFixed(1)}%
                </div>
                <div className="font-inter text-xs text-black/60">Memory Usage</div>
              </div>
            </div>

            {/* Uptime */}
            <div className="p-4 border border-black" style={{ 
              backgroundColor: parseFloat(healthMetrics.uptimePercentage) > 99 ? '#51bd94' : 
                             parseFloat(healthMetrics.uptimePercentage) > 95 ? '#f2e356' : '#ff6b6b' 
            }}>
              <div className="text-center">
                <div className="font-inter text-sm font-bold text-black">
                  {healthMetrics.uptimePercentage}%
                </div>
                <div className="font-inter text-xs text-black/60">Uptime</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 border border-black bg-gray-50">
            <p className="font-inter text-xs text-black/60">
              Last checked: {new Date(healthMetrics.lastChecked).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Activity Timeline - Full Width */}
      <ActivityTimelineChart 
        activities={notifications?.recent.map(notification => ({
          id: notification.id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          timestamp: notification.timestamp,
          priority: notification.priority
        }))}
        isLoading={isLoading}
      />
    </div>
  );
}