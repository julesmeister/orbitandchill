/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { getDbAsync } from '@/db/index-turso-http';
import { SEED_PERSONA_TEMPLATES } from '@/data/seedPersonas';

interface FixedUser {
  id: string;
  username: string;
  oldAvatar: string;
  newAvatar: string;
  oldPreferredAvatar: string;
  newPreferredAvatar: string;
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDbAsync();
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 500 }
      );
    }

    let fixedCount = 0;
    const fixedUsers: FixedUser[] = [];
    let totalUsers = 0;

    // Get all users to check their avatar paths
    const allUsers = await db.client.execute({
      sql: 'SELECT id, username, profile_picture_url, preferred_avatar FROM users WHERE id LIKE "seed_user_%"'
    });

    totalUsers = allUsers.rows.length;

    for (const userRow of allUsers.rows) {
      const userId = userRow.id as string;
      const username = userRow.username as string;
      const currentProfilePictureUrl = userRow.profile_picture_url as string;
      const currentPreferredAvatar = userRow.preferred_avatar as string;

      console.log(`🔍 Checking user: ${username} (${userId})`);
      console.log(`  Current profile_picture_url: "${currentProfilePictureUrl}"`);
      console.log(`  Current preferred_avatar: "${currentPreferredAvatar}"`);

      // Find the corresponding persona template
      const personaTemplate = SEED_PERSONA_TEMPLATES.find(p => p.id === userId);
      
      if (personaTemplate) {
        console.log(`  Expected avatar: "${personaTemplate.avatar}"`);
        console.log(`  Expected preferredAvatar: "${personaTemplate.preferredAvatar}"`);
        
        let needsUpdate = false;
        const updates: { profile_picture_url?: string; preferred_avatar?: string } = {};
        
        // Check if profile_picture_url needs updating
        if (currentProfilePictureUrl !== personaTemplate.avatar) {
          console.log(`  🔄 profile_picture_url needs update: "${currentProfilePictureUrl}" → "${personaTemplate.avatar}"`);
          updates.profile_picture_url = personaTemplate.avatar;
          needsUpdate = true;
        } else {
          console.log(`  ✅ profile_picture_url is correct`);
        }
        
        // Check if preferred_avatar needs updating
        if (currentPreferredAvatar !== personaTemplate.preferredAvatar) {
          console.log(`  🔄 preferred_avatar needs update: "${currentPreferredAvatar}" → "${personaTemplate.preferredAvatar}"`);
          updates.preferred_avatar = personaTemplate.preferredAvatar;
          needsUpdate = true;
        } else {
          console.log(`  ✅ preferred_avatar is correct`);
        }

        if (needsUpdate) {
          // Build dynamic SQL based on what needs updating
          const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
          const values = Object.values(updates);
          
          await db.client.execute({
            sql: `UPDATE users SET ${setClause}, updated_at = ? WHERE id = ?`,
            args: [...values, Math.floor(Date.now() / 1000), userId]
          });

          fixedUsers.push({
            id: userId,
            username: username,
            oldAvatar: currentProfilePictureUrl,
            newAvatar: personaTemplate.avatar,
            oldPreferredAvatar: currentPreferredAvatar,
            newPreferredAvatar: personaTemplate.preferredAvatar
          });
          
          fixedCount++;
        }
      } else {
        console.log(`  ❌ No persona template found for user: ${username} (${userId})`);
      }
    }

    console.log(`🔧 Fix Avatar Paths Summary: Fixed ${fixedCount}/${totalUsers} users`);

    return NextResponse.json({
      success: true,
      message: `Fixed avatar paths for ${fixedCount} users`,
      fixedCount,
      totalUsers,
      fixedUsers
    });

  } catch (error) {
    console.error('Error fixing avatar paths:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fix avatar paths: ' + (error as Error).message },
      { status: 500 }
    );
  }
}