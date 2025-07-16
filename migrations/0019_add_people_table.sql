-- Migration: Add people table for chart subjects
-- This table stores people that users can generate charts for

CREATE TABLE `people` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`relationship` text NOT NULL, -- 'self', 'family', 'friend', 'partner', 'colleague', 'other'
	`date_of_birth` text NOT NULL,
	`time_of_birth` text NOT NULL,
	`location_of_birth` text NOT NULL,
	`coordinates` text NOT NULL, -- JSON string with {lat, lon}
	`notes` text,
	`is_default` integer DEFAULT false,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);

-- Create indexes for better performance
CREATE INDEX `idx_people_user_id` ON `people` (`user_id`);
CREATE INDEX `idx_people_user_default` ON `people` (`user_id`, `is_default`);
CREATE INDEX `idx_people_relationship` ON `people` (`user_id`, `relationship`);
CREATE INDEX `idx_people_updated_at` ON `people` (`updated_at`);