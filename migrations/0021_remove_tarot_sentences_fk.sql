-- Migration: Remove foreign key constraint from tarot_custom_sentences
-- Purpose: Allow sentences to be created without requiring userId to exist in users table
-- Date: 2025-01-23

-- SQLite doesn't support dropping foreign key constraints directly
-- We need to recreate the table without the foreign key constraint

-- Create new table without foreign key constraint
CREATE TABLE `tarot_custom_sentences_new` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`card_name` text NOT NULL,
	`is_reversed` integer DEFAULT false NOT NULL,
	`sentence` text NOT NULL,
	`is_custom` integer DEFAULT true NOT NULL,
	`source_type` text DEFAULT 'user' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);

-- Copy existing data to new table
INSERT INTO `tarot_custom_sentences_new` 
SELECT `id`, `user_id`, `card_name`, `is_reversed`, `sentence`, `is_custom`, `source_type`, `created_at`, `updated_at`
FROM `tarot_custom_sentences`;

-- Drop old table
DROP TABLE `tarot_custom_sentences`;

-- Rename new table to original name
ALTER TABLE `tarot_custom_sentences_new` RENAME TO `tarot_custom_sentences`;

-- Add back the indexes for performance
CREATE INDEX IF NOT EXISTS idx_tarot_sentences_user_card ON tarot_custom_sentences(user_id, card_name, is_reversed);
CREATE INDEX IF NOT EXISTS idx_tarot_sentences_user ON tarot_custom_sentences(user_id);