ALTER TABLE `users` ADD `current_location_name` text;--> statement-breakpoint
ALTER TABLE `users` ADD `current_latitude` real;--> statement-breakpoint
ALTER TABLE `users` ADD `current_longitude` real;--> statement-breakpoint
ALTER TABLE `users` ADD `current_location_updated_at` integer;