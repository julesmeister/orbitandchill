/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db/index';
import { users } from '@/db/schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // For anonymous users, we don't need to do anything server-side
    // For Google authenticated users, we could track last activity or session cleanup
    
    // Update user's last activity timestamp (only if database is available)
    if (db) {
      try {
        await db
          .update(users)
          .set({ 
            updatedAt: new Date(),
            showOnlineStatus: false // Set offline status
          })
          .where(eq(users.id, userId));
      } catch (dbError) {
        console.warn('Failed to update user logout status in database:', dbError);
        // Continue with logout even if database update fails
      }
    } else {
      console.warn('Database not available during logout, skipping user status update');
    }

    // Clear any server-side session data if we had any
    // For now, we rely on client-side session management

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Health check for logout endpoint
  return NextResponse.json({
    endpoint: 'auth/logout',
    status: 'active',
    methods: ['POST']
  });
}