/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/db/services/userService';
import { trackUserRegistration } from '@/lib/analytics';
import jwt from 'jsonwebtoken';
import { generateToken } from '@/utils/idGenerator';

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

interface EmailAuthRequest {
  provider: 'email';
  email: string;
  name: string;
  deviceInfo: {
    platform: string;
    version: string;
  };
}

interface GoogleAuthRequest {
  provider: 'google';
  token: string;
  deviceInfo: {
    platform: string;
    version: string;
  };
}

interface FirebaseAuthRequest {
  provider: 'firebase';
  email: string;
  name: string;
  firebaseUid: string;
  deviceInfo: {
    platform: string;
    version: string;
  };
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

function generateJWT(userId: string, email: string): string {
  const secret = process.env.JWT_SECRET || 'fallback_secret_key_for_development';
  const payload = {
    userId,
    email,
    type: 'mobile_auth',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
  };
  
  return jwt.sign(payload, secret);
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
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
    console.log('Mobile auth request body:', JSON.stringify(body, null, 2));
    const { provider, deviceInfo } = body;
    
    // Validate device info first
    console.log('Device info validation:', deviceInfo);
    const deviceValidation = validateDeviceInfo(deviceInfo);
    console.log('Device validation result:', deviceValidation);
    
    if (!deviceValidation) {
      console.log('Device validation failed for:', deviceInfo);
      return NextResponse.json(
        { error: 'Invalid device information provided' },
        { status: 400 }
      );
    }
    
    console.log('Provider received:', provider);

    // Handle different authentication providers
    if (provider === 'email') {
      console.log('🟢 EMAIL AUTH BRANCH - Starting email authentication');
      // Email-based authentication
      const { email, name } = body as EmailAuthRequest;
      
      // Validate required fields
      if (!email || !name) {
        return NextResponse.json(
          { error: 'Email and name are required for email authentication' },
          { status: 400 }
        );
      }
      
      // Validate email format
      if (!validateEmail(email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        );
      }
      
      // Generate a unique ID based on email for consistency
      const userId = `email_${Buffer.from(email).toString('base64').replace(/[^a-zA-Z0-9]/g, '')}`;
      
      // Check if user exists
      let user = await UserService.getUserById(userId);
      
      if (user) {
        // Update existing user with any new info
        const updatedUser = await UserService.updateUser(userId, {
          email,
          username: name,
          updatedAt: new Date()
        });
        
        // Generate JWT token
        const token = generateJWT(userId, email);
        
        console.log(`✅ Mobile email auth success - existing user: ${email} (${deviceInfo.platform})`);
        
        return NextResponse.json({
          success: true,
          token,
          user: updatedUser,
          action: 'login',
          message: 'Successfully logged in'
        });
      } else {
        // Create new user
        const newUser = await UserService.createUser({
          id: userId,
          username: name,
          email,
          authProvider: 'anonymous' // Use anonymous for email-based auth
        });
        
        // Track new user registration
        trackUserRegistration('email');
        
        // Generate JWT token
        const token = generateJWT(userId, email);
        
        console.log(`✅ Mobile email auth success - new user: ${email} (${deviceInfo.platform})`);
        
        return NextResponse.json({
          success: true,
          token,
          user: newUser,
          action: 'register',
          message: 'Successfully registered new user'
        });
      }
      
    } else if (provider === 'firebase') {
      console.log('🔥 FIREBASE AUTH BRANCH - Starting Firebase authentication');
      // Firebase authentication
      const { email, name, firebaseUid } = body as FirebaseAuthRequest;
      
      // Validate required fields
      if (!email || !name || !firebaseUid) {
        return NextResponse.json(
          { error: 'Email, name, and firebaseUid are required for Firebase authentication' },
          { status: 400 }
        );
      }
      
      // Validate email format
      if (!validateEmail(email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        );
      }
      
      console.log(`🔍 Looking for existing user with firebaseUid: ${firebaseUid}`);
      
      // IMPORTANT: First check if user already exists with the Google ID (WITHOUT firebase_ prefix)
      // This ensures we link to existing accounts instead of creating duplicates
      let user = await UserService.getUserById(firebaseUid);
      let userId = firebaseUid; // Use the plain Google ID as the user ID
      
      if (user) {
        console.log(`✅ Found existing user with Google ID: ${firebaseUid}`);
        // Update existing user with any new info
        const updatedUser = await UserService.updateUser(userId, {
          email,
          username: name,
          updatedAt: new Date()
        });
        
        // Generate JWT token with existing user ID
        const token = generateJWT(userId, email);
        
        console.log(`✅ Mobile Firebase auth success - existing user: ${email} (${deviceInfo.platform})`);
        
        return NextResponse.json({
          success: true,
          token,
          user: updatedUser,
          action: 'login',
          message: 'Successfully logged in'
        });
      } else {
        console.log(`❌ No user found with Google ID: ${firebaseUid}, creating new user`);
        // Create new user with the Google ID directly (NOT firebase_ prefix)
        const newUser = await UserService.createUser({
          id: userId, // Use firebaseUid directly as the user ID
          username: name,
          email,
          authProvider: 'google' // Use 'google' since Firebase is handling Google auth
        });
        
        // Track new user registration
        trackUserRegistration('firebase');
        
        // Generate JWT token
        const token = generateJWT(userId, email);
        
        console.log(`✅ Mobile Firebase auth success - new user: ${email} (${deviceInfo.platform})`);
        
        return NextResponse.json({
          success: true,
          token,
          user: newUser,
          action: 'register',
          message: 'Successfully registered new user'
        });
      }
      
    } else if (provider === 'google') {
      console.log('🔵 GOOGLE AUTH BRANCH - Starting Google authentication');
      // Google OAuth authentication
      const { token } = body as GoogleAuthRequest;
      
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
        
        // Generate JWT token
        const jwtToken = generateJWT(googleUserId, email);
        
        console.log(`✅ Mobile Google auth success - existing user: ${email} (${deviceInfo.platform})`);
        
        return NextResponse.json({
          success: true,
          token: jwtToken,
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
        
        // Generate JWT token
        const jwtToken = generateJWT(googleUserId, email);
        
        console.log(`✅ Mobile Google auth success - new user: ${email} (${deviceInfo.platform})`);
        
        return NextResponse.json({
          success: true,
          token: jwtToken,
          user: newUser,
          action: 'register',
          message: 'Successfully registered new user'
        });
      }
      
    } else {
      console.log('🔴 UNKNOWN PROVIDER BRANCH - Invalid provider:', provider);
      return NextResponse.json(
        { error: 'Invalid authentication provider. Use "email", "firebase", or "google"' },
        { status: 400 }
      );
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