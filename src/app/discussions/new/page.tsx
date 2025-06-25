/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import DiscussionForm from '../../../components/forms/DiscussionForm';
import { useUserStore } from '../../../store/userStore';

interface DiscussionFormData {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  isBlogPost?: boolean;
  isPublished?: boolean;
}

export default function NewDiscussionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const isEditMode = !!editId;
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<DiscussionFormData | null>(null);
  const [loadingData, setLoadingData] = useState(isEditMode);
  const { user, ensureAnonymousUser, loadProfile } = useUserStore();

  // Load user profile and discussion data if editing
  useEffect(() => {
    const loadData = async () => {
      // Load user profile first
      await loadProfile();
      console.log('🔍 Loaded user for discussion:', user?.username, user?.id);
      
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
              alert('You can only edit your own discussions');
              router.push('/discussions');
              return;
            }
            
            setInitialData({
              title: discussion.title,
              content: discussion.content,
              excerpt: discussion.excerpt,
              category: discussion.category,
              tags: discussion.tags || [],
              isBlogPost: discussion.isBlogPost,
              isPublished: discussion.isPublished
            });
          } else {
            alert('Discussion not found');
            router.push('/discussions');
          }
        } catch (error) {
          console.error('Error loading discussion:', error);
          alert('Failed to load discussion');
          router.push('/discussions');
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
    
    console.log(isEditMode ? '📝 Updating discussion' : '📝 Creating discussion', 'with user:', currentUser?.username, currentUser?.id);
    
    try {
      const discussionData = {
        ...formData,
        excerpt: formData.excerpt || formData.content.substring(0, 150) + '...',
        isBlogPost: false, // Public discussions are forum threads
        isPublished: !isDraft, // Drafts are not published
        isDraft,
        authorId: currentUser?.id // Include the user ID
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
        alert(result.message || (isDraft ? `Draft ${action}!` : `Discussion ${action}!`));
        router.push('/discussions');
      } else {
        throw new Error(result.error || `Failed to ${isEditMode ? 'update' : 'create'} discussion`);
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} discussion:`, error);
      alert(`Failed to ${isEditMode ? 'update' : 'create'} discussion. Please try again.`);
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
            className="inline-flex items-center px-6 py-3 text-sm text-black border border-black hover:bg-black hover:text-white transition-all duration-300 font-inter"
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
            <p className="font-inter text-lg text-black/80 leading-relaxed max-w-lg">
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
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mr-3"></div>
                  <span className="text-lg text-black font-inter">Loading discussion...</span>
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
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-black flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <div className="w-2 h-2 bg-white"></div>
                    </div>
                    <p className="text-sm text-black font-inter">Be respectful and constructive in your discussions</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-black flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <div className="w-2 h-2 bg-white"></div>
                    </div>
                    <p className="text-sm text-black font-inter">Stay on topic and provide context for your questions</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-black flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <div className="w-2 h-2 bg-white"></div>
                    </div>
                    <p className="text-sm text-black font-inter">Share birth data responsibly (consider using initials)</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-black flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <div className="w-2 h-2 bg-white"></div>
                    </div>
                    <p className="text-sm text-black font-inter">Search existing discussions before posting</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Topics */}
            <div className="" style={{ backgroundColor: '#f2e356' }}>
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-black flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-space-grotesk text-xl font-bold text-black">Popular Topics</h3>
                    <div className="w-16 h-0.5 bg-black mt-1"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'Mercury Retrograde', count: 42, color: '#ff91e9' },
                    { name: 'Natal Chart Reading', count: 38, color: '#6bdbff' },
                    { name: 'Relationship Synastry', count: 29, color: '#51bd94' },
                    { name: 'Career Astrology', count: 24, color: '#19181a' },
                    { name: 'Transit Analysis', count: 19, color: '#ff91e9' }
                  ].map((topic, index) => (
                    <div key={index} className="group relative p-4 bg-white border border-black hover:bg-gray-50 transition-all duration-300 cursor-pointer">
                      {/* Color indicator bar */}
                      <div 
                        className="absolute left-0 top-0 w-1 h-0 group-hover:h-full transition-all duration-300"
                        style={{ backgroundColor: topic.color }}
                      />
                      
                      <div className="flex items-center justify-between ml-2">
                        <div>
                          <p className="text-sm font-space-grotesk font-bold text-black">{topic.name}</p>
                          <p className="text-xs text-black/60 font-inter">{topic.count} discussions</p>
                        </div>
                        <div className="w-6 h-6 bg-black flex items-center justify-center">
                          <div className="w-2 h-2 bg-white"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}