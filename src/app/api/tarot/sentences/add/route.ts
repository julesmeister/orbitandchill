/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client/http';

interface AddSentenceRequest {
  userId?: string;
  cardName: string;
  isReversed: boolean;
  sentence: string;
  sourceType?: 'user' | 'ai_generated' | 'migrated';
}

interface AddSentenceResponse {
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
  cardStats?: {
    totalSentences: number;
    maxAllowed: number;
    canAddMore: boolean;
  };
  error?: string;
  code?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<AddSentenceResponse>> {
  try {
    const body: AddSentenceRequest = await request.json();
    const { userId, cardName, isReversed, sentence, sourceType = 'user' } = body;

    if (!cardName) {
      return NextResponse.json(
        { success: false, error: 'Card name required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    if (!sentence || sentence.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Sentence cannot be empty', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Validate sentence length (reasonable limits)
    if (sentence.length > 500) {
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

    // Generate anonymous user ID if not provided
    const effectiveUserId = userId || `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Ensure the user exists in the users table (create if needed)
    if (!userId) {
      try {
        await client.execute({
          sql: `INSERT OR IGNORE INTO users (
            id, username, auth_provider, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?)`,
          args: [
            effectiveUserId,
            'Anonymous',
            'anonymous',
            Date.now(),
            Date.now()
          ]
        });
      } catch (userCreationError) {
        console.warn('User creation failed (non-critical):', userCreationError);
        // Continue anyway - the FK constraint might not be enforced
      }
    }

    // Check current sentence count for this card orientation (per user)
    const countResult = await client.execute({
      sql: 'SELECT COUNT(*) as count FROM tarot_custom_sentences WHERE user_id = ? AND card_name = ? AND is_reversed = ?',
      args: [effectiveUserId, cardName, isReversed ? 1 : 0]
    });

    const currentCount = (countResult.rows[0] as any)?.count || 0;
    const maxAllowed = 5; // Maximum sentences per card orientation per user

    if (currentCount >= maxAllowed) {
      return NextResponse.json({
        success: false,
        error: `Maximum ${maxAllowed} sentences allowed per card orientation`,
        code: 'SENTENCE_LIMIT_EXCEEDED',
        cardStats: {
          totalSentences: currentCount,
          maxAllowed,
          canAddMore: false
        }
      }, { status: 400 });
    }

    // Check for duplicate sentences (per user)
    const duplicateResult = await client.execute({
      sql: 'SELECT id FROM tarot_custom_sentences WHERE user_id = ? AND card_name = ? AND is_reversed = ? AND sentence = ?',
      args: [effectiveUserId, cardName, isReversed ? 1 : 0, sentence.trim()]
    });

    if (duplicateResult.rows.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Sentence already exists for this card',
        code: 'SENTENCE_DUPLICATE'
      }, { status: 400 });
    }

    // Generate unique ID and timestamps
    const now = new Date();
    const sentenceId = `tarot_sentence_${effectiveUserId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Insert new sentence without foreign key constraint (following Turso HTTP client pattern)
    const insertResult = await client.execute({
      sql: `
        INSERT INTO tarot_custom_sentences (
          id, user_id, card_name, is_reversed, sentence, is_custom, source_type, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        sentenceId,
        effectiveUserId,
        cardName,
        isReversed ? 1 : 0,
        sentence.trim(),
        1, // is_custom = true
        sourceType,
        now.toISOString(),
        now.toISOString()
      ]
    });

    // Verify the sentence was created
    const verifyResult = await client.execute({
      sql: 'SELECT * FROM tarot_custom_sentences WHERE id = ?',
      args: [sentenceId]
    });

    if (verifyResult.rows.length === 0) {
      throw new Error('Failed to create sentence in database');
    }

    const createdSentence = verifyResult.rows[0] as any;

    // Get updated count
    const newCountResult = await client.execute({
      sql: 'SELECT COUNT(*) as count FROM tarot_custom_sentences WHERE user_id = ? AND card_name = ? AND is_reversed = ?',
      args: [effectiveUserId, cardName, isReversed ? 1 : 0]
    });

    const newCount = (newCountResult.rows[0] as any)?.count || 0;

    return NextResponse.json({
      success: true,
      sentence: {
        id: createdSentence.id,
        cardName: createdSentence.card_name,
        isReversed: Boolean(createdSentence.is_reversed),
        sentence: createdSentence.sentence,
        sourceType: createdSentence.source_type as 'user' | 'ai_generated' | 'migrated',
        createdAt: createdSentence.created_at,
        updatedAt: createdSentence.updated_at
      },
      cardStats: {
        totalSentences: newCount,
        maxAllowed,
        canAddMore: newCount < maxAllowed
      }
    });

  } catch (error) {
    console.error('Tarot sentences add API error:', error);
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