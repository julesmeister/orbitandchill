import { NextResponse } from 'next/server';
import { BRAND } from '@/config/brand';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://orbitandchill.com';
  
  try {
    // Fetch recent discussions for RSS
    const response = await fetch(`${siteUrl}/api/discussions?limit=20&sortBy=recent`, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    
    const data = await response.json();
    const discussions = data.success ? data.discussions : [];
    
    // Helper function to escape HTML for XML
    const escapeHtml = (text: string) => {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    };
    
    // Helper to create clean excerpt from content
    const createCleanExcerpt = (content: string, maxLength: number = 200) => {
      const cleanContent = content
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
      
      return cleanContent.length > maxLength 
        ? cleanContent.substring(0, maxLength) + '...'
        : cleanContent;
    };
    
    // Generate RSS XML
    const rssItems = discussions.map((discussion: any) => {
      const discussionUrl = `${siteUrl}/discussions/${discussion.slug || discussion.id}`;
      const pubDate = new Date(discussion.createdAt || discussion.lastActivity).toUTCString();
      const cleanExcerpt = createCleanExcerpt(discussion.content || discussion.excerpt || '', 300);
      
      return `
    <item>
      <title><![CDATA[${escapeHtml(discussion.title)}]]></title>
      <link>${discussionUrl}</link>
      <guid isPermaLink="true">${discussionUrl}</guid>
      <description><![CDATA[${escapeHtml(cleanExcerpt)}]]></description>
      <author>${escapeHtml(discussion.author || 'Anonymous')}</author>
      <category><![CDATA[${escapeHtml(discussion.category)}]]></category>
      <pubDate>${pubDate}</pubDate>
      ${discussion.tags && discussion.tags.length > 0 ? discussion.tags.map((tag: string) => 
        `<category><![CDATA[${escapeHtml(tag)}]]></category>`
      ).join('') : ''}
    </item>`;
    }).join('');
    
    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title><![CDATA[${BRAND.name} - Community Discussions]]></title>
    <link>${siteUrl}/discussions</link>
    <description><![CDATA[Latest astrology discussions from the ${BRAND.name} community. Get expert chart help, transit insights, and astrological guidance from fellow enthusiasts.]]></description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/discussions/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteUrl}/images/discussions-og.jpg</url>
      <title><![CDATA[${BRAND.name} Discussions]]></title>
      <link>${siteUrl}/discussions</link>
      <width>1200</width>
      <height>630</height>
    </image>
    <category><![CDATA[Astrology]]></category>
    <category><![CDATA[Natal Charts]]></category>
    <category><![CDATA[Community]]></category>
    <webMaster>contact@orbitandchill.com (${BRAND.name})</webMaster>
    <managingEditor>contact@orbitandchill.com (${BRAND.name})</managingEditor>
    <copyright>© ${new Date().getFullYear()} ${BRAND.name}. All rights reserved.</copyright>
    <generator>${BRAND.name} Discussion RSS Generator</generator>
    <docs>https://www.rssboard.org/rss-specification</docs>
    <ttl>300</ttl>
${rssItems}
  </channel>
</rss>`;
    
    return new NextResponse(rssXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=UTF-8',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600', // 5 min cache, 1 hour stale
      },
    });
    
  } catch (error) {
    console.error('RSS generation failed:', error);
    
    // Return minimal RSS feed on error
    const fallbackRss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title><![CDATA[${BRAND.name} - Community Discussions]]></title>
    <link>${siteUrl}/discussions</link>
    <description><![CDATA[Astrology discussions and community insights]]></description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  </channel>
</rss>`;
    
    return new NextResponse(fallbackRss, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=UTF-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }
}