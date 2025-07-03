-- Migration: Add slug column to discussions table
-- Purpose: Add URL-friendly slug field for proper routing

-- Add slug column to discussions table
ALTER TABLE discussions ADD COLUMN slug TEXT NOT NULL DEFAULT '';

-- Update existing discussions with slugs generated from their titles
-- This will be handled by the application after the column is added
UPDATE discussions 
SET slug = LOWER(
  TRIM(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(
                REPLACE(
                  REPLACE(
                    REPLACE(
                      REPLACE(
                        REPLACE(title, ' ', '-'),
                        '!', ''
                      ),
                      '?', ''
                    ),
                    '.', ''
                  ),
                  ',', ''
                ),
                ';', ''
              ),
              ':', ''
            ),
            '(', ''
          ),
          ')', ''
        ),
        "'", ''
      ),
      '--', '-'
    ),
    '-'
  )
) 
WHERE slug = '' OR slug IS NULL;

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_discussions_slug ON discussions(slug);