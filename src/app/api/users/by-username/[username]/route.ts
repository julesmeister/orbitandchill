/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/index-turso-http';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username;

    if (!username) {
      return NextResponse.json(
        { success: false, error: 'Username is required' },
        { status: 400 }
      );
    }

    // Decode the username in case it's URL encoded
    const decodedUsername = decodeURIComponent(username);

    // Find user by username
    const userQuery = await db
      .select()
      .from(users)
      .where(eq(users.username, decodedUsername))
      .limit(1);

    if (userQuery.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const userData = userQuery[0];

    // Convert database user to User object format
    const user = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      profilePictureUrl: userData.profilePictureUrl,
      preferredAvatar: userData.preferredAvatar,
      authProvider: userData.authProvider as 'google' | 'anonymous',
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
      hasNatalChart: userData.hasNatalChart,
      sunSign: userData.sunSign,
      stelliumSigns: userData.stelliumSigns ? JSON.parse(userData.stelliumSigns) : undefined,
      stelliumHouses: userData.stelliumHouses ? JSON.parse(userData.stelliumHouses) : undefined,
      detailedStelliums: userData.detailedStelliums ? JSON.parse(userData.detailedStelliums) : undefined,
      birthData: userData.dateOfBirth ? {
        dateOfBirth: userData.dateOfBirth,
        timeOfBirth: userData.timeOfBirth || '',
        locationOfBirth: userData.locationOfBirth || '',
        coordinates: {
          lat: userData.latitude?.toString() || '',
          lon: userData.longitude?.toString() || ''
        }
      } : undefined,
      privacy: {
        showZodiacPublicly: userData.showZodiacPublicly,
        showStelliumsPublicly: userData.showStelliumsPublicly,
        showBirthInfoPublicly: userData.showBirthInfoPublicly,
        allowDirectMessages: userData.allowDirectMessages,
        showOnlineStatus: userData.showOnlineStatus
      }
    };

    return NextResponse.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Error fetching user by username:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}