/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client/http';

interface MigrateHardcodedRequest {
  userId: string;
  forceRemigration?: boolean;
}

interface MigrateHardcodedResponse {
  success: boolean;
  migrationStats?: {
    totalSentencesMigrated: number;
    uprightSentencesMigrated: number;
    reversedSentencesMigrated: number;
    cardsProcessed: number;
    skippedCards: number;
    migrationTime: string;
  };
  message?: string;
  error?: string;
  code?: string;
}

// Mock hardcoded sentences data - this would be replaced with actual Flutter app data
const HARDCODED_SENTENCES = {
  'The Fool': {
    upright: [
      "Someone who thinks YOLO is a life philosophy",
      "The friend who books trips without checking their bank account",
      "That person whose spontaneity would make a GPS dizzy",
      "Someone ready to embrace new adventures with child-like wonder",
      "The optimist who believes anything is possible",
      "That friend who says yes to everything without hesitation",
      "Someone with beginner's mind and fresh perspective",
      "The person who treats life like their personal adventure movie"
    ],
    reversed: [
      "That friend whose recklessness needs a reality check",
      "Someone who mistakes impulsiveness for courage",
      "The person who jumps without looking first",
      "That coworker who creates chaos wherever they go",
      "Someone whose enthusiasm lacks direction or planning",
      "The friend who needs to think before they leap",
      "That person who confuses being fearless with being careless",
      "Someone whose spontaneity often leads to trouble"
    ]
  },
  'The Magician': {
    upright: [
      "That friend who actually follows through on their New Year's resolutions",
      "Someone who turns their dreams into reality with impressive skill",
      "The person who makes everything look effortless",
      "That coworker who somehow has all the right tools for every situation",
      "Someone with the confidence to manifest their wildest ideas",
      "The friend who transforms obstacles into opportunities",
      "That person who seems to have infinite resourcefulness",
      "Someone who channels their energy into tangible results"
    ],
    reversed: [
      "All talk, no action - the friend who never delivers",
      "Someone who uses their talents for selfish gain",
      "The person who promises the world but delivers disappointment",
      "That coworker who manipulates situations to their advantage",
      "Someone whose potential remains frustratingly untapped",
      "The friend who makes grand plans but lacks follow-through",
      "That person who has the skills but not the integrity",
      "Someone who wastes their considerable talents on trivial pursuits"
    ]
  }
  // Note: In real implementation, this would contain all 78 cards with 8 sentences each
};

export async function POST(request: NextRequest): Promise<NextResponse<MigrateHardcodedResponse>> {
  try {
    const body: MigrateHardcodedRequest = await request.json();
    const { userId, forceRemigration = false } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required', code: 'VALIDATION_ERROR' },
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

    // Check if migration has already been done for this user
    if (!forceRemigration) {
      const existingResult = await client.execute({
        sql: 'SELECT COUNT(*) as count FROM tarot_custom_sentences WHERE user_id = ? AND source_type = ?',
        args: [userId, 'migrated']
      });

      const existingCount = (existingResult.rows[0] as any)?.count || 0;
      if (existingCount > 0) {
        return NextResponse.json({
          success: false,
          error: 'Migration already completed. Use forceRemigration=true to re-migrate.',
          code: 'ALREADY_MIGRATED'
        }, { status: 400 });
      }
    } else {
      // Clear existing migrated sentences if force remigration
      await client.execute({
        sql: 'DELETE FROM tarot_custom_sentences WHERE user_id = ? AND source_type = ?',
        args: [userId, 'migrated']
      });
    }

    const migrationTime = new Date().toISOString();
    let totalSentencesMigrated = 0;
    let uprightSentencesMigrated = 0;
    let reversedSentencesMigrated = 0;
    let cardsProcessed = 0;
    let skippedCards = 0;

    // Migrate sentences for each card
    for (const [cardName, orientations] of Object.entries(HARDCODED_SENTENCES)) {
      try {
        cardsProcessed++;

        // Migrate upright sentences
        if (orientations.upright) {
          for (const sentence of orientations.upright) {
            const sentenceId = `migrated_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            await client.execute({
              sql: `
                INSERT INTO tarot_custom_sentences (
                  id, user_id, card_name, is_reversed, sentence, is_custom, source_type, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(user_id, card_name, is_reversed, sentence) DO NOTHING
              `,
              args: [
                sentenceId,
                userId,
                cardName,
                0, // is_reversed = false
                sentence,
                1, // is_custom = true
                'migrated',
                migrationTime,
                migrationTime
              ]
            });

            uprightSentencesMigrated++;
            totalSentencesMigrated++;
          }
        }

        // Migrate reversed sentences
        if (orientations.reversed) {
          for (const sentence of orientations.reversed) {
            const sentenceId = `migrated_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            await client.execute({
              sql: `
                INSERT INTO tarot_custom_sentences (
                  id, user_id, card_name, is_reversed, sentence, is_custom, source_type, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(user_id, card_name, is_reversed, sentence) DO NOTHING
              `,
              args: [
                sentenceId,
                userId,
                cardName,
                1, // is_reversed = true
                sentence,
                1, // is_custom = true
                'migrated',
                migrationTime,
                migrationTime
              ]
            });

            reversedSentencesMigrated++;
            totalSentencesMigrated++;
          }
        }

      } catch (error) {
        console.warn(`Failed to migrate sentences for card ${cardName}:`, error);
        skippedCards++;
      }
    }

    return NextResponse.json({
      success: true,
      migrationStats: {
        totalSentencesMigrated,
        uprightSentencesMigrated,
        reversedSentencesMigrated,
        cardsProcessed,
        skippedCards,
        migrationTime
      },
      message: 'Migration completed successfully'
    });

  } catch (error) {
    console.error('Tarot sentences migrate-hardcoded API error:', error);
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