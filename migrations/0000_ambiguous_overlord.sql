CREATE TABLE `admin_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`type` text NOT NULL,
	`category` text NOT NULL,
	`description` text,
	`updated_at` integer NOT NULL,
	`updated_by` text,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `analytics_engagement` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`discussions_created` integer DEFAULT 0,
	`replies_posted` integer DEFAULT 0,
	`charts_generated` integer DEFAULT 0,
	`active_users` integer DEFAULT 0,
	`popular_discussions` text,
	`top_contributors` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `analytics_traffic` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`visitors` integer DEFAULT 0,
	`page_views` integer DEFAULT 0,
	`charts_generated` integer DEFAULT 0,
	`new_users` integer DEFAULT 0,
	`returning_users` integer DEFAULT 0,
	`avg_session_duration` integer DEFAULT 0,
	`bounce_rate` real DEFAULT 0,
	`top_pages` text,
	`traffic_sources` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `cache` (
	`key` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`expiry` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `discussion_replies` (
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
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`parent_reply_id`) REFERENCES `discussion_replies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `discussions` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`excerpt` text NOT NULL,
	`content` text NOT NULL,
	`author_id` text,
	`category` text NOT NULL,
	`tags` text,
	`replies` integer DEFAULT 0,
	`views` integer DEFAULT 0,
	`upvotes` integer DEFAULT 0,
	`downvotes` integer DEFAULT 0,
	`is_locked` integer DEFAULT false,
	`is_pinned` integer DEFAULT false,
	`is_blog_post` integer DEFAULT false,
	`is_published` integer DEFAULT true,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`last_activity` integer NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`event_type` text NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer,
	`location` text,
	`latitude` real,
	`longitude` real,
	`astrological_significance` text,
	`is_public` integer DEFAULT false,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `natal_charts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`chart_data` text NOT NULL,
	`chart_type` text NOT NULL,
	`title` text,
	`description` text,
	`theme` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`email` text,
	`profile_picture_url` text,
	`auth_provider` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`date_of_birth` text,
	`time_of_birth` text,
	`location_of_birth` text,
	`latitude` real,
	`longitude` real,
	`sun_sign` text,
	`stellium_signs` text,
	`stellium_houses` text,
	`has_natal_chart` integer DEFAULT false,
	`show_zodiac_publicly` integer DEFAULT false,
	`show_stelliums_publicly` integer DEFAULT false,
	`show_birth_info_publicly` integer DEFAULT false,
	`allow_direct_messages` integer DEFAULT true,
	`show_online_status` integer DEFAULT true
);
--> statement-breakpoint
CREATE TABLE `votes` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`discussion_id` text,
	`reply_id` text,
	`vote_type` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`discussion_id`) REFERENCES `discussions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`reply_id`) REFERENCES `discussion_replies`(`id`) ON UPDATE no action ON DELETE cascade
);
