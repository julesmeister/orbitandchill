import { createClient } from '@libsql/client';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function cleanDuplicatePeople() {
  console.log('Cleaning duplicate people records...');
  
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  
  try {
    // Get all people grouped by user_id, relationship, and birth data
    const result = await client.execute({
      sql: `
        SELECT 
          user_id,
          relationship,
          date_of_birth,
          time_of_birth,
          coordinates,
          GROUP_CONCAT(id) as ids,
          COUNT(*) as count
        FROM people 
        GROUP BY user_id, relationship, date_of_birth, time_of_birth, coordinates
        HAVING COUNT(*) > 1
        ORDER BY user_id, count DESC
      `
    });
    
    console.log(`Found ${result.rows.length} groups of duplicate people`);
    
    let totalDeleted = 0;
    
    for (const row of result.rows) {
      const ids = row.ids.split(',');
      const count = row.count;
      
      console.log(`Processing group: ${row.user_id} - ${row.relationship} (${count} duplicates)`);
      console.log(`IDs: ${ids.join(', ')}`);
      
      // Keep the first one (oldest), delete the rest
      const toDelete = ids.slice(1);
      
      if (toDelete.length > 0) {
        for (const id of toDelete) {
          await client.execute({
            sql: `DELETE FROM people WHERE id = ?`,
            args: [id]
          });
          console.log(`Deleted duplicate person: ${id}`);
          totalDeleted++;
        }
        
        // Make sure the remaining person is set as default if it's a 'self' relationship
        if (row.relationship === 'self') {
          await client.execute({
            sql: `UPDATE people SET is_default = 1 WHERE id = ?`,
            args: [ids[0]]
          });
          console.log(`Set ${ids[0]} as default for user ${row.user_id}`);
        }
      }
    }
    
    console.log(`\nCleanup complete! Deleted ${totalDeleted} duplicate records.`);
    
    // Show final count
    const finalCount = await client.execute({
      sql: `SELECT COUNT(*) as total FROM people`
    });
    console.log(`Total people records remaining: ${finalCount.rows[0].total}`);
    
  } catch (error) {
    console.error('Cleanup failed:', error);
  }
}

cleanDuplicatePeople();