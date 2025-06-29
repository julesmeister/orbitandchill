/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { use, useState, useEffect, Key } from "react";
import Link from "next/link";
import Head from "next/head";
import { generateDiscussionStructuredData } from "../../../utils/structuredData";
import { useReplyHandling } from "../../../hooks/useReplyHandling";
import { useDiscussionMeta } from "../../../hooks/useDiscussionMeta";
import { useUserStore } from "../../../store/userStore";
import { trackDiscussionViewed, trackPageView } from "../../../utils/analytics";
import { trackDiscussionInteraction } from "../../../hooks/usePageTracking";
import DiscussionContent from "../../../components/discussions/DiscussionContent";
import ReplyForm from "../../../components/discussions/ReplyForm";
import RepliesSection from "../../../components/discussions/RepliesSection";
import DiscussionSidebar from "../../../components/discussions/DiscussionSidebar";
import ConfirmationToast from "../../../components/reusable/ConfirmationToast";
import { BRAND } from "../../../config/brand";

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

export default function DiscussionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const [discussion, setDiscussion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [repliesCount, setRepliesCount] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // User store integration
  const { user, ensureAnonymousUser, loadProfile } = useUserStore();

  // Initialize user on mount
  useEffect(() => {
    const initUser = async () => {
      await loadProfile();
      // Check user state after loading
      const currentUser = useUserStore.getState().user;
      if (!currentUser) {
        await ensureAnonymousUser();
      }
    };
    initUser();
  }, []); // Remove dependencies to prevent infinite loop

  // Note: Voting is handled by VoteButtons component in DiscussionSidebar

  // PERFORMANCE: Optimized reply count updates with debouncing
  const handleReplyCountUpdate = async (newCount: number) => {
    setRepliesCount(newCount);
    
    // Update local state immediately for better UX
    setDiscussion((prev: any) => ({
      ...prev,
      replies: newCount
    }));
    
    // Cross-check with database discussion.replies count (debounced)
    if (discussion && discussion.replies !== newCount) {
      console.log(`🔍 Reply count mismatch detected:`, {
        databaseCount: discussion.replies,
        actualCount: newCount,
        discussionId: discussion.id
      });
      
      // PERFORMANCE: Non-blocking database sync
      setTimeout(async () => {
        try {
          const response = await fetch(`/api/discussions/${discussion.id}/sync-replies`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              actualCount: newCount
            })
          });
          
          if (response.ok) {
            console.log('✅ Database reply count synchronized');
          } else {
            console.error('❌ Failed to sync reply count');
          }
        } catch (error) {
          console.error('❌ Error syncing reply count:', error);
        }
      }, 500); // 500ms debounce
    }
  };

  // PERFORMANCE: Optimized reply count cross-check with caching
  const crossCheckReplyCount = async (discussionData: any) => {
    try {
      // PERFORMANCE: Use cache-first approach for reply count
      const repliesResponse = await fetch(`/api/discussions/${discussionData.id}/replies`, {
        headers: {
          'Cache-Control': 'max-age=60', // Cache for 1 minute
          'Accept': 'application/json'
        }
      });
      
      const repliesData = await repliesResponse.json();
      
      if (repliesData.success && repliesData.replies) {
        const actualCount = repliesData.replies.length;
        const databaseCount = discussionData.replies;
        
        console.log('🔍 Initial reply count check:', {
          discussionId: discussionData.id,
          databaseCount,
          actualCount
        });
        
        if (databaseCount !== actualCount) {
          console.log('🔧 Reply count mismatch on load, syncing...');
          handleReplyCountUpdate(actualCount).catch(() => {}); // Non-blocking
        } else {
          setRepliesCount(actualCount);
        }
      }
    } catch (error) {
      console.error('Error cross-checking reply count:', error);
      // Fall back to database count if cross-check fails
      setRepliesCount(discussionData.replies || 0);
    }
  };

  // PERFORMANCE: Optimized discussion fetching with prefetching
  useEffect(() => {
    async function fetchDiscussion() {
      try {
        setLoading(true);
        
        // PERFORMANCE: Fetch discussion by slug with optimized headers
        const response = await fetch(`/api/discussions/by-slug/${resolvedParams.slug}`, {
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'max-age=300', // Use cache if available
          }
        });
        
        const data = await response.json();
        
        if (data.success && data.discussion) {
          setDiscussion(data.discussion);
          setError(null);
          
          // PERFORMANCE: Prefetch replies data (non-blocking)
          setTimeout(() => {
            fetch(`/api/discussions/${data.discussion.id}/replies`, {
              headers: { 'Cache-Control': 'max-age=60' }
            }).catch(() => {}); // Silent prefetch
          }, 100);
          
          // Track analytics - discussion viewed (legacy and new system)
          trackDiscussionViewed(data.discussion.id, data.discussion.title);
          trackPageView(`/discussions/${data.discussion.slug || resolvedParams.slug}`);
          
          // New analytics system tracking (non-blocking)
          trackDiscussionInteraction('view', data.discussion.id, user?.id).catch(() => {});
          
          // Cross-check reply count after setting discussion
          crossCheckReplyCount(data.discussion).catch(() => {});
        } else {
          setError(data.error || 'Discussion not found');
          setDiscussion(null);
        }
      } catch (err) {
        console.error('Error fetching discussion:', err);
        setError('Failed to load discussion');
        setDiscussion(null);
      } finally {
        setLoading(false);
      }
    }

    fetchDiscussion();
  }, [resolvedParams.slug]);

  // Custom hooks
  const {
    formState,
    isSubmitting,
    handleReplyChange,
    handleReplyToComment,
    handleSubmitReply,
    handleCancelReply,
  } = useReplyHandling(discussion?.id);

  useDiscussionMeta(discussion);

  // Handle discussion deletion
  const handleDeleteDiscussion = async () => {
    if (!user || !discussion) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/discussions/${discussion.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Success - redirect to discussions list
        window.location.href = '/discussions';
      } else {
        alert('Failed to delete discussion: ' + (result.error || 'Unknown error'));
        setIsDeleting(false);
      }
    } catch (error) {
      console.error('Error deleting discussion:', error);
      alert('Failed to delete discussion. Please try again.');
      setIsDeleting(false);
    }
  };

  // SYNAPSAS: Enhanced loading state with skeleton UI
  if (loading) {
    return (
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white">
        {/* Header Skeleton */}
        <section className="px-6 md:px-12 lg:px-20 py-8">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-36 h-10 bg-gray-200 animate-pulse border border-black"></div>
            </div>
            <div className="text-right">
              <div className="w-20 h-6 bg-gray-200 animate-pulse mb-2 ml-auto"></div>
              <div className="w-96 h-10 bg-gray-200 animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Content Skeleton */}
        <section className="px-6 md:px-12 lg:px-20 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
            {/* Main Content Skeleton */}
            <div className="lg:col-span-3 border border-black bg-white">
              <div className="p-6 space-y-4">
                {/* Author info skeleton */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gray-200 animate-pulse rounded-full"></div>
                  <div className="space-y-2">
                    <div className="w-32 h-4 bg-gray-200 animate-pulse"></div>
                    <div className="w-24 h-3 bg-gray-200 animate-pulse"></div>
                  </div>
                </div>
                
                {/* Content skeleton */}
                <div className="space-y-3">
                  <div className="w-full h-4 bg-gray-200 animate-pulse"></div>
                  <div className="w-full h-4 bg-gray-200 animate-pulse"></div>
                  <div className="w-3/4 h-4 bg-gray-200 animate-pulse"></div>
                  <div className="w-full h-4 bg-gray-200 animate-pulse"></div>
                  <div className="w-5/6 h-4 bg-gray-200 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="lg:col-span-1 lg:border-t lg:border-r lg:border-b border-black">
              <div className="p-4 space-y-4">
                <div className="w-full h-8 bg-gray-200 animate-pulse"></div>
                <div className="w-3/4 h-4 bg-gray-200 animate-pulse"></div>
                <div className="w-full h-4 bg-gray-200 animate-pulse"></div>
                <div className="w-2/3 h-4 bg-gray-200 animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Loading indicator */}
        <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-white border border-black px-4 py-2 font-inter">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
          <span className="text-sm text-black">Loading discussion...</span>
        </div>
      </div>
    );
  }

  // Error or not found state
  if (error || !discussion) {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: "Discussion Not Found",
              description: "The requested discussion could not be found.",
              url: `${BRAND.domain}/discussions/${resolvedParams.slug}`,
            }),
          }}
        />
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Discussion Not Found'}
            </h1>
            <Link
              href="/discussions"
              className="text-blue-600 hover:text-blue-700"
            >
              ← Back to Discussions
            </Link>
          </div>
        </div>
      </>
    );
  }

  // For now, we'll show an empty related discussions array
  // TODO: Implement proper related discussions based on category/tags
  const relatedDiscussions: any[] = [];
  const structuredData = generateDiscussionStructuredData(discussion);

  // Generate SEO meta data
  const metaTitle = `${discussion.title} | ${BRAND.name} Discussions`;
  const metaDescription =
    discussion.excerpt ||
    `Join the discussion about ${discussion.title} in the ${discussion.category} category. ${discussion.replies} replies and ${discussion.views} views.`;
  const canonicalUrl = `${BRAND.domain}/discussions/${discussion.slug || resolvedParams.slug}`;
  const imageUrl = `${BRAND.domain}/og-discussion.jpg`; // Consider generating dynamic OG images

  // Safely parse date - handle timestamps, strings, and date formats
  const getValidDate = (dateValue: string | Date | number) => {
    try {
      // Handle Unix timestamps (from database)
      if (typeof dateValue === 'number') {
        const date = new Date(dateValue * 1000); // Convert from Unix timestamp
        return isNaN(date.getTime()) ? new Date() : date;
      }
      const date = new Date(dateValue);
      return isNaN(date.getTime()) ? new Date() : date;
    } catch {
      return new Date();
    }
  };

  const publishedDate = getValidDate(discussion.lastActivity);
  
  // Format date for display without time to avoid "00:00" issue
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta
          name="keywords"
          content={`astrology, ${discussion.category}, ${discussion.tags.join(
            ", "
          )}`}
        />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:site_name" content={BRAND.name} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={imageUrl} />

        {/* Article specific */}
        <meta property="article:author" content={discussion.author} />
        <meta
          property="article:published_time"
          content={publishedDate.toISOString()}
        />
        <meta property="article:section" content={discussion.category} />
        {discussion.tags.map((tag: string | undefined, index: Key | null | undefined) => (
          <meta key={index} property="article:tag" content={tag} />
        ))}
      </Head>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <div
        className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white"
        itemScope
        itemType="https://schema.org/WebPage"
      >
        <meta itemProp="name" content={metaTitle} />
        <meta itemProp="description" content={metaDescription} />
        <meta itemProp="url" content={canonicalUrl} />

        {/* Header Section */}
        <section className="px-6 md:px-12 lg:px-20 py-8">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-3">
              <Link
                href="/discussions"
                className="inline-flex items-center px-6 py-3 text-sm text-black border border-black hover:bg-black hover:text-white transition-all duration-300 font-inter"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Discussions
              </Link>

              {/* Edit and Delete buttons for discussion author */}
              {user && discussion && user.id === discussion.authorId && (
                <>
                  <Link
                    href={`/discussions/new?edit=${discussion.id}`}
                    className="inline-flex items-center px-6 py-3 text-sm text-black border border-black hover:bg-blue-500 hover:text-white transition-all duration-300 font-inter"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </Link>
                  
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isDeleting}
                    className="inline-flex items-center px-6 py-3 text-sm text-white bg-red-600 border border-red-600 hover:bg-red-700 hover:border-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-inter"
                  >
                    {isDeleting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2 justify-end">
                {Boolean(discussion.isPinned) && (
                  <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 12V4a1 1 0 00-1-1H9a1 1 0 00-1 1v8H5.5a1 1 0 00-.8 1.6l6.5 8.67 6.5-8.67A1 1 0 0016.5 12H16z"/>
                  </svg>
                )}
                {Boolean(discussion.isLocked) && (
                  <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z"/>
                  </svg>
                )}
                <span 
                  className="px-3 py-1 text-xs font-medium text-black border border-black font-inter"
                  style={{ backgroundColor: getCategoryColor(discussion.category) }}
                >
                  {discussion.category}
                </span>
              </div>
              <h1 className="font-space-grotesk text-3xl md:text-4xl font-bold text-black mb-3 text-right">
                {discussion.title}
              </h1>
             
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="px-6 md:px-12 lg:px-20 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
            {/* Main Content */}
            <div className="lg:col-span-3 border border-black bg-white">
              <div className="divide-y divide-black">
                <DiscussionContent discussion={discussion} />

                <ReplyForm
                  formState={formState}
                  onReplyChange={handleReplyChange}
                  onSubmit={handleSubmitReply}
                  onCancel={handleCancelReply}
                  isLocked={discussion.isLocked}
                  isSubmitting={isSubmitting}
                />

                <RepliesSection
                  discussionId={discussion.id}
                  onReplyToComment={handleReplyToComment}
                  onReplyCountChange={handleReplyCountUpdate}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 lg:border-t lg:border-r lg:border-b border-black">
              <DiscussionSidebar
                discussion={discussion}
                relatedDiscussions={relatedDiscussions}
              />
            </div>
          </div>
        </section>

        {/* Confirmation Toast for Delete */}
        <ConfirmationToast
          title="Delete Discussion"
          message={`Are you sure you want to delete "${discussion?.title}"? This action cannot be undone and will remove all replies as well.`}
          isVisible={showDeleteConfirm}
          onConfirm={handleDeleteDiscussion}
          onCancel={() => setShowDeleteConfirm(false)}
          confirmText="Delete Forever"
          cancelText="Keep Discussion"
          confirmButtonColor="red"
        />
      </div>
    </>
  );
}
