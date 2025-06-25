import { initializeDatabase } from './index';
import { UserService } from './services/userService';
import { DiscussionService } from './services/discussionService';
import { AnalyticsService } from './services/analyticsService';

async function testDatabase() {
  try {
    console.log('🚀 Initializing database...');
    await initializeDatabase();

    console.log('👤 Testing user creation...');
    
    // Create an anonymous user
    const anonUser = await UserService.createUser({
      username: 'Anonymous',
      authProvider: 'anonymous'
    });
    console.log('Created anonymous user:', anonUser);

    // Create a Google user
    const googleUser = await UserService.createUser({
      username: 'John Doe',
      email: 'john@example.com',
      profilePictureUrl: 'https://example.com/avatar.jpg',
      authProvider: 'google'
    });
    console.log('Created Google user:', googleUser);

    // Update user with birth data
    const updatedUser = await UserService.updateUser(googleUser.id, {
      dateOfBirth: '1990-04-20',
      timeOfBirth: '14:30',
      locationOfBirth: 'New York, NY, USA',
      latitude: 40.7128,
      longitude: -74.0060,
      sunSign: 'Taurus',
      stelliumSigns: ['Taurus', 'Gemini'],
      stelliumHouses: ['5th House', '6th House'],
      hasNatalChart: true,
      showZodiacPublicly: true,
    });
    console.log('Updated user:', updatedUser);

    console.log('💬 Testing discussions...');
    
    // Create a discussion
    const discussion = await DiscussionService.createDiscussion({
      title: 'Understanding Your Mars Placement',
      excerpt: 'Mars in our natal chart reveals how we take action...',
      content: 'This is a comprehensive guide to understanding Mars placements in astrology...',
      authorId: googleUser.id,
      authorName: googleUser.username,
      category: 'Natal Chart Analysis',
      tags: ['mars', 'planets', 'natal-chart'],
      isBlogPost: false,
    });
    console.log('Created discussion:', discussion);

    // Create a reply
    const reply = await DiscussionService.createReply({
      discussionId: discussion.id,
      authorId: anonUser.id,
      content: 'Great explanation! I have Mars in Scorpio and this really resonates.',
    });
    console.log('Created reply:', reply);

    // Vote on discussion
    await DiscussionService.voteOnDiscussion(anonUser.id, discussion.id, 'up');
    console.log('Voted on discussion');

    console.log('📊 Testing analytics...');
    
    // Generate some mock analytics data
    await AnalyticsService.generateMockData(7); // 7 days of data
    
    // Get traffic summary
    const trafficSummary = await AnalyticsService.getTrafficSummary(7);
    console.log('Traffic summary:', {
      totalVisitors: trafficSummary.totals.visitors,
      avgVisitorsPerDay: trafficSummary.averages.visitors,
      totalCharts: trafficSummary.totals.chartsGenerated,
    });

    console.log('✅ Database test completed successfully!');
    
    // Test queries
    console.log('🔍 Testing queries...');
    
    const allUsers = await UserService.getAllUsers(10);
    console.log(`Found ${allUsers.length} users`);
    
    const allDiscussions = await DiscussionService.getAllDiscussions({ limit: 10 });
    console.log(`Found ${allDiscussions.length} discussions`);
    
    const publicProfile = await UserService.getPublicProfile(googleUser.id);
    console.log('Public profile:', publicProfile);

  } catch (error) {
    console.error('❌ Database test failed:', error);
    throw error;
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testDatabase()
    .then(() => {
      console.log('🎉 All tests passed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Test failed:', error);
      process.exit(1);
    });
}

export { testDatabase };