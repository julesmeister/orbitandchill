/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/db/services/userService';
import { DiscussionService } from '@/db/services/discussionService';
import { initializeDatabase } from '@/db/index';

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();

    // Get all users from database
    const dbUsers = await UserService.getAllUsers(100);
    
    // Transform database users to analytics format
    const userAnalytics = await Promise.all(
      dbUsers.map(async (user: any) => {
        // Get all discussions and filter by author (temporary solution)
        const allDiscussions = await DiscussionService.getAllDiscussions({ 
          limit: 1000 
        });
        const userDiscussions = allDiscussions.filter((d: any) => d.authorId === user.id);
        
        return {
          id: user.id,
          name: user.username || (user.authProvider === 'anonymous' ? '' : 'Unknown User'),
          email: user.email || '',
          joinDate: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
          lastActive: user.updatedAt ? new Date(user.updatedAt).toISOString() : new Date().toISOString(),
          chartsGenerated: user.hasNatalChart ? 1 : 0,
          forumPosts: userDiscussions.length,
          isAnonymous: user.authProvider === 'anonymous',
        };
      })
    );
    
    const sortedAnalytics = userAnalytics.sort((a, b) => 
      new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
    );

    return NextResponse.json({
      success: true,
      userAnalytics: sortedAnalytics
    });
    
  } catch (error) {
    console.error('API Error loading user analytics:', error);
    
    // Return empty array on error
    return NextResponse.json({
      success: false,
      userAnalytics: [],
      error: 'Failed to fetch user analytics'
    });
  }
}