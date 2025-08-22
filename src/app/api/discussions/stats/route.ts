/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '@/db/index';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { db } = await initializeDatabase();
    
    if (!db) {
      return NextResponse.json({
        success: false,
        error: 'Database unavailable',
        categoryCounts: {}
      }, { status: 503 });
    }

    // Get counts for each category
    const { discussions } = await import('@/db/schema');
    
    // Since Turso HTTP client doesn't support groupBy, we'll fetch all discussions and count in JavaScript
    const allDiscussions = await db
      .select({
        category: discussions.category,
        isPublished: discussions.isPublished,
        isBlogPost: discussions.isBlogPost
      })
      .from(discussions);

    // Filter for published, non-blog discussions and count by category
    const categoryCounts: Record<string, number> = {};
    let totalCount = 0;
    
    allDiscussions.forEach((discussion: any) => {
      // Check if discussion is published and not a blog post
      // Note: With Turso HTTP client, boolean values might come as 1/0 or true/false
      const isPublished = discussion.isPublished === 1 || discussion.isPublished === true;
      const isBlogPost = discussion.isBlogPost === 1 || discussion.isBlogPost === true;
      
      // Skip if not published or is a blog post
      if (!isPublished || isBlogPost) {
        return;
      }
      
      const category = discussion.category || 'General Discussion';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      totalCount++;
    });

    // Add total count
    categoryCounts['All Categories'] = totalCount;

    console.log('📊 Category counts calculated:', categoryCounts);

    return NextResponse.json({
      success: true,
      categoryCounts,
      totalCount
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, s-maxage=120', // Cache for 1 min browser, 2 min CDN
      }
    });

  } catch (error) {
    console.error('API Error in /api/discussions/stats:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch discussion statistics',
      categoryCounts: {}
    }, { status: 500 });
  }
}