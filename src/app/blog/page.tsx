/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect } from 'react';
import BlogSEO from '@/components/blog/BlogSEO';
import BlogPostCard from '@/components/blog/BlogPostCard';
import FeaturedPostCard from '@/components/blog/FeaturedPostCard';
import BlogSidebar from '@/components/blog/BlogSidebar';
import BlogPagination from '@/components/blog/BlogPagination';
import { useBlogData } from '@/hooks/useBlogData';
import { useCarousel } from '@/hooks/useCarousel';
import { getSectionTitle, shouldShowCarousel } from '@/utils/blogUtils';
import { BookOpen } from 'lucide-react';
import { BRAND } from '@/config/brand';

export default function BlogPage() {
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

  // Set document title
  useEffect(() => {
    document.title = `Astrology Blog - Expert Insights & Cosmic Wisdom | ${BRAND.name}`;
  }, []);

  return (
    <>
      <BlogSEO isHomePage />

      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <div className="min-h-screen bg-white">


          {/* Featured Posts Carousel */}
          {shouldShowCarousel(featuredPosts, filters) && (
            <section className="px-[2%] py-12 border-b border-gray-200">
              <div className="w-full">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Featured Articles</h2>

                  {/* Pagination Boxes */}
                  {featuredPosts.length > 1 && (
                    <div className="flex items-center gap-1">
                      {featuredPosts.map((_, index) => (
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
                    {featuredPosts.map((post) => (
                      <div key={post.id} className="w-full flex-shrink-0">
                        <FeaturedPostCard post={post} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress Indicator */}
                {featuredPosts.length > 1 && (
                  <div className="mt-6 w-full bg-gray-200 border border-black h-2 overflow-hidden">
                    <div
                      className="h-full bg-black transition-all duration-300 ease-out"
                      style={{
                        width: `${((currentFeaturedIndex + 1) / featuredPosts.length) * 100}%`
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
                  {/* Section Header */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {getSectionTitle(filters, categories)}
                    </h2>
                    {filters.searchQuery && (
                      <p className="text-gray-600">
                        Found {paginationInfo.totalPosts} article{paginationInfo.totalPosts !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  {/* Loading State */}
                  {isLoading && (
                    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                          <div className="w-4 h-4 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-4 h-4 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-4 h-4 bg-black rounded-full animate-bounce"></div>
                        </div>
                        <p className="text-gray-600 font-inter">Loading articles...</p>
                      </div>
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
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
                      <p className="text-gray-600 mb-4">
                        {filters.searchQuery
                          ? "Try adjusting your search terms"
                          : "Try selecting a different category"
                        }
                      </p>
                      <button
                        onClick={() => setFilters({})}
                        className="px-4 py-2 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
                      >
                        Clear Filters
                      </button>
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