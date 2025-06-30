-- Migration: Add analytics_unique_visitors table
-- Description: Track unique visitors per day to fix visitor counting bug
-- Date: 2025-06-27

CREATE TABLE IF NOT EXISTS analytics_unique_visitors (
  id TEXT PRIMARY KEY,
  visitor_hash TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  user_agent TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  UNIQUE(visitor_hash, date)
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_unique_visitors_hash_date ON analytics_unique_visitors(visitor_hash, date);
CREATE INDEX IF NOT EXISTS idx_unique_visitors_date ON analytics_unique_visitors(date);
CREATE INDEX IF NOT EXISTS idx_unique_visitors_created_at ON analytics_unique_visitors(created_at);