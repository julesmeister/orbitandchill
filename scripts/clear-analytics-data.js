/* eslint-disable @typescript-eslint/no-unused-vars */
// Clear existing seeded analytics data to start fresh with real tracking

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function clearAnalyticsData() {
  console.log('🧹 Clearing Existing Analytics Data');
  
  try {
    // Import Turso client
    const { createClient } = await import('@libsql/client/http');
    
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    
    console.log('✅ Connected to Turso database');
    
    // Clear analytics_traffic table
    console.log('🗑️ Clearing analytics_traffic table...');
    const trafficResult = await client.execute('DELETE FROM analytics_traffic');
    console.log(`✅ Deleted ${trafficResult.rowsAffected || 0} traffic records`);
    
    // Clear analytics_engagement table
    console.log('🗑️ Clearing analytics_engagement table...');
    const engagementResult = await client.execute('DELETE FROM analytics_engagement');
    console.log(`✅ Deleted ${engagementResult.rowsAffected || 0} engagement records`);
    
    // Initialize today's record with zeros
    const today = new Date().toISOString().split('T')[0];
    const now = Math.floor(Date.now() / 1000);
    const generateId = () => Math.random().toString(36).substring(2, 15);
    
    console.log('📊 Initializing today\'s analytics records...');
    
    // Create today's traffic record
    await client.execute({
      sql: `INSERT INTO analytics_traffic 
            (id, date, visitors, page_views, charts_generated, new_users, returning_users, 
             avg_session_duration, bounce_rate, top_pages, traffic_sources, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        generateId(), today, 0, 0, 0, 0, 0, 0, 0.0, 
        JSON.stringify([]),
        JSON.stringify({}),
        now
      ]
    });
    
    // Create today's engagement record
    await client.execute({
      sql: `INSERT INTO analytics_engagement 
            (id, date, discussions_created, replies_posted, charts_generated, active_users,
             popular_discussions, top_contributors, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        generateId(), today, 0, 0, 0, 0,
        JSON.stringify([]),
        JSON.stringify([]),
        now
      ]
    });
    
    console.log('✅ Initialized today\'s records with zeros');
    
    await client.close();
    
    console.log('\n🎉 Analytics data cleared successfully!');
    console.log('📈 Real-time tracking is now active');
    console.log('🔍 Visit pages to see real analytics data accumulate');
    console.log('\n💡 Test real analytics by:');
    console.log('   1. Visit /discussions (page view + discussion list access)');
    console.log('   2. Click on a discussion (discussion view)');
    console.log('   3. Visit /chart (page view + chart generation)');
    console.log('   4. Check /admin dashboard for real metrics');
    
  } catch (error) {
    console.error('❌ Failed to clear analytics data:', error);
    process.exit(1);
  }
}

// Run the function
clearAnalyticsData();