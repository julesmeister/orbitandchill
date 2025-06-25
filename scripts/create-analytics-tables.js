/* eslint-disable @typescript-eslint/no-unused-vars */
// Create analytics tables and populate with sample data

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function createAnalyticsTables() {
  console.log('📊 Creating Analytics Tables and Data');
  
  try {
    // Import Turso client
    const { createClient } = await import('@libsql/client/http');
    
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    
    console.log('✅ Connected to Turso database');
    
    // Create analytics_traffic table
    console.log('📋 Creating analytics_traffic table...');
    await client.execute(`
      CREATE TABLE IF NOT EXISTS analytics_traffic (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        visitors INTEGER DEFAULT 0,
        page_views INTEGER DEFAULT 0,
        charts_generated INTEGER DEFAULT 0,
        new_users INTEGER DEFAULT 0,
        returning_users INTEGER DEFAULT 0,
        avg_session_duration INTEGER DEFAULT 0,
        bounce_rate REAL DEFAULT 0,
        top_pages TEXT,
        traffic_sources TEXT,
        created_at INTEGER NOT NULL
      )
    `);
    
    // Create analytics_engagement table  
    console.log('📋 Creating analytics_engagement table...');
    await client.execute(`
      CREATE TABLE IF NOT EXISTS analytics_engagement (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        discussions_created INTEGER DEFAULT 0,
        replies_posted INTEGER DEFAULT 0,
        charts_generated INTEGER DEFAULT 0,
        active_users INTEGER DEFAULT 0,
        popular_discussions TEXT,
        top_contributors TEXT,
        created_at INTEGER NOT NULL
      )
    `);
    
    console.log('✅ Analytics tables created');
    
    // Generate sample data for the last 30 days
    console.log('🌱 Seeding analytics data...');
    
    const generateId = () => Math.random().toString(36).substring(2, 15);
    const now = Math.floor(Date.now() / 1000);
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const dayOffset = 29 - i;
      
      // Traffic data
      const visitors = 100 + Math.floor(Math.random() * 500) + dayOffset * 10;
      const pageViews = visitors * (2 + Math.random() * 3);
      const chartsGenerated = Math.floor(visitors * 0.1) + Math.floor(Math.random() * 20);
      const newUsers = Math.floor(visitors * 0.1) + Math.floor(Math.random() * 10);
      const returningUsers = visitors - newUsers;
      const avgSessionDuration = 120 + Math.floor(Math.random() * 300);
      const bounceRate = 0.3 + Math.random() * 0.4;
      
      const topPages = JSON.stringify([
        { page: '/chart', views: Math.floor(pageViews * 0.3), percentage: 30 },
        { page: '/discussions', views: Math.floor(pageViews * 0.25), percentage: 25 },
        { page: '/', views: Math.floor(pageViews * 0.2), percentage: 20 },
        { page: '/about', views: Math.floor(pageViews * 0.15), percentage: 15 },
      ]);
      
      const trafficSources = JSON.stringify({
        direct: Math.floor(40 + Math.random() * 20),
        google: Math.floor(25 + Math.random() * 15),
        social: Math.floor(15 + Math.random() * 10),
        referral: Math.floor(10 + Math.random() * 10),
      });
      
      await client.execute({
        sql: `INSERT OR REPLACE INTO analytics_traffic 
              (id, date, visitors, page_views, charts_generated, new_users, returning_users, 
               avg_session_duration, bounce_rate, top_pages, traffic_sources, created_at) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          generateId(), date, visitors, Math.floor(pageViews), chartsGenerated,
          newUsers, returningUsers, avgSessionDuration, bounceRate,
          topPages, trafficSources, now
        ]
      });
      
      // Engagement data
      const discussionsCreated = Math.floor(Math.random() * 5) + 1;
      const repliesPosted = Math.floor(Math.random() * 20) + 5;
      const activeUsers = Math.floor(visitors * 0.1) + Math.floor(Math.random() * 20);
      
      const popularDiscussions = JSON.stringify([
        { id: '1', title: 'Mars Placement Discussion', engagement: Math.floor(Math.random() * 50) + 20 },
        { id: '2', title: 'Stellium Questions', engagement: Math.floor(Math.random() * 30) + 10 },
      ]);
      
      const topContributors = JSON.stringify([
        { userId: 'user1', username: 'AstroMaster', contributions: Math.floor(Math.random() * 10) + 5 },
        { userId: 'user2', username: 'CosmicSeer', contributions: Math.floor(Math.random() * 8) + 3 },
      ]);
      
      await client.execute({
        sql: `INSERT OR REPLACE INTO analytics_engagement 
              (id, date, discussions_created, replies_posted, charts_generated, active_users,
               popular_discussions, top_contributors, created_at) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          generateId(), date, discussionsCreated, repliesPosted, chartsGenerated,
          activeUsers, popularDiscussions, topContributors, now
        ]
      });
    }
    
    console.log('✅ Analytics data seeded for 30 days');
    
    // Verify data
    const trafficCount = await client.execute('SELECT COUNT(*) as count FROM analytics_traffic');
    const engagementCount = await client.execute('SELECT COUNT(*) as count FROM analytics_engagement');
    
    console.log(`📊 Traffic records: ${trafficCount.rows[0].count}`);
    console.log(`📊 Engagement records: ${engagementCount.rows[0].count}`);
    
    await client.close();
    console.log('🎉 Analytics setup complete!');
    
  } catch (error) {
    console.error('❌ Failed to create analytics tables:', error);
    process.exit(1);
  }
}

// Run the function
createAnalyticsTables();