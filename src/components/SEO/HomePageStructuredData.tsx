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

  // Consolidated FAQ Schema for All Common Astrology Questions
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a natal chart?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A natal chart is a snapshot of the sky at the exact moment you were born. It reveals your personality traits, strengths, challenges, and life path through the positions of planets and stars in astrological houses and signs."
        }
      },
      {
        "@type": "Question", 
        "name": "What is astrocartography?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Astrocartography shows you where on Earth your astrological influences would be strongest. Different locations can enhance different aspects of your personality and life experiences based on planetary lines."
        }
      },
      {
        "@type": "Question",
        "name": "What is electional astrology?",
        "acceptedAnswer": {
          "@type": "Answer", 
          "text": "Electional astrology is the practice of choosing the most auspicious times to begin important activities or events based on astrological conditions. It helps you time actions for optimal cosmic support."
        }
      },
      {
        "@type": "Question",
        "name": "How accurate is online astrology?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Online astrology tools can be highly accurate when using precise birth data including exact time and location. Our calculations use professional-grade astronomical algorithms for accurate planetary positions."
        }
      },
      {
        "@type": "Question",
        "name": "What information do I need for a natal chart?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To generate an accurate natal chart, you need your exact birth date, birth time (to the minute), and birth location (city/town). The birth time is crucial for determining your rising sign and house positions."
        }
      },
      {
        "@type": "Question",
        "name": "What are astrological events?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Astrological events are significant celestial occurrences such as planetary conjunctions, retrogrades, eclipses, and rare alignments that astrologers believe influence human experiences and energies."
        }
      },
      {
        "@type": "Question",
        "name": "How rare are these astronomical events?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Astronomical events vary in rarity from common monthly occurrences like moon phases to very rare events like outer planet conjunctions that happen every 100+ years. We classify events as common, uncommon, rare, or very rare based on their astronomical frequency."
        }
      },
      {
        "@type": "Question",
        "name": "When is the next significant astrological event?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Check our real-time astrological events tracker for the latest upcoming celestial events."
        }
      }
    ]
  };

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

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema)
        }}
      />
    </>
  );
}