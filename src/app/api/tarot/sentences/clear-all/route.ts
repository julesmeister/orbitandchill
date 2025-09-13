/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client/http';

interface ClearAllRequest {
  userId: string;
}

interface ClearAllResponse {
  success: boolean;
  message?: string;
  stats?: {
    deletedCount: number;
    cardsAffected: number;
  };
  error?: string;
  code?: string;
}

export async function DELETE(request: NextRequest): Promise<NextResponse<ClearAllResponse>> {
  try {
    const body: ClearAllRequest = await request.json();
    const { userId } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Connect to database using Turso HTTP client pattern
    const databaseUrl = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    
    if (!databaseUrl || !authToken) {
      return NextResponse.json(
        { success: false, error: 'Database not available', code: 'DATABASE_ERROR' },
        { status: 503 }
      );
    }

    const client = createClient({
      url: databaseUrl,
      authToken: authToken,
    });

    // Get current statistics before deletion
    const preDeleteStats = await client.execute({
      sql: `
        SELECT 
          COUNT(*) as total_sentences,
          COUNT(DISTINCT card_name) as cards_affected
        FROM tarot_custom_sentences 
        WHERE user_id = ?
      `,
      args: [userId]
    });

    const statsRow = preDeleteStats.rows[0] as any;
    const deletedCount = statsRow?.total_sentences || 0;
    const cardsAffected = statsRow?.cards_affected || 0;

    // If no sentences exist, return early
    if (deletedCount === 0) {
      return NextResponse.json({
        success: true,
        message: 'No sentences found to delete',
        stats: {
          deletedCount: 0,
          cardsAffected: 0
        }
      });
    }

    // Delete all custom sentences for the user
    const deleteResult = await client.execute({
      sql: 'DELETE FROM tarot_custom_sentences WHERE user_id = ?',
      args: [userId]
    });

    // Verify deletion was successful
    const verifyResult = await client.execute({
      sql: 'SELECT COUNT(*) as remaining FROM tarot_custom_sentences WHERE user_id = ?',
      args: [userId]
    });

    const remainingCount = (verifyResult.rows[0] as any)?.remaining || 0;

    if (remainingCount > 0) {
      return NextResponse.json({
        success: false,
        error: `Failed to delete all sentences. ${remainingCount} sentences remain.`,
        code: 'DELETION_INCOMPLETE'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'All custom sentences cleared successfully',
      stats: {
        deletedCount,
        cardsAffected
      }
    });

  } catch (error) {
    console.error('Tarot sentences clear-all API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}