-- Migration: Disable foreign key checks for tarot_custom_sentences
-- Purpose: Allow sentences to be created without requiring userId to exist in users table
-- Date: 2025-01-23

-- Note: This approach works around the foreign key constraint by disabling FK checks
-- The table structure remains the same but constraints are not enforced

PRAGMA foreign_keys = OFF;