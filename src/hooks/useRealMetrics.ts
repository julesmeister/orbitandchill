/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo, useEffect, useState } from 'react';

interface UserAnalytics {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  lastActive: string;
  chartsGenerated: number;
  forumPosts: number;
  isAnonymous: boolean;
}

interface TrafficData {
  date: string;
  visitors: number;
  pageViews: number;
  chartsGenerated: number;
}

interface Thread {
  id: string;
  title: string;
  isBlogPost: boolean;
  isPublished: boolean;
  views: number;
  likes: number;
}

interface RealMetrics {
  totalUsers: number;
  activeUsers: number;
  chartsGenerated: number;
  forumPosts: number;
  dailyVisitors: number;
  monthlyGrowth: number;
  newUsersThisMonth: number;
  avgChartsPerUser: string;
  totalPageViews: number;
  conversionRate: string;
}

interface NatalChartsData {
  total: number;
  thisMonth: number;
  thisWeek: number;
  byType: {
    natal: number;
    transit: number;
    synastry: number;
    composite: number;
    horary: number;
  };
}

interface UserActivityData {
  totalUsers: number;
  newThisMonth: number;
  newLastMonth: number;
  activeUsers: number;
  usersWithCharts: number;
}

export function useRealMetrics(
  userAnalytics: UserAnalytics[],
  trafficData: TrafficData[],
  threads: Thread[]
): RealMetrics {
  const [chartsData, setChartsData] = useState<NatalChartsData | null>(null);
  const [realUserData, setRealUserData] = useState<UserActivityData | null>(null);

  // Fetch real chart data from natal_charts table
  useEffect(() => {
    const fetchChartsData = async () => {
      try {
        const response = await fetch('/api/admin/charts-analytics');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setChartsData(result.data);
          }
        }
      } catch (error) {
        console.warn('Failed to fetch real charts data:', error);
      }
    };

    const fetchRealUserData = async () => {
      try {
        const response = await fetch('/api/admin/real-user-analytics');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setRealUserData(result.data);
          }
        }
      } catch (error) {
        console.warn('Failed to fetch real user data:', error);
      }
    };

    fetchChartsData();
    fetchRealUserData();
  }, []);

  return useMemo(() => {
    // Use real data when available, fallback to existing calculations
    const totalUsers = realUserData?.totalUsers || userAnalytics.length;
    const forumPosts = threads.length;
    
    // Active users (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const activeUsers = realUserData?.activeUsers || userAnalytics.filter(u => {
      const lastActive = new Date(u.lastActive);
      return lastActive > thirtyDaysAgo;
    }).length;
    
    // ENHANCED: Charts generated from real database
    let chartsGenerated = 0;
    if (chartsData) {
      // Use real natal_charts table data
      chartsGenerated = chartsData.total;
    } else {
      // Fallback to existing calculation
      const userChartCounts = userAnalytics.reduce((sum, u) => sum + (u.chartsGenerated || 0), 0);
      const trafficChartCounts = trafficData.reduce((sum, d) => sum + (d.chartsGenerated || 0), 0);
      chartsGenerated = Math.max(userChartCounts, trafficChartCounts);
    }
    
    // Daily visitors (most recent day)
    const dailyVisitors = trafficData.length > 0 ? 
      trafficData[trafficData.length - 1]?.visitors || 0 : 0;
    
    // Total page views
    const totalPageViews = trafficData.reduce((sum, d) => sum + (d.pageViews || 0), 0);
    
    // ENHANCED: Monthly growth using real user data
    let monthlyGrowth = 0;
    let thisMonthUsers = 0;
    
    if (realUserData) {
      // Use real database counts
      thisMonthUsers = realUserData.newThisMonth;
      const lastMonthUsers = realUserData.newLastMonth;
      
      if (lastMonthUsers > 0) {
        monthlyGrowth = Math.round(((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100);
      } else if (thisMonthUsers > 0) {
        monthlyGrowth = 100;
      }
    } else {
      // Fallback to existing calculation
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      thisMonthUsers = userAnalytics.filter(u => {
        const joinDate = new Date(u.joinDate);
        return joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear;
      }).length;
      
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const lastMonthUsers = userAnalytics.filter(u => {
        const joinDate = new Date(u.joinDate);
        return joinDate.getMonth() === lastMonth && joinDate.getFullYear() === lastMonthYear;
      }).length;
      
      if (lastMonthUsers > 0) {
        monthlyGrowth = Math.round(((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100);
      } else if (thisMonthUsers > 0) {
        monthlyGrowth = 100;
      }
    }
    
    // Enhanced stats with better calculations
    const avgChartsPerUser = totalUsers > 0 ? 
      (chartsGenerated / totalUsers).toFixed(1) : '0.0';
    
    // More realistic conversion rate (users who generated at least one chart)
    const usersWithCharts = realUserData?.usersWithCharts || 
      userAnalytics.filter(u => (u.chartsGenerated || 0) > 0).length;
    const conversionRate = totalUsers > 0 ? 
      Math.round((usersWithCharts / totalUsers) * 100) + '%' : '0%';
    
    return {
      totalUsers,
      activeUsers,
      chartsGenerated,
      forumPosts,
      dailyVisitors,
      monthlyGrowth,
      newUsersThisMonth: thisMonthUsers,
      avgChartsPerUser,
      totalPageViews,
      conversionRate
    };
  }, [userAnalytics, trafficData, threads, chartsData, realUserData]);
}