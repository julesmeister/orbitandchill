/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { getDbAsync } from '@/db/index-turso-http';
import { SEED_PERSONA_TEMPLATES } from '@/data/seedPersonas';

export async function GET(request: NextRequest) {
  try {
    const db = await getDbAsync();
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 500 }
      );
    }

    let usersNeedingFix = 0;
    let totalUsers = 0;

    // Get all users to check their avatar paths
    const allUsers = await db.client.execute({
      sql: 'SELECT id, username, profile_picture_url, preferred_avatar FROM users WHERE id LIKE "seed_user_%"'
    });

    totalUsers = allUsers.rows.length;

    for (const userRow of allUsers.rows) {
      const userId = userRow.id as string;
      const currentProfilePictureUrl = userRow.profile_picture_url as string;
      const currentPreferredAvatar = userRow.preferred_avatar as string;

      // Find the corresponding persona template
      const personaTemplate = SEED_PERSONA_TEMPLATES.find(p => p.id === userId);
      
      if (personaTemplate) {
        // Check if profile_picture_url or preferred_avatar needs updating
        const profilePictureNeedsUpdate = currentProfilePictureUrl !== personaTemplate.avatar;
        const preferredAvatarNeedsUpdate = currentPreferredAvatar !== personaTemplate.preferredAvatar;

        if (profilePictureNeedsUpdate || preferredAvatarNeedsUpdate) {
          usersNeedingFix++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      totalUsers,
      usersNeedingFix,
      message: `${usersNeedingFix} users need avatar path fixes out of ${totalUsers} total users`
    });

  } catch (error) {
    console.error('Error checking avatar paths status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check avatar paths status: ' + (error as Error).message },
      { status: 500 }
    );
  }
}