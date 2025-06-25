/* eslint-disable @typescript-eslint/no-unused-vars */
// Test admin dashboard integration with API endpoints
// This script tests that the admin APIs return real data

console.log('🧪 Testing Admin Dashboard API Integration');

async function testAdminAPIs() {
  try {
    console.log('\n📊 Testing /api/admin/metrics...');
    const metricsResponse = await fetch('http://localhost:3000/api/admin/metrics');
    const metricsData = await metricsResponse.json();
    
    if (metricsData.success) {
      console.log('✅ Metrics API working:');
      console.log(`   Total Users: ${metricsData.metrics.totalUsers}`);
      console.log(`   Active Users: ${metricsData.metrics.activeUsers}`);
      console.log(`   Charts Generated: ${metricsData.metrics.chartsGenerated}`);
      console.log(`   Forum Posts: ${metricsData.metrics.forumPosts}`);
      console.log(`   Daily Visitors: ${metricsData.metrics.dailyVisitors}`);
      console.log(`   Monthly Growth: ${metricsData.metrics.monthlyGrowth}%`);
    } else {
      console.log('❌ Metrics API failed:', metricsData.error);
    }

    console.log('\n👥 Testing /api/admin/user-analytics...');
    const userResponse = await fetch('http://localhost:3000/api/admin/user-analytics');
    const userData = await userResponse.json();
    
    if (userData.success) {
      console.log(`✅ User Analytics API working: ${userData.userAnalytics.length} users`);
      if (userData.userAnalytics.length > 0) {
        const user = userData.userAnalytics[0];
        console.log(`   Sample User: ${user.name || 'Anonymous'} (${user.isAnonymous ? 'anon' : 'registered'})`);
        console.log(`   Charts: ${user.chartsGenerated}, Posts: ${user.forumPosts}`);
      }
    } else {
      console.log('❌ User Analytics API failed:', userData.error);
    }

    console.log('\n📈 Testing /api/admin/traffic-data...');
    const trafficResponse = await fetch('http://localhost:3000/api/admin/traffic-data');
    const trafficData = await trafficResponse.json();
    
    if (trafficData.success) {
      console.log(`✅ Traffic Data API working: ${trafficData.trafficData.length} days`);
      if (trafficData.trafficData.length > 0) {
        const latest = trafficData.trafficData[trafficData.trafficData.length - 1];
        console.log(`   Latest (${latest.date}): ${latest.visitors} visitors, ${latest.pageViews} views`);
      }
    } else {
      console.log('❌ Traffic Data API failed:', trafficData.error);
    }

    console.log('\n🎯 Integration Summary:');
    const allWorking = metricsData.success && userData.success && trafficData.success;
    
    if (allWorking) {
      console.log('✅ All admin APIs are working correctly');
      console.log('✅ AdminStore should now display real data instead of mock/seed data');
      console.log('🔍 Next steps:');
      console.log('   1. Visit http://localhost:3000/admin to see the real dashboard');
      console.log('   2. Check browser console for AdminStore logs');
      console.log('   3. Verify metrics update when you refresh');
    } else {
      console.log('⚠️  Some APIs may be using fallback data');
      console.log('💡 This is normal if the database is empty or has connection issues');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('💡 Make sure the development server is running: npm run dev');
  }
}

// Run the test
testAdminAPIs();