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
      
      // Return metrics even if success is false (graceful degradation)
      if (data.metrics) {
        return data.metrics;
      } else {
        console.warn('No metrics data returned:', data.error || 'Unknown error');
        return {
          totalUsers: 0,
          activeUsers: 0,
          chartsGenerated: 0,
          forumPosts: 0,
          dailyVisitors: 0,
          monthlyGrowth: 0,
        };
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
      
      // Return userAnalytics array even if success is false (graceful degradation)
      if (data.userAnalytics) {
        return data.userAnalytics;
      } else {
        console.warn('No user analytics data returned:', data.error || 'Unknown error');
        return [];
      }
    } catch (error) {
      // Return empty data instead of fallback
      console.error('Failed to fetch user analytics:', error);
      return [];
    }
  },

  async getTrafficData(token?: string): Promise<TrafficData[]> {
    try {
      const response = await fetch('/api/admin/traffic-data', {
        headers: getAuthHeaders(token),
      });
      const data = await response.json();
      
      // Return trafficData array even if success is false (graceful degradation)
      if (data.trafficData) {
        return data.trafficData;
      } else {
        console.warn('No traffic data returned:', data.error || 'Unknown error');
        return [];
      }
    } catch (error) {
      // Return empty data instead of fallback
      console.error('Failed to fetch traffic data:', error);
      return [];
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
  async getAll(options: {
    page?: number;
    limit?: number;
    category?: string;
    sortBy?: string;
    filter?: string;
    search?: string;
    cacheBuster?: string;
  } = {}): Promise<any> {
    const {
      page = 1,
      limit = 10, // Server-side pagination - only load current page
      category,
      sortBy = 'recent',
      filter,
      search,
      cacheBuster = ''
    } = options;
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      drafts: 'false'
    });
    
    if (category && category !== 'All Categories') {
      params.append('category', category);
    }
    
    if (filter === 'forum') {
      params.append('isBlogPost', 'false');
    } else if (filter === 'blog') {
      params.append('isBlogPost', 'true');
    }
    
    if (cacheBuster) {
      params.append('_t', Date.now().toString());
    }
    
    const response = await fetch(`/api/discussions?${params.toString()}`);
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