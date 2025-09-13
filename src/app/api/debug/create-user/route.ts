import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

// Initialize Turso client
const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function POST(request: NextRequest) {
  try {
    const { userId, username } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await client.execute({
      sql: 'SELECT id FROM users WHERE id = ?',
      args: [userId]
    });

    if (existingUser.rows.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'User already exists',
        user: existingUser.rows[0]
      });
    }

    // Generate appropriate username
    const finalUsername = username || (userId.startsWith('anon_') ? 'Anonymous User' : userId);
    
    // Determine auth provider
    const authProvider = userId.startsWith('anon_') ? 'anonymous' : 'google';

    // Create the user
    const result = await client.execute({
      sql: `INSERT INTO users (
        id, username, auth_provider, subscription_tier, role, 
        is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        userId,
        finalUsername,
        authProvider,
        'free',                    // subscription_tier 
        'user',                    // role
        1,                         // is_active (true)
        Date.now(),               // created_at
        Date.now()                // updated_at
      ]
    });

    // Verify creation
    const newUser = await client.execute({
      sql: 'SELECT * FROM users WHERE id = ?',
      args: [userId]
    });

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: newUser.rows[0],
      rowsAffected: result.rowsAffected
    });

  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}