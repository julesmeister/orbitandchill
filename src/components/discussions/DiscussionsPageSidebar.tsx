/* eslint-disable @typescript-eslint/no-unused-vars */

import CommunityStats from '@/components/discussions/CommunityStats';
import { Discussion } from '@/types/discussion';
import { categories, getCategoryColor, calculateCategoryCounts } from '@/utils/discussionsUtils';

interface DiscussionsPageSidebarProps {
  selectedCategory: string;
  discussions: Discussion[];
  onCategoryChange: (category: string) => void;
}

/**
 * Sidebar Component for Discussions Page
 */
export default function DiscussionsPageSidebar({
  selectedCategory,
  discussions,
  onCategoryChange
}: DiscussionsPageSidebarProps) {
  const categoryCounts = calculateCategoryCounts(discussions, categories);

  return (
    <div className="lg:col-span-1 border border-black bg-white">
      <div className="p-6 border-b border-black">
        <h3 className="font-space-grotesk text-lg font-bold text-black">Categories</h3>
      </div>
      <div className="divide-y divide-black">
        {categories.map((category) => {
          const categoryCount = categoryCounts[category] || 0;
          
          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`w-full text-left px-6 py-4 transition-all duration-200 flex items-center justify-between group relative ${
                selectedCategory === category
                  ? 'bg-black text-white'
                  : 'text-black hover:pl-8'
              }`}
            >
              {/* Animated accent bar on hover */}
              {selectedCategory !== category && (
                <div 
                  className="absolute left-0 top-0 w-1 h-0 group-hover:h-full transition-all duration-300"
                  style={{ backgroundColor: getCategoryColor(category) }}
                />
              )}
              
              <span className="font-medium">{category}</span>
              <span className={`text-xs px-2 py-1 border ${
                selectedCategory === category 
                  ? 'border-white text-white' 
                  : 'border-black text-black'
              }`}>
                {categoryCount}
              </span>
            </button>
          );
        })}
      </div>
      
      {/* Community Stats */}
      <CommunityStats />
    </div>
  );
}