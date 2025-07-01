/* eslint-disable @typescript-eslint/no-unused-vars */
// Test chart count to check database content
import { getDbAsync } from './src/db/index-turso-http.ts';

async function checkChartCount() {
  console.log('🔍 Checking chart count in database...');
  
  try {
    const db = await getDbAsync();
    if (!db || !db.client) {
      console.error('❌ Database not available');
      return;
    }

    // Check total count
    const countResult = await db.client.execute("SELECT COUNT(*) as count FROM natal_charts");
    console.log('Total charts in database:', countResult.rows[0]);

    // Check recent charts
    const recentCharts = await db.client.execute("SELECT id, user_id, subject_name, created_at FROM natal_charts ORDER BY created_at DESC LIMIT 5");
    console.log('Recent charts:', recentCharts.rows);

    // Test direct retrieval by ID (if we have any charts)
    if (recentCharts.rows.length > 0) {
      const firstChart = recentCharts.rows[0];
      console.log('Testing direct retrieval of chart:', firstChart.id);
      
      const directResult = await db.client.execute({
        sql: "SELECT * FROM natal_charts WHERE id = ?",
        args: [firstChart.id]
      });
      console.log('Direct retrieval result:', directResult.rows[0] ? 'FOUND' : 'NOT FOUND');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

checkChartCount();