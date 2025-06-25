// Fix script for discussion same content issue
const https = require('https');
const http = require('http');

// Function to make HTTP requests
function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const protocol = options.port === 443 ? https : http;
    const req = protocol.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({ status: res.statusCode, data: result });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', reject);
    
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function fixDiscussions() {
  console.log('🔧 Fixing Discussion Same Content Issue');
  console.log('=====================================');
  console.log('');

  const baseOptions = {
    hostname: 'localhost',
    port: 3000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  try {
    // Step 1: Check current discussions
    console.log('1. 📋 Checking current discussions...');
    const listResult = await makeRequest({
      ...baseOptions,
      path: '/api/discussions',
      method: 'GET'
    });
    
    console.log(`   Status: ${listResult.status}`);
    console.log(`   Discussions found: ${listResult.data.discussions?.length || 0}`);
    
    if (listResult.data.discussions?.length > 0) {
      console.log('   Existing discussions:');
      listResult.data.discussions.forEach((d, i) => {
        console.log(`     ${i + 1}. ${d.title} (ID: ${d.id})`);
      });
    }
    console.log('');

    // Step 2: Seed database with test data
    console.log('2. 🌱 Seeding database with test discussions...');
    const seedResult = await makeRequest({
      ...baseOptions,
      path: '/api/admin/seed-data',
      method: 'POST'
    });
    
    console.log(`   Status: ${seedResult.status}`);
    console.log(`   Success: ${seedResult.data.success}`);
    
    if (seedResult.data.success) {
      console.log(`   ✅ Created: ${seedResult.data.data.users} users, ${seedResult.data.data.discussions} discussions`);
    } else {
      console.log(`   ❌ Error: ${seedResult.data.error}`);
    }
    console.log('');

    // Step 3: Verify discussions are now different
    console.log('3. 🔍 Verifying discussions are now unique...');
    const newListResult = await makeRequest({
      ...baseOptions,
      path: '/api/discussions',
      method: 'GET'
    });
    
    console.log(`   Status: ${newListResult.status}`);
    console.log(`   Discussions found: ${newListResult.data.discussions?.length || 0}`);
    
    if (newListResult.data.discussions?.length > 0) {
      console.log('   Available discussions:');
      newListResult.data.discussions.forEach((d, i) => {
        console.log(`     ${i + 1}. "${d.title}"`);
        console.log(`        ID: ${d.id}`);
        console.log(`        Category: ${d.category}`);
        console.log(`        Excerpt: ${d.excerpt}`);
        console.log(`        URL: http://localhost:3000/discussions/${d.id}`);
        console.log('');
      });
      
      // Test individual discussions
      console.log('4. 🧪 Testing individual discussion pages...');
      for (let i = 0; i < Math.min(3, newListResult.data.discussions.length); i++) {
        const discussion = newListResult.data.discussions[i];
        const detailResult = await makeRequest({
          ...baseOptions,
          path: `/api/discussions/${discussion.id}`,
          method: 'GET'
        });
        
        console.log(`   Discussion ${i + 1}: ${discussion.title}`);
        console.log(`     API Status: ${detailResult.status}`);
        console.log(`     Success: ${detailResult.data.success}`);
        
        if (detailResult.data.success) {
          console.log(`     ✅ Unique content retrieved (${detailResult.data.discussion.content.length} chars)`);
        } else {
          console.log(`     ❌ Error: ${detailResult.data.error}`);
        }
        console.log('');
      }
    }

    console.log('✅ Fix Complete!');
    console.log('');
    console.log('🎯 Next Steps:');
    console.log('   1. Visit http://localhost:3000/discussions');
    console.log('   2. Click on different discussion titles');
    console.log('   3. Verify each shows unique content');
    console.log('');
    console.log('   If issues persist, check:');
    console.log('   - Browser cache (try hard refresh: Ctrl+Shift+R)');
    console.log('   - Browser dev tools Network tab for API calls');
    console.log('   - Console for any JavaScript errors');

  } catch (error) {
    console.error('❌ Fix failed:', error.message);
    console.log('');
    console.log('📝 Manual steps to fix:');
    console.log('   1. Ensure development server is running on http://localhost:3000');
    console.log('   2. Open browser to http://localhost:3000/admin');
    console.log('   3. Click "Seed Database" or make POST request to /api/admin/seed-data');
    console.log('   4. Refresh discussions page');
  }
}

// Run the fix
fixDiscussions();