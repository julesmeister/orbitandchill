-- Migration: Add horary activity types to user_activity table
-- This adds support for horary question tracking in the analytics system

-- Note: SQLite doesn't support ALTER TABLE to modify enum constraints
-- Since this is a text field with check constraints, we'll handle this at the application level
-- The schema.ts file has been updated to include the new activity types

-- No SQL changes needed - SQLite text fields with enum constraints are handled by the ORM
-- The updated schema.ts will enforce the new activity types and entity types

-- Activity types added:
-- - 'horary_question_submitted'

-- Entity types added:
-- - 'horary'