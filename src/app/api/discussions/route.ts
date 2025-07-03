/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { DiscussionService } from '@/db/services/discussionService';
import { AnalyticsService } from '@/db/services/analyticsService';
import { initializeDatabase } from '@/db/index';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Try to use database first
    try {
      const { db } = await initializeDatabase();
      const searchParams = request.nextUrl.searchParams;
      const category = searchParams.get('category') || undefined;
      const sortBy = searchParams.get('sortBy') as 'recent' | 'popular' | 'replies' | 'views' || 'recent';
      const limit = parseInt(searchParams.get('limit') || '20');
      const isBlogPostParam = searchParams.get('isBlogPost');
      const isBlogPost = isBlogPostParam === 'true' ? true : (isBlogPostParam === 'false' ? false : undefined);
      const drafts = searchParams.get('drafts') === 'true';
      const userId = searchParams.get('userId') || undefined;
      
      // Determine publication status: drafts=true shows unpublished, otherwise show published
      const isPublished = !drafts;

      // Fetch discussions from database with increased timeout
      console.log('🔍 Fetching discussions with params:', { category, isBlogPost, isPublished, drafts, userId, limit, sortBy });
      
      const discussions = await Promise.race([
        DiscussionService.getAllDiscussions({
          category: category && category !== 'All Categories' ? category : undefined,
          isBlogPost,
          isPublished,
          authorId: drafts ? userId : undefined, // Only filter by user for drafts
          currentUserId: userId, // Pass userId to get vote data (but now skipped for performance)
          limit,
          sortBy
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database query timeout')), 10000)
        )
      ]) as any[];
      
      console.log('✅ Successfully fetched', discussions.length, 'discussions');

      // Filter discussions received from database
      
      // Enhance with author information and preferred avatar
      const enhancedDiscussions = await Promise.all(discussions.map(async (discussion: any) => {
        let authorName = discussion.authorName || null;
        
        // If no authorName but we have authorId, try to fetch from users table
        let preferredAvatar = null;
        if (discussion.authorId) {
          try {
            const { users } = await import('@/db/index');
            const userResult = await db?.select({ 
              username: users.username, 
              preferredAvatar: users.preferredAvatar 
            })
              .from(users)
              .where(eq(users.id, discussion.authorId))
              .limit(1);
            
            if (userResult?.[0]) {
              // Use the username from users table if authorName is missing
              authorName = authorName || userResult[0].username || 'Anonymous User';
              preferredAvatar = userResult[0].preferredAvatar || null;
            }
          } catch (error) {
            console.warn('Failed to fetch user data for', discussion.authorId, error);
          }
        }
        
        // Final fallback
        authorName = authorName || 'Anonymous User';
        
        return {
          ...discussion,
          author: authorName,
          authorName: authorName, // Ensure authorName is set for admin compatibility
          avatar: authorName.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
          preferredAvatar: preferredAvatar,
        };
      }));

      // PERFORMANCE: Skip analytics to prevent connection pool exhaustion
      // Analytics should be handled in a separate background process

      // Generate cache key based on parameters
      const cacheKey = `discussions-${category || 'all'}-${sortBy}-${isBlogPost}-${drafts}-${limit}`;
      const lastModified = enhancedDiscussions.length > 0 ? 
        new Date(Math.max(...enhancedDiscussions.map((d: any) => new Date(d.updatedAt).getTime()))).toUTCString() :
        new Date().toUTCString();

      return NextResponse.json({
        success: true,
        discussions: enhancedDiscussions,
        count: enhancedDiscussions.length
      }, {
        headers: {
          'Content-Type': 'application/json',
          // PERFORMANCE: Add caching headers
          'Cache-Control': drafts ? 'private, no-cache' : 'public, max-age=300, s-maxage=600', // 5min browser, 10min CDN (no cache for drafts)
          'ETag': `"${cacheKey}-${enhancedDiscussions.length}"`,
          'Last-Modified': lastModified,
          'Vary': 'Accept-Encoding'
        }
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // Return empty if database fails
      return NextResponse.json({
        success: false,
        discussions: [],
        count: 0,
        error: 'Database temporarily unavailable'
      }, {
        status: 503,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

  } catch (error) {
    console.error('API Error:', error);
    
    // Ensure we always return valid JSON, never HTML
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        discussions: [],
        count: 0
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}