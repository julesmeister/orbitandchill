CREATE TABLE `people` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`relationship` text NOT NULL,
	`date_of_birth` text NOT NULL,
	`time_of_birth` text NOT NULL,
	`location_of_birth` text NOT NULL,
	`coordinates` text NOT NULL,
	`notes` text,
	`is_default` integer DEFAULT false,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tarot_custom_sentences` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`card_name` text NOT NULL,
	`is_reversed` integer DEFAULT false NOT NULL,
	`sentence` text NOT NULL,
	`is_custom` integer DEFAULT true NOT NULL,
	`source_type` text DEFAULT 'user' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
