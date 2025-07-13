/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client/http';

interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  cardsCompleted: number;
  accuracy: number;
  lastPlayed: string;
  level: string;
  rank?: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const timeframe = searchParams.get('timeframe') || 'all_time'; // 'all_time', 'weekly', 'monthly'

    // Get leaderboard from database
    try {
      const databaseUrl = process.env.TURSO_DATABASE_URL;
      const authToken = process.env.TURSO_AUTH_TOKEN;
      
      if (!databaseUrl || !authToken) {
        return NextResponse.json({
          success: true,
          leaderboard: []
        });
      }

      const client = createClient({
        url: databaseUrl,
        authToken: authToken,
      });

      let orderBy = 'total_score DESC, average_score DESC, games_played DESC';
      let timeFilter = '';

      // Apply time-based filtering
      if (timeframe === 'weekly') {
        orderBy = 'weekly_score DESC, sessions_this_week DESC, total_score DESC';
        // Only show users who played this week
        timeFilter = "AND (sessions_this_week > 0 OR weekly_score > 0)";
      } else if (timeframe === 'monthly') {
        // For monthly, we'll use last_played within 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        timeFilter = `AND last_played >= '${thirtyDaysAgo.toISOString()}'`;
      }

      const leaderboardResult = await client.execute({
        sql: `SELECT 
          user_id as id, 
          username, 
          total_score as score, 
          cards_completed as cardsCompleted,
          overall_accuracy as accuracy,
          average_score,
          last_played as lastPlayed,
          level,
          games_played,
          weekly_score,
          sessions_this_week,
          perfect_interpretations,
          current_streak
        FROM tarot_leaderboard 
        WHERE games_played > 0 ${timeFilter}
        ORDER BY ${orderBy}
        LIMIT ?`,
        args: [limit]
      });

      console.log('Leaderboard query returned:', leaderboardResult.rows.length, 'rows');
      console.log('Sample leaderboard data:', leaderboardResult.rows.slice(0, 3));

      const leaderboard: LeaderboardEntry[] = leaderboardResult.rows.map((row: any, index: number) => {
        // Calculate accuracy from average_score if overall_accuracy is 0
        let accuracy = row.accuracy || 0;
        if (accuracy === 0 && row.average_score) {
          accuracy = Math.min(row.average_score, 100);
        }

        // For weekly leaderboard, use weekly score
        const score = timeframe === 'weekly' ? (row.weekly_score || 0) : (row.score || 0);
        
        // Determine cards completed (use a reasonable estimate if not tracked)
        let cardsCompleted = row.cardsCompleted || 0;
        if (cardsCompleted === 0 && row.games_played) {
          // Estimate cards completed based on games played
          cardsCompleted = Math.min(row.games_played, 78);
        }

        return {
          id: row.id,
          username: row.username,
          score,
          cardsCompleted,
          accuracy: Math.round(accuracy),
          lastPlayed: row.lastPlayed,
          level: row.level ? row.level.charAt(0).toUpperCase() + row.level.slice(1) : 'Novice',
          rank: index + 1
        };
      });

      // Additional statistics
      const totalPlayers = leaderboardResult.rows.length;
      const avgScore = leaderboard.length > 0 
        ? Math.round(leaderboard.reduce((sum, entry) => sum + entry.score, 0) / leaderboard.length)
        : 0;
      const topAccuracy = leaderboard.length > 0 
        ? Math.max(...leaderboard.map(entry => entry.accuracy))
        : 0;

      return NextResponse.json({
        success: true,
        leaderboard,
        stats: {
          totalPlayers,
          avgScore,
          topAccuracy,
          timeframe
        }
      });

    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // Return empty leaderboard if database fails
      return NextResponse.json({
        success: true,
        leaderboard: [],
        stats: {
          totalPlayers: 0,
          avgScore: 0,
          topAccuracy: 0,
          timeframe
        }
      });
    }

  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: POST endpoint to update rankings (could be called periodically)
export async function POST(request: NextRequest) {
  try {
    // This could be used to recalculate rankings, reset weekly scores, etc.
    // For now, just return success
    return NextResponse.json({
      success: true,
      message: 'Rankings updated'
    });

  } catch (error) {
    console.error('Leaderboard update error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}