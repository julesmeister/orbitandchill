/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { DiscussionService } from '@/db/services/discussionService';
import { UserService } from '@/db/services/userService';
import { TagService } from '@/db/services/tagService';
import { CategoryService } from '@/db/services/categoryService';
import { AnalyticsService } from '@/db/services/analyticsService';
import { AdminAuditService } from '@/db/services/adminAuditService';
import { initializeDatabase } from '@/db/index';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    // Extract request context for audit logging
    const requestContext = AdminAuditService.extractRequestContext(request, Object.fromEntries(request.headers.entries()));
    
    const body = await request.json();
    const { title, slug, content, excerpt, category, tags, embeddedChart, embeddedVideo, isBlogPost, isPublished, isDraft, authorId } = body;

    try {
      const { db } = await initializeDatabase();
      
      // Check if database is available
      if (!db) {
        console.log('⚠️  Database not available, using fallback mode for discussion creation');
        
        // Use fallback creation pattern from protocol
        const now = new Date();
        const fallbackDiscussion = {
          id: nanoid(12),
          title,
          slug,
          content,
          excerpt: excerpt || content.substring(0, 150) + '...',
          authorId: authorId || `anon_${Date.now()}`,
          authorName: 'Anonymous User', // Use simple fallback name when DB unavailable
          author: 'Anonymous User',
          avatar: 'AU',
          category,
          tags: tags || [],
          replies: 0,
          views: 0,
          upvotes: 0,
          downvotes: 0,
          isLocked: false,
          isPinned: false,
          isBlogPost: isBlogPost || false,
          isPublished: isDraft ? false : (isPublished ?? true),
          createdAt: now,
          updatedAt: now,
          lastActivity: now
        };

        return NextResponse.json({
          success: true,
          discussion: fallbackDiscussion,
          message: isDraft ? 'Discussion saved as draft (offline mode)' : 'Discussion published successfully (offline mode)',
          fallbackMode: true,
          stored: 'local' // Indicates local-only storage
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
      
      // Database is available, proceed with normal creation
      
      // Get the actual user from the database using the provided authorId
      let user = null;
      if (authorId) {
        user = await UserService.getUserById(authorId);
      }
      
      // If no user found, create a fallback with creative name (for anonymous users)
      if (!user) {
        const adjectives = ["Cosmic", "Stellar", "Mystic", "Lunar", "Solar", "Astral", "Celestial"];
        const nouns = ["Seeker", "Wanderer", "Observer", "Dreamer", "Voyager", "Explorer", "Sage"];
        const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
        const randomNumber = Math.floor(Math.random() * 999) + 1;
        const creativeName = `${randomAdjective} ${randomNoun} ${randomNumber}`;
        
        user = {
          id: authorId || `anon_${Date.now()}`,
          username: creativeName
        };
      }
      
      console.log('🔍 Creating discussion with user:', user.username, user.id);

      // Create the discussion with tags directly stored in the discussions table
      const discussion = await DiscussionService.createDiscussion({
        title,
        slug,
        content,
        excerpt: excerpt || content.substring(0, 150) + '...',
        authorId: user.id,
        authorName: user.username, // Store the username at time of creation
        category,
        tags: tags || [], // Store tags directly in the discussions table
        embeddedChart,
        embeddedVideo,
        isBlogPost: isBlogPost || false,
        isPublished: isDraft ? false : (isPublished ?? true)
      });

      // Increment category discussion count
      await CategoryService.incrementDiscussionCount(category);

      // Log content creation for audit trail
      try {
        await AdminAuditService.logContentAction(
          user.username,
          'create',
          'discussion',
          discussion.id,
          `Created ${isBlogPost ? 'blog post' : 'discussion'}: "${title}" in category "${category}"`,
          {
            requestContext,
            afterValues: {
              title,
              category,
              tags,
              isBlogPost,
              isPublished: !isDraft,
              authorId: user.id,
              authorName: user.username
            }
          }
        );
      } catch (auditError) {
        console.warn('Failed to log content creation audit:', auditError);
      }

      // Track analytics - discussion created
      try {
        const today = new Date().toISOString().split('T')[0];
        await AnalyticsService.incrementEngagementCounter('discussionsCreated', today);
        await AnalyticsService.incrementEngagementCounter('activeUsers', today);
        
        // Record this as new content
        await AnalyticsService.recordEngagementData({
          date: today,
          popularDiscussions: [{
            id: discussion.id,
            title: discussion.title,
            engagement: 1 // New discussion starts with engagement of 1
          }]
        });
      } catch (analyticsError) {
        console.warn('Failed to record analytics for discussion creation:', analyticsError);
      }

      return NextResponse.json({
        success: true,
        discussion,
        message: isDraft ? 'Discussion saved as draft' : 'Discussion published successfully'
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (dbError) {
      console.error('Unexpected database operation error:', dbError);
      // Database was available but operation failed
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to create discussion',
          message: 'Database operation failed. Please try again.'
        },
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

  } catch (error) {
    console.error('Failed to create discussion:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create discussion',
        message: 'Please try again later'
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