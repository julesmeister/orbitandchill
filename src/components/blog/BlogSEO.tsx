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
}

const BlogSEO: React.FC<BlogSEOProps> = ({
  title,
  description,
  post,
  isHomePage = false
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
    return `${baseUrl}/blog`;
  };

  const getStructuredData = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || BRAND.domain;
    
    if (post) {
      return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        author: {
          '@type': 'Person',
          name: post.author
        },
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        image: post.imageUrl ? `${baseUrl}${post.imageUrl}` : undefined,
        publisher: {
          '@type': 'Organization',
          name: BRAND.name,
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/logo.png`
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${baseUrl}/blog/${post.slug}`
        }
      };
    }

    // Blog listing page structured data
    return {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: `${BRAND.name} Astrology Blog`,
      description: getMetaDescription(),
      url: `${baseUrl}/blog`,
      publisher: {
        '@type': 'Organization',
        name: BRAND.name,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/logo.png`
        }
      }
    };
  };

  const metaTitle = getMetaTitle();
  const metaDescription = getMetaDescription();
  const canonicalUrl = getCanonicalUrl();
  const structuredData = getStructuredData();

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="title" content={metaTitle} />
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={post ? 'article' : 'website'} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      {post?.imageUrl && (
        <meta property="og:image" content={`${process.env.NEXT_PUBLIC_BASE_URL || BRAND.domain}${post.imageUrl}`} />
      )}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={metaTitle} />
      <meta property="twitter:description" content={metaDescription} />
      {post?.imageUrl && (
        <meta property="twitter:image" content={`${process.env.NEXT_PUBLIC_BASE_URL || BRAND.domain}${post.imageUrl}`} />
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
      <meta name="keywords" content="astrology blog, zodiac signs, natal charts, planetary transits, horoscope, astrology guides, cosmic wisdom" />
      <meta name="author" content={BRAND.name} />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </Head>
  );
};

export default BlogSEO;