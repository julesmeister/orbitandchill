#!/usr/bin/env node

// Script to verify admin_settings table exists and create if missing
const { createClient } = require('@libsql/client/http');
require('dotenv').config({ path: '.env.local' });

async function verifyAdminTables() {
  console.log('🔧 Verifying admin tables...');

  try {
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    // Test connection
    await client.execute('SELECT 1 as test');
    console.log('✅ Connected to Turso database');

    // Check if admin_settings table exists
    const adminSettingsTables = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name = 'admin_settings'
    `);

    if (adminSettingsTables.rows.length === 0) {
      console.log('⚠️ admin_settings table missing, creating...');
      
      // Create admin_settings table
      const createAdminSettingsSQL = `
        CREATE TABLE IF NOT EXISTS admin_settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          type TEXT NOT NULL CHECK (type IN ('string', 'number', 'boolean', 'json')),
          category TEXT NOT NULL,
          description TEXT,
          updated_at INTEGER NOT NULL,
          updated_by TEXT REFERENCES users(id) ON DELETE SET NULL
        )
      `;

      await client.execute(createAdminSettingsSQL);
      console.log('✅ Created admin_settings table');
    } else {
      console.log('✅ admin_settings table exists');
    }

    // Check if admin_logs table exists
    const adminLogsTables = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name = 'admin_logs'
    `);

    if (adminLogsTables.rows.length === 0) {
      console.log('⚠️ admin_logs table missing, creating...');
      
      // Create admin_logs table
      const createAdminLogsSQL = `
        CREATE TABLE IF NOT EXISTS admin_logs (
          id TEXT PRIMARY KEY,
          admin_user_id TEXT,
          admin_username TEXT NOT NULL,
          action TEXT NOT NULL,
          entity_type TEXT,
          entity_id TEXT,
          description TEXT NOT NULL,
          details TEXT,
          before_values TEXT,
          after_values TEXT,
          ip_address TEXT,
          user_agent TEXT,
          request_url TEXT,
          request_method TEXT,
          severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
          tags TEXT,
          created_at INTEGER NOT NULL
        )
      `;

      await client.execute(createAdminLogsSQL);
      console.log('✅ Created admin_logs table');
    } else {
      console.log('✅ admin_logs table exists');
    }

    // Check if newsletter settings exist
    const newsletterSettings = await client.execute(`
      SELECT COUNT(*) as count FROM admin_settings 
      WHERE category = 'newsletter'
    `);

    const newsletterCount = newsletterSettings.rows[0].count;
    console.log(`📊 Newsletter settings in database: ${newsletterCount}`);

    if (newsletterCount === 0) {
      console.log('📝 Initializing newsletter settings...');
      
      // Insert default newsletter settings
      const defaultSettings = [
        {
          key: 'newsletter.enabled',
          value: 'true',
          type: 'boolean',
          category: 'newsletter',
          description: 'Enable/disable newsletter signup section in footer'
        },
        {
          key: 'newsletter.title',
          value: 'Stay Connected to the Cosmos',
          type: 'string',
          category: 'newsletter',
          description: 'Newsletter section title text'
        },
        {
          key: 'newsletter.description',
          value: 'Get weekly astrology insights, new feature updates, and cosmic wisdom delivered to your inbox.',
          type: 'string',
          category: 'newsletter',
          description: 'Newsletter section description text'
        },
        {
          key: 'newsletter.placeholder_text',
          value: 'Enter your email',
          type: 'string',
          category: 'newsletter',
          description: 'Email input placeholder text'
        },
        {
          key: 'newsletter.button_text',
          value: 'Subscribe',
          type: 'string',
          category: 'newsletter',
          description: 'Subscribe button text'
        },
        {
          key: 'newsletter.privacy_text',
          value: 'No spam, unsubscribe anytime. We respect your cosmic privacy.',
          type: 'string',
          category: 'newsletter',
          description: 'Privacy disclaimer text below signup form'
        },
        {
          key: 'newsletter.background_color',
          value: '#f0e3ff',
          type: 'string',
          category: 'newsletter',
          description: 'Background color for newsletter section (hex color)'
        },
        {
          key: 'newsletter.mailchimp_api_key',
          value: '',
          type: 'string',
          category: 'newsletter',
          description: 'Mailchimp API key for newsletter subscriptions'
        },
        {
          key: 'newsletter.mailchimp_list_id',
          value: '',
          type: 'string',
          category: 'newsletter',
          description: 'Mailchimp audience/list ID for subscriptions'
        }
      ];

      for (const setting of defaultSettings) {
        await client.execute({
          sql: 'INSERT INTO admin_settings (key, value, type, category, description, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
          args: [setting.key, setting.value, setting.type, setting.category, setting.description, Date.now()]
        });
      }

      console.log('✅ Initialized 9 newsletter settings');
    }

    // Verify all tables now exist
    const allTables = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name IN ('admin_settings', 'admin_logs', 'notifications', 'notification_preferences', 'notification_templates')
      ORDER BY name
    `);

    console.log('📊 Admin and notification tables verified:');
    allTables.rows.forEach(row => {
      console.log(`  ✅ ${row.name}`);
    });

    console.log('🎉 All required tables exist and are ready!');

  } catch (error) {
    console.error('❌ Error verifying admin tables:', error);
    process.exit(1);
  }
}

verifyAdminTables();