/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo, useEffect, useState } from 'react';
import { TrafficData } from '@/store/admin/types';
import { getDailyVisitors, getTotalPageViews, getTotalChartsFromTraffic } from '@/utils/trafficDataUtils';

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
  avgChartsPerUser?: string;
  totalPageViews: number;
  conversionRate?: string;
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
  totalThreads: number
): RealMetrics {
  const [chartsData, setChartsData] = useState<NatalChartsData | null>(null);
  const [realUserData, setRealUserData] = useState<UserActivityData | null>(null);

  // Fetch real chart data from natal_charts table
  useEffect(() => {
    let isMounted = true;

    const fetchChartsData = async () => {
      if (!isMounted) return;
      try {
        const response = await fetch('/api/admin/charts-analytics');
        if (response.ok && isMounted) {
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
      if (!isMounted) return;
      try {
        const response = await fetch('/api/admin/real-user-analytics');
        if (response.ok && isMounted) {
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

    return () => {
      isMounted = false;
    };
  }, []);

  return useMemo(() => {
    // Use real data only, show 0 during loading instead of undefined
    const totalUsers = realUserData?.totalUsers ?? 0;
    const forumPosts = totalThreads || 0;
    
    // Active users (last 30 days) - show 0 during loading instead of undefined
    const activeUsers = realUserData?.activeUsers ?? 0;
    
    // ENHANCED: Charts generated from real database only
    const chartsGenerated = chartsData?.total ?? 0;
    
    // Daily visitors from real traffic data only
    const dailyVisitors = trafficData.length > 0 ? getDailyVisitors(trafficData) : 0;
    
    // Total page views from real traffic data only  
    const totalPageViews = trafficData.length > 0 ? getTotalPageViews(trafficData) : 0;
    
    // ENHANCED: Monthly growth using real user data only
    let monthlyGrowth = 0;
    let thisMonthUsers = 0;
    
    if (realUserData) {
      // Use real database counts only
      thisMonthUsers = realUserData.newThisMonth;
      const lastMonthUsers = realUserData.newLastMonth;
      
      if (lastMonthUsers > 0) {
        monthlyGrowth = Math.round(((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100);
      } else if (thisMonthUsers > 0) {
        monthlyGrowth = 100;
      }
    }
    // No fallback calculations - wait for real data
    
    // Enhanced stats with better calculations
    const avgChartsPerUser = (totalUsers && totalUsers > 0) ? 
      (chartsGenerated / totalUsers).toFixed(1) : undefined;
    
    // More realistic conversion rate (users who generated at least one chart)
    const usersWithCharts = realUserData?.usersWithCharts;
    const conversionRate = (totalUsers && usersWithCharts && totalUsers > 0) ? 
      Math.round((usersWithCharts / totalUsers) * 100) + '%' : undefined;
    
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
  }, [userAnalytics, trafficData, totalThreads, chartsData, realUserData]);
}