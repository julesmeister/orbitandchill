/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SynapsasDropdown from '@/components/reusable/SynapsasDropdown';
import CommunityStats from '@/components/discussions/CommunityStats';

// Database-integrated discussion interface
interface Discussion {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  authorId: string | null;
  author?: string; // Populated from user lookup
  avatar?: string; // Generated from author name
  category: string;
  tags: string[];
  replies: number;
  views: number;
  upvotes: number;
  downvotes: number;
  isLocked: boolean;
  isPinned: boolean;
  isBlogPost: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastActivity: Date;
}

// Helper functions
// const getInitials = (name: string) => {
//   return name.split(' ').map(n => n[0]).join('').toUpperCase();
// };

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return date.toLocaleDateString();
};

const categories = [
  "All Categories",
  "Natal Chart Analysis",
  "Transits & Predictions",
  "Chart Reading Help",
  "Synastry & Compatibility",
  "Mundane Astrology",
  "Learning Resources",
  "General Discussion",
];

// Synapsas color mapping for categories
const getCategoryColor = (category: string) => {
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

export default function DiscussionsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [discussionsPerPage] = useState(6);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load discussions from API with fallback
  const loadDiscussions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Determine sort mapping
      let sortMapping: 'recent' | 'popular' | 'replies' | 'views' = 'recent';
      switch (sortBy) {
        case 'popular': sortMapping = 'popular'; break;
        case 'replies': sortMapping = 'replies'; break;
        case 'views': sortMapping = 'views'; break;
        default: sortMapping = 'recent';
      }

      // Build query parameters
      const params = new URLSearchParams({
        sortBy: sortMapping,
        limit: '100',
        isBlogPost: 'false'
      });

      if (selectedCategory !== "All Categories") {
        params.append('category', selectedCategory);
      }

      try {
        // Fetch discussions from API
        const response = await fetch(`/api/discussions?${params}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-cache'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to load discussions');
        }

        // Convert date strings back to Date objects
        const enhancedDiscussions: Discussion[] = data.discussions.map((discussion: Discussion & { createdAt: string; updatedAt: string; lastActivity: string }) => ({
          ...discussion,
          createdAt: new Date(discussion.createdAt),
          updatedAt: new Date(discussion.updatedAt),
          lastActivity: new Date(discussion.lastActivity),
        }));

        setDiscussions(enhancedDiscussions);
      } catch (apiError) {
        
        // Fallback to mock data if API fails
        const fallbackDiscussions: Discussion[] = [
          {
            id: "fallback-1",
            title: "Database Integration in Progress",
            excerpt: "The discussions system is being set up with real database integration. This is temporary sample data.",
            content: "Please wait while we complete the database setup...",
            authorId: "system",
            author: "System",
            avatar: "SY",
            category: "General Discussion",
            tags: ["system", "setup"],
            replies: 0,
            views: 0,
            upvotes: 0,
            downvotes: 0,
            isLocked: false,
            isPinned: true,
            isBlogPost: false,
            isPublished: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            lastActivity: new Date(),
          }
        ];

        setDiscussions(fallbackDiscussions);
      }
    } catch (err) {
      setError('Database connection is being set up. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  // Load discussions on mount and when filters change
  useEffect(() => {
    loadDiscussions();
  }, [selectedCategory, sortBy]); // loadDiscussions is stable, no need to include

  // Set document title and meta tags
  useEffect(() => {
    document.title = "Astrology Discussions - Luckstrology Community";

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    const description =
      "Join our vibrant astrology community to discuss natal charts, transits, synastry, and astrological insights. Connect with fellow astrology enthusiasts and share your experiences.";

    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    const keywords =
      "astrology discussions, natal chart analysis, astrology community, transits, synastry, horoscope forum, astrological insights";

    if (metaKeywords) {
      metaKeywords.setAttribute("content", keywords);
    } else {
      const meta = document.createElement("meta");
      meta.name = "keywords";
      meta.content = keywords;
      document.head.appendChild(meta);
    }
  }, []);

  // Client-side search filtering (database filtering is done server-side by category and sort)
  const filteredDiscussions = discussions.filter((discussion) => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      discussion.title.toLowerCase().includes(searchLower) ||
      discussion.excerpt.toLowerCase().includes(searchLower) ||
      discussion.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  });

  // Discussions are already sorted by the database, but we keep this for client-side search results
  const sortedDiscussions = [...filteredDiscussions];

  // Pagination calculations
  const totalPages = Math.ceil(sortedDiscussions.length / discussionsPerPage);
  const indexOfLastDiscussion = currentPage * discussionsPerPage;
  const indexOfFirstDiscussion = indexOfLastDiscussion - discussionsPerPage;
  const currentDiscussions = sortedDiscussions.slice(
    indexOfFirstDiscussion,
    indexOfLastDiscussion
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset to page 1 when filters change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  // Sort options for dropdown
  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'replies', label: 'Most Replies' },
    { value: 'views', label: 'Most Views' }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="px-[5%] py-16">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-space-grotesk text-5xl md:text-6xl font-bold text-black mb-6">
            Astrology Discussions
          </h1>
          <p className="font-open-sans text-xl text-black/80 leading-relaxed max-w-3xl mx-auto">
            Connect with fellow star enthusiasts, share insights, and explore the mysteries of the cosmos together
          </p>
        </div>
      </section>

      {/* Search Section */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <section className="px-6 md:px-12 lg:px-20 py-8">
          <div className="">
            <div className="flex flex-col lg:flex-row gap-4 items-end">
              <div className="relative flex-1">
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search discussions..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-black placeholder-black/50 focus:outline-none border-b-2 border-black bg-transparent font-open-sans text-lg"
                />
              </div>
              
              <div className="flex items-end gap-4">
                <SynapsasDropdown
                  options={sortOptions}
                  value={sortBy}
                  onChange={handleSortChange}
                  className="w-64"
                />

                {/* CTA Buttons - Moved to search section */}
                <div className="flex items-center gap-3">
                  <Link 
                    href="/discussions/new"
                    className="inline-flex items-center gap-2 px-6 py-4 bg-black text-white font-semibold border-2 border-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25 whitespace-nowrap"
                  >
                    Start Discussion
                  </Link>
                  <Link 
                    href="/guides"
                    className="inline-flex items-center gap-2 px-6 py-4 bg-transparent text-black font-semibold border-2 border-black transition-all duration-300 hover:bg-black hover:text-white hover:-translate-y-0.5 whitespace-nowrap"
                  >
                    Browse Guides
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Main Content Section */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <section className="px-6 md:px-12 lg:px-20 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
          {/* Sidebar */}
          <div className="lg:col-span-1 border border-black bg-white">
            <div className="p-6 border-b border-black">
              <h3 className="font-space-grotesk text-lg font-bold text-black">Categories</h3>
            </div>
            <div className="divide-y divide-black">
              {categories.map((category) => {
                const categoryCount = category === "All Categories" 
                  ? discussions.length 
                  : discussions.filter(d => d.category === category).length;
                
                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
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

          {/* Content */}
          <div className="lg:col-span-3 lg:border-t lg:border-r lg:border-b border-black">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin w-8 h-8 border-4 border-black border-t-transparent rounded-full mb-4"></div>
                <p className="text-black/70">Loading discussions...</p>
              </div>
            ) : error ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                  onClick={loadDiscussions}
                  className="px-4 py-2 bg-black text-white font-medium border border-black hover:bg-gray-800 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : sortedDiscussions.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">No discussions found</h3>
                <p className="text-black/60 mb-4">
                  {searchQuery ? 
                    `No discussions match "${searchQuery}". Try adjusting your search terms.` :
                    `No discussions in ${selectedCategory}. Be the first to start a conversation!`
                  }
                </p>
                <Link 
                  href="/discussions/new"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-semibold border border-black hover:bg-gray-800 transition-colors"
                >
                  Start Discussion
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-black">
                {currentDiscussions.map((discussion) => (
                <div key={discussion.id} className="relative p-6 hover:bg-gray-50 transition-all duration-300 group">
                  {/* Category color indicator */}
                  <div 
                    className="absolute left-0 top-6 w-1 h-8"
                    style={{ backgroundColor: getCategoryColor(discussion.category) }}
                  />
                  
                  <div className="pl-6">
                    {/* Header with badges */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {discussion.isPinned && (
                            <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M16 12V4a1 1 0 00-1-1H9a1 1 0 00-1 1v8H5.5a1 1 0 00-.8 1.6l6.5 8.67 6.5-8.67A1 1 0 0016.5 12H16z"/>
                            </svg>
                          )}
                          {discussion.isLocked && (
                            <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z"/>
                            </svg>
                          )}
                          <Link href={`/discussions/${discussion.id}`}>
                            <h3 className="font-space-grotesk text-lg font-bold text-black hover:text-gray-700 transition-colors">
                              {discussion.title}
                            </h3>
                          </Link>
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center gap-3 text-sm text-black/70 mb-3">
                          <span className="font-medium">{discussion.author}</span>
                          <span>•</span>
                          <span 
                            className="px-2 py-1 text-xs font-medium text-black border border-black"
                            style={{ backgroundColor: getCategoryColor(discussion.category) }}
                          >
                            {discussion.category}
                          </span>
                          <span>•</span>
                          <span>{formatTimeAgo(discussion.lastActivity)}</span>
                        </div>

                        {/* Excerpt */}
                        <p className="text-black/80 mb-4 leading-relaxed">
                          {discussion.excerpt}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {discussion.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 bg-black text-white text-xs font-medium border border-black"
                            >
                              #{tag}
                            </span>
                          ))}
                          {discussion.tags.length > 3 && (
                            <span className="px-2 py-1 bg-white text-black text-xs font-medium border border-black">
                              +{discussion.tags.length - 3}
                            </span>
                          )}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6 text-sm text-black/60">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span>{discussion.replies} replies</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>{discussion.views} views</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                            <span>{discussion.upvotes} votes</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex flex-col gap-2 ml-4">
                        <button className="p-2 text-black hover:bg-black hover:text-white transition-all duration-300 border border-black">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <button className="p-2 text-black hover:bg-black hover:text-white transition-all duration-300 border border-black">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
              <div className="border-t border-black p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-black/70">
                    Showing{" "}
                    <span className="font-medium text-black">
                      {indexOfFirstDiscussion + 1}-
                      {Math.min(indexOfLastDiscussion, sortedDiscussions.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-black">
                      {sortedDiscussions.length}
                    </span>{" "}
                    discussions
                  </div>

                  <div className="text-sm text-black/70">
                    Page{" "}
                    <span className="font-medium text-black">{currentPage}</span>{" "}
                    of{" "}
                    <span className="font-medium text-black">{totalPages}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium border border-black transition-all duration-300 ${
                      currentPage === 1
                        ? "text-black/40 cursor-not-allowed bg-gray-100"
                        : "text-black hover:bg-black hover:text-white"
                    }`}
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1 mx-4">
                    {(() => {
                      const showPages = [];
                      const delta = 2;

                      if (currentPage > delta + 2) {
                        showPages.push(1);
                        if (currentPage > delta + 3) {
                          showPages.push("...");
                        }
                      }

                      for (
                        let i = Math.max(1, currentPage - delta);
                        i <= Math.min(totalPages, currentPage + delta);
                        i++
                      ) {
                        showPages.push(i);
                      }

                      if (currentPage < totalPages - delta - 1) {
                        if (currentPage < totalPages - delta - 2) {
                          showPages.push("...");
                        }
                        showPages.push(totalPages);
                      }

                      return showPages.map((pageNumber, index) => {
                        if (pageNumber === "...") {
                          return (
                            <div key={`ellipsis-${index}`} className="flex items-center justify-center w-10 h-10">
                              <span className="text-black/40">...</span>
                            </div>
                          );
                        }

                        const isCurrentPage = pageNumber === currentPage;
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber as number)}
                            className={`w-10 h-10 text-sm font-medium border border-black transition-all duration-300 ${
                              isCurrentPage
                                ? "bg-black text-white"
                                : "text-black hover:bg-black hover:text-white"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      });
                    })()}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium border border-black transition-all duration-300 ${
                      currentPage === totalPages
                        ? "text-black/40 cursor-not-allowed bg-gray-100"
                        : "text-black hover:bg-black hover:text-white"
                    }`}
                  >
                    Next
                    <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      </div>

      {/* Community Guidelines Section */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <section className="px-6 md:px-12 lg:px-20 py-16" style={{ backgroundColor: '#f0e3ff' }}>
          <div className="text-center">
          <h2 className="font-space-grotesk text-3xl font-bold text-black mb-4">
            Community Guidelines
          </h2>
          <p className="font-open-sans text-lg text-black/80 mb-8 max-w-2xl mx-auto">
            Help us maintain a welcoming and respectful community for all astrology enthusiasts
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-white border border-black">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-space-grotesk text-lg font-bold text-black mb-2">Be Respectful</h3>
              <p className="text-black/70 text-sm">Treat all members with kindness and respect, regardless of their level of astrological knowledge.</p>
            </div>

            <div className="p-6 bg-white border border-black">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-space-grotesk text-lg font-bold text-black mb-2">Share Knowledge</h3>
              <p className="text-black/70 text-sm">Share your insights and experiences to help others learn and grow in their astrological journey.</p>
            </div>

            <div className="p-6 bg-white border border-black">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-space-grotesk text-lg font-bold text-black mb-2">Stay On Topic</h3>
              <p className="text-black/70 text-sm">Keep discussions focused on astrology and related topics to maintain the quality of our community.</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Link 
              href="/community/guidelines"
              className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-semibold border-2 border-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25"
            >
              Read Full Guidelines
            </Link>
            <Link 
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-transparent text-black font-semibold border-2 border-black transition-all duration-300 hover:bg-black hover:text-white hover:-translate-y-0.5"
            >
              Report an Issue
            </Link>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
