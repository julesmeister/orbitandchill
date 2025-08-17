/* eslint-disable @typescript-eslint/no-unused-vars */
import { BRAND } from '@/config/brand';

/**
 * Structured data for discussions pages including FAQ, DiscussionForumPosting, and WebSite schemas
 */
export default function DiscussionsStructuredData() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://orbitandchill.com';

  // WebSite Schema for discussions section
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": `${BRAND.name} Community Discussions`,
    "url": `${siteUrl}/discussions`,
    "description": "Join our astrology community discussions. Ask questions, share insights, and connect with fellow astrology enthusiasts about natal charts, transits, synastry, and more.",
    "publisher": {
      "@type": "Organization",
      "name": BRAND.name,
      "url": siteUrl
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/discussions?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  // NOTE: FAQ Schema removed to prevent SEO conflicts with dedicated FAQ page
  // FAQ content is now centralized in /src/data/faqData.ts and rendered on /faq page

  // Breadcrumb Schema for Discussions
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
      }
    ]
  };

  // Forum Schema
  const forumSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Astrology Community Discussions",
    "description": "Community forum for astrology discussions, chart readings, and astrological insights",
    "url": `${siteUrl}/discussions`,
    "isPartOf": {
      "@type": "WebSite",
      "name": BRAND.name,
      "url": siteUrl
    },
    "about": {
      "@type": "Thing",
      "name": "Astrology Community",
      "description": "A community of astrology enthusiasts sharing knowledge about natal charts, transits, synastry, and astrological interpretations"
    },
    "audience": {
      "@type": "Audience",
      "audienceType": "astrology enthusiasts, astrologers, spiritual seekers"
    }
  };

  return (
    <>
      {/* WebSite Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema)
        }}
      />

      {/* FAQ Schema removed - now centralized on dedicated /faq page */}

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />

      {/* Forum Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(forumSchema)
        }}
      />
    </>
  );
}