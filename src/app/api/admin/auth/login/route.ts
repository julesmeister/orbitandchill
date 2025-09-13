/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/db';
import { users, adminSessions } from '@/db/schema';
import { generateAdminToken, generateRefreshToken } from '@/middleware/adminAuth';

interface AdminLoginRequest {
  email: string;
  adminKey?: string; // Temporary admin access key
  sessionDuration?: number; // Hours, default 24
}

interface AdminLoginResponse {
  success: boolean;
  token?: string;
  refreshToken?: string;
  expiresAt?: string;
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
    permissions: string[];
  };
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<AdminLoginResponse>> {
  try {
    // Validate request body
    const contentLength = request.headers.get('content-length');
    if (!contentLength || contentLength === '0') {
      return NextResponse.json(
        { success: false, error: 'Request body is required' },
        { status: 400 }
      );
    }

    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { success: false, error: 'Content-Type must be application/json' },
        { status: 400 }
      );
    }

    let body: AdminLoginRequest;
    try {
      body = await request.json();
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      return NextResponse.json(
        { success: false, error: 'Invalid JSON format' },
        { status: 400 }
      );
    }

    const { email, adminKey, sessionDuration = 24 } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Get IP address and User Agent for session tracking
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Find user by email
    const userResult = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        permissions: users.permissions,
        isActive: users.isActive,
      })
      .from(users)
      .where(
        and(
          eq(users.email, email),
          eq(users.isActive, true)
        )
      )
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found or inactive' },
        { status: 404 }
      );
    }

    const user = userResult[0];

    // Check if user has admin role
    if (user.role !== 'admin' && user.role !== 'moderator') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Temporary admin key validation (until proper password system is implemented)
    const expectedAdminKey = process.env.ADMIN_ACCESS_KEY || 'admin-development-key-123';
    if (adminKey !== expectedAdminKey) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin access key' },
        { status: 401 }
      );
    }

    // Parse user permissions
    const permissions = user.permissions ? JSON.parse(user.permissions) : [];

    // Create session
    const sessionId = uuidv4();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + sessionDuration * 60 * 60 * 1000); // hours to milliseconds
    const refreshExpiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      sessionId,
      role: user.role,
      permissions,
    };

    const token = generateAdminToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Save session to database
    try {
      await db.insert(adminSessions).values({
        id: sessionId,
        userId: user.id,
        token,
        refreshToken,
        isActive: true,
        expiresAt,
        refreshExpiresAt,
        ipAddress,
        userAgent,
        loginMethod: 'token',
        lastActivity: now,
        failedAttempts: 0,
        createdAt: now,
        updatedAt: now,
      });
    } catch (dbError) {
      console.error('Failed to create admin session:', dbError);
      return NextResponse.json(
        { success: false, error: 'Failed to create session' },
        { status: 500 }
      );
    }

    // Log successful admin login
    console.log(`✅ Admin login successful: ${user.username} (${user.email}) from ${ipAddress}`);

    return NextResponse.json({
      success: true,
      token,
      refreshToken,
      expiresAt: expiresAt.toISOString(),
      user: {
        id: user.id,
        username: user.username,
        email: user.email || '',
        role: user.role || 'user',
        permissions,
      },
    });

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}