#!/usr/bin/env node
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function fixCategoriesTable() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  console.log('Connecting to Turso database...');

  try {
    // Check current table structure
    console.log('Checking current categories table structure...');
    const tableInfo = await client.execute('PRAGMA table_info(categories)');
    console.log('Current columns:', tableInfo.rows.map(row => row[1]));

    const columns = tableInfo.rows.map(row => row[1]);
    const hasColor = columns.includes('color');
    const hasIcon = columns.includes('icon');
    const hasIsDefault = columns.includes('is_default');
    const hasUsageCount = columns.includes('usage_count');

    console.log('Missing columns check:', {
      color: !hasColor,
      icon: !hasIcon,
      is_default: !hasIsDefault,
      usage_count: !hasUsageCount
    });

    if (hasColor && hasIcon && hasIsDefault && hasUsageCount) {
      console.log('✅ Categories table already has all required columns');
      return;
    }

    console.log('🔧 Fixing categories table...');

    // Disable foreign keys
    await client.execute('PRAGMA foreign_keys=OFF');

    // Create new table with correct structure
    await client.execute(`
      CREATE TABLE __new_categories (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        color TEXT NOT NULL DEFAULT '#6bdbff',
        icon TEXT,
        sort_order INTEGER DEFAULT 0 NOT NULL,
        is_active INTEGER DEFAULT 1 NOT NULL,
        is_default INTEGER DEFAULT 0 NOT NULL,
        usage_count INTEGER DEFAULT 0 NOT NULL,
        discussion_count INTEGER DEFAULT 0 NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `);

    // Copy existing data to new table
    const existingData = await client.execute('SELECT * FROM categories');
    console.log(`Found ${existingData.rows.length} existing categories to migrate`);

    for (const row of existingData.rows) {
      await client.execute({
        sql: `INSERT INTO __new_categories 
              (id, name, description, color, icon, sort_order, is_active, is_default, usage_count, discussion_count, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          row[0], // id
          row[1], // name
          row[2], // description
          '#6bdbff', // color (default)
          null, // icon
          row[3] || 0, // sort_order
          row[4] || 1, // is_active
          0, // is_default
          0, // usage_count
          row[5] || 0, // discussion_count
          row[6], // created_at
          row[7]  // updated_at
        ]
      });
    }

    // Replace old table with new one
    await client.execute('DROP TABLE categories');
    await client.execute('ALTER TABLE __new_categories RENAME TO categories');

    // Recreate unique index
    await client.execute('CREATE UNIQUE INDEX categories_name_unique ON categories (name)');

    // Re-enable foreign keys
    await client.execute('PRAGMA foreign_keys=ON');

    console.log('✅ Categories table fixed successfully!');

    // Verify the fix
    const newTableInfo = await client.execute('PRAGMA table_info(categories)');
    console.log('New table structure:', newTableInfo.rows.map(row => `${row[1]} (${row[2]})`));

  } catch (error) {
    console.error('❌ Failed to fix categories table:', error);
    // Try to re-enable foreign keys on error
    try {
      await client.execute('PRAGMA foreign_keys=ON');
    } catch (fkError) {
      console.error('Also failed to re-enable foreign keys:', fkError);
    }
    process.exit(1);
  }
}

fixCategoriesTable();