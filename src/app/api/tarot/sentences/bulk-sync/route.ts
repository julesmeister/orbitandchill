/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client/http';

interface BulkSentence {
  cardName: string;
  isReversed: boolean;
  sentence: string;
  sourceType: 'user' | 'ai_generated' | 'migrated';
  localId?: string; // For tracking mapping from local to server IDs
}

interface BulkSyncRequest {
  userId: string;
  sentences: BulkSentence[];
  syncMode: 'merge' | 'replace' | 'add_only';
}

interface SentenceMapping {
  localId?: string;
  serverId: string;
  status: 'added' | 'updated' | 'skipped' | 'error';
  error?: string;
}

interface BulkSyncResponse {
  success: boolean;
  results?: {
    added: number;
    updated: number;
    skipped: number;
    errors: number;
  };
  sentenceMap?: SentenceMapping[];
  stats?: {
    totalSentences: number;
    cardsAffected: number;
    syncTimestamp: string;
  };
  error?: string;
  code?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<BulkSyncResponse>> {
  try {
    const body: BulkSyncRequest = await request.json();
    const { userId, sentences, syncMode = 'merge' } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    if (!sentences || !Array.isArray(sentences)) {
      return NextResponse.json(
        { success: false, error: 'Sentences array required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    if (sentences.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one sentence required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Validate sentences
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];
      if (!sentence.cardName || !sentence.sentence || sentence.sentence.trim().length === 0) {
        return NextResponse.json(
          { success: false, error: `Invalid sentence at index ${i}`, code: 'VALIDATION_ERROR' },
          { status: 400 }
        );
      }
      if (sentence.sentence.length > 500) {
        return NextResponse.json(
          { success: false, error: `Sentence at index ${i} too long (max 500 characters)`, code: 'VALIDATION_ERROR' },
          { status: 400 }
        );
      }
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

    // If replace mode, clear existing sentences first
    if (syncMode === 'replace') {
      await client.execute({
        sql: 'DELETE FROM tarot_custom_sentences WHERE user_id = ?',
        args: [userId]
      });
    }

    // Process sentences
    const results = { added: 0, updated: 0, skipped: 0, errors: 0 };
    const sentenceMap: SentenceMapping[] = [];
    const cardsAffected = new Set<string>();
    const now = new Date();

    for (const sentence of sentences) {
      try {
        cardsAffected.add(`${sentence.cardName}_${sentence.isReversed}`);
        
        // Check if sentence already exists
        const existingResult = await client.execute({
          sql: `
            SELECT id FROM tarot_custom_sentences 
            WHERE user_id = ? AND card_name = ? AND is_reversed = ? AND sentence = ?
          `,
          args: [userId, sentence.cardName, sentence.isReversed ? 1 : 0, sentence.sentence.trim()]
        });

        if (existingResult.rows.length > 0) {
          // Sentence already exists
          if (syncMode === 'add_only') {
            results.skipped++;
            sentenceMap.push({
              localId: sentence.localId,
              serverId: (existingResult.rows[0] as any).id,
              status: 'skipped'
            });
            continue;
          }
          
          // Update existing sentence in merge mode
          const existingId = (existingResult.rows[0] as any).id;
          await client.execute({
            sql: 'UPDATE tarot_custom_sentences SET source_type = ?, updated_at = ? WHERE id = ?',
            args: [sentence.sourceType, now.toISOString(), existingId]
          });
          
          results.updated++;
          sentenceMap.push({
            localId: sentence.localId,
            serverId: existingId,
            status: 'updated'
          });
          continue;
        }

        // Check sentence limit per card orientation
        const countResult = await client.execute({
          sql: 'SELECT COUNT(*) as count FROM tarot_custom_sentences WHERE user_id = ? AND card_name = ? AND is_reversed = ?',
          args: [userId, sentence.cardName, sentence.isReversed ? 1 : 0]
        });

        const currentCount = (countResult.rows[0] as any)?.count || 0;
        if (currentCount >= 5) {
          results.errors++;
          sentenceMap.push({
            localId: sentence.localId,
            serverId: '',
            status: 'error',
            error: 'Maximum 5 sentences per card orientation exceeded'
          });
          continue;
        }

        // Add new sentence
        const sentenceId = `tarot_sentence_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        await client.execute({
          sql: `
            INSERT INTO tarot_custom_sentences (
              id, user_id, card_name, is_reversed, sentence, is_custom, source_type, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          args: [
            sentenceId,
            userId,
            sentence.cardName,
            sentence.isReversed ? 1 : 0,
            sentence.sentence.trim(),
            1, // is_custom = true
            sentence.sourceType || 'migrated',
            now.toISOString(),
            now.toISOString()
          ]
        });

        results.added++;
        sentenceMap.push({
          localId: sentence.localId,
          serverId: sentenceId,
          status: 'added'
        });

      } catch (error) {
        results.errors++;
        sentenceMap.push({
          localId: sentence.localId,
          serverId: '',
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Get final count
    const finalCountResult = await client.execute({
      sql: 'SELECT COUNT(*) as count FROM tarot_custom_sentences WHERE user_id = ?',
      args: [userId]
    });

    const totalSentences = (finalCountResult.rows[0] as any)?.count || 0;

    return NextResponse.json({
      success: true,
      results,
      sentenceMap,
      stats: {
        totalSentences,
        cardsAffected: cardsAffected.size,
        syncTimestamp: now.toISOString()
      }
    });

  } catch (error) {
    console.error('Tarot sentences bulk-sync API error:', error);
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