/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch custom AI models for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const providerId = searchParams.get('providerId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    try {
      // Direct database connection using libsql
      const databaseUrl = process.env.TURSO_DATABASE_URL;
      const authToken = process.env.TURSO_AUTH_TOKEN;
      
      if (!databaseUrl || !authToken) {
        throw new Error('Database environment variables not configured');
      }
      
      const { createClient } = await import('@libsql/client/http');
      const client = createClient({
        url: databaseUrl,
        authToken: authToken,
      });

      // Build SQL query with provider filter if provided
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
      
      // Convert snake_case to camelCase for frontend
      const models = result.rows.map(row => ({
        id: row.id as string,
        userId: row.user_id as string,
        providerId: row.provider_id as string,
        modelName: row.model_name as string,
        displayName: row.display_name as string,
        description: row.description as string | null,
        isActive: Boolean(row.is_active),
        isDefault: Boolean(row.is_default),
        usageCount: row.usage_count as number,
        lastUsed: row.last_used ? new Date(row.last_used as number) : null,
        createdAt: new Date(row.created_at as number),
        updatedAt: new Date(row.updated_at as number),
      }));

      return NextResponse.json({
        success: true,
        models: models
      });
    } catch (dbError) {
      console.warn('Database table not available, returning empty models list:', dbError);
      // Graceful fallback - return empty list if table doesn't exist
      return NextResponse.json({
        success: true,
        models: [],
        fallback: true,
        message: 'Custom models table not yet created'
      });
    }

  } catch (error) {
    console.error('Error fetching custom AI models:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch custom AI models' },
      { status: 500 }
    );
  }
}

// Create table if it doesn't exist
async function ensureTableExists() {
  try {
    const databaseUrl = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    
    if (!databaseUrl || !authToken) {
      throw new Error('Database environment variables not configured');
    }
    
    const { createClient } = await import('@libsql/client/http');
    const client = createClient({
      url: databaseUrl,
      authToken: authToken,
    });
    
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
    console.log('✅ Custom AI models table created/verified');
    
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

// POST - Add a new custom AI model
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, providerId, modelName, displayName, description } = body;

    if (!userId || !providerId || !modelName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userId, providerId, modelName' },
        { status: 400 }
      );
    }

    try {
      // Direct database connection using libsql
      const databaseUrl = process.env.TURSO_DATABASE_URL;
      const authToken = process.env.TURSO_AUTH_TOKEN;
      
      if (!databaseUrl || !authToken) {
        throw new Error('Database environment variables not configured');
      }
      
      const { createClient } = await import('@libsql/client/http');
      const client = createClient({
        url: databaseUrl,
        authToken: authToken,
      });

      // Check if model already exists for this user and provider
      const checkSql = `
        SELECT id, model_name, display_name FROM custom_ai_models 
        WHERE user_id = ? AND provider_id = ? AND model_name = ?
        LIMIT 1
      `;
      
      const existingResult = await client.execute({
        sql: checkSql,
        args: [userId, providerId, modelName]
      });

      if (existingResult.rows.length > 0) {
        const existing = existingResult.rows[0];
        console.log('Duplicate model found:', { userId, providerId, modelName, existing: existing.model_name });
        return NextResponse.json(
          { success: false, error: `Custom model "${existing.model_name}" already exists for this provider` },
          { status: 400 }
        );
      }

      // Generate ID and timestamps
      const modelId = `custom_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      const now = Date.now();
      
      // Use modelName as displayName if not provided
      const finalDisplayName = displayName || modelName;

      // Insert new model with snake_case field names
      const insertSql = `
        INSERT INTO custom_ai_models (
          id, user_id, provider_id, model_name, display_name, description,
          is_active, is_default, usage_count, last_used, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      await client.execute({
        sql: insertSql,
        args: [
          modelId,
          userId,
          providerId,
          modelName,
          finalDisplayName,
          description || null,
          1, // is_active (true)
          0, // is_default (false)
          0, // usage_count
          null, // last_used
          now, // created_at
          now // updated_at
        ]
      });

      // Return the created model in camelCase format
      const createdModel = {
        id: modelId,
        userId,
        providerId,
        modelName,
        displayName: finalDisplayName,
        description: description || null,
        isActive: true,
        isDefault: false,
        usageCount: 0,
        lastUsed: null,
        createdAt: new Date(now),
        updatedAt: new Date(now),
      };

      return NextResponse.json({
        success: true,
        model: createdModel,
        message: 'Custom AI model added successfully'
      });
      
    } catch (dbError) {
      console.warn('Database error, attempting to create table:', dbError);
      
      // Try to create the table and retry
      const tableCreated = await ensureTableExists();
      if (!tableCreated) {
        return NextResponse.json(
          { success: false, error: 'Failed to create database table' },
          { status: 500 }
        );
      }
      
      // Retry the operation with direct SQL
      try {
        const databaseUrl = process.env.TURSO_DATABASE_URL!;
        const authToken = process.env.TURSO_AUTH_TOKEN!
        
        const { createClient } = await import('@libsql/client/http');
        const client = createClient({
          url: databaseUrl,
          authToken: authToken,
        });

        const modelId = `custom_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
        const now = Date.now();
        const finalDisplayName = displayName || modelName;

        const insertSql = `
          INSERT INTO custom_ai_models (
            id, user_id, provider_id, model_name, display_name, description,
            is_active, is_default, usage_count, last_used, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        await client.execute({
          sql: insertSql,
          args: [
            modelId, userId, providerId, modelName, finalDisplayName, description || null,
            1, 0, 0, null, now, now
          ]
        });

        const createdModel = {
          id: modelId,
          userId,
          providerId,
          modelName,
          displayName: finalDisplayName,
          description: description || null,
          isActive: true,
          isDefault: false,
          usageCount: 0,
          lastUsed: null,
          createdAt: new Date(now),
          updatedAt: new Date(now),
        };

        return NextResponse.json({
          success: true,
          model: createdModel,
          message: 'Custom AI model added successfully (table created)'
        });
      } catch (retryError) {
        console.error('Retry failed:', retryError);
        return NextResponse.json(
          { success: false, error: 'Failed to create custom AI model after table creation' },
          { status: 500 }
        );
      }
    }

  } catch (error) {
    console.error('Error creating custom AI model:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create custom AI model' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a custom AI model
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, modelId } = body;

    if (!userId || !modelId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userId, modelId' },
        { status: 400 }
      );
    }

    try {
      // Direct database connection using libsql
      const databaseUrl = process.env.TURSO_DATABASE_URL;
      const authToken = process.env.TURSO_AUTH_TOKEN;
      
      if (!databaseUrl || !authToken) {
        throw new Error('Database environment variables not configured');
      }
      
      const { createClient } = await import('@libsql/client/http');
      const client = createClient({
        url: databaseUrl,
        authToken: authToken,
      });

      // Verify ownership and delete with returning info
      const deleteSql = `
        DELETE FROM custom_ai_models 
        WHERE id = ? AND user_id = ?
      `;
      
      const result = await client.execute({
        sql: deleteSql,
        args: [modelId, userId]
      });

      // Check if any rows were affected
      if (result.rowsAffected === 0) {
        return NextResponse.json(
          { success: false, error: 'Custom model not found or not owned by user' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Custom AI model deleted successfully'
      });
    } catch (dbError) {
      console.warn('Database table not available for deletion:', dbError);
      return NextResponse.json(
        { success: false, error: 'Custom models table not available' },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('Error deleting custom AI model:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete custom AI model' },
      { status: 500 }
    );
  }
}