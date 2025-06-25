import { db, categories } from '@/db/index';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { createResilientService } from '@/db/resilience';
import { executeRawSelect, executeRawSelectOne, executeRawUpdate, executeRawDelete, RawSqlPatterns, transformDatabaseRow } from '@/db/rawSqlUtils';

// Create resilient service instance
const resilient = createResilientService('CategoryService');

export interface CreateCategoryData {
  name: string;
  description?: string;
  color: string;
  icon?: string;
  sortOrder?: number;
}

export class CategoryService {
  static async createCategory(data: CreateCategoryData) {
    return resilient.operation(db, 'createCategory', async () => {
      const category = await db.insert(categories).values({
        id: nanoid(12),
        name: data.name,
        description: data.description,
        color: data.color,
        icon: data.icon,
        sortOrder: data.sortOrder || 0,
      }).returning();

      return category[0];
    }, null);
  }

  static async getAllCategories() {
    return resilient.array(db, 'getAllCategories', async () => {
      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      const results = await executeRawSelect(db, {
        table: 'categories',
        conditions: [{ column: 'is_active', value: 1 }],
        orderBy: [
          { column: 'sort_order', direction: 'ASC' },
          { column: 'name', direction: 'ASC' }
        ]
      });
      
      return results.map(transformDatabaseRow);
    });
  }

  static async getCategoryById(id: string) {
    return resilient.item(db, 'getCategoryById', async () => {
      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      const result = await RawSqlPatterns.findById(db, 'categories', id);
      return result ? transformDatabaseRow(result) : null;
    });
  }

  static async getCategoryByName(name: string) {
    return resilient.item(db, 'getCategoryByName', async () => {
      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      const result = await executeRawSelectOne(db, {
        table: 'categories',
        conditions: [{ column: 'name', value: name }]
      });
      
      return result ? transformDatabaseRow(result) : null;
    });
  }

  static async updateCategory(id: string, data: Partial<CreateCategoryData>) {
    return resilient.operation(db, 'updateCategory', async () => {
      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      const updateData = { ...data, updatedAt: new Date() };
      const rowsAffected = await RawSqlPatterns.updateById(db, 'categories', id, updateData);
      
      if (rowsAffected === 0) return null;
      
      // Return the updated category
      return await this.getCategoryById(id);
    }, null);
  }

  static async incrementDiscussionCount(categoryName: string) {
    return resilient.operation(db, 'incrementDiscussionCount', async () => {
      const category = await this.getCategoryByName(categoryName);
      if (category) {
        // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
        await executeRawUpdate(db, 'categories', {
          discussion_count: category.discussionCount + 1,
          updated_at: new Date()
        }, [{ column: 'id', value: category.id }]);
      }
      return true;
    }, false);
  }

  static async deleteCategory(id: string) {
    return resilient.boolean(db, 'deleteCategory', async () => {
      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      await executeRawDelete(db, 'categories', [{ column: 'id', value: id }]);
      return true;
    });
  }
}