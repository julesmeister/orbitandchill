/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

interface SEOSettings {
  // Global Meta Settings
  siteName: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultKeywords: string[];
  defaultOGImage: string;
  twitterHandle: string;
  facebookAppId: string;
  
  // Schema.org Settings
  organizationType: string;
  organizationName: string;
  organizationLogo: string;
  organizationAddress: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  organizationPhone: string;
  organizationEmail: string;
  
  // Technical SEO
  canonicalBaseURL: string;
  robotsTxt: string;
  sitemapSettings: {
    enabled: boolean;
    priority: number;
    changefreq: string;
    includePosts: boolean;
    includeGuides: boolean;
    includeUserPages: boolean;
  };
  
  // Analytics
  googleAnalyticsId: string;
  googleTagManagerId: string;
  googleSearchConsoleId: string;
  bingWebmasterToolsId: string;
  
  // Page-specific SEO
  pageSettings: {
    [key: string]: {
      title: string;
      description: string;
      keywords: string[];
      ogImage: string;
      noindex: boolean;
      nofollow: boolean;
    };
  };
}

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

const withDirectConnection = async <T>(
  operation: (client: any) => Promise<T>
): Promise<T> => {
  const client = await createDirectConnection();
  return await operation(client);
};

export async function GET(request: NextRequest) {
  try {
    const result = await withDirectConnection(async (client) => {
      // Fetch existing settings (table should exist via migration)
      const settingsResult = await client.execute({
        sql: 'SELECT settings_data FROM seo_settings WHERE id = ?',
        args: ['default']
      });

      if (settingsResult.rows.length > 0) {
        const row = settingsResult.rows[0] as any;
        return JSON.parse(row.settings_data);
      }

      return null;
    });

    return NextResponse.json({
      success: true,
      settings: result
    });

  } catch (error) {
    console.error('[SEO Settings API] Error loading settings:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load SEO settings',
      settings: null
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const seoSettings: SEOSettings = await request.json();

    // Validate required fields
    if (!seoSettings.siteName || !seoSettings.defaultTitle) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: siteName and defaultTitle are required'
      }, { status: 400 });
    }

    const result = await withDirectConnection(async (client) => {
      const now = new Date().toISOString();
      const settingsJson = JSON.stringify(seoSettings);

      // Check if default settings exist (table should exist via migration)
      const existingResult = await client.execute({
        sql: 'SELECT id FROM seo_settings WHERE id = ?',
        args: ['default']
      });

      if (existingResult.rows.length > 0) {
        // Update existing settings
        await client.execute({
          sql: 'UPDATE seo_settings SET settings_data = ?, updated_at = ? WHERE id = ?',
          args: [settingsJson, now, 'default']
        });
      } else {
        // Insert new settings (fallback if migration didn't run)
        await client.execute({
          sql: 'INSERT INTO seo_settings (id, settings_data, created_at, updated_at) VALUES (?, ?, ?, ?)',
          args: ['default', settingsJson, now, now]
        });
      }

      return { success: true };
    });

    return NextResponse.json({
      success: true,
      message: 'SEO settings saved successfully',
      meta: { 
        timestamp: new Date().toISOString(),
        pagesCount: Object.keys(seoSettings.pageSettings).length
      }
    });

  } catch (error) {
    console.error('[SEO Settings API] Error saving settings:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save SEO settings'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await withDirectConnection(async (client) => {
      // Reset to default settings by deleting the record
      await client.execute({
        sql: 'DELETE FROM seo_settings WHERE id = ?',
        args: ['default']
      });
    });

    return NextResponse.json({
      success: true,
      message: 'SEO settings reset to defaults'
    });

  } catch (error) {
    console.error('[SEO Settings API] Error resetting settings:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reset SEO settings'
    }, { status: 500 });
  }
}