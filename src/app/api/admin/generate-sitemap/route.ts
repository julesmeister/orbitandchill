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

    let baseUrl = 'https://orbitandchill.com';
    let sitemapSettings = {
      enabled: true,
      priority: 0.8,
      changefreq: 'weekly',
      includePosts: true,
      includeGuides: true,
      includeUserPages: false
    };

    if (result.rows.length > 0) {
      const settings = JSON.parse(result.rows[0].settings_data as string);
      baseUrl = settings.canonicalBaseURL || baseUrl;
      sitemapSettings = { ...sitemapSettings, ...settings.sitemapSettings };
    }

    if (!sitemapSettings.enabled) {
      return NextResponse.json({
        success: false,
        error: 'Sitemap generation is disabled in settings'
      }, { status: 400 });
    }

    // Generate sitemap XML
    const currentDate = new Date().toISOString().split('T')[0];
    
    let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${sitemapSettings.changefreq}</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/chart</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${sitemapSettings.changefreq}</changefreq>
    <priority>${sitemapSettings.priority}</priority>
  </url>
  <url>
    <loc>${baseUrl}/astrocartography</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${sitemapSettings.changefreq}</changefreq>
    <priority>${sitemapSettings.priority}</priority>
  </url>
  <url>
    <loc>${baseUrl}/discussions</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;

    // Add guides if enabled
    if (sitemapSettings.includeGuides) {
      sitemapXml += `
  <url>
    <loc>${baseUrl}/guides</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${sitemapSettings.changefreq}</changefreq>
    <priority>${sitemapSettings.priority}</priority>
  </url>`;
    }

    // Add blog posts if enabled
    if (sitemapSettings.includePosts) {
      sitemapXml += `
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;

      // You could fetch actual blog posts from database here
      // const posts = await client.execute('SELECT slug, updated_at FROM posts WHERE published = true');
      // for (const post of posts.rows) {
      //   sitemapXml += `
      //   <url>
      //     <loc>${baseUrl}/blog/${post.slug}</loc>
      //     <lastmod>${post.updated_at}</lastmod>
      //     <changefreq>monthly</changefreq>
      //     <priority>0.7</priority>
      //   </url>`;
      // }
    }

    // Add individual discussions if enabled
    try {
      const discussions = await client.execute('SELECT id, updated_at FROM discussions WHERE is_published = true LIMIT 50');
      for (const discussion of discussions.rows) {
        sitemapXml += `
  <url>
    <loc>${baseUrl}/discussions/${discussion.id}</loc>
    <lastmod>${discussion.updated_at}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.6</priority>
  </url>`;
      }
    } catch (error) {
      console.warn('Could not fetch discussions for sitemap:', error);
    }

    sitemapXml += `
</urlset>`;

    // Write sitemap.xml to public directory
    const publicPath = join(process.cwd(), 'public', 'sitemap.xml');
    writeFileSync(publicPath, sitemapXml, 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'sitemap.xml generated successfully',
      path: '/sitemap.xml',
      urlCount: (sitemapXml.match(/<url>/g) || []).length
    });

  } catch (error) {
    console.error('[Generate Sitemap] Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate sitemap'
    }, { status: 500 });
  }
}