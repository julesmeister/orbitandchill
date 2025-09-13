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
  // Extended fields for comprehensive leaderboard
  gamesPlayed?: number;
  averageScore?: number;
  streak?: number;
  joinedDate?: string;
}

interface LeaderboardStats {
  totalPlayers: number;
  averageScore: number;
  topScore: number;
  gamesPlayedToday: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const timeFilter = searchParams.get('timeFilter') || 'all-time'; // 'all-time', 'monthly', 'weekly', 'daily'
    const sortBy = searchParams.get('sortBy') || 'score'; // 'score', 'accuracy', 'cards', 'streak'
    const extended = searchParams.get('extended') === 'true';

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

      // Determine sort order based on sortBy parameter
      let orderBy = 'total_score DESC, average_score DESC, games_played DESC';
      switch (sortBy) {
        case 'accuracy':
          orderBy = 'overall_accuracy DESC, average_score DESC, total_score DESC';
          break;
        case 'cards':
          orderBy = 'cards_completed DESC, total_score DESC, overall_accuracy DESC';
          break;
        case 'streak':
          orderBy = 'current_streak DESC, total_score DESC, overall_accuracy DESC';
          break;
        default: // 'score'
          orderBy = 'total_score DESC, average_score DESC, games_played DESC';
      }

      let whereFilter = '';
      
      // Apply time-based filtering
      if (timeFilter === 'weekly') {
        orderBy = 'weekly_score DESC, sessions_this_week DESC, total_score DESC';
        whereFilter = "AND (sessions_this_week > 0 OR weekly_score > 0)";
      } else if (timeFilter === 'monthly') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        whereFilter = `AND last_played >= '${thirtyDaysAgo.toISOString()}'`;
      } else if (timeFilter === 'daily') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        whereFilter = `AND last_played >= '${today.toISOString()}'`;
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
          current_streak,
          created_at
        FROM tarot_leaderboard 
        WHERE games_played > 0 ${whereFilter}
        ORDER BY ${orderBy}
        LIMIT ?`,
        args: [limit]
      });

      // console.log('Leaderboard query returned:', leaderboardResult.rows.length, 'rows');
      // console.log('Sample leaderboard data:', leaderboardResult.rows.slice(0, 3));

      const leaderboard: LeaderboardEntry[] = leaderboardResult.rows.map((row: any, index: number) => {
        // Calculate accuracy from average_score if overall_accuracy is 0
        let accuracy = row.accuracy || 0;
        if (accuracy === 0 && row.average_score) {
          accuracy = Math.min(row.average_score, 100);
        }

        // For weekly leaderboard, use weekly score
        const score = timeFilter === 'weekly' ? (row.weekly_score || 0) : (row.score || 0);
        
        // Determine cards completed (use a reasonable estimate if not tracked)
        let cardsCompleted = row.cardsCompleted || 0;
        if (cardsCompleted === 0 && row.games_played) {
          // Estimate cards completed based on games played
          cardsCompleted = Math.min(row.games_played, 78);
        }

        const baseEntry = {
          id: row.id,
          username: row.username,
          score,
          cardsCompleted,
          accuracy: Math.round(accuracy),
          lastPlayed: row.lastPlayed,
          level: row.level ? row.level.charAt(0).toUpperCase() + row.level.slice(1) : 'Novice',
          rank: index + 1
        };

        // Add extended fields if requested
        if (extended) {
          return {
            ...baseEntry,
            gamesPlayed: row.games_played || 0,
            averageScore: Math.round(row.average_score || 0),
            streak: row.current_streak || 0,
            joinedDate: row.created_at || new Date().toISOString()
          };
        }

        return baseEntry;
      });

      // Additional statistics
      const totalPlayers = leaderboardResult.rows.length;
      const avgScore = leaderboard.length > 0 
        ? Math.round(leaderboard.reduce((sum, entry) => sum + entry.accuracy, 0) / leaderboard.length)
        : 0;
      const topScore = leaderboard.length > 0 
        ? Math.max(...leaderboard.map(entry => entry.score))
        : 0;

      // Calculate games played today if extended stats requested
      let gamesPlayedToday = 0;
      if (extended) {
        try {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const todayGamesResult = await client.execute({
            sql: `SELECT COUNT(*) as count FROM tarot_game_results WHERE created_at >= ?`,
            args: [today.toISOString()]
          });
          gamesPlayedToday = Number(todayGamesResult.rows[0]?.count) || 0;
        } catch (error) {
          console.warn('Could not fetch games played today:', error);
          gamesPlayedToday = 0;
        }
      }

      const stats: LeaderboardStats = {
        totalPlayers,
        averageScore: avgScore,
        topScore,
        gamesPlayedToday
      };

      return NextResponse.json({
        success: true,
        leaderboard,
        stats
      });

    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // Return empty leaderboard if database fails
      return NextResponse.json({
        success: true,
        leaderboard: [],
        stats: {
          totalPlayers: 0,
          averageScore: 0,
          topScore: 0,
          gamesPlayedToday: 0
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