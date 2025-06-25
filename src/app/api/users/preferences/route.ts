/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db/index';
import { users } from '@/db/schema';

export interface UserPreferences {
  // Privacy settings
  showZodiacPublicly: boolean;
  showStelliumsPublicly: boolean;
  showBirthInfoPublicly: boolean;
  allowDirectMessages: boolean;
  showOnlineStatus: boolean;
  
  // Notification preferences
  emailNotifications: boolean;
  weeklyNewsletter: boolean;
  discussionNotifications: boolean;
  chartReminders: boolean;
  
  // App preferences
  defaultChartTheme: string;
  timezone: string;
  language: string;
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Get user preferences from database
    const [user] = await db
      .select({
        showZodiacPublicly: users.showZodiacPublicly,
        showStelliumsPublicly: users.showStelliumsPublicly,
        showBirthInfoPublicly: users.showBirthInfoPublicly,
        allowDirectMessages: users.allowDirectMessages,
        showOnlineStatus: users.showOnlineStatus,
        emailNotifications: users.emailNotifications,
        weeklyNewsletter: users.weeklyNewsletter,
        discussionNotifications: users.discussionNotifications,
        chartReminders: users.chartReminders,
        defaultChartTheme: users.defaultChartTheme,
        timezone: users.timezone,
        language: users.language,
      })
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const preferences: UserPreferences = {
      showZodiacPublicly: Boolean(user.showZodiacPublicly),
      showStelliumsPublicly: Boolean(user.showStelliumsPublicly),
      showBirthInfoPublicly: Boolean(user.showBirthInfoPublicly),
      allowDirectMessages: Boolean(user.allowDirectMessages),
      showOnlineStatus: Boolean(user.showOnlineStatus),
      emailNotifications: Boolean(user.emailNotifications),
      weeklyNewsletter: Boolean(user.weeklyNewsletter),
      discussionNotifications: Boolean(user.discussionNotifications),
      chartReminders: Boolean(user.chartReminders),
      defaultChartTheme: user.defaultChartTheme || 'default',
      timezone: user.timezone || 'UTC',
      language: user.language || 'en',
    };

    return NextResponse.json({
      success: true,
      preferences,
    });

  } catch (error) {
    console.error('Preferences retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve preferences' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, preferences } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    if (!preferences || typeof preferences !== 'object') {
      return NextResponse.json(
        { error: 'preferences object is required' },
        { status: 400 }
      );
    }

    // Validate preferences structure
    const allowedPreferences = [
      'showZodiacPublicly',
      'showStelliumsPublicly', 
      'showBirthInfoPublicly',
      'allowDirectMessages',
      'showOnlineStatus',
      'emailNotifications',
      'weeklyNewsletter',
      'discussionNotifications',
      'chartReminders',
      'defaultChartTheme',
      'timezone',
      'language',
      // Chart-related data
      'stelliumSigns',
      'stelliumHouses',
      'detailedStelliums',
      'hasNatalChart',
      'sunSign'
    ];

    const updateData: any = {
      updatedAt: new Date(),
    };

    // Only update fields that are provided and valid
    for (const [key, value] of Object.entries(preferences)) {
      if (allowedPreferences.includes(key)) {
        // Convert to appropriate type based on field
        if (['defaultChartTheme', 'timezone', 'language', 'sunSign'].includes(key)) {
          updateData[key] = String(value);
        } else if (['stelliumSigns', 'stelliumHouses', 'detailedStelliums'].includes(key)) {
          // Handle arrays - store as JSON string
          updateData[key] = JSON.stringify(Array.isArray(value) ? value : []);
        } else {
          updateData[key] = Boolean(value);
        }
      }
    }

    // Update user preferences in database
    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId));

    // Fetch updated preferences to return
    const [updatedUser] = await db
      .select({
        showZodiacPublicly: users.showZodiacPublicly,
        showStelliumsPublicly: users.showStelliumsPublicly,
        showBirthInfoPublicly: users.showBirthInfoPublicly,
        allowDirectMessages: users.allowDirectMessages,
        showOnlineStatus: users.showOnlineStatus,
        emailNotifications: users.emailNotifications,
        weeklyNewsletter: users.weeklyNewsletter,
        discussionNotifications: users.discussionNotifications,
        chartReminders: users.chartReminders,
        defaultChartTheme: users.defaultChartTheme,
        timezone: users.timezone,
        language: users.language,
      })
      .from(users)
      .where(eq(users.id, userId));

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const updatedPreferences: UserPreferences = {
      showZodiacPublicly: Boolean(updatedUser.showZodiacPublicly),
      showStelliumsPublicly: Boolean(updatedUser.showStelliumsPublicly),
      showBirthInfoPublicly: Boolean(updatedUser.showBirthInfoPublicly),
      allowDirectMessages: Boolean(updatedUser.allowDirectMessages),
      showOnlineStatus: Boolean(updatedUser.showOnlineStatus),
      emailNotifications: Boolean(updatedUser.emailNotifications),
      weeklyNewsletter: Boolean(updatedUser.weeklyNewsletter),
      discussionNotifications: Boolean(updatedUser.discussionNotifications),
      chartReminders: Boolean(updatedUser.chartReminders),
      defaultChartTheme: updatedUser.defaultChartTheme || 'default',
      timezone: updatedUser.timezone || 'UTC',
      language: updatedUser.language || 'en',
    };

    return NextResponse.json({
      success: true,
      preferences: updatedPreferences,
      message: 'Preferences updated successfully',
    });

  } catch (error) {
    console.error('Preferences update error:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}