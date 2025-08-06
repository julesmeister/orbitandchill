import React from 'react';
import { BRAND } from '@/config/brand';

export default function PrivacyStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${BRAND.domain}/privacy`,
    "url": `${BRAND.domain}/privacy`,
    "name": `Privacy Policy | ${BRAND.name}`,
    "description": "Learn how Orbit and Chill collects, uses, and protects your information. No account required, local storage first.",
    "inLanguage": "en-US",
    "isPartOf": {
      "@type": "WebSite",
      "@id": `${BRAND.domain}/#website`,
      "url": BRAND.domain,
      "name": BRAND.name,
      "description": BRAND.description
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": BRAND.domain
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Privacy Policy",
          "item": `${BRAND.domain}/privacy`
        }
      ]
    },
    "mainEntity": {
      "@type": "PrivacyPolicy",
      "datePublished": "2024-12-06",
      "dateModified": "2024-12-06",
      "publisher": {
        "@type": "Organization",
        "name": BRAND.name,
        "url": BRAND.domain
      },
      "about": {
        "@type": "WebApplication",
        "name": BRAND.name,
        "description": BRAND.description
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}