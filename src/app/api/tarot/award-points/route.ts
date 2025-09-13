/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client/http';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, points, source, details } = body;

    console.log('Award points request received:', {
      userId,
      points,
      source,
      details
    });

    if (!userId || typeof points !== 'number') {
      console.error('Invalid request - missing userId or points:', { userId, points: typeof points });
      return NextResponse.json(
        { error: 'Missing required fields: userId and points' },
        { status: 400 }
      );
    }

    // Only proceed if we have database credentials
    const databaseUrl = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!databaseUrl || !authToken) {
      console.log('Database credentials not available, skipping point award');
      return NextResponse.json({
        success: true,
        pointsAwarded: points,
        source,
        details,
        note: 'Points not persisted (database unavailable)'
      });
    }

    const client = createClient({
      url: databaseUrl,
      authToken: authToken,
    });

    const now = new Date();

    // Get username for leaderboard
    let username = 'Anonymous';
    try {
      const userResult = await client.execute({
        sql: 'SELECT * FROM users WHERE id = ? LIMIT 1',
        args: [userId]
      });
      
      if (userResult.rows.length > 0) {
        const userRow = userResult.rows[0] as any;
        username = userRow.username || userRow.name || userRow.email || 'Anonymous';
      } else {
        username = `User ${userId.slice(-6)}`;
      }
    } catch (userLookupError) {
      console.warn('Username lookup failed, using fallback:', userLookupError);
      username = `User ${userId.slice(-6)}`;
    }

    // Update leaderboard with awarded points
    console.log('Checking leaderboard for userId:', userId);
    const leaderboardResult = await client.execute({
      sql: 'SELECT * FROM tarot_leaderboard WHERE user_id = ?',
      args: [userId]
    });

    if (leaderboardResult.rows.length > 0) {
      // Update existing leaderboard entry
      const leaderboard = leaderboardResult.rows[0] as any;
      const oldTotalScore = leaderboard.total_score || 0;
      const oldGamesPlayed = leaderboard.games_played || 0;
      const newTotalScore = oldTotalScore + points;
      const newGamesPlayed = oldGamesPlayed + 1;

      // Calculate new average score
      const newAverageScore = newTotalScore / newGamesPlayed;

      console.log('Updating existing leaderboard entry:', {
        userId,
        username,
        source,
        oldTotalScore,
        pointsToAdd: points,
        newTotalScore,
        oldGamesPlayed,
        newGamesPlayed,
        newAverageScore
      });

      await client.execute({
        sql: `UPDATE tarot_leaderboard SET 
          total_score = ?, games_played = ?, average_score = ?,
          overall_accuracy = ?, last_played = ?, updated_at = ?
          WHERE user_id = ?`,
        args: [
          newTotalScore, newGamesPlayed, newAverageScore,
          (newAverageScore / 100) * 100, now.toISOString(), now.toISOString(), userId
        ]
      });
      
      console.log('Leaderboard updated successfully');
    } else {
      // Create new leaderboard entry
      console.log('Creating new leaderboard entry:', {
        userId,
        username,
        source,
        points,
        initialGamesPlayed: 1
      });
      
      const leaderboardId = `tarot_leaderboard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await client.execute({
        sql: `INSERT INTO tarot_leaderboard (
          id, user_id, username, total_score, cards_completed, games_played,
          average_score, overall_accuracy, last_played, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          leaderboardId, userId, username, points, 0, 1,
          points, (points / 100) * 100, now.toISOString(), now.toISOString(), now.toISOString()
        ]
      });
      
      console.log('New leaderboard entry created successfully');
    }

    console.log(`Successfully awarded ${points} points to user ${userId} for ${source}`);
    
    // Verify the update by checking the leaderboard again
    const verifyResult = await client.execute({
      sql: 'SELECT total_score, games_played, average_score FROM tarot_leaderboard WHERE user_id = ?',
      args: [userId]
    });
    
    if (verifyResult.rows.length > 0) {
      const updatedLeaderboard = verifyResult.rows[0] as any;
      console.log('Leaderboard verification after points award:', {
        userId,
        totalScore: updatedLeaderboard.total_score,
        gamesPlayed: updatedLeaderboard.games_played,
        averageScore: updatedLeaderboard.average_score
      });
    }

    return NextResponse.json({
      success: true,
      pointsAwarded: points,
      source,
      details
    });

  } catch (error) {
    console.error('Error awarding points:', error);
    return NextResponse.json(
      { error: 'Failed to award points' },
      { status: 500 }
    );
  }
}