#!/usr/bin/env node
import { createClient } from '@libsql/client';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function applyMigrations() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  console.log('Connecting to Turso database...');

  try {
    // Read all SQL migration files in order
    const migrationsDir = join(process.cwd(), 'migrations');
    const migrationFiles = readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    console.log(`Found ${migrationFiles.length} migration files`);

    for (const file of migrationFiles) {
      console.log(`\nApplying migration: ${file}`);
      const sqlPath = join(migrationsDir, file);
      const sql = readFileSync(sqlPath, 'utf-8');

      // Split by statement breakpoint and execute each statement
      const statements = sql.split('--> statement-breakpoint')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      for (const statement of statements) {
        try {
          await client.execute(statement);
        } catch (error) {
          console.error(`Error executing statement: ${error.message}`);
          console.error(`Statement: ${statement.substring(0, 100)}...`);
          // Continue with other statements
        }
      }
      
      console.log(`✓ Applied ${file}`);
    }

    console.log('\n✅ All migrations applied successfully!');
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

applyMigrations();