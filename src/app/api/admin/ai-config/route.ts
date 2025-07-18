/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

interface AIConfig {
  id: string;
  provider: string;
  model: string;
  apiKey: string;
  temperature: number;
  isDefault: boolean;
  isPublic: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// GET - Fetch AI configuration (public endpoint)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const configType = searchParams.get('type') || 'public'; // 'public' or 'admin'

    // Direct database connection following API_DATABASE_PROTOCOL.md pattern
    let aiConfig = null;
    try {
      const databaseUrl = process.env.TURSO_DATABASE_URL;
      const authToken = process.env.TURSO_AUTH_TOKEN;
      
      if (databaseUrl && authToken) {
        const { createClient } = await import('@libsql/client/http');
        const client = createClient({
          url: databaseUrl,
          authToken: authToken,
        });

        // Use direct SQL query following the established pattern
        const result = await client.execute({
          sql: `SELECT id, provider, model, api_key, temperature, is_default, is_public, description, created_at, updated_at
                FROM ai_configurations 
                WHERE is_public = 1 AND is_default = 1
                ORDER BY created_at DESC
                LIMIT 1`,
          args: []
        });
        
        if (result.rows && result.rows.length > 0) {
          const row = result.rows[0];
          aiConfig = {
            id: row.id as string,
            provider: row.provider as string,
            model: row.model as string,
            apiKey: row.api_key as string,
            temperature: row.temperature as number,
            isDefault: Boolean(row.is_default),
            isPublic: Boolean(row.is_public),
            description: row.description as string | undefined,
            createdAt: new Date(row.created_at as number),
            updatedAt: new Date(row.updated_at as number),
          };
        }
      }
    } catch (dbError) {
      console.error('[API] Database error:', dbError);
      // Continue with fallback - don't throw
    }

    // Return AI config if found, otherwise return default configuration
    if (aiConfig) {
      return NextResponse.json({
        success: true,
        config: aiConfig
      });
    } else {
      // Fallback to default configuration
      const defaultConfig: Partial<AIConfig> = {
        provider: 'openrouter',
        model: 'deepseek/deepseek-r1-distill-llama-70b:free',
        apiKey: '', // Will be empty - needs to be set by admin
        temperature: 0.7,
        isDefault: true,
        isPublic: true,
        description: 'Default AI configuration - database not available'
      };

      return NextResponse.json({
        success: true,
        config: defaultConfig,
        fallback: true,
        message: 'Using default configuration - no AI config found in database'
      });
    }

  } catch (error) {
    console.error('Error fetching AI configuration:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch AI configuration' },
      { status: 500 }
    );
  }
}

// POST - Create or update AI configuration (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, model, apiKey, temperature, isDefault, isPublic, description } = body;

    if (!provider || !model || !apiKey) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: provider, model, apiKey' },
        { status: 400 }
      );
    }

    // Direct database connection following API_DATABASE_PROTOCOL.md pattern
    try {
      const databaseUrl = process.env.TURSO_DATABASE_URL;
      const authToken = process.env.TURSO_AUTH_TOKEN;
      
      if (!databaseUrl || !authToken) {
        return NextResponse.json(
          { success: false, error: 'Database environment variables not configured' },
          { status: 500 }
        );
      }
      
      const { createClient } = await import('@libsql/client/http');
      const client = createClient({
        url: databaseUrl,
        authToken: authToken,
      });

      // If this is being set as default, unset all other defaults
      if (isDefault) {
        await client.execute({
          sql: 'UPDATE ai_configurations SET is_default = 0 WHERE is_default = 1',
          args: []
        });
      }

      // Check if a configuration with this provider/model already exists
      const existingResult = await client.execute({
        sql: 'SELECT id FROM ai_configurations WHERE provider = ? AND model = ? LIMIT 1',
        args: [provider, model]
      });

      const now = Date.now();
      
      if (existingResult.rows && existingResult.rows.length > 0) {
        // Update existing configuration
        const configId = existingResult.rows[0].id as string;
        
        await client.execute({
          sql: `UPDATE ai_configurations 
                SET api_key = ?, temperature = ?, is_default = ?, is_public = ?, description = ?, updated_at = ?
                WHERE id = ?`,
          args: [
            apiKey,
            temperature || 0.7,
            isDefault ? 1 : 0,
            isPublic ? 1 : 0,
            description || null,
            now,
            configId
          ]
        });

        return NextResponse.json({
          success: true,
          message: 'AI configuration updated successfully',
          updated: true
        });
      } else {
        // Create new configuration
        const configId = `ai_config_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
        
        await client.execute({
          sql: `INSERT INTO ai_configurations (
                  id, provider, model, api_key, temperature, is_default, is_public, description, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            configId,
            provider,
            model,
            apiKey,
            temperature || 0.7,
            isDefault ? 1 : 0,
            isPublic ? 1 : 0,
            description || null,
            now,
            now
          ]
        });

        return NextResponse.json({
          success: true,
          message: 'AI configuration created successfully',
          created: true
        });
      }
      
    } catch (dbError) {
      console.error('[API] Database error:', dbError);
      
      // Return error instead of trying to create table dynamically
      return NextResponse.json(
        { 
          success: false, 
          error: 'AI configuration table not available. Please contact administrator to set up the database.',
          fallback: true 
        },
        { status: 503 }
      );
    }

  } catch (error) {
    console.error('Error creating/updating AI configuration:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create/update AI configuration' },
      { status: 500 }
    );
  }
}