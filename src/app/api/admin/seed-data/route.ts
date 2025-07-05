import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/db/index';
import { UserService } from '@/db/services/userService';
import { DiscussionService } from '@/db/services/discussionService';
import { AnalyticsService } from '@/db/services/analyticsService';
import { AdminAuditService } from '@/db/services/adminAuditService';

export async function POST() {
  // DISABLED: Seed data API disabled to prevent memory issues
  return NextResponse.json({ 
    success: false, 
    message: 'Seed data API has been disabled to prevent memory consumption issues',
    disabled: true 
  });
  
  /* Unreachable code commented out
  try {
    await initializeDatabase();
    
    console.log('🌱 Seeding database with test data...');
    
    // Log the data seeding operation
    try {
      await AdminAuditService.logSystemAction(
        'Admin',
        'seed',
        'Database seeding initiated',
        {
          entityType: 'system',
          severity: 'medium',
          details: {
            operation: 'seed-data',
            timestamp: new Date().toISOString()
          }
        }
      );
    } catch (auditError) {
      console.warn('Failed to log seeding operation:', auditError);
    }
    
    // Create test users
    const testUsers = [
      {
        username: 'AstroMaster',
        email: 'astro@example.com',
        authProvider: 'google' as const,
        hasNatalChart: true,
      },
      {
        username: 'StarGazer',
        email: 'star@example.com', 
        authProvider: 'google' as const,
        hasNatalChart: true,
      },
      {
        username: 'CosmicSeeker',
        email: 'cosmic@example.com',
        authProvider: 'anonymous' as const,
        hasNatalChart: false,
      },
      {
        username: 'Anonymous User',
        email: undefined,
        authProvider: 'anonymous' as const,
        hasNatalChart: false,
      }
    ];
    
    const createdUsers = [];
    for (const userData of testUsers) {
      try {
        const user = await UserService.createUser(userData);
        createdUsers.push(user);
        console.log(`✅ Created user: ${userData.username}`);
      } catch (error) {
        console.warn(`Failed to create user ${userData.username}:`, error);
      }
    }
    
    // Create test discussions
    const testDiscussions = [
      {
        title: 'Understanding Your Mars Placement: A Deep Dive',
        excerpt: 'Mars in our natal chart reveals how we take action and express our desires...',
        content: 'Mars in our natal chart reveals how we take action and express our desires. This comprehensive guide will help you understand your Mars placement and its impact on your life.',
        authorId: createdUsers[0]?.id || 'test-user-1',
        authorName: 'AstroMaster',
        category: 'Natal Chart Analysis',
        tags: ['mars', 'planets', 'natal-chart'],
        isBlogPost: false,
        isPublished: true,
      },
      {
        title: 'Mercury Retrograde: Myth vs Reality',
        excerpt: 'Separating fact from fiction about Mercury retrograde periods...',
        content: 'Mercury retrograde gets a bad reputation, but understanding what really happens during these periods can help you navigate them more effectively.',
        authorId: createdUsers[1]?.id || 'test-user-2',
        authorName: 'StarGazer',
        category: 'Transits & Predictions',
        tags: ['mercury', 'retrograde', 'transits'],
        isBlogPost: true,
        isPublished: true,
      },
      {
        title: 'Getting Started with Astrology',
        excerpt: 'A beginner\'s guide to understanding your birth chart...',
        content: 'New to astrology? This guide will walk you through the basics of reading your birth chart and understanding the fundamental concepts.',
        authorId: createdUsers[2]?.id || 'test-user-3',
        authorName: 'CosmicSeeker',
        category: 'Learning Resources',
        tags: ['beginner', 'basics', 'birth-chart'],
        isBlogPost: false,
        isPublished: true,
      }
    ];
    
    const createdDiscussions = [];
    for (const discussionData of testDiscussions) {
      try {
        const discussion = await DiscussionService.createDiscussion(discussionData);
        createdDiscussions.push(discussion);
        console.log(`✅ Created discussion: ${discussionData.title}`);
      } catch (error) {
        console.warn(`Failed to create discussion ${discussionData.title}:`, error);
      }
    }
    
    // Create test analytics data
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    try {
      await AnalyticsService.recordTrafficData({
        date: today,
        visitors: 45,
        pageViews: 120,
        chartsGenerated: 8,
        avgSessionDuration: 425,
        bounceRate: 35
      });
      
      await AnalyticsService.recordTrafficData({
        date: yesterday,
        visitors: 38,
        pageViews: 95,
        chartsGenerated: 6,
        avgSessionDuration: 380,
        bounceRate: 42
      });
      
      await AnalyticsService.recordTrafficData({
        date: twoDaysAgo,
        visitors: 52,
        pageViews: 140,
        chartsGenerated: 12,
        avgSessionDuration: 465,
        bounceRate: 28
      });
      
      console.log('✅ Created analytics data');
    } catch (error) {
      console.warn('Failed to create analytics data:', error);
    }
    
    // Log successful completion
    try {
      await AdminAuditService.logSystemAction(
        'Admin',
        'seed',
        'Database seeding completed successfully',
        {
          entityType: 'system',
          severity: 'medium',
          details: {
            operation: 'seed-data',
            results: {
              users: createdUsers.length,
              discussions: createdDiscussions.length,
              analyticsRecords: 3
            },
            timestamp: new Date().toISOString()
          }
        }
      );
    } catch (auditError) {
      console.warn('Failed to log seeding completion:', auditError);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully!',
      data: {
        users: createdUsers.length,
        discussions: createdDiscussions.length,
        analyticsRecords: 3
      }
    });
    
  } catch (error) {
    console.error('Seeding error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to seed database',
      details: error instanceof Error ? error.message : String(error)
    }, {
      status: 500
    });
  }
  */
}