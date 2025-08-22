/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

interface MobileCategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  discussions?: any[]; // Make optional since we'll use categoryCounts
  categoryCounts?: Record<string, number>;
}

// All categories use consistent black styling per Synapsas guidelines
const getCategoryColor = () => '#19181a'; // Synapsas black

export default function MobileCategoryFilter({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  discussions,
  categoryCounts 
}: MobileCategoryFilterProps) {
  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] lg:hidden">
      <div className="px-4 py-3 bg-white border-t border-b border-gray-200">
        <div 
          className="flex overflow-x-auto gap-2 pb-1 [&::-webkit-scrollbar]:hidden" 
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {categories.map((category) => {
            // Use categoryCounts if provided, otherwise fall back to discussions
            const categoryCount = categoryCounts 
              ? (categoryCounts[category] || 0)
              : (category === "All Categories" 
                  ? (discussions?.length || 0)
                  : (discussions?.filter(d => d.category === category).length || 0));
            
            const isSelected = selectedCategory === category;
            
            return (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 text-sm font-medium border-2 border-black transition-all duration-200 ${
                  isSelected
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-gray-50'
                }`}
              >
                <span className="whitespace-nowrap">
                  {category.replace(' & ', ' & ')}
                </span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${
                  isSelected 
                    ? 'bg-white text-black' 
                    : 'bg-black text-white'
                }`}>
                  {categoryCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}