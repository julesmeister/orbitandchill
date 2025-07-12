/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client/http';

const databaseUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!databaseUrl || !authToken) {
  console.error('Missing database configuration');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!databaseUrl || !authToken) {
      return NextResponse.json(
        { error: 'Database configuration missing' },
        { status: 500 }
      );
    }

    const client = createClient({
      url: databaseUrl,
      authToken: authToken,
    });

    const resolvedParams = await params;
    const userId = resolvedParams.id;
    const body = await request.json();
    const { username, email, role, status, adminUserId } = body;

    // Validate required fields
    if (!userId || !username || !role || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, username, role, status' },
        { status: 400 }
      );
    }

    // Validate role values
    const validRoles = ['user', 'admin', 'moderator'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be one of: user, admin, moderator' },
        { status: 400 }
      );
    }

    // Validate status values
    const validStatuses = ['active', 'inactive'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: active, inactive' },
        { status: 400 }
      );
    }

    // Check if user exists
    const userCheck = await client.execute({
      sql: 'SELECT id, username, email, role, is_active FROM users WHERE id = ? LIMIT 1',
      args: [userId]
    });

    if (userCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const existingUser = userCheck.rows[0];

    // Build update query dynamically based on provided fields
    const updateFields = [];
    const updateValues = [];

    // Always update username, email, and role to ensure consistency
    updateFields.push('username = ?');
    updateValues.push(username);

    if (email) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }

    updateFields.push('role = ?');
    updateValues.push(role);

    // Map status to database fields
    // Convert status to is_active boolean
    const isActive = status === 'active' ? 1 : 0;
    updateFields.push('is_active = ?');
    updateValues.push(isActive);

    // Always update the updated_at timestamp
    updateFields.push('updated_at = ?');
    updateValues.push(new Date().toISOString());

    // Add userId at the end for WHERE clause
    updateValues.push(userId);

    // Execute update query
    const updateQuery = `
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `;

    const updateResult = await client.execute({
      sql: updateQuery,
      args: updateValues
    });

    // TODO: Log the admin action for audit trail when admin_audit_logs table exists

    // Fetch updated user data to return
    const updatedUserResult = await client.execute({
      sql: `
        SELECT id, username, email, role, is_active, updated_at
        FROM users 
        WHERE id = ? 
        LIMIT 1
      `,
      args: [userId]
    });

    const updatedUser = updatedUserResult.rows[0];

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.is_active ? 'active' : 'inactive',
        updatedAt: updatedUser.updated_at
      }
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}