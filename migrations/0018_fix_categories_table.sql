-- Fix categories table to match schema
PRAGMA foreign_keys=OFF;

-- Add missing columns to categories table if they don't exist
-- This handles cases where the table exists but is missing columns

-- First, check current structure and add missing columns
ALTER TABLE categories ADD COLUMN color text;
ALTER TABLE categories ADD COLUMN icon text;
ALTER TABLE categories ADD COLUMN is_default integer DEFAULT false NOT NULL;
ALTER TABLE categories ADD COLUMN usage_count integer DEFAULT 0 NOT NULL;

-- Update any null color values with a default
UPDATE categories SET color = '#6bdbff' WHERE color IS NULL;

-- Make color NOT NULL after setting defaults
-- Since SQLite doesn't support ALTER COLUMN, we need to recreate the table
CREATE TABLE `__new_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`color` text NOT NULL,
	`icon` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`is_default` integer DEFAULT false NOT NULL,
	`usage_count` integer DEFAULT 0 NOT NULL,
	`discussion_count` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);

-- Copy data from old table
INSERT INTO `__new_categories`(
	`id`, `name`, `description`, `color`, `icon`, `sort_order`, 
	`is_active`, `is_default`, `usage_count`, `discussion_count`, 
	`created_at`, `updated_at`
) SELECT 
	`id`, `name`, `description`, 
	COALESCE(`color`, '#6bdbff') as `color`,
	`icon`, 
	COALESCE(`sort_order`, 0) as `sort_order`,
	COALESCE(`is_active`, 1) as `is_active`,
	COALESCE(`is_default`, 0) as `is_default`,
	COALESCE(`usage_count`, 0) as `usage_count`,
	COALESCE(`discussion_count`, 0) as `discussion_count`,
	`created_at`, `updated_at`
FROM `categories`;

-- Replace old table
DROP TABLE `categories`;
ALTER TABLE `__new_categories` RENAME TO `categories`;

-- Recreate unique index
CREATE UNIQUE INDEX `categories_name_unique` ON `categories` (`name`);

PRAGMA foreign_keys=ON;