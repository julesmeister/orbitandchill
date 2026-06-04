/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/middleware/adminAuth';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

const VALID_TIERS = ['free', 'premium', 'pro'] as const;
type SubscriptionTier = typeof VALID_TIERS[number];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await withAdminAuth(request, 'manage_users');
    if (!authResult.success) {
      return authResult.response;
    }

    const resolvedParams = await params;
    const userId = resolvedParams.id;
    const { context: adminContext } = authResult;

    const body = await request.json();
    const { subscriptionTier, reason } = body;

    if (!subscriptionTier || !VALID_TIERS.includes(subscriptionTier)) {
      return NextResponse.json(
        { success: false, error: `Invalid subscriptionTier. Must be one of: ${VALID_TIERS.join(', ')}` },
        { status: 400 }
      );
    }

    const [currentUser] = await db
      .select({ id: users.id, username: users.username, subscriptionTier: users.subscriptionTier })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const newTier = subscriptionTier as SubscriptionTier;
    if (currentUser.subscriptionTier === newTier) {
      return NextResponse.json({
        success: true,
        message: `User is already on ${newTier}`,
        user: {
          id: currentUser.id,
          username: currentUser.username,
          subscriptionTier: currentUser.subscriptionTier,
        },
      });
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        subscriptionTier: newTier,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        username: users.username,
        email: users.email,
        subscriptionTier: users.subscriptionTier,
        updatedAt: users.updatedAt,
      });

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'Failed to update subscription' },
        { status: 500 }
      );
    }

    const isGrant = newTier !== 'free';
    console.log(
      `💎 Subscription ${isGrant ? 'granted' : 'revoked'}: ${updatedUser.username} (${currentUser.subscriptionTier} → ${newTier}) by ${adminContext.user.username}${reason ? ` — ${reason}` : ''}`
    );

    return NextResponse.json({
      success: true,
      message: isGrant
        ? `${updatedUser.username} granted ${newTier} subscription`
        : `${updatedUser.username} subscription set to free`,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        subscriptionTier: updatedUser.subscriptionTier,
        updatedAt: updatedUser.updatedAt,
        previousTier: currentUser.subscriptionTier,
      },
    });
  } catch (error) {
    console.error('❌ Error updating user subscription:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await withAdminAuth(request, 'manage_users');
    if (!authResult.success) {
      return authResult.response;
    }

    const resolvedParams = await params;
    const userId = resolvedParams.id;

    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        subscriptionTier: users.subscriptionTier,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('❌ Error fetching user subscription:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
