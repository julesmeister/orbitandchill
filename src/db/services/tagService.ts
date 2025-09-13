import { db, tags, discussionTags } from '@/db/index';
import { eq, desc, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { createResilientService } from '@/db/resilience';
import { executeRawSelect, executeRawSelectOne, executeRawUpdate, executeRawDelete, RawSqlPatterns, transformDatabaseRow } from '@/db/rawSqlUtils';

// Create resilient service instance
const resilient = createResilientService('TagService');

export interface CreateTagData {
  name: string;
  description?: string;
}

export class TagService {
  static async createTag(data: CreateTagData) {
    return resilient.operation(db, 'createTag', async () => {
      const now = new Date();
      const tag = await db.insert(tags).values({
        id: nanoid(12),
        name: data.name.toLowerCase().trim(),
        description: data.description,
        createdAt: now,
        updatedAt: now,
      }).returning();

      return tag[0];
    }, null);
  }

  static async getAllTags() {
    return resilient.array(db, 'getAllTags', async () => {
      return await db.select()
        .from(tags)
        .orderBy(desc(tags.usageCount), tags.name);
    });
  }

  static async getPopularTags(limit: number = 20) {
    return resilient.array(db, 'getPopularTags', async () => {
      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      const results = await executeRawSelect(db, {
        table: 'tags',
        conditions: [{ column: 'is_popular', value: 1 }],
        orderBy: [
          { column: 'usage_count', direction: 'DESC' },
          { column: 'name', direction: 'ASC' }
        ],
        limit
      });
      
      return results.map(transformDatabaseRow);
    });
  }

  static async getTagById(id: string) {
    return resilient.item(db, 'getTagById', async () => {
      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      const result = await RawSqlPatterns.findById(db, 'tags', id);
      return result ? transformDatabaseRow(result) : null;
    });
  }

  static async getTagByName(name: string) {
    return resilient.item(db, 'getTagByName', async () => {
      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      const result = await executeRawSelectOne(db, {
        table: 'tags',
        conditions: [{ column: 'name', value: name.toLowerCase().trim() }]
      });
      
      return result ? transformDatabaseRow(result) : null;
    });
  }

  static async getOrCreateTag(name: string): Promise<typeof tags.$inferSelect | null> {
    return resilient.operation(db, 'getOrCreateTag', async () => {
      const cleanName = name.toLowerCase().trim();
      let tag = await this.getTagByName(cleanName);
      
      if (!tag) {
        tag = await this.createTag({ name: cleanName });
      }
      
      return tag;
    }, null);
  }

  static async incrementUsageCount(tagId: string) {
    return resilient.operation(db, 'incrementUsageCount', async () => {
      const tag = await this.getTagById(tagId);
      if (tag) {
        // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
        await executeRawUpdate(db, 'tags', {
          usage_count: tag.usageCount + 1,
          updated_at: new Date()
        }, [{ column: 'id', value: tagId }]);
      }
      return true;
    }, false);
  }

  static async updatePopularStatus() {
    return resilient.operation(db, 'updatePopularStatus', async () => {
      // Mark tags with 10+ uses as popular
      await db.update(tags)
        .set({ isPopular: true, updatedAt: new Date() })
        .where(sql`${tags.usageCount} >= 10`);
      return true;
    }, false);
  }

  static async deleteTag(id: string) {
    return resilient.boolean(db, 'deleteTag', async () => {
      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      await executeRawDelete(db, 'tags', [{ column: 'id', value: id }]);
      return true;
    });
  }

  // Tag-Discussion relationship methods
  static async addTagsToDiscussion(discussionId: string, tagNames: string[]) {
    return resilient.array(db, 'addTagsToDiscussion', async () => {
      const tagRelations = [];
      
      for (const tagName of tagNames) {
        if (tagName.trim()) {
          const tag = await this.getOrCreateTag(tagName);
          
          if (tag) {
            // Add the relationship
            await db.insert(discussionTags).values({
              discussionId,
              tagId: tag.id,
            }).onConflictDoNothing();
            
            // Increment usage count
            await this.incrementUsageCount(tag.id);
            
            tagRelations.push(tag);
          }
        }
      }
      
      // Update popular status
      await this.updatePopularStatus();
      
      return tagRelations;
    });
  }

  static async getTagsForDiscussion(discussionId: string) {
    return resilient.array(db, 'getTagsForDiscussion', async () => {
      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      // For JOIN queries, use direct SQL
      const results = await db.execute({
        sql: 'SELECT t.id, t.name, t.usage_count as usageCount FROM tags t INNER JOIN discussion_tags dt ON t.id = dt.tag_id WHERE dt.discussion_id = ?',
        args: [discussionId]
      });
      
      return results.rows.map((row: any) => ({
        id: row[0] as string,
        name: row[1] as string, 
        usageCount: row[2] as number
      }));
    });
  }

  static async removeTagsFromDiscussion(discussionId: string) {
    return resilient.boolean(db, 'removeTagsFromDiscussion', async () => {
      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      await executeRawDelete(db, 'discussion_tags', [{ column: 'discussion_id', value: discussionId }]);
      return true;
    });
  }
}