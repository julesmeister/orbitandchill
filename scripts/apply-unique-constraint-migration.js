import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  console.log('Adding unique constraints to people table...');
  
  // Load environment variables
  config({ path: '.env.local' });
  
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  
  const migrationPath = path.join(__dirname, '../migrations/0020_add_unique_constraint_people.sql');
  const migration = fs.readFileSync(migrationPath, 'utf8');
  
  try {
    // Split by semicolon to get individual statements
    const statements = migration.split(';').filter(s => s.trim());
    
    for (const stmt of statements) {
      const sql = stmt.replace(/^--.*$/gm, '').trim();
      if (sql && sql.length > 0) {
        console.log('Executing:', sql.substring(0, 100) + '...');
        await client.execute(sql);
      }
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

runMigration();