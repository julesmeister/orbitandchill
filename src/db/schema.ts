/* eslint-disable @typescript-eslint/no-unused-vars */
import { sqliteTable, text, integer, real, blob } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Users table - supports both anonymous and authenticated users
export const users = sqliteTable('users', {
  id: text('id').primaryKey(), // "anon_xxxxx" or Google ID
  username: text('username').notNull(),
  email: text('email'),
  profilePictureUrl: text('profile_picture_url'),
  authProvider: text('auth_provider', { enum: ['google', 'anonymous'] }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  
  // Birth data
  dateOfBirth: text('date_of_birth'), // ISO date string
  timeOfBirth: text('time_of_birth'), // HH:MM format
  locationOfBirth: text('location_of_birth'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  
  // Current location data (for void moon calculations)
  currentLocationName: text('current_location_name'),
  currentLatitude: real('current_latitude'),
  currentLongitude: real('current_longitude'),
  currentLocationUpdatedAt: integer('current_location_updated_at', { mode: 'timestamp' }),
  
  // Astrological data
  sunSign: text('sun_sign'),
  stelliumSigns: text('stellium_signs'), // JSON array
  stelliumHouses: text('stellium_houses'), // JSON array
  hasNatalChart: integer('has_natal_chart', { mode: 'boolean' }).default(false),
  
  // Privacy settings
  showZodiacPublicly: integer('show_zodiac_publicly', { mode: 'boolean' }).default(false),
  showStelliumsPublicly: integer('show_stelliums_publicly', { mode: 'boolean' }).default(false),
  showBirthInfoPublicly: integer('show_birth_info_publicly', { mode: 'boolean' }).default(false),
  allowDirectMessages: integer('allow_direct_messages', { mode: 'boolean' }).default(true),
  showOnlineStatus: integer('show_online_status', { mode: 'boolean' }).default(true),
  
  // User preferences
  emailNotifications: integer('email_notifications', { mode: 'boolean' }).default(true),
  weeklyNewsletter: integer('weekly_newsletter', { mode: 'boolean' }).default(false),
  discussionNotifications: integer('discussion_notifications', { mode: 'boolean' }).default(true),
  chartReminders: integer('chart_reminders', { mode: 'boolean' }).default(false),
  defaultChartTheme: text('default_chart_theme').default('default'),
  timezone: text('timezone').default('UTC'),
  language: text('language').default('en'),
  
  // Subscription management
  subscriptionTier: text('subscription_tier', { enum: ['free', 'premium', 'pro'] }).default('free'),
  
  // Admin & Role management
  role: text('role', { enum: ['user', 'admin', 'moderator'] }).default('user'),
  permissions: text('permissions'), // JSON array of specific permissions
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  
  // Account deletion tracking
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
  deletionType: text('deletion_type', { enum: ['soft', 'hard', 'scheduled'] }),
  deletionReason: text('deletion_reason'), // User-provided reason
  deletionRequestedAt: integer('deletion_requested_at', { mode: 'timestamp' }),
  deletionConfirmedAt: integer('deletion_confirmed_at', { mode: 'timestamp' }),
  gracePeriodEnds: integer('grace_period_ends', { mode: 'timestamp' }),
  deletedBy: text('deleted_by'), // 'self' or admin user ID
});

// Admin session management - secure admin authentication
export const adminSessions = sqliteTable('admin_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  token: text('token').notNull().unique(),
  refreshToken: text('refresh_token'),
  
  // Session metadata
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  refreshExpiresAt: integer('refresh_expires_at', { mode: 'timestamp' }),
  
  // Request context
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  loginMethod: text('login_method', { enum: ['password', 'oauth', 'token'] }).notNull(),
  
  // Security tracking
  lastActivity: integer('last_activity', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  failedAttempts: integer('failed_attempts').default(0),
  lockedUntil: integer('locked_until', { mode: 'timestamp' }),
  
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Natal charts storage
export const natalCharts = sqliteTable('natal_charts', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  chartData: text('chart_data').notNull(), // SVG content
  metadata: text('metadata').notNull(), // JSON: chart calculations, positions, etc.
  chartType: text('chart_type', { enum: ['natal', 'transit', 'synastry', 'composite'] }).notNull(),
  
  // Chart subject information
  subjectName: text('subject_name').notNull(),
  dateOfBirth: text('date_of_birth').notNull(), // ISO date string
  timeOfBirth: text('time_of_birth').notNull(), // HH:MM format
  locationOfBirth: text('location_of_birth').notNull(),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  
  // Chart appearance
  title: text('title'),
  description: text('description'),
  theme: text('theme').default('default'),
  
  // Sharing and visibility
  isPublic: integer('is_public', { mode: 'boolean' }).default(false),
  shareToken: text('share_token'), // For sharing charts via URL
  
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Forum discussions/threads
export const discussions = sqliteTable('discussions', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(), // Full content
  authorId: text('author_id').references(() => users.id, { onDelete: 'set null' }),
  authorName: text('author_name').notNull(), // Store author name at time of creation
  category: text('category').notNull(),
  tags: text('tags'), // JSON array
  embeddedChart: text('embedded_chart'), // JSON object for attached chart
  embeddedVideo: text('embedded_video'), // JSON object for attached video
  replies: integer('replies').default(0),
  views: integer('views').default(0),
  upvotes: integer('upvotes').default(0),
  downvotes: integer('downvotes').default(0),
  isLocked: integer('is_locked', { mode: 'boolean' }).default(false),
  isPinned: integer('is_pinned', { mode: 'boolean' }).default(false),
  isBlogPost: integer('is_blog_post', { mode: 'boolean' }).default(false),
  isPublished: integer('is_published', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  lastActivity: integer('last_activity', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Discussion replies (threaded comments)
export const discussionReplies = sqliteTable('discussion_replies', {
  id: text('id').primaryKey(),
  discussionId: text('discussion_id').references(() => discussions.id, { onDelete: 'cascade' }).notNull(),
  authorId: text('author_id').references(() => users.id, { onDelete: 'set null' }),
  content: text('content').notNull(),
  parentReplyId: text('parent_reply_id'),
  upvotes: integer('upvotes').default(0),
  downvotes: integer('downvotes').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// User votes on discussions and replies
export const votes = sqliteTable('votes', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  discussionId: text('discussion_id').references(() => discussions.id, { onDelete: 'cascade' }),
  replyId: text('reply_id').references(() => discussionReplies.id, { onDelete: 'cascade' }),
  voteType: text('vote_type', { enum: ['up', 'down'] }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Categories for discussions
export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  icon: text('icon'), // Icon name or SVG path
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  discussionCount: integer('discussion_count').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Tags for discussions
export const tags = sqliteTable('tags', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  usageCount: integer('usage_count').notNull().default(0),
  isPopular: integer('is_popular', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Junction table for discussion-tag relationships
export const discussionTags = sqliteTable('discussion_tags', {
  discussionId: text('discussion_id').references(() => discussions.id, { onDelete: 'cascade' }).notNull(),
  tagId: text('tag_id').references(() => tags.id, { onDelete: 'cascade' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Analytics for tracking site usage
export const analytics = sqliteTable('analytics', {
  id: text('id').primaryKey(),
  date: text('date').notNull(), // YYYY-MM-DD format
  visitors: integer('visitors').default(0),
  pageViews: integer('page_views').default(0),
  chartsGenerated: integer('charts_generated').default(0),
  newUsers: integer('new_users').default(0),
  discussionViews: integer('discussion_views').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Cache table for computed data with TTL
export const cache = sqliteTable('cache', {
  key: text('key').primaryKey(),
  data: text('data').notNull(), // JSON string
  expiry: integer('expiry', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Events/electional astrology (general events - legacy)
export const events = sqliteTable('events', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  eventType: text('event_type').notNull(), // 'personal', 'cosmic', 'election'
  startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
  endDate: integer('end_date', { mode: 'timestamp' }),
  location: text('location'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  astrologicalSignificance: text('astrological_significance'), // JSON
  isPublic: integer('is_public', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Astrological events - matches AstrologicalEvent interface from events store
export const astrologicalEvents = sqliteTable('astrological_events', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  date: text('date').notNull(), // ISO date string (YYYY-MM-DD)
  time: text('time'), // HH:MM format, optional
  type: text('type', { enum: ['benefic', 'challenging', 'neutral'] }).notNull(),
  description: text('description').notNull(),
  aspects: text('aspects').notNull(), // JSON array of aspect descriptions
  planetaryPositions: text('planetary_positions').notNull(), // JSON array of planetary positions
  score: integer('score').notNull().default(5), // 1-10 scale of auspiciousness
  isGenerated: integer('is_generated', { mode: 'boolean' }).notNull().default(false),
  priorities: text('priorities'), // JSON array of priority strings
  chartData: text('chart_data'), // JSON chart calculation data
  isBookmarked: integer('is_bookmarked', { mode: 'boolean' }).notNull().default(false),
  timeWindow: text('time_window'), // JSON object with startTime, endTime, duration
  // TODO: Add these columns after proper migration
  // timingMethod: text('timing_method'), // Which analysis method generated this event: houses, aspects, or electional
  // electionalData: text('electional_data'), // JSON object with electional astrology metadata for filtering
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Admin analytics - traffic data
export const analyticsTraffic = sqliteTable('analytics_traffic', {
  id: text('id').primaryKey(),
  date: text('date').notNull(), // YYYY-MM-DD format
  visitors: integer('visitors').default(0),
  pageViews: integer('page_views').default(0),
  chartsGenerated: integer('charts_generated').default(0),
  newUsers: integer('new_users').default(0),
  returningUsers: integer('returning_users').default(0),
  avgSessionDuration: integer('avg_session_duration').default(0), // seconds
  bounceRate: real('bounce_rate').default(0), // percentage
  topPages: text('top_pages'), // JSON array
  trafficSources: text('traffic_sources'), // JSON object
  locationRequests: integer('location_requests').default(0), // Location request count
  locationPermissionsGranted: integer('location_permissions_granted').default(0), // GPS permissions granted
  locationPermissionsDenied: integer('location_permissions_denied').default(0), // GPS permissions denied
  locationFallbackUsed: integer('location_fallback_used').default(0), // Fallback location used
  locationErrors: integer('location_errors').default(0), // Location errors count
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Admin analytics - user engagement
export const analyticsEngagement = sqliteTable('analytics_engagement', {
  id: text('id').primaryKey(),
  date: text('date').notNull(),
  discussionsCreated: integer('discussions_created').default(0),
  repliesPosted: integer('replies_posted').default(0),
  chartsGenerated: integer('charts_generated').default(0),
  activeUsers: integer('active_users').default(0),
  popularDiscussions: text('popular_discussions'), // JSON array
  topContributors: text('top_contributors'), // JSON array
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Admin settings/configuration
export const adminSettings = sqliteTable('admin_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  type: text('type', { enum: ['string', 'number', 'boolean', 'json'] }).notNull(),
  category: text('category').notNull(), // 'seo', 'analytics', 'general', etc.
  description: text('description'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedBy: text('updated_by').references(() => users.id),
});

// Premium features configuration
export const premiumFeatures = sqliteTable('premium_features', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  category: text('category', { enum: ['chart', 'interpretation', 'sharing', 'analysis'] }).notNull(),
  isEnabled: integer('is_enabled', { mode: 'boolean' }).notNull().default(true),
  isPremium: integer('is_premium', { mode: 'boolean' }).notNull().default(false),
  component: text('component'), // Component that uses this feature
  section: text('section'), // Section within component
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// User activity tracking - tracks all user actions for timeline and analytics
export const userActivity = sqliteTable('user_activity', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  
  // Activity details
  activityType: text('activity_type', {
    enum: [
      'chart_generated', 'chart_viewed', 'chart_shared', 'chart_deleted',
      'discussion_created', 'discussion_viewed', 'discussion_replied', 'discussion_voted',
      'reply_created', 'reply_voted', 'reply_edited', 'reply_deleted',
      'event_created', 'event_bookmarked', 'event_unbookmarked', 'event_viewed',
      'user_registered', 'user_login', 'user_logout', 'user_updated',
      'settings_changed', 'premium_activated', 'premium_feature_used',
      'page_view', 'navigation', 'search_performed', 'export_data',
      'horary_question_submitted'
    ]
  }).notNull(),
  
  // Entity information
  entityType: text('entity_type', {
    enum: ['chart', 'discussion', 'reply', 'event', 'user', 'page', 'search', 'settings', 'premium_feature', 'horary']
  }),
  entityId: text('entity_id'), // ID of the entity acted upon
  
  // Activity description and context
  description: text('description').notNull(), // Human-readable description
  metadata: text('metadata'), // JSON object with additional context (chart type, discussion category, etc.)
  
  // Request context
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  sessionId: text('session_id'), // For grouping activities in a session
  
  // Page context
  pageUrl: text('page_url'),
  referrer: text('referrer'),
  
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Admin audit logs - tracks all admin actions for security and compliance
export const adminLogs = sqliteTable('admin_logs', {
  id: text('id').primaryKey(),
  adminUserId: text('admin_user_id').references(() => users.id, { onDelete: 'set null' }),
  adminUsername: text('admin_username').notNull(), // Store username at time of action
  
  // Action details
  action: text('action', { 
    enum: ['create', 'update', 'delete', 'login', 'logout', 'view', 'export', 'import', 'seed', 'migrate', 'configure'] 
  }).notNull(),
  entityType: text('entity_type', { 
    enum: ['user', 'discussion', 'reply', 'chart', 'event', 'category', 'tag', 'premium_feature', 'admin_setting', 'analytics', 'system'] 
  }).notNull(),
  entityId: text('entity_id'), // ID of the affected entity (nullable for system actions)
  
  // Action description and context
  description: text('description').notNull(), // Human-readable description of the action
  details: text('details'), // JSON object with additional context
  
  // Change tracking for updates
  beforeValues: text('before_values'), // JSON snapshot of entity before change
  afterValues: text('after_values'), // JSON snapshot of entity after change
  
  // Request context
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  requestUrl: text('request_url'),
  requestMethod: text('request_method'),
  
  // Metadata
  severity: text('severity', { enum: ['low', 'medium', 'high', 'critical'] }).notNull().default('medium'),
  tags: text('tags'), // JSON array of tags for categorization
  
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Account deletion requests and audit trail
export const accountDeletionRequests = sqliteTable('account_deletion_requests', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  requestedBy: text('requested_by').notNull(), // 'self' or admin user ID
  requestType: text('request_type', { enum: ['immediate', 'scheduled', 'grace_period'] }).notNull(),
  reason: text('reason'), // User-provided reason
  scheduledFor: integer('scheduled_for', { mode: 'timestamp' }), // For scheduled deletions
  gracePeriodDays: integer('grace_period_days').default(30), // Days before permanent deletion
  
  // Status tracking
  status: text('status', { enum: ['pending', 'confirmed', 'processing', 'completed', 'cancelled'] }).notNull().default('pending'),
  confirmationToken: text('confirmation_token'), // For email confirmation
  confirmationSentAt: integer('confirmation_sent_at', { mode: 'timestamp' }),
  confirmedAt: integer('confirmed_at', { mode: 'timestamp' }),
  processedAt: integer('processed_at', { mode: 'timestamp' }),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  
  // Data cleanup tracking
  dataCleanupStatus: text('data_cleanup_status'), // JSON object tracking cleanup progress
  recoveryDataPath: text('recovery_data_path'), // Path to recovery data archive
  
  // Metadata
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
  notes: text('notes'), // Admin notes
  
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Notifications - in-app notification system
export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  
  // Notification content
  type: text('type', { 
    enum: [
      'discussion_reply', 'discussion_like', 'discussion_mention',
      'chart_shared', 'chart_comment', 'chart_like',
      'event_reminder', 'event_bookmark',
      'system_announcement', 'system_maintenance', 'system_update',
      'admin_message', 'admin_warning',
      'premium_upgrade', 'premium_expiry',
      'welcome', 'newsletter'
    ] 
  }).notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  icon: text('icon'), // Icon name or emoji
  
  // Notification metadata
  priority: text('priority', { enum: ['low', 'medium', 'high', 'urgent'] }).notNull().default('medium'),
  category: text('category', { 
    enum: ['social', 'system', 'admin', 'premium', 'reminder', 'achievement'] 
  }).notNull().default('system'),
  
  // Related entity (optional)
  entityType: text('entity_type', { 
    enum: ['discussion', 'reply', 'chart', 'event', 'user', 'system'] 
  }),
  entityId: text('entity_id'), // ID of related entity
  entityUrl: text('entity_url'), // Deep link to related content
  
  // Status tracking
  isRead: integer('is_read', { mode: 'boolean' }).notNull().default(false),
  readAt: integer('read_at', { mode: 'timestamp' }),
  isArchived: integer('is_archived', { mode: 'boolean' }).notNull().default(false),
  archivedAt: integer('archived_at', { mode: 'timestamp' }),
  
  // Delivery tracking
  deliveryMethod: text('delivery_method', { 
    enum: ['in_app', 'email', 'push', 'sms'] 
  }).notNull().default('in_app'),
  deliveredAt: integer('delivered_at', { mode: 'timestamp' }),
  emailSent: integer('email_sent', { mode: 'boolean' }).default(false),
  emailSentAt: integer('email_sent_at', { mode: 'timestamp' }),
  
  // Scheduling
  scheduledFor: integer('scheduled_for', { mode: 'timestamp' }), // For delayed notifications
  expiresAt: integer('expires_at', { mode: 'timestamp' }), // Auto-cleanup old notifications
  
  // Metadata
  data: text('data'), // JSON object with additional context
  tags: text('tags'), // JSON array of tags for filtering
  
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Notification preferences - per-user notification settings
export const notificationPreferences = sqliteTable('notification_preferences', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  
  // Global notification settings
  enableInApp: integer('enable_in_app', { mode: 'boolean' }).notNull().default(true),
  enableEmail: integer('enable_email', { mode: 'boolean' }).notNull().default(true),
  enablePush: integer('enable_push', { mode: 'boolean' }).notNull().default(false),
  enableSms: integer('enable_sms', { mode: 'boolean' }).notNull().default(false),
  
  // Quiet hours
  quietHoursEnabled: integer('quiet_hours_enabled', { mode: 'boolean' }).notNull().default(false),
  quietHoursStart: text('quiet_hours_start').default('22:00'), // HH:MM format
  quietHoursEnd: text('quiet_hours_end').default('08:00'), // HH:MM format
  quietHoursTimezone: text('quiet_hours_timezone'),
  
  // Category-specific preferences (JSON object)
  socialNotifications: text('social_notifications').default('{"in_app": true, "email": true, "push": false}'),
  systemNotifications: text('system_notifications').default('{"in_app": true, "email": false, "push": false}'),
  adminNotifications: text('admin_notifications').default('{"in_app": true, "email": true, "push": true}'),
  premiumNotifications: text('premium_notifications').default('{"in_app": true, "email": true, "push": false}'),
  reminderNotifications: text('reminder_notifications').default('{"in_app": true, "email": false, "push": true}'),
  achievementNotifications: text('achievement_notifications').default('{"in_app": true, "email": false, "push": false}'),
  
  // Digest preferences
  dailyDigest: integer('daily_digest', { mode: 'boolean' }).notNull().default(false),
  weeklyDigest: integer('weekly_digest', { mode: 'boolean' }).notNull().default(true),
  digestTime: text('digest_time').default('09:00'), // HH:MM format
  digestDayOfWeek: integer('digest_day_of_week').default(1), // 0=Sunday, 1=Monday, etc.
  
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Horary questions - stores horary astrology questions and answers
export const horaryQuestions = sqliteTable('horary_questions', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  
  // Question details
  question: text('question').notNull(),
  date: integer('date', { mode: 'timestamp' }).notNull(), // Exact moment question was asked
  
  // Location information (for chart casting)
  location: text('location'), // Human-readable location name
  latitude: real('latitude'),
  longitude: real('longitude'),
  timezone: text('timezone'),
  
  // Horary analysis results
  answer: text('answer'), // 'Yes', 'No', 'Maybe', 'Unclear', etc.
  timing: text('timing'), // When the outcome will manifest
  interpretation: text('interpretation'), // Detailed astrological interpretation
  
  // Chart data and technical details
  chartData: text('chart_data'), // JSON: full astrological chart data
  chartSvg: text('chart_svg'), // SVG chart visualization
  ascendantDegree: real('ascendant_degree'), // For radicality check
  moonSign: text('moon_sign'),
  moonVoidOfCourse: integer('moon_void_of_course', { mode: 'boolean' }),
  planetaryHour: text('planetary_hour'),
  
  // Chart validation
  isRadical: integer('is_radical', { mode: 'boolean' }), // Traditional chart validity
  chartWarnings: text('chart_warnings'), // JSON array of warnings (void moon, via combusta, etc.)
  
  // Question metadata
  category: text('category'), // 'career', 'relationships', 'health', etc.
  tags: text('tags'), // JSON array of user tags
  isShared: integer('is_shared', { mode: 'boolean' }).default(false),
  shareToken: text('share_token'), // For public chart sharing
  
  // Analysis metadata
  aspectCount: integer('aspect_count'),
  retrogradeCount: integer('retrograde_count'),
  significatorPlanet: text('significator_planet'), // Main planet representing querent
  
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Notification templates - reusable notification templates for consistency
export const notificationTemplates = sqliteTable('notification_templates', {
  id: text('id').primaryKey(),
  templateKey: text('template_key').notNull().unique(), // e.g., 'discussion_reply', 'event_reminder'
  
  // Template content
  name: text('name').notNull(),
  description: text('description'),
  category: text('category', { 
    enum: ['social', 'system', 'admin', 'premium', 'reminder', 'achievement'] 
  }).notNull(),
  
  // Content templates (with placeholder support)
  titleTemplate: text('title_template').notNull(), // e.g., "{{username}} replied to your discussion"
  messageTemplate: text('message_template').notNull(),
  emailSubjectTemplate: text('email_subject_template'),
  emailBodyTemplate: text('email_body_template'),
  
  // Template metadata
  icon: text('icon'),
  priority: text('priority', { enum: ['low', 'medium', 'high', 'urgent'] }).notNull().default('medium'),
  defaultDeliveryMethods: text('default_delivery_methods').default('["in_app"]'), // JSON array
  
  // Template settings
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  requiresAuth: integer('requires_auth', { mode: 'boolean' }).notNull().default(true),
  maxFrequency: text('max_frequency'), // e.g., 'once_per_day', 'once_per_hour'
  
  // Placeholders and validation
  availablePlaceholders: text('available_placeholders'), // JSON array of available placeholder keys
  validationRules: text('validation_rules'), // JSON object with validation rules
  
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});