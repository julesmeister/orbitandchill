/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Discussion SEO Analytics Tracking
 * 
 * Advanced tracking for discussion engagement, search visibility, and content performance
 */

interface DiscussionSEOMetrics {
  discussionId: string;
  slug: string;
  title: string;
  category: string;
  author: string;
  views: number;
  replies: number;
  upvotes: number;
  searchRanking?: number;
  socialShares?: number;
  timeOnPage?: number;
  bounceRate?: number;
  organicTraffic?: number;
}

interface SEOPerformanceData {
  topDiscussions: DiscussionSEOMetrics[];
  categoryPerformance: Record<string, number>;
  searchKeywordRankings: Record<string, number>;
  contentFreshness: {
    lastUpdated: string;
    updateFrequency: 'daily' | 'weekly' | 'monthly';
    contentAge: number;
  };
}

/**
 * Track discussion page views for SEO analytics
 */
export const trackDiscussionView = async (discussionData: {
  id: string;
  slug: string;
  title: string;
  category: string;
  referrer?: string;
}) => {
  try {
    // Track in Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', 'discussion_view', {
        'discussion_id': discussionData.id,
        'discussion_slug': discussionData.slug,
        'discussion_title': discussionData.title,
        'discussion_category': discussionData.category,
        'referrer': discussionData.referrer || document.referrer,
        'search_engine_referrer': isSearchEngineReferrer(discussionData.referrer),
      });
    }

    // Track content engagement depth
    setTimeout(() => {
      gtag('event', 'discussion_engaged', {
        'discussion_id': discussionData.id,
        'engagement_time': 30, // 30 seconds indicates engaged user
        'content_category': discussionData.category,
      });
    }, 30000);

  } catch (error) {
    console.warn('Discussion SEO tracking failed:', error);
  }
};

/**
 * Track discussion social sharing for SEO signals
 */
export const trackDiscussionShare = (discussionData: {
  id: string;
  slug: string;
  platform: 'twitter' | 'facebook' | 'linkedin' | 'copy' | 'email';
  title: string;
}) => {
  try {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'share', {
        'method': discussionData.platform,
        'content_type': 'discussion',
        'item_id': discussionData.id,
        'content_title': discussionData.title,
        'content_url': `/discussions/${discussionData.slug}`,
      });
    }
    
    // Track social signals for SEO
    gtag('event', 'social_interaction', {
      'social_network': discussionData.platform,
      'social_action': 'share',
      'social_target': `/discussions/${discussionData.slug}`,
    });
    
  } catch (error) {
    console.warn('Discussion share tracking failed:', error);
  }
};

/**
 * Track discussion search queries that led to the page
 */
export const trackDiscussionSearchQuery = (searchQuery: string, discussionId: string) => {
  try {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'search_to_discussion', {
        'search_term': searchQuery,
        'destination_discussion': discussionId,
        'search_success': true,
      });
    }
  } catch (error) {
    console.warn('Search query tracking failed:', error);
  }
};

/**
 * Track discussion content freshness for SEO
 */
export const trackContentFreshness = (discussionData: {
  id: string;
  lastActivity: string;
  createdAt: string;
  replyCount: number;
}) => {
  const now = new Date();
  const lastActivity = new Date(discussionData.lastActivity);
  const created = new Date(discussionData.createdAt);
  
  const daysSinceLastActivity = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
  const daysSinceCreation = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  
  const freshnessScore = calculateFreshnessScore(daysSinceLastActivity, discussionData.replyCount);
  
  try {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'content_freshness', {
        'discussion_id': discussionData.id,
        'days_since_activity': daysSinceLastActivity,
        'days_since_creation': daysSinceCreation,
        'reply_count': discussionData.replyCount,
        'freshness_score': freshnessScore,
        'content_status': getFreshnessStatus(daysSinceLastActivity),
      });
    }
  } catch (error) {
    console.warn('Content freshness tracking failed:', error);
  }
  
  return freshnessScore;
};

/**
 * Generate SEO performance report for discussions
 */
export const generateDiscussionSEOReport = async (): Promise<SEOPerformanceData> => {
  try {
    // This would typically fetch from your analytics API
    // For now, return a structure that can be populated with real data
    
    return {
      topDiscussions: [], // Top performing discussions by organic traffic
      categoryPerformance: {
        'Natal Chart Analysis': 85,
        'Transits & Predictions': 92,
        'Chart Reading Help': 78,
        'Synastry & Compatibility': 88,
        'Mundane Astrology': 71,
        'Learning Resources': 95,
        'General Discussion': 82,
      },
      searchKeywordRankings: {
        'natal chart meaning': 15,
        'astrology transit interpretation': 8,
        'birth chart reading': 23,
        'synastry compatibility': 12,
        'astrology community': 6,
      },
      contentFreshness: {
        lastUpdated: new Date().toISOString(),
        updateFrequency: 'daily',
        contentAge: 30, // Average age in days
      }
    };
  } catch (error) {
    console.error('SEO report generation failed:', error);
    throw error;
  }
};

// Helper functions
const isSearchEngineReferrer = (referrer?: string): boolean => {
  if (!referrer) return false;
  const searchEngines = ['google.com', 'bing.com', 'yahoo.com', 'duckduckgo.com', 'baidu.com'];
  return searchEngines.some(engine => referrer.includes(engine));
};

const calculateFreshnessScore = (daysSinceActivity: number, replyCount: number): number => {
  // Fresh content gets higher scores
  let score = 100;
  
  // Penalty for age
  if (daysSinceActivity > 30) score -= 20;
  if (daysSinceActivity > 90) score -= 30;
  if (daysSinceActivity > 180) score -= 40;
  
  // Bonus for engagement
  if (replyCount > 5) score += 10;
  if (replyCount > 15) score += 15;
  if (replyCount > 30) score += 20;
  
  return Math.max(0, Math.min(100, score));
};

const getFreshnessStatus = (daysSinceActivity: number): string => {
  if (daysSinceActivity <= 7) return 'very_fresh';
  if (daysSinceActivity <= 30) return 'fresh';
  if (daysSinceActivity <= 90) return 'aging';
  return 'stale';
};

// Global gtag declaration for TypeScript
declare global {
  function gtag(...args: any[]): void;
}