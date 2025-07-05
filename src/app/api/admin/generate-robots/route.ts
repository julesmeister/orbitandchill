/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync } from 'fs';
import { join } from 'path';

// Direct database connection following the protocol pattern
const createDirectConnection = async () => {
  const databaseUrl = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  
  if (!databaseUrl || !authToken) {
    throw new Error('Database environment variables not configured');
  }
  
  const { createClient } = await import('@libsql/client/http');
  return createClient({
    url: databaseUrl,
    authToken: authToken,
  });
};

export async function POST(request: NextRequest) {
  try {
    // Get SEO settings from database
    const client = await createDirectConnection();
    const result = await client.execute({
      sql: 'SELECT settings_data FROM seo_settings WHERE id = ?',
      args: ['default']
    });

    let robotsTxtContent = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /_next/

Sitemap: https://orbitandchill.com/sitemap.xml`;

    if (result.rows.length > 0) {
      const settings = JSON.parse(result.rows[0].settings_data as string);
      robotsTxtContent = settings.robotsTxt || robotsTxtContent;
    }

    // Write robots.txt to public directory
    const publicPath = join(process.cwd(), 'public', 'robots.txt');
    writeFileSync(publicPath, robotsTxtContent, 'utf-8');

    console.log('✅ robots.txt generated successfully');

    return NextResponse.json({
      success: true,
      message: 'robots.txt generated successfully',
      content: robotsTxtContent,
      path: '/robots.txt'
    });

  } catch (error) {
    console.error('[Generate Robots] Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate robots.txt'
    }, { status: 500 });
  }
}