/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/db/services/analyticsService';
import { UserActivityService } from '@/db/services/userActivityService';
import { initializeDatabase } from '@/db/index';

// Helper function to categorize traffic sources based on referrer
function categorizeTrafficSource(referrer: string): string {
  if (!referrer || referrer === 'direct' || referrer === '') {
    return 'Direct';
  }
  
  const url = referrer.toLowerCase();
  
  // Search engines
  if (url.includes('google.com') || url.includes('google.') || 
      url.includes('bing.com') || url.includes('yahoo.com') || 
      url.includes('duckduckgo.com') || url.includes('baidu.com') ||
      url.includes('search.') || url.includes('yandex.')) {
    return 'Search Engines';
  }
  
  // Social media platforms
  if (url.includes('facebook.com') || url.includes('twitter.com') || 
      url.includes('instagram.com') || url.includes('linkedin.com') ||
      url.includes('reddit.com') || url.includes('pinterest.com') ||
      url.includes('tiktok.com') || url.includes('discord.') ||
      url.includes('telegram.') || url.includes('whatsapp.') ||
      url.includes('t.co') || url.includes('fb.com')) {
    return 'Social Media';
  }
  
  // Astrology/spiritual sites
  if (url.includes('astro') || url.includes('horoscope') || 
      url.includes('zodiac') || url.includes('tarot') ||
      url.includes('spiritual') || url.includes('mystic')) {
    return 'Astrology Sites';
  }
  
  // Everything else is a referral
  return 'Referrals';
}

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();

    // Get real referrer data from user activities over last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const pageViewActivities = await UserActivityService.getActivitiesByType('page_view');
    
    // Aggregate traffic sources by referrer
    const sourceCounts: { [source: string]: number } = {};
    let totalViews = 0;
    
    for (const activity of pageViewActivities) {
      if (activity.createdAt >= thirtyDaysAgo) {
        const metadata = activity.metadata ? JSON.parse(activity.metadata as unknown as string) : {};
        const referrer = metadata.referrer || '';
        const source = categorizeTrafficSource(referrer);
        sourceCounts[source] = (sourceCounts[source] || 0) + 1;
        totalViews++;
      }
    }
    
    // Define color mapping for sources
    const sourceColors: { [key: string]: string } = {
      'Direct': 'bg-[#6bdbff]',
      'Search Engines': 'bg-[#51bd94]',
      'Social Media': 'bg-[#ff91e9]',
      'Astrology Sites': 'bg-[#f2e356]',
      'Referrals': 'bg-[#ff6b6b]'
    };
    
    // Convert to array and sort by count
    const sources = Object.entries(sourceCounts)
      .map(([source, count]) => ({
        source,
        count,
        percentage: totalViews > 0 ? Math.round((count / totalViews) * 100) : 0,
        color: sourceColors[source] || 'bg-gray-400'
      }))
      .sort((a, b) => b.count - a.count);
    
    // If we have ANY real data, use it (lowered threshold for development)
    if (sources.length > 0 && totalViews > 0) {
      
      return NextResponse.json({
        success: true,
        sources,
        dataSource: 'real',
        totalViews
      });
    }
    
    // No referrer data found, return empty instead of fallback
    
    return NextResponse.json({
      success: true,
      sources: [],
      dataSource: 'real',
      totalViews: 0
    });
    
  } catch (error) {
    console.error('API Error loading traffic sources:', error);
    
    // Return empty data instead of fallback
    return NextResponse.json({
      success: false,
      sources: [],
      dataSource: 'error',
      error: 'Failed to fetch traffic sources'
    });
  }
}