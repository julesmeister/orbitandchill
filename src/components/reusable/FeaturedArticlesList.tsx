/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { BlogPost } from '@/types/blog';
import { FeaturedArticlesConfig } from '@/config/sectionConfigs';
import LoadingSpinner from '@/components/reusable/LoadingSpinner';

interface FeaturedArticlesListProps {
  posts: BlogPost[];
  config: FeaturedArticlesConfig;
  className?: string;
  isLoading?: boolean;
}

const FeaturedArticlesList: React.FC<FeaturedArticlesListProps> = React.memo(({
  posts,
  config,
  className = '',
  isLoading = false
}) => {
  const router = useRouter();

  return (
    <div className={`space-y-6 xl:space-y-4 2xl:space-y-10 ${className}`}>
      {/* Header */}
      <div className="border-l-4 border-black pl-4 xl:pl-5 2xl:pl-8">
        <h2 className="font-space-grotesk text-2xl lg:text-3xl xl:text-3xl 2xl:text-4xl font-bold text-black mb-2">
          {config.title}
        </h2>
        <p className="font-open-sans text-black/80 text-sm lg:text-base xl:text-base 2xl:text-lg">
          {config.subtitle}
        </p>
      </div>

      {/* Featured Posts List */}
      <div className="space-y-4">
        {isLoading ? (
          // Skeleton loading state that matches the actual article layout
          Array.from({ length: 3 }).map((_, index) => (
            <div 
              key={`skeleton-${index}`} 
              className="border border-black bg-white animate-pulse"
            >
              <div className="p-4 xl:p-5 2xl:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex-shrink-0 w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                    <div className="flex-1 space-y-2">
                      {/* Title skeleton */}
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                      {/* Excerpt skeleton */}
                      <div className="space-y-1">
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                      {/* Author skeleton */}
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                  {/* Image skeleton */}
                  <div className="w-20 h-20 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 bg-gray-300 flex-shrink-0"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          posts.slice(0, config.maxArticles).map((post) => (
          <div 
            key={post.id} 
            className="border border-black bg-white hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => router.push(`/discussions/${post.slug}`)}
          >
            <div className="p-4 xl:p-5 2xl:p-8">
              <div className="flex items-start gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <h3 className="font-space-grotesk font-bold text-black text-sm lg:text-base xl:text-base 2xl:text-lg mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="font-open-sans text-black/70 text-xs lg:text-sm xl:text-sm 2xl:text-base leading-relaxed mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center">
                      <span className="font-open-sans text-xs lg:text-sm xl:text-sm 2xl:text-base text-black/60">
                        {post.author} • {post.readTime} min read
                      </span>
                    </div>
                  </div>
                </div>
                {post.imageUrl && (
                  <img 
                    src={post.imageUrl} 
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    width={80}
                    height={80}
                    className="w-20 h-20 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 object-cover flex-shrink-0"
                  />
                )}
              </div>
            </div>
          </div>
          ))
        )}
      </div>

      {/* View All Articles Button */}
      <div className="pt-4">
        <button
          onClick={() => router.push(config.viewAllRoute)}
          className="w-full bg-black text-white p-3 font-space-grotesk font-semibold hover:bg-gray-800 transition-all duration-300 border border-black"
        >
          {config.viewAllButtonText}
        </button>
      </div>
    </div>
  );
});

FeaturedArticlesList.displayName = 'FeaturedArticlesList';

export default FeaturedArticlesList;