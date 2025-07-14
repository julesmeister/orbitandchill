/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { tarotProgress } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, points, source, details } = body;

    if (!userId || typeof points !== 'number') {
      return NextResponse.json(
        { error: 'Missing required fields: userId and points' },
        { status: 400 }
      );
    }

    // Award points by updating or inserting tarot progress
    const result = await db
      .insert(tarotProgress)
      .values({
        userId,
        totalScore: points,
        totalCards: 0,
        accuracy: 0,
        level: 'Novice',
        lastPlayed: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .onConflictDoUpdate({
        target: tarotProgress.userId,
        set: {
          totalScore: sql`${tarotProgress.totalScore} + ${points}`,
          updatedAt: new Date().toISOString()
        }
      })
      .returning();

    // Calculate new level based on updated score
    const updatedProgress = await db
      .select()
      .from(tarotProgress)
      .where(eq(tarotProgress.userId, userId))
      .limit(1);

    if (updatedProgress.length > 0) {
      const totalScore = updatedProgress[0].totalScore;
      let newLevel = 'Novice';
      
      if (totalScore >= 25000) newLevel = 'Grandmaster';
      else if (totalScore >= 10000) newLevel = 'Master';
      else if (totalScore >= 5000) newLevel = 'Adept';
      else if (totalScore >= 1000) newLevel = 'Apprentice';

      // Update level if it changed
      if (newLevel !== updatedProgress[0].level) {
        await db
          .update(tarotProgress)
          .set({ 
            level: newLevel,
            updatedAt: new Date().toISOString()
          })
          .where(eq(tarotProgress.userId, userId));
      }
    }

    console.log(`Awarded ${points} points to user ${userId} for ${source}`);

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