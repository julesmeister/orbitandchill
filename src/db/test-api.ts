import { DiscussionService } from './services/discussionService';
import { UserService } from './services/userService';
import { initializeDatabase } from './index';

async function testDiscussionsAPI() {
  try {
    await initializeDatabase();

    // Test the same logic that the API route uses
    const discussions = await DiscussionService.getAllDiscussions({
      isBlogPost: false,
      isPublished: true,
      limit: 100,
      sortBy: 'recent'
    });

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

    enhancedDiscussions.forEach((d, i) => {
    });

    // Test category filtering
    const natalChartDiscussions = await DiscussionService.getAllDiscussions({
      category: 'Natal Chart Analysis',
      isBlogPost: false,
      isPublished: true,
      limit: 100,
      sortBy: 'recent'
    });

    // Test sorting
    const popularDiscussions = await DiscussionService.getAllDiscussions({
      isBlogPost: false,
      isPublished: true,
      limit: 5,
      sortBy: 'popular'
    });

    popularDiscussions.forEach((d, i) => {
    });

  } catch (error) {
    console.error('❌ API test failed:', error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  testDiscussionsAPI()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 API test failed:', error);
      process.exit(1);
    });
}

export { testDiscussionsAPI };