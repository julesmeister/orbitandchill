/* eslint-disable @typescript-eslint/no-unused-vars */
// Test chart insertion to diagnose natal_charts table issues
import { getDbAsync } from './src/db/index-turso-http';

async function testChartInsertion() {
  console.log('🔍 Testing natal_charts table...');
  
  try {
    const db = await getDbAsync();
    if (!db || !db.client) {
      console.error('❌ Database not available');
      return;
    }

    // First, check if natal_charts table exists and its structure
    console.log('📋 Checking natal_charts table structure...');
    const tableInfo = await db.client.execute("PRAGMA table_info(natal_charts)");
    console.log('natal_charts columns:', tableInfo.rows);

    // Check if there are any existing charts
    console.log('📊 Checking existing charts...');
    const existingCharts = await db.client.execute("SELECT COUNT(*) as count FROM natal_charts");
    console.log('Existing charts count:', existingCharts.rows[0]);

    // Test insert with all required fields from the schema
    console.log('🧪 Testing chart insertion...');
    const testChart = {
      id: 'test_chart_' + Date.now(),
      user_id: 'test_user_123',
      chart_data: '<svg>test chart svg</svg>',
      metadata: JSON.stringify({ test: true, planets: [] }),
      chart_type: 'natal',
      subject_name: 'Test Subject',
      date_of_birth: '1990-04-20',
      time_of_birth: '14:30',
      location_of_birth: 'New York, NY, USA',
      latitude: 40.7128,
      longitude: -74.006,
      title: 'Test Chart',
      description: 'Test chart description',
      theme: 'default',
      is_public: 0,
      share_token: null,
      created_at: Math.floor(Date.now() / 1000),
      updated_at: Math.floor(Date.now() / 1000)
    };

    const fields = Object.keys(testChart);
    const placeholders = fields.map(() => '?').join(', ');
    const values = fields.map(field => testChart[field]);
    
    const insertQuery = `INSERT INTO natal_charts (${fields.join(', ')}) VALUES (${placeholders})`;
    console.log('📝 Insert query:', insertQuery);
    console.log('📝 Values:', values);

    const result = await db.client.execute({
      sql: insertQuery,
      args: values
    });

    console.log('✅ Chart inserted successfully!', result);

    // Verify the chart was inserted
    const verifyQuery = `SELECT * FROM natal_charts WHERE id = ?`;
    const verification = await db.client.execute({
      sql: verifyQuery,
      args: [testChart.id]
    });

    console.log('✅ Chart verification:', verification.rows[0]);

    // Clean up test data
    await db.client.execute({
      sql: "DELETE FROM natal_charts WHERE id = ?",
      args: [testChart.id]
    });
    console.log('🧹 Test chart cleaned up');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
  }
}

testChartInsertion();