/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

interface Thread {
  id: string;
  isBlogPost: boolean;
  isPublished: boolean;
  isPinned: boolean;
}

interface PostsFiltersProps {
  threads: Thread[];
  currentFilter: 'all' | 'published' | 'draft' | 'blog' | 'forum' | 'featured';
  onFilterChange: (filter: 'all' | 'published' | 'draft' | 'blog' | 'forum' | 'featured') => void;
}

export default function PostsFilters({ threads, currentFilter, onFilterChange }: PostsFiltersProps) {
  const blogPosts = threads.filter((t: Thread) => t.isBlogPost);
  const forumThreads = threads.filter((t: Thread) => !t.isBlogPost);
  const publishedCount = threads.filter((t: Thread) => t.isPublished).length;
  const featuredCount = threads.filter((t: Thread) => t.isPinned).length;

  const filterOptions = [
    { key: 'all' as const, label: 'All Posts', count: threads.length },
    { key: 'published' as const, label: 'Published', count: publishedCount },
    { key: 'draft' as const, label: 'Drafts', count: threads.length - publishedCount },
    { key: 'blog' as const, label: 'Blog Posts', count: blogPosts.length },
    { key: 'forum' as const, label: 'Forum Threads', count: forumThreads.length },
    { key: 'featured' as const, label: '⭐ Featured', count: featuredCount },
  ];

  return (
    <div className="bg-white border border-black p-4">
      <div className="flex flex-wrap gap-2">
        {filterOptions.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => onFilterChange(key)}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 border font-open-sans ${
              currentFilter === key
                ? 'bg-[#f2e356] text-black border-black'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-black'
            }`}
          >
            {label} ({count})
          </button>
        ))}
      </div>
    </div>
  );
}