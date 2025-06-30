#!/usr/bin/env node

/**
 * Emergency Memory Cleanup Script
 * 
 * Run this script when memory usage is critically high (>95%)
 * Usage: node scripts/emergency-memory-cleanup.js
 */

const fs = require('fs');
const path = require('path');

console.log('🚨 Starting emergency memory cleanup...');

function formatBytes(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

function getMemoryUsage() {
  const usage = process.memoryUsage();
  return {
    rss: usage.rss,
    heapTotal: usage.heapTotal,
    heapUsed: usage.heapUsed,
    external: usage.external,
    heapPercent: (usage.heapUsed / usage.heapTotal) * 100
  };
}

function logMemoryStats(label) {
  const usage = getMemoryUsage();
  console.log(`\n📊 ${label}:`);
  console.log(`   RSS: ${formatBytes(usage.rss)}`);
  console.log(`   Heap Total: ${formatBytes(usage.heapTotal)}`);
  console.log(`   Heap Used: ${formatBytes(usage.heapUsed)} (${usage.heapPercent.toFixed(1)}%)`);
  console.log(`   External: ${formatBytes(usage.external)}`);
  return usage;
}

async function emergencyCleanup() {
  try {
    const beforeUsage = logMemoryStats('Memory Usage BEFORE Cleanup');
    
    if (beforeUsage.heapPercent < 90) {
      console.log('✅ Memory usage is below 90%, no emergency cleanup needed');
      return;
    }
    
    console.log('\n🧹 Performing emergency cleanup...');
    
    // 1. Force garbage collection if available
    if (global.gc) {
      console.log('   Forcing garbage collection...');
      global.gc();
    } else {
      console.log('   ⚠️ Garbage collection not available (run with --expose-gc)');
    }
    
    // 2. Clear require cache (be careful with this)
    const cacheKeys = Object.keys(require.cache);
    const tempCacheSize = cacheKeys.length;
    console.log(`   Clearing ${tempCacheSize} cached modules...`);
    
    // Only clear non-essential modules (avoid core dependencies)
    const safeToClear = cacheKeys.filter(key => 
      !key.includes('node_modules') && 
      !key.includes('schema') &&
      !key.includes('connection')
    );
    
    safeToClear.forEach(key => {
      try {
        delete require.cache[key];
      } catch (error) {
        // Ignore errors when clearing cache
      }
    });
    
    console.log(`   Cleared ${safeToClear.length} cached modules`);
    
    // 3. Create a memory pressure signal file for the app to detect
    const pressureFile = path.join(__dirname, '../.memory-pressure');
    fs.writeFileSync(pressureFile, JSON.stringify({
      timestamp: new Date().toISOString(),
      beforeCleanup: beforeUsage,
      action: 'emergency_cleanup'
    }));
    
    console.log('   Created memory pressure signal file');
    
    // 4. Wait a moment for cleanup to take effect
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 5. Force another GC if available
    if (global.gc) {
      global.gc();
    }
    
    const afterUsage = logMemoryStats('Memory Usage AFTER Cleanup');
    
    const heapSaved = beforeUsage.heapUsed - afterUsage.heapUsed;
    const percentImprovement = ((beforeUsage.heapPercent - afterUsage.heapPercent)).toFixed(1);
    
    console.log(`\n💾 Cleanup Results:`);
    console.log(`   Heap memory freed: ${formatBytes(heapSaved)}`);
    console.log(`   Heap usage improvement: ${percentImprovement}%`);
    
    if (afterUsage.heapPercent > 90) {
      console.log('\n⚠️ Memory usage still high after cleanup!');
      console.log('   Consider restarting the application');
      console.log('   Or investigate for memory leaks using:');
      console.log('   - Node.js --inspect for debugging');
      console.log('   - heap dump analysis');
      console.log('   - Connection pool statistics');
    } else {
      console.log('\n✅ Memory cleanup successful');
    }
    
    // Clean up the pressure file after a minute
    setTimeout(() => {
      try {
        if (fs.existsSync(pressureFile)) {
          fs.unlinkSync(pressureFile);
        }
      } catch (error) {
        // Ignore cleanup errors
      }
    }, 60000);
    
  } catch (error) {
    console.error('❌ Emergency cleanup failed:', error);
    process.exit(1);
  }
}

// Show current memory stats
console.log('\n🔍 Current Process Memory:');
logMemoryStats('Initial State');

// Check if this is an emergency situation
const initialUsage = getMemoryUsage();
if (initialUsage.heapPercent > 95) {
  console.log('\n🚨 CRITICAL: Memory usage above 95% - performing emergency cleanup');
  emergencyCleanup();
} else if (initialUsage.heapPercent > 90) {
  console.log('\n⚠️ WARNING: Memory usage above 90% - performing preventive cleanup');
  emergencyCleanup();
} else {
  console.log('\n✅ Memory usage is normal');
}