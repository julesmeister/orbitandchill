#!/usr/bin/env node

// Script to create missing notification tables in Turso database
const { createClient } = require('@libsql/client/http');
require('dotenv').config({ path: '.env.local' });

async function createNotificationTables() {
  console.log('🔧 Creating notification tables...');

  try {
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    // Test connection
    await client.execute('SELECT 1 as test');
    console.log('✅ Connected to Turso database');

    // Create notifications table
    const createNotificationsSQL = `
      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        priority TEXT NOT NULL DEFAULT 'medium',
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        action_url TEXT,
        action_text TEXT,
        icon TEXT,
        metadata TEXT,
        delivery_method TEXT NOT NULL DEFAULT 'in_app',
        is_read INTEGER DEFAULT 0,
        is_archived INTEGER DEFAULT 0,
        read_at INTEGER,
        archived_at INTEGER,
        delivered_at INTEGER,
        failed_at INTEGER,
        retry_count INTEGER DEFAULT 0,
        scheduled_for INTEGER,
        expires_at INTEGER,
        template_id TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `;

    await client.execute(createNotificationsSQL);
    console.log('✅ Created notifications table');

    // Create notification_preferences table
    const createPreferencesSQL = `
      CREATE TABLE IF NOT EXISTS notification_preferences (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        enable_in_app INTEGER DEFAULT 1,
        enable_email INTEGER DEFAULT 1,
        enable_push INTEGER DEFAULT 0,
        enable_sms INTEGER DEFAULT 0,
        quiet_hours_enabled INTEGER DEFAULT 0,
        quiet_hours_start TEXT DEFAULT '22:00',
        quiet_hours_end TEXT DEFAULT '08:00',
        quiet_hours_timezone TEXT DEFAULT 'UTC',
        social_notifications TEXT DEFAULT '{"in_app": true, "email": true, "push": false}',
        system_notifications TEXT DEFAULT '{"in_app": true, "email": false, "push": false}',
        admin_notifications TEXT DEFAULT '{"in_app": true, "email": true, "push": true}',
        premium_notifications TEXT DEFAULT '{"in_app": true, "email": true, "push": false}',
        reminder_notifications TEXT DEFAULT '{"in_app": true, "email": false, "push": true}',
        achievement_notifications TEXT DEFAULT '{"in_app": true, "email": false, "push": false}',
        daily_digest INTEGER DEFAULT 0,
        weekly_digest INTEGER DEFAULT 1,
        digest_time TEXT DEFAULT '09:00',
        digest_day_of_week INTEGER DEFAULT 1,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `;

    await client.execute(createPreferencesSQL);
    console.log('✅ Created notification_preferences table');

    // Create notification_templates table
    const createTemplatesSQL = `
      CREATE TABLE IF NOT EXISTS notification_templates (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        priority TEXT NOT NULL DEFAULT 'medium',
        title_template TEXT NOT NULL,
        message_template TEXT NOT NULL,
        action_url_template TEXT,
        action_text_template TEXT,
        icon TEXT,
        delivery_method TEXT NOT NULL DEFAULT 'in_app',
        is_active INTEGER DEFAULT 1,
        variables TEXT,
        description TEXT,
        created_by TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `;

    await client.execute(createTemplatesSQL);
    console.log('✅ Created notification_templates table');

    // Create unique index for notification_preferences
    await client.execute(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_notification_preferences_user_id 
      ON notification_preferences(user_id)
    `);

    await client.execute(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_notification_templates_name 
      ON notification_templates(name)
    `);

    console.log('✅ Created database indexes');

    // Verify tables exist
    const tables = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name IN ('notifications', 'notification_preferences', 'notification_templates')
      ORDER BY name
    `);

    console.log('📊 Notification tables created:');
    tables.rows.forEach(row => {
      console.log(`  - ${row.name}`);
    });

    console.log('🎉 Notification tables successfully created!');

  } catch (error) {
    console.error('❌ Error creating notification tables:', error);
    process.exit(1);
  }
}

createNotificationTables();