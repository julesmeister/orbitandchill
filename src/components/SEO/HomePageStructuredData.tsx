import { BRAND } from '@/config/brand';

/**
 * Structured data for the home page including Organization, WebSite, and WebApplication schemas
 */
export default function HomePageStructuredData() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://orbitandchill.com';

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": BRAND.name,
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "description": `${BRAND.tagline} ${BRAND.description}`,
    "sameAs": [
      "https://twitter.com/orbitandchill",
      "https://facebook.com/orbitandchill",
      "https://instagram.com/orbitandchill"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "url": `${siteUrl}/contact`
    }
  };

  // WebSite Schema with Search Action
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": BRAND.name,
    "url": siteUrl,
    "description": `${BRAND.tagline} Professional astrology tools including natal chart calculator, astrocartography, and astrological events tracker.`,
    "publisher": {
      "@type": "Organization",
      "name": BRAND.name
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  // WebApplication Schema
  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": `${BRAND.name} Astrology Tools`,
    "url": siteUrl,
    "description": "Free professional-grade astrology tools including natal chart calculator, astrocartography maps, electional astrology timing, and real-time astrological events tracker.",
    "applicationCategory": "LifestyleApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "featureList": [
      "Free Natal Chart Calculator",
      "Astrocartography Mapping",
      "Astrological Events Tracker", 
      "Electional Astrology Timing",
      "Matrix Destiny Analysis",
      "Planetary Position Calculator",
      "Astrological Houses Interpretation",
      "Community Discussions"
    ],
    "screenshot": `${siteUrl}/images/app-screenshot.jpg`,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  // Breadcrumb Schema for Homepage
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      }
    ]
  };

  // NOTE: FAQ Schema removed to prevent SEO conflicts with dedicated FAQ page
  // FAQ content is now centralized in /src/data/faqData.ts and rendered on /faq page

  return (
    <>
      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />

      {/* WebSite Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema)
        }}
      />

      {/* WebApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webApplicationSchema)
        }}
      />

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />

      {/* FAQ Schema removed - now centralized on dedicated /faq page */}
    </>
  );
}