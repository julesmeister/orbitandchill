-- Performance Indexes Migration
-- Generated: 2025-06-26T05:16:36.344Z
-- Purpose: Add database indexes for frequently queried fields to improve API response times

-- Index for user lookup by email (login, Google auth)
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- Index for filtering users by authentication provider
CREATE INDEX IF NOT EXISTS idx_users_auth_provider ON users (auth_provider);

-- Index for user registration analytics and sorting
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at);

-- Index for finding recently active users
CREATE INDEX IF NOT EXISTS idx_users_updated_at ON users (updated_at);

-- Composite index for filtering active/deleted users
CREATE INDEX IF NOT EXISTS idx_users_deletion_status ON users (is_deleted, deleted_at);

-- Index for filtering discussions by category
CREATE INDEX IF NOT EXISTS idx_discussions_category ON discussions (category);

-- Index for finding discussions by author
CREATE INDEX IF NOT EXISTS idx_discussions_author_id ON discussions (author_id);

-- Index for separating blog posts from forum discussions
CREATE INDEX IF NOT EXISTS idx_discussions_is_blog_post ON discussions (is_blog_post);

-- Index for filtering published vs draft discussions
CREATE INDEX IF NOT EXISTS idx_discussions_is_published ON discussions (is_published);

-- Index for sorting discussions by creation date
CREATE INDEX IF NOT EXISTS idx_discussions_created_at ON discussions (created_at);

-- Index for sorting discussions by recent activity
CREATE INDEX IF NOT EXISTS idx_discussions_last_activity ON discussions (last_activity);

-- Index for sorting discussions by popularity
CREATE INDEX IF NOT EXISTS idx_discussions_upvotes ON discussions (upvotes);

-- Composite index for category filtering with sorting
CREATE INDEX IF NOT EXISTS idx_discussions_category_published_activity ON discussions (category, is_published, last_activity);

-- Index for fetching replies for a specific discussion
CREATE INDEX IF NOT EXISTS idx_replies_discussion_id ON discussion_replies (discussion_id);

-- Index for finding replies by author
CREATE INDEX IF NOT EXISTS idx_replies_author_id ON discussion_replies (author_id);

-- Index for threaded reply structure
CREATE INDEX IF NOT EXISTS idx_replies_parent_reply_id ON discussion_replies (parent_reply_id);

-- Index for sorting replies chronologically
CREATE INDEX IF NOT EXISTS idx_replies_created_at ON discussion_replies (created_at);

-- Composite index for fetching discussion replies in order
CREATE INDEX IF NOT EXISTS idx_replies_discussion_created ON discussion_replies (discussion_id, created_at);

-- Index for finding votes by user
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes (user_id);

-- Index for aggregating votes on discussions
CREATE INDEX IF NOT EXISTS idx_votes_discussion_id ON votes (discussion_id);

-- Index for aggregating votes on replies
CREATE INDEX IF NOT EXISTS idx_votes_reply_id ON votes (reply_id);

-- Composite index for checking user votes on discussions (unique constraint)
CREATE INDEX IF NOT EXISTS idx_votes_user_discussion ON votes (user_id, discussion_id);

-- Composite index for checking user votes on replies (unique constraint)
CREATE INDEX IF NOT EXISTS idx_votes_user_reply ON votes (user_id, reply_id);

-- Index for finding charts by user
CREATE INDEX IF NOT EXISTS idx_charts_user_id ON natal_charts (user_id);

-- Index for sorting charts by creation date
CREATE INDEX IF NOT EXISTS idx_charts_created_at ON natal_charts (created_at);

-- Index for filtering public charts
CREATE INDEX IF NOT EXISTS idx_charts_is_public ON natal_charts (is_public);

-- Index for looking up shared charts by token
CREATE INDEX IF NOT EXISTS idx_charts_share_token ON natal_charts (share_token);

-- Index for filtering charts by type (natal, transit, etc.)
CREATE INDEX IF NOT EXISTS idx_charts_chart_type ON natal_charts (chart_type);

-- Index for finding events by user
CREATE INDEX IF NOT EXISTS idx_events_user_id ON astrological_events (user_id);

-- Index for filtering events by date
CREATE INDEX IF NOT EXISTS idx_events_date ON astrological_events (date);

-- Index for filtering events by type (benefic, challenging, neutral)
CREATE INDEX IF NOT EXISTS idx_events_type ON astrological_events (type);

-- Index for filtering bookmarked events
CREATE INDEX IF NOT EXISTS idx_events_is_bookmarked ON astrological_events (is_bookmarked);

-- Index for separating generated vs user-created events
CREATE INDEX IF NOT EXISTS idx_events_is_generated ON astrological_events (is_generated);

-- Composite index for user events by date range
CREATE INDEX IF NOT EXISTS idx_events_user_date ON astrological_events (user_id, date);

-- Index for fetching user notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications (user_id);

-- Index for filtering read/unread notifications
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications (is_read);

-- Index for sorting notifications by date
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications (created_at);

-- Composite index for user notification queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_read_created ON notifications (user_id, is_read, created_at);

-- Index for analytics queries by date
CREATE INDEX IF NOT EXISTS idx_analytics_traffic_date ON analytics_traffic (date);

-- Index for engagement analytics by date
CREATE INDEX IF NOT EXISTS idx_analytics_engagement_date ON analytics_engagement (date);

-- Index for finding logs by admin user
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_user_id ON admin_logs (admin_user_id);

-- Index for filtering logs by action type
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs (action);

-- Index for filtering logs by entity type
CREATE INDEX IF NOT EXISTS idx_admin_logs_entity_type ON admin_logs (entity_type);

-- Index for sorting logs by date
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs (created_at);

-- Index for filtering logs by severity level
CREATE INDEX IF NOT EXISTS idx_admin_logs_severity ON admin_logs (severity);

-- Index creation completed
SELECT 'Performance indexes created successfully' as result;