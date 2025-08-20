/* eslint-disable @typescript-eslint/no-explicit-any */

export interface UserAnalytics {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  lastActive: string;
  chartsGenerated: number;
  forumPosts: number;
  isAnonymous: boolean;
}

export interface Thread {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  authorName: string;
  preferredAvatar?: string;
  slug?: string;
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
  embeddedChart?: any;
  embeddedVideo?: any;
}

export interface EventsAnalytics {
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

export interface SiteMetrics {
  totalUsers: number;
  activeUsers: number;
  chartsGenerated: number;
  forumPosts: number;
  dailyVisitors: number;
  monthlyGrowth: number;
  events?: EventsAnalytics | null;
}

export interface TrafficData {
  date: string;
  visitors: number;
  pageViews: number;
  chartsGenerated: number;
  topCountries?: Array<{ country: string; count: number; percentage: number }>;
  locationBreakdown?: {
    currentLocation: number;
    birthLocation: number;
    fallbackLocation: number;
  };
}

export interface HealthMetrics {
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

export interface NotificationSummary {
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

export interface AdminSetting {
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

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  permissions: string[];
}

export interface AdminState {
  // Authentication
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  authToken: string | null;
  authLoading: boolean;

  // Analytics data
  siteMetrics: SiteMetrics;
  userAnalytics: UserAnalytics[];
  trafficData: TrafficData[];
  threads: Thread[];
  totalThreads: number;
  totalPages: number;
  currentPage: number;

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

  // Analytics actions
  refreshMetrics: () => Promise<void>;
  loadUserAnalytics: () => Promise<void>;
  loadTrafficData: () => Promise<void>;
  loadHealthMetrics: () => Promise<void>;
  loadNotifications: () => Promise<void>;

  // Thread actions
  loadThreads: (options?: any) => Promise<void>;
  loadThreadCounts: () => Promise<void>;
  createThread: (thread: Omit<Thread, "id" | "createdAt" | "updatedAt" | "views" | "likes" | "comments" | "upvotes" | "downvotes" | "replies">) => Promise<void>;
  updateThread: (id: string, updates: Partial<Thread>) => Promise<void>;
  deleteThread: (id: string) => Promise<void>;
  
  // Admin settings actions
  loadAdminSettings: (category?: string) => Promise<void>;
  updateAdminSettings: (settings: Record<string, any>) => Promise<void>;
  resetAdminSettings: (category?: string) => Promise<void>;
  getAdminSetting: (key: string) => AdminSetting | null;
}

export interface CreateThreadData {
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  authorName: string;
  category: string;
  tags: string[];
  slug?: string;
  isBlogPost: boolean;
  isPublished: boolean;
  featuredImage?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}