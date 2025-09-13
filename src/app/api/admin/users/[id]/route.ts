/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { eq, count } from 'drizzle-orm';
import { db } from '@/db/index';
import { users, discussions, natalCharts, votes } from '@/db/schema';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user details
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id));

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user statistics
    const [chartCount] = await db
      .select({ count: count() })
      .from(natalCharts)
      .where(eq(natalCharts.userId, id));

    const [discussionCount] = await db
      .select({ count: count() })
      .from(discussions)
      .where(eq(discussions.authorId, id));

    const [voteCount] = await db
      .select({ count: count() })
      .from(votes)
      .where(eq(votes.userId, id));

    // Get recent charts
    const recentCharts = await db
      .select({
        id: natalCharts.id,
        title: natalCharts.title,
        subjectName: natalCharts.subjectName,
        chartType: natalCharts.chartType,
        createdAt: natalCharts.createdAt,
        isPublic: natalCharts.isPublic,
      })
      .from(natalCharts)
      .where(eq(natalCharts.userId, id))
      .orderBy(natalCharts.createdAt)
      .limit(5);

    // Get recent discussions
    const recentDiscussions = await db
      .select({
        id: discussions.id,
        title: discussions.title,
        category: discussions.category,
        replies: discussions.replies,
        views: discussions.views,
        upvotes: discussions.upvotes,
        createdAt: discussions.createdAt,
      })
      .from(discussions)
      .where(eq(discussions.authorId, id))
      .orderBy(discussions.createdAt)
      .limit(5);

    const userDetails = {
      // Basic info
      id: user.id,
      username: user.username,
      email: user.email,
      profilePictureUrl: user.profilePictureUrl,
      authProvider: user.authProvider,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),

      // Birth data
      dateOfBirth: user.dateOfBirth,
      timeOfBirth: user.timeOfBirth,
      locationOfBirth: user.locationOfBirth,
      latitude: user.latitude,
      longitude: user.longitude,

      // Astrological data
      sunSign: user.sunSign,
      stelliumSigns: user.stelliumSigns ? JSON.parse(user.stelliumSigns) : [],
      stelliumHouses: user.stelliumHouses ? JSON.parse(user.stelliumHouses) : [],
      hasNatalChart: Boolean(user.hasNatalChart),

      // Privacy settings
      showZodiacPublicly: Boolean(user.showZodiacPublicly),
      showStelliumsPublicly: Boolean(user.showStelliumsPublicly),
      showBirthInfoPublicly: Boolean(user.showBirthInfoPublicly),
      allowDirectMessages: Boolean(user.allowDirectMessages),
      showOnlineStatus: Boolean(user.showOnlineStatus),

      // Preferences
      emailNotifications: Boolean(user.emailNotifications),
      weeklyNewsletter: Boolean(user.weeklyNewsletter),
      discussionNotifications: Boolean(user.discussionNotifications),
      chartReminders: Boolean(user.chartReminders),
      defaultChartTheme: user.defaultChartTheme,
      timezone: user.timezone,
      language: user.language,

      // Statistics
      stats: {
        chartsGenerated: chartCount.count,
        discussionsCreated: discussionCount.count,
        votesGiven: voteCount.count,
      },

      // Recent activity
      recentCharts: recentCharts.map((chart: any) => ({
        ...chart,
        createdAt: chart.createdAt.toISOString(),
      })),
      recentDiscussions: recentDiscussions.map((discussion: any) => ({
        ...discussion,
        createdAt: discussion.createdAt.toISOString(),
      })),
    };

    return NextResponse.json({
      success: true,
      user: userDetails,
    });

  } catch (error) {
    console.error('Admin user detail retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve user details' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Define allowed fields for admin updates
    const allowedFields = [
      'username',
      'email',
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
      'hasNatalChart'
    ];

    const updateData: any = {
      updatedAt: new Date(),
    };

    // Only update allowed fields
    for (const [key, value] of Object.entries(body)) {
      if (allowedFields.includes(key)) {
        if (typeof value === 'boolean') {
          updateData[key] = Boolean(value);
        } else if (typeof value === 'string') {
          updateData[key] = String(value);
        }
      }
    }

    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id));

    // Return updated user data
    const [updatedUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, id));

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found after update' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        updatedAt: updatedUser.updatedAt.toISOString(),
      },
      message: 'User updated successfully',
    });

  } catch (error) {
    console.error('Admin user update error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const [user] = await db
      .select({ id: users.id, username: users.username })
      .from(users)
      .where(eq(users.id, id));

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete user (cascade will handle related data)
    await db
      .delete(users)
      .where(eq(users.id, id));

    return NextResponse.json({
      success: true,
      message: `User ${user.username} deleted successfully`,
    });

  } catch (error) {
    console.error('Admin user deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}