/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { getDbAsync } from '@/db/index-turso-http';

export async function POST(request: NextRequest) {
  try {
    const { discussionId } = await request.json();
    
    if (!discussionId) {
      return NextResponse.json(
        { success: false, error: 'Discussion ID is required' },
        { status: 400 }
      );
    }

    const db = await getDbAsync();
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 500 }
      );
    }

    // Get the discussion creation timestamp
    const discussionResult = await db.client.execute({
      sql: 'SELECT created_at FROM discussions WHERE id = ?',
      args: [discussionId]
    });

    if (discussionResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Discussion not found' },
        { status: 404 }
      );
    }

    const discussionCreatedAt = discussionResult.rows[0].created_at as number;
    const discussionDate = new Date(discussionCreatedAt * 1000);
    const now = new Date();

    // Get all replies for this discussion
    const repliesResult = await db.client.execute({
      sql: 'SELECT id, created_at FROM discussion_replies WHERE discussion_id = ? ORDER BY created_at ASC',
      args: [discussionId]
    });

    console.log(`🕐 Randomizing timestamps for ${repliesResult.rows.length} replies in discussion: ${discussionId}`);
    console.log(`📅 Discussion created: ${discussionDate.toISOString()}`);
    console.log(`📅 Current time: ${now.toISOString()}`);

    if (repliesResult.rows.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No replies to update',
        updatedCount: 0
      });
    }

    // Calculate time range
    const timeRangeMs = now.getTime() - discussionDate.getTime();
    const minDelayMs = 60 * 60 * 1000; // 1 hour minimum
    
    // Generate random timestamps for each reply
    const updates: { id: string; newTimestamp: number }[] = [];
    
    repliesResult.rows.forEach((row, index) => {
      const replyId = row.id as string;
      
      // Generate a random timestamp between discussion creation + 1 hour and now
      // Make sure replies are somewhat ordered (later replies have later timestamps)
      const portionOfRange = (index + 1) / repliesResult.rows.length;
      const minTimeForThisReply = discussionDate.getTime() + minDelayMs + (timeRangeMs * 0.3 * index / repliesResult.rows.length);
      const maxTimeForThisReply = discussionDate.getTime() + (timeRangeMs * portionOfRange);
      
      const randomMs = Math.random() * (maxTimeForThisReply - minTimeForThisReply) + minTimeForThisReply;
      const newTimestamp = Math.floor(randomMs / 1000); // Convert to Unix timestamp
      
      updates.push({ id: replyId, newTimestamp });
      
      console.log(`  Reply ${index + 1}: ${new Date(newTimestamp * 1000).toISOString()}`);
    });

    // Update all replies with their new timestamps
    let updatedCount = 0;
    for (const update of updates) {
      await db.client.execute({
        sql: 'UPDATE discussion_replies SET created_at = ?, updated_at = ? WHERE id = ?',
        args: [update.newTimestamp, update.newTimestamp, update.id]
      });
      updatedCount++;
    }

    // Update the discussion's last activity to the latest reply timestamp
    const latestReplyTimestamp = Math.max(...updates.map(u => u.newTimestamp));
    await db.client.execute({
      sql: 'UPDATE discussions SET last_activity = ? WHERE id = ?',
      args: [latestReplyTimestamp, discussionId]
    });

    console.log(`✅ Successfully randomized timestamps for ${updatedCount} replies`);

    return NextResponse.json({
      success: true,
      message: `Randomized timestamps for ${updatedCount} replies`,
      updatedCount,
      discussionId,
      timeRange: {
        from: discussionDate.toISOString(),
        to: now.toISOString()
      }
    });

  } catch (error) {
    console.error('Error randomizing reply times:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to randomize reply times: ' + (error as Error).message },
      { status: 500 }
    );
  }
}