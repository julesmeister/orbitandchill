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
import DiscussionContent from "../../../components/discussions/DiscussionContent";
import ReplyForm from "../../../components/discussions/ReplyForm";
import RepliesSection from "../../../components/discussions/RepliesSection";
import DiscussionSidebar from "../../../components/discussions/DiscussionSidebar";

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
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [discussion, setDiscussion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [repliesCount, setRepliesCount] = useState(0);

  // User store integration
  const { user, ensureAnonymousUser, loadProfile } = useUserStore();

  // Initialize user on mount
  useEffect(() => {
    const initUser = async () => {
      await loadProfile();
      if (!user) {
        await ensureAnonymousUser();
      }
    };
    initUser();
  }, [loadProfile, ensureAnonymousUser, user]);

  // Note: Voting is handled by VoteButtons component in DiscussionSidebar

  // Handle reply count updates with cross-check
  const handleReplyCountUpdate = async (newCount: number) => {
    setRepliesCount(newCount);
    
    // Cross-check with database discussion.replies count
    if (discussion && discussion.replies !== newCount) {
      console.log(`🔍 Reply count mismatch detected:`, {
        databaseCount: discussion.replies,
        actualCount: newCount,
        discussionId: discussion.id
      });
      
      try {
        // Update the database to match the actual count
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
    }
    
    // Update local state
    setDiscussion((prev: any) => ({
      ...prev,
      replies: newCount
    }));
  };

  // Cross-check reply count on initial load
  const crossCheckReplyCount = async (discussionData: any) => {
    try {
      // Fetch actual replies to count them
      const repliesResponse = await fetch(`/api/discussions/${discussionData.id}/replies`);
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
          await handleReplyCountUpdate(actualCount);
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

  // Fetch discussion from API
  useEffect(() => {
    async function fetchDiscussion() {
      try {
        setLoading(true);
        const response = await fetch(`/api/discussions/${resolvedParams.id}`);
        const data = await response.json();
        
        if (data.success && data.discussion) {
          setDiscussion(data.discussion);
          setError(null);
          
          // Track analytics - discussion viewed
          trackDiscussionViewed(data.discussion.id, data.discussion.title);
          trackPageView(`/discussions/${data.discussion.id}`);
          
          // Cross-check reply count after setting discussion
          await crossCheckReplyCount(data.discussion);
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
  }, [resolvedParams.id]);

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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading discussion...</p>
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
              url: `https://luckstrology.com/discussions/${resolvedParams.id}`,
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
  const metaTitle = `${discussion.title} | Luckstrology Discussions`;
  const metaDescription =
    discussion.excerpt ||
    `Join the discussion about ${discussion.title} in the ${discussion.category} category. ${discussion.replies} replies and ${discussion.views} views.`;
  const canonicalUrl = `https://luckstrology.com/discussions/${discussion.id}`;
  const imageUrl = `https://luckstrology.com/og-discussion.jpg`; // Consider generating dynamic OG images

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
        <meta property="og:site_name" content="Luckstrology" />

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
            <Link
              href="/discussions"
              className="inline-flex items-center px-6 py-3 text-sm text-black border border-black hover:bg-black hover:text-white transition-all duration-300 font-inter"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Discussions
            </Link>
            
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
      </div>
    </>
  );
}
