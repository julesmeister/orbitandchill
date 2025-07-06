/* eslint-disable @typescript-eslint/no-unused-vars */
import { BRAND } from '@/config/brand';

interface DiscussionDetailStructuredDataProps {
  discussion: {
    id: string;
    title: string;
    content: string;
    excerpt?: string;
    author: string;
    authorId: string;
    category: string;
    tags: string[];
    replies: number;
    views: number;
    lastActivity: string | Date | number;
    createdAt: string | Date | number;
    slug?: string;
    upvotes?: number;
    downvotes?: number;
  };
  slug: string;
}

/**
 * Structured data for individual discussion pages including DiscussionForumPosting and Article schemas
 */
export default function DiscussionDetailStructuredData({ discussion, slug }: DiscussionDetailStructuredDataProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://orbitandchill.com';
  const discussionUrl = `${siteUrl}/discussions/${discussion.slug || slug}`;

  // Helper to safely convert dates
  const getValidDate = (dateValue: string | Date | number) => {
    try {
      if (typeof dateValue === 'number') {
        const date = new Date(dateValue * 1000);
        return isNaN(date.getTime()) ? new Date() : date;
      }
      const date = new Date(dateValue);
      return isNaN(date.getTime()) ? new Date() : date;
    } catch {
      return new Date();
    }
  };

  const publishedDate = getValidDate(discussion.createdAt || discussion.lastActivity);
  const modifiedDate = getValidDate(discussion.lastActivity);

  // DiscussionForumPosting Schema
  const discussionForumPostingSchema = {
    "@context": "https://schema.org",
    "@type": "DiscussionForumPosting",
    "headline": discussion.title,
    "text": discussion.content,
    "description": discussion.excerpt || discussion.content.substring(0, 200) + '...',
    "url": discussionUrl,
    "datePublished": publishedDate.toISOString(),
    "dateModified": modifiedDate.toISOString(),
    "author": {
      "@type": "Person",
      "name": discussion.author,
      "identifier": discussion.authorId
    },
    "publisher": {
      "@type": "Organization",
      "name": BRAND.name,
      "url": siteUrl
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": discussionUrl
    },
    "about": {
      "@type": "Thing",
      "name": discussion.category,
      "description": `Astrology discussion about ${discussion.category.toLowerCase()}`
    },
    "keywords": discussion.tags.join(', '),
    "interactionStatistic": [
      {
        "@type": "InteractionCounter",
        "interactionType": "https://schema.org/ViewAction",
        "userInteractionCount": discussion.views || 0
      },
      {
        "@type": "InteractionCounter", 
        "interactionType": "https://schema.org/CommentAction",
        "userInteractionCount": discussion.replies || 0
      }
    ],
    "commentCount": discussion.replies || 0,
    "discussionUrl": discussionUrl,
    "isPartOf": {
      "@type": "WebSite",
      "name": BRAND.name,
      "url": siteUrl
    }
  };

  // Add vote data if available
  if (discussion.upvotes !== undefined || discussion.downvotes !== undefined) {
    discussionForumPostingSchema.interactionStatistic.push({
      "@type": "InteractionCounter",
      "interactionType": "https://schema.org/LikeAction", 
      "userInteractionCount": discussion.upvotes || 0
    });
  }

  // Article Schema (for broader content recognition)
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": discussion.title,
    "description": discussion.excerpt || discussion.content.substring(0, 200) + '...',
    "url": discussionUrl,
    "datePublished": publishedDate.toISOString(),
    "dateModified": modifiedDate.toISOString(),
    "author": {
      "@type": "Person",
      "name": discussion.author
    },
    "publisher": {
      "@type": "Organization",
      "name": BRAND.name,
      "url": siteUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": discussionUrl
    },
    "articleSection": discussion.category,
    "keywords": discussion.tags.join(', '),
    "wordCount": discussion.content.split(' ').length,
    "commentCount": discussion.replies || 0,
    "about": {
      "@type": "Thing",
      "name": "Astrology",
      "description": "Astrological insights, chart interpretations, and cosmic guidance"
    }
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Discussions",
        "item": `${siteUrl}/discussions`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": discussion.category,
        "item": `${siteUrl}/discussions?category=${encodeURIComponent(discussion.category)}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": discussion.title,
        "item": discussionUrl
      }
    ]
  };

  // WebPage Schema
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": discussion.title,
    "description": discussion.excerpt || discussion.content.substring(0, 200) + '...',
    "url": discussionUrl,
    "isPartOf": {
      "@type": "WebSite",
      "name": BRAND.name,
      "url": siteUrl
    },
    "about": {
      "@type": "Thing",
      "name": discussion.category,
      "description": `Astrology discussion about ${discussion.category.toLowerCase()}`
    },
    "audience": {
      "@type": "Audience",
      "audienceType": "astrology enthusiasts, spiritual seekers"
    },
    "inLanguage": "en-US",
    "datePublished": publishedDate.toISOString(),
    "dateModified": modifiedDate.toISOString()
  };

  return (
    <>
      {/* DiscussionForumPosting Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(discussionForumPostingSchema)
        }}
      />

      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema)
        }}
      />

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />

      {/* WebPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema)
        }}
      />
    </>
  );
}