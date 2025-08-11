/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect } from "react";

// Components
import DiscussionsPageHero from '@/components/discussions/DiscussionsPageHero';
import DiscussionsPageSearch from '@/components/discussions/DiscussionsPageSearch';
import DiscussionsPageSidebar from '@/components/discussions/DiscussionsPageSidebar';
import DiscussionsPageContent from '@/components/discussions/DiscussionsPageContent';
import DiscussionsPagePagination from '@/components/discussions/DiscussionsPagePagination';
import DiscussionsPageGuidelines from '@/components/discussions/DiscussionsPageGuidelines';

// Hooks
import { useDiscussionsPageData } from '@/hooks/useDiscussionsPageData';
import { useDiscussionsFilters } from '@/hooks/useDiscussionsFilters';
import { useDiscussionsPagination } from '@/hooks/useDiscussionsPagination';
import { useDiscussionsPageMeta } from '@/hooks/useDiscussionsPageMeta';

// Types
import { Discussion } from '@/types/discussion';

export default function DiscussionsPage() {
  // Data fetching
  const { discussions, loading, error, loadDiscussions } = useDiscussionsPageData();
  
  // Filters and search
  const {
    selectedCategory,
    sortBy,
    searchQuery,
    sortedDiscussions,
    handleCategoryChange,
    handleSearchChange,
    handleSortChange
  } = useDiscussionsFilters(discussions);
  
  // Pagination
  const {
    currentPage,
    currentItems: currentDiscussions,
    totalPages,
    indexOfFirstItem,
    indexOfLastItem,
    handlePageChange,
    generatePageNumbers,
    hasNextPage,
    hasPrevPage,
    resetToFirstPage
  } = useDiscussionsPagination(sortedDiscussions, 1, 6);
  
  // SEO meta management
  const { updateMetaForFilters } = useDiscussionsPageMeta();

  // Combined handlers that integrate filters with pagination
  const handleCategoryChangeWithReset = (category: string) => {
    handleCategoryChange(category, resetToFirstPage);
  };
  
  const handleSearchChangeWithReset = (query: string) => {
    handleSearchChange(query, resetToFirstPage);
  };
  
  const handleSortChangeWithReset = (sort: string) => {
    handleSortChange(sort, resetToFirstPage);
  };

  // Load discussions on mount and when filters change
  useEffect(() => {
    loadDiscussions({ 
      category: selectedCategory !== "All Categories" ? selectedCategory : undefined,
      sortBy: sortBy as any
    });
  }, [loadDiscussions, selectedCategory, sortBy]);
  
  // Update meta tags when filters change
  useEffect(() => {
    updateMetaForFilters(selectedCategory, searchQuery, sortedDiscussions.length);
  }, [updateMetaForFilters, selectedCategory, searchQuery, sortedDiscussions.length]);


  return (
    <div className="bg-white">
      {/* Hero Section */}
      <DiscussionsPageHero />

      {/* Search Section */}
      <DiscussionsPageSearch 
        searchQuery={searchQuery}
        sortBy={sortBy}
        onSearchChange={handleSearchChangeWithReset}
        onSortChange={handleSortChangeWithReset}
      />

      {/* Main Content Section */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <section className="px-6 md:px-12 lg:px-20 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
            {/* Sidebar */}
            <DiscussionsPageSidebar 
              selectedCategory={selectedCategory}
              discussions={discussions}
              onCategoryChange={handleCategoryChangeWithReset}
            />

            {/* Content */}
            <DiscussionsPageContent
              loading={loading}
              error={error}
              discussions={currentDiscussions}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              onRetry={loadDiscussions}
            />
          </div>
          
          {/* Pagination */}
          <DiscussionsPagePagination
            loading={loading}
            error={error}
            currentPage={currentPage}
            totalPages={totalPages}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
            totalItems={sortedDiscussions.length}
            generatePageNumbers={generatePageNumbers}
            hasNextPage={hasNextPage}
            hasPrevPage={hasPrevPage}
            onPageChange={handlePageChange}
          />
        </section>
      </div>

      {/* Community Guidelines Section */}
      <DiscussionsPageGuidelines />
    </div>
  );
}
