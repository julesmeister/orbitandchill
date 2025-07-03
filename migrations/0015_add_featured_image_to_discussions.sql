-- Add featured_image column to discussions table for blog post thumbnails
-- This stores the URL of the first image extracted from post content

ALTER TABLE discussions ADD COLUMN featured_image TEXT;