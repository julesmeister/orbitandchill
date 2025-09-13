/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client/http';

interface DeleteSentenceRequest {
  userId: string;
  sentenceId: string;
}

interface DeleteSentenceResponse {
  success: boolean;
  message?: string;
  cardStats?: {
    cardName: string;
    isReversed: boolean;
    remainingSentences: number;
    canAddMore: boolean;
  };
  error?: string;
  code?: string;
}

export async function DELETE(request: NextRequest): Promise<NextResponse<DeleteSentenceResponse>> {
  try {
    const body: DeleteSentenceRequest = await request.json();
    const { userId, sentenceId } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    if (!sentenceId) {
      return NextResponse.json(
        { success: false, error: 'Sentence ID required', code: 'VALIDATION_ERROR' },
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

    // Check if sentence exists and belongs to user
    const existingResult = await client.execute({
      sql: 'SELECT * FROM tarot_custom_sentences WHERE id = ? AND user_id = ?',
      args: [sentenceId, userId]
    });

    if (existingResult.rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Sentence not found or unauthorized access',
        code: 'SENTENCE_NOT_FOUND'
      }, { status: 404 });
    }

    const existingSentence = existingResult.rows[0] as any;
    const cardName = existingSentence.card_name;
    const isReversed = Boolean(existingSentence.is_reversed);

    // Delete the sentence
    const deleteResult = await client.execute({
      sql: 'DELETE FROM tarot_custom_sentences WHERE id = ? AND user_id = ?',
      args: [sentenceId, userId]
    });

    // Get remaining sentence count for this card orientation
    const countResult = await client.execute({
      sql: 'SELECT COUNT(*) as count FROM tarot_custom_sentences WHERE user_id = ? AND card_name = ? AND is_reversed = ?',
      args: [userId, cardName, isReversed ? 1 : 0]
    });

    const remainingSentences = (countResult.rows[0] as any)?.count || 0;
    const maxAllowed = 5; // Maximum sentences per card orientation

    return NextResponse.json({
      success: true,
      message: 'Sentence deleted successfully',
      cardStats: {
        cardName,
        isReversed,
        remainingSentences,
        canAddMore: remainingSentences < maxAllowed
      }
    });

  } catch (error) {
    console.error('Tarot sentences delete API error:', error);
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