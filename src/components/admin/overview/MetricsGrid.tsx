/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import MetricsCard from '../MetricsCard';

interface Trend {
  value: number;
  isPositive: boolean;
}

interface MetricData {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'indigo';
  trend: Trend;
}

interface MetricsGridProps {
  totalUsers: number;
  chartsGenerated: number;
  forumPosts: number;
  dailyVisitors: number;
  activeUsers: number;
  monthlyGrowth: number;
  eventsCount: number;
  trends: {
    newUsers: number;
    activeUsers: number;
    charts: number;
    posts: number;
    visitors: number;
    growth: number;
  };
  isLoading: boolean;
}

export default function MetricsGrid({
  totalUsers,
  chartsGenerated,
  forumPosts,
  dailyVisitors,
  activeUsers,
  monthlyGrowth,
  eventsCount,
  trends,
  isLoading
}: MetricsGridProps) {
  const metrics: MetricData[] = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      color: 'blue',
      trend: { value: trends.newUsers, isPositive: trends.newUsers > 0 }
    },
    {
      title: 'Charts Generated',
      value: chartsGenerated,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'green',
      trend: { value: trends.charts, isPositive: trends.charts > 0 }
    },
    {
      title: 'Forum Posts',
      value: forumPosts,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      color: 'purple',
      trend: { value: trends.posts, isPositive: trends.posts > 0 }
    },
    {
      title: 'Daily Visitors',
      value: dailyVisitors,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      color: 'yellow',
      trend: { value: trends.visitors, isPositive: trends.visitors > 0 }
    },
    {
      title: 'Active Users',
      value: activeUsers,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'indigo',
      trend: { value: trends.activeUsers, isPositive: trends.activeUsers > 0 }
    },
    {
      title: 'Monthly Growth',
      value: `${monthlyGrowth}%`,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: 'green',
      trend: { value: trends.growth, isPositive: trends.growth > 0 }
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
      {metrics.map((metric, index) => (
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
  );
}