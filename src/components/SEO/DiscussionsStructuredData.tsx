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

  // FAQ Schema for Astrology Community Questions
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I ask a good astrology question in the community?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Provide context about your question, include relevant birth data (you can use initials for privacy), specify what type of reading you're seeking, and search existing discussions first to avoid duplicates."
        }
      },
      {
        "@type": "Question",
        "name": "What topics can I discuss in the astrology community?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can discuss natal chart analysis, transits and predictions, chart reading help, synastry and compatibility, mundane astrology, learning resources, and general astrology topics."
        }
      },
      {
        "@type": "Question",
        "name": "Is it safe to share birth information in discussions?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For privacy, use initials instead of full names, and consider using approximate times if you're concerned. The most important data for chart reading is date, time, and location - names are not necessary for interpretation."
        }
      },
      {
        "@type": "Question",
        "name": "How do I interpret conflicting astrological advice?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Astrology is interpretive, so different astrologers may emphasize different aspects. Consider multiple perspectives, look for common themes, and trust your intuition about what resonates with your experience."
        }
      },
      {
        "@type": "Question",
        "name": "Can beginners participate in astrology discussions?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! Our community welcomes all levels. Tag your posts with 'beginner' if needed, ask for explanations of terms you don't understand, and don't hesitate to share your learning journey."
        }
      }
    ]
  };

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

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema)
        }}
      />

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