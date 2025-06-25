CREATE TABLE `account_deletion_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`requested_by` text NOT NULL,
	`request_type` text NOT NULL,
	`reason` text,
	`scheduled_for` integer,
	`grace_period_days` integer DEFAULT 30,
	`status` text DEFAULT 'pending' NOT NULL,
	`confirmation_token` text,
	`confirmation_sent_at` integer,
	`confirmed_at` integer,
	`processed_at` integer,
	`completed_at` integer,
	`data_cleanup_status` text,
	`recovery_data_path` text,
	`user_agent` text,
	`ip_address` text,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `admin_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`admin_user_id` text,
	`admin_username` text NOT NULL,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text,
	`description` text NOT NULL,
	`details` text,
	`before_values` text,
	`after_values` text,
	`ip_address` text,
	`user_agent` text,
	`request_url` text,
	`request_method` text,
	`severity` text DEFAULT 'medium' NOT NULL,
	`tags` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`admin_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `notification_preferences` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`enable_in_app` integer DEFAULT true NOT NULL,
	`enable_email` integer DEFAULT true NOT NULL,
	`enable_push` integer DEFAULT false NOT NULL,
	`enable_sms` integer DEFAULT false NOT NULL,
	`quiet_hours_enabled` integer DEFAULT false NOT NULL,
	`quiet_hours_start` text DEFAULT '22:00',
	`quiet_hours_end` text DEFAULT '08:00',
	`quiet_hours_timezone` text,
	`social_notifications` text DEFAULT '{"in_app": true, "email": true, "push": false}',
	`system_notifications` text DEFAULT '{"in_app": true, "email": false, "push": false}',
	`admin_notifications` text DEFAULT '{"in_app": true, "email": true, "push": true}',
	`premium_notifications` text DEFAULT '{"in_app": true, "email": true, "push": false}',
	`reminder_notifications` text DEFAULT '{"in_app": true, "email": false, "push": true}',
	`achievement_notifications` text DEFAULT '{"in_app": true, "email": false, "push": false}',
	`daily_digest` integer DEFAULT false NOT NULL,
	`weekly_digest` integer DEFAULT true NOT NULL,
	`digest_time` text DEFAULT '09:00',
	`digest_day_of_week` integer DEFAULT 1,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `notification_preferences_user_id_unique` ON `notification_preferences` (`user_id`);--> statement-breakpoint
CREATE TABLE `notification_templates` (
	`id` text PRIMARY KEY NOT NULL,
	`template_key` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`category` text NOT NULL,
	`title_template` text NOT NULL,
	`message_template` text NOT NULL,
	`email_subject_template` text,
	`email_body_template` text,
	`icon` text,
	`priority` text DEFAULT 'medium' NOT NULL,
	`default_delivery_methods` text DEFAULT '["in_app"]',
	`is_active` integer DEFAULT true NOT NULL,
	`requires_auth` integer DEFAULT true NOT NULL,
	`max_frequency` text,
	`available_placeholders` text,
	`validation_rules` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `notification_templates_template_key_unique` ON `notification_templates` (`template_key`);--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`message` text NOT NULL,
	`icon` text,
	`priority` text DEFAULT 'medium' NOT NULL,
	`category` text DEFAULT 'system' NOT NULL,
	`entity_type` text,
	`entity_id` text,
	`entity_url` text,
	`is_read` integer DEFAULT false NOT NULL,
	`read_at` integer,
	`is_archived` integer DEFAULT false NOT NULL,
	`archived_at` integer,
	`delivery_method` text DEFAULT 'in_app' NOT NULL,
	`delivered_at` integer,
	`email_sent` integer DEFAULT false,
	`email_sent_at` integer,
	`scheduled_for` integer,
	`expires_at` integer,
	`data` text,
	`tags` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_activity` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
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
ALTER TABLE `users` ADD `is_deleted` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `deleted_at` integer;--> statement-breakpoint
ALTER TABLE `users` ADD `deletion_type` text;--> statement-breakpoint
ALTER TABLE `users` ADD `deletion_reason` text;--> statement-breakpoint
ALTER TABLE `users` ADD `deletion_requested_at` integer;--> statement-breakpoint
ALTER TABLE `users` ADD `deletion_confirmed_at` integer;--> statement-breakpoint
ALTER TABLE `users` ADD `grace_period_ends` integer;--> statement-breakpoint
ALTER TABLE `users` ADD `deleted_by` text;--> statement-breakpoint
ALTER TABLE `astrological_events` DROP COLUMN `timing_method`;--> statement-breakpoint
ALTER TABLE `astrological_events` DROP COLUMN `electional_data`;