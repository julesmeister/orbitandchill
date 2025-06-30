#!/usr/bin/env node

/**
 * Add location fields to astrological_events table
 * This enables location-specific event filtering for electional astrology
 */

import { createClient } from '@libsql/client/http';

async function addLocationFields() {
    console.log('🚀 Adding location fields to astrological_events table...');
    
    // Get database credentials from environment
    const databaseUrl = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    
    if (!databaseUrl || !authToken) {
        console.error('❌ Missing database credentials. Please set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN');
        process.exit(1);
    }
    
    try {
        // Create database client
        const client = createClient({
            url: databaseUrl,
            authToken: authToken,
        });
        
        // Test connection
        await client.execute('SELECT 1 as test');
        console.log('✅ Database connection successful');
        
        // Add location fields to astrological_events table
        const migrations = [
            {
                sql: "ALTER TABLE astrological_events ADD COLUMN location_name TEXT",
                description: "Add location_name field"
            },
            {
                sql: "ALTER TABLE astrological_events ADD COLUMN latitude REAL",
                description: "Add latitude field"
            },
            {
                sql: "ALTER TABLE astrological_events ADD COLUMN longitude REAL", 
                description: "Add longitude field"
            },
            {
                sql: "ALTER TABLE astrological_events ADD COLUMN timezone TEXT",
                description: "Add timezone field"
            }
        ];
        
        for (const migration of migrations) {
            try {
                await client.execute(migration.sql);
                console.log(`✅ ${migration.description}`);
            } catch (error) {
                if (error.message.includes('duplicate column name')) {
                    console.log(`⚠️  ${migration.description} - Column already exists, skipping`);
                } else {
                    throw error;
                }
            }
        }
        
        // Verify the table structure
        const tableInfo = await client.execute("PRAGMA table_info(astrological_events)");
        console.log('\n📋 Updated table structure:');
        tableInfo.rows.forEach(row => {
            if (['location_name', 'latitude', 'longitude', 'timezone'].includes(row.name)) {
                console.log(`   ✅ ${row.name}: ${row.type} (${row.notnull ? 'NOT NULL' : 'NULL'})`);
            }
        });
        
        console.log('\n🎉 Location fields added successfully!');
        console.log('\n🔧 Next steps:');
        console.log('   1. Update EventService to save location data when creating events');
        console.log('   2. Update API endpoints to filter events by user location');
        console.log('   3. Test location-specific event generation');
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run the migration
addLocationFields().catch(console.error);