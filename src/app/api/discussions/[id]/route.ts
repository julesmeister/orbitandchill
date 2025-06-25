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

      // Increment view count
      await DiscussionService.incrementViews(discussionId);

      // Track analytics - discussion viewed
      try {
        const today = new Date().toISOString().split('T')[0];
        await AnalyticsService.incrementDailyCounter('pageViews', today);
        await AnalyticsService.incrementEngagementCounter('activeUsers', today);
        
        // Record this as a popular discussion
        await AnalyticsService.recordEngagementData({
          date: today,
          popularDiscussions: [{
            id: discussionId,
            title: discussion.title,
            engagement: (discussion.upvotes || 0) + (discussion.replies || 0) + (discussion.views || 0)
          }]
        });
      } catch (analyticsError) {
        console.warn('Failed to record analytics for discussion view:', analyticsError);
      }

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
        headers: { 'Content-Type': 'application/json' }
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
    
    // Update the discussion
    const updatedDiscussion = await DiscussionService.updateDiscussion(discussionId, updates, db);
    
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