/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client/http';

interface CustomSentence {
  id: string;
  sentence: string;
  sourceType: 'user' | 'ai_generated' | 'migrated';
  createdAt: string;
  updatedAt: string;
}

interface CardSentencesResponse {
  success: boolean;
  sentences?: CustomSentence[];
  cardInfo?: {
    cardName: string;
    isReversed: boolean;
    totalSentences: number;
    maxAllowed: number;
  };
  error?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse<CardSentencesResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const cardName = searchParams.get('cardName');
    const isReversedParam = searchParams.get('isReversed');
    const limitParam = searchParams.get('limit');

    // Validate required parameters
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    if (!cardName) {
      return NextResponse.json(
        { success: false, error: 'Card name required' },
        { status: 400 }
      );
    }

    // Parse optional parameters
    const isReversed = isReversedParam === 'true';
    const limit = limitParam ? parseInt(limitParam, 10) : 10;

    // Connect to database using Turso HTTP client pattern
    const databaseUrl = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    
    if (!databaseUrl || !authToken) {
      return NextResponse.json({
        success: true,
        sentences: [],
        cardInfo: {
          cardName,
          isReversed,
          totalSentences: 0,
          maxAllowed: 5
        }
      });
    }

    const client = createClient({
      url: databaseUrl,
      authToken: authToken,
    });

    // Query sentences for the specific card and orientation
    let sql = 'SELECT * FROM tarot_custom_sentences WHERE user_id = ? AND card_name = ?';
    let args: any[] = [userId, cardName];

    // Add orientation filter if specified
    if (isReversedParam !== null) {
      sql += ' AND is_reversed = ?';
      args.push(isReversed ? 1 : 0);
    }

    // Add ordering and limit
    sql += ' ORDER BY updated_at DESC';
    if (limit > 0) {
      sql += ' LIMIT ?';
      args.push(limit);
    }

    const result = await client.execute({
      sql,
      args
    });

    // Transform database results to API format
    const sentences: CustomSentence[] = result.rows.map((row: any) => ({
      id: row.id,
      sentence: row.sentence,
      sourceType: row.source_type as 'user' | 'ai_generated' | 'migrated',
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    // Get total count for card info
    const countResult = await client.execute({
      sql: isReversedParam !== null 
        ? 'SELECT COUNT(*) as count FROM tarot_custom_sentences WHERE user_id = ? AND card_name = ? AND is_reversed = ?'
        : 'SELECT COUNT(*) as count FROM tarot_custom_sentences WHERE user_id = ? AND card_name = ?',
      args: isReversedParam !== null ? [userId, cardName, isReversed ? 1 : 0] : [userId, cardName]
    });

    const totalSentences = (countResult.rows[0] as any)?.count || 0;

    return NextResponse.json({
      success: true,
      sentences,
      cardInfo: {
        cardName,
        isReversed,
        totalSentences,
        maxAllowed: 5 // Maximum sentences per card orientation
      }
    });

  } catch (error) {
    console.error('Tarot sentences card API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}