/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client/http';

interface SentenceStatsResponse {
  success: boolean;
  stats?: {
    totalSentences: number;
    cardsWithSentences: number;
    averageSentencesPerCard: number;
    sentencesBySource: {
      user: number;
      ai_generated: number;
      migrated: number;
    };
    recentActivity: {
      sentencesAddedThisWeek: number;
      sentencesModifiedThisWeek: number;
      lastActivity: string | null;
    };
    topCards: Array<{
      cardName: string;
      sentenceCount: number;
      isReversed: boolean;
    }>;
  };
  error?: string;
  code?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse<SentenceStatsResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const timeframe = searchParams.get('timeframe') || 'all';

    // Validate required parameters
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
      return NextResponse.json({
        success: true,
        stats: {
          totalSentences: 0,
          cardsWithSentences: 0,
          averageSentencesPerCard: 0,
          sentencesBySource: {
            user: 0,
            ai_generated: 0,
            migrated: 0
          },
          recentActivity: {
            sentencesAddedThisWeek: 0,
            sentencesModifiedThisWeek: 0,
            lastActivity: null
          },
          topCards: []
        }
      });
    }

    const client = createClient({
      url: databaseUrl,
      authToken: authToken,
    });

    // Calculate date boundaries for timeframe filtering
    const now = new Date();
    let startDate: string | null = null;
    
    if (timeframe === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      startDate = weekAgo.toISOString();
    } else if (timeframe === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      startDate = monthAgo.toISOString();
    }

    // Get overall statistics
    const overallStatsResult = await client.execute({
      sql: `
        SELECT 
          COUNT(*) as total_sentences,
          COUNT(DISTINCT card_name) as cards_with_sentences,
          MAX(updated_at) as last_activity
        FROM tarot_custom_sentences 
        WHERE user_id = ?
      `,
      args: [userId]
    });

    const overallStats = overallStatsResult.rows[0] as any;
    const totalSentences = overallStats?.total_sentences || 0;
    const cardsWithSentences = overallStats?.cards_with_sentences || 0;
    const lastActivity = overallStats?.last_activity || null;
    const averageSentencesPerCard = cardsWithSentences > 0 
      ? Math.round((totalSentences / cardsWithSentences) * 10) / 10 
      : 0;

    // Get sentences by source type
    const sourceStatsResult = await client.execute({
      sql: `
        SELECT 
          source_type,
          COUNT(*) as count
        FROM tarot_custom_sentences 
        WHERE user_id = ?
        GROUP BY source_type
      `,
      args: [userId]
    });

    const sentencesBySource = {
      user: 0,
      ai_generated: 0,
      migrated: 0
    };

    sourceStatsResult.rows.forEach((row: any) => {
      const sourceType = row.source_type as keyof typeof sentencesBySource;
      if (sourceType in sentencesBySource) {
        sentencesBySource[sourceType] = row.count || 0;
      }
    });

    // Get recent activity (past week)
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    
    const recentActivityResult = await client.execute({
      sql: `
        SELECT 
          COUNT(CASE WHEN created_at >= ? THEN 1 END) as added_this_week,
          COUNT(CASE WHEN updated_at >= ? AND created_at < ? THEN 1 END) as modified_this_week
        FROM tarot_custom_sentences 
        WHERE user_id = ?
      `,
      args: [weekAgo, weekAgo, weekAgo, userId]
    });

    const recentActivity = recentActivityResult.rows[0] as any;
    const sentencesAddedThisWeek = recentActivity?.added_this_week || 0;
    const sentencesModifiedThisWeek = recentActivity?.modified_this_week || 0;

    // Get top cards with most sentences
    const topCardsResult = await client.execute({
      sql: `
        SELECT 
          card_name,
          is_reversed,
          COUNT(*) as sentence_count
        FROM tarot_custom_sentences 
        WHERE user_id = ?
        GROUP BY card_name, is_reversed
        ORDER BY sentence_count DESC, card_name ASC
        LIMIT 10
      `,
      args: [userId]
    });

    const topCards = topCardsResult.rows.map((row: any) => ({
      cardName: row.card_name,
      sentenceCount: row.sentence_count || 0,
      isReversed: Boolean(row.is_reversed)
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalSentences,
        cardsWithSentences,
        averageSentencesPerCard,
        sentencesBySource,
        recentActivity: {
          sentencesAddedThisWeek,
          sentencesModifiedThisWeek,
          lastActivity
        },
        topCards
      }
    });

  } catch (error) {
    console.error('Tarot sentences stats API error:', error);
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