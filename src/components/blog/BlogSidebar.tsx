/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { Search, Tag, TrendingUp, Calendar } from 'lucide-react';
import { BlogCategory, BlogFilters } from '@/types/blog';
import { BLOG_CATEGORIES, POPULAR_TAGS } from '@/constants/blog';

interface BlogSidebarProps {
  filters: BlogFilters;
  onFiltersChange: (filters: BlogFilters) => void;
  categories: BlogCategory[];
  popularPosts?: Array<{
    id: string;
    title: string;
    slug: string;
    viewCount: number;
  }>;
  recentPosts?: Array<{
    id: string;
    title: string;
    slug: string;
    publishedAt: Date;
  }>;
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({
  filters,
  onFiltersChange,
  categories,
  popularPosts = [],
  recentPosts = []
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, searchQuery: e.target.value });
  };

  const handleCategoryChange = (categoryId: string) => {
    onFiltersChange({ 
      ...filters, 
      category: categoryId === 'all' ? undefined : categoryId 
    });
  };

  const handleTagClick = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    onFiltersChange({ ...filters, tags: newTags });
  };

  return (
    <aside className="space-y-8">
      {/* Search Box */}
      <div className="bg-white border border-black p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <Search className="w-5 h-5 mr-2" />
          Search Posts
        </h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search blog posts..."
            value={filters.searchQuery || ''}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-none focus:outline-none focus:border-black transition-colors duration-200"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border border-black p-6">
        <h3 className="text-lg font-bold mb-4">Categories</h3>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => handleCategoryChange(category.id)}
                className={`w-full text-left px-3 py-2 rounded-none border transition-colors duration-200 ${
                  (filters.category === category.id || (!filters.category && category.id === 'all'))
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                }`}
              >
                <span className="flex justify-between items-center">
                  <span>{category.name}</span>
                  <span className="text-sm">({category.postCount})</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Popular Tags */}
      <div className="bg-white border border-black p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <Tag className="w-5 h-5 mr-2" />
          Popular Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-3 py-1 text-sm border rounded-sm transition-colors duration-200 ${
                filters.tags?.includes(tag)
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-black'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Popular Posts */}
      {popularPosts.length > 0 && (
        <div className="bg-white border border-black p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Popular Posts
          </h3>
          <ul className="space-y-3">
            {popularPosts.map((post, index) => (
              <li key={post.id} className="pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                <a
                  href={`/blog/${post.slug}`}
                  className="group"
                >
                  <span className="text-sm font-bold text-gray-500 mr-2">
                    {String(index + 1).padStart(2, '0')}.
                  </span>
                  <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
                    {post.title}
                  </span>
                  <span className="block text-xs text-gray-500 mt-1 ml-7">
                    {post.viewCount.toLocaleString()} views
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <div className="bg-white border border-black p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Recent Posts
          </h3>
          <ul className="space-y-3">
            {recentPosts.map((post) => (
              <li key={post.id} className="pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                <a
                  href={`/blog/${post.slug}`}
                  className="block group"
                >
                  <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
                    {post.title}
                  </span>
                  <span className="text-xs text-gray-500 mt-1 block">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

    </aside>
  );
};

export default BlogSidebar;