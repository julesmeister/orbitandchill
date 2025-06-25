#!/usr/bin/env node

// Script to initialize all default admin settings
const { createClient } = require('@libsql/client/http');
require('dotenv').config({ path: '.env.local' });

async function initializeAdminSettings() {
  console.log('🔧 Initializing all default admin settings...');

  try {
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    // Test connection
    await client.execute('SELECT 1 as test');
    console.log('✅ Connected to Turso database');

    // Get existing settings
    const existingSettings = await client.execute('SELECT key FROM admin_settings');
    const existingKeys = new Set(existingSettings.rows.map(row => row.key));
    console.log(`📊 Found ${existingKeys.size} existing settings`);

    // Define all default settings
    const defaultSettings = [
      // SEO Settings
      {
        key: 'seo.site_title',
        value: 'Luckstrology - Astrology & Natal Charts',
        type: 'string',
        category: 'seo',
        description: 'Main site title used in meta tags'
      },
      {
        key: 'seo.meta_description',
        value: 'Professional astrology services, natal chart readings, and celestial insights. Discover your cosmic blueprint with our expert astrologers.',
        type: 'string',
        category: 'seo',
        description: 'Default meta description for pages'
      },
      {
        key: 'seo.meta_keywords',
        value: 'astrology, natal charts, horoscope, zodiac, celestial, planetary positions',
        type: 'string',
        category: 'seo',
        description: 'Default meta keywords (comma-separated)'
      },
      {
        key: 'seo.og_image_url',
        value: '/images/og-image.jpg',
        type: 'string',
        category: 'seo',
        description: 'Open Graph image URL for social sharing'
      },

      // Analytics Settings
      {
        key: 'analytics.google_analytics_id',
        value: '',
        type: 'string',
        category: 'analytics',
        description: 'Google Analytics tracking ID (GA4)'
      },
      {
        key: 'analytics.google_tag_manager_id',
        value: '',
        type: 'string',
        category: 'analytics',
        description: 'Google Tag Manager container ID'
      },
      {
        key: 'analytics.tracking_enabled',
        value: 'true',
        type: 'boolean',
        category: 'analytics',
        description: 'Enable/disable analytics tracking'
      },
      {
        key: 'analytics.cookie_consent_required',
        value: 'true',
        type: 'boolean',
        category: 'analytics',
        description: 'Require cookie consent before tracking'
      },

      // General App Settings
      {
        key: 'general.maintenance_mode',
        value: 'false',
        type: 'boolean',
        category: 'general',
        description: 'Enable maintenance mode (shows maintenance page)'
      },
      {
        key: 'general.registration_enabled',
        value: 'true',
        type: 'boolean',
        category: 'general',
        description: 'Allow new user registrations'
      },
      {
        key: 'general.contact_email',
        value: 'contact@luckstrology.com',
        type: 'string',
        category: 'general',
        description: 'Main contact email address'
      },
      {
        key: 'general.max_charts_per_user',
        value: '10',
        type: 'number',
        category: 'general',
        description: 'Maximum number of charts per user (0 = unlimited)'
      },
      {
        key: 'general.featured_categories',
        value: '["Natal Chart Analysis", "Transits & Predictions", "Synastry & Compatibility"]',
        type: 'json',
        category: 'general',
        description: 'Featured discussion categories for homepage'
      },

      // Email Settings
      {
        key: 'email.smtp_host',
        value: '',
        type: 'string',
        category: 'email',
        description: 'SMTP server hostname'
      },
      {
        key: 'email.smtp_port',
        value: '587',
        type: 'number',
        category: 'email',
        description: 'SMTP server port'
      },
      {
        key: 'email.smtp_secure',
        value: 'true',
        type: 'boolean',
        category: 'email',
        description: 'Use TLS/SSL for SMTP connection'
      },
      {
        key: 'email.smtp_username',
        value: '',
        type: 'string',
        category: 'email',
        description: 'SMTP authentication username'
      },
      {
        key: 'email.smtp_password',
        value: '',
        type: 'string',
        category: 'email',
        description: 'SMTP authentication password (encrypted)'
      },
      {
        key: 'email.from_email',
        value: 'noreply@luckstrology.com',
        type: 'string',
        category: 'email',
        description: 'Default "from" email address'
      },
      {
        key: 'email.from_name',
        value: 'Luckstrology',
        type: 'string',
        category: 'email',
        description: 'Default "from" name'
      },
      {
        key: 'email.notifications_enabled',
        value: 'true',
        type: 'boolean',
        category: 'email',
        description: 'Enable email notifications'
      },

      // Security Settings
      {
        key: 'security.session_timeout',
        value: '3600',
        type: 'number',
        category: 'security',
        description: 'Session timeout in seconds (0 = no timeout)'
      },
      {
        key: 'security.rate_limit_requests',
        value: '100',
        type: 'number',
        category: 'security',
        description: 'Rate limit: requests per window'
      },
      {
        key: 'security.rate_limit_window',
        value: '60',
        type: 'number',
        category: 'security',
        description: 'Rate limit: window in seconds'
      },
      {
        key: 'security.password_min_length',
        value: '8',
        type: 'number',
        category: 'security',
        description: 'Minimum password length for user accounts'
      },
      {
        key: 'security.require_email_verification',
        value: 'false',
        type: 'boolean',
        category: 'security',
        description: 'Require email verification for new accounts'
      }
    ];

    // Filter out settings that already exist
    const newSettings = defaultSettings.filter(setting => !existingKeys.has(setting.key));
    
    if (newSettings.length === 0) {
      console.log('✅ All default settings already exist');
      return;
    }

    console.log(`📝 Adding ${newSettings.length} missing default settings...`);

    // Insert missing settings
    for (const setting of newSettings) {
      await client.execute({
        sql: 'INSERT INTO admin_settings (key, value, type, category, description, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        args: [setting.key, setting.value, setting.type, setting.category, setting.description, Date.now()]
      });
      console.log(`  ✅ Added: ${setting.key}`);
    }

    // Verify categories
    const allSettings = await client.execute('SELECT category, COUNT(*) as count FROM admin_settings GROUP BY category ORDER BY category');
    
    console.log('📊 Settings by category:');
    allSettings.rows.forEach(row => {
      console.log(`  ${row.category}: ${row.count} settings`);
    });

    console.log('🎉 All default admin settings initialized successfully!');

  } catch (error) {
    console.error('❌ Error initializing admin settings:', error);
    process.exit(1);
  }
}

initializeAdminSettings();