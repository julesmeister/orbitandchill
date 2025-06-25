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
    console.log('📨 POST /api/discussions/create - Request received');
    
    // Extract request context for audit logging
    const requestContext = AdminAuditService.extractRequestContext(request, Object.fromEntries(request.headers.entries()));
    
    const body = await request.json();
    const { title, content, excerpt, category, tags, embeddedChart, embeddedVideo, isBlogPost, isPublished, isDraft, authorId } = body;
    
    console.log('📝 Creating discussion:', { title, category, tags, authorId });

    try {
      console.log('🔌 Initializing database...');
      await initializeDatabase();
      console.log('✅ Database initialized successfully');
      
      // Skip user creation for now and just generate a creative name
      const adjectives = ["Cosmic", "Stellar", "Mystic", "Lunar", "Solar", "Astral", "Celestial"];
      const nouns = ["Seeker", "Wanderer", "Observer", "Dreamer", "Voyager", "Explorer", "Sage"];
      const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
      const randomNumber = Math.floor(Math.random() * 999) + 1;
      const creativeName = `${randomAdjective} ${randomNoun} ${randomNumber}`;
      
      // Create a mock user object for discussion creation
      const user = {
        id: authorId || `anon_${Date.now()}`,
        username: creativeName
      };
      
      console.log('✅ Using creative name for discussion:', user.username);

      // Create the discussion (without tags initially)
      const discussion = await DiscussionService.createDiscussion({
        title,
        content,
        excerpt: excerpt || content.substring(0, 150) + '...',
        authorId: user.id,
        authorName: user.username, // Store the username at time of creation
        category,
        tags: [], // We'll handle tags separately now
        embeddedChart,
        embeddedVideo,
        isBlogPost: isBlogPost || false,
        isPublished: isDraft ? false : (isPublished ?? true)
      });

      // Add tags using the TagService
      if (tags && tags.length > 0) {
        await TagService.addTagsToDiscussion(discussion.id, tags);
      }

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
      console.error('Database error, using fallback creation:', dbError);
      
      // Fallback to mock creation if database fails
      const now = new Date();
      const discussion = {
        id: nanoid(12),
        title,
        content,
        excerpt: excerpt || content.substring(0, 150) + '...',
        authorId: 'anon_' + nanoid(8),
        authorName: 'Anonymous User',
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
        discussion,
        message: isDraft ? 'Discussion saved as draft (fallback)' : 'Discussion published successfully (fallback)',
        fallbackMode: true
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
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