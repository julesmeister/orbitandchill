/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import * as jwt from 'jsonwebtoken';
import { eq, and } from 'drizzle-orm';
import { db } from '@/db';
import { adminSessions, users } from '@/db/schema';

// Environment variables for JWT
const JWT_SECRET: string = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '24h';
const REFRESH_TOKEN_EXPIRES_IN: string = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

export interface AdminTokenPayload {
  userId: string;
  sessionId: string;
  role: string;
  permissions: string[];
  iat?: number;
  exp?: number;
}

export interface AdminAuthContext {
  userId: string;
  sessionId: string;
  role: string;
  permissions: string[];
  user: {
    id: string;
    username: string;
    email?: string;
    role: string;
    permissions: string[];
    isActive: boolean;
  };
}

/**
 * Generate JWT token for admin authentication
 */
export function generateAdminToken(payload: Omit<AdminTokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

/**
 * Generate refresh token for admin session renewal
 */
export function generateRefreshToken(payload: Omit<AdminTokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN } as jwt.SignOptions);
}

/**
 * Verify and decode JWT token
 */
export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

/**
 * Extract admin token from request headers
 */
export function extractAdminToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove 'Bearer ' prefix
}

/**
 * Validate admin session in database
 */
export async function validateAdminSession(sessionId: string, userId: string): Promise<boolean> {
  try {
    // Special case: Master admin sessions don't need database validation
    if (sessionId.startsWith('master_session_')) {
      console.log('🔑 Validating master admin session:', sessionId);
      return true;
    }

    const session = await db
      .select()
      .from(adminSessions)
      .where(
        and(
          eq(adminSessions.id, sessionId),
          eq(adminSessions.userId, userId),
          eq(adminSessions.isActive, true)
        )
      )
      .limit(1);

    if (session.length === 0) {
      return false;
    }

    const sessionData = session[0];
    const now = new Date();
    
    // Check if session is expired
    if (sessionData.expiresAt && new Date(sessionData.expiresAt) < now) {
      // Deactivate expired session
      await db
        .update(adminSessions)
        .set({ isActive: false })
        .where(eq(adminSessions.id, sessionId));
      return false;
    }

    // Update last activity
    await db
      .update(adminSessions)
      .set({ lastActivity: now })
      .where(eq(adminSessions.id, sessionId));

    return true;
  } catch (error) {
    console.error('Session validation failed:', error);
    return false;
  }
}

/**
 * Get full admin user context
 */
export async function getAdminUserContext(userId: string): Promise<AdminAuthContext['user'] | null> {
  try {
    const user = await db
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
          eq(users.id, userId),
          eq(users.isActive, true)
        )
      )
      .limit(1);

    if (user.length === 0) {
      return null;
    }

    const userData = user[0];
    
    // Check if user has admin role
    if (userData.role !== 'admin' && userData.role !== 'moderator') {
      return null;
    }

    return {
      id: userData.id,
      username: userData.username,
      email: userData.email || undefined,
      role: userData.role || 'user',
      permissions: userData.permissions ? JSON.parse(userData.permissions) : [],
      isActive: userData.isActive || false,
    };
  } catch (error) {
    console.error('Failed to get admin user context:', error);
    return null;
  }
}

/**
 * Check if user has specific permission
 */
export function hasPermission(permissions: string[], requiredPermission: string): boolean {
  return permissions.includes(requiredPermission) || permissions.includes('*');
}

/**
 * Admin authentication middleware
 * Validates JWT token and admin session
 */
export async function withAdminAuth(
  request: NextRequest,
  requiredPermission?: string
): Promise<{ success: false; response: NextResponse } | { success: true; context: AdminAuthContext }> {
  try {
    // Extract token
    const token = extractAdminToken(request);
    if (!token) {
      return {
        success: false,
        response: NextResponse.json(
          { success: false, error: 'Admin authentication required' },
          { status: 401 }
        ),
      };
    }

    // Verify token
    const payload = verifyAdminToken(token);
    if (!payload) {
      return {
        success: false,
        response: NextResponse.json(
          { success: false, error: 'Invalid authentication token' },
          { status: 401 }
        ),
      };
    }

    // Validate session
    const isValidSession = await validateAdminSession(payload.sessionId, payload.userId);
    if (!isValidSession) {
      return {
        success: false,
        response: NextResponse.json(
          { success: false, error: 'Session expired or invalid' },
          { status: 401 }
        ),
      };
    }

    // Get user context
    const user = await getAdminUserContext(payload.userId);
    if (!user) {
      return {
        success: false,
        response: NextResponse.json(
          { success: false, error: 'Admin access denied' },
          { status: 403 }
        ),
      };
    }

    // Check specific permission if required
    if (requiredPermission && !hasPermission(user.permissions, requiredPermission)) {
      return {
        success: false,
        response: NextResponse.json(
          { success: false, error: `Permission denied: ${requiredPermission}` },
          { status: 403 }
        ),
      };
    }

    // Return authenticated context
    return {
      success: true,
      context: {
        userId: payload.userId,
        sessionId: payload.sessionId,
        role: payload.role,
        permissions: payload.permissions,
        user,
      },
    };
  } catch (error) {
    console.error('Admin authentication error:', error);
    return {
      success: false,
      response: NextResponse.json(
        { success: false, error: 'Authentication error' },
        { status: 500 }
      ),
    };
  }
}

/**
 * Helper function to create admin authentication wrapper for API routes
 */
export function createAdminRoute<T = any>(
  handler: (request: NextRequest, context: AdminAuthContext, params?: any) => Promise<NextResponse>,
  requiredPermission?: string
) {
  return async (request: NextRequest, params?: T) => {
    const authResult = await withAdminAuth(request, requiredPermission);
    
    if (!authResult.success) {
      return authResult.response;
    }

    return handler(request, authResult.context, params);
  };
}

/**
 * Logout admin session
 */
export async function logoutAdminSession(sessionId: string): Promise<boolean> {
  try {
    await db
      .update(adminSessions)
      .set({ 
        isActive: false,
        updatedAt: new Date()
      })
      .where(eq(adminSessions.id, sessionId));
    
    return true;
  } catch (error) {
    console.error('Failed to logout admin session:', error);
    return false;
  }
}

/**
 * Cleanup expired sessions
 */
export async function cleanupExpiredSessions(): Promise<number> {
  try {
    const now = new Date();
    const result = await db
      .update(adminSessions)
      .set({ isActive: false })
      .where(
        and(
          eq(adminSessions.isActive, true),
          // TODO: Fix this when Drizzle supports proper date comparison
          // lt(adminSessions.expiresAt, now)
        )
      );
    
    return Array.isArray(result) ? result.length : 0;
  } catch (error) {
    console.error('Failed to cleanup expired sessions:', error);
    return 0;
  }
}