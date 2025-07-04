/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types/blog';
import { Clock, Eye, Calendar, Tag } from 'lucide-react';
import AnimatedZodiacCard from './AnimatedZodiacCard';
import { trackBlogPost } from '@/lib/analytics';

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <article className="bg-white border border-black rounded-none overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image Section */}
      <Link 
        href={`/discussions/${post.slug}`} 
        className="block relative h-48 overflow-hidden"
        onClick={() => trackBlogPost(post.title, post.category)}
      >
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
      <div className="p-6">
        {/* Category */}
        <div className="mb-3">
          <span className="text-xs uppercase tracking-wider text-gray-600 font-medium">
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-3">
          <Link 
            href={`/discussions/${post.slug}`}
            className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 line-clamp-2"
          >
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {formattedDate}
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {post.readTime} min read
            </span>
          </div>
          <span className="flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            {post.viewCount.toLocaleString()}
          </span>
        </div>

        {/* Author */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={post.authorAvatar}
              alt={post.author}
              width={32}
              height={32}
              className="mr-3 object-cover"
              onError={(e) => {
                e.currentTarget.src = '/images/default-avatar.svg';
              }}
            />
            <span className="text-sm font-medium text-gray-700">
              {post.author}
            </span>
          </div>

          {/* Read More Link */}
          <Link
            href={`/discussions/${post.slug}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            Read More →
          </Link>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-sm hover:bg-gray-200 transition-colors duration-200"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

export default BlogPostCard;