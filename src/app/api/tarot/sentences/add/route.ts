import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import { randomUUID } from 'crypto';

// Initialize Turso client
const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

interface AddSentenceRequest {
  userId?: string;
  cardName: string;
  isReversed: boolean;
  sentence: string;
  sourceType?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { userId = 'anonymous_add', cardName, isReversed, sentence, sourceType = 'user' }: AddSentenceRequest = await request.json();

    if (!cardName || sentence === undefined || typeof isReversed !== 'boolean') {
      return NextResponse.json({
        success: false,
        error: 'cardName, sentence, and isReversed are required'
      }, { status: 400 });
    }

    console.log(`➕ Adding sentence for ${cardName} (reversed: ${isReversed}): "${sentence.substring(0, 50)}..."`);

    // Ensure user exists (create minimal entry if needed for FK constraint)
    try {
      const userCheck = await client.execute({
        sql: 'SELECT id FROM users WHERE id = ?',
        args: [userId]
      });

      if (userCheck.rows.length === 0) {
        console.log(`👤 Creating minimal user entry for FK constraint: ${userId}`);
        await client.execute({
          sql: `INSERT INTO users (id, username, auth_provider, subscription_tier, role, is_active, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            userId,
            'Single Add User',
            'anonymous',
            'free',
            'user',
            1,
            Date.now(),
            Date.now()
          ]
        });
      }
    } catch (error) {
      console.log(`⚠️ User creation failed, continuing anyway: ${error}`);
    }

    // Check if sentence already exists
    const existingResult = await client.execute({
      sql: `SELECT id FROM tarot_custom_sentences 
            WHERE user_id = ? AND card_name = ? AND is_reversed = ? AND sentence = ?`,
      args: [userId, cardName, isReversed ? 1 : 0, sentence]
    });

    if (existingResult.rows.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Sentence already exists for this card and orientation',
        existingSentenceId: existingResult.rows[0].id
      }, { status: 409 });
    }

    // Insert new sentence
    const sentenceId = randomUUID();
    const now = Date.now();

    await client.execute({
      sql: `INSERT INTO tarot_custom_sentences 
            (id, user_id, card_name, is_reversed, sentence, is_custom, source_type, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        sentenceId,
        userId,
        cardName,
        isReversed ? 1 : 0,
        sentence,
        1, // is_custom
        sourceType,
        now,
        now
      ]
    });

    // Get updated count for this card/orientation
    const countResult = await client.execute({
      sql: `SELECT COUNT(*) as count FROM tarot_custom_sentences 
            WHERE card_name = ? AND is_reversed = ?`,
      args: [cardName, isReversed ? 1 : 0]
    });

    const totalSentences = countResult.rows[0]?.count as number || 0;

    return NextResponse.json({
      success: true,
      sentence: {
        id: sentenceId,
        cardName,
        isReversed,
        sentence,
        sourceType,
        createdAt: new Date(now).toISOString(),
        updatedAt: new Date(now).toISOString()
      },
      cardStats: {
        cardName,
        isReversed,
        totalSentences
      }
    });

  } catch (error) {
    console.error('Add sentence error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}