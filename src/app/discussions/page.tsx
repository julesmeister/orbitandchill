"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUserStore } from '@/store/userStore';
import { trackPageView } from '@/utils/analytics';
import { useDiscussions } from '@/hooks/useDiscussions';
import DiscussionsHero from '@/components/discussions/DiscussionsHero';
import DiscussionsSearchFilters from '@/components/discussions/DiscussionsSearchFilters';
import MobileCategoryFilter from '@/components/discussions/MobileCategoryFilter';
import MobileSearchFilters from '@/components/discussions/MobileSearchFilters';
import DiscussionCard from '@/components/discussions/DiscussionCard';
import DiscussionsPagination from '@/components/discussions/DiscussionsPagination';
import DiscussionsLoadingState from '@/components/discussions/DiscussionsLoadingState';
import DiscussionsErrorState from '@/components/discussions/DiscussionsErrorState';
import CommunityStats from '@/components/discussions/CommunityStats';
import StatusToast from '@/components/reusable/StatusToast';
import { BRAND } from '@/config/brand';

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
    case 'Natal Chart Analysis': return '#6bdbff';
    case 'Transits & Predictions': return '#f2e356';
    case 'Chart Reading Help': return '#51bd94';
    case 'Synastry & Compatibility': return '#ff91e9';
    case 'Mundane Astrology': return '#19181a';
    case 'Learning Resources': return '#6bdbff';
    case 'General Discussion': return '#51bd94';
    default: return '#6bdbff';
  }
};

// Remove old cache constants - now handled by useDiscussions hook

export default function DiscussionsPage() {
  // Custom hook for discussions data management
  const {
    discussions,
    loading,
    error,
    selectedCategory,
    sortBy,
    searchQuery,
    currentPage,
    discussionsPerPage,
    filteredDiscussions,
    sortedDiscussions,
    currentDiscussions,
    totalPages,
    refreshDiscussions,
    forceRefresh,
    handleCategoryChange,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    updateDiscussionVotes,
    // Cache state
    isFromCache,
    isFetchingFresh,
    cacheAge,
  } = useDiscussions();

  // Toast state for background refresh notifications
  const [showToast, setShowToast] = useState(false);

  // User store integration
  const { user, ensureAnonymousUser, loadProfile } = useUserStore();

  // Load user profile on mount
  useEffect(() => {
    const initUser = async () => {
      await loadProfile();
      const currentUser = useUserStore.getState().user;
      if (!currentUser) {
        await ensureAnonymousUser();
      }
    };
    initUser();
  }, []); // Remove dependencies to prevent infinite loop - run only once

  // Show/hide toast based on background refresh state
  useEffect(() => {
    if (isFetchingFresh && isFromCache) {
      setShowToast(true);
    } else if (!isFetchingFresh && showToast) {
      // Hide toast after fresh data is loaded
      setTimeout(() => setShowToast(false), 2000);
    }
  }, [isFetchingFresh, isFromCache, showToast]);

  // Set document title and meta tags
  useEffect(() => {
    document.title = `Astrology Discussions - ${BRAND.name} Community`;

    // Track page view analytics
    trackPageView('/discussions');
  }, []);

  // Initial loading state (no cached data)
  if (loading && !isFromCache) {
    return <DiscussionsLoadingState />;
  }

  // Error state
  if (error) {
    return <DiscussionsErrorState error={error} onRetry={refreshDiscussions} />;
  }

  return (
    <div className="bg-white">

      {/* Mobile Search Filters */}
      <MobileSearchFilters
        searchQuery={searchQuery}
        sortBy={sortBy}
        loading={loading}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onRefresh={refreshDiscussions}
      />

      {/* Mobile Category Filter */}
      <MobileCategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        discussions={discussions}
      />

      {/* Desktop Search Section */}
      <div className="hidden lg:block">
        <DiscussionsSearchFilters
          searchQuery={searchQuery}
          sortBy={sortBy}
          loading={loading}
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}
          onRefresh={forceRefresh}
        />
      </div>

      {/* Main Content Section */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <section className="px-4 lg:px-6 xl:px-12 2xl:px-20 py-4 lg:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
            {/* Desktop Sidebar - Hidden on mobile */}
            <div className="hidden lg:block lg:col-span-1 border border-black bg-white">
              <div className="p-4 border-b border-black">
                <h3 className="font-space-grotesk text-base font-bold text-black">Categories</h3>
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
                      className={`w-full text-left px-4 py-3 transition-all duration-200 flex items-center justify-between group relative ${selectedCategory === category
                          ? 'bg-black text-white'
                          : 'text-black hover:pl-6'
                        }`}
                    >
                      {/* Animated accent bar on hover */}
                      {selectedCategory !== category && (
                        <div
                          className="absolute left-0 top-0 w-1 h-0 group-hover:h-full transition-all duration-300"
                          style={{ backgroundColor: getCategoryColor(category) }}
                        />
                      )}

                      <span className="font-medium text-sm">{category}</span>
                      <span className={`text-xs px-2 py-1 border ${selectedCategory === category
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

            {/* Content - Full width on mobile, 3/4 width on desktop */}
            <div className="col-span-1 lg:col-span-3 border border-black lg:border-t lg:border-r lg:border-b bg-white">
              
              {/* Cache indicator - show when displaying cached data */}
              {isFromCache && !isFetchingFresh && (
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs text-gray-600 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Showing cached discussions ({cacheAge})</span>
                  </div>
                  <button 
                    onClick={forceRefresh}
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Refresh now
                  </button>
                </div>
              )}
              {currentDiscussions.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="max-w-md mx-auto">
                    <svg className="w-16 h-16 mx-auto text-black/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <h3 className="font-space-grotesk text-xl font-bold text-black mb-2">
                      No discussions found
                    </h3>
                    <p className="text-black/70 mb-4">
                      {searchQuery || selectedCategory !== "All Categories"
                        ? "Try adjusting your search or category filter."
                        : "Database is connected and ready for discussions!"
                      }
                    </p>
                    <Link
                      href="/discussions/new"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-semibold border-2 border-black transition-all duration-300 hover:-translate-y-0.5"
                    >
                      Start the First Discussion
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-black">
                  {currentDiscussions.map((discussion) => (
                    <DiscussionCard
                      key={discussion.id}
                      discussion={discussion}
                      onVoteSuccess={updateDiscussionVotes}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              <DiscussionsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={sortedDiscussions.length}
                itemsPerPage={discussionsPerPage}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Community Guidelines Section */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <section className="px-6 md:px-12 lg:px-20 py-10" style={{ backgroundColor: '#f0e3ff' }}>
          <div className="text-center">
            <h2 className="font-space-grotesk text-3xl font-bold text-black mb-4">
              Community Guidelines
            </h2>
            <p className="font-inter text-lg text-black/80 mb-8 max-w-2xl mx-auto">
              Help us maintain a welcoming and respectful community for all astrology enthusiasts
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-white border border-black">
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center mb-3 mx-auto">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-space-grotesk text-base font-bold text-black mb-2">Be Respectful</h3>
                <p className="text-black/70 text-sm">Treat all members with kindness and respect, regardless of their level of astrological knowledge.</p>
              </div>

              <div className="p-4 bg-white border border-black">
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center mb-3 mx-auto">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-space-grotesk text-base font-bold text-black mb-2">Share Knowledge</h3>
                <p className="text-black/70 text-sm">Share your insights and experiences to help others learn and grow in their astrological journey.</p>
              </div>

              <div className="p-4 bg-white border border-black">
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center mb-3 mx-auto">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-space-grotesk text-base font-bold text-black mb-2">Stay On Topic</h3>
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

      {/* Background refresh status toast */}
      <StatusToast
        title={isFetchingFresh ? "Refreshing Discussions" : "Discussions Updated"}
        message={isFetchingFresh ? `Loading latest discussions... (cached ${cacheAge})` : "Fresh data loaded successfully!"}
        status={isFetchingFresh ? "loading" : "success"}
        isVisible={showToast}
        onHide={() => setShowToast(false)}
        duration={isFetchingFresh ? 0 : 2000}
      />
    </div>
  );
}