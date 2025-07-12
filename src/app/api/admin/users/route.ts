/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client/http';

const databaseUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!databaseUrl || !authToken) {
  console.error('Missing database configuration');
}

interface AdminUserData {
  id: string;
  username: string;
  email?: string;
  authProvider: string;
  createdAt: string;
  updatedAt: string;
  hasNatalChart: boolean;
  chartCount: number;
  discussionCount: number;
  isActive: boolean;
  lastActivity: string;
  role?: string;
  isSuspended?: boolean;
}

export async function GET(request: NextRequest) {
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

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const search = url.searchParams.get('search') || '';
    const authProvider = url.searchParams.get('authProvider') || '';
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';

    const offset = (page - 1) * limit;

    // Build WHERE conditions
    let whereClause = 'WHERE (is_deleted = 0 OR is_deleted IS NULL)';
    const queryArgs: any[] = [];

    if (search) {
      whereClause += ' AND (username LIKE ? OR email LIKE ?)';
      queryArgs.push(`%${search}%`, `%${search}%`);
    }

    if (authProvider) {
      whereClause += ' AND auth_provider = ?';
      queryArgs.push(authProvider);
    }

    // Get total count for pagination
    const countQuery = `SELECT COUNT(*) as count FROM users ${whereClause}`;
    const totalResult = await client.execute({
      sql: countQuery,
      args: queryArgs
    });
    const totalCount = totalResult.rows[0].count as number;

    // Get users with role information
    const orderClause = `ORDER BY ${sortBy === 'createdAt' ? 'created_at' : 'updated_at'} ${sortOrder.toUpperCase()}`;
    const usersQuery = `
      SELECT 
        id, username, email, auth_provider, created_at, updated_at, 
        has_natal_chart, role, is_active
      FROM users 
      ${whereClause} 
      ${orderClause} 
      LIMIT ? OFFSET ?
    `;

    const usersResult = await client.execute({
      sql: usersQuery,
      args: [...queryArgs, limit, offset]
    });

    // Get chart counts for each user
    const userIds = usersResult.rows.map(row => row.id);
    const chartCounts: { [key: string]: number } = {};
    
    if (userIds.length > 0) {
      const chartQuery = `
        SELECT user_id, COUNT(*) as count 
        FROM natal_charts 
        WHERE user_id IN (${userIds.map(() => '?').join(',')}) 
        GROUP BY user_id
      `;
      const chartResult = await client.execute({
        sql: chartQuery,
        args: userIds
      });
      
      chartResult.rows.forEach(row => {
        chartCounts[row.user_id as string] = row.count as number;
      });
    }

    // Get discussion counts for each user
    const discussionCounts: { [key: string]: number } = {};
    
    if (userIds.length > 0) {
      const discussionQuery = `
        SELECT author_id, COUNT(*) as count 
        FROM discussions 
        WHERE author_id IN (${userIds.map(() => '?').join(',')}) 
        GROUP BY author_id
      `;
      const discussionResult = await client.execute({
        sql: discussionQuery,
        args: userIds
      });
      
      discussionResult.rows.forEach(row => {
        discussionCounts[row.author_id as string] = row.count as number;
      });
    }

    // Combine data
    const usersWithStats: AdminUserData[] = usersResult.rows.map(row => ({
      id: row.id as string,
      username: row.username as string,
      email: row.email as string || undefined,
      authProvider: row.auth_provider as string,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
      hasNatalChart: Boolean(row.has_natal_chart),
      chartCount: chartCounts[row.id as string] || 0,
      discussionCount: discussionCounts[row.id as string] || 0,
      isActive: Boolean(row.is_active),
      lastActivity: row.updated_at as string,
      role: row.role as string || 'user'
    }));


    return NextResponse.json({
      success: true,
      users: usersWithStats,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page * limit < totalCount,
        hasPrev: page > 1,
      },
      filters: {
        search,
        authProvider,
        sortBy,
        sortOrder,
      }
    });

  } catch (error) {
    console.error('Admin users retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { action, userIds, ...updateData } = body;

    if (!action || !userIds || !Array.isArray(userIds)) {
      return NextResponse.json(
        { error: 'action and userIds array are required' },
        { status: 400 }
      );
    }

    let result;
    
    switch (action) {
      case 'deactivateUsers':
        // Set users as inactive
        for (const userId of userIds) {
          await client.execute({
            sql: 'UPDATE users SET is_active = 0, updated_at = ? WHERE id = ?',
            args: [new Date().toISOString(), userId]
          });
        }
        result = { message: `Deactivated ${userIds.length} users successfully` };
        break;

      case 'deleteUsers':
        // Soft delete users
        for (const userId of userIds) {
          await client.execute({
            sql: 'UPDATE users SET is_deleted = 1, updated_at = ? WHERE id = ?',
            args: [new Date().toISOString(), userId]
          });
        }
        result = { message: `Deleted ${userIds.length} users successfully` };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      ...result,
    });

  } catch (error) {
    console.error('Admin users action error:', error);
    return NextResponse.json(
      { error: 'Failed to perform user action' },
      { status: 500 }
    );
  }
}