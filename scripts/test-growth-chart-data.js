#!/usr/bin/env node

// Test script to verify enhanced-metrics API returns real data for growth chart
const { createClient } = require('@libsql/client/http');
require('dotenv').config({ path: '.env.local' });

async function testGrowthChartData() {
  console.log('🧪 Testing Growth Chart data from enhanced-metrics API...');

  try {
    // Test the enhanced-metrics API endpoint
    const response = await fetch('http://localhost:3000/api/admin/enhanced-metrics?period=daily');
    
    if (!response.ok) {
      console.error(`❌ API responded with status: ${response.status}`);
      return;
    }
    
    const data = await response.json();
    
    if (!data.success) {
      console.error('❌ API returned error:', data.error);
      return;
    }
    
    console.log('✅ Enhanced metrics API response:');
    console.log('📊 Current Metrics:', data.metrics);
    console.log('📈 Trends:', data.trends);
    console.log('🔍 Enhanced Stats:', data.enhancedStats);
    
    if (data.historicalData && Array.isArray(data.historicalData)) {
      console.log(`📅 Historical Data (${data.historicalData.length} points):`);
      data.historicalData.forEach((point, index) => {
        console.log(`  ${point.date}: ${point.users} users, ${point.charts} charts`);
      });
      
      // Verify data is not all zeros (indicating real data)
      const hasRealData = data.historicalData.some(point => point.users > 0 || point.charts > 0);
      if (hasRealData) {
        console.log('✅ Historical data contains real values (not all zeros)');
      } else {
        console.log('⚠️  Historical data is all zeros - may indicate empty database');
      }
    } else {
      console.log('❌ No historical data returned');
    }
    
    // Test different periods
    console.log('\n🔄 Testing different time periods...');
    for (const period of ['daily', 'monthly', 'yearly']) {
      try {
        const periodResponse = await fetch(`http://localhost:3000/api/admin/enhanced-metrics?period=${period}`);
        if (periodResponse.ok) {
          const periodData = await periodResponse.json();
          if (periodData.success && periodData.historicalData) {
            console.log(`✅ ${period} period: ${periodData.historicalData.length} data points`);
          }
        }
      } catch (error) {
        console.warn(`⚠️  Failed to test ${period} period:`, error.message);
      }
    }
    
    console.log('\n🎉 Growth Chart data test completed!');
    console.log('💡 The GrowthChart component should now display real database data instead of mock data.');

  } catch (error) {
    console.error('❌ Error testing growth chart data:', error);
  }
}

// Also test database directly
async function testDatabaseDirectly() {
  console.log('\n🗄️  Testing database directly...');
  
  try {
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    // Test user count
    const userResult = await client.execute('SELECT COUNT(*) as count FROM users');
    const userCount = userResult.rows[0]?.count || 0;
    console.log(`👥 Total users in database: ${userCount}`);

    // Test chart count
    const natalResult = await client.execute('SELECT COUNT(*) as count FROM natal_charts');
    const horaryResult = await client.execute('SELECT COUNT(*) as count FROM horary_questions');
    const totalCharts = (natalResult.rows[0]?.count || 0) + (horaryResult.rows[0]?.count || 0);
    console.log(`📊 Total charts in database: ${totalCharts} (natal: ${natalResult.rows[0]?.count || 0}, horary: ${horaryResult.rows[0]?.count || 0})`);

    if (userCount > 0 || totalCharts > 0) {
      console.log('✅ Database contains real data for historical analysis');
    } else {
      console.log('⚠️  Database appears to be empty - growth chart will show fallback data');
    }

  } catch (error) {
    console.warn('⚠️  Could not test database directly:', error.message);
  }
}

// Run tests
testGrowthChartData().then(() => {
  return testDatabaseDirectly();
});