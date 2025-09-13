/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client/http';

interface UserProgress {
  totalScore: number;
  totalCards: number;
  accuracy: number;
  level: string;
  cardProgress: Array<{
    cardId: string;
    familiarityLevel: string;
    masteryPercentage: number;
    totalAttempts: number;
    averageScore: number;
    lastPlayed: string;
  }>;
  recentSessions: Array<{
    cardId: string;
    score: number;
    accuracyRating: string;
    createdAt: string;
  }>;
  achievements: string[];
  weeklyStats: {
    sessionsThisWeek: number;
    weeklyScore: number;
    currentStreak: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    // Get user progress from database
    try {
      const databaseUrl = process.env.TURSO_DATABASE_URL;
      const authToken = process.env.TURSO_AUTH_TOKEN;
      
      if (!databaseUrl || !authToken) {
        return NextResponse.json({
          success: true,
          progress: {
            totalScore: 0,
            totalCards: 0,
            accuracy: 0,
            level: 'Novice',
            cardProgress: [],
            recentSessions: [],
            achievements: [],
            weeklyStats: {
              sessionsThisWeek: 0,
              weeklyScore: 0,
              currentStreak: 0
            }
          }
        });
      }

      const client = createClient({
        url: databaseUrl,
        authToken: authToken,
      });

      // Get overall leaderboard stats
      // console.log('Progress API: Querying leaderboard for userId:', userId);
      const leaderboardResult = await client.execute({
        sql: 'SELECT * FROM tarot_leaderboard WHERE user_id = ?',
        args: [userId]
      });
      // console.log('Progress API: Leaderboard result:', leaderboardResult.rows.length, 'rows found');
      if (leaderboardResult.rows.length > 0) {
        // console.log('Progress API: Leaderboard data:', leaderboardResult.rows[0]);
      }

      let totalScore = 0;
      let totalCards = 0;
      let accuracy = 0;
      let level = 'Novice';
      let weeklyStats = {
        sessionsThisWeek: 0,
        weeklyScore: 0,
        currentStreak: 0
      };

      if (leaderboardResult.rows.length > 0) {
        const leaderboard = leaderboardResult.rows[0] as any;
        totalScore = leaderboard.total_score || 0;
        totalCards = leaderboard.cards_completed || 0;
        accuracy = leaderboard.overall_accuracy || 0;
        
        // Calculate level based on total score (match tarot.md 5-level system)
        if (totalScore >= 25000) level = 'grandmaster';
        else if (totalScore >= 10000) level = 'master';
        else if (totalScore >= 5000) level = 'adept';
        else if (totalScore >= 1000) level = 'apprentice';
        else level = 'novice';
        
        // Calculate accuracy from average score if not stored
        if (accuracy === 0 && leaderboard.average_score) {
          accuracy = Math.min(leaderboard.average_score, 100);
        }

        weeklyStats = {
          sessionsThisWeek: leaderboard.sessions_this_week || 0,
          weeklyScore: leaderboard.weekly_score || 0,
          currentStreak: leaderboard.current_streak || 0
        };
      }

      // Get card-specific progress
      const progressResult = await client.execute({
        sql: 'SELECT * FROM tarot_progress WHERE user_id = ? ORDER BY mastery_percentage DESC, last_played DESC',
        args: [userId]
      });

      const cardProgress = progressResult.rows.map((row: any) => ({
        cardId: row.card_id,
        familiarityLevel: row.familiarity_level,
        masteryPercentage: row.mastery_percentage || 0,
        totalAttempts: row.total_attempts || 0,
        averageScore: row.average_score || 0,
        lastPlayed: row.last_played || row.created_at
      }));

      // Get recent sessions
      const sessionsResult = await client.execute({
        sql: 'SELECT card_id, score, accuracy_rating, created_at FROM tarot_sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT 10',
        args: [userId]
      });

      const recentSessions = sessionsResult.rows.map((row: any) => ({
        cardId: row.card_id,
        score: row.score,
        accuracyRating: row.accuracy_rating,
        createdAt: row.created_at
      }));

      // Calculate achievements (simple logic for now)
      const achievements = [];
      if (totalCards >= 10) achievements.push('First 10 Cards');
      if (totalCards >= 25) achievements.push('Quarter Deck');
      if (totalCards >= 50) achievements.push('Half Deck');
      if (totalCards >= 78) achievements.push('Complete Deck');
      if (accuracy >= 80) achievements.push('Accuracy Expert');
      if (accuracy >= 90) achievements.push('Accuracy Master');
      if (weeklyStats.currentStreak >= 7) achievements.push('Week Warrior');
      if (weeklyStats.currentStreak >= 30) achievements.push('Month Master');

      // Capitalize level for display
      const displayLevel = level.charAt(0).toUpperCase() + level.slice(1);

      const progress: UserProgress = {
        totalScore,
        totalCards,
        accuracy,
        level: displayLevel,
        cardProgress,
        recentSessions,
        achievements,
        weeklyStats
      };

      // console.log('Progress API: Returning progress data:', {
      //   totalScore,
      //   totalCards,
      //   accuracy,
      //   level: displayLevel,
      //   cardProgressCount: cardProgress.length,
      //   recentSessionsCount: recentSessions.length
      // });

      return NextResponse.json({
        success: true,
        progress
      });

    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // Return default progress if database fails
      return NextResponse.json({
        success: true,
        progress: {
          totalScore: 0,
          totalCards: 0,
          accuracy: 0,
          level: 'Novice',
          cardProgress: [],
          recentSessions: [],
          achievements: [],
          weeklyStats: {
            sessionsThisWeek: 0,
            weeklyScore: 0,
            currentStreak: 0
          }
        }
      });
    }

  } catch (error) {
    console.error('Progress API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}