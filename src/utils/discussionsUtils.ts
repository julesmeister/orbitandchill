/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Discussion Utilities
 * Helper functions for discussion-related operations
 */

/**
 * Format time ago in a human-readable format
 */
export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return date.toLocaleDateString();
};

/**
 * Discussion categories list
 */
export const categories = [
  "All Categories",
  "Natal Chart Analysis",
  "Transits & Predictions",
  "Chart Reading Help",
  "Synastry & Compatibility",
  "Mundane Astrology",
  "Learning Resources",
  "General Discussion",
];

/**
 * Get color for a discussion category using Synapsas color mapping
 */
export const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'Natal Chart Analysis': return '#6bdbff';     // blue
    case 'Transits & Predictions': return '#f2e356';   // yellow
    case 'Chart Reading Help': return '#51bd94';       // green
    case 'Synastry & Compatibility': return '#ff91e9'; // purple
    case 'Mundane Astrology': return '#19181a';        // black
    case 'Learning Resources': return '#6bdbff';       // blue
    case 'General Discussion': return '#51bd94';       // green
    default: return '#6bdbff';                          // default blue
  }
};

/**
 * Discussion sort options for UI display
 */
export const sortOptions = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'replies', label: 'Most Replies' },
  { value: 'views', label: 'Most Views' }
];

/**
 * Filter discussions by search query
 */
export const filterDiscussionsBySearch = <T extends { title: string; excerpt: string; tags: string[] }>(
  discussions: T[],
  searchQuery: string
): T[] => {
  if (!searchQuery) return discussions;
  
  const searchLower = searchQuery.toLowerCase();
  return discussions.filter((discussion) => {
    return (
      discussion.title.toLowerCase().includes(searchLower) ||
      discussion.excerpt.toLowerCase().includes(searchLower) ||
      discussion.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  });
};

/**
 * Calculate category counts for discussions
 */
export const calculateCategoryCounts = <T extends { category: string }>(
  discussions: T[], 
  categories: string[]
): Record<string, number> => {
  return categories.reduce((acc, category) => {
    if (category === "All Categories") {
      acc[category] = discussions.length;
    } else {
      acc[category] = discussions.filter(d => d.category === category).length;
    }
    return acc;
  }, {} as Record<string, number>);
};