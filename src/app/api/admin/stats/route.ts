/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '@/db/index';

export async function GET(request: NextRequest) {
  try {
    const { db } = await initializeDatabase();
    
    if (!db) {
      return NextResponse.json({
        success: false,
        error: 'Database unavailable',
        stats: {}
      }, { status: 503 });
    }

    // Get counts for admin dashboard
    const { discussions } = await import('@/db/schema');
    
    // Fetch all discussions to calculate different types of counts
    const allDiscussions = await db
      .select({
        isBlogPost: discussions.isBlogPost,
        isPublished: discussions.isPublished,
        category: discussions.category
      })
      .from(discussions);

    // Calculate different types of counts
    let blogPosts = 0;
    let forumThreads = 0;
    let published = 0;
    let drafts = 0;
    let total = 0;
    const categoryCounts: Record<string, number> = {};
    
    allDiscussions.forEach((discussion: any) => {
      const isPublishedValue = discussion.isPublished === 1 || discussion.isPublished === true;
      const isBlogPostValue = discussion.isBlogPost === 1 || discussion.isBlogPost === true;
      
      total++;
      
      if (isPublishedValue) {
        published++;
      } else {
        drafts++;
      }
      
      if (isBlogPostValue) {
        blogPosts++;
      } else {
        forumThreads++;
        
        // Only count forum threads (not blog posts) in category counts
        if (isPublishedValue) {
          const category = discussion.category || 'General Discussion';
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        }
      }
    });

    // Add total count for categories
    categoryCounts['All Categories'] = forumThreads;

    const stats = {
      blogPosts,
      forumThreads,
      published,
      drafts,
      total,
      categoryCounts
    };

    console.log('📊 Admin stats calculated:', stats);

    return NextResponse.json({
      success: true,
      stats
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=30, s-maxage=60', // Cache for 30 sec browser, 1 min CDN
      }
    });

  } catch (error) {
    console.error('API Error in /api/admin/stats:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch admin statistics',
      stats: {}
    }, { status: 500 });
  }
}