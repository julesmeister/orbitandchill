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
    const listResult = await makeRequest({
      ...baseOptions,
      path: '/api/discussions',
      method: 'GET'
    });

    if (listResult.data.discussions?.length > 0) {
      listResult.data.discussions.forEach((d, i) => {
      });
    }

    // Step 2: Seed database with test data
    const seedResult = await makeRequest({
      ...baseOptions,
      path: '/api/admin/seed-data',
      method: 'POST'
    });

    if (seedResult.data.success) {
    } else {
    }

    // Step 3: Verify discussions are now different
    const newListResult = await makeRequest({
      ...baseOptions,
      path: '/api/discussions',
      method: 'GET'
    });

    if (newListResult.data.discussions?.length > 0) {
      newListResult.data.discussions.forEach((d, i) => {
      });
      
      // Test individual discussions
      for (let i = 0; i < Math.min(3, newListResult.data.discussions.length); i++) {
        const discussion = newListResult.data.discussions[i];
        const detailResult = await makeRequest({
          ...baseOptions,
          path: `/api/discussions/${discussion.id}`,
          method: 'GET'
        });

        if (detailResult.data.success) {
        } else {
        }
      }
    }

  } catch (error) {
    console.error('❌ Fix failed:', error.message);
  }
}

// Run the fix
fixDiscussions();