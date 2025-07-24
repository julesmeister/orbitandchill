import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

// Initialize Turso client
const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

interface ClearRequest {
  clearType: 'all' | 'card' | 'user';
  cardName?: string;
  isReversed?: boolean;
  userId?: string;
  confirm?: boolean;
}

export async function DELETE(request: NextRequest) {
  try {
    const { clearType, cardName, isReversed, userId, confirm = false }: ClearRequest = await request.json();

    if (!confirm) {
      return NextResponse.json({
        success: false,
        error: 'This operation requires confirmation. Set "confirm": true in the request body.',
        warning: 'This will permanently delete sentences from the database!'
      }, { status: 400 });
    }

    console.log(`🗑️ Clear operation requested: ${clearType}`);

    let sql = '';
    let args: any[] = [];
    let deletedCount = 0;
    let description = '';

    switch (clearType) {
      case 'all':
        sql = 'DELETE FROM tarot_custom_sentences';
        description = 'All sentences cleared from database';
        console.log('⚠️ CLEARING ALL SENTENCES FROM DATABASE');
        break;

      case 'card':
        if (!cardName) {
          return NextResponse.json({
            success: false,
            error: 'cardName is required for card clearType'
          }, { status: 400 });
        }

        sql = 'DELETE FROM tarot_custom_sentences WHERE card_name = ?';
        args = [cardName];

        if (isReversed !== undefined) {
          sql += ' AND is_reversed = ?';
          args.push(isReversed ? 1 : 0);
          description = `All sentences cleared for ${cardName} (${isReversed ? 'reversed' : 'upright'})`;
        } else {
          description = `All sentences cleared for ${cardName} (both orientations)`;
        }
        break;

      case 'user':
        if (!userId) {
          return NextResponse.json({
            success: false,
            error: 'userId is required for user clearType'
          }, { status: 400 });
        }

        sql = 'DELETE FROM tarot_custom_sentences WHERE user_id = ?';
        args = [userId];
        description = `All sentences cleared for user ${userId}`;
        break;

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid clearType. Must be "all", "card", or "user"'
        }, { status: 400 });
    }

    // Get count before deletion
    let countSql = sql.replace('DELETE FROM', 'SELECT COUNT(*) as count FROM');
    const countResult = await client.execute({
      sql: countSql,
      args
    });
    deletedCount = countResult.rows[0]?.count as number || 0;

    if (deletedCount === 0) {
      return NextResponse.json({
        success: true,
        message: 'No sentences found to delete',
        deletedCount: 0,
        operation: clearType
      });
    }

    // Execute deletion
    await client.execute({
      sql,
      args
    });

    // Get remaining total count
    const remainingResult = await client.execute({
      sql: 'SELECT COUNT(*) as count FROM tarot_custom_sentences',
      args: []
    });
    const remainingCount = remainingResult.rows[0]?.count as number || 0;

    console.log(`✅ ${description}: ${deletedCount} sentences deleted`);

    return NextResponse.json({
      success: true,
      message: description,
      deletedCount,
      remainingSentences: remainingCount,
      operation: clearType,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Clear sentences error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}