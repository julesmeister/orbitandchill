CREATE TABLE `custom_ai_models` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`model_name` text NOT NULL,
	`display_name` text NOT NULL,
	`description` text,
	`is_active` integer DEFAULT true NOT NULL,
	`is_default` integer DEFAULT false NOT NULL,
	`usage_count` integer DEFAULT 0 NOT NULL,
	`last_used` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `seed_user_configs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`writing_style` text NOT NULL,
	`expertise_areas` text NOT NULL,
	`response_pattern` text NOT NULL,
	`reply_probability` real NOT NULL,
	`voting_behavior` text NOT NULL,
	`ai_prompt_template` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `seeding_batches` (
	`id` text PRIMARY KEY NOT NULL,
	`source_type` text NOT NULL,
	`source_content` text NOT NULL,
	`processed_content` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`discussions_created` integer DEFAULT 0 NOT NULL,
	`replies_created` integer DEFAULT 0 NOT NULL,
	`votes_created` integer DEFAULT 0 NOT NULL,
	`errors` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tarot_leaderboard` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`username` text NOT NULL,
	`total_score` integer DEFAULT 0 NOT NULL,
	`total_cards` integer DEFAULT 0 NOT NULL,
	`cards_completed` integer DEFAULT 0 NOT NULL,
	`cards_mastered` integer DEFAULT 0 NOT NULL,
	`overall_accuracy` real DEFAULT 0 NOT NULL,
	`average_score` real DEFAULT 0 NOT NULL,
	`highest_single_score` integer DEFAULT 0 NOT NULL,
	`perfect_interpretations` integer DEFAULT 0 NOT NULL,
	`games_played` integer DEFAULT 0 NOT NULL,
	`sessions_this_week` integer DEFAULT 0 NOT NULL,
	`current_streak` integer DEFAULT 0 NOT NULL,
	`longest_streak` integer DEFAULT 0 NOT NULL,
	`level` text DEFAULT 'novice' NOT NULL,
	`achievements` text,
	`badges` text,
	`rank` integer,
	`category_ranks` text,
	`total_time_spent` integer DEFAULT 0 NOT NULL,
	`last_played` integer,
	`first_played` integer,
	`weekly_score` integer DEFAULT 0 NOT NULL,
	`weekly_games` integer DEFAULT 0 NOT NULL,
	`week_start_date` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tarot_progress` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`card_id` text NOT NULL,
	`total_attempts` integer DEFAULT 0 NOT NULL,
	`correct_interpretations` integer DEFAULT 0 NOT NULL,
	`total_score` integer DEFAULT 0 NOT NULL,
	`average_score` real DEFAULT 0 NOT NULL,
	`highest_score` integer DEFAULT 0 NOT NULL,
	`upright_attempts` integer DEFAULT 0 NOT NULL,
	`upright_score` integer DEFAULT 0 NOT NULL,
	`upright_average` real DEFAULT 0 NOT NULL,
	`reversed_attempts` integer DEFAULT 0 NOT NULL,
	`reversed_score` integer DEFAULT 0 NOT NULL,
	`reversed_average` real DEFAULT 0 NOT NULL,
	`familiarity_level` text DEFAULT 'novice' NOT NULL,
	`mastery_percentage` real DEFAULT 0 NOT NULL,
	`last_played` integer,
	`first_played` integer,
	`consecutive_correct` integer DEFAULT 0 NOT NULL,
	`learning_streak` integer DEFAULT 0 NOT NULL,
	`recent_performance` text,
	`weakness_areas` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tarot_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`card_id` text NOT NULL,
	`situation` text NOT NULL,
	`user_interpretation` text NOT NULL,
	`ai_evaluation` text NOT NULL,
	`score` integer NOT NULL,
	`accuracy_rating` text NOT NULL,
	`keyword_accuracy` real DEFAULT 0 NOT NULL,
	`context_relevance` real DEFAULT 0 NOT NULL,
	`traditional_alignment` real DEFAULT 0 NOT NULL,
	`creativity_bonus` real DEFAULT 0 NOT NULL,
	`strengths_identified` text,
	`improvement_areas` text,
	`recommended_study` text,
	`time_spent` integer,
	`session_type` text DEFAULT 'practice' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user_activity` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`activity_type` text NOT NULL,
	`entity_type` text,
	`entity_id` text,
	`description` text NOT NULL,
	`metadata` text,
	`ip_address` text,
	`user_agent` text,
	`session_id` text,
	`page_url` text,
	`referrer` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_user_activity`("id", "user_id", "activity_type", "entity_type", "entity_id", "description", "metadata", "ip_address", "user_agent", "session_id", "page_url", "referrer", "created_at") SELECT "id", "user_id", "activity_type", "entity_type", "entity_id", "description", "metadata", "ip_address", "user_agent", "session_id", "page_url", "referrer", "created_at" FROM `user_activity`;--> statement-breakpoint
DROP TABLE `user_activity`;--> statement-breakpoint
ALTER TABLE `__new_user_activity` RENAME TO `user_activity`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `categories` ADD `color` text NOT NULL;--> statement-breakpoint
ALTER TABLE `categories` ADD `is_default` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `categories` ADD `usage_count` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `discussion_replies` ADD `author_name` text NOT NULL;--> statement-breakpoint
ALTER TABLE `discussions` ADD `slug` text NOT NULL;--> statement-breakpoint
ALTER TABLE `discussions` ADD `featured_image` text;