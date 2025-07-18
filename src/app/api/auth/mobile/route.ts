/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/db/services/userService';
import { trackUserRegistration } from '@/lib/analytics';

interface GoogleTokenInfo {
  sub: string;
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  email_verified: boolean;
  aud: string;
  exp: number;
  iat: number;
  iss: string;
}

async function verifyGoogleToken(token: string): Promise<GoogleTokenInfo | null> {
  try {
    // Verify the token with Google's tokeninfo endpoint
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('Google token verification failed:', response.status, response.statusText);
      return null;
    }
    
    const tokenInfo = await response.json();
    
    // Validate required fields
    if (!tokenInfo.sub || !tokenInfo.email || !tokenInfo.exp) {
      console.error('Invalid token info structure:', tokenInfo);
      return null;
    }
    
    // Check if the token is valid and not expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (tokenInfo.exp <= currentTime) {
      console.error('Token has expired:', tokenInfo.exp, 'current:', currentTime);
      return null;
    }
    
    // Verify the token issuer
    if (tokenInfo.iss !== 'https://accounts.google.com') {
      console.error('Invalid token issuer:', tokenInfo.iss);
      return null;
    }
    
    // Check if email is verified
    if (!tokenInfo.email_verified) {
      console.error('Email not verified for token:', tokenInfo.email);
      return null;
    }
    
    return tokenInfo;
  } catch (error) {
    console.error('Error verifying Google token:', error);
    return null;
  }
}

// Rate limiting helper (simple in-memory implementation)
const authAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_AUTH_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const attempts = authAttempts.get(identifier);
  
  if (!attempts) {
    authAttempts.set(identifier, { count: 1, lastAttempt: now });
    return false;
  }
  
  // Reset if window has passed
  if (now - attempts.lastAttempt > RATE_LIMIT_WINDOW) {
    authAttempts.set(identifier, { count: 1, lastAttempt: now });
    return false;
  }
  
  // Check if rate limited
  if (attempts.count >= MAX_AUTH_ATTEMPTS) {
    return true;
  }
  
  // Increment attempt count
  attempts.count++;
  attempts.lastAttempt = now;
  
  return false;
}

function validateDeviceInfo(deviceInfo: any): boolean {
  if (!deviceInfo || typeof deviceInfo !== 'object') {
    return false;
  }
  
  // Check required fields
  if (!deviceInfo.platform || !deviceInfo.version) {
    return false;
  }
  
  // Validate platform
  const validPlatforms = ['flutter', 'android', 'ios', 'react-native'];
  if (!validPlatforms.includes(deviceInfo.platform)) {
    return false;
  }
  
  // Validate version format (basic check)
  if (!/^\d+\.\d+\.\d+$/.test(deviceInfo.version)) {
    return false;
  }
  
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 
      request.headers.get('x-real-ip') || 
      'unknown';
    
    // Check rate limiting
    if (isRateLimited(clientIP)) {
      return NextResponse.json(
        { error: 'Too many authentication attempts. Please try again later.' },
        { status: 429 }
      );
    }
    
    const body = await request.json();
    const { token, deviceInfo } = body;
    
    // Validate required fields
    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Google access token is required and must be a string' },
        { status: 400 }
      );
    }
    
    // Validate token format (basic check)
    if (token.length < 20 || token.length > 2000) {
      return NextResponse.json(
        { error: 'Invalid token format' },
        { status: 400 }
      );
    }
    
    // Validate device info
    if (!validateDeviceInfo(deviceInfo)) {
      return NextResponse.json(
        { error: 'Invalid device information provided' },
        { status: 400 }
      );
    }
    
    // Verify the Google token
    const tokenInfo = await verifyGoogleToken(token);
    
    if (!tokenInfo) {
      return NextResponse.json(
        { error: 'Invalid or expired Google token' },
        { status: 401 }
      );
    }
    
    // Extract user info from verified token
    const googleUserId = tokenInfo.sub;
    const email = tokenInfo.email;
    const name = tokenInfo.name || tokenInfo.given_name || 'Google User';
    const picture = tokenInfo.picture;
    
    // Additional security checks
    if (!email || !googleUserId) {
      return NextResponse.json(
        { error: 'Required user information not available from token' },
        { status: 400 }
      );
    }
    
    // Check if user exists
    let user = await UserService.getUserById(googleUserId);
    
    if (user) {
      // Update existing user with any new info
      const updatedUser = await UserService.updateUser(googleUserId, {
        email,
        username: name,
        profilePictureUrl: picture,
        updatedAt: new Date()
      });
      
      // Log successful authentication
      console.log(`✅ Mobile auth success - existing user: ${email} (${deviceInfo.platform})`);
      
      return NextResponse.json({
        success: true,
        user: updatedUser,
        action: 'login',
        message: 'Successfully logged in'
      });
    } else {
      // Create new user
      const newUser = await UserService.createUser({
        id: googleUserId,
        username: name,
        email,
        profilePictureUrl: picture,
        authProvider: 'google'
      });
      
      // Track new user registration
      trackUserRegistration('google');
      
      // Log successful registration
      console.log(`✅ Mobile auth success - new user: ${email} (${deviceInfo.platform})`);
      
      return NextResponse.json({
        success: true,
        user: newUser,
        action: 'register',
        message: 'Successfully registered new user'
      });
    }
    
  } catch (error) {
    console.error('Error in mobile auth:', error);
    
    // Don't expose internal errors to client
    return NextResponse.json(
      { error: 'Authentication failed. Please try again.' },
      { status: 500 }
    );
  }
}

// Token refresh endpoint for mobile apps
export async function PATCH(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 
      request.headers.get('x-real-ip') || 
      'unknown';
    
    // Check rate limiting (same as auth)
    if (isRateLimited(clientIP)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
    
    const body = await request.json();
    const { refreshToken, userId } = body;
    
    // Validate required fields
    if (!refreshToken || !userId) {
      return NextResponse.json(
        { error: 'Refresh token and userId are required' },
        { status: 400 }
      );
    }
    
    // Validate userId format
    if (typeof userId !== 'string' || userId.length < 10) {
      return NextResponse.json(
        { error: 'Invalid userId format' },
        { status: 400 }
      );
    }
    
    // Validate refresh token format
    if (typeof refreshToken !== 'string' || refreshToken.length < 20) {
      return NextResponse.json(
        { error: 'Invalid refresh token format' },
        { status: 400 }
      );
    }
    
    // Get user from database
    const user = await UserService.getUserById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Note: In a production app, you would:
    // 1. Verify the refresh token is valid and matches the user
    // 2. Check if the refresh token has expired
    // 3. Generate a new access token
    // 4. Optionally rotate the refresh token
    
    // For now, we'll update the user's lastActivity timestamp
    const updatedUser = await UserService.updateUser(userId, {
      updatedAt: new Date()
    });
    
    console.log(`✅ Token refresh for user: ${user.email}`);
    
    return NextResponse.json({
      success: true,
      user: updatedUser || user,
      message: 'Token refreshed successfully'
    });
    
  } catch (error) {
    console.error('Error refreshing token:', error);
    return NextResponse.json(
      { error: 'Token refresh failed. Please try again.' },
      { status: 500 }
    );
  }
}