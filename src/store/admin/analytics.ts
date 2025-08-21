/* eslint-disable @typescript-eslint/no-explicit-any */

// ⚠️ DEPRECATED - Custom analytics replaced with Google Analytics
// This file is kept for backwards compatibility only
// Use Google Analytics for all tracking needs

import type { SiteMetrics, UserAnalytics, TrafficData, HealthMetrics, NotificationSummary } from './types';
import { analyticsApi } from './api';

/**
 * DEPRECATED: Analytics slice for admin store
 * Now using Google Analytics instead of custom tracking
 */
export const createAnalyticsSlice = (set: any, get: any) => ({
  // Analytics state
  siteMetrics: {
    totalUsers: 0,
    activeUsers: 0,
    chartsGenerated: 0,
    forumPosts: 0,
    dailyVisitors: 0,
    monthlyGrowth: 0,
  } as SiteMetrics,
  userAnalytics: [] as UserAnalytics[],
  trafficData: [] as TrafficData[],
  healthMetrics: null as HealthMetrics | null,
  notifications: null as NotificationSummary | null,

  // Analytics actions
  refreshMetrics: async (): Promise<void> => {
    set({ isLoading: true });

    try {
      const { authToken } = get();
      const siteMetrics = await analyticsApi.getSiteMetrics(authToken || undefined);
      
      set({
        siteMetrics,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  loadUserAnalytics: async (): Promise<void> => {
    set({ isLoading: true });

    try {
      const { authToken } = get();
      const userAnalytics = await analyticsApi.getUserAnalytics(authToken || undefined);
      
      set({
        userAnalytics,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  loadTrafficData: async (): Promise<void> => {
    set({ isLoading: true });

    try {
      const { authToken } = get();
      const trafficData = await analyticsApi.getTrafficData(authToken || undefined);
      
      set({
        trafficData,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  loadHealthMetrics: async (): Promise<void> => {
    try {
      const healthMetrics = await analyticsApi.getHealthMetrics();
      set({ healthMetrics });
    } catch (error) {
      set({ healthMetrics: null });
    }
  },

  loadNotifications: async (): Promise<void> => {
    try {
      const notifications = await analyticsApi.getNotifications();
      set({ notifications });
    } catch (error) {
      set({ notifications: null });
    }
  },
});