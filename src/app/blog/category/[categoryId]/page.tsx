/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import BlogSEO from '@/components/blog/BlogSEO';
import BlogPostCard from '@/components/blog/BlogPostCard';
import FeaturedPostCard from '@/components/blog/FeaturedPostCard';
import BlogSidebar from '@/components/blog/BlogSidebar';
import BlogPagination from '@/components/blog/BlogPagination';
import { useBlogData } from '@/hooks/useBlogData';
import { useCategories } from '@/hooks/useCategories';
import { useCarousel } from '@/hooks/useCarousel';
import { getSectionTitle, shouldShowCarousel } from '@/utils/blogUtils';
import { extractCategoryIdFromSlug } from '@/utils/categorySlugUtils';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { BRAND } from '@/config/brand';
import Link from 'next/link';

interface BlogCategoryPageProps {
  params: Promise<{ categoryId: string }>;
}

export default function BlogCategoryPage({ params }: BlogCategoryPageProps) {
  const resolvedParams = use(params);
  const { categoryId: urlSlug } = resolvedParams;
  const router = useRouter();

  // Extract actual category ID from URL slug
  const categoryId = extractCategoryIdFromSlug(urlSlug) || urlSlug;

  // Get category information
  const { categories: dbCategories, isLoading: categoriesLoading } = useCategories();
  
  // Get blog data and functionality from custom hook
  const {
    featuredPosts,
    posts,
    categories,
    popularPosts,
    recentPosts,
    paginationInfo,
    filters,
    isLoading,
    error,
    setFilters,
    setCurrentPage
  } = useBlogData();

  // Get carousel functionality from custom hook
  const { currentIndex: currentFeaturedIndex, carouselRef, goToIndex: goToFeaturedPost } = useCarousel({
    itemCount: featuredPosts.length
  });

  // Find the current category
  const currentCategory = dbCategories.find(cat => cat.id === categoryId);

  // Set category filter when component mounts or categoryId changes
  useEffect(() => {
    if (categoryId && categoryId !== 'all') {
      setFilters((prevFilters) => ({ ...prevFilters, category: categoryId, sortBy: 'newest' }));
    } else {
      setFilters((prevFilters) => ({ ...prevFilters, category: undefined, sortBy: 'newest' }));
    }
  }, [categoryId, setFilters]);

  // Set document title based on category
  useEffect(() => {
    if (currentCategory) {
      document.title = `${currentCategory.name} - Astrology Blog | ${BRAND.name}`;
    } else {
      document.title = `Category - Astrology Blog | ${BRAND.name}`;
    }
  }, [currentCategory]);

  // If category is not found and not loading, redirect to main blog
  useEffect(() => {
    if (!categoriesLoading && !currentCategory && categoryId !== 'all') {
      router.replace('/blog');
    }
  }, [categoriesLoading, currentCategory, categoryId, router]);

  // Filter featured posts by category
  const categoryFeaturedPosts = featuredPosts.filter(post => {
    if (!currentCategory) return false;
    return post.category.toLowerCase() === currentCategory.name.toLowerCase();
  });

  if (categoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-4 h-4 bg-black animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-4 h-4 bg-black animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-4 h-4 bg-black animate-bounce"></div>
          </div>
          <p className="text-gray-600 font-inter">Loading category...</p>
        </div>
      </div>
    );
  }

  if (!currentCategory && categoryId !== 'all') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Category Not Found</h1>
          <p className="text-gray-600 mb-4">The category you're looking for doesn't exist.</p>
          <Link 
            href="/blog"
            className="inline-flex items-center px-4 py-2 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <BlogSEO 
        isHomePage={false}
        title={currentCategory ? `${currentCategory.name} - Astrology Blog` : 'Category - Astrology Blog'}
        description={currentCategory?.description || 'Browse articles by category'}
      />

      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <div className="min-h-screen bg-white">

          {/* Category Header */}
          <section className="px-[2%] py-8 bg-gray-50 border-b border-gray-200">
            <div className="w-full">
              <div className="flex items-center gap-4 mb-4">
                <Link 
                  href="/blog"
                  className="inline-flex items-center text-sm text-gray-600 hover:text-black transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  All Articles
                </Link>
              </div>
              
              {currentCategory && (
                <>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {currentCategory.name}
                  </h1>
                  {currentCategory.description && (
                    <p className="text-gray-600 text-lg">
                      {currentCategory.description}
                    </p>
                  )}
                  <div className="mt-4 text-sm text-gray-500">
                    {paginationInfo.totalPosts} article{paginationInfo.totalPosts !== 1 ? 's' : ''} in this category
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Featured Posts Carousel - Only show if there are featured posts in this category */}
          {shouldShowCarousel(categoryFeaturedPosts, filters) && (
            <section className="px-[2%] py-12 border-b border-gray-200">
              <div className="w-full">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Featured in {currentCategory?.name}</h2>

                  {/* Pagination Boxes */}
                  {categoryFeaturedPosts.length > 1 && (
                    <div className="flex items-center gap-1">
                      {categoryFeaturedPosts.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToFeaturedPost(index)}
                          className={`w-6 h-6 border-2 border-black transition-all duration-300 font-space-grotesk font-semibold text-xs ${index === currentFeaturedIndex
                              ? 'bg-black text-white'
                              : 'bg-white text-black hover:bg-black hover:text-white'
                            }`}
                          aria-label={`Go to featured article ${index + 1}`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Carousel Container */}
                <div className="relative overflow-hidden">
                  <div
                    ref={carouselRef}
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                      transform: `translateX(-${currentFeaturedIndex * 100}%)`
                    }}
                  >
                    {categoryFeaturedPosts.map((post) => (
                      <div key={post.id} className="w-full flex-shrink-0">
                        <FeaturedPostCard post={post} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress Indicator */}
                {categoryFeaturedPosts.length > 1 && (
                  <div className="mt-6 w-full bg-gray-200 border border-black h-2 overflow-hidden">
                    <div
                      className="h-full bg-black transition-all duration-300 ease-out"
                      style={{
                        width: `${((currentFeaturedIndex + 1) / categoryFeaturedPosts.length) * 100}%`
                      }}
                    />
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Main Content Area */}
          <section className="px-[2%] py-12">
            <div className="w-full">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Main Content */}
                <div className="lg:col-span-9">
                  {/* Loading State */}
                  {isLoading && (
                    <div className="text-center py-12 px-6">
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-4 h-4 bg-black animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-4 h-4 bg-black animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-4 h-4 bg-black animate-bounce"></div>
                      </div>
                      <p className="text-gray-600 font-inter">Loading articles...</p>
                    </div>
                  )}

                  {/* Error State */}
                  {error && (
                    <div className="text-center py-12 px-6 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600">Error: {error}</p>
                    </div>
                  )}

                  {/* Empty State */}
                  {!isLoading && !error && posts.length === 0 && (
                    <div className="text-center py-12 px-6 bg-gray-50 border border-gray-200 rounded-lg">
                      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found in this category</h3>
                      <p className="text-gray-600 mb-4">
                        Check back later for new content in {currentCategory?.name}.
                      </p>
                      <Link
                        href="/blog"
                        className="inline-flex items-center px-4 py-2 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Browse All Articles
                      </Link>
                    </div>
                  )}

                  {/* Blog Posts Grid */}
                  {!isLoading && !error && posts.length > 0 && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                        {posts.map((post) => (
                          <BlogPostCard key={post.id} post={post} />
                        ))}
                      </div>

                      {/* Pagination */}
                      {paginationInfo.totalPages > 1 && (
                        <BlogPagination
                          paginationInfo={paginationInfo}
                          onPageChange={setCurrentPage}
                        />
                      )}
                    </>
                  )}
                </div>

                {/* Sidebar */}
                <aside className="lg:col-span-3">
                  <BlogSidebar
                    filters={filters}
                    onFiltersChange={setFilters}
                    categories={categories}
                    popularPosts={popularPosts}
                    recentPosts={recentPosts}
                  />
                </aside>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}