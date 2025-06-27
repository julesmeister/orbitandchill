/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";

// Simulated data interfaces
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
  content: string;
  excerpt: string;
  authorId: string;
  authorName: string;
  isBlogPost: boolean;
  isPublished: boolean;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  views: number;
  likes: number;
  comments: number;
  upvotes: number;
  downvotes: number;
  replies: number;
  featuredImage?: string;
  category: string;
}

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

interface TrafficData {
  date: string;
  visitors: number;
  pageViews: number;
  chartsGenerated: number;
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

interface AdminSetting {
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  category: string;
  description?: string;
  isRequired?: boolean;
  defaultValue?: any;
  updatedAt: Date;
  updatedBy?: string;
}

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  permissions: string[];
}

interface AdminState {
  // Real authentication
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  authToken: string | null;
  authLoading: boolean;

  // Analytics data
  siteMetrics: SiteMetrics;
  userAnalytics: UserAnalytics[];
  trafficData: TrafficData[];
  threads: Thread[];

  // System monitoring
  healthMetrics: HealthMetrics | null;
  notifications: NotificationSummary | null;

  // Admin settings
  adminSettings: AdminSetting[];
  settingsCategories: Array<{ category: string; count: number }>;

  // Loading states
  isLoading: boolean;

  // Authentication actions
  login: (email: string, adminKey: string) => Promise<boolean>;
  logout: () => Promise<void>;
  verifyAuth: () => Promise<boolean>;
  initializeAuth: () => void;
  checkCurrentUserAdmin: () => Promise<boolean>;
  refreshMetrics: () => Promise<void>;
  loadUserAnalytics: () => Promise<void>;
  loadTrafficData: () => Promise<void>;
  loadThreads: () => Promise<void>;
  loadHealthMetrics: () => Promise<void>;
  loadNotifications: () => Promise<void>;
  createThread: (
    thread: Omit<
      Thread,
      "id" | "createdAt" | "updatedAt" | "views" | "likes" | "comments" | "upvotes" | "downvotes" | "replies"
    >
  ) => Promise<void>;
  updateThread: (id: string, updates: Partial<Thread>) => Promise<void>;
  deleteThread: (id: string) => Promise<void>;
  
  // Admin settings actions
  loadAdminSettings: (category?: string) => Promise<void>;
  updateAdminSettings: (settings: Record<string, any>) => Promise<void>;
  resetAdminSettings: (category?: string) => Promise<void>;
  getAdminSetting: (key: string) => AdminSetting | null;
}

// Helper function to get authenticated headers
const getAuthHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

// Real data generators using API endpoints
const calculateSiteMetrics = async (token?: string): Promise<SiteMetrics> => {
  try {
    // Fetching real site metrics from API
    
    const response = await fetch('/api/admin/metrics', {
      headers: getAuthHeaders(token),
    });
    const data = await response.json();
    
    if (data.success && data.metrics) {
      // Site metrics fetched from API
      return data.metrics;
    } else {
      throw new Error(data.error || 'API returned no metrics');
    }
  } catch (error) {
    console.warn('Failed to fetch real site metrics from API, using fallback:', error);
    // Return zeros instead of mock data
    return {
      totalUsers: 0,
      activeUsers: 0,
      chartsGenerated: 0,
      forumPosts: 0,
      dailyVisitors: 0,
      monthlyGrowth: 0,
    };
  }
};

const generateUserAnalytics = async (token?: string): Promise<UserAnalytics[]> => {
  try {
    // Fetching real user analytics from API
    
    const response = await fetch('/api/admin/user-analytics', {
      headers: getAuthHeaders(token),
    });
    const data = await response.json();
    
    if (data.success && data.userAnalytics) {
      // User analytics fetched from API
      return data.userAnalytics;
    } else {
      throw new Error(data.error || 'API returned no user analytics');
    }
  } catch (error) {
    console.warn('Failed to load real user analytics from API, using mock data:', error);
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
};

const generateTrafficData = async (token?: string): Promise<TrafficData[]> => {
  try {
    // Fetching real traffic data from API
    
    const response = await fetch('/api/admin/traffic-data', {
      headers: getAuthHeaders(token),
    });
    const data = await response.json();
    
    if (data.success && data.trafficData) {
      // Traffic data fetched from API
      return data.trafficData;
    } else {
      throw new Error(data.error || 'API returned no traffic data');
    }
  } catch (error) {
    console.warn('Failed to load real traffic data from API, using mock data:', error);
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
};

const generateThreads = (): Thread[] => {
  // Return empty array - no mock data
  return [];
};

export const useAdminStore: any = create<AdminState>((set, get) => ({
  // Initial state - NOT authenticated by default
  isAuthenticated: false,
  adminUser: null,
  authToken: null,
  authLoading: false,
  siteMetrics: {
    totalUsers: 0,
    activeUsers: 0,
    chartsGenerated: 0,
    forumPosts: 0,
    dailyVisitors: 0,
    monthlyGrowth: 0,
  },
  userAnalytics: [],
  trafficData: [],
  threads: [],
  healthMetrics: null,
  notifications: null,
  adminSettings: [],
  settingsCategories: [],
  isLoading: false,

  // Authentication actions
  initializeAuth: () => {
    if (typeof window !== 'undefined') {
      // First check if current user is master admin
      setTimeout(async () => {
        const isAdmin = await get().checkCurrentUserAdmin();
        if (!isAdmin) {
          // If not master admin, check for stored admin token
          const token = localStorage.getItem('admin_token');
          if (token) {
            set({ authToken: token });
            // Verify token
            get().verifyAuth();
          }
        }
      }, 0);
    }
  },

  login: async (email: string, adminKey: string) => {
    set({ authLoading: true });

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, adminKey }),
      });

      const data = await response.json();

      if (data.success && data.token && data.user) {
        // Store token in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_token', data.token);
        }

        set({
          isAuthenticated: true,
          adminUser: data.user,
          authToken: data.token,
          authLoading: false,
        });

        console.log('✅ Admin login successful:', data.user.username);
        return true;
      } else {
        console.error('❌ Admin login failed:', data.error);
        set({ authLoading: false });
        return false;
      }
    } catch (error) {
      console.error('❌ Admin login error:', error);
      set({ authLoading: false });
      return false;
    }
  },

  logout: async () => {
    const { authToken } = get();
    
    if (authToken) {
      try {
        await fetch('/api/admin/auth/logout', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        });
      } catch (error) {
        console.error('Logout API error:', error);
      }
    }

    // Clear local state
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
    }

    set({
      isAuthenticated: false,
      adminUser: null,
      authToken: null,
    });

    // Redirect to home page
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  },

  verifyAuth: async () => {
    const { authToken } = get();
    
    if (!authToken) {
      set({ isAuthenticated: false, adminUser: null });
      return false;
    }

    try {
      const response = await fetch('/api/admin/auth/verify', {
        headers: { 'Authorization': `Bearer ${authToken}` },
      });

      const data = await response.json();

      if (data.success && data.user) {
        set({
          isAuthenticated: true,
          adminUser: data.user,
        });
        return true;
      } else {
        // Token invalid, clear auth
        if (typeof window !== 'undefined') {
          localStorage.removeItem('admin_token');
        }
        set({
          isAuthenticated: false,
          adminUser: null,
          authToken: null,
        });
        return false;
      }
    } catch (error) {
      console.error('Auth verification error:', error);
      set({
        isAuthenticated: false,
        adminUser: null,
        authToken: null,
      });
      return false;
    }
  },

  checkCurrentUserAdmin: async () => {
    // Import here to avoid circular dependency
    const { useUserStore } = await import('@/store/userStore');
    const currentUser = useUserStore.getState().user;
    
    if (!currentUser || !currentUser.email) {
      return false;
    }

    // Master admin account - orbitandchill@gmail.com
    const MASTER_ADMIN_EMAIL = 'orbitandchill@gmail.com';
    
    // Check if current user is the master admin
    if (currentUser.email === MASTER_ADMIN_EMAIL) {
      try {
        // Generate a proper JWT token for master admin that will work with admin auth middleware
        const response = await fetch('/api/admin/auth/master-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUser.id, email: currentUser.email }),
        });

        const data = await response.json();

        if (data.success && data.token) {
          const adminUser: AdminUser = {
            id: currentUser.id,
            username: currentUser.username || 'Master Admin',
            email: currentUser.email,
            role: 'master_admin',
            permissions: ['all'] // Master admin has all permissions
          };

          set({
            isAuthenticated: true,
            adminUser: adminUser,
            authToken: data.token, // Use proper JWT token
            authLoading: false,
          });

          // Master admin automatically authenticated with JWT token
          return true;
        } else {
          console.error('❌ Failed to generate master admin token:', data.error);
          return false;
        }
      } catch (error) {
        console.error('❌ Master admin authentication failed:', error);
        return false;
      }
    }

    // Fallback: Check if current user has admin role (for future admin users)
    if (currentUser.role === 'admin' || currentUser.role === 'moderator') {
      // Auto-login other admins using their existing Google session
      const success = await get().login(currentUser.email, process.env.NEXT_PUBLIC_ADMIN_ACCESS_KEY || 'admin-development-key-123');
      return success;
    }
    
    return false;
  },

  refreshMetrics: async () => {
    set({ isLoading: true });

    try {
      const { authToken } = get();
      // Refreshing metrics with auth token
      
      const siteMetrics = await calculateSiteMetrics(authToken || undefined);
      // Metrics received
      
      set({
        siteMetrics,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to refresh metrics:', error);
      set({ isLoading: false });
    }
  },

  loadUserAnalytics: async () => {
    set({ isLoading: true });

    try {
      const { authToken } = get();
      const userAnalytics = await generateUserAnalytics(authToken || undefined);
      
      set({
        userAnalytics,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to load user analytics:', error);
      set({ isLoading: false });
    }
  },

  loadTrafficData: async () => {
    set({ isLoading: true });

    try {
      const { authToken } = get();
      const trafficData = await generateTrafficData(authToken || undefined);
      
      set({
        trafficData,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to load traffic data:', error);
      set({ isLoading: false });
    }
  },

  loadThreads: async () => {
    set({ isLoading: true });

    try {
      // Fetch discussions via API instead of direct database access
      const response = await fetch('/api/discussions?limit=100&sortBy=recent');
      const data = await response.json();
      
      if (data.success && data.discussions) {
        // Transform to match Thread interface
        const threads: Thread[] = data.discussions.map((discussion: any) => ({
          id: discussion.id,
          title: discussion.title,
          content: discussion.content,
          excerpt: discussion.excerpt,
          authorId: discussion.authorId || 'unknown',
          authorName: discussion.authorName || 'Unknown Author',
          // Proper boolean handling - SQLite returns 0/1, need to convert to boolean
          isBlogPost: Boolean(discussion.isBlogPost || discussion.is_blog_post),
          isPublished: Boolean(discussion.isPublished ?? discussion.is_published ?? true),
          isPinned: Boolean(discussion.isPinned || discussion.is_pinned),
          isLocked: Boolean(discussion.isLocked || discussion.is_locked),
          createdAt: discussion.createdAt ? new Date(discussion.createdAt * 1000).toISOString() : new Date().toISOString(),
          updatedAt: discussion.updatedAt ? new Date(discussion.updatedAt * 1000).toISOString() : new Date().toISOString(),
          tags: Array.isArray(discussion.tags) ? discussion.tags : [],
          views: discussion.views || 0,
          likes: discussion.upvotes || 0, // Map upvotes to likes
          comments: discussion.replies || 0,
          upvotes: discussion.upvotes || 0,
          downvotes: discussion.downvotes || 0,
          replies: discussion.replies || 0,
          category: discussion.category || 'General',
          featuredImage: undefined
        }));

        set({
          threads,
          isLoading: false,
        });
      } else {
        throw new Error('Failed to fetch discussions');
      }
    } catch (error) {
      console.warn('Failed to load discussions, using mock data:', error);
      // Fall back to generated data if API fails
      set({
        threads: generateThreads(),
        isLoading: false,
      });
    }
  },

  createThread: async (threadData) => {
    set({ isLoading: true });

    try {
      // Create discussion via API
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
          isBlogPost: threadData.isBlogPost,
          isPublished: threadData.isPublished,
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.discussion) {
        // Transform to match Thread interface
        const newThread: Thread = {
          id: data.discussion.id,
          title: data.discussion.title,
          content: data.discussion.content,
          excerpt: data.discussion.excerpt,
          authorId: data.discussion.authorId || threadData.authorId,
          authorName: data.discussion.authorName || threadData.authorName,
          isBlogPost: data.discussion.isBlogPost || false,
          isPublished: data.discussion.isPublished ?? true,
          isPinned: data.discussion.isPinned || threadData.isPinned || false,
          isLocked: data.discussion.isLocked || threadData.isLocked || false,
          createdAt: new Date(data.discussion.createdAt * 1000).toISOString(),
          updatedAt: new Date(data.discussion.updatedAt * 1000).toISOString(),
          tags: threadData.tags,
          views: 0,
          likes: 0,
          comments: 0,
          upvotes: 0,
          downvotes: 0,
          replies: 0,
          category: data.discussion.category || threadData.category,
          featuredImage: threadData.featuredImage
        };

        set((state) => ({
          threads: [newThread, ...state.threads],
          isLoading: false,
        }));
      } else {
        throw new Error(data.error || 'Failed to create discussion');
      }
    } catch (error) {
      console.warn('Failed to create thread:', error);
      // Fall back to mock creation
      const newThread: Thread = {
        ...threadData,
        id: `thread_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        likes: 0,
        comments: 0,
        upvotes: 0,
        downvotes: 0,
        replies: 0,
        title: "",
        content: "",
        excerpt: "",
        authorId: "",
        authorName: "",
        isBlogPost: false,
        isPublished: false,
        isPinned: false,
        isLocked: false,
        tags: [],
        category: ""
      };

      set((state) => ({
        threads: [newThread, ...state.threads],
        isLoading: false,
      }));
    }
  },

  updateThread: async (id, updates) => {
    set({ isLoading: true });

    try {
      // Update discussion via API
      const response = await fetch(`/api/discussions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      const data = await response.json();
      
      if (data.success && data.discussion) {
        // Transform the response to match Thread interface
        const updatedThread: Thread = {
          id: data.discussion.id,
          title: data.discussion.title,
          content: data.discussion.content,
          excerpt: data.discussion.excerpt,
          authorId: data.discussion.authorId || 'unknown',
          authorName: data.discussion.authorName || 'Unknown Author',
          // Proper boolean handling - SQLite returns 0/1, need to convert to boolean
          isBlogPost: Boolean(data.discussion.isBlogPost || data.discussion.is_blog_post),
          isPublished: Boolean(data.discussion.isPublished ?? data.discussion.is_published ?? true),
          isPinned: Boolean(data.discussion.isPinned || data.discussion.is_pinned),
          isLocked: Boolean(data.discussion.isLocked || data.discussion.is_locked),
          createdAt: data.discussion.createdAt ? new Date(data.discussion.createdAt * 1000).toISOString() : new Date().toISOString(),
          updatedAt: data.discussion.updatedAt ? new Date(data.discussion.updatedAt * 1000).toISOString() : new Date().toISOString(),
          tags: Array.isArray(data.discussion.tags) ? data.discussion.tags : [],
          views: data.discussion.views || 0,
          likes: data.discussion.upvotes || 0,
          comments: data.discussion.replies || 0,
          upvotes: data.discussion.upvotes || 0,
          downvotes: data.discussion.downvotes || 0,
          replies: data.discussion.replies || 0,
          category: data.discussion.category || 'General',
          featuredImage: undefined
        };

        // Update local state
        set((state) => ({
          threads: state.threads.map((thread) =>
            thread.id === id ? updatedThread : thread
          ),
          isLoading: false,
        }));
      } else {
        throw new Error(data.error || 'Failed to update discussion');
      }
    } catch (error) {
      console.warn('Failed to update thread:', error);
      // Fallback to local update
      set((state) => ({
        threads: state.threads.map((thread) =>
          thread.id === id
            ? { ...thread, ...updates, updatedAt: new Date().toISOString() }
            : thread
        ),
        isLoading: false,
      }));
    }
  },

  deleteThread: async (id) => {
    set({ isLoading: true });

    try {
      console.log('🗑️ Attempting to delete thread:', id);
      
      // Delete discussion via API
      const response = await fetch(`/api/discussions/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log('🌐 Delete API response status:', response.status);
      
      if (!response.ok) {
        console.error('❌ Delete API response not ok:', response.statusText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📊 Delete API response data:', data);
      
      if (data.success) {
        console.log('✅ Successfully deleted discussion from database');
        // Remove from local state
        set((state) => ({
          threads: state.threads.filter((thread) => thread.id !== id),
          isLoading: false,
        }));
      } else {
        console.error('❌ API returned success: false:', data.error);
        throw new Error(data.error || 'Failed to delete discussion');
      }
    } catch (error) {
      console.error('❌ Failed to delete thread via API:', error);
      
      // DO NOT fall back to local deletion - this causes the issue
      // If API fails, keep the item in the list and show an error
      set({ isLoading: false });
      
      // Re-throw error so UI can handle it
      throw error;
    }
  },

  loadHealthMetrics: async () => {
    try {
      // Loading health metrics
      
      const response = await fetch('/api/admin/health');
      const data = await response.json();
      
      if (data.success && data.health) {
        // Health metrics loaded
        set({ healthMetrics: data.health });
      } else {
        console.warn('⚠️ Health metrics API returned no data:', data);
        set({ healthMetrics: null });
      }
    } catch (error) {
      console.error('❌ Failed to load health metrics:', error);
      set({ healthMetrics: null });
    }
  },

  loadNotifications: async () => {
    try {
      // Loading notifications
      
      const response = await fetch('/api/admin/notifications');
      const data = await response.json();
      
      if (data.success && data.notifications) {
        // Notifications loaded
        set({ notifications: data.notifications });
      } else {
        console.warn('⚠️ Notifications API returned no data:', data);
        set({ notifications: null });
      }
    } catch (error) {
      console.error('❌ Failed to load notifications:', error);
      set({ notifications: null });
    }
  },

  // Admin settings methods
  loadAdminSettings: async (category?: string) => {
    set({ isLoading: true });

    try {
      const params = new URLSearchParams();
      if (category && category !== 'all') {
        params.set('category', category);
      }

      const response = await fetch(`/api/admin/settings?${params}`);
      const data = await response.json();

      if (data.success) {
        set({
          adminSettings: data.settings || [],
          settingsCategories: data.categories || [],
          isLoading: false,
        });
      } else {
        console.error('Failed to load admin settings:', data.error);
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Failed to load admin settings:', error);
      set({ isLoading: false });
    }
  },

  updateAdminSettings: async (settings: Record<string, any>) => {
    set({ isLoading: true });

    try {
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

      const data = await response.json();

      if (data.success) {
        set({
          adminSettings: data.settings || [],
          isLoading: false,
        });
      } else {
        console.error('Failed to update admin settings:', data.error);
        set({ isLoading: false });
        throw new Error(data.error || 'Failed to update settings');
      }
    } catch (error) {
      console.error('Failed to update admin settings:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  resetAdminSettings: async (category?: string) => {
    set({ isLoading: true });

    try {
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

      const data = await response.json();

      if (data.success) {
        set({
          adminSettings: data.settings || [],
          isLoading: false,
        });
      } else {
        console.error('Failed to reset admin settings:', data.error);
        set({ isLoading: false });
        throw new Error(data.error || 'Failed to reset settings');
      }
    } catch (error) {
      console.error('Failed to reset admin settings:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  getAdminSetting: (key: string): any => {
    const state: any = useAdminStore.getState();
    return state.adminSettings.find((setting: any) => setting.key === key) || null;
  },
}));
