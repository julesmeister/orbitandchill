import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

// Initialize Turso client
const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '50');

  try {
    // Get all sentences with user info
    const sentencesResult = await client.execute({
      sql: `SELECT 
        user_id,
        card_name,
        is_reversed,
        sentence,
        source_type,
        created_at,
        updated_at
      FROM tarot_custom_sentences 
      ORDER BY created_at DESC 
      LIMIT ?`,
      args: [limit]
    });

    // Get total count and unique users
    const statsResult = await client.execute({
      sql: `SELECT 
        COUNT(*) as total_sentences,
        COUNT(DISTINCT user_id) as unique_users,
        COUNT(DISTINCT card_name) as unique_cards
      FROM tarot_custom_sentences`,
      args: []
    });

    // Get breakdown by user
    const userBreakdownResult = await client.execute({
      sql: `SELECT 
        user_id,
        COUNT(*) as sentence_count,
        COUNT(DISTINCT card_name) as unique_cards,
        MAX(created_at) as last_activity
      FROM tarot_custom_sentences 
      GROUP BY user_id
      ORDER BY sentence_count DESC`,
      args: []
    });

    // Get breakdown by card
    const cardBreakdownResult = await client.execute({
      sql: `SELECT 
        card_name,
        is_reversed,
        COUNT(*) as sentence_count,
        COUNT(DISTINCT user_id) as users_with_sentences
      FROM tarot_custom_sentences 
      GROUP BY card_name, is_reversed
      ORDER BY card_name, is_reversed`,
      args: []
    });

    const stats = statsResult.rows[0];
    
    // Format sentences
    const sentences = sentencesResult.rows.map(row => ({
      userId: row.user_id,
      cardName: row.card_name,
      isReversed: row.is_reversed === 1,
      sentence: row.sentence,
      sourceType: row.source_type,
      createdAt: new Date(row.created_at as number).toISOString(),
      updatedAt: new Date(row.updated_at as number).toISOString()
    }));

    const userBreakdown = userBreakdownResult.rows.map(row => ({
      userId: row.user_id,
      sentenceCount: row.sentence_count,
      uniqueCards: row.unique_cards,
      lastActivity: new Date(row.last_activity as number).toISOString()
    }));

    const cardBreakdown = cardBreakdownResult.rows.map(row => ({
      cardName: row.card_name,
      isReversed: row.is_reversed === 1,
      sentenceCount: row.sentence_count,
      usersWithSentences: row.users_with_sentences
    }));

    return NextResponse.json({
      success: true,
      globalStats: {
        totalSentences: stats?.total_sentences || 0,
        uniqueUsers: stats?.unique_users || 0,
        uniqueCards: stats?.unique_cards || 0,
        expectedCards: 156, // 78 upright + 78 reversed
        completionPercentage: stats?.unique_cards ? 
          Math.round((stats.unique_cards as number / 156) * 100) : 0
      },
      sentences: sentences.slice(0, 20), // Show first 20 sentences
      userBreakdown,
      cardBreakdown,
      analysis: {
        hasData: Number(stats?.total_sentences || 0) > 0,
        allCardsPresent: Number(stats?.unique_cards || 0) >= 156,
        usersWithMostSentences: userBreakdown.slice(0, 5),
        cardsWithMostSentences: cardBreakdown
          .sort((a, b) => Number(b.sentenceCount || 0) - Number(a.sentenceCount || 0))
          .slice(0, 10)
      }
    });

  } catch (error) {
    console.error('Get all sentences error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}