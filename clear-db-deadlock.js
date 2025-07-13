#!/usr/bin/env node

/**
 * Emergency script to clear database connection deadlock
 * Run this when you see connection pool timeout errors
 */

const path = require('path');
const fs = require('fs');

async function clearDeadlock() {
  try {
    console.log('🚨 Emergency Database Deadlock Clearance Starting...');
    
    // Import the database connection
    const { getDbAsync } = require('./src/db/index-turso-http');
    
    console.log('📡 Getting database connection...');
    const db = await getDbAsync();
    
    if (!db || !db.pool) {
      console.error('❌ No database pool found');
      return;
    }
    
    console.log('🔧 Triggering emergency recovery...');
    await db.pool.emergencyRecovery();
    
    console.log('📊 Pool status after recovery:');
    console.log('- Connections:', db.pool.connections?.size || 0);
    console.log('- Queue length:', db.pool.waitingQueue?.length || 0);
    
    // Test a simple query
    console.log('🧪 Testing database connectivity...');
    const result = await db.client.execute('SELECT 1 as test');
    console.log('✅ Database test successful:', result.rows[0]);
    
    console.log('✅ Emergency recovery completed successfully!');
    
  } catch (error) {
    console.error('❌ Emergency recovery failed:', error.message);
    console.log('🔄 Attempting force restart...');
    
    // Force process restart as last resort
    process.exit(1);
  }
}

// Run immediately
clearDeadlock();