ALTER TABLE `analytics_traffic` ADD `location_permissions_granted` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `analytics_traffic` ADD `location_permissions_denied` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `analytics_traffic` ADD `location_fallback_used` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `analytics_traffic` ADD `location_errors` integer DEFAULT 0;