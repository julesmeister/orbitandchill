/* eslint-disable @typescript-eslint/no-unused-vars */
// Test chart persistence to diagnose the issue
const { ChartService } = await import('./src/db/services/chartService.ts');
const { getDbAsync } = await import('./src/db/index-turso-http.ts');

async function testChartPersistence() {
  console.log('🔍 Testing chart persistence...');
  
  try {
    const testUserId = 'test_user_' + Date.now();
    
    // Create a test chart
    console.log('🔄 Creating chart...');
    const chartData = {
      userId: testUserId,
      subjectName: 'Test Subject',
      dateOfBirth: '1990-04-20',
      timeOfBirth: '14:30',
      locationOfBirth: 'New York, NY, USA',
      latitude: 40.7128,
      longitude: -74.006,
      chartType: 'natal',
      title: 'Test Chart',
      description: 'Test description',
      theme: 'default',
      isPublic: false,
      chartData: '<svg>test</svg>',
      metadata: { test: true }
    };
    
    const createdChart = await ChartService.createChart(chartData);
    console.log('✅ Chart created:', createdChart ? 'SUCCESS' : 'FAILED');
    
    if (!createdChart) {
      console.error('❌ Chart creation failed');
      return;
    }
    
    // Check database directly
    console.log('🔍 Checking database directly...');
    const db = await getDbAsync();
    if (db && db.client) {
      const directResult = await db.client.execute({
        sql: "SELECT * FROM natal_charts WHERE id = ?",
        args: [createdChart.id]
      });
      console.log('Database direct query result:', directResult.rows.length > 0 ? 'FOUND' : 'NOT FOUND');
      
      if (directResult.rows.length > 0) {
        console.log('Direct row data:', {
          id: directResult.rows[0].id,
          user_id: directResult.rows[0].user_id,
          subject_name: directResult.rows[0].subject_name
        });
      }
    }
    
    // Try ChartService retrieval
    console.log('🔍 Testing ChartService retrieval...');
    const retrievedChart = await ChartService.getChartById(createdChart.id, testUserId);
    console.log('ChartService retrieval result:', retrievedChart ? 'SUCCESS' : 'FAILED');
    
    // Try retrieval without userId
    console.log('🔍 Testing ChartService retrieval without userId...');
    const retrievedChart2 = await ChartService.getChartById(createdChart.id);
    console.log('ChartService retrieval (no userId) result:', retrievedChart2 ? 'SUCCESS' : 'FAILED');
    
    // Try user charts listing
    console.log('🔍 Testing user charts listing...');
    const userCharts = await ChartService.getUserCharts(testUserId);
    console.log('User charts listing result:', userCharts.length, 'charts found');
    
    // Clean up manually if needed
    if (db && db.client) {
      await db.client.execute({
        sql: "DELETE FROM natal_charts WHERE id = ?",
        args: [createdChart.id]
      });
      console.log('🧹 Chart cleaned up');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testChartPersistence();