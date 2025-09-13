/* eslint-disable @typescript-eslint/no-unused-vars */
import { initializeDatabase } from './index';
import { UserService } from './services/userService';
import { DiscussionService } from './services/discussionService';

const seedData = [];

async function seedDiscussions() {
  try {
    console.log('🌱 Seeding discussions...');
    await initializeDatabase();

    console.log('✅ No seed data to create - database ready for real content');
    console.log('🎉 Discussion seeding completed!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  seedDiscussions()
    .then(() => {
      console.log('🌟 Database seeded successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

export { seedDiscussions };