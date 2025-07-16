// Test the people API endpoint
const testUserId = '113425479876942125321'; // Your Google user ID from the logs

async function testPeopleAPI() {
  const baseUrl = 'http://localhost:3000/api/people';
  
  try {
    console.log('Testing GET /api/people...');
    const response = await fetch(`${baseUrl}?userId=${testUserId}`);
    const result = await response.json();
    
    console.log('GET Response:', JSON.stringify(result, null, 2));
    
    if (result.success && result.people.length === 0) {
      console.log('\nTesting POST /api/people...');
      
      const createResponse = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: testUserId,
          name: 'Orbit Chill',
          relationship: 'self',
          birthData: {
            dateOfBirth: '1990-01-01',
            timeOfBirth: '12:00',
            locationOfBirth: 'New York, NY',
            coordinates: { lat: '40.7128', lon: '-74.0060' }
          },
          notes: 'Test person',
          isDefault: true
        })
      });
      
      const createResult = await createResponse.json();
      console.log('POST Response:', JSON.stringify(createResult, null, 2));
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testPeopleAPI();