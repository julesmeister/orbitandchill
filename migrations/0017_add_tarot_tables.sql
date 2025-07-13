-- Migration: Add Tarot Learning Game Tables
-- Created: 2025-01-13

-- Table for tracking user progress with individual tarot cards
CREATE TABLE IF NOT EXISTS tarot_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  card_id TEXT NOT NULL,
  familiarity_level TEXT NOT NULL DEFAULT 'novice',
  mastery_percentage INTEGER NOT NULL DEFAULT 0,
  total_attempts INTEGER NOT NULL DEFAULT 0,
  total_score INTEGER NOT NULL DEFAULT 0,
  average_score REAL NOT NULL DEFAULT 0,
  best_score INTEGER NOT NULL DEFAULT 0,
  learning_streak INTEGER NOT NULL DEFAULT 0,
  last_attempt_date TEXT,
  
  -- Upright vs Reversed specific tracking
  upright_attempts INTEGER NOT NULL DEFAULT 0,
  upright_score INTEGER NOT NULL DEFAULT 0,
  upright_average REAL NOT NULL DEFAULT 0,
  reversed_attempts INTEGER NOT NULL DEFAULT 0,
  reversed_score INTEGER NOT NULL DEFAULT 0,
  reversed_average REAL NOT NULL DEFAULT 0,
  
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  
  -- Constraints
  UNIQUE(user_id, card_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table for storing individual tarot learning sessions
CREATE TABLE IF NOT EXISTS tarot_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  card_id TEXT NOT NULL,
  situation TEXT NOT NULL,
  user_interpretation TEXT NOT NULL,
  ai_feedback TEXT,
  score INTEGER NOT NULL DEFAULT 0,
  
  -- Scoring breakdown
  keyword_accuracy_score INTEGER NOT NULL DEFAULT 0,
  traditional_alignment_score INTEGER NOT NULL DEFAULT 0,
  context_relevance_score INTEGER NOT NULL DEFAULT 0,
  creativity_bonus INTEGER NOT NULL DEFAULT 0,
  
  -- Session metadata
  session_duration INTEGER, -- in seconds
  card_orientation TEXT DEFAULT 'upright', -- 'upright' or 'reversed'
  difficulty_level TEXT DEFAULT 'beginner',
  
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  
  -- Foreign key constraints
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table for global leaderboard and rankings
CREATE TABLE IF NOT EXISTS tarot_leaderboard (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  total_score INTEGER NOT NULL DEFAULT 0,
  total_cards_attempted INTEGER NOT NULL DEFAULT 0,
  cards_mastered INTEGER NOT NULL DEFAULT 0,
  accuracy_percentage REAL NOT NULL DEFAULT 0,
  learning_streak INTEGER NOT NULL DEFAULT 0,
  
  -- Time-based statistics
  weekly_score INTEGER NOT NULL DEFAULT 0,
  monthly_score INTEGER NOT NULL DEFAULT 0,
  weekly_rank INTEGER,
  monthly_rank INTEGER,
  all_time_rank INTEGER,
  
  -- Achievement tracking
  perfect_scores INTEGER NOT NULL DEFAULT 0,
  consecutive_days INTEGER NOT NULL DEFAULT 0,
  favorite_suit TEXT,
  
  last_activity_date TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  
  -- Constraints
  UNIQUE(user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_tarot_progress_user_id ON tarot_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_tarot_progress_card_id ON tarot_progress(card_id);
CREATE INDEX IF NOT EXISTS idx_tarot_progress_mastery ON tarot_progress(mastery_percentage DESC);
CREATE INDEX IF NOT EXISTS idx_tarot_progress_updated ON tarot_progress(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_tarot_sessions_user_id ON tarot_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_tarot_sessions_card_id ON tarot_sessions(card_id);
CREATE INDEX IF NOT EXISTS idx_tarot_sessions_score ON tarot_sessions(score DESC);
CREATE INDEX IF NOT EXISTS idx_tarot_sessions_created ON tarot_sessions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_tarot_leaderboard_total_score ON tarot_leaderboard(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_tarot_leaderboard_accuracy ON tarot_leaderboard(accuracy_percentage DESC);
CREATE INDEX IF NOT EXISTS idx_tarot_leaderboard_weekly ON tarot_leaderboard(weekly_score DESC);
CREATE INDEX IF NOT EXISTS idx_tarot_leaderboard_monthly ON tarot_leaderboard(monthly_score DESC);
CREATE INDEX IF NOT EXISTS idx_tarot_leaderboard_updated ON tarot_leaderboard(updated_at DESC);