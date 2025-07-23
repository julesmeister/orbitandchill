/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client/http';

interface UpdateSentenceRequest {
  userId: string;
  sentenceId: string;
  newSentence: string;
}

interface UpdateSentenceResponse {
  success: boolean;
  sentence?: {
    id: string;
    cardName: string;
    isReversed: boolean;
    sentence: string;
    sourceType: 'user' | 'ai_generated' | 'migrated';
    createdAt: string;
    updatedAt: string;
  };
  error?: string;
  code?: string;
}

export async function PUT(request: NextRequest): Promise<NextResponse<UpdateSentenceResponse>> {
  try {
    const body: UpdateSentenceRequest = await request.json();
    const { userId, sentenceId, newSentence } = body;

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

    if (!newSentence || newSentence.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'New sentence cannot be empty', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Validate sentence length
    if (newSentence.length > 500) {
      return NextResponse.json(
        { success: false, error: 'Sentence too long (max 500 characters)', code: 'VALIDATION_ERROR' },
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

    // Check for duplicate sentences (excluding the current one)
    const duplicateResult = await client.execute({
      sql: `
        SELECT id FROM tarot_custom_sentences 
        WHERE user_id = ? AND card_name = ? AND is_reversed = ? AND sentence = ? AND id != ?
      `,
      args: [
        userId, 
        existingSentence.card_name, 
        existingSentence.is_reversed, 
        newSentence.trim(),
        sentenceId
      ]
    });

    if (duplicateResult.rows.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'A sentence with this text already exists for this card',
        code: 'SENTENCE_DUPLICATE'
      }, { status: 400 });
    }

    // Update the sentence
    const now = new Date();
    const updateResult = await client.execute({
      sql: 'UPDATE tarot_custom_sentences SET sentence = ?, updated_at = ? WHERE id = ? AND user_id = ?',
      args: [newSentence.trim(), now.toISOString(), sentenceId, userId]
    });

    // Verify the update was successful by fetching the updated sentence
    const updatedResult = await client.execute({
      sql: 'SELECT * FROM tarot_custom_sentences WHERE id = ?',
      args: [sentenceId]
    });

    if (updatedResult.rows.length === 0) {
      throw new Error('Failed to update sentence in database');
    }

    const updatedSentence = updatedResult.rows[0] as any;

    return NextResponse.json({
      success: true,
      sentence: {
        id: updatedSentence.id,
        cardName: updatedSentence.card_name,
        isReversed: Boolean(updatedSentence.is_reversed),
        sentence: updatedSentence.sentence,
        sourceType: updatedSentence.source_type as 'user' | 'ai_generated' | 'migrated',
        createdAt: updatedSentence.created_at,
        updatedAt: updatedSentence.updated_at
      }
    });

  } catch (error) {
    console.error('Tarot sentences update API error:', error);
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