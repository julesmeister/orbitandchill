/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { getDbAsync } from '@/db/index-turso-http';
import { SEED_PERSONA_TEMPLATES } from '@/data/seedPersonas';

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

    let fixedCount = 0;
    const fixedReplies: any[] = [];

    // Get all replies for this discussion
    const repliesResult = await db.client.execute({
      sql: `
        SELECT dr.id, dr.author_id, dr.author_name, dr.content, dr.created_at,
               u.profile_picture_url, u.preferred_avatar, u.username
        FROM discussion_replies dr
        LEFT JOIN users u ON dr.author_id = u.id
        WHERE dr.discussion_id = ?
        ORDER BY dr.created_at ASC
      `,
      args: [discussionId]
    });

    console.log(`🔍 Checking ${repliesResult.rows.length} replies for discussion: ${discussionId}`);

    for (const replyRow of repliesResult.rows) {
      const replyId = replyRow.id as string;
      const authorId = replyRow.author_id as string;
      const authorName = replyRow.author_name as string;
      const currentAvatar = replyRow.profile_picture_url as string;
      const currentPreferredAvatar = replyRow.preferred_avatar as string;

      console.log(`\n🔍 Checking reply: ${replyId}`);
      console.log(`  Author: ${authorName} (${authorId})`);
      console.log(`  Current avatar: "${currentAvatar}"`);
      console.log(`  Current preferred: "${currentPreferredAvatar}"`);

      // Find the corresponding persona template
      const personaTemplate = SEED_PERSONA_TEMPLATES.find(p => p.id === authorId);
      
      if (personaTemplate) {
        console.log(`  Expected avatar: "${personaTemplate.avatar}"`);
        console.log(`  Expected preferred: "${personaTemplate.preferredAvatar}"`);
        
        let needsUpdate = false;
        const updates: { profile_picture_url?: string; preferred_avatar?: string } = {};
        
        // Check if profile_picture_url needs updating
        if (currentAvatar !== personaTemplate.avatar) {
          console.log(`  🔄 Avatar needs update: "${currentAvatar}" → "${personaTemplate.avatar}"`);
          updates.profile_picture_url = personaTemplate.avatar;
          needsUpdate = true;
        }
        
        // Check if preferred_avatar needs updating
        if (currentPreferredAvatar !== personaTemplate.preferredAvatar) {
          console.log(`  🔄 Preferred avatar needs update: "${currentPreferredAvatar}" → "${personaTemplate.preferredAvatar}"`);
          updates.preferred_avatar = personaTemplate.preferredAvatar;
          needsUpdate = true;
        }

        if (needsUpdate) {
          // Update the user's avatar paths
          const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
          const values = Object.values(updates);
          
          await db.client.execute({
            sql: `UPDATE users SET ${setClause}, updated_at = ? WHERE id = ?`,
            args: [...values, Math.floor(Date.now() / 1000), authorId]
          });

          fixedReplies.push({
            replyId: replyId,
            authorId: authorId,
            authorName: authorName,
            oldAvatar: currentAvatar,
            newAvatar: personaTemplate.avatar,
            oldPreferredAvatar: currentPreferredAvatar,
            newPreferredAvatar: personaTemplate.preferredAvatar
          });
          
          fixedCount++;
          console.log(`  ✅ Fixed avatar paths for reply ${replyId}`);
        } else {
          console.log(`  ✅ Avatar paths already correct for reply ${replyId}`);
        }
      } else {
        console.log(`  ❌ No persona template found for author: ${authorName} (${authorId})`);
      }
    }

    console.log(`\n🔧 Fix Discussion Avatar Paths Summary: Fixed ${fixedCount}/${repliesResult.rows.length} replies`);

    return NextResponse.json({
      success: true,
      message: `Fixed avatar paths for ${fixedCount} replies`,
      fixedCount,
      totalReplies: repliesResult.rows.length,
      fixedReplies,
      discussionId
    });

  } catch (error) {
    console.error('Error fixing discussion avatar paths:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fix avatar paths: ' + (error as Error).message },
      { status: 500 }
    );
  }
}