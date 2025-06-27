/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/middleware/adminAuth';

interface AdminVerifyResponse {
  success: boolean;
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
    permissions: string[];
  };
  sessionId?: string;
  error?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse<AdminVerifyResponse>> {
  try {
    // Authenticate admin
    const authResult = await withAdminAuth(request);
    
    if (!authResult.success) {
      return authResult.response as NextResponse<AdminVerifyResponse>;
    }

    const { sessionId, user } = authResult.context;

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email || '',
        role: user.role,
        permissions: user.permissions,
      },
      sessionId,
    });

  } catch (error) {
    console.error('Admin token verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}