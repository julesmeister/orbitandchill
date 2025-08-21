/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { DiscussionService } from '@/db/services/discussionService';
// AnalyticsService removed - using Google Analytics
import { initializeDatabase } from '@/db/index';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const discussionSlug = resolvedParams.slug;

    if (!discussionSlug) {
      return NextResponse.json(
        { success: false, error: 'Discussion slug is required' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Try to use database first
    try {
      await initializeDatabase();
      
      // Fetch discussion from database by slug or fallback to ID
      let discussion = await DiscussionService.getDiscussionBySlug(discussionSlug);
      
      // If not found by slug, try by ID (fallback for missing slugs)
      if (!discussion) {
        const discussionById = await DiscussionService.getDiscussionById(discussionSlug);
        if (discussionById) {
          // Add missing properties for type compatibility
          discussion = {
            ...discussionById,
            preferredAvatar: undefined,
            profilePictureUrl: undefined
          };
        }
      }
      
      if (!discussion) {
        return NextResponse.json(
          { success: false, error: 'Discussion not found' },
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // PERFORMANCE: Async non-blocking analytics with faster Promise.allSettled
      const today = new Date().toISOString().split('T')[0];
      
      // Fire-and-forget view increment (analytics tracked by Google Analytics)
      Promise.allSettled([
        DiscussionService.incrementViews(discussion.id),
        // Analytics tracking removed - handled by Google Analytics
      ]).catch(err => console.warn('View increment failed:', err));

      // Use stored author name
      const authorName = discussion.authorName || 'Anonymous User';
      
      const enhancedDiscussion = {
        ...discussion,
        author: authorName,
        avatar: authorName.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
        preferredAvatar: discussion.preferredAvatar,
        profilePictureUrl: discussion.profilePictureUrl,
      };

      return NextResponse.json({
        success: true,
        discussion: enhancedDiscussion
      }, {
        headers: {
          'Content-Type': 'application/json',
          // PERFORMANCE: Optimized caching strategy
          'Cache-Control': 'public, max-age=300, s-maxage=900, stale-while-revalidate=3600', // 5min browser, 15min CDN, 1hr stale
          'ETag': `"discussion-${discussionSlug}-${Math.floor(Date.now() / 300000)}"`, // ETag changes every 5 minutes
          'Last-Modified': new Date(discussion.updatedAt).toUTCString(),
          'Vary': 'Accept-Encoding',
          // PERFORMANCE: Preload hints for related resources
          'Link': '</api/discussions/' + discussion.id + '/replies>; rel=prefetch'
        }
      });

    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // Return error if database fails
      return NextResponse.json({
        success: false,
        error: 'Database temporarily unavailable',
        discussion: null
      }, {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('API Error:', error);
    
    // Ensure we always return valid JSON, never HTML
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        discussion: null
      },
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}