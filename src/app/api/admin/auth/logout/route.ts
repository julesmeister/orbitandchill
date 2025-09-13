/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, logoutAdminSession } from '@/middleware/adminAuth';

interface AdminLogoutResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<AdminLogoutResponse>> {
  try {
    // Authenticate admin
    const authResult = await withAdminAuth(request);
    
    if (!authResult.success) {
      return authResult.response as NextResponse<AdminLogoutResponse>;
    }

    const { sessionId, user } = authResult.context;

    // Logout session
    const logoutSuccess = await logoutAdminSession(sessionId);

    if (!logoutSuccess) {
      return NextResponse.json(
        { success: false, error: 'Failed to logout session' },
        { status: 500 }
      );
    }

    // Log successful admin logout
    console.log(`✅ Admin logout successful: ${user.username} (${user.email})`);

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

  } catch (error) {
    console.error('Admin logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}