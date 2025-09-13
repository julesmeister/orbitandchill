/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/db/services/userService';
import { AuditService } from '@/db/services/auditService';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId, 
      requestedBy, 
      requestType = 'grace_period', 
      reason,
      gracePeriodDays = 30,
      scheduledFor 
    } = body;

    // Basic validation
    if (!userId || !requestedBy) {
      return NextResponse.json(
        { error: 'Missing required fields: userId and requestedBy' },
        { status: 400 }
      );
    }

    // Validate request type
    if (!['immediate', 'scheduled', 'grace_period'].includes(requestType)) {
      return NextResponse.json(
        { error: 'Invalid request type. Must be immediate, scheduled, or grace_period' },
        { status: 400 }
      );
    }

    // Get request context
    const userAgent = request.headers.get('user-agent') || undefined;
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ipAddress = forwardedFor?.split(',')[0] || undefined;

    // Verify user exists
    const user = await UserService.getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user already has a pending deletion request
    const existingRequests = await UserService.getAccountDeletionStatus(userId);
    const pendingRequest = existingRequests.find((req: any) => req.status === 'pending' || req.status === 'confirmed');
    
    if (pendingRequest) {
      return NextResponse.json(
        { 
          error: 'Account deletion already requested',
          request: {
            id: pendingRequest.id,
            status: pendingRequest.status,
            requestType: pendingRequest.requestType,
            createdAt: pendingRequest.createdAt
          }
        },
        { status: 409 }
      );
    }

    // Create deletion request
    const confirmationToken = await UserService.requestAccountDeletion({
      userId,
      requestedBy,
      requestType,
      reason,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
      gracePeriodDays,
      userAgent,
      ipAddress
    });

    // TODO: Send confirmation email with token
    // For now, we'll return the token in the response for testing
    const response = {
      message: 'Account deletion requested successfully',
      confirmationToken: requestType === 'immediate' ? confirmationToken : undefined,
      requestType,
      gracePeriodDays: requestType === 'grace_period' ? gracePeriodDays : undefined,
      scheduledFor: requestType === 'scheduled' ? scheduledFor : undefined
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('Account deletion request failed:', error);
    return NextResponse.json(
      { error: 'Failed to process account deletion request' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, deletionType = 'soft', adminUserId } = body;

    // Basic validation
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required field: userId' },
        { status: 400 }
      );
    }

    // Validate deletion type
    if (!['soft', 'hard'].includes(deletionType)) {
      return NextResponse.json(
        { error: 'Invalid deletion type. Must be soft or hard' },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await UserService.getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Process the deletion
    const cleanupStatus = await UserService.processAccountDeletion(userId, deletionType);

    if (!cleanupStatus.completed) {
      return NextResponse.json(
        { 
          error: 'Account deletion completed with errors',
          cleanupStatus,
          partialSuccess: true
        },
        { status: 207 } // Multi-status
      );
    }

    // Additional audit logging for admin-initiated deletions
    if (adminUserId && adminUserId !== 'admin') {
      try {
        // Get request context for audit
        const forwardedFor = request.headers.get('x-forwarded-for');
        const auditIpAddress = forwardedFor?.split(',')[0] || undefined;
        await AuditService.logAdminUserAction({
          adminUserId,
          adminUsername: 'Admin', // TODO: Get actual admin username
          action: 'delete',
          targetUserId: userId,
          targetUsername: user.username,
          description: `Admin executed ${deletionType} deletion for user ${user.username}`,
          ipAddress: auditIpAddress,
          userAgent: request.headers.get('user-agent') || undefined
        });
      } catch (auditError) {
        console.error('Failed to log admin action:', auditError);
        // Don't fail the main operation if audit logging fails
      }
    }
    
    return NextResponse.json({
      message: `Account ${deletionType} deletion completed successfully`,
      userId,
      deletionType,
      cleanupStatus
    }, { status: 200 });

  } catch (error) {
    console.error('Account deletion failed:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    switch (action) {
      case 'confirm': {
        const { confirmationToken } = params;
        
        if (!confirmationToken) {
          return NextResponse.json(
            { error: 'Missing confirmation token' },
            { status: 400 }
          );
        }

        const confirmed = await UserService.confirmAccountDeletion(confirmationToken);
        
        if (!confirmed) {
          return NextResponse.json(
            { error: 'Invalid or expired confirmation token' },
            { status: 400 }
          );
        }

        return NextResponse.json({
          message: 'Account deletion confirmed successfully'
        }, { status: 200 });
      }

      case 'cancel': {
        const { userId } = params;
        
        if (!userId) {
          return NextResponse.json(
            { error: 'Missing userId' },
            { status: 400 }
          );
        }

        const cancelled = await UserService.cancelAccountDeletion(userId);
        
        if (!cancelled) {
          return NextResponse.json(
            { error: 'No pending deletion request found or request cannot be cancelled' },
            { status: 400 }
          );
        }

        return NextResponse.json({
          message: 'Account deletion request cancelled successfully'
        }, { status: 200 });
      }

      case 'status': {
        const { userId } = params;
        
        if (!userId) {
          return NextResponse.json(
            { error: 'Missing userId' },
            { status: 400 }
          );
        }

        const status = await UserService.getAccountDeletionStatus(userId);
        
        return NextResponse.json({
          requests: status
        }, { status: 200 });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action. Must be confirm, cancel, or status' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Account deletion action failed:', error);
    return NextResponse.json(
      { error: 'Failed to process account deletion action' },
      { status: 500 }
    );
  }
}