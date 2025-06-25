CREATE TABLE `admin_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`refresh_token` text,
	`is_active` integer DEFAULT true NOT NULL,
	`expires_at` integer NOT NULL,
	`refresh_expires_at` integer,
	`ip_address` text,
	`user_agent` text,
	`login_method` text NOT NULL,
	`last_activity` integer NOT NULL,
	`failed_attempts` integer DEFAULT 0,
	`locked_until` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admin_sessions_token_unique` ON `admin_sessions` (`token`);--> statement-breakpoint
CREATE TABLE `horary_questions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`question` text NOT NULL,
	`date` integer NOT NULL,
	`location` text,
	`latitude` real,
	`longitude` real,
	`timezone` text,
	`answer` text,
	`timing` text,
	`interpretation` text,
	`chart_data` text,
	`chart_svg` text,
	`ascendant_degree` real,
	`moon_sign` text,
	`moon_void_of_course` integer,
	`planetary_hour` text,
	`is_radical` integer,
	`chart_warnings` text,
	`category` text,
	`tags` text,
	`is_shared` integer DEFAULT false,
	`share_token` text,
	`aspect_count` integer,
	`retrograde_count` integer,
	`significator_planet` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `discussions` ADD `embedded_chart` text;--> statement-breakpoint
ALTER TABLE `discussions` ADD `embedded_video` text;--> statement-breakpoint
ALTER TABLE `users` ADD `role` text DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `permissions` text;--> statement-breakpoint
ALTER TABLE `users` ADD `is_active` integer DEFAULT true;