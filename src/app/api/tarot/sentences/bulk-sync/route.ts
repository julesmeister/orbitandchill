import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import { randomUUID } from 'crypto';

// Initialize Turso client
const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

interface BulkSentence {
  cardName: string;
  isReversed: boolean;
  sentence: string;
  sourceType: string;
  localId?: string;
}

interface BulkSyncRequest {
  userId: string;
  sentences: BulkSentence[];
  syncMode: 'merge' | 'replace' | 'add_only';
}

export async function POST(request: NextRequest) {
  try {
    const { userId, sentences, syncMode = 'merge' }: BulkSyncRequest = await request.json();

    if (!userId || !sentences || !Array.isArray(sentences)) {
      return NextResponse.json({
        success: false,
        error: 'userId and sentences array are required'
      }, { status: 400 });
    }

    console.log(`🔄 Starting bulk sync for user ${userId}: ${sentences.length} sentences, mode: ${syncMode}`);

    // Ensure user exists in users table (create minimal entry if needed for FK constraint)
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
            'Bulk Upload User',
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

    // Validate sentences format
    for (const sentence of sentences) {
      if (!sentence.cardName || sentence.sentence === undefined || typeof sentence.isReversed !== 'boolean') {
        return NextResponse.json({
          success: false,
          error: 'Each sentence must have cardName, sentence, and isReversed fields'
        }, { status: 400 });
      }
    }

    // Handle replace mode - clear existing sentences first
    if (syncMode === 'replace') {
      console.log(`🗑️ Replace mode: Clearing existing sentences for user ${userId}`);
      await client.execute({
        sql: 'DELETE FROM tarot_custom_sentences WHERE user_id = ?',
        args: [userId]
      });
    }

    const results = {
      added: 0,
      updated: 0,
      skipped: 0,
      errors: 0
    };

    const sentenceMap: Array<{
      localId?: string;
      serverId?: string;
      status: 'added' | 'updated' | 'skipped' | 'error';
      error?: string;
    }> = [];

    const cardsAffected = new Set<string>();
    const now = Date.now();

    // Process sentences in batches to avoid overwhelming the database
    const BATCH_SIZE = 50;
    for (let i = 0; i < sentences.length; i += BATCH_SIZE) {
      const batch = sentences.slice(i, i + BATCH_SIZE);
      console.log(`📦 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(sentences.length / BATCH_SIZE)} (${batch.length} sentences)`);

      for (const sentence of batch) {
        try {
          const { cardName, isReversed, sentence: sentenceText, sourceType = 'migrated', localId } = sentence;
          
          cardsAffected.add(`${cardName}_${isReversed ? 'reversed' : 'upright'}`);

          // Check if sentence already exists (for merge and add_only modes)
          if (syncMode !== 'replace') {
            const existingResult = await client.execute({
              sql: `SELECT id FROM tarot_custom_sentences 
                    WHERE user_id = ? AND card_name = ? AND is_reversed = ? AND sentence = ?`,
              args: [userId, cardName, isReversed ? 1 : 0, sentenceText]
            });

            if (existingResult.rows.length > 0) {
              if (syncMode === 'add_only') {
                results.skipped++;
                sentenceMap.push({
                  localId,
                  serverId: existingResult.rows[0].id as string,
                  status: 'skipped'
                });
                continue;
              } else if (syncMode === 'merge') {
                // Update existing sentence with new metadata
                const serverId = existingResult.rows[0].id as string;
                await client.execute({
                  sql: `UPDATE tarot_custom_sentences 
                        SET source_type = ?, updated_at = ? 
                        WHERE id = ?`,
                  args: [sourceType, now, serverId]
                });
                
                results.updated++;
                sentenceMap.push({
                  localId,
                  serverId,
                  status: 'updated'
                });
                continue;
              }
            }
          }

          // Insert new sentence
          const serverId = randomUUID();
          await client.execute({
            sql: `INSERT INTO tarot_custom_sentences 
                  (id, user_id, card_name, is_reversed, sentence, is_custom, source_type, created_at, updated_at)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
              serverId,
              userId,
              cardName,
              isReversed ? 1 : 0,
              sentenceText,
              1, // is_custom
              sourceType,
              now,
              now
            ]
          });

          results.added++;
          sentenceMap.push({
            localId,
            serverId,
            status: 'added'
          });

        } catch (error) {
          console.error(`❌ Error processing sentence for ${sentence.cardName}:`, error);
          results.errors++;
          sentenceMap.push({
            localId: sentence.localId,
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
    }

    // Get final stats
    const totalSentencesResult = await client.execute({
      sql: 'SELECT COUNT(*) as count FROM tarot_custom_sentences WHERE user_id = ?',
      args: [userId]
    });

    const totalSentences = totalSentencesResult.rows[0]?.count as number || 0;

    console.log(`✅ Bulk sync completed for user ${userId}:`, results);

    return NextResponse.json({
      success: true,
      results,
      sentenceMap,
      stats: {
        totalSentences,
        cardsAffected: cardsAffected.size,
        syncTimestamp: new Date(now).toISOString(),
        expectedTotal: 1734, // From tarot.md line 2134
        completionPercentage: Math.round((totalSentences / 1734) * 100)
      }
    });

  } catch (error) {
    console.error('Bulk sync error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}