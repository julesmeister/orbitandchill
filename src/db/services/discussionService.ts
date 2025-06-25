/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { db, discussions, discussionReplies, votes } from '@/db/index';
import { eq, desc, asc, and, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export interface CreateDiscussionData {
  title: string;
  excerpt: string;
  content: string;
  authorId: string;
  authorName: string;
  category: string;
  tags?: string[];
  embeddedChart?: any;
  embeddedVideo?: any;
  isBlogPost?: boolean;
  isPublished?: boolean;
}

export interface CreateReplyData {
  discussionId: string;
  authorId: string;
  content: string;
  parentReplyId?: string;
}

export class DiscussionService {
  static async createDiscussion(data: CreateDiscussionData, dbInstance?: any) {
    const db = dbInstance || (await import('../index')).db;
    if (!db) {
      console.warn('⚠️ Database not available for creating discussion');
      return null;
    }
    
    const now = new Date();
    const discussion = await db.insert(discussions).values({
      id: nanoid(12),
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      authorId: data.authorId,
      authorName: data.authorName,
      category: data.category,
      tags: JSON.stringify(data.tags || []),
      embeddedChart: data.embeddedChart ? JSON.stringify(data.embeddedChart) : null,
      embeddedVideo: data.embeddedVideo ? JSON.stringify(data.embeddedVideo) : null,
      isBlogPost: data.isBlogPost || false,
      isPublished: data.isPublished ?? true,
      createdAt: now,
      updatedAt: now,
      lastActivity: now,
    }).returning();

    return discussion[0];
  }


  static async getAllDiscussions(options: {
    category?: string;
    isBlogPost?: boolean;
    isPublished?: boolean;
    authorId?: string;
    limit?: number;
    offset?: number;
    sortBy?: 'recent' | 'popular' | 'replies' | 'views';
  } = {}, dbInstance?: any) {
    const db = dbInstance || (await import('../index')).db;
    if (!db) {
      console.warn('⚠️ Database not available for getting discussions, returning empty array');
      return [];
    }
    
    const {
      category,
      isBlogPost,
      isPublished = true,
      authorId,
      limit = 20,
      offset = 0,
      sortBy = 'recent'
    } = options;

    let query = db.select().from(discussions);

    // Apply filters
    const conditions = [];
    console.log('🔍 Building query conditions:', { category, isBlogPost, isPublished, authorId });
    console.log('🔍 isPublished parameter type and value:', typeof isPublished, isPublished);
    
    if (category && category !== 'All Categories') {
      conditions.push(eq(discussions.category, category));
      console.log('🔍 Added category condition');
    }
    if (isBlogPost !== undefined) {
      // Convert boolean to integer for SQLite (SQLite stores booleans as 0/1)
      const sqliteValue = isBlogPost ? 1 : 0;
      conditions.push(eq(discussions.isBlogPost, sqliteValue));
      console.log('🔍 Added isBlogPost condition:', { original: isBlogPost, sqliteValue });
    }
    if (isPublished !== undefined) {
      console.log('🔍 Adding isPublished condition - before:', { isPublished, type: typeof isPublished });
      // Convert boolean to integer for SQLite (SQLite stores booleans as 0/1)
      const sqliteValue = isPublished ? 1 : 0;
      conditions.push(eq(discussions.isPublished, sqliteValue));
      console.log('🔍 Added isPublished condition:', { original: isPublished, sqliteValue });
    }
    if (authorId) {
      conditions.push(eq(discussions.authorId, authorId));
      console.log('🔍 Added authorId condition:', authorId);
    }

    console.log('🔍 Total conditions:', conditions.length);
    
    if (conditions.length > 0) {
      console.log('🔍 Applying WHERE conditions with and(...) - DEPRECATED: Should use raw SQL');
      // NOTE: This Drizzle WHERE clause may not work properly with Turso HTTP client
      // TODO: Convert this method to use executeRawSelect like other methods
      query = query.where(and(...conditions));
    } else {
      console.log('🔍 No conditions applied - returning all discussions');
    }

    // Apply sorting
    switch (sortBy) {
      case 'popular':
        query = query.orderBy(desc(discussions.upvotes));
        break;
      case 'replies':
        query = query.orderBy(desc(discussions.replies));
        break;
      case 'views':
        query = query.orderBy(desc(discussions.views));
        break;
      default:
        query = query.orderBy(desc(discussions.lastActivity));
    }

    const queryWithLimitOffset = query.limit(limit).offset(offset);
    
    // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
    
    const database = dbInstance || (await import('../index')).db;
    const dbObj = database as any;
    const client = dbObj.client;
    
    if (!client) {
      console.error('❌ Database client not available');
      return [];
    }
    
    // Build raw SQL query with proper filtering
    let sql = 'SELECT * FROM discussions';
    const sqlParams: any[] = [];
    const sqlConditions: string[] = [];
    
    if (category && category !== 'All Categories') {
      sqlConditions.push('category = ?');
      sqlParams.push(category);
    }
    
    if (isBlogPost !== undefined) {
      sqlConditions.push('is_blog_post = ?');
      sqlParams.push(isBlogPost ? 1 : 0);
    }
    
    if (isPublished !== undefined) {
      sqlConditions.push('is_published = ?');
      sqlParams.push(isPublished ? 1 : 0);
    }
    
    if (authorId) {
      sqlConditions.push('author_id = ?');
      sqlParams.push(authorId);
    }
    
    if (sqlConditions.length > 0) {
      sql += ' WHERE ' + sqlConditions.join(' AND ');
    }
    
    // Add sorting
    switch (sortBy) {
      case 'popular':
        sql += ' ORDER BY upvotes DESC';
        break;
      case 'replies':
        sql += ' ORDER BY replies DESC';
        break;
      case 'views':
        sql += ' ORDER BY views DESC';
        break;
      default:
        sql += ' ORDER BY last_activity DESC';
    }
    
    // Add limit and offset
    sql += ' LIMIT ? OFFSET ?';
    sqlParams.push(limit, offset);
    
    const rawResult = await client.execute({
      sql,
      args: sqlParams
    });
    
    const results = rawResult.rows || [];

    // Ensure results is an array before mapping
    if (!Array.isArray(results)) {
      console.error('Query results is not an array:', typeof results, results);
      return [];
    }

    const finalResults = results.map(discussion => {
      // Handle both camelCase and snake_case field names from raw SQL
      return {
        id: discussion.id,
        title: discussion.title,
        excerpt: discussion.excerpt,
        content: discussion.content,
        authorId: discussion.author_id || discussion.authorId,
        authorName: discussion.author_name || discussion.authorName,
        category: discussion.category,
        tags: discussion.tags ? JSON.parse(discussion.tags) : [],
        embeddedChart: discussion.embedded_chart ? JSON.parse(discussion.embedded_chart) : null,
        embeddedVideo: discussion.embedded_video ? JSON.parse(discussion.embedded_video) : null,
        replies: discussion.replies,
        views: discussion.views,
        upvotes: discussion.upvotes,
        downvotes: discussion.downvotes,
        isLocked: Boolean(discussion.is_locked ?? discussion.isLocked),
        isPinned: Boolean(discussion.is_pinned ?? discussion.isPinned),
        isBlogPost: Boolean(discussion.is_blog_post ?? discussion.isBlogPost),
        isPublished: Boolean(discussion.is_published ?? discussion.isPublished),
        createdAt: discussion.created_at || discussion.createdAt,
        updatedAt: discussion.updated_at || discussion.updatedAt,
        lastActivity: discussion.last_activity || discussion.lastActivity,
      };
    });
    
    return finalResults;
  }

  static async getDiscussionById(id: string, dbInstance?: any) {
    const db = dbInstance || (await import('../index')).db;
    if (!db) {
      console.warn('⚠️ Database not available for getting discussion');
      return null;
    };
    
    console.log('🔍 Looking for discussion with ID:', id);
    
    // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
    // Same issue as getAllDiscussions - Drizzle WHERE clauses are broken with Turso HTTP client
    
    const dbObj = db as any;
    const client = dbObj.client;
    
    if (!client) {
      console.error('❌ Database client not available');
      return null;
    }
    
    try {
      const rawResult = await client.execute({
        sql: 'SELECT * FROM discussions WHERE id = ? LIMIT 1',
        args: [id]
      });
      
      console.log('🔍 Raw SQL result rows:', rawResult.rows?.length || 0);
      
      if (rawResult.rows && rawResult.rows.length > 0) {
        const row = rawResult.rows[0] as any;
        console.log('🔍 Raw SQL found discussion:', { 
          id: row.id, 
          title: row.title 
        });
        
        return {
          id: row.id,
          title: row.title,
          excerpt: row.excerpt,
          content: row.content,
          authorId: row.author_id,
          authorName: row.author_name,
          category: row.category,
          tags: row.tags ? JSON.parse(row.tags) : [],
          embeddedChart: row.embedded_chart ? JSON.parse(row.embedded_chart) : null,
          embeddedVideo: row.embedded_video ? JSON.parse(row.embedded_video) : null,
          replies: row.replies,
          views: row.views,
          upvotes: row.upvotes,
          downvotes: row.downvotes,
          isLocked: Boolean(row.is_locked),
          isPinned: Boolean(row.is_pinned),
          isBlogPost: Boolean(row.is_blog_post),
          isPublished: Boolean(row.is_published),
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          lastActivity: row.last_activity,
        };
      }
    } catch (rawError) {
      console.error('❌ Raw SQL query failed:', rawError);
    }
    
    console.log('🔍 No discussion found with ID:', id);
    return null;
  }

  static async updateDiscussion(id: string, data: Partial<CreateDiscussionData>, dbInstance?: any) {
    const db = dbInstance || (await import('../index')).db;
    if (!db) {
      console.warn('⚠️ Database not available for updating discussion');
      return null;
    };
    
    // Map camelCase properties to database column names and filter out non-updateable fields
    const updateData: any = {
      updatedAt: new Date(),
    };

    // Only include fields that exist in the database schema
    if (data.title !== undefined) updateData.title = data.title;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.authorName !== undefined) updateData.authorName = data.authorName;
    
    // Handle tags
    if (data.tags !== undefined) {
      updateData.tags = JSON.stringify(data.tags);
    }
    
    // Map boolean fields to correct database column names (using camelCase as Drizzle handles the mapping)
    if ((data as any).isBlogPost !== undefined) {
      updateData.isBlogPost = (data as any).isBlogPost;
    }
    if ((data as any).isPublished !== undefined) {
      updateData.isPublished = (data as any).isPublished;
    }
    if ((data as any).isPinned !== undefined) {
      updateData.isPinned = (data as any).isPinned;
    }
    if ((data as any).isLocked !== undefined) {
      updateData.isLocked = (data as any).isLocked;
    }
    
    // Map numeric fields - only update if they're valid database columns
    if ((data as any).views !== undefined) {
      updateData.views = (data as any).views;
    }
    if ((data as any).upvotes !== undefined) {
      updateData.upvotes = (data as any).upvotes;
    }
    if ((data as any).downvotes !== undefined) {
      updateData.downvotes = (data as any).downvotes;
    }
    if ((data as any).replies !== undefined) {
      updateData.replies = (data as any).replies;
    }

    // Filter out any fields that don't exist in the schema
    // Using the exact Drizzle column names as defined in the schema
    const validFields = [
      'title', 'content', 'excerpt', 'category', 'authorName', 'tags',
      'isBlogPost', 'isPublished', 'isPinned', 'isLocked', 
      'views', 'upvotes', 'downvotes', 'replies', 'updatedAt'
    ];
    
    const filteredUpdateData: any = {};
    for (const field of validFields) {
      if (updateData[field] !== undefined) {
        filteredUpdateData[field] = updateData[field];
      }
    }

    // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
    try {
      await executeRawUpdate(db, 'discussions', filteredUpdateData, [
        { column: 'id', value: id }
      ]);
      
      const discussion = await executeRawSelectOne(db, {
        table: 'discussions',
        conditions: [{ column: 'id', value: id }]
      });
      
      if (!discussion) return null;
      const result = transformDatabaseRow(discussion);
      
      return {
        ...result,
        tags: result.tags ? JSON.parse(result.tags) : [],
      };
    } catch (drizzleError) {
      
      // Fallback to raw SQL with proper column name mapping
      const dbObj = db as any;
      const client = dbObj.client;
      
      if (!client) throw new Error('Database client not available');
      
      // Manual field mapping to database column names
      const columnMapping: Record<string, string> = {
        'authorName': 'author_name',
        'isBlogPost': 'is_blog_post', 
        'isPinned': 'is_pinned',
        'isLocked': 'is_locked',
        'isPublished': 'is_published',
        'createdAt': 'created_at',
        'updatedAt': 'updated_at',
        'lastActivity': 'last_activity'
      };
      
      const mappedUpdates: string[] = [];
      const params: any[] = [];
      
      for (const [field, value] of Object.entries(filteredUpdateData)) {
        const dbColumn = columnMapping[field] || field;
        mappedUpdates.push(`${dbColumn} = ?`);
        
        // Convert Date objects to timestamps for SQLite
        if (value instanceof Date) {
          params.push(Math.floor(value.getTime() / 1000));
        } else {
          params.push(value);
        }
      }
      
      if (mappedUpdates.length === 0) {
        throw new Error('No valid fields to update');
      }
      
      const sql = `UPDATE discussions SET ${mappedUpdates.join(', ')} WHERE id = ?`;
      params.push(id);
      
      const result = await client.execute({ sql, args: params });
      
      // Return the updated discussion
      const selectResult = await client.execute({
        sql: 'SELECT * FROM discussions WHERE id = ?',
        args: [id]
      });
      
      if (!selectResult.rows || selectResult.rows.length === 0) return null;
      
      const updatedRow = selectResult.rows[0] as any;
      return {
        ...updatedRow,
        tags: updatedRow.tags ? JSON.parse(updatedRow.tags) : [],
        // Convert SQLite integers back to booleans
        isBlogPost: Boolean(updatedRow.is_blog_post),
        isPublished: Boolean(updatedRow.is_published),
        isPinned: Boolean(updatedRow.is_pinned),
        isLocked: Boolean(updatedRow.is_locked),
      };
    }
  }

  static async deleteDiscussion(id: string, dbInstance?: any) {
    const db = dbInstance || (await import('../index')).db;
    if (!db) {
      console.warn('⚠️ Database not available for deleting discussion');
      return null;
    };
    
    try {
      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      const existing = await executeRawSelectOne(db, {
        table: 'discussions',
        conditions: [{ column: 'id', value: id }]
      });
      
      if (!existing) return null;
      
      await executeRawDelete(db, 'discussions', [{ column: 'id', value: id }]);
      return transformDatabaseRow(existing);
    } catch (error) {
      console.warn('Standard delete failed, trying raw SQL:', error);
      
      // Fallback to raw SQL for Turso HTTP client
      const dbObj = db as any;
      const client = dbObj.client;
      
      if (!client) throw new Error('Database client not available');
      
      try {
        const result = await client.execute({
          sql: 'DELETE FROM discussions WHERE id = ?',
          args: [id]
        });
        
        console.log('✅ Raw DELETE successful:', result);
        
        // Return true if rows were affected
        return result.rowsAffected && result.rowsAffected > 0 ? { id } : null;
      } catch (rawError) {
        console.error('❌ Raw DELETE failed:', rawError);
        throw rawError;
      }
    }
  }

  static async incrementViews(id: string, dbInstance?: any) {
    const db = dbInstance || (await import('../index')).db;
    if (!db) {
      console.warn('⚠️ Database not available for incrementing views');
      return;
    };
    
    // Use raw SQL for more reliable execution with Turso
    const dbObj = db as any;
    const client = dbObj.client;
    
    if (!client) throw new Error('Database client not available');
    
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      await client.execute({
        sql: 'UPDATE discussions SET views = views + 1, last_activity = ? WHERE id = ?',
        args: [timestamp, id]
      });
    } catch (error) {
      console.error('❌ Failed to increment views:', error);
      // Don't throw here as view counting is not critical
    }
  }

  static async createReply(data: CreateReplyData, dbInstance?: any) {
    const db = dbInstance || (await import('../index')).db;
    if (!db) {
      console.warn('⚠️ Database not available for creating reply');
      return null;
    };
    
    // Use raw SQL for more reliable execution with Turso
    const dbObj = db as any;
    const client = dbObj.client;
    
    if (!client) throw new Error('Database client not available');
    
    try {
      const replyId = nanoid(12);
      const timestamp = Math.floor(Date.now() / 1000);
      
      // Insert the reply
      await client.execute({
        sql: 'INSERT INTO discussion_replies (id, discussion_id, author_id, content, parent_reply_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        args: [replyId, data.discussionId, data.authorId, data.content, data.parentReplyId || null, timestamp, timestamp]
      });

      // Update discussion reply count and last activity
      await client.execute({
        sql: 'UPDATE discussions SET replies = replies + 1, last_activity = ? WHERE id = ?',
        args: [timestamp, data.discussionId]
      });
      
      // Return the created reply
      return {
        id: replyId,
        discussionId: data.discussionId,
        authorId: data.authorId,
        content: data.content,
        parentReplyId: data.parentReplyId,
        createdAt: new Date(),
        updatedAt: new Date(),
        upvotes: 0,
        downvotes: 0
      };
    } catch (error) {
      console.error('❌ Reply creation failed:', error);
      throw error;
    }
  }

  static async getRepliesForDiscussion(discussionId: string, dbInstance?: any) {
    const db = dbInstance || (await import('../index')).db;
    if (!db) {
      console.warn('⚠️ Database not available, returning empty replies array');
      return [];
    }
    
    // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
    // Same issue as other methods - Drizzle WHERE clauses are broken with Turso HTTP client
    
    const dbObj = db as any;
    const client = dbObj.client;
    
    if (!client) {
      console.error('❌ Database client not available');
      return [];
    }
    
    try {
      console.log('🔍 Fetching replies for discussion:', discussionId);
      
      const rawResult = await client.execute({
        sql: 'SELECT * FROM discussion_replies WHERE discussion_id = ? ORDER BY created_at ASC',
        args: [discussionId]
      });
      
      console.log('🔍 Raw SQL result rows for replies:', rawResult.rows?.length || 0);
      
      if (rawResult.rows && rawResult.rows.length > 0) {
        const replies = rawResult.rows.map((row: any) => ({
          id: row.id,
          discussionId: row.discussion_id,
          authorId: row.author_id,
          content: row.content,
          parentReplyId: row.parent_reply_id,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          upvotes: row.upvotes || 0,
          downvotes: row.downvotes || 0
        }));
        
        console.log('🔍 Mapped replies:', replies.length);
        return replies;
      }
      
      console.log('🔍 No replies found for discussion:', discussionId);
      return [];
    } catch (error) {
      console.error('❌ Raw SQL query failed for replies:', error);
      return [];
    }
  }

  static async syncReplyCount(discussionId: string, actualCount: number, dbInstance?: any) {
    const db = dbInstance || (await import('../index')).db;
    if (!db) {
      console.warn('⚠️ Database not available for syncing reply count');
      return;
    };
    
    // Use raw SQL for more reliable execution with Turso
    const dbObj = db as any;
    const client = dbObj.client;
    
    if (!client) throw new Error('Database client not available');
    
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      
      // Update the reply count to match actual count
      await client.execute({
        sql: 'UPDATE discussions SET replies = ?, last_activity = ? WHERE id = ?',
        args: [actualCount, timestamp, discussionId]
      });
    } catch (error) {
      console.error('❌ Failed to sync reply count:', error);
      throw error;
    }
  }

  static async getReplyById(replyId: string, dbInstance?: any) {
    const db = dbInstance || (await import('../index')).db;
    if (!db) {
      console.warn('⚠️ Database not available for getting reply');
      return null;
    };
    
    // Use raw SQL for more reliable execution with Turso
    const dbObj = db as any;
    const client = dbObj.client;
    
    if (!client) throw new Error('Database client not available');
    
    try {
      const result = await client.execute({
        sql: 'SELECT * FROM discussion_replies WHERE id = ?',
        args: [replyId]
      });
      
      return result.rows[0] || null;
    } catch (error) {
      console.error('❌ Failed to get reply:', error);
      throw error;
    }
  }

  static async voteOnReply(userId: string, replyId: string, voteType: 'up' | 'down', dbInstance?: any) {
    const db = dbInstance || (await import('../index')).db;
    if (!db) {
      console.warn('⚠️ Database not available for reply voting, returning mock success');
      return { success: true, upvotes: 1, downvotes: 0 };
    }
    
    // Use raw SQL for more reliable execution with Turso
    const dbObj = db as any;
    const client = dbObj.client;
    
    if (!client) throw new Error('Database client not available');
    
    try {
      // Check if user already voted on this reply
      const existingVoteResult = await client.execute({
        sql: 'SELECT * FROM votes WHERE user_id = ? AND reply_id = ?',
        args: [userId, replyId]
      });
      
      const existingVote = existingVoteResult.rows[0];
      
      // If changing vote, remove old vote and decrement count
      if (existingVote) {
        
        // Delete existing vote
        await client.execute({
          sql: 'DELETE FROM votes WHERE id = ?',
          args: [existingVote.id]
        });
        
        // Decrement old vote count
        const oldVoteType = existingVote.vote_type;
        if (oldVoteType === 'up') {
          await client.execute({
            sql: 'UPDATE discussion_replies SET upvotes = upvotes - 1 WHERE id = ?',
            args: [replyId]
          });
        } else {
          await client.execute({
            sql: 'UPDATE discussion_replies SET downvotes = downvotes - 1 WHERE id = ?',
            args: [replyId]
          });
        }
      }

      // Add new vote
      const voteId = nanoid(12);
      const timestamp = Math.floor(Date.now() / 1000);
      await client.execute({
        sql: 'INSERT INTO votes (id, user_id, reply_id, vote_type, created_at) VALUES (?, ?, ?, ?, ?)',
        args: [voteId, userId, replyId, voteType, timestamp]
      });

      // Update vote count
      if (voteType === 'up') {
        await client.execute({
          sql: 'UPDATE discussion_replies SET upvotes = upvotes + 1 WHERE id = ?',
          args: [replyId]
        });
      } else {
        await client.execute({
          sql: 'UPDATE discussion_replies SET downvotes = downvotes + 1 WHERE id = ?',
          args: [replyId]
        });
      }
    } catch (error) {
      console.error('❌ Reply vote operation failed:', error);
      throw error;
    }
  }

  static async voteOnDiscussion(userId: string, discussionId: string, voteType: 'up' | 'down', dbInstance?: any) {
    const db = dbInstance || (await import('../index')).db;
    if (!db) {
      console.warn('⚠️ Database not available for voting, returning mock success');
      return { success: true, upvotes: 1, downvotes: 0 };
    }
    
    // Use raw SQL for more reliable execution with Turso
    const dbObj = db as any;
    const client = dbObj.client;
    
    if (!client) throw new Error('Database client not available');
    
    try {
      // Check if user already voted
      const existingVoteResult = await client.execute({
        sql: 'SELECT * FROM votes WHERE user_id = ? AND discussion_id = ?',
        args: [userId, discussionId]
      });
      
      const existingVote = existingVoteResult.rows[0];
      
      // If changing vote, remove old vote and decrement count
      if (existingVote) {
        
        // Delete existing vote
        await client.execute({
          sql: 'DELETE FROM votes WHERE id = ?',
          args: [existingVote.id]
        });
        
        // Decrement old vote count
        const oldVoteType = existingVote.vote_type;
        if (oldVoteType === 'up') {
          await client.execute({
            sql: 'UPDATE discussions SET upvotes = upvotes - 1 WHERE id = ?',
            args: [discussionId]
          });
        } else {
          await client.execute({
            sql: 'UPDATE discussions SET downvotes = downvotes - 1 WHERE id = ?',
            args: [discussionId]
          });
        }
      }

      // Add new vote
      const voteId = nanoid(12);
      const timestamp = Math.floor(Date.now() / 1000);
      await client.execute({
        sql: 'INSERT INTO votes (id, user_id, discussion_id, vote_type, created_at) VALUES (?, ?, ?, ?, ?)',
        args: [voteId, userId, discussionId, voteType, timestamp]
      });

      // Update vote count
      if (voteType === 'up') {
        await client.execute({
          sql: 'UPDATE discussions SET upvotes = upvotes + 1 WHERE id = ?',
          args: [discussionId]
        });
      } else {
        await client.execute({
          sql: 'UPDATE discussions SET downvotes = downvotes + 1 WHERE id = ?',
          args: [discussionId]
        });
      }
    } catch (error) {
      console.error('❌ Vote operation failed:', error);
      throw error;
    }
  }

  static async getPopularDiscussions(limit: number = 10, dbInstance?: any) {
    const db = dbInstance || (await import('../index')).db;
    if (!db) {
      console.warn('⚠️ Database not available for getting popular discussions, returning empty array');
      return [];
    };
    
    // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
    const results = await executeRawSelect(db, {
      table: 'discussions',
      conditions: [{ column: 'is_published', value: 1 }],
      orderBy: [{ column: 'upvotes', direction: 'DESC' }],
      limit
    });
    
    return results.map(transformDatabaseRow);
  }

  static async searchDiscussions(query: string, limit: number = 20, dbInstance?: any) {
    const db = dbInstance || (await import('../index')).db;
    if (!db) {
      console.warn('⚠️ Database not available for searching discussions, returning empty array');
      return [];
    };
    
    // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
    const results = await executeRawSelect(db, {
      table: 'discussions',
      customWhere: `is_published = 1 AND (title LIKE '%${query}%' OR content LIKE '%${query}%')`,
      orderBy: [{ column: 'last_activity', direction: 'DESC' }],
      limit
    });

    return results.map((discussion: { tags: string; }) => ({
      ...discussion,
      tags: discussion.tags ? JSON.parse(discussion.tags) : [],
    }));
  }
}