-- Migration: Add unique constraint to prevent duplicate people
-- This ensures that a user cannot have multiple people with the same birth data and relationship

-- Create a unique index to prevent duplicate people
CREATE UNIQUE INDEX `idx_people_unique_birth_data` ON `people` (`user_id`, `relationship`, `date_of_birth`, `time_of_birth`, `coordinates`);

-- Also add a unique constraint for default people (only one default per user)
CREATE UNIQUE INDEX `idx_people_unique_default` ON `people` (`user_id`, `is_default`) WHERE `is_default` = 1;