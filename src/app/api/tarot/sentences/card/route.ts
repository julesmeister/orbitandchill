import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

// Initialize Turso client
const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cardName = searchParams.get('cardName');
  const isReversed = searchParams.get('isReversed');
  const limit = parseInt(searchParams.get('limit') || '20');

  if (!cardName) {
    return NextResponse.json({
      success: false,
      error: 'cardName parameter is required'
    }, { status: 400 });
  }

  try {
    // Build query based on parameters
    let sql = `SELECT 
      id,
      sentence,
      source_type,
      created_at,
      updated_at
    FROM tarot_custom_sentences 
    WHERE card_name = ?`;
    
    const args: any[] = [cardName];

    // Add orientation filter if specified
    if (isReversed !== null) {
      sql += ' AND is_reversed = ?';
      args.push(isReversed === 'true' ? 1 : 0);
    }

    // Add ordering and limit
    sql += ' ORDER BY created_at DESC LIMIT ?';
    args.push(limit);

    // Execute query
    const sentencesResult = await client.execute({
      sql,
      args
    });

    // Get count for this card/orientation combination
    let countSql = 'SELECT COUNT(*) as count FROM tarot_custom_sentences WHERE card_name = ?';
    const countArgs: any[] = [cardName];

    if (isReversed !== null) {
      countSql += ' AND is_reversed = ?';
      countArgs.push(isReversed === 'true' ? 1 : 0);
    }

    const countResult = await client.execute({
      sql: countSql,
      args: countArgs
    });

    // Format sentences
    const sentences = sentencesResult.rows.map(row => ({
      id: row.id,
      sentence: row.sentence,
      sourceType: row.source_type,
      createdAt: new Date(row.created_at as number).toISOString(),
      updatedAt: new Date(row.updated_at as number).toISOString()
    }));

    const totalSentences = countResult.rows[0]?.count as number || 0;

    return NextResponse.json({
      success: true,
      sentences,
      cardInfo: {
        cardName,
        isReversed: isReversed === 'true',
        totalSentences,
        returnedCount: sentences.length
      }
    });

  } catch (error) {
    console.error('Get card sentences error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}