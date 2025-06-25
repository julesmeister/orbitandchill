/* eslint-disable @typescript-eslint/no-unused-vars */
// Verify real analytics are being recorded and retrieved

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function verifyRealAnalytics() {
  console.log('🔍 Verifying Real Analytics Integration');
  
  try {
    // Import Turso client
    const { createClient } = await import('@libsql/client/http');
    
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    
    console.log('✅ Connected to Turso database');
    
    // Check current analytics data
    const today = new Date().toISOString().split('T')[0];
    
    console.log('\n📊 Checking Analytics Traffic Data:');
    const trafficResult = await client.execute(`
      SELECT * FROM analytics_traffic 
      WHERE date = '${today}'
      ORDER BY created_at DESC
      LIMIT 1
    `);
    
    if (trafficResult.rows.length > 0) {
      const traffic = trafficResult.rows[0];
      console.log('Today\'s Traffic Record:');
      console.log(`  Date: ${traffic.date}`);
      console.log(`  Visitors: ${traffic.visitors}`);
      console.log(`  Page Views: ${traffic.page_views}`);
      console.log(`  Charts Generated: ${traffic.charts_generated}`);
      console.log(`  New Users: ${traffic.new_users}`);
      console.log(`  Returning Users: ${traffic.returning_users}`);
    } else {
      console.log('❌ No traffic data found for today');
    }
    
    console.log('\n📊 Checking Analytics Engagement Data:');
    const engagementResult = await client.execute(`
      SELECT * FROM analytics_engagement 
      WHERE date = '${today}'
      ORDER BY created_at DESC
      LIMIT 1
    `);
    
    if (engagementResult.rows.length > 0) {
      const engagement = engagementResult.rows[0];
      console.log('Today\'s Engagement Record:');
      console.log(`  Date: ${engagement.date}`);
      console.log(`  Discussions Created: ${engagement.discussions_created}`);
      console.log(`  Replies Posted: ${engagement.replies_posted}`);
      console.log(`  Active Users: ${engagement.active_users}`);
      console.log(`  Charts Generated: ${engagement.charts_generated}`);
    } else {
      console.log('❌ No engagement data found for today');
    }
    
    // Check all-time analytics
    console.log('\n📊 All-Time Analytics Summary:');
    const allTrafficResult = await client.execute(`
      SELECT 
        COUNT(*) as days_tracked,
        SUM(visitors) as total_visitors,
        SUM(page_views) as total_page_views,
        SUM(charts_generated) as total_charts
      FROM analytics_traffic
    `);
    
    if (allTrafficResult.rows.length > 0) {
      const summary = allTrafficResult.rows[0];
      console.log(`  Days Tracked: ${summary.days_tracked}`);
      console.log(`  Total Visitors: ${summary.total_visitors}`);
      console.log(`  Total Page Views: ${summary.total_page_views}`);
      console.log(`  Total Charts Generated: ${summary.total_charts}`);
    }
    
    // Check if analytics are incrementing
    console.log('\n🧪 Testing Analytics Increment:');
    
    // Simulate a page view increment
    const beforeViews = trafficResult.rows[0]?.page_views || 0;
    console.log(`  Before: ${beforeViews} page views`);
    
    await client.execute(`
      UPDATE analytics_traffic 
      SET page_views = page_views + 1 
      WHERE date = '${today}'
    `);
    
    const afterResult = await client.execute(`
      SELECT page_views FROM analytics_traffic 
      WHERE date = '${today}'
    `);
    
    const afterViews = afterResult.rows[0]?.page_views || 0;
    console.log(`  After: ${afterViews} page views`);
    console.log(`  ${afterViews > beforeViews ? '✅ Increment working!' : '❌ Increment failed'}`);
    
    // Reset the test increment
    await client.execute(`
      UPDATE analytics_traffic 
      SET page_views = ${beforeViews} 
      WHERE date = '${today}'
    `);
    
    await client.close();
    
    console.log('\n📋 Summary:');
    if (trafficResult.rows.length > 0 || engagementResult.rows.length > 0) {
      console.log('✅ Analytics tables contain data');
      console.log('✅ Database queries working correctly');
      console.log('🔍 If admin dashboard shows mock data, check:');
      console.log('   1. Browser console for errors');
      console.log('   2. Network tab for failed API calls');
      console.log('   3. AdminStore logs for fallback triggers');
    } else {
      console.log('⚠️  No analytics data found for today');
      console.log('💡 Generate some activity:');
      console.log('   - Visit pages in the app');
      console.log('   - View discussions');
      console.log('   - Generate charts');
    }
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
  }
}

// Run verification
verifyRealAnalytics();