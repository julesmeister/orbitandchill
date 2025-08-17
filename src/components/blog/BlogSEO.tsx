/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import Head from 'next/head';
import { BlogPost } from '@/types/blog';
import { BRAND } from '@/config/brand';

interface BlogSEOProps {
  title?: string;
  description?: string;
  post?: BlogPost;
  isHomePage?: boolean;
  currentPage?: number;
  totalPages?: number;
  categorySlug?: string;
}

const BlogSEO: React.FC<BlogSEOProps> = ({
  title,
  description,
  post,
  isHomePage = false,
  currentPage,
  totalPages,
  categorySlug
}) => {
  // Generate appropriate meta data based on context
  const getMetaTitle = () => {
    if (post) {
      return `${post.title} | ${BRAND.name} Blog`;
    }
    if (title) {
      return `${title} | ${BRAND.name} Blog`;
    }
    return `Astrology Blog | Guides, Insights & Cosmic Wisdom | ${BRAND.name}`;
  };

  const getMetaDescription = () => {
    if (post) {
      return post.excerpt;
    }
    if (description) {
      return description;
    }
    return 'Explore comprehensive astrology guides, zodiac insights, planetary influences, and cosmic wisdom. Learn about natal charts, transits, and astrological techniques.';
  };

  const getCanonicalUrl = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || BRAND.domain;
    if (post) {
      return `${baseUrl}/blog/${post.slug}`;
    }
    if (categorySlug) {
      return `${baseUrl}/blog/category/${categorySlug}`;
    }
    return `${baseUrl}/blog`;
  };

  const getPaginationUrls = () => {
    if (!currentPage || !totalPages || totalPages <= 1) return null;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || BRAND.domain;
    const basePath = categorySlug ? `/blog/category/${categorySlug}` : '/blog';
    
    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;

    return {
      prev: prevPage ? `${baseUrl}${basePath}?page=${prevPage}` : null,
      next: nextPage ? `${baseUrl}${basePath}?page=${nextPage}` : null
    };
  };

  const getStructuredData = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || BRAND.domain;
    
    if (post) {
      // Article/BlogPosting schema for individual posts
      const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        '@id': `${baseUrl}/discussions/${post.slug}`,
        headline: post.title,
        description: post.excerpt,
        image: post.imageUrl ? `${baseUrl}${post.imageUrl}` : `${baseUrl}/og-image.jpg`,
        author: {
          '@type': 'Person',
          name: post.author,
          url: `${baseUrl}/author/${post.author.toLowerCase().replace(/\s+/g, '-')}`
        },
        publisher: {
          '@type': 'Organization',
          name: BRAND.name,
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/logo.png`,
            width: 144,
            height: 144
          },
          url: baseUrl
        },
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${baseUrl}/discussions/${post.slug}`
        },
        articleSection: post.category,
        keywords: post.tags?.join(', '),
        wordCount: Math.ceil((post.content?.length || 0) / 5), // Rough estimate
        timeRequired: `PT${Math.max(1, Math.ceil((post.content?.length || 0) / 1000))}M`, // Reading time estimate
        inLanguage: 'en-US',
        isPartOf: {
          '@type': 'Blog',
          '@id': `${baseUrl}/blog`,
          name: `${BRAND.name} Blog`
        }
      };

      return articleSchema;
    }

    // Blog listing page with multiple structured data types
    const blogSchema = {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      '@id': `${baseUrl}/blog`,
      name: `${BRAND.name} Astrology Blog`,
      description: getMetaDescription(),
      url: `${baseUrl}/blog`,
      inLanguage: 'en-US',
      publisher: {
        '@type': 'Organization',
        name: BRAND.name,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/logo.png`,
          width: 144,
          height: 144
        },
        url: baseUrl,
        sameAs: [
          'https://twitter.com/orbitandchill',
          // Add other social media URLs as needed
        ]
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${baseUrl}/blog?search={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    };

    return blogSchema;
  };

  // NOTE: FAQ Schema removed to prevent SEO conflicts with dedicated FAQ page
  // FAQ content is now centralized in /src/data/faqData.ts and rendered on /faq page
  const getFAQSchema = () => {
    return null; // FAQ schema disabled to prevent conflicts
  };

  // WebSite schema for enhanced search features
  const getWebSiteSchema = () => {
    if (!isHomePage) return null;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || BRAND.domain;
    
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      name: BRAND.name,
      url: baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${baseUrl}/blog?search={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      },
      publisher: {
        '@id': `${baseUrl}/#organization`
      }
    };
  };

  const metaTitle = getMetaTitle();
  const metaDescription = getMetaDescription();
  const canonicalUrl = getCanonicalUrl();
  const structuredData = getStructuredData();
  const faqSchema = getFAQSchema();
  const websiteSchema = getWebSiteSchema();
  const paginationUrls = getPaginationUrls();

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="title" content={metaTitle} />
      <meta name="description" content={metaDescription} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Pagination Meta Tags */}
      {paginationUrls?.prev && <link rel="prev" href={paginationUrls.prev} />}
      {paginationUrls?.next && <link rel="next" href={paginationUrls.next} />}
      
      {/* RSS Feed */}
      <link 
        rel="alternate" 
        type="application/rss+xml" 
        title={`${BRAND.name} Blog RSS Feed`}
        href={`${process.env.NEXT_PUBLIC_BASE_URL || BRAND.domain}/blog/rss.xml`} 
      />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={post ? 'article' : 'website'} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:site_name" content={BRAND.name} />
      <meta property="og:locale" content="en_US" />
      {post?.imageUrl ? (
        <>
          <meta property="og:image" content={`${process.env.NEXT_PUBLIC_BASE_URL || BRAND.domain}${post.imageUrl}`} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content={post.title} />
        </>
      ) : (
        <>
          <meta property="og:image" content={`${process.env.NEXT_PUBLIC_BASE_URL || BRAND.domain}/og-image.jpg`} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content={`${BRAND.name} - Astrology Blog`} />
        </>
      )}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={metaTitle} />
      <meta property="twitter:description" content={metaDescription} />
      <meta property="twitter:site" content="@orbitandchill" />
      <meta property="twitter:creator" content="@orbitandchill" />
      {post?.imageUrl ? (
        <meta property="twitter:image" content={`${process.env.NEXT_PUBLIC_BASE_URL || BRAND.domain}${post.imageUrl}`} />
      ) : (
        <meta property="twitter:image" content={`${process.env.NEXT_PUBLIC_BASE_URL || BRAND.domain}/twitter-image.jpg`} />
      )}

      {/* Article specific meta tags */}
      {post && (
        <>
          <meta property="article:published_time" content={post.publishedAt.toString()} />
          <meta property="article:modified_time" content={post.updatedAt.toString()} />
          <meta property="article:author" content={post.author} />
          <meta property="article:section" content={post.category} />
          {post.tags.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Additional SEO meta tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="language" content="en" />
      <meta httpEquiv="Content-Language" content="en" />
      <meta name="keywords" content="astrology blog, zodiac signs, natal charts, planetary transits, horoscope, astrology guides, cosmic wisdom, birth chart, astrology reading" />
      <meta name="author" content={BRAND.name} />
      <meta name="theme-color" content="#000000" />
      {/* Add Google Search Console verification when ready */}
      {process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && (
        <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION} />
      )}

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* FAQ Schema for homepage */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      
      {/* Website Schema for homepage */}
      {websiteSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      )}
    </Head>
  );
};

export default BlogSEO;