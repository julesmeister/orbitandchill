import { NextResponse } from 'next/server';
import { BRAND } from '@/config/brand';

// This would integrate with your actual blog data source
// For now, using a placeholder structure
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  author: string;
  publishedAt: string;
  category: string;
}

function generateRSSFeed(posts: BlogPost[]) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || BRAND.domain;
  const buildDate = new Date().toUTCString();

  const rssItems = posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt}]]></description>
      <link>${baseUrl}/discussions/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/discussions/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <author>noreply@${BRAND.domain.replace('https://', '')} (${post.author})</author>
      <category>${post.category}</category>
    </item>
  `).join('');

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${BRAND.name} Astrology Blog</title>
    <description>Expert astrology insights, cosmic wisdom, and celestial guidance. Explore natal charts, planetary transits, and astrological techniques.</description>
    <link>${baseUrl}/blog</link>
    <atom:link href="${baseUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-US</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <pubDate>${buildDate}</pubDate>
    <ttl>60</ttl>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>${BRAND.name} Astrology Blog</title>
      <link>${baseUrl}/blog</link>
      <width>144</width>
      <height>144</height>
    </image>
    ${rssItems}
  </channel>
</rss>`;
}

export async function GET() {
  try {
    // Fetch actual blog data from the discussions API
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/discussions?limit=50&sortBy=recent`);
    const data = await response.json();
    
    let posts: BlogPost[] = [];
    
    if (data.success && data.discussions) {
      // Filter for blog posts and convert to BlogPost format
      posts = data.discussions
        .filter((discussion: any) => discussion.isBlogPost && discussion.isPublished)
        .map((discussion: any) => ({
          id: discussion.id,
          title: discussion.title,
          excerpt: discussion.excerpt || discussion.title,
          slug: discussion.slug || discussion.id,
          author: discussion.authorName || 'Anonymous',
          publishedAt: discussion.createdAt ? new Date(discussion.createdAt * 1000).toISOString() : new Date().toISOString(),
          category: discussion.category || 'General'
        }))
        .slice(0, 50); // Limit to 50 most recent posts
    }

    // Fallback to sample data if no posts found
    if (posts.length === 0) {
      posts = [
        {
          id: '1',
          title: 'Understanding Your Natal Chart: A Complete Guide',
          excerpt: 'Learn how to read and interpret your natal chart with this comprehensive guide to astrological symbols, houses, and planetary aspects.',
          slug: 'understanding-your-natal-chart-complete-guide',
          author: 'Astrology Expert',
          publishedAt: new Date().toISOString(),
          category: 'Natal Charts'
        }
      ];
    }

    const rss = generateRSSFeed(posts);

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'max-age=3600, s-maxage=3600',
      },
    });

  } catch (error) {
    console.error('Error generating RSS feed:', error);
    
    // Fallback RSS with sample data
    const fallbackPosts: BlogPost[] = [
      {
        id: '1',
        title: 'Understanding Your Natal Chart: A Complete Guide',
        excerpt: 'Learn how to read and interpret your natal chart with this comprehensive guide to astrological symbols, houses, and planetary aspects.',
        slug: 'understanding-your-natal-chart-complete-guide',
        author: 'Astrology Expert',
        publishedAt: new Date().toISOString(),
        category: 'Natal Charts'
      }
    ];
    
    const rss = generateRSSFeed(fallbackPosts);
    
    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'max-age=300', // Shorter cache for fallback
      },
    });
  }
}