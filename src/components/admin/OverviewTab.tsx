/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { useRealMetrics } from '@/hooks/useRealMetrics';
import MetricsGrid from './overview/MetricsGrid';
import QuickStats from './overview/QuickStats';
import EventsAnalyticsCard from './overview/EventsAnalytics';
import PerformanceSection from './overview/PerformanceSection';
import GrowthChart from './charts/GrowthChart';
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
  const { threads, userAnalytics, trafficData, loadThreads, loadUserAnalytics, loadTrafficData } = useAdminStore();
  
  useEffect(() => {
    // Only load data if not already loaded - AdminDashboard handles initial loading
    if (userAnalytics.length === 0) {
      loadUserAnalytics(); 
    }
    if (trafficData.length === 0) {
      loadTrafficData();
    }
  }, []); // Empty dependency array - only run once on mount
  
  const realMetrics = useRealMetrics(userAnalytics, trafficData, threads);
  
  const trends = {
    newUsers: realMetrics.newUsersThisMonth,
    activeUsers: realMetrics.activeUsers,
    charts: realMetrics.chartsGenerated,
    posts: realMetrics.forumPosts,
    visitors: realMetrics.dailyVisitors,
    growth: realMetrics.monthlyGrowth
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <MetricsGrid
        totalUsers={realMetrics.totalUsers}
        chartsGenerated={realMetrics.chartsGenerated}
        forumPosts={realMetrics.forumPosts}
        dailyVisitors={realMetrics.dailyVisitors}
        activeUsers={realMetrics.activeUsers}
        monthlyGrowth={realMetrics.monthlyGrowth}
        eventsCount={siteMetrics.events?.totalEvents || 0}
        trends={trends}
        isLoading={isLoading}
      />

      <div className="bg-white border border-black p-4 sm:p-6 lg:p-8">
        <GrowthChart isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <EventsAnalyticsCard events={siteMetrics.events} />
        <QuickStats
          avgChartsPerUser={realMetrics.avgChartsPerUser}
          totalPageViews={realMetrics.totalPageViews}
          conversionRate={realMetrics.conversionRate}
        />
      </div>

      <PerformanceSection
        healthMetrics={healthMetrics}
        activeUsers={realMetrics.activeUsers}
        isLoading={isLoading}
      />

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