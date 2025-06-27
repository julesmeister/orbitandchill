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
    const validStatuses = ['active', 'inactive', 'suspended'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: active, inactive, suspended' },
        { status: 400 }
      );
    }

    // Check if user exists
    const userCheck = await client.execute({
      sql: 'SELECT id, username, email, role FROM users WHERE id = ? LIMIT 1',
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

    if (username !== existingUser.username) {
      updateFields.push('username = ?');
      updateValues.push(username);
    }

    if (email && email !== existingUser.email) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }

    if (role !== existingUser.role) {
      updateFields.push('role = ?');
      updateValues.push(role);
    }

    // Map status to database fields
    updateFields.push('is_active = ?');
    updateValues.push(status === 'active' ? 1 : 0);

    if (status === 'suspended') {
      updateFields.push('is_suspended = ?');
      updateValues.push(1);
    } else {
      updateFields.push('is_suspended = ?');
      updateValues.push(0);
    }

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

    await client.execute({
      sql: updateQuery,
      args: updateValues
    });

    // Log the admin action for audit trail
    try {
      await client.execute({
        sql: `
          INSERT INTO admin_audit_logs (admin_user_id, action_type, resource_type, resource_id, details, timestamp)
          VALUES (?, ?, ?, ?, ?, ?)
        `,
        args: [
          adminUserId || 'system',
          'update_user',
          'user',
          userId,
          JSON.stringify({
            previousRole: existingUser.role,
            newRole: role,
            previousStatus: existingUser.is_active ? 'active' : 'inactive',
            newStatus: status,
            updatedFields: updateFields.map(field => field.split(' = ')[0])
          }),
          new Date().toISOString()
        ]
      });
    } catch (auditError) {
      console.warn('Failed to log audit trail:', auditError);
      // Continue execution - audit logging failure shouldn't break the update
    }

    // Fetch updated user data to return
    const updatedUserResult = await client.execute({
      sql: `
        SELECT id, username, email, role, is_active, is_suspended, updated_at
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
        status: updatedUser.is_active ? (updatedUser.is_suspended ? 'suspended' : 'active') : 'inactive',
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