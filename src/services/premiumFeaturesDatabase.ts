/* eslint-disable @typescript-eslint/no-unused-vars */
import { initializeDatabase } from '@/db/index';
import { DatabaseRow, PremiumFeature } from '@/types/premiumFeatures';

export class PremiumFeaturesDatabase {
  static async checkTableExists(): Promise<boolean> {
    const { client } = await initializeDatabase();
    
    if (!client) {
      throw new Error('Database not available');
    }

    const tableCheck = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='premium_features'
    `);
    
    return tableCheck.rows.length > 0;
  }

  static async getAllFeatures(): Promise<DatabaseRow[]> {
    const { client } = await initializeDatabase();
    
    if (!client) {
      throw new Error('Database not available');
    }

    const result = await client.execute(`
      SELECT * FROM premium_features ORDER BY sort_order ASC
    `);

    return result.rows as DatabaseRow[];
  }

  static async getFeatureById(featureId: string): Promise<DatabaseRow | null> {
    const { client } = await initializeDatabase();
    
    if (!client) {
      throw new Error('Database not available');
    }

    const result = await client.execute({
      sql: 'SELECT * FROM premium_features WHERE id = ?',
      args: [featureId]
    });
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0] as DatabaseRow;
  }

  static async deleteAllFeatures(): Promise<void> {
    const { client } = await initializeDatabase();
    
    if (!client) {
      throw new Error('Database not available');
    }

    await client.execute('DELETE FROM premium_features');
  }

  static async insertFeature(feature: PremiumFeature): Promise<void> {
    const { client } = await initializeDatabase();
    
    if (!client) {
      throw new Error('Database not available');
    }

    const now = Math.floor(Date.now() / 1000);
    
    await client.execute({
      sql: `INSERT INTO premium_features (
        id, name, description, category, is_enabled, is_premium, 
        component, section, sort_order, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        feature.id,
        feature.name,
        feature.description,
        feature.category,
        feature.isEnabled ? 1 : 0,
        feature.isPremium ? 1 : 0,
        feature.component || null,
        feature.section || null,
        feature.sortOrder || 0,
        now,
        now
      ]
    });
  }

  static async updateFeature(
    featureId: string, 
    updates: Record<string, any>
  ): Promise<number> {
    const { client } = await initializeDatabase();
    
    if (!client) {
      throw new Error('Database not available');
    }

    const updateFields: string[] = [];
    const updateValues: any[] = [];
    
    // Build update query dynamically
    for (const [key, value] of Object.entries(updates)) {
      let dbKey = key;
      
      // Convert camelCase to snake_case
      if (key === 'isEnabled') dbKey = 'is_enabled';
      else if (key === 'isPremium') dbKey = 'is_premium';
      else if (key === 'sortOrder') dbKey = 'sort_order';
      else if (key === 'updatedAt') dbKey = 'updated_at';
      
      updateFields.push(`${dbKey} = ?`);
      
      // Convert values for SQLite
      if (typeof value === 'boolean') {
        updateValues.push(value ? 1 : 0);
      } else if (value instanceof Date) {
        updateValues.push(Math.floor(value.getTime() / 1000));
      } else {
        updateValues.push(value);
      }
    }
    
    // Add updated_at timestamp
    updateFields.push('updated_at = ?');
    updateValues.push(Math.floor(Date.now() / 1000));
    
    // Add featureId to end of values array
    updateValues.push(featureId);
    
    const updateQuery = `UPDATE premium_features SET ${updateFields.join(', ')} WHERE id = ?`;
    
    const result = await client.execute({
      sql: updateQuery,
      args: updateValues
    });
    
    return result.rowsAffected || 0;
  }

  static async bulkInsertFeatures(features: PremiumFeature[]): Promise<void> {
    const { client } = await initializeDatabase();
    
    if (!client) {
      throw new Error('Database not available');
    }

    const now = Math.floor(Date.now() / 1000);
    
    // Use a transaction for better performance
    const statements = features.map(feature => ({
      sql: `INSERT INTO premium_features (
        id, name, description, category, is_enabled, is_premium, 
        component, section, sort_order, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        feature.id,
        feature.name,
        feature.description,
        feature.category,
        feature.isEnabled ? 1 : 0,
        feature.isPremium ? 1 : 0,
        feature.component || null,
        feature.section || null,
        feature.sortOrder || 0,
        now,
        now
      ]
    }));

    // Execute all inserts
    for (const statement of statements) {
      await client.execute(statement);
    }
  }

  static async ensureTableExists(): Promise<boolean> {
    const { client } = await initializeDatabase();
    
    if (!client) {
      return false;
    }

    try {
      // Create table if it doesn't exist
      await client.execute(`
        CREATE TABLE IF NOT EXISTS premium_features (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          category TEXT NOT NULL,
          is_enabled INTEGER DEFAULT 1,
          is_premium INTEGER DEFAULT 0,
          component TEXT,
          section TEXT,
          sort_order INTEGER DEFAULT 0,
          created_at INTEGER,
          updated_at INTEGER
        )
      `);
      
      return true;
    } catch (error) {
      console.error('Failed to create premium_features table:', error);
      return false;
    }
  }
}