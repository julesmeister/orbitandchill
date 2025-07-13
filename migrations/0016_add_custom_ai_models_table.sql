-- Migration: Add custom_ai_models table for user-defined AI model endpoints
-- Date: 2025-01-12

CREATE TABLE IF NOT EXISTS custom_ai_models (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Model configuration
  provider_id TEXT NOT NULL, -- 'openrouter', 'openai', 'claude', etc.
  model_name TEXT NOT NULL, -- The model identifier/endpoint
  display_name TEXT NOT NULL, -- User-friendly name for the model
  description TEXT, -- Optional description
  
  -- Model settings
  is_active INTEGER NOT NULL DEFAULT 1, -- Boolean: 1 = active, 0 = inactive
  is_default INTEGER NOT NULL DEFAULT 0, -- Boolean: 1 = default, 0 = not default
  
  -- Usage tracking
  usage_count INTEGER NOT NULL DEFAULT 0,
  last_used INTEGER, -- Timestamp
  
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_custom_ai_models_user_id ON custom_ai_models(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_ai_models_provider ON custom_ai_models(user_id, provider_id);
CREATE INDEX IF NOT EXISTS idx_custom_ai_models_active ON custom_ai_models(user_id, provider_id, is_active) WHERE is_active = 1;