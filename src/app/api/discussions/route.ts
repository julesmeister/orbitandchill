/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { DiscussionService } from '@/db/services/discussionService';
import { AnalyticsService } from '@/db/services/analyticsService';
import { initializeDatabase } from '@/db/index';

export async function GET(request: NextRequest) {
  try {
    // Try to use database first
    try {
      await initializeDatabase();
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

      // Fetch discussions from database with timeout
      
      const discussions = await Promise.race([
        DiscussionService.getAllDiscussions({
          category: category && category !== 'All Categories' ? category : undefined,
          isBlogPost,
          isPublished,
          authorId: drafts ? userId : undefined, // Only filter by user for drafts
          limit,
          sortBy
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database query timeout')), 5000)
        )
      ]) as any[];

      // Filter discussions received from database
      
      // Enhance with author information (use stored authorName if available)
      const enhancedDiscussions = discussions.map((discussion: any) => {
        const authorName = discussion.authorName || 'Anonymous User';
        
        return {
          ...discussion,
          author: authorName,
          avatar: authorName.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
        };
      });

      // Track analytics - discussions API accessed
      try {
        const today = new Date().toISOString().split('T')[0];
        await AnalyticsService.incrementDailyCounter('pageViews', today);
        
        // Track popular discussions based on access
        if (enhancedDiscussions.length > 0) {
          const popularDiscussions = enhancedDiscussions.slice(0, 5).map((d: any) => ({
            id: d.id,
            title: d.title,
            engagement: d.upvotes + d.replies + d.views
          }));
          
          await AnalyticsService.recordEngagementData({
            date: today,
            popularDiscussions
          });
        }
      } catch (analyticsError) {
        console.warn('Failed to record analytics:', analyticsError);
      }

      return NextResponse.json({
        success: true,
        discussions: enhancedDiscussions,
        count: enhancedDiscussions.length
      }, {
        headers: {
          'Content-Type': 'application/json'
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