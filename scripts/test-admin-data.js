/* eslint-disable @typescript-eslint/no-unused-vars */
// Simple Node.js script to test admin dashboard data integration

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

async function testAdminData() {
  console.log('🧪 Testing Admin Dashboard Data Integration');
  
  try {
    // Test 1: Check environment variables
    console.log('\n📋 Environment Check:');
    console.log('TURSO_DATABASE_URL:', process.env.TURSO_DATABASE_URL ? '✅ Set' : '❌ Missing');
    console.log('TURSO_AUTH_TOKEN:', process.env.TURSO_AUTH_TOKEN ? '✅ Set' : '❌ Missing');
    
    if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
      console.log('\n⚠️  Database credentials missing. Admin dashboard will use fallback data.');
      console.log('Real metrics will be available when Turso is properly configured.');
      return;
    }
    
    // Test 2: Basic HTTP connection to Turso
    console.log('\n🔌 Testing Turso Connection:');
    
    // Import Turso client
    const { createClient } = await import('@libsql/client/http');
    
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    
    // Test basic query
    const result = await client.execute('SELECT 1 as test');
    console.log('✅ Database connection successful');
    
    // Test 3: Check if tables exist
    console.log('\n📊 Checking Tables:');
    const tables = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      AND name IN ('users', 'discussions', 'analytics_traffic', 'analytics_engagement')
      ORDER BY name
    `);
    
    console.log('Tables found:', tables.rows.map(row => row.name));
    
    // Test 4: Sample some data
    console.log('\n📈 Checking Data:');
    
    const userCount = await client.execute('SELECT COUNT(*) as count FROM users');
    console.log(`Users: ${userCount.rows[0]?.count || 0}`);
    
    const discussionCount = await client.execute('SELECT COUNT(*) as count FROM discussions');
    console.log(`Discussions: ${discussionCount.rows[0]?.count || 0}`);
    
    // Test 5: Analytics data
    let analyticsTrafficCount = 0;
    let analyticsEngagementCount = 0;
    
    try {
      const trafficResult = await client.execute('SELECT COUNT(*) as count FROM analytics_traffic');
      analyticsTrafficCount = trafficResult.rows[0]?.count || 0;
    } catch (error) {
      console.log('Analytics traffic table not found or empty');
    }
    
    try {
      const engagementResult = await client.execute('SELECT COUNT(*) as count FROM analytics_engagement');
      analyticsEngagementCount = engagementResult.rows[0]?.count || 0;
    } catch (error) {
      console.log('Analytics engagement table not found or empty');
    }
    
    console.log(`Analytics Traffic Records: ${analyticsTrafficCount}`);
    console.log(`Analytics Engagement Records: ${analyticsEngagementCount}`);
    
    // Summary
    console.log('\n📋 Summary:');
    if (userCount.rows[0]?.count > 0 || discussionCount.rows[0]?.count > 0) {
      console.log('✅ Database has content - Admin dashboard will show real metrics');
    } else {
      console.log('⚠️  Database is empty - Admin dashboard will use fallback data');
      console.log('Run `npm run db:seed` to populate sample data');
    }
    
    if (analyticsTrafficCount === 0) {
      console.log('📊 No analytics data found - Consider running analytics seeding');
    }
    
    await client.close();
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔄 Fallback mode will be used in admin dashboard');
  }
}

// Run if called directly
if (require.main === module) {
  testAdminData().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error('Script error:', error);
    process.exit(1);
  });
}

module.exports = { testAdminData };