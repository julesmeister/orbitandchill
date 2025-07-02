/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '@/db/index';

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const discussionIds = searchParams.get('discussionIds')?.split(',') || [];
    
    if (!userId || discussionIds.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Missing userId or discussionIds'
      }, { status: 400 });
    }

    // Get database client directly
    const { db } = await import('@/db/index');
    const dbObj = db as any;
    const client = dbObj.client;
    
    if (!client) {
      return NextResponse.json({
        success: false,
        error: 'Database client not available'
      }, { status: 503 });
    }
    
    try {
      const placeholders = discussionIds.map(() => '?').join(',');
      const votesQuery = `
        SELECT discussion_id, vote_type 
        FROM votes 
        WHERE user_id = ? AND discussion_id IN (${placeholders})
      `;
      
      const votesResult = await Promise.race([
        client.execute({
          sql: votesQuery,
          args: [userId, ...discussionIds]
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Votes query timeout')), 3000)
        )
      ]) as any;
      
      // Create a map of discussion ID to vote type
      const votes: { [discussionId: string]: 'up' | 'down' } = {};
      if (votesResult.rows) {
        votesResult.rows.forEach((row: any) => {
          votes[row.discussion_id] = row.vote_type;
        });
      }
      
      return NextResponse.json({
        success: true,
        votes
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'private, max-age=60' // Cache votes for 1 minute
        }
      });
    } catch (error) {
      console.error('Votes query error:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch votes'
      }, { status: 503 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}