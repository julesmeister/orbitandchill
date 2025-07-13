/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

// DEBUG endpoint to see all custom models in the database
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Direct database connection using libsql
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

    // Get all custom models for this user or all if no userId
    let sql = `
      SELECT id, user_id, provider_id, model_name, display_name, description,
             is_active, is_default, usage_count, last_used, created_at, updated_at
      FROM custom_ai_models
    `;
    
    const params: string[] = [];
    
    if (userId) {
      sql += ' WHERE user_id = ?';
      params.push(userId);
    }
    
    sql += ' ORDER BY created_at DESC';

    const result = await client.execute({ sql, args: params });
    
    // Convert to readable format
    const models = result.rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      providerId: row.provider_id,
      modelName: row.model_name,
      displayName: row.display_name,
      description: row.description,
      isActive: Boolean(row.is_active),
      isDefault: Boolean(row.is_default),
      usageCount: row.usage_count,
      lastUsed: row.last_used ? new Date(row.last_used as number) : null,
      createdAt: new Date(row.created_at as number),
      updatedAt: new Date(row.updated_at as number),
    }));

    return NextResponse.json({
      success: true,
      models: models,
      count: models.length,
      debug: true
    });

  } catch (error) {
    console.error('Error fetching debug custom models:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch debug models' },
      { status: 500 }
    );
  }
}

// DELETE endpoint to clear all custom models for a user (debug only)
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Direct database connection using libsql
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

    // Delete all custom models for this user
    const deleteSql = `DELETE FROM custom_ai_models WHERE user_id = ?`;
    
    const result = await client.execute({
      sql: deleteSql,
      args: [userId]
    });

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.rowsAffected} custom models for user ${userId}`,
      rowsAffected: result.rowsAffected
    });

  } catch (error) {
    console.error('Error clearing custom models:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear custom models' },
      { status: 500 }
    );
  }
}