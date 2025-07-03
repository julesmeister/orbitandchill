/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { DiscussionService } from '@/db/services/discussionService';
import { AnalyticsService } from '@/db/services/analyticsService';
import { initializeDatabase } from '@/db/index';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const discussionId = resolvedParams.id;

    if (!discussionId) {
      return NextResponse.json(
        { success: false, error: 'Discussion ID is required' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Try to use database first
    try {
      await initializeDatabase();
      
      // Fetch discussion from database
      const discussion = await DiscussionService.getDiscussionById(discussionId);
      
      if (!discussion) {
        return NextResponse.json(
          { success: false, error: 'Discussion not found' },
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // PERFORMANCE: Async non-blocking analytics with faster Promise.allSettled
      const today = new Date().toISOString().split('T')[0];
      
      // Fire-and-forget analytics (no await)
      Promise.allSettled([
        DiscussionService.incrementViews(discussionId),
        AnalyticsService.incrementDailyCounter('pageViews', today),
        AnalyticsService.incrementEngagementCounter('activeUsers', today),
        AnalyticsService.recordEngagementData({
          date: today,
          popularDiscussions: [{
            id: discussionId,
            title: discussion.title,
            engagement: (discussion.upvotes || 0) + (discussion.replies || 0) + (discussion.views || 0)
          }]
        })
      ]).catch(err => console.warn('Analytics tracking failed:', err));

      // Use stored author name
      const authorName = discussion.authorName || 'Anonymous User';
      
      const enhancedDiscussion = {
        ...discussion,
        author: authorName,
        avatar: authorName.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
      };

      return NextResponse.json({
        success: true,
        discussion: enhancedDiscussion
      }, {
        headers: {
          'Content-Type': 'application/json',
          // PERFORMANCE: Optimized caching strategy
          'Cache-Control': 'public, max-age=300, s-maxage=900, stale-while-revalidate=3600', // 5min browser, 15min CDN, 1hr stale
          'ETag': `"discussion-${discussionId}-${Math.floor(Date.now() / 300000)}"`, // ETag changes every 5 minutes
          'Last-Modified': new Date(discussion.updatedAt).toUTCString(),
          'Vary': 'Accept-Encoding',
          // PERFORMANCE: Preload hints for related resources
          'Link': '</api/discussions/' + discussionId + '/replies>; rel=prefetch'
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const discussionId = resolvedParams.id;

    if (!discussionId) {
      return NextResponse.json(
        { success: false, error: 'Discussion ID is required' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { db } = await initializeDatabase();
    
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const updates = await request.json();
    
    console.log('🔍 PATCH API received updates:', updates);
    console.log('🔍 Author name in updates:', updates.authorName);
    
    // Update the discussion
    const updatedDiscussion = await DiscussionService.updateDiscussion(discussionId, updates, db);
    
    console.log('🔍 Updated discussion result:', updatedDiscussion ? 'success' : 'failed');
    console.log('🔍 Updated author name:', updatedDiscussion?.authorName);
    
    if (!updatedDiscussion) {
      return NextResponse.json(
        { success: false, error: 'Discussion not found' },
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return NextResponse.json({
      success: true,
      discussion: updatedDiscussion
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const discussionId = resolvedParams.id;

    if (!discussionId) {
      return NextResponse.json(
        { success: false, error: 'Discussion ID is required' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { db } = await initializeDatabase();
    
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const success = await DiscussionService.deleteDiscussion(discussionId, db);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Discussion not found' },
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Discussion deleted successfully'
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting discussion:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}