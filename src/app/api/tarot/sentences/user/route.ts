/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client/http';

interface UserSentence {
  id: string;
  cardName: string;
  isReversed: boolean;
  sentence: string;
  sourceType: 'user' | 'ai_generated' | 'migrated';
  createdAt: string;
  updatedAt: string;
}

interface UserSentencesResponse {
  success: boolean;
  sentences?: UserSentence[];
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  stats?: {
    totalCards: number;
    cardsWithCustomSentences: number;
    totalCustomSentences: number;
    averageSentencesPerCard: number;
  };
  error?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse<UserSentencesResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');
    const cardName = searchParams.get('cardName');
    const sourceType = searchParams.get('sourceType');

    // Validate required parameters
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    // Parse optional parameters
    const limit = limitParam ? parseInt(limitParam, 10) : 1000;
    const offset = offsetParam ? parseInt(offsetParam, 10) : 0;

    // Connect to database using Turso HTTP client pattern
    const databaseUrl = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    
    if (!databaseUrl || !authToken) {
      return NextResponse.json({
        success: true,
        sentences: [],
        pagination: {
          total: 0,
          limit,
          offset,
          hasMore: false
        },
        stats: {
          totalCards: 78,
          cardsWithCustomSentences: 0,
          totalCustomSentences: 0,
          averageSentencesPerCard: 0
        }
      });
    }

    const client = createClient({
      url: databaseUrl,
      authToken: authToken,
    });

    // Build dynamic query based on filters
    let whereClause = 'WHERE user_id = ?';
    let args: any[] = [userId];

    if (cardName) {
      whereClause += ' AND card_name = ?';
      args.push(cardName);
    }

    if (sourceType) {
      whereClause += ' AND source_type = ?';
      args.push(sourceType);
    }

    // Get total count
    const countResult = await client.execute({
      sql: `SELECT COUNT(*) as count FROM tarot_custom_sentences ${whereClause}`,
      args
    });

    const total = (countResult.rows[0] as any)?.count || 0;

    // Get sentences with pagination
    const sentencesResult = await client.execute({
      sql: `SELECT * FROM tarot_custom_sentences ${whereClause} ORDER BY updated_at DESC LIMIT ? OFFSET ?`,
      args: [...args, limit, offset]
    });

    // Transform database results to API format
    const sentences: UserSentence[] = sentencesResult.rows.map((row: any) => ({
      id: row.id,
      cardName: row.card_name,
      isReversed: Boolean(row.is_reversed),
      sentence: row.sentence,
      sourceType: row.source_type as 'user' | 'ai_generated' | 'migrated',
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    // Get statistics
    const statsResult = await client.execute({
      sql: `
        SELECT 
          COUNT(DISTINCT card_name) as cards_with_sentences,
          COUNT(*) as total_sentences
        FROM tarot_custom_sentences 
        WHERE user_id = ?
      `,
      args: [userId]
    });

    const statsRow = statsResult.rows[0] as any;
    const cardsWithCustomSentences = statsRow?.cards_with_sentences || 0;
    const totalCustomSentences = statsRow?.total_sentences || 0;
    const averageSentencesPerCard = cardsWithCustomSentences > 0 
      ? totalCustomSentences / cardsWithCustomSentences 
      : 0;

    return NextResponse.json({
      success: true,
      sentences,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      },
      stats: {
        totalCards: 78, // Total tarot cards in deck
        cardsWithCustomSentences,
        totalCustomSentences,
        averageSentencesPerCard: Math.round(averageSentencesPerCard * 10) / 10
      }
    });

  } catch (error) {
    console.error('Tarot sentences user API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}