-- Migration: Add detailed_stelliums column to users table
-- Purpose: Store detailed stellium data with planet information

-- Add detailed_stelliums column to users table
ALTER TABLE users ADD COLUMN detailed_stelliums TEXT;

-- The column will store JSON data with this structure:
-- [
--   {
--     "type": "sign",
--     "sign": "aquarius", 
--     "planets": [
--       {"name": "sun", "sign": "aquarius", "house": 11},
--       {"name": "mercury", "sign": "aquarius", "house": 11},
--       {"name": "venus", "sign": "aquarius", "house": 11}
--     ]
--   },
--   {
--     "type": "house",
--     "house": 11,
--     "planets": [
--       {"name": "sun", "sign": "aquarius", "house": 11},
--       {"name": "mercury", "sign": "aquarius", "house": 11},
--       {"name": "venus", "sign": "aquarius", "house": 11}
--     ]
--   }
-- ]