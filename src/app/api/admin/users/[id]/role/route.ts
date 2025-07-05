/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/middleware/adminAuth';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
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

    // Parse request body
    const body = await request.json();
    const { role, permissions, isActive } = body;

    // Validate role if provided
    const validRoles = ['user', 'admin', 'moderator'];
    if (role && !validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role specified' },
        { status: 400 }
      );
    }

    // Prevent self-modification for critical changes
    if (userId === adminContext.user.id && (role || isActive === false)) {
      return NextResponse.json(
        { success: false, error: 'Cannot modify your own role or deactivate yourself' },
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

    // Build update object
    const updateData: any = {
      updatedAt: new Date().toISOString()
    };

    if (role) {
      updateData.role = role;
    }

    if (permissions !== undefined) {
      if (Array.isArray(permissions)) {
        updateData.permissions = JSON.stringify(permissions);
      } else if (permissions === null) {
        updateData.permissions = null;
      }
    }

    if (typeof isActive === 'boolean') {
      updateData.isActive = isActive;
    }

    // Update user
    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'Failed to update user' },
        { status: 500 }
      );
    }

    // Log the changes
    const changes: string[] = [];
    if (role && role !== currentUser.role) {
      changes.push(`role: ${currentUser.role} → ${role}`);
    }
    if (typeof isActive === 'boolean' && isActive !== currentUser.isActive) {
      changes.push(`status: ${currentUser.isActive ? 'active' : 'inactive'} → ${isActive ? 'active' : 'inactive'}`);
    }
    if (permissions !== undefined) {
      changes.push('permissions updated');
    }

    console.log(`🔄 User modified: ${currentUser.username} (${changes.join(', ')}) by ${adminContext.user.username}`);

    return NextResponse.json({
      success: true,
      message: `User ${changes.length > 0 ? 'updated successfully' : 'no changes made'}`,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        permissions: updatedUser.permissions ? JSON.parse(updatedUser.permissions) : [],
        isActive: updatedUser.isActive,
        updatedAt: updatedUser.updatedAt,
        changes: changes
      }
    });

  } catch (error) {
    console.error('❌ Error updating user role:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}