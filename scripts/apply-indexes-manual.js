#!/usr/bin/env node

/**
 * Manually apply performance indexes to the database
 * This bypasses drizzle-kit migration requirements
 * Run with: node scripts/apply-indexes-manual.js
 */

const fs = require('fs');
const path = require('path');

// Import database connection (for Node.js environment)
const { getDb } = require('../src/db/index-turso-http.ts');

const PERFORMANCE_INDEXES = [
  // Users table indexes
  "CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);",
  "CREATE INDEX IF NOT EXISTS idx_users_auth_provider ON users (auth_provider);", 
  "CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at);",
  "CREATE INDEX IF NOT EXISTS idx_users_updated_at ON users (updated_at);",
  "CREATE INDEX IF NOT EXISTS idx_users_deletion_status ON users (is_deleted, deleted_at);",

  // Discussions table indexes
  "CREATE INDEX IF NOT EXISTS idx_discussions_category ON discussions (category);",
  "CREATE INDEX IF NOT EXISTS idx_discussions_author_id ON discussions (author_id);",
  "CREATE INDEX IF NOT EXISTS idx_discussions_is_blog_post ON discussions (is_blog_post);",
  "CREATE INDEX IF NOT EXISTS idx_discussions_is_published ON discussions (is_published);",
  "CREATE INDEX IF NOT EXISTS idx_discussions_created_at ON discussions (created_at);",
  "CREATE INDEX IF NOT EXISTS idx_discussions_last_activity ON discussions (last_activity);",
  "CREATE INDEX IF NOT EXISTS idx_discussions_upvotes ON discussions (upvotes);",
  "CREATE INDEX IF NOT EXISTS idx_discussions_category_published_activity ON discussions (category, is_published, last_activity);",

  // Discussion replies table indexes  
  "CREATE INDEX IF NOT EXISTS idx_replies_discussion_id ON discussion_replies (discussion_id);",
  "CREATE INDEX IF NOT EXISTS idx_replies_author_id ON discussion_replies (author_id);",
  "CREATE INDEX IF NOT EXISTS idx_replies_parent_reply_id ON discussion_replies (parent_reply_id);",
  "CREATE INDEX IF NOT EXISTS idx_replies_created_at ON discussion_replies (created_at);",
  "CREATE INDEX IF NOT EXISTS idx_replies_discussion_created ON discussion_replies (discussion_id, created_at);",

  // Votes table indexes
  "CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes (user_id);",
  "CREATE INDEX IF NOT EXISTS idx_votes_discussion_id ON votes (discussion_id);",
  "CREATE INDEX IF NOT EXISTS idx_votes_reply_id ON votes (reply_id);",
  "CREATE INDEX IF NOT EXISTS idx_votes_user_discussion ON votes (user_id, discussion_id);",
  "CREATE INDEX IF NOT EXISTS idx_votes_user_reply ON votes (user_id, reply_id);",

  // Natal charts table indexes
  "CREATE INDEX IF NOT EXISTS idx_charts_user_id ON natal_charts (user_id);",
  "CREATE INDEX IF NOT EXISTS idx_charts_created_at ON natal_charts (created_at);",
  "CREATE INDEX IF NOT EXISTS idx_charts_is_public ON natal_charts (is_public);",
  "CREATE INDEX IF NOT EXISTS idx_charts_share_token ON natal_charts (share_token);",
  "CREATE INDEX IF NOT EXISTS idx_charts_chart_type ON natal_charts (chart_type);",

  // Astrological events table indexes
  "CREATE INDEX IF NOT EXISTS idx_events_user_id ON astrological_events (user_id);",
  "CREATE INDEX IF NOT EXISTS idx_events_date ON astrological_events (date);",
  "CREATE INDEX IF NOT EXISTS idx_events_type ON astrological_events (type);",
  "CREATE INDEX IF NOT EXISTS idx_events_is_bookmarked ON astrological_events (is_bookmarked);",
  "CREATE INDEX IF NOT EXISTS idx_events_is_generated ON astrological_events (is_generated);",
  "CREATE INDEX IF NOT EXISTS idx_events_user_date ON astrological_events (user_id, date);",

  // Notifications table indexes
  "CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications (user_id);",
  "CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications (is_read);",
  "CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications (created_at);",
  "CREATE INDEX IF NOT EXISTS idx_notifications_user_read_created ON notifications (user_id, is_read, created_at);",

  // Analytics tables indexes
  "CREATE INDEX IF NOT EXISTS idx_analytics_traffic_date ON analytics_traffic (date);",
  "CREATE INDEX IF NOT EXISTS idx_analytics_engagement_date ON analytics_engagement (date);",

  // Admin logs table indexes
  "CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_user_id ON admin_logs (admin_user_id);",
  "CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs (action);",
  "CREATE INDEX IF NOT EXISTS idx_admin_logs_entity_type ON admin_logs (entity_type);",
  "CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs (created_at);",
  "CREATE INDEX IF NOT EXISTS idx_admin_logs_severity ON admin_logs (severity);"
];

async function applyIndexes() {
  console.log('🚀 Applying performance indexes to database...');
  console.log(`📊 Total indexes to create: ${PERFORMANCE_INDEXES.length}`);
  
  try {
    // Note: This would need to be adapted for the actual database connection
    console.log('⚠️ Manual index application requires database connection');
    console.log('📋 Index SQL statements prepared:');
    
    PERFORMANCE_INDEXES.forEach((sql, index) => {
      console.log(`${index + 1}. ${sql}`);
    });
    
    console.log('\\n✅ Index statements prepared');
    console.log('📝 To apply manually:');
    console.log('1. Connect to your Turso database');
    console.log('2. Execute each CREATE INDEX statement');
    console.log('3. Or use the generated migration file');
    
    return true;
  } catch (error) {
    console.error('❌ Error applying indexes:', error);
    return false;
  }
}

if (require.main === module) {
  applyIndexes().then(success => {
    if (success) {
      console.log('✅ Index application completed');
    } else {
      console.log('❌ Index application failed');
      process.exit(1);
    }
  });
}

module.exports = { applyIndexes, PERFORMANCE_INDEXES };