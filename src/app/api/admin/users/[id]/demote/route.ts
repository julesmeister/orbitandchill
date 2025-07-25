/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/middleware/adminAuth';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Validate admin authentication with permission
    const authResult = await withAdminAuth(request, 'manage_users');
    if (!authResult.success) {
      return authResult.response;
    }

    const resolvedParams = await params;
    const userId = resolvedParams.id;
    const { context: adminContext } = authResult;

    // Parse request body for target role
    const body = await request.json();
    const { targetRole = 'user' } = body;

    // Validate target role
    const validRoles = ['user', 'moderator'];
    if (!validRoles.includes(targetRole)) {
      return NextResponse.json(
        { success: false, error: 'Invalid demotion target role' },
        { status: 400 }
      );
    }

    // Prevent self-demotion to avoid admin lockout
    if (userId === adminContext.user.id) {
      return NextResponse.json(
        { success: false, error: 'Cannot demote yourself' },
        { status: 400 }
      );
    }

    // Get current user data
    const [currentUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is already at or below target role
    const roleHierarchy = { user: 0, moderator: 1, admin: 2 };
    const currentRoleLevel = roleHierarchy[currentUser.role as keyof typeof roleHierarchy] || 0;
    const targetRoleLevel = roleHierarchy[targetRole as keyof typeof roleHierarchy] || 0;

    if (currentRoleLevel <= targetRoleLevel) {
      return NextResponse.json(
        { 
          success: false, 
          error: `User is already ${currentUser.role}${currentRoleLevel < targetRoleLevel ? ' (lower than target role)' : ''}` 
        },
        { status: 400 }
      );
    }

    // Update user role and remove elevated permissions
    const updateData = {
      role: targetRole,
      permissions: targetRole === 'user' ? null : '[]', // Clear permissions for regular users
      updatedAt: new Date().toISOString()
    };

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'Failed to update user role' },
        { status: 500 }
      );
    }

    // Log the demotion action
    console.log(`⬇️ User demoted: ${currentUser.username} (${currentUser.role} → ${targetRole}) by ${adminContext.user.username}`);

    return NextResponse.json({
      success: true,
      message: `User demoted to ${targetRole}`,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        permissions: updatedUser.permissions ? JSON.parse(updatedUser.permissions) : [],
        previousRole: currentUser.role,
        updatedAt: updatedUser.updatedAt
      }
    });

  } catch (error) {
    console.error('❌ Error demoting user:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}