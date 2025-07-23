/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client/http';

interface RandomSentenceResponse {
  success: boolean;
  sentence?: string;
  cardInfo?: {
    cardName: string;
    isReversed: boolean;
    totalSentences: number;
  };
  error?: string;
  code?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse<RandomSentenceResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const cardName = searchParams.get('cardName');
    const isReversedParam = searchParams.get('isReversed');

    // Validate required parameters
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    if (!cardName) {
      return NextResponse.json(
        { success: false, error: 'Card name required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Parse optional parameters
    const isReversed = isReversedParam === 'true';

    // Connect to database using Turso HTTP client pattern
    const databaseUrl = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    
    if (!databaseUrl || !authToken) {
      return NextResponse.json({
        success: false,
        error: 'Database not available',
        code: 'DATABASE_ERROR'
      }, { status: 503 });
    }

    const client = createClient({
      url: databaseUrl,
      authToken: authToken,
    });

    // Get all sentences for the card and orientation
    const result = await client.execute({
      sql: 'SELECT sentence FROM tarot_custom_sentences WHERE user_id = ? AND card_name = ? AND is_reversed = ?',
      args: [userId, cardName, isReversed ? 1 : 0]
    });

    if (result.rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No sentences found for this card',
        code: 'NO_SENTENCES_FOUND'
      }, { status: 404 });
    }

    // Select a random sentence
    const randomIndex = Math.floor(Math.random() * result.rows.length);
    const randomSentence = (result.rows[randomIndex] as any).sentence;

    return NextResponse.json({
      success: true,
      sentence: randomSentence,
      cardInfo: {
        cardName,
        isReversed,
        totalSentences: result.rows.length
      }
    });

  } catch (error) {
    console.error('Tarot sentences random API error:', error);
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