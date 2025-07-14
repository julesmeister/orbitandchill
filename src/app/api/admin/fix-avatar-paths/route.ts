/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '@/db/index';
import { UserService } from '@/db/services/userService';

interface User {
  id: string;
  username: string;
  avatar?: string;
}

interface FixedUser {
  id: string;
  username: string;
  oldAvatar: string;
  newAvatar: string;
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();

    // Get all users with problematic avatar paths (use high limit to get all users)
    const users = await UserService.getAllUsers(10000, 0) as User[];
    
    let fixedCount = 0;
    const fixedUsers: FixedUser[] = [];

    for (const user of users) {
      // Check if user has an avatar path that doesn't match the Avatar-X.png format
      if (user.avatar && user.avatar.startsWith('/avatars/') && !user.avatar.match(/\/avatars\/Avatar-\d+\.png$/)) {
        // Generate a consistent avatar number based on username
        const hash = user.username.split('').reduce((a: number, b: string) => {
          a = ((a << 5) - a) + b.charCodeAt(0);
          return a & a;
        }, 0);
        const avatarNumber = Math.abs(hash % 36) + 1; // 1-36 to match available avatars
        const newAvatarPath = `/avatars/Avatar-${avatarNumber}.png`;

        try {
          // Update the user's avatar path
          await UserService.updateUser(user.id, {
            avatar: newAvatarPath
          });

          fixedUsers.push({
            id: user.id,
            username: user.username,
            oldAvatar: user.avatar,
            newAvatar: newAvatarPath
          });

          fixedCount++;
        } catch (updateError) {
          console.error(`Failed to update avatar for user ${user.id}:`, updateError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Fixed avatar paths for ${fixedCount} users`,
      fixedCount,
      fixedUsers,
      totalUsers: users.length
    });

  } catch (error) {
    console.error('Error fixing avatar paths:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fix avatar paths',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}