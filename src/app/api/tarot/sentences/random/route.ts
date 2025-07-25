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

  if (!cardName) {
    return NextResponse.json({
      success: false,
      error: 'cardName parameter is required'
    }, { status: 400 });
  }

  try {
    console.log(`🎲 Getting random sentence for ${cardName} (reversed: ${isReversed})`);

    // Build query for random sentence
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

    // SQLite RANDOM() for getting random sentence
    sql += ' ORDER BY RANDOM() LIMIT 1';

    // Execute query
    const result = await client.execute({
      sql,
      args
    });

    if (result.rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: `No sentences found for ${cardName}${isReversed ? ' (reversed)' : ''}`,
        cardInfo: {
          cardName,
          isReversed: isReversed === 'true',
          totalSentences: 0
        }
      }, { status: 404 });
    }

    // Get total count for this card/orientation for info
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

    const sentence = result.rows[0];
    const totalSentences = countResult.rows[0]?.count as number || 0;

    return NextResponse.json({
      success: true,
      sentence: sentence.sentence,
      sentenceInfo: {
        id: sentence.id,
        sourceType: sentence.source_type,
        createdAt: new Date(sentence.created_at as number).toISOString()
      },
      cardInfo: {
        cardName,
        isReversed: isReversed === 'true',
        totalSentences
      }
    });

  } catch (error) {
    console.error('Get random sentence error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}