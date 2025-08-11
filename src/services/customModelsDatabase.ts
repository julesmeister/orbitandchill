/* eslint-disable @typescript-eslint/no-unused-vars */
import { CustomAIModel, DatabaseRow } from '@/types/customModels';

export class CustomModelsDatabase {
  private static async getClient() {
    const databaseUrl = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    
    if (!databaseUrl || !authToken) {
      throw new Error('Database environment variables not configured');
    }
    
    const { createClient } = await import('@libsql/client/http');
    return createClient({
      url: databaseUrl,
      authToken: authToken,
    });
  }

  static async ensureTableExists(): Promise<boolean> {
    try {
      const client = await this.getClient();
      
      // Create the custom_ai_models table
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS custom_ai_models (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          provider_id TEXT NOT NULL,
          model_name TEXT NOT NULL,
          display_name TEXT NOT NULL,
          description TEXT,
          is_active INTEGER NOT NULL DEFAULT 1,
          is_default INTEGER NOT NULL DEFAULT 0,
          usage_count INTEGER NOT NULL DEFAULT 0,
          last_used INTEGER,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        )
      `;
      
      await client.execute(createTableSQL);
      
      // Create indexes
      const indexes = [
        'CREATE INDEX IF NOT EXISTS idx_custom_ai_models_user_id ON custom_ai_models(user_id)',
        'CREATE INDEX IF NOT EXISTS idx_custom_ai_models_provider ON custom_ai_models(user_id, provider_id)'
      ];
      
      for (const indexSQL of indexes) {
        await client.execute(indexSQL);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to create custom_ai_models table:', error);
      return false;
    }
  }

  static async getModelsByUser(userId: string, providerId?: string): Promise<CustomAIModel[]> {
    try {
      const client = await this.getClient();
      
      let sql = `
        SELECT id, user_id, provider_id, model_name, display_name, description,
               is_active, is_default, usage_count, last_used, created_at, updated_at
        FROM custom_ai_models 
        WHERE user_id = ?
      `;
      
      const params = [userId];
      
      if (providerId) {
        sql += ' AND provider_id = ?';
        params.push(providerId);
      }
      
      sql += ' ORDER BY created_at';

      const result = await client.execute({ sql, args: params });
      
      return result.rows.map(row => this.mapRowToModel(row as unknown as DatabaseRow));
    } catch (error) {
      console.error('Error fetching custom models:', error);
      throw error;
    }
  }

  static async createModel(
    userId: string,
    providerId: string,
    modelName: string,
    displayName: string,
    description?: string
  ): Promise<CustomAIModel> {
    try {
      const client = await this.getClient();

      // Check for duplicates
      const existingResult = await client.execute({
        sql: `
          SELECT id, model_name FROM custom_ai_models 
          WHERE user_id = ? AND provider_id = ? AND model_name = ?
          LIMIT 1
        `,
        args: [userId, providerId, modelName]
      });

      if (existingResult.rows.length > 0) {
        throw new Error(`Custom model "${modelName}" already exists for this provider`);
      }

      // Generate ID and timestamps
      const modelId = `custom_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      const now = Date.now();

      // Insert new model
      await client.execute({
        sql: `
          INSERT INTO custom_ai_models (
            id, user_id, provider_id, model_name, display_name, description,
            is_active, is_default, usage_count, last_used, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          modelId, userId, providerId, modelName, displayName, description || null,
          1, 0, 0, null, now, now
        ]
      });

      return {
        id: modelId,
        userId,
        providerId,
        modelName,
        displayName,
        description: description || null,
        isActive: true,
        isDefault: false,
        usageCount: 0,
        lastUsed: null,
        createdAt: new Date(now),
        updatedAt: new Date(now),
      };
    } catch (error) {
      console.error('Error creating custom model:', error);
      throw error;
    }
  }

  static async deleteModel(userId: string, modelId: string): Promise<boolean> {
    try {
      const client = await this.getClient();

      const result = await client.execute({
        sql: 'DELETE FROM custom_ai_models WHERE id = ? AND user_id = ?',
        args: [modelId, userId]
      });

      return (result.rowsAffected || 0) > 0;
    } catch (error) {
      console.error('Error deleting custom model:', error);
      throw error;
    }
  }

  private static mapRowToModel(row: DatabaseRow): CustomAIModel {
    return {
      id: row.id,
      userId: row.user_id,
      providerId: row.provider_id,
      modelName: row.model_name,
      displayName: row.display_name,
      description: row.description,
      isActive: Boolean(row.is_active),
      isDefault: Boolean(row.is_default),
      usageCount: row.usage_count,
      lastUsed: row.last_used ? new Date(row.last_used) : null,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}