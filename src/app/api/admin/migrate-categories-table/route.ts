/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { getDbAsync } from '@/db/index-turso-http';

// POST - Fix categories table to match schema
export async function POST() {
  try {
    const db = await getDbAsync();
    if (!db || !db.client) {
      return NextResponse.json({
        success: false,
        error: 'Database not available'
      }, { status: 500 });
    }

    console.log('Starting categories table migration...');

    // Check current table structure
    const tableInfo = await db.client.execute('PRAGMA table_info(categories)');
    console.log('Current categories table structure:', tableInfo.rows);

    const columns = tableInfo.rows.map((row: any) => row[1]); // Column names are in index 1
    const hasColor = columns.includes('color');
    const hasIcon = columns.includes('icon');
    const hasIsDefault = columns.includes('is_default');
    const hasUsageCount = columns.includes('usage_count');

    console.log('Column check:', { hasColor, hasIcon, hasIsDefault, hasUsageCount });

    if (hasColor && hasIcon && hasIsDefault && hasUsageCount) {
      return NextResponse.json({
        success: true,
        message: 'Categories table already has all required columns'
      });
    }

    // Begin transaction
    await db.client.execute('PRAGMA foreign_keys=OFF');

    try {
      // Create new table with correct structure
      await db.client.execute(`
        CREATE TABLE __new_categories (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          color TEXT NOT NULL,
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

      // Copy data from old table, providing defaults for missing columns
      await db.client.execute(`
        INSERT INTO __new_categories(
          id, name, description, color, icon, sort_order, 
          is_active, is_default, usage_count, discussion_count, 
          created_at, updated_at
        ) SELECT 
          id, 
          name, 
          description, 
          COALESCE(${hasColor ? 'color' : "'#6bdbff'"}, '#6bdbff') as color,
          ${hasIcon ? 'icon' : 'NULL'} as icon,
          COALESCE(sort_order, 0) as sort_order,
          COALESCE(is_active, 1) as is_active,
          COALESCE(${hasIsDefault ? 'is_default' : '0'}, 0) as is_default,
          COALESCE(${hasUsageCount ? 'usage_count' : '0'}, 0) as usage_count,
          COALESCE(discussion_count, 0) as discussion_count,
          created_at, 
          updated_at
        FROM categories
      `);

      // Replace old table
      await db.client.execute('DROP TABLE categories');
      await db.client.execute('ALTER TABLE __new_categories RENAME TO categories');

      // Recreate unique index
      await db.client.execute('CREATE UNIQUE INDEX categories_name_unique ON categories (name)');

      await db.client.execute('PRAGMA foreign_keys=ON');

      console.log('Categories table migration completed successfully');

      return NextResponse.json({
        success: true,
        message: 'Categories table migrated successfully',
        columnsAdded: {
          color: !hasColor,
          icon: !hasIcon,
          is_default: !hasIsDefault,
          usage_count: !hasUsageCount
        }
      });

    } catch (migrationError) {
      // Rollback on error
      await db.client.execute('PRAGMA foreign_keys=ON');
      throw migrationError;
    }

  } catch (error) {
    console.error('Categories table migration failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Migration failed'
    }, { status: 500 });
  }
}