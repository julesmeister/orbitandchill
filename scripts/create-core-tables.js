#!/usr/bin/env node

// Script to create all missing core tables in Turso database using raw SQL
import { createClient } from '@libsql/client/http';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function createCoreTables() {
  console.log('🔧 Creating core database tables...');

  try {
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    // Test connection
    await client.execute('SELECT 1 as test');
    console.log('✅ Connected to Turso database');

    // Create users table
    const createUsersSQL = `
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        email TEXT,
        profile_picture_url TEXT,
        auth_provider TEXT NOT NULL CHECK (auth_provider IN ('google', 'anonymous')),
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        date_of_birth TEXT,
        time_of_birth TEXT,
        location_of_birth TEXT,
        latitude REAL,
        longitude REAL,
        sun_sign TEXT,
        stellium_signs TEXT,
        stellium_houses TEXT,
        has_natal_chart INTEGER DEFAULT 0,
        show_zodiac_publicly INTEGER DEFAULT 0,
        show_stelliums_publicly INTEGER DEFAULT 0,
        show_birth_info_publicly INTEGER DEFAULT 0,
        allow_direct_messages INTEGER DEFAULT 1,
        show_online_status INTEGER DEFAULT 1,
        email_notifications INTEGER DEFAULT 1,
        weekly_newsletter INTEGER DEFAULT 0,
        discussion_notifications INTEGER DEFAULT 1,
        chart_reminders INTEGER DEFAULT 0,
        default_chart_theme TEXT DEFAULT 'default',
        timezone TEXT DEFAULT 'UTC',
        language TEXT DEFAULT 'en',
        subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'pro')),
        role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
        permissions TEXT,
        is_active INTEGER DEFAULT 1,
        is_deleted INTEGER DEFAULT 0,
        deleted_at INTEGER,
        deletion_type TEXT CHECK (deletion_type IN ('soft', 'hard', 'scheduled')),
        deletion_reason TEXT,
        deletion_requested_at INTEGER,
        deletion_confirmed_at INTEGER,
        grace_period_ends INTEGER,
        deleted_by TEXT
      )
    `;

    await client.execute(createUsersSQL);
    console.log('✅ Created users table');

    // Create natal_charts table
    const createNatalChartsSQL = `
      CREATE TABLE IF NOT EXISTS natal_charts (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        chart_data TEXT NOT NULL,
        metadata TEXT NOT NULL,
        chart_type TEXT NOT NULL CHECK (chart_type IN ('natal', 'transit', 'synastry', 'composite')),
        subject_name TEXT NOT NULL,
        date_of_birth TEXT NOT NULL,
        time_of_birth TEXT NOT NULL,
        location_of_birth TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        title TEXT,
        description TEXT,
        theme TEXT DEFAULT 'default',
        is_public INTEGER DEFAULT 0,
        share_token TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `;

    await client.execute(createNatalChartsSQL);
    console.log('✅ Created natal_charts table');

    // Create discussions table
    const createDiscussionsSQL = `
      CREATE TABLE IF NOT EXISTS discussions (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        author_id TEXT REFERENCES users(id) ON DELETE SET NULL,
        author_name TEXT NOT NULL,
        category TEXT NOT NULL,
        tags TEXT,
        embedded_chart TEXT,
        embedded_video TEXT,
        replies INTEGER DEFAULT 0,
        views INTEGER DEFAULT 0,
        upvotes INTEGER DEFAULT 0,
        downvotes INTEGER DEFAULT 0,
        is_locked INTEGER DEFAULT 0,
        is_pinned INTEGER DEFAULT 0,
        is_blog_post INTEGER DEFAULT 0,
        is_published INTEGER DEFAULT 1,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        last_activity INTEGER NOT NULL
      )
    `;

    await client.execute(createDiscussionsSQL);
    console.log('✅ Created discussions table');

    // Create discussion_replies table
    const createDiscussionRepliesSQL = `
      CREATE TABLE IF NOT EXISTS discussion_replies (
        id TEXT PRIMARY KEY,
        discussion_id TEXT NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
        author_id TEXT REFERENCES users(id) ON DELETE SET NULL,
        content TEXT NOT NULL,
        parent_reply_id TEXT,
        upvotes INTEGER DEFAULT 0,
        downvotes INTEGER DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `;

    await client.execute(createDiscussionRepliesSQL);
    console.log('✅ Created discussion_replies table');

    // Create votes table
    const createVotesSQL = `
      CREATE TABLE IF NOT EXISTS votes (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        discussion_id TEXT REFERENCES discussions(id) ON DELETE CASCADE,
        reply_id TEXT REFERENCES discussion_replies(id) ON DELETE CASCADE,
        vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
        created_at INTEGER NOT NULL
      )
    `;

    await client.execute(createVotesSQL);
    console.log('✅ Created votes table');

    // Create categories table
    const createCategoriesSQL = `
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        icon TEXT,
        sort_order INTEGER NOT NULL DEFAULT 0,
        is_active INTEGER NOT NULL DEFAULT 1,
        discussion_count INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `;

    await client.execute(createCategoriesSQL);
    console.log('✅ Created categories table');

    // Create tags table
    const createTagsSQL = `
      CREATE TABLE IF NOT EXISTS tags (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        usage_count INTEGER NOT NULL DEFAULT 0,
        is_popular INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `;

    await client.execute(createTagsSQL);
    console.log('✅ Created tags table');

    // Create discussion_tags table
    const createDiscussionTagsSQL = `
      CREATE TABLE IF NOT EXISTS discussion_tags (
        discussion_id TEXT NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
        tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
        created_at INTEGER NOT NULL
      )
    `;

    await client.execute(createDiscussionTagsSQL);
    console.log('✅ Created discussion_tags table');

    // Create analytics table
    const createAnalyticsSQL = `
      CREATE TABLE IF NOT EXISTS analytics (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        visitors INTEGER DEFAULT 0,
        page_views INTEGER DEFAULT 0,
        charts_generated INTEGER DEFAULT 0,
        new_users INTEGER DEFAULT 0,
        discussion_views INTEGER DEFAULT 0,
        created_at INTEGER NOT NULL
      )
    `;

    await client.execute(createAnalyticsSQL);
    console.log('✅ Created analytics table');

    // Create cache table
    const createCacheSQL = `
      CREATE TABLE IF NOT EXISTS cache (
        key TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        expiry INTEGER NOT NULL,
        created_at INTEGER NOT NULL
      )
    `;

    await client.execute(createCacheSQL);
    console.log('✅ Created cache table');

    // Create events table (legacy)
    const createEventsSQL = `
      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        event_type TEXT NOT NULL,
        start_date INTEGER NOT NULL,
        end_date INTEGER,
        location TEXT,
        latitude REAL,
        longitude REAL,
        astrological_significance TEXT,
        is_public INTEGER DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `;

    await client.execute(createEventsSQL);
    console.log('✅ Created events table');

    // Create astrological_events table
    const createAstrologicalEventsSQL = `
      CREATE TABLE IF NOT EXISTS astrological_events (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT,
        type TEXT NOT NULL CHECK (type IN ('benefic', 'challenging', 'neutral')),
        description TEXT NOT NULL,
        aspects TEXT NOT NULL,
        planetary_positions TEXT NOT NULL,
        score INTEGER NOT NULL DEFAULT 5,
        is_generated INTEGER NOT NULL DEFAULT 0,
        priorities TEXT,
        chart_data TEXT,
        is_bookmarked INTEGER NOT NULL DEFAULT 0,
        time_window TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `;

    await client.execute(createAstrologicalEventsSQL);
    console.log('✅ Created astrological_events table');

    // Create admin_settings table
    const createAdminSettingsSQL = `
      CREATE TABLE IF NOT EXISTS admin_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('string', 'number', 'boolean', 'json')),
        category TEXT NOT NULL,
        description TEXT,
        updated_at INTEGER NOT NULL,
        updated_by TEXT REFERENCES users(id)
      )
    `;

    await client.execute(createAdminSettingsSQL);
    console.log('✅ Created admin_settings table');

    // Create premium_features table
    const createPremiumFeaturesSQL = `
      CREATE TABLE IF NOT EXISTS premium_features (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL CHECK (category IN ('chart', 'interpretation', 'sharing', 'analysis')),
        is_enabled INTEGER NOT NULL DEFAULT 1,
        is_premium INTEGER NOT NULL DEFAULT 0,
        component TEXT,
        section TEXT,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `;

    await client.execute(createPremiumFeaturesSQL);
    console.log('✅ Created premium_features table');

    // Create user_activity table
    const createUserActivitySQL = `
      CREATE TABLE IF NOT EXISTS user_activity (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        activity_type TEXT NOT NULL,
        entity_type TEXT,
        entity_id TEXT,
        description TEXT NOT NULL,
        metadata TEXT,
        ip_address TEXT,
        user_agent TEXT,
        session_id TEXT,
        page_url TEXT,
        referrer TEXT,
        created_at INTEGER NOT NULL
      )
    `;

    await client.execute(createUserActivitySQL);
    console.log('✅ Created user_activity table');

    // Create admin_logs table
    const createAdminLogsSQL = `
      CREATE TABLE IF NOT EXISTS admin_logs (
        id TEXT PRIMARY KEY,
        admin_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
        admin_username TEXT NOT NULL,
        action TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id TEXT,
        description TEXT NOT NULL,
        details TEXT,
        before_values TEXT,
        after_values TEXT,
        ip_address TEXT,
        user_agent TEXT,
        request_url TEXT,
        request_method TEXT,
        severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
        tags TEXT,
        created_at INTEGER NOT NULL
      )
    `;

    await client.execute(createAdminLogsSQL);
    console.log('✅ Created admin_logs table');

    // Create account_deletion_requests table
    const createAccountDeletionRequestsSQL = `
      CREATE TABLE IF NOT EXISTS account_deletion_requests (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        requested_by TEXT NOT NULL,
        request_type TEXT NOT NULL CHECK (request_type IN ('immediate', 'scheduled', 'grace_period')),
        reason TEXT,
        scheduled_for INTEGER,
        grace_period_days INTEGER DEFAULT 30,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'completed', 'cancelled')),
        confirmation_token TEXT,
        confirmation_sent_at INTEGER,
        confirmed_at INTEGER,
        processed_at INTEGER,
        completed_at INTEGER,
        data_cleanup_status TEXT,
        recovery_data_path TEXT,
        user_agent TEXT,
        ip_address TEXT,
        notes TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `;

    await client.execute(createAccountDeletionRequestsSQL);
    console.log('✅ Created account_deletion_requests table');

    // Create horary_questions table
    const createHoraryQuestionsSQL = `
      CREATE TABLE IF NOT EXISTS horary_questions (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
        question TEXT NOT NULL,
        date INTEGER NOT NULL,
        location TEXT,
        latitude REAL,
        longitude REAL,
        timezone TEXT,
        answer TEXT,
        timing TEXT,
        interpretation TEXT,
        chart_data TEXT,
        chart_svg TEXT,
        ascendant_degree REAL,
        moon_sign TEXT,
        moon_void_of_course INTEGER,
        planetary_hour TEXT,
        is_radical INTEGER,
        chart_warnings TEXT,
        category TEXT,
        tags TEXT,
        is_shared INTEGER DEFAULT 0,
        share_token TEXT,
        aspect_count INTEGER,
        retrograde_count INTEGER,
        significator_planet TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `;

    await client.execute(createHoraryQuestionsSQL);
    console.log('✅ Created horary_questions table');

    // Create notification_templates table
    const createNotificationTemplatesSQL = `
      CREATE TABLE IF NOT EXISTS notification_templates (
        id TEXT PRIMARY KEY,
        template_key TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL CHECK (category IN ('social', 'system', 'admin', 'premium', 'reminder', 'achievement')),
        title_template TEXT NOT NULL,
        message_template TEXT NOT NULL,
        email_subject_template TEXT,
        email_body_template TEXT,
        icon TEXT,
        priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
        default_delivery_methods TEXT DEFAULT '["in_app"]',
        is_active INTEGER NOT NULL DEFAULT 1,
        requires_auth INTEGER NOT NULL DEFAULT 1,
        max_frequency TEXT,
        available_placeholders TEXT,
        validation_rules TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `;

    await client.execute(createNotificationTemplatesSQL);
    console.log('✅ Created notification_templates table');

    // Create indexes for better performance
    console.log('🔧 Creating database indexes...');

    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_users_auth_provider ON users(auth_provider)',
      'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
      'CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_natal_charts_user_id ON natal_charts(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_natal_charts_created_at ON natal_charts(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_discussions_author_id ON discussions(author_id)',
      'CREATE INDEX IF NOT EXISTS idx_discussions_category ON discussions(category)',
      'CREATE INDEX IF NOT EXISTS idx_discussions_created_at ON discussions(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_discussions_is_published ON discussions(is_published)',
      'CREATE INDEX IF NOT EXISTS idx_discussion_replies_discussion_id ON discussion_replies(discussion_id)',
      'CREATE INDEX IF NOT EXISTS idx_discussion_replies_author_id ON discussion_replies(author_id)',
      'CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_votes_discussion_id ON votes(discussion_id)',
      'CREATE INDEX IF NOT EXISTS idx_votes_reply_id ON votes(reply_id)',
      'CREATE INDEX IF NOT EXISTS idx_astrological_events_user_id ON astrological_events(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_astrological_events_date ON astrological_events(date)',
      'CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_user_id ON admin_logs(admin_user_id)',
      'CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_cache_expiry ON cache(expiry)'
    ];

    for (const indexSQL of indexes) {
      await client.execute(indexSQL);
    }

    console.log('✅ Created database indexes');

    // Verify tables exist
    const tables = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `);

    console.log('📊 Database tables created:');
    tables.rows.forEach(row => {
      console.log(`  - ${row.name}`);
    });

    console.log('🎉 All core tables successfully created!');

  } catch (error) {
    console.error('❌ Error creating core tables:', error);
    process.exit(1);
  }
}

createCoreTables();