/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client/http';

interface CardProgress {
  cardId: string;
  totalAttempts: number;
  averageScore: number;
  masteryPercentage: number;
  uprightAttempts: number;
  uprightAverage: number;
  reversedAttempts: number;
  reversedAverage: number;
  familiarityLevel: string;
  learningStreak: number;
  lastPlayed: string | null;
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

    try {
      const databaseUrl = process.env.TURSO_DATABASE_URL;
      const authToken = process.env.TURSO_AUTH_TOKEN;
      
      if (!databaseUrl || !authToken) {
        return NextResponse.json({
          success: true,
          progress: {}
        });
      }

      const client = createClient({
        url: databaseUrl,
        authToken: authToken,
      });

      // Get all card progress for the user
      const progressResult = await client.execute({
        sql: `SELECT 
          card_id as cardId,
          total_attempts as totalAttempts,
          average_score as averageScore,
          mastery_percentage as masteryPercentage,
          upright_attempts as uprightAttempts,
          upright_average as uprightAverage,
          reversed_attempts as reversedAttempts,
          reversed_average as reversedAverage,
          familiarity_level as familiarityLevel,
          learning_streak as learningStreak,
          last_played as lastPlayed
        FROM tarot_progress 
        WHERE user_id = ?`,
        args: [userId]
      });

      // Convert to a lookup object for easy access
      const progressMap: Record<string, CardProgress> = {};
      
      // console.log('Card Progress API: Raw database rows:', progressResult.rows.length);
      
      progressResult.rows.forEach((row: any) => {
        // console.log('Card Progress API: Processing row for card:', row.cardId, {
        //   totalAttempts: row.totalAttempts,
        //   averageScore: row.averageScore,
        //   masteryPercentage: row.masteryPercentage,
        //   familiarityLevel: row.familiarityLevel
        // });
        
        progressMap[row.cardId] = {
          cardId: row.cardId,
          totalAttempts: row.totalAttempts || 0,
          averageScore: row.averageScore || 0,
          masteryPercentage: row.masteryPercentage || 0,
          uprightAttempts: row.uprightAttempts || 0,
          uprightAverage: row.uprightAverage || 0,
          reversedAttempts: row.reversedAttempts || 0,
          reversedAverage: row.reversedAverage || 0,
          familiarityLevel: row.familiarityLevel || 'novice',
          learningStreak: row.learningStreak || 0,
          lastPlayed: row.lastPlayed
        };
      });

      // console.log('Card Progress API: Final progress map keys:', Object.keys(progressMap));
      // console.log('Card Progress API: Sample progress data:', progressMap[Object.keys(progressMap)[0]]);

      return NextResponse.json({
        success: true,
        progress: progressMap
      });

    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // Return empty progress if database fails
      return NextResponse.json({
        success: true,
        progress: {}
      });
    }

  } catch (error) {
    console.error('Card progress API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}