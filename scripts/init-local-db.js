#!/usr/bin/env node

/**
 * Initialize a local SQLite database for development
 * This creates a local database file without needing Turso credentials
 */

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Create local database
const dbPath = path.join(__dirname, '..', 'local.db');
console.log('📦 Creating local SQLite database at:', dbPath);

// Remove existing database if it exists
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('🗑️  Removed existing database');
}

const db = new Database(dbPath);

// Create all tables
const createTables = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT,
  profile_picture_url TEXT,
  auth_provider TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  date_of_birth TEXT,
  time_of_birth TEXT,
  location_of_birth TEXT,
  latitude REAL,
  longitude REAL,
  sun_sign TEXT,
  stellium_signs TEXT DEFAULT '[]',
  stellium_houses TEXT DEFAULT '[]',
  has_natal_chart BOOLEAN DEFAULT 0,
  show_zodiac_publicly BOOLEAN DEFAULT 1,
  show_stelliums_publicly BOOLEAN DEFAULT 0,
  show_birth_info_publicly BOOLEAN DEFAULT 0,
  allow_direct_messages BOOLEAN DEFAULT 1,
  show_online_status BOOLEAN DEFAULT 1,
  current_location_name TEXT,
  current_latitude REAL,
  current_longitude REAL,
  current_location_updated_at DATETIME,
  subscription_tier TEXT DEFAULT 'free',
  is_deleted BOOLEAN DEFAULT 0,
  deleted_at DATETIME,
  deletion_requested_at DATETIME,
  deletion_confirmed_at DATETIME,
  deletion_type TEXT,
  grace_period_ends DATETIME,
  detailed_stelliums TEXT DEFAULT '[]',
  chart_positions TEXT
);

-- Discussions table
CREATE TABLE IF NOT EXISTS discussions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT DEFAULT '[]',
  replies INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  is_locked BOOLEAN DEFAULT 0,
  is_pinned BOOLEAN DEFAULT 0,
  is_blog_post BOOLEAN DEFAULT 0,
  is_published BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
  embedded_chart TEXT,
  embedded_video TEXT
);

-- Analytics traffic table
CREATE TABLE IF NOT EXISTS analytics_traffic (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  visitors INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  page_views INTEGER DEFAULT 0,
  charts_generated INTEGER DEFAULT 0,
  discussions_created INTEGER DEFAULT 0,
  avg_session_duration INTEGER DEFAULT 0,
  bounce_rate REAL DEFAULT 0,
  new_vs_returning TEXT,
  top_pages TEXT,
  top_referrers TEXT,
  device_breakdown TEXT,
  location_breakdown TEXT,
  location_requests INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Other essential tables
CREATE TABLE IF NOT EXISTS natal_charts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  date_of_birth TEXT NOT NULL,
  time_of_birth TEXT NOT NULL,
  location_of_birth TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  chart_data TEXT NOT NULL,
  chart_type TEXT DEFAULT 'natal',
  is_public BOOLEAN DEFAULT 0,
  share_token TEXT,
  theme TEXT DEFAULT 'light',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS astrological_events (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT,
  type TEXT NOT NULL,
  description TEXT,
  aspects TEXT,
  planetary_positions TEXT,
  score INTEGER,
  is_generated BOOLEAN DEFAULT 0,
  is_bookmarked BOOLEAN DEFAULT 0,
  priorities TEXT,
  time_window TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_by TEXT
);

CREATE TABLE IF NOT EXISTS user_activity (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  description TEXT NOT NULL,
  metadata TEXT,
  ip_address TEXT,
  user_agent TEXT,
  session_id TEXT,
  page_url TEXT,
  referrer TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

// Execute table creation
db.exec(createTables);
console.log('✅ Created all database tables');

// Insert some initial data
const insertInitialData = `
-- Insert test users
INSERT INTO users (id, username, email, auth_provider, has_natal_chart) VALUES
  ('user_1', 'AstroExplorer', 'astro@example.com', 'google', 1),
  ('user_2', 'StarSeeker', 'star@example.com', 'google', 1),
  ('anon_test123', 'Anonymous User', NULL, 'anonymous', 0);

-- Insert test discussions
INSERT INTO discussions (id, title, excerpt, content, author_id, author_name, category, is_published) VALUES
  ('disc_1', 'Understanding Your Rising Sign', 'Your rising sign is the zodiac sign that was ascending...', 'Full content here...', 'user_1', 'AstroExplorer', 'Natal Chart Analysis', 1),
  ('disc_2', 'Venus Retrograde Tips', 'When Venus goes retrograde, relationships and values...', 'Full content here...', 'user_2', 'StarSeeker', 'Transits & Predictions', 1),
  ('disc_3', 'Beginner Guide to Houses', 'The 12 houses in astrology represent different areas...', 'Full content here...', 'user_1', 'AstroExplorer', 'Learning Resources', 1);

-- Insert analytics data
INSERT INTO analytics_traffic (id, date, visitors, page_views, charts_generated) VALUES
  ('analytics_1', date('now'), 25, 87, 5),
  ('analytics_2', date('now', '-1 day'), 32, 124, 8),
  ('analytics_3', date('now', '-2 days'), 28, 96, 6);
`;

db.exec(insertInitialData);
console.log('✅ Inserted initial test data');

// Close database
db.close();

console.log(`
🎉 Local database initialized successfully!

To use this database, create a .env.local file with:

DATABASE_URL=file:${dbPath}

Then restart your development server.
`);