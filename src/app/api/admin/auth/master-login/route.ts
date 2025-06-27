/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { generateAdminToken, type AdminTokenPayload } from '@/middleware/adminAuth';
import { initializeDatabase } from '@/db/index';

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const { userId, email } = await request.json();
    
    // Verify this is for the master admin
    const MASTER_ADMIN_EMAIL = 'orbitandchill@gmail.com';
    
    if (email !== MASTER_ADMIN_EMAIL) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 403 });
    }
    
    console.log('🔑 Generating JWT token for master admin:', email);
    
    // Generate a proper JWT token for master admin
    // We'll use a special session ID for master admin that doesn't require database validation
    const tokenPayload: Omit<AdminTokenPayload, 'iat' | 'exp'> = {
      userId: userId,
      sessionId: `master_session_${userId}`,
      role: 'master_admin',
      permissions: ['all']
    };
    
    const token = generateAdminToken(tokenPayload);
    
    console.log('✅ Master admin JWT token generated successfully');
    
    return NextResponse.json({
      success: true,
      token: token,
      user: {
        id: userId,
        email: email,
        role: 'master_admin',
        permissions: ['all']
      }
    });
    
  } catch (error) {
    console.error('❌ Master admin login error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate master admin token'
    }, { status: 500 });
  }
}