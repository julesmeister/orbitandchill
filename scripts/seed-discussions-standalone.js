/* eslint-disable @typescript-eslint/no-unused-vars */
// Standalone script to seed discussions data

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function seedDiscussions() {
  console.log('🌱 Seeding Discussions Data');
  
  try {
    // Import Turso client
    const { createClient } = await import('@libsql/client/http');
    
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    
    console.log('✅ Connected to Turso database');
    
    const generateId = () => Math.random().toString(36).substring(2, 15);
    const now = Math.floor(Date.now() / 1000);
    
    // Sample users
    const users = [
      { id: 'user_astromaster', username: 'AstroMaster', authProvider: 'anonymous' },
      { id: 'user_cosmicseer', username: 'CosmicSeer', authProvider: 'anonymous' },
      { id: 'user_starseeker', username: 'StarSeeker23', authProvider: 'anonymous' },
      { id: 'user_loveastro', username: 'LoveAstrologer', authProvider: 'anonymous' },
      { id: 'user_transform', username: 'TransformationGuru', authProvider: 'anonymous' },
    ];
    
    // Create users
    console.log('👥 Creating users...');
    for (const user of users) {
      try {
        await client.execute({
          sql: `INSERT OR IGNORE INTO users 
                (id, username, auth_provider, created_at, updated_at, has_natal_chart) 
                VALUES (?, ?, ?, ?, ?, ?)`,
          args: [user.id, user.username, user.authProvider, now, now, 1]
        });
      } catch (error) {
        console.log(`User ${user.username} might already exist, skipping...`);
      }
    }
    
    // Sample discussions - cleared
    const discussions = [];
    
    // Create discussions
    console.log('💬 Creating discussions...');
    for (const discussion of discussions) {
      try {
        await client.execute({
          sql: `INSERT OR IGNORE INTO discussions 
                (id, title, excerpt, content, author_id, author_name, category, tags,
                 upvotes, views, replies, is_pinned, is_blog_post, is_published,
                 created_at, updated_at, last_activity) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            generateId(), discussion.title, discussion.excerpt, discussion.content,
            discussion.authorId, discussion.authorName, discussion.category, discussion.tags,
            discussion.upvotes, discussion.views, discussion.replies,
            discussion.isPinned || 0, discussion.isBlogPost || 0, 1,
            now - Math.floor(Math.random() * 86400 * 7), // Random time in last week
            now, now
          ]
        });
      } catch (error) {
        console.log(`Discussion "${discussion.title}" might already exist, skipping...`);
      }
    }
    
    // Verify data
    const userCount = await client.execute('SELECT COUNT(*) as count FROM users');
    const discussionCount = await client.execute('SELECT COUNT(*) as count FROM discussions');
    
    console.log(`👥 Users: ${userCount.rows[0].count}`);
    console.log(`💬 Discussions: ${discussionCount.rows[0].count}`);
    
    await client.close();
    console.log('🎉 Discussion seeding complete!');
    
  } catch (error) {
    console.error('❌ Failed to seed discussions:', error);
    process.exit(1);
  }
}

// Run the function
seedDiscussions();