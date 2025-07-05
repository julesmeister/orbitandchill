/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types/blog';
import { Clock, Eye, Calendar, Tag, Star } from 'lucide-react';
import AnimatedZodiacCard from './AnimatedZodiacCard';

interface FeaturedPostCardProps {
  post: BlogPost;
}

const FeaturedPostCard: React.FC<FeaturedPostCardProps> = ({ post }) => {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <article className="bg-white border-2 border-black rounded-none overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
      {/* Featured Badge */}
      <div className="absolute top-4 left-4 z-10 bg-yellow-400 border border-black px-3 py-1 flex items-center">
        <Star className="w-4 h-4 mr-1 fill-black" />
        <span className="text-sm font-bold uppercase">Featured</span>
      </div>

      <div className="grid md:grid-cols-2 gap-0">
        {/* Image Section */}
        <Link href={`/discussions/${post.slug}`} className="block relative h-64 md:h-full overflow-hidden">
          {post.imageUrl ? (
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <AnimatedZodiacCard 
              category={post.category}
              className="w-full h-full"
              showParticles={true}
            />
          )}
        </Link>

        {/* Content Section */}
        <div className="p-8">
          {/* Category */}
          <div className="mb-4">
            <span className="text-sm uppercase tracking-wider text-gray-600 font-medium">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h2 className="mb-4">
            <Link 
              href={`/discussions/${post.slug}`}
              className="text-2xl md:text-3xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200 line-clamp-2"
            >
              {post.title}
            </Link>
          </h2>

          {/* Excerpt */}
          <p className="text-gray-600 mb-6 line-clamp-4 text-lg">
            {post.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {formattedDate}
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {post.readTime} min read
            </span>
            <span className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {post.viewCount.toLocaleString()} views
            </span>
          </div>

          {/* Author */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <img
                src={post.authorAvatar}
                alt={post.author}
                width={40}
                height={40}
                className="mr-3 object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/images/default-avatar.svg';
                }}
              />
              <div>
                <span className="text-sm font-medium text-gray-700 block">
                  {post.author}
                </span>
                <span className="text-xs text-gray-500">
                  Author
                </span>
              </div>
            </div>

            {/* Read More Button */}
            <Link
              href={`/discussions/${post.slug}`}
              className="px-6 py-2 bg-black text-white font-medium hover:bg-gray-800 transition-colors duration-200 border border-black"
            >
              Read Full Article
            </Link>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 border-t border-gray-200 pt-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-sm hover:bg-gray-200 transition-colors duration-200"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default FeaturedPostCard;