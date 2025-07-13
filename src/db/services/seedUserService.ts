/* eslint-disable @typescript-eslint/no-unused-vars */
import { getDbAsync } from '@/db/index-turso-http';
import { SEED_PERSONA_TEMPLATES } from '@/data/seedPersonas';

// Ensure seeding tables exist
export const ensureSeedingTablesExist = async (): Promise<boolean> => {
  try {
    const db = await getDbAsync();
    if (!db || !db.client) return false;

    // Check if tables exist
    const seedConfigsResult = await db.client.execute('SELECT name FROM sqlite_master WHERE type="table" AND name="seed_user_configs"');
    const seedBatchesResult = await db.client.execute('SELECT name FROM sqlite_master WHERE type="table" AND name="seeding_batches"');

    if (seedConfigsResult.rows.length === 0) {
      console.log('Creating seed_user_configs table...');
      await db.client.execute(`
        CREATE TABLE seed_user_configs (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          writing_style TEXT NOT NULL,
          expertise_areas TEXT NOT NULL,
          response_pattern TEXT NOT NULL,
          reply_probability REAL NOT NULL,
          voting_behavior TEXT NOT NULL,
          ai_prompt_template TEXT,
          is_active INTEGER NOT NULL DEFAULT 1,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);
    }

    if (seedBatchesResult.rows.length === 0) {
      console.log('Creating seeding_batches table...');
      await db.client.execute(`
        CREATE TABLE seeding_batches (
          id TEXT PRIMARY KEY,
          source_type TEXT NOT NULL,
          source_content TEXT NOT NULL,
          processed_content TEXT,
          status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
          discussions_created INTEGER NOT NULL DEFAULT 0,
          replies_created INTEGER NOT NULL DEFAULT 0,
          votes_created INTEGER NOT NULL DEFAULT 0,
          errors TEXT,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        )
      `);
    }

    return true;
  } catch (error) {
    console.error('Error ensuring seeding tables exist:', error);
    return false;
  }
};

// Interfaces for seed user data
export interface SeedUserConfig {
  id: string;
  userId: string;
  writingStyle: string;
  expertiseAreas: string[];
  responsePattern: string;
  replyProbability: number;
  votingBehavior: string;
  aiPromptTemplate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SeedingBatch {
  id: string;
  sourceType: string;
  sourceContent: string;
  processedContent: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  discussionsCreated: number;
  repliesCreated: number;
  votesCreated: number;
  errors: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  profilePictureUrl?: string;
  authProvider: string;
  createdAt: string;
  updatedAt: string;
}


// Create initial seed users with proper error handling
export const createInitialSeedUsers = async (): Promise<{ success: boolean; created: { users: number; configurations: number }; error?: string }> => {
  try {
    const db = await getDbAsync();
    if (!db) {
      return { success: false, error: 'Database not available', created: { users: 0, configurations: 0 } };
    }

    // Ensure tables exist first
    await ensureSeedingTablesExist();

    let usersCreated = 0;
    let configurationsCreated = 0;

    for (const userData of SEED_PERSONA_TEMPLATES) {
      try {
        // Check if user already exists
        const existingUser = await db.client.execute({
          sql: 'SELECT id FROM users WHERE id = ?',
          args: [userData.id]
        });

        if (existingUser.rows.length === 0) {
          // Create user profile
          await db.client.execute({
            sql: `INSERT INTO users (
              id, username, email, profile_picture_url, auth_provider, 
              sun_sign, stellium_signs, stellium_houses, has_natal_chart,
              show_zodiac_publicly, show_stelliums_publicly, show_birth_info_publicly,
              allow_direct_messages, show_online_status,
              date_of_birth, time_of_birth, location_of_birth, latitude, longitude,
              created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
              userData.id,
              userData.username,
              userData.email,
              userData.avatar,
              userData.authProvider,
              userData.sunSign,
              JSON.stringify(userData.stelliumSigns),
              JSON.stringify(userData.stelliumHouses),
              userData.hasNatalChart ? 1 : 0,
              userData.privacy.showZodiacPublicly ? 1 : 0,
              userData.privacy.showStelliumsPublicly ? 1 : 0,
              userData.privacy.showBirthInfoPublicly ? 1 : 0,
              userData.privacy.allowDirectMessages ? 1 : 0,
              userData.privacy.showOnlineStatus ? 1 : 0,
              userData.birthData?.dateOfBirth || null,
              userData.birthData?.timeOfBirth || null,
              userData.birthData?.locationOfBirth || null,
              userData.birthData?.coordinates ? parseFloat(userData.birthData.coordinates.lat) : null,
              userData.birthData?.coordinates ? parseFloat(userData.birthData.coordinates.lon) : null,
              Math.floor(Date.now() / 1000),
              Math.floor(Date.now() / 1000)
            ]
          });
          usersCreated++;
        }

        // Check if seed config already exists
        const existingConfig = await db.client.execute({
          sql: 'SELECT id FROM seed_user_configs WHERE user_id = ?',
          args: [userData.id]
        });

        if (existingConfig.rows.length === 0) {
          // Create seed configuration
          const configId = `config_${userData.id.replace('seed_user_', '')}`;
          await db.client.execute({
            sql: `INSERT INTO seed_user_configs (
              id, user_id, writing_style, expertise_areas, response_pattern,
              reply_probability, voting_behavior, ai_prompt_template, is_active,
              created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
              configId,
              userData.id,
              userData.writingStyle,
              JSON.stringify(userData.expertiseAreas),
              userData.responsePattern,
              userData.replyProbability,
              userData.votingBehavior,
              '', // Empty AI prompt template for now
              1, // Active
              Math.floor(Date.now() / 1000),
              Math.floor(Date.now() / 1000)
            ]
          });
          configurationsCreated++;
        }
      } catch (userError) {
        console.error(`Error creating seed user ${userData.id}:`, userError);
      }
    }

    return {
      success: true,
      created: {
        users: usersCreated,
        configurations: configurationsCreated
      }
    };
  } catch (error) {
    console.error('Error in createInitialSeedUsers:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      created: { users: 0, configurations: 0 }
    };
  }
};

// Get all seed user configurations with user data
export const getAllSeedUserConfigs = async (): Promise<any[]> => {
  try {
    const db = await getDbAsync();
    if (!db) return [];

    // Ensure tables exist first
    await ensureSeedingTablesExist();

    // Join seed configs with user data to get usernames
    const result = await db.client.execute({
      sql: `SELECT 
        sc.*,
        u.username,
        u.email,
        u.profile_picture_url
      FROM seed_user_configs sc
      LEFT JOIN users u ON sc.user_id = u.id
      WHERE sc.is_active = 1
      ORDER BY sc.created_at DESC`
    });

    return result.rows.map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      username: row.username,
      email: row.email,
      profilePictureUrl: row.profile_picture_url,
      writingStyle: row.writing_style,
      expertiseAreas: JSON.parse(row.expertise_areas || '[]'),
      responsePattern: row.response_pattern,
      replyProbability: Number(row.reply_probability),
      votingBehavior: row.voting_behavior,
      aiPromptTemplate: row.ai_prompt_template || '',
      isActive: Boolean(row.is_active),
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  } catch (error) {
    console.error('Error fetching seed user configs:', error);
    return [];
  }
};

// Get a specific seed user configuration
export const getSeedUserConfig = async (id: string): Promise<SeedUserConfig | null> => {
  try {
    const db = await getDbAsync();
    if (!db) return null;

    const result = await db.client.execute({
      sql: 'SELECT * FROM seed_user_configs WHERE id = ?',
      args: [id]
    });

    if (result.rows.length === 0) return null;

    const row = result.rows[0] as any;
    return {
      id: row.id,
      userId: row.user_id,
      writingStyle: row.writing_style,
      expertiseAreas: JSON.parse(row.expertise_areas || '[]'),
      responsePattern: row.response_pattern,
      replyProbability: Number(row.reply_probability),
      votingBehavior: row.voting_behavior,
      aiPromptTemplate: row.ai_prompt_template || '',
      isActive: Boolean(row.is_active),
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  } catch (error) {
    console.error('Error fetching seed user config:', error);
    return null;
  }
};

// Save seed user configuration
export const saveSeedUserConfig = async (config: SeedUserConfig): Promise<boolean> => {
  try {
    const db = await getDbAsync();
    if (!db) return false;

    // Upsert operation - insert or update if exists
    await db.client.execute({
      sql: `INSERT OR REPLACE INTO seed_user_configs (
        id, user_id, writing_style, expertise_areas, response_pattern,
        reply_probability, voting_behavior, ai_prompt_template, is_active,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        config.id,
        config.userId,
        config.writingStyle,
        JSON.stringify(config.expertiseAreas),
        config.responsePattern,
        config.replyProbability,
        config.votingBehavior,
        config.aiPromptTemplate || '',
        config.isActive ? 1 : 0,
        config.createdAt,
        config.updatedAt
      ]
    });

    return true;
  } catch (error) {
    console.error('Error saving seed user config:', error);
    return false;
  }
};

// Delete seed user configuration
export const deleteSeedUserConfig = async (id: string): Promise<boolean> => {
  try {
    const db = await getDbAsync();
    if (!db) return false;

    await db.client.execute({
      sql: 'DELETE FROM seed_user_configs WHERE id = ?',
      args: [id]
    });

    return true;
  } catch (error) {
    console.error('Error deleting seed user config:', error);
    return false;
  }
};

// Get user profile by ID
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const db = await getDbAsync();
    if (!db) return null;

    const result = await db.client.execute({
      sql: 'SELECT id, username, email, profile_picture_url, auth_provider, created_at, updated_at FROM users WHERE id = ?',
      args: [userId]
    });

    if (result.rows.length === 0) return null;

    const row = result.rows[0] as any;
    return {
      id: row.id,
      username: row.username,
      email: row.email,
      profilePictureUrl: row.profile_picture_url,
      authProvider: row.auth_provider,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

// Get all seeding batches
export const getAllSeedingBatches = async (): Promise<SeedingBatch[]> => {
  try {
    const db = await getDbAsync();
    if (!db) return [];

    // Ensure tables exist first
    await ensureSeedingTablesExist();

    const result = await db.client.execute({
      sql: 'SELECT * FROM seeding_batches ORDER BY created_at DESC'
    });

    return result.rows.map((row: any) => ({
      id: row.id,
      sourceType: row.source_type,
      sourceContent: row.source_content,
      processedContent: row.processed_content,
      status: row.status,
      discussionsCreated: Number(row.discussions_created),
      repliesCreated: Number(row.replies_created),
      votesCreated: Number(row.votes_created),
      errors: JSON.parse(row.errors || '[]'),
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  } catch (error) {
    console.error('Error fetching seeding batches:', error);
    return [];
  }
};

// Save seeding batch
export const saveSeedingBatch = async (batch: SeedingBatch): Promise<boolean> => {
  try {
    const db = await getDbAsync();
    if (!db) return false;

    // Convert timestamps to integers
    const createdAtInt = typeof batch.createdAt === 'string' 
      ? Math.floor(new Date(batch.createdAt).getTime() / 1000) 
      : batch.createdAt;
    const updatedAtInt = typeof batch.updatedAt === 'string'
      ? Math.floor(new Date(batch.updatedAt).getTime() / 1000)
      : batch.updatedAt;

    await db.client.execute({
      sql: `INSERT OR REPLACE INTO seeding_batches (
        id, source_type, source_content, processed_content, status,
        discussions_created, replies_created, votes_created, errors,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        batch.id,
        batch.sourceType,
        batch.sourceContent,
        batch.processedContent,
        batch.status,
        batch.discussionsCreated || 0,
        batch.repliesCreated || 0,
        batch.votesCreated || 0,
        JSON.stringify(batch.errors || []),
        createdAtInt,
        updatedAtInt
      ]
    });

    return true;
  } catch (error) {
    console.error('Error saving seeding batch:', error);
    return false;
  }
};

// Get seeding batch by ID
export const getSeedingBatch = async (id: string): Promise<SeedingBatch | null> => {
  try {
    const db = await getDbAsync();
    if (!db) return null;

    const result = await db.client.execute({
      sql: 'SELECT * FROM seeding_batches WHERE id = ?',
      args: [id]
    });

    if (result.rows.length === 0) return null;

    const row = result.rows[0] as any;
    return {
      id: row.id,
      sourceType: row.source_type,
      sourceContent: row.source_content,
      processedContent: row.processed_content,
      status: row.status,
      discussionsCreated: Number(row.discussions_created || 0),
      repliesCreated: Number(row.replies_created || 0),
      votesCreated: Number(row.votes_created || 0),
      errors: JSON.parse(row.errors || '[]'),
      createdAt: new Date(row.created_at * 1000).toISOString(),
      updatedAt: new Date(row.updated_at * 1000).toISOString()
    };
  } catch (error) {
    console.error('Error fetching seeding batch:', error);
    return null;
  }
};

// Update seeding batch
export const updateSeedingBatch = async (id: string, updates: Partial<SeedingBatch>): Promise<boolean> => {
  try {
    const db = await getDbAsync();
    if (!db) return false;

    const batch = await getSeedingBatch(id);
    if (!batch) return false;

    // Ensure all numeric values are valid
    const updatedBatch = {
      ...batch,
      ...updates,
      discussionsCreated: updates.discussionsCreated ?? batch.discussionsCreated,
      repliesCreated: updates.repliesCreated ?? batch.repliesCreated,
      votesCreated: updates.votesCreated ?? batch.votesCreated,
      updatedAt: new Date().toISOString()
    };

    return await saveSeedingBatch(updatedBatch);
  } catch (error) {
    console.error('Error updating seeding batch:', error);
    return false;
  }
};

// Create discussion in database
export const createDiscussion = async (discussionData: any): Promise<string | null> => {
  try {
    const db = await getDbAsync();
    if (!db) return null;

    const discussionId = `disc_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

    await db.client.execute({
      sql: `INSERT INTO discussions (
        id, title, excerpt, content, author_name, author_id, category,
        replies, views, last_activity, created_at, updated_at,
        is_locked, is_pinned, tags, upvotes, downvotes, is_blog_post, is_published
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        discussionId,
        discussionData.title,
        discussionData.excerpt || discussionData.content.substring(0, 200) + '...',
        discussionData.content,
        discussionData.authorName,
        discussionData.authorId,
        discussionData.category || 'General Discussion',
        0, // initial replies count
        0, // initial views count
        Math.floor(Date.now() / 1000),
        Math.floor(Date.now() / 1000),
        Math.floor(Date.now() / 1000),
        0, // not locked
        0, // not pinned
        JSON.stringify(discussionData.tags || []),
        discussionData.upvotes || 0,
        discussionData.downvotes || 0,
        0, // not a blog post
        1  // published
      ]
    });

    return discussionId;
  } catch (error) {
    console.error('Error creating discussion:', error);
    return null;
  }
};

// Create reply in database
export const createReply = async (replyData: any): Promise<string | null> => {
  try {
    const db = await getDbAsync();
    if (!db) return null;

    const replyId = `reply_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    
    // Use scheduled timestamp if provided, otherwise use current time
    const createdAt = replyData.scheduledCreatedAt || Math.floor(Date.now() / 1000);
    const updatedAt = createdAt; // Same as created for new replies

    await db.client.execute({
      sql: `INSERT INTO discussion_replies (
        id, discussion_id, content, author_name, author_id,
        upvotes, downvotes, parent_reply_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        replyId,
        replyData.discussionId,
        replyData.content,
        replyData.authorName,
        replyData.authorId,
        replyData.upvotes || 0,
        replyData.downvotes || 0,
        replyData.parentReplyId || null,
        createdAt,
        updatedAt
      ]
    });

    // Update discussion reply count and last activity
    // Use the latest reply timestamp as last activity
    await db.client.execute({
      sql: 'UPDATE discussions SET replies = replies + 1, last_activity = ? WHERE id = ?',
      args: [createdAt, replyData.discussionId]
    });

    return replyId;
  } catch (error) {
    console.error('Error creating reply:', error);
    return null;
  }
};

// Create vote in database
export const createVote = async (voteData: any): Promise<boolean> => {
  try {
    const db = await getDbAsync();
    if (!db) return false;

    const voteId = `vote_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

    await db.client.execute({
      sql: `INSERT INTO votes (
        id, user_id, discussion_id, reply_id, vote_type, created_at
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [
        voteId,
        voteData.userId,
        voteData.discussionId || null,
        voteData.replyId || null,
        voteData.voteType,
        Math.floor(Date.now() / 1000)
      ]
    });

    return true;
  } catch (error) {
    console.error('Error creating vote:', error);
    return false;
  }
};

// Delete seeding batch
export const deleteSeedingBatch = async (id: string): Promise<boolean> => {
  try {
    const db = await getDbAsync();
    if (!db) return false;

    await db.client.execute({
      sql: 'DELETE FROM seeding_batches WHERE id = ?',
      args: [id]
    });

    return true;
  } catch (error) {
    console.error('Error deleting seeding batch:', error);
    return false;
  }
};