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

  // Forum Schema with enhanced service descriptions
  const forumSchema = {
    "@context": "https://schema.org",
    "@type": "DiscussionForumPosting",
    "headline": "Free Astrology Community - Expert Chart Help & Discussions",
    "description": "Get expert astrology help from our active community. Ask questions about natal charts, transits, synastry, and astrological interpretations. Free advice from experienced astrologers.",
    "url": `${siteUrl}/discussions`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteUrl}/discussions`
    },
    "publisher": {
      "@type": "Organization", 
      "name": BRAND.name,
      "url": siteUrl
    },
    "about": [
      {
        "@type": "Thing",
        "name": "Natal Chart Analysis",
        "description": "Birth chart interpretation and personality insights"
      },
      {
        "@type": "Thing", 
        "name": "Transit Astrology",
        "description": "Current planetary movements and their effects"
      },
      {
        "@type": "Thing",
        "name": "Synastry Analysis", 
        "description": "Relationship compatibility through astrology"
      },
      {
        "@type": "Thing",
        "name": "Astrology Education",
        "description": "Learning resources and astrology tutorials"
      }
    ],
    "audience": {
      "@type": "Audience",
      "audienceType": "astrology enthusiasts, spiritual seekers, people seeking astrological guidance"
    },
    "keywords": "free astrology help, natal chart questions, astrology community, chart reading help, astrology forum, transit interpretations, synastry analysis"
  };

  // Local Business Schema for astrology services
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Free Astrology Community Support",
    "description": "Free astrology consultations and chart interpretations from our expert community members",
    "provider": {
      "@type": "Organization",
      "name": BRAND.name,
      "url": siteUrl
    },
    "serviceType": "Astrology Consultation",
    "audience": {
      "@type": "Audience", 
      "audienceType": "People seeking astrological guidance"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free community-based astrology help and chart analysis"
    },
    "areaServed": "Worldwide",
    "availableLanguage": "English"
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

      {/* Service Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema)
        }}
      />
    </>
  );
}