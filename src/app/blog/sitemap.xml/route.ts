import { NextResponse } from 'next/server';
import { BRAND } from '@/config/brand';

// This would integrate with your actual blog data source
interface BlogPost {
  slug: string;
  publishedAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  slug: string;
  updatedAt: string;
}

function generateSitemap(posts: BlogPost[], categories: Category[]) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || BRAND.domain;
  const currentDate = new Date().toISOString();

  // Main blog pages
  const staticPages = [
    {
      url: `${baseUrl}/blog`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '1.0'
    }
  ];

  // Category pages
  const categoryPages = categories.map(category => ({
    url: `${baseUrl}/blog/category/${category.slug}`,
    lastmod: category.updatedAt,
    changefreq: 'weekly',
    priority: '0.8'
  }));

  // Blog posts (redirected to discussions)
  const postPages = posts.map(post => ({
    url: `${baseUrl}/discussions/${post.slug}`,
    lastmod: post.updatedAt,
    changefreq: 'monthly',
    priority: '0.6'
  }));

  const allPages = [...staticPages, ...categoryPages, ...postPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages.map(page => `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
</urlset>`;

  return sitemap;
}

export async function GET() {
  try {
    let discussionsData = { success: false, discussions: [] };
    let categoriesData = { success: false, categories: [] };
    
    // Skip fetching during build time to avoid connection issues
    if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_BASE_URL) {
      console.log('Skipping API fetch during build, using fallback sitemap data');
    } else {
      // Try to fetch actual blog data and categories, but gracefully fall back
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        
        const [discussionsResponse, categoriesResponse] = await Promise.all([
          fetch(`${baseUrl}/api/discussions?limit=100&sortBy=recent`, {
            signal: AbortSignal.timeout(5000), // 5 second timeout
          }),
          fetch(`${baseUrl}/api/categories`, {
            signal: AbortSignal.timeout(5000), // 5 second timeout
          })
        ]);
        
        if (discussionsResponse.ok) {
          discussionsData = await discussionsResponse.json();
        }
        if (categoriesResponse.ok) {
          categoriesData = await categoriesResponse.json();
        }
      } catch (fetchError) {
        console.warn('Failed to fetch data during sitemap generation, using fallback data:', fetchError);
      }
    }
    
    let posts: BlogPost[] = [];
    let categories: Category[] = [];
    
    // Process blog posts
    if (discussionsData.success && discussionsData.discussions) {
      posts = discussionsData.discussions
        .filter((discussion: any) => discussion.isBlogPost && discussion.isPublished)
        .map((discussion: any) => ({
          slug: discussion.slug || discussion.id,
          publishedAt: discussion.createdAt ? new Date(discussion.createdAt * 1000).toISOString() : new Date().toISOString(),
          updatedAt: discussion.updatedAt ? new Date(discussion.updatedAt * 1000).toISOString() : new Date().toISOString(),
        }));
    }
    
    // Process categories
    if (categoriesData.success && categoriesData.categories) {
      categories = categoriesData.categories.map((category: any) => ({
        id: category.id,
        slug: category.id, // Using ID as slug for now
        updatedAt: new Date().toISOString(),
      }));
    }

    // Fallback data if nothing found
    if (posts.length === 0) {
      posts = [
        {
          slug: 'understanding-your-natal-chart-complete-guide',
          publishedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
    }

    if (categories.length === 0) {
      categories = [
        {
          id: 'natal-charts',
          slug: 'natal-charts',
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'transits',
          slug: 'transits',
          updatedAt: new Date().toISOString(),
        }
      ];
    }

    const sitemap = generateSitemap(posts, categories);

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'max-age=3600, s-maxage=3600',
      },
    });

  } catch (error) {
    console.error('Error generating blog sitemap:', error);
    
    // Fallback sitemap with sample data
    const fallbackPosts: BlogPost[] = [
      {
        slug: 'understanding-your-natal-chart-complete-guide',
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    const fallbackCategories: Category[] = [
      {
        id: 'natal-charts',
        slug: 'natal-charts',
        updatedAt: new Date().toISOString(),
      }
    ];
    
    const sitemap = generateSitemap(fallbackPosts, fallbackCategories);
    
    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'max-age=300', // Shorter cache for fallback
      },
    });
  }
}