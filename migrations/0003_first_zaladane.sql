CREATE TABLE `premium_features` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`category` text NOT NULL,
	`is_enabled` integer DEFAULT true NOT NULL,
	`is_premium` integer DEFAULT false NOT NULL,
	`component` text,
	`section` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_discussion_replies` (
	`id` text PRIMARY KEY NOT NULL,
	`discussion_id` text NOT NULL,
	`author_id` text,
	`content` text NOT NULL,
	`parent_reply_id` text,
	`upvotes` integer DEFAULT 0,
	`downvotes` integer DEFAULT 0,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`discussion_id`) REFERENCES `discussions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_discussion_replies`("id", "discussion_id", "author_id", "content", "parent_reply_id", "upvotes", "downvotes", "created_at", "updated_at") SELECT "id", "discussion_id", "author_id", "content", "parent_reply_id", "upvotes", "downvotes", "created_at", "updated_at" FROM `discussion_replies`;--> statement-breakpoint
DROP TABLE `discussion_replies`;--> statement-breakpoint
ALTER TABLE `__new_discussion_replies` RENAME TO `discussion_replies`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_natal_charts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`chart_data` text NOT NULL,
	`metadata` text NOT NULL,
	`chart_type` text NOT NULL,
	`subject_name` text NOT NULL,
	`date_of_birth` text NOT NULL,
	`time_of_birth` text NOT NULL,
	`location_of_birth` text NOT NULL,
	`latitude` real NOT NULL,
	`longitude` real NOT NULL,
	`title` text,
	`description` text,
	`theme` text DEFAULT 'default',
	`is_public` integer DEFAULT false,
	`share_token` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_natal_charts`("id", "user_id", "chart_data", "metadata", "chart_type", "subject_name", "date_of_birth", "time_of_birth", "location_of_birth", "latitude", "longitude", "title", "description", "theme", "is_public", "share_token", "created_at", "updated_at") SELECT "id", "user_id", "chart_data", "metadata", "chart_type", "subject_name", "date_of_birth", "time_of_birth", "location_of_birth", "latitude", "longitude", "title", "description", "theme", "is_public", "share_token", "created_at", "updated_at" FROM `natal_charts`;--> statement-breakpoint
DROP TABLE `natal_charts`;--> statement-breakpoint
ALTER TABLE `__new_natal_charts` RENAME TO `natal_charts`;--> statement-breakpoint
ALTER TABLE `discussions` ADD `author_name` text NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `email_notifications` integer DEFAULT true;--> statement-breakpoint
ALTER TABLE `users` ADD `weekly_newsletter` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `discussion_notifications` integer DEFAULT true;--> statement-breakpoint
ALTER TABLE `users` ADD `chart_reminders` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `default_chart_theme` text DEFAULT 'default';--> statement-breakpoint
ALTER TABLE `users` ADD `timezone` text DEFAULT 'UTC';--> statement-breakpoint
ALTER TABLE `users` ADD `language` text DEFAULT 'en';--> statement-breakpoint
ALTER TABLE `users` ADD `subscription_tier` text DEFAULT 'free';--> statement-breakpoint
ALTER TABLE `categories` DROP COLUMN `color`;--> statement-breakpoint
ALTER TABLE `tags` DROP COLUMN `color`;