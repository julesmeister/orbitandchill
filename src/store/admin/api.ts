/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Admin API service layer
 * Centralizes all API calls for the admin store
 */

import type { SiteMetrics, UserAnalytics, TrafficData, HealthMetrics, NotificationSummary, AdminSetting, CreateThreadData, Thread, ApiResponse } from './types';

// Helper function to get authenticated headers
export const getAuthHeaders = (token?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

// Authentication API
export const authApi = {
  async login(email: string, adminKey: string): Promise<any> {
    const response = await fetch('/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, adminKey }),
    });
    return response.json();
  },

  async logout(token: string): Promise<void> {
    await fetch('/api/admin/auth/logout', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async verify(token: string): Promise<any> {
    const response = await fetch('/api/admin/auth/verify', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  async masterLogin(userId: string, email: string): Promise<any> {
    const response = await fetch('/api/admin/auth/master-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, email }),
    });
    return response.json();
  }
};

// Analytics API
export const analyticsApi = {
  async getSiteMetrics(token?: string): Promise<SiteMetrics> {
    try {
      const response = await fetch('/api/admin/metrics', {
        headers: getAuthHeaders(token),
      });
      const data = await response.json();
      
      if (data.success && data.metrics) {
        return data.metrics;
      } else {
        throw new Error(data.error || 'API returned no metrics');
      }
    } catch (error) {
      return {
        totalUsers: 0,
        activeUsers: 0,
        chartsGenerated: 0,
        forumPosts: 0,
        dailyVisitors: 0,
        monthlyGrowth: 0,
      };
    }
  },

  async getUserAnalytics(token?: string): Promise<UserAnalytics[]> {
    try {
      const response = await fetch('/api/admin/user-analytics', {
        headers: getAuthHeaders(token),
      });
      const data = await response.json();
      
      if (data.success && data.userAnalytics) {
        return data.userAnalytics;
      } else {
        throw new Error(data.error || 'API returned no user analytics');
      }
    } catch (error) {
      // Fallback to mock data
      const users = [];
      const baseDate = new Date('2024-01-01').getTime();
      for (let i = 0; i < 20; i++) {
        users.push({
          id: `user_${i + 1}`,
          name: i % 3 === 0 ? "" : `User ${i + 1}`,
          email: `user${i + 1}@example.com`,
          joinDate: new Date(baseDate + (i * 7 * 24 * 60 * 60 * 1000)).toISOString(),
          lastActive: new Date(baseDate + (i * 24 * 60 * 60 * 1000)).toISOString(),
          chartsGenerated: (i % 5) + 1,
          forumPosts: i % 10,
          isAnonymous: i % 3 === 0,
        });
      }
      return users;
    }
  },

  async getTrafficData(token?: string): Promise<TrafficData[]> {
    try {
      const response = await fetch('/api/admin/traffic-data', {
        headers: getAuthHeaders(token),
      });
      const data = await response.json();
      
      if (data.success && data.trafficData) {
        return data.trafficData;
      } else {
        throw new Error(data.error || 'API returned no traffic data');
      }
    } catch (error) {
      // Fallback to deterministic mock data
      const data = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const dayOfYear = Math.floor((Date.now() - i * 24 * 60 * 60 * 1000) / (24 * 60 * 60 * 1000)) % 365;
        
        data.push({
          date,
          visitors: 50 + (dayOfYear % 200),
          pageViews: 150 + (dayOfYear % 500), 
          chartsGenerated: 5 + (dayOfYear % 50),
        });
      }
      return data;
    }
  },

  async getHealthMetrics(): Promise<HealthMetrics | null> {
    try {
      const response = await fetch('/api/admin/health');
      const data = await response.json();
      
      if (data.success && data.health) {
        return data.health;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  },

  async getNotifications(): Promise<NotificationSummary | null> {
    try {
      const response = await fetch('/api/admin/notifications');
      const data = await response.json();
      
      if (data.success && data.notifications) {
        return data.notifications;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }
};

// Threads API
export const threadsApi = {
  async getAll(): Promise<any> {
    const response = await fetch('/api/discussions?limit=100&sortBy=recent');
    return response.json();
  },

  async create(threadData: CreateThreadData): Promise<any> {
    const response = await fetch('/api/discussions/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: threadData.title,
        excerpt: threadData.excerpt,
        content: threadData.content,
        authorId: threadData.authorId,
        authorName: threadData.authorName,
        category: threadData.category,
        tags: threadData.tags,
        slug: threadData.slug,
        isBlogPost: threadData.isBlogPost,
        isPublished: threadData.isPublished,
      })
    });
    return response.json();
  },

  async update(id: string, updates: Partial<Thread>): Promise<any> {
    const response = await fetch(`/api/discussions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return response.json();
  },

  async delete(id: string): Promise<any> {
    const response = await fetch(`/api/discussions/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  }
};

// Settings API
export const settingsApi = {
  async getAll(category?: string): Promise<any> {
    const params = new URLSearchParams();
    if (category && category !== 'all') {
      params.set('category', category);
    }

    const response = await fetch(`/api/admin/settings?${params}`);
    return response.json();
  },

  async update(settings: Record<string, any>): Promise<any> {
    const response = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update',
        settings,
        adminUsername: 'Admin User',
        adminUserId: 'admin'
      })
    });
    return response.json();
  },

  async reset(category?: string): Promise<any> {
    const response = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'reset',
        category: category === 'all' ? undefined : category,
        adminUsername: 'Admin User',
        adminUserId: 'admin'
      })
    });
    return response.json();
  }
};