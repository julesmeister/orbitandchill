/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import DiscussionForm from '../../../components/forms/DiscussionForm';
import { useUserStore } from '../../../store/userStore';
import StatusToast from '../../../components/reusable/StatusToast';
import { generateSlug } from '../../../utils/slugify';
import { DiscussionFormData } from '../../../hooks/useDiscussionForm';
import { useCategories } from '../../../hooks/useCategories';
import { useCategoryCounts } from '../../../hooks/useCategoryCounts';

function NewDiscussionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const isEditMode = !!editId;
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<DiscussionFormData | null>(null);
  const [loadingData, setLoadingData] = useState(isEditMode);
  const [toast, setToast] = useState<{
    title: string;
    message: string;
    status: 'loading' | 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    title: '',
    message: '',
    status: 'info',
    isVisible: false
  });
  const { user, ensureAnonymousUser, loadProfile } = useUserStore();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { categoryCounts } = useCategoryCounts();

  const showToast = (title: string, message: string, status: 'loading' | 'success' | 'error' | 'info') => {
    setToast({
      title,
      message,
      status,
      isVisible: true
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Load user profile and discussion data if editing
  useEffect(() => {
    const loadData = async () => {
      // Load user profile first
      await loadProfile();
      
      // If editing, load the discussion data
      if (isEditMode && editId && user?.id) {
        try {
          setLoadingData(true);
          const response = await fetch(`/api/discussions/${editId}`);
          const data = await response.json();
          
          if (data.success && data.discussion) {
            const discussion = data.discussion;
            
            // Check if current user is the author
            if (discussion.authorId !== user.id) {
              showToast('Access Denied', 'You can only edit your own discussions', 'error');
              setTimeout(() => router.push('/discussions'), 2000);
              return;
            }
            
            // Discussion data loaded for editing

            setInitialData({
              title: discussion.title,
              content: discussion.content,
              excerpt: discussion.excerpt,
              category: discussion.category,
              tags: discussion.tags || [],
              isBlogPost: discussion.isBlogPost,
              isPublished: discussion.isPublished,
              embeddedChart: discussion.embeddedChart || null,
              embeddedVideo: discussion.embeddedVideo || null
            });
          } else {
            showToast('Not Found', 'Discussion not found', 'error');
            setTimeout(() => router.push('/discussions'), 2000);
          }
        } catch (error) {
          showToast('Error', 'Failed to load discussion', 'error');
          setTimeout(() => router.push('/discussions'), 2000);
        } finally {
          setLoadingData(false);
        }
      } else if (isEditMode && editId && !user?.id) {
        // Still loading user, keep showing loading state
        setLoadingData(true);
      } else if (!isEditMode) {
        setLoadingData(false);
      }
    };
    
    loadData();
  }, [loadProfile, isEditMode, editId, user?.id, router]);

  const saveDiscussion = async (formData: DiscussionFormData, isDraft: boolean = false) => {
    setIsLoading(true);
    
    // Ensure we have a user before saving the discussion
    let currentUser = user;
    if (!currentUser) {
      await ensureAnonymousUser();
      // Get the updated user after ensuring anonymous user
      currentUser = useUserStore.getState().user;
    }
    
    
    try {
      const discussionData = {
        ...formData,
        slug: formData.slug ?? generateSlug(formData.title), // Use provided slug or generate one
        excerpt: formData.excerpt || formData.content.substring(0, 150) + '...',
        isBlogPost: false, // Public discussions are forum threads
        isPublished: !isDraft, // Drafts are not published
        isDraft,
        authorId: currentUser?.id, // Include the user ID
        preferredAvatar: currentUser?.preferredAvatar, // Include user's preferred avatar
        embeddedChart: formData.embeddedChart || null,
        embeddedVideo: formData.embeddedVideo || null
      };

      const url = isEditMode ? `/api/discussions/${editId}` : '/api/discussions/create';
      const method = isEditMode ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(discussionData),
      });

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      const result = await response.json();

      if (result.success) {
        // Show success message or toast
        const action = isEditMode ? 'updated' : 'created';
        const message = result.message || (isDraft ? `Draft ${action}!` : `Discussion ${action}!`);
        
        // Use different toast title for fallback mode
        const toastTitle = result.fallbackMode ? 'Created (Offline Mode)' : 'Success!';
        showToast(toastTitle, message, 'success');
        
        // Redirect to the new discussion using its slug
        if (!isDraft && result.discussion) {
          const discussionSlug = formData.slug ?? generateSlug(result.discussion.title || formData.title);
          setTimeout(() => router.push(`/discussions/${discussionSlug}`), 2000);
        } else {
          setTimeout(() => router.push('/discussions'), 2000);
        }
      } else {
        throw new Error(result.error || `Failed to ${isEditMode ? 'update' : 'create'} discussion`);
      }
    } catch (error) {
      showToast('Error', `Failed to ${isEditMode ? 'update' : 'create'} discussion. Please try again.`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (formData: DiscussionFormData) => {
    saveDiscussion(formData, false);
  };

  const handleSaveDraft = (formData: DiscussionFormData) => {
    saveDiscussion(formData, true);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white">
      {/* Header Section */}
      <section className="px-6 md:px-12 lg:px-20 py-8">
        <div className="flex items-start justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-6 py-3 text-sm text-black border border-black hover:bg-black hover:text-white transition-all duration-300 font-open-sans"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Discussions
          </button>
          
          <div className="text-right">
            <h1 className="font-space-grotesk text-4xl md:text-5xl font-bold text-black mb-3">
              {isEditMode ? 'Edit Discussion' : 'Start New Discussion'}
            </h1>
            <p className="font-open-sans text-lg text-black/80 leading-relaxed max-w-lg">
              {isEditMode 
                ? 'Update your discussion with new insights or corrections'
                : 'Share your astrological insights and questions with the community'
              }
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="px-6 md:px-12 lg:px-20 py-8">
        <div className="grid lg:grid-cols-3 gap-0">
          {/* Main Form - Left Columns */}
          <div className="lg:col-span-2 border border-black bg-white">
            <div className="p-8">
              {loadingData ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <div className="w-3 h-3 bg-black animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-3 h-3 bg-black animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-3 h-3 bg-black animate-bounce"></div>
                  </div>
                  <h2 className="font-space-grotesk text-2xl font-bold text-black mb-2">
                    Loading discussion...
                  </h2>
                  <p className="text-black/70">
                    Fetching discussion data for editing.
                  </p>
                </div>
              ) : (
                <DiscussionForm
                  initialData={initialData || {
                    title: '',
                    content: '',
                    excerpt: '',
                    category: '',
                    tags: [],
                    isBlogPost: false
                  }}
                  onSubmit={handleSubmit}
                  onSaveDraft={handleSaveDraft}
                  onCancel={handleCancel}
                  isLoading={isLoading}
                  submitText={isEditMode ? "Update Discussion" : "Post Discussion"}
                  mode={isEditMode ? "edit" : "create"}
                />
              )}
            </div>
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:border-t lg:border-r lg:border-b border-black">
            {/* Community Guidelines */}
            <div className="border-b border-black" style={{ backgroundColor: '#6bdbff' }}>
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-black flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-space-grotesk text-xl font-bold text-black">Community Guidelines</h3>
                    <div className="w-16 h-0.5 bg-black mt-1"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-black flex items-center justify-center mr-3 flex-shrink-0">
                      <div className="w-2 h-2 bg-white"></div>
                    </div>
                    <p className="text-sm text-black font-open-sans leading-6">Be respectful and constructive in your discussions</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-black flex items-center justify-center mr-3 flex-shrink-0">
                      <div className="w-2 h-2 bg-white"></div>
                    </div>
                    <p className="text-sm text-black font-open-sans leading-6">Stay on topic and provide context for your questions</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-black flex items-center justify-center mr-3 flex-shrink-0">
                      <div className="w-2 h-2 bg-white"></div>
                    </div>
                    <p className="text-sm text-black font-open-sans leading-6">Share birth data responsibly (consider using initials)</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-black flex items-center justify-center mr-3 flex-shrink-0">
                      <div className="w-2 h-2 bg-white"></div>
                    </div>
                    <p className="text-sm text-black font-open-sans leading-6">Search existing discussions before posting</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="" style={{ backgroundColor: '#f2e356' }}>
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-black flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-space-grotesk text-xl font-bold text-black">Categories</h3>
                    <div className="w-16 h-0.5 bg-black mt-1"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  {categoriesLoading ? (
                    // Loading state
                    <div className="flex items-center justify-center py-8">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-black animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-black animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-black animate-bounce"></div>
                      </div>
                    </div>
                  ) : categories.length === 0 ? (
                    // Empty state
                    <div className="text-center py-8">
                      <p className="text-sm text-black/60 font-open-sans">No categories available</p>
                    </div>
                  ) : (
                    // Categories list - filter to show only active, non-'All Categories' categories
                    categories
                      .filter(category => category.isActive && category.name !== 'All Categories')
                      .map(category => {
                        // Use real count from the stats API
                        const discussionCount = categoryCounts[category.name] || 0;
                        return { ...category, calculatedCount: discussionCount };
                      })
                      .sort((a, b) => {
                        // Sort by actual discussion count, then by sort order
                        const countDiff = b.calculatedCount - a.calculatedCount;
                        if (countDiff !== 0) return countDiff;
                        return a.sortOrder - b.sortOrder;
                      })
                      .slice(0, 7) // Show top 7 categories
                      .map((category) => {
                        // Use calculated count from stats API
                        const countText = category.calculatedCount === 0 
                          ? 'Be the first to post!' 
                          : `${category.calculatedCount} discussion${category.calculatedCount !== 1 ? 's' : ''}`;
                        
                        return (
                          <button 
                            key={category.id}
                            onClick={() => router.push(`/discussions?category=${encodeURIComponent(category.name)}`)}
                            className="group relative p-4 bg-white border border-black hover:bg-gray-50 transition-all duration-300 cursor-pointer w-full"
                          >
                            {/* Color indicator bar */}
                            <div 
                              className="absolute left-0 top-0 w-1 h-0 group-hover:h-full transition-all duration-300"
                              style={{ backgroundColor: category.color || '#6bdbff' }}
                            />
                            
                            <div className="flex items-center justify-between ml-2">
                              <div className="text-left">
                                <p className="text-sm font-space-grotesk font-bold text-black">{category.name}</p>
                                <p className="text-xs text-black/60 font-open-sans">
                                  {countText}
                                </p>
                              </div>
                              <div className="w-6 h-6 bg-black flex items-center justify-center">
                                <div className="w-2 h-2 bg-white"></div>
                              </div>
                            </div>
                          </button>
                        );
                      })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Status Toast */}
      <StatusToast
        title={toast.title}
        message={toast.message}
        status={toast.status}
        isVisible={toast.isVisible}
        onHide={hideToast}
        duration={toast.status === 'success' ? 5000 : 0}
      />
    </div>
  );
}

export default function NewDiscussionPageClient() {
  return (
    <Suspense fallback={
      <div className="container mx-auto p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <NewDiscussionContent />
    </Suspense>
  );
}