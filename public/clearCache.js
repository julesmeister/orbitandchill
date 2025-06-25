/**
 * Manual Cache Clear Script
 * 
 * This script can be run in the browser console to manually clear
 * all natal chart caches if users are experiencing timezone issues.
 * 
 * To use:
 * 1. Open your browser's developer console (F12)
 * 2. Navigate to the Console tab
 * 3. Copy and paste this entire script
 * 4. Press Enter to run it
 */

(async function clearLuckstrologyCaches() {
  console.log('🧹 Starting Luckstrology cache cleanup...');
  
  try {
    // Open the Dexie database
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open('LuckstrologyDB');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    
    // Start a transaction
    const transaction = db.transaction(['cache'], 'readwrite');
    const cacheStore = transaction.objectStore('cache');
    
    // Get all cache entries
    const getAllRequest = cacheStore.getAll();
    
    getAllRequest.onsuccess = async () => {
      const allCaches = getAllRequest.result;
      const natalChartCaches = allCaches.filter(entry => 
        entry.key && entry.key.startsWith('natal_chart_')
      );
      
      console.log(`Found ${natalChartCaches.length} natal chart caches`);
      
      // Delete each natal chart cache
      let deletedCount = 0;
      for (const cache of natalChartCaches) {
        try {
          const deleteRequest = cacheStore.delete(cache.key);
          await new Promise((resolve, reject) => {
            deleteRequest.onsuccess = resolve;
            deleteRequest.onerror = reject;
          });
          deletedCount++;
          console.log(`✅ Deleted cache: ${cache.key}`);
        } catch (error) {
          console.error(`❌ Failed to delete cache: ${cache.key}`, error);
        }
      }
      
      console.log(`\n🎉 Successfully cleared ${deletedCount} natal chart caches!`);
      console.log('📝 Please refresh the page and regenerate your charts for the most accurate results.');
      
      // Close the database
      db.close();
    };
    
    getAllRequest.onerror = () => {
      console.error('❌ Failed to read caches:', getAllRequest.error);
    };
    
  } catch (error) {
    console.error('❌ Error accessing database:', error);
    console.log('\nAlternative method: Try clearing all site data:');
    console.log('1. Open Developer Tools (F12)');
    console.log('2. Go to Application tab');
    console.log('3. Find "Storage" in the left sidebar');
    console.log('4. Click "Clear site data"');
  }
})();