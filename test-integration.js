// Simple Node.js script to test the integration
const path = require('path');
const { spawn } = require('child_process');

console.log('🧪 Testing Next.js integration...');
console.log('Working directory:', process.cwd());

// Start Next.js dev server
console.log('Starting Next.js development server...');
const nextProcess = spawn('npm', ['run', 'dev'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  shell: true
});

let serverReady = false;

nextProcess.stdout.on('data', (data) => {
  const output = data.toString();
  console.log('Next.js:', output.trim());
  
  if (output.includes('Local:') || output.includes('localhost:3000')) {
    serverReady = true;
    console.log('✅ Server appears to be ready');
    
    // Wait a bit more then test
    setTimeout(testAPI, 3000);
  }
});

nextProcess.stderr.on('data', (data) => {
  const error = data.toString();
  console.error('Next.js Error:', error.trim());
});

nextProcess.on('close', (code) => {
  console.log(`Next.js process exited with code ${code}`);
});

async function testAPI() {
  console.log('\n🌐 Testing API endpoints...');
  
  try {
    // Test simple health endpoint
    console.log('Testing /api/health...');
    const healthResponse = await fetch('http://localhost:3000/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test discussions test endpoint
    console.log('Testing /api/discussions/test...');
    const testResponse = await fetch('http://localhost:3000/api/discussions/test');
    const testData = await testResponse.json();
    console.log('✅ Discussions test:', testData.message);
    
    // Test actual discussions endpoint
    console.log('Testing /api/discussions...');
    const discussionsResponse = await fetch('http://localhost:3000/api/discussions?limit=2');
    const discussionsData = await discussionsResponse.json();
    console.log('✅ Discussions API:', discussionsData.success ? `${discussionsData.count} discussions` : 'Failed');
    
    console.log('\n🎉 Integration test completed successfully!');
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  } finally {
    // Kill the Next.js process
    nextProcess.kill();
    process.exit(0);
  }
}

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping test...');
  nextProcess.kill();
  process.exit(0);
});

// Timeout after 30 seconds
setTimeout(() => {
  console.log('⏰ Test timeout - killing server');
  nextProcess.kill();
  process.exit(1);
}, 30000);