/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { UserService, CreateUserData, UpdateUserData } from '@/db/services/userService';
import { getDb, users } from '@/db/index';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter is required' },
        { status: 400 }
      );
    }

    const user = await UserService.getUserById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Error getting user profile:', error);
    return NextResponse.json(
      { error: 'Failed to get user profile' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    if (!db) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { 
      id, 
      username, 
      email, 
      profilePictureUrl, 
      authProvider,
      birthData,
      ...updateData 
    } = body;

    // Handle nested birthData structure - flatten it for database storage
    let flattenedBirthData = {};
    if (birthData) {
      flattenedBirthData = {
        dateOfBirth: birthData.dateOfBirth,
        timeOfBirth: birthData.timeOfBirth,
        locationOfBirth: birthData.locationOfBirth,
        latitude: birthData.coordinates?.lat ? parseFloat(birthData.coordinates.lat) : undefined,
        longitude: birthData.coordinates?.lon ? parseFloat(birthData.coordinates.lon) : undefined,
      };
    }

    // Combine all update data and filter out undefined values
    const finalUpdateData = Object.fromEntries(
      Object.entries({
        ...updateData,
        ...flattenedBirthData
      }).filter(([_, value]) => value !== undefined)
    );

      originalBirthData: birthData,
      flattenedBirthData,
      finalUpdateData
    });

    if (!id || !username || !authProvider) {
      return NextResponse.json(
        { error: 'id, username, and authProvider are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await UserService.getUserById(id);
    
    if (existingUser) {
      // Update existing user
      const updatedUser = await UserService.updateUser(id, {
        username,
        email,
        profilePictureUrl,
        ...finalUpdateData
      });

      return NextResponse.json({
        success: true,
        user: updatedUser,
        action: 'updated'
      });
    } else {
      // Create new user with the specific ID (especially for Google users)
      const now = new Date();
      
      const userData = {
        id,
        username,
        email,
        profilePictureUrl,
        authProvider: authProvider as 'google' | 'anonymous',
        createdAt: now,
        updatedAt: now,
        stelliumSigns: JSON.stringify([]),
        stelliumHouses: JSON.stringify([]),
        hasNatalChart: false,
        showZodiacPublicly: false,
        showStelliumsPublicly: false,
        showBirthInfoPublicly: false,
        allowDirectMessages: true,
        showOnlineStatus: true,
        ...finalUpdateData
      };

      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      const newUser = await UserService.createUser({
        id, // Pass the Google user ID
        username,
        email,
        profilePictureUrl,
        authProvider: authProvider as 'google' | 'anonymous'
      });

      // Update with additional data if provided
      if (Object.keys(finalUpdateData).length > 0) {
        await UserService.updateUser(newUser.id, finalUpdateData);
      }

      return NextResponse.json({
        success: true,
        user: newUser,
        action: 'created'
      });
    }

  } catch (error) {
    console.error('Error creating/updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to create/update user profile' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, birthData, ...updates } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Handle nested birthData structure - flatten it for database storage
    let flattenedBirthData = {};
    if (birthData) {
      flattenedBirthData = {
        dateOfBirth: birthData.dateOfBirth,
        timeOfBirth: birthData.timeOfBirth,
        locationOfBirth: birthData.locationOfBirth,
        latitude: birthData.coordinates?.lat ? parseFloat(birthData.coordinates.lat) : undefined,
        longitude: birthData.coordinates?.lon ? parseFloat(birthData.coordinates.lon) : undefined,
      };
    }

    // Combine all update data and filter out undefined values
    const finalUpdates = {
      ...updates,
      ...flattenedBirthData
    };

    // Remove undefined values to prevent SQL type errors
    const cleanUpdates = Object.fromEntries(
      Object.entries(finalUpdates).filter(([_, value]) => value !== undefined)
    );

    const updatedUser = await UserService.updateUser(userId, cleanUpdates);
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: updatedUser
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
}