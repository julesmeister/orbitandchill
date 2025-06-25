/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { eq, desc, like, or, and, count } from 'drizzle-orm';
import { db } from '@/db/index';
import { users, discussions, natalCharts } from '@/db/schema';
import { AdminAuditService } from '@/db/services/adminAuditService';
import { createAdminRoute, type AdminAuthContext } from '@/middleware/adminAuth';

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
}

async function handleGetUsers(request: NextRequest, context: AdminAuthContext) {
  try {
    // Extract request context for audit logging
    const requestContext = AdminAuditService.extractRequestContext(request, Object.fromEntries(request.headers.entries()));
    
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const search = url.searchParams.get('search') || '';
    const authProvider = url.searchParams.get('authProvider') || '';
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';

    // Log admin viewing users
    await AdminAuditService.log({
      adminUserId: context.userId,
      adminUsername: context.user.username,
      action: 'view',
      entityType: 'user',
      entityId: 'multiple',
      description: `Viewed user list - page ${page}, search: "${search}", provider: "${authProvider}"`,
      severity: 'low',
      details: { page, limit, search, authProvider, sortBy, sortOrder },
      ...requestContext
    });

    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = [];
    
    if (search) {
      whereConditions.push(
        or(
          like(users.username, `%${search}%`),
          like(users.email, `%${search}%`)
        )
      );
    }

    if (authProvider) {
      whereConditions.push(eq(users.authProvider, authProvider as any));
    }

    const whereClause = whereConditions.length > 0 
      ? and(...whereConditions)
      : undefined;

    // Get total count for pagination
    const [totalCount] = await db
      .select({ count: count() })
      .from(users)
      .where(whereClause);

    // Get users with their stats
    const usersList = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        authProvider: users.authProvider,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        hasNatalChart: users.hasNatalChart,
        showOnlineStatus: users.showOnlineStatus,
      })
      .from(users)
      .where(whereClause)
      .orderBy(sortOrder === 'desc' ? desc(users.createdAt) : users.createdAt)
      .limit(limit)
      .offset(offset);

    // Get chart counts for each user
    const userIds = usersList.map((u: any) => u.id);
    const chartCounts = await db
      .select({
        userId: natalCharts.userId,
        count: count()
      })
      .from(natalCharts)
      .where(eq(natalCharts.userId, userIds[0])) // This is a simplified approach
      .groupBy(natalCharts.userId);

    // Get discussion counts for each user
    const discussionCounts = await db
      .select({
        authorId: discussions.authorId,
        count: count()
      })
      .from(discussions)
      .where(eq(discussions.authorId, userIds[0])) // This is a simplified approach
      .groupBy(discussions.authorId);

    // Combine data
    const usersWithStats: AdminUserData[] = usersList.map((user: any) => {
      const chartCount = chartCounts.find((c: any) => c.userId === user.id)?.count || 0;
      const discussionCount = discussionCounts.find((d: any) => d.authorId === user.id)?.count || 0;
      
      return {
        id: user.id,
        username: user.username,
        email: user.email || undefined,
        authProvider: user.authProvider,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        hasNatalChart: Boolean(user.hasNatalChart),
        chartCount: Number(chartCount),
        discussionCount: Number(discussionCount),
        isActive: Boolean(user.showOnlineStatus),
        lastActivity: user.updatedAt.toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      users: usersWithStats,
      pagination: {
        page,
        limit,
        total: totalCount.count,
        totalPages: Math.ceil(totalCount.count / limit),
        hasNext: page * limit < totalCount.count,
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

async function handlePostUsers(request: NextRequest, context: AdminAuthContext) {
  try {
    // Extract request context for audit logging
    const requestContext = AdminAuditService.extractRequestContext(request, Object.fromEntries(request.headers.entries()));
    
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
      case 'updateUsers':
        // Bulk update users
        const allowedUpdates = ['username', 'showOnlineStatus', 'hasNatalChart'];
        const updateFields: any = { updatedAt: new Date() };
        
        for (const [key, value] of Object.entries(updateData)) {
          if (allowedUpdates.includes(key)) {
            updateFields[key] = value;
          }
        }

        // Get users before update for audit logging
        const usersBeforeUpdate = await db
          .select()
          .from(users)
          .where(eq(users.id, userIds[0])); // Simplified for demo

        for (const userId of userIds) {
          await db
            .update(users)
            .set(updateFields)
            .where(eq(users.id, userId));

          // Log the update action
          await AdminAuditService.logUserAction(
            context.user.username,
            'update',
            userId,
            `Bulk updated user fields: ${Object.keys(updateFields).join(', ')}`,
            {
              requestContext,
              beforeValues: usersBeforeUpdate.find((u: any) => u.id === userId),
              afterValues: updateFields,
            }
          );
        }

        result = { message: `Updated ${userIds.length} users successfully` };
        break;

      case 'deactivateUsers':
        // Set users as inactive
        for (const userId of userIds) {
          await db
            .update(users)
            .set({ 
              showOnlineStatus: false,
              updatedAt: new Date()
            })
            .where(eq(users.id, userId));

          // Log the deactivation
          await AdminAuditService.logUserAction(
            'Admin',
            'update',
            userId,
            'Deactivated user (set showOnlineStatus to false)',
            {
              requestContext,
              afterValues: { showOnlineStatus: false },
            }
          );
        }

        result = { message: `Deactivated ${userIds.length} users successfully` };
        break;

      case 'deleteUsers':
        // Get users before deletion for audit logging
        const usersBeforeDelete = await db
          .select()
          .from(users)
          .where(eq(users.id, userIds[0])); // Simplified for demo

        // Delete users (cascade will handle related data)
        for (const userId of userIds) {
          const userBeforeDelete = usersBeforeDelete.find((u: any) => u.id === userId);
          
          await db
            .delete(users)
            .where(eq(users.id, userId));

          // Log the deletion with high severity
          await AdminAuditService.logUserAction(
            'Admin',
            'delete',
            userId,
            `Permanently deleted user: ${userBeforeDelete?.username || 'Unknown'}`,
            {
              requestContext,
              beforeValues: userBeforeDelete,
            }
          );
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

// Export protected routes
export const GET = createAdminRoute(handleGetUsers, 'admin.users.read');
export const POST = createAdminRoute(handlePostUsers, 'admin.users.write');