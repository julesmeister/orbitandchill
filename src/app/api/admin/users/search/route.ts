/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '@/db/index';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    const { client } = await initializeDatabase();
    if (!client) {
      return NextResponse.json({ users: [] });
    }

    // Search users by username (for autocomplete)
    const results = await client.execute({
      sql: `
        SELECT id, username, email, profile_picture_url, preferred_avatar, auth_provider
        FROM users 
        WHERE username LIKE ? 
        AND is_deleted = 0 
        ORDER BY username ASC 
        LIMIT ?
      `,
      args: [`%${query}%`, limit]
    });

    const users = results.rows.map((row: any) => ({
      id: row.id,
      username: row.username,
      email: row.email,
      profilePictureUrl: row.profile_picture_url,
      preferredAvatar: row.preferred_avatar,
      authProvider: row.auth_provider
    }));

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json({ users: [] });
  }
}