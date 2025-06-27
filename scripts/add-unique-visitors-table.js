#!/usr/bin/env node

// Script to add analytics_unique_visitors table for proper unique visitor tracking
const { createClient } = require('@libsql/client/http');
require('dotenv').config({ path: '.env.local' });

async function addUniqueVisitorsTable() {
  console.log('🔧 Adding analytics_unique_visitors table...');

  try {
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    // Test connection
    await client.execute('SELECT 1 as test');
    console.log('✅ Connected to Turso database');

    // Create analytics_unique_visitors table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS analytics_unique_visitors (
        id TEXT PRIMARY KEY,
        visitor_hash TEXT NOT NULL,
        ip_address TEXT NOT NULL,
        user_agent TEXT NOT NULL,
        date TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        UNIQUE(visitor_hash, date)
      )
    `;

    await client.execute(createTableSQL);
    console.log('✅ Created analytics_unique_visitors table');

    // Create indexes for performance
    const createIndexes = [
      'CREATE INDEX IF NOT EXISTS idx_unique_visitors_hash_date ON analytics_unique_visitors(visitor_hash, date)',
      'CREATE INDEX IF NOT EXISTS idx_unique_visitors_date ON analytics_unique_visitors(date)',
      'CREATE INDEX IF NOT EXISTS idx_unique_visitors_created_at ON analytics_unique_visitors(created_at)'
    ];

    for (const indexSQL of createIndexes) {
      await client.execute(indexSQL);
    }
    console.log('✅ Created indexes for analytics_unique_visitors table');

    console.log('🎉 Analytics unique visitors table setup complete!');
    console.log('📊 This will fix the issue where daily visitors were incrementing on every page refresh.');
    console.log('🔍 Now tracking unique visitors per day using IP address + User Agent + Date hash.');

  } catch (error) {
    console.error('❌ Error setting up unique visitors table:', error);
    console.error('Please check your database connection and try again.');
    process.exit(1);
  }
}

addUniqueVisitorsTable();