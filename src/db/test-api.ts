import { DiscussionService } from './services/discussionService';
import { UserService } from './services/userService';
import { initializeDatabase } from './index';

async function testDiscussionsAPI() {
  try {
    console.log('🧪 Testing discussions API logic...');
    await initializeDatabase();

    // Test the same logic that the API route uses
    const discussions = await DiscussionService.getAllDiscussions({
      isBlogPost: false,
      isPublished: true,
      limit: 100,
      sortBy: 'recent'
    });

    console.log(`✅ Found ${discussions.length} discussions`);

    // Test enhancing with author information
    const enhancedDiscussions = await Promise.all(
      discussions.slice(0, 3).map(async (discussion) => {
        let authorName = 'Anonymous User';
        if (discussion.authorId) {
          const author = await UserService.getPublicProfile(discussion.authorId);
          if (author) {
            authorName = author.username;
          }
        }

        return {
          ...discussion,
          author: authorName,
          avatar: authorName.split(' ').map(n => n[0]).join('').toUpperCase(),
        };
      })
    );

    console.log('✅ Successfully enhanced discussions with author info');
    console.log('Sample discussions:');
    enhancedDiscussions.forEach((d, i) => {
      console.log(`  ${i + 1}. "${d.title}" by ${d.author} (${d.category})`);
      console.log(`     Tags: ${d.tags.join(', ')}`);
      console.log(`     Stats: ${d.replies} replies, ${d.views} views, ${d.upvotes} upvotes`);
      console.log('');
    });

    // Test category filtering
    const natalChartDiscussions = await DiscussionService.getAllDiscussions({
      category: 'Natal Chart Analysis',
      isBlogPost: false,
      isPublished: true,
      limit: 100,
      sortBy: 'recent'
    });

    console.log(`✅ Found ${natalChartDiscussions.length} discussions in "Natal Chart Analysis" category`);

    // Test sorting
    const popularDiscussions = await DiscussionService.getAllDiscussions({
      isBlogPost: false,
      isPublished: true,
      limit: 5,
      sortBy: 'popular'
    });

    console.log(`✅ Found ${popularDiscussions.length} popular discussions`);
    console.log('Popular discussions (by upvotes):');
    popularDiscussions.forEach((d, i) => {
      console.log(`  ${i + 1}. "${d.title}" - ${d.upvotes} upvotes`);
    });

    console.log('\n🎉 All API logic tests passed!');
    console.log('✨ The discussions integration should work correctly!');

  } catch (error) {
    console.error('❌ API test failed:', error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  testDiscussionsAPI()
    .then(() => {
      console.log('🌟 API test completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 API test failed:', error);
      process.exit(1);
    });
}

export { testDiscussionsAPI };