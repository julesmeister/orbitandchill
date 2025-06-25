"use client";

import { useState, useEffect } from 'react';
import SimpleRichTextEditor from '../admin/SimpleRichTextEditor';
import { useDiscussionForm, DiscussionFormData } from '../../hooks/useDiscussionForm';
import ValidationToast from '../reusable/ValidationToast';
import ChartAttachmentButton from '../charts/ChartAttachmentButton';
import VideoAttachmentButton from '../videos/VideoAttachmentButton';
import EmbeddedChartDisplay from '../charts/EmbeddedChartDisplay';
import EmbeddedVideoDisplay from '../videos/EmbeddedVideoDisplay';

interface DiscussionFormProps {
  initialData?: Partial<DiscussionFormData>;
  onSubmit: (data: DiscussionFormData) => void;
  onSaveDraft?: (data: DiscussionFormData) => void;
  onCancel?: () => void;
  onAdminOptionsChange?: (data: DiscussionFormData) => void;
  isLoading?: boolean;
  submitText?: string;
  showBlogPostToggle?: boolean;
  showPublishToggle?: boolean;
  showExcerpt?: boolean;
  showPinToggle?: boolean;
  mode?: 'create' | 'edit';
}

interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
}

interface Tag {
  id: string;
  name: string;
  description?: string;
  usageCount: number;
}

export default function DiscussionForm({
  initialData = {},
  onSubmit,
  onSaveDraft,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onCancel,
  onAdminOptionsChange,
  isLoading = false,
  submitText = 'Post Discussion',
  showBlogPostToggle = false,
  showPublishToggle = false,
  showExcerpt = false,
  showPinToggle = false,
  mode = 'create'
}: DiscussionFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularTags, setPopularTags] = useState<Tag[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isExcerptCollapsed, setIsExcerptCollapsed] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showValidationToast, setShowValidationToast] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const {
    formData,
    tagInput,
    setTagInput,
    handleInputChange,
    handleContentChange,
    handleAddTag,
    handleRemoveTag,
    handleTagInputKeyDown,
    updateFormData,
    validateForm
  } = useDiscussionForm(initialData);

  // Fallback data in case API fails
  const getFallbackCategories = (): Category[] => [
    { id: 'natal', name: 'Natal Chart Analysis', color: '#6bdbff' },
    { id: 'transits', name: 'Transits & Predictions', color: '#f2e356' },
    { id: 'help', name: 'Chart Reading Help', color: '#51bd94' },
    { id: 'synastry', name: 'Synastry & Compatibility', color: '#ff91e9' },
    { id: 'mundane', name: 'Mundane Astrology', color: '#19181a' },
    { id: 'learning', name: 'Learning Resources', color: '#6bdbff' },
    { id: 'general', name: 'General Discussion', color: '#51bd94' }
  ];

  const getFallbackTags = (): Tag[] => [
    { id: 'natal-chart', name: 'natal-chart', usageCount: 50 },
    { id: 'mercury-retrograde', name: 'mercury-retrograde', usageCount: 45 },
    { id: 'relationships', name: 'relationships', usageCount: 40 },
    { id: 'mars', name: 'mars', usageCount: 35 },
    { id: 'synastry', name: 'synastry', usageCount: 30 },
    { id: 'transits', name: 'transits', usageCount: 28 },
    { id: 'planets', name: 'planets', usageCount: 25 },
    { id: 'houses', name: 'houses', usageCount: 22 },
    { id: 'aspects', name: 'aspects', usageCount: 20 },
    { id: 'compatibility', name: 'compatibility', usageCount: 18 },
    { id: 'venus', name: 'venus', usageCount: 15 },
    { id: 'moon', name: 'moon', usageCount: 12 }
  ];

  // Fetch categories and tags from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);

        // Fetch categories and tags in parallel with better error handling
        const [categoriesResponse, tagsResponse] = await Promise.all([
          fetch('/api/categories', {
            headers: { 'Accept': 'application/json' }
          }).catch(err => {
            console.error('Categories API failed:', err);
            return new Response('{}', { status: 500, headers: { 'Content-Type': 'application/json' } });
          }),
          fetch('/api/tags?popular=true&limit=20', {
            headers: { 'Accept': 'application/json' }
          }).catch(err => {
            console.error('Tags API failed:', err);
            return new Response('{}', { status: 500, headers: { 'Content-Type': 'application/json' } });
          })
        ]);

        // Handle categories response
        if (categoriesResponse.ok) {
          try {
            const categoriesData = await categoriesResponse.json();
            if (categoriesData.success) {
              setCategories(categoriesData.categories);
            } else {
              console.warn('Categories API returned error:', categoriesData.error);
              setCategories(getFallbackCategories());
            }
          } catch (parseError) {
            console.error('Failed to parse categories response:', parseError);
            setCategories(getFallbackCategories());
          }
        } else {
          console.warn('Categories API failed with status:', categoriesResponse.status);
          setCategories(getFallbackCategories());
        }

        // Handle tags response
        if (tagsResponse.ok) {
          try {
            const tagsData = await tagsResponse.json();
            if (tagsData.success) {
              setPopularTags(tagsData.tags);
            } else {
              console.warn('Tags API returned error:', tagsData.error);
              setPopularTags(getFallbackTags());
            }
          } catch (parseError) {
            console.error('Failed to parse tags response:', parseError);
            setPopularTags(getFallbackTags());
          }
        } else {
          console.warn('Tags API failed with status:', tagsResponse.status);
          setPopularTags(getFallbackTags());
        }
      } catch (error) {
        console.error('Error fetching form data:', error);
        // Use fallback data
        setCategories(getFallbackCategories());
        setPopularTags(getFallbackTags());
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Collect validation errors
    const errors: string[] = [];
    
    if (!formData.title.trim()) {
      errors.push('Title is required');
    }
    
    if (!formData.content.trim()) {
      errors.push('Content is required');
    } else {
      // Check word and character count using textStats
      const plainText = formData.content.replace(/<[^>]*>/g, ''); // Strip HTML
      const wordCount = plainText.trim().split(/\s+/).filter(word => word.length > 0).length;
      const charCount = plainText.length;
      
      if (wordCount < 10) {
        errors.push(`Content needs at least 10 words (currently ${wordCount})`);
      }
      
      if (charCount < 50) {
        errors.push(`Content needs at least 50 characters (currently ${charCount})`);
      }
    }
    
    if (!formData.category) {
      errors.push('Category selection is required');
    }
    
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidationToast(true);
      return;
    }
    
    onSubmit(formData);
  };

  const handleDraftSave = () => {
    if (!formData.title.trim()) {
      setValidationErrors(['Title is required to save draft']);
      setShowValidationToast(true);
      return;
    }
    if (onSaveDraft) {
      onSaveDraft(formData);
    }
  };

  // Helper function for admin options that both updates form data and auto-saves
  const handleAdminOptionChange = (updates: Partial<DiscussionFormData>) => {
    const newFormData = { ...formData, ...updates };
    updateFormData(updates);
    
    // Auto-save for edit mode
    if (mode === 'edit' && onAdminOptionsChange) {
      setTimeout(() => {
        onAdminOptionsChange(newFormData);
      }, 100); // Small delay to ensure state is updated
    }
  };

  return (
    <div className="bg-white">
      <form onSubmit={handleSubmit} className="space-y-0">
        <div className="">
          {/* Title Section */}
          <div className="p-6">
            <label className="font-space-grotesk text-lg font-bold text-black mb-4 block">
              Discussion Title <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder={`What would you like to ${showBlogPostToggle ? 'write about' : 'discuss'}?`}
              className={`w-full px-4 py-4 border border-black bg-white focus:outline-none focus:ring-2 focus:ring-black/20 text-lg placeholder-black/50 font-inter ${(showBlogPostToggle || showPublishToggle || showPinToggle) ? 'border-b-0' : ''
                }`}
              required
            />
            {/* Admin Options - Connected to Title Field */}
            {(showBlogPostToggle || showPublishToggle || showPinToggle) && (
              <div className=" pb-6">
                <div className="border-l border-r border-b border-t border-black bg-white p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Blog Post Toggle (Admin only) */}
                    {showBlogPostToggle && (
                      <div className="flex gap-0 border border-black overflow-hidden">
                        <button
                          type="button"
                          onClick={() => handleAdminOptionChange({ isBlogPost: true })}
                          className={`group relative px-3 py-2 border-r border-black transition-all duration-300 overflow-hidden ${formData.isBlogPost
                            ? 'bg-[#6bdbff] text-black'
                            : 'bg-white text-black hover:bg-black hover:text-white'
                            }`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                          <span className="relative font-medium text-sm font-inter">Blog Post</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdminOptionChange({ isBlogPost: false })}
                          className={`group relative px-3 py-2 transition-all duration-300 overflow-hidden ${!formData.isBlogPost
                            ? 'bg-[#51bd94] text-black'
                            : 'bg-white text-black hover:bg-black hover:text-white'
                            }`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-green-200/20 to-transparent translate-x-[100%] group-hover:translate-x-[-100%] transition-transform duration-700"></div>
                          <span className="relative font-medium text-sm font-inter">Forum Thread</span>
                        </button>
                      </div>
                    )}

                    {/* Publish Toggle (Admin only) */}
                    {showPublishToggle && (
                      <button
                        type="button"
                        onClick={() => handleAdminOptionChange({ isPublished: !formData.isPublished })}
                        className={`group relative px-3 py-2 border border-black transition-all duration-300 overflow-hidden ${formData.isPublished
                          ? 'bg-[#51bd94] text-black'
                          : 'bg-white text-black hover:bg-black hover:text-white'
                          }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        <div className="relative flex items-center">
                          <div className={`w-4 h-4 border border-black mr-2 flex items-center justify-center transition-all duration-200 ${formData.isPublished ? 'bg-black' : 'bg-white'
                            }`}>
                            {formData.isPublished && (
                              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span className="font-medium text-sm font-inter">Publish</span>
                        </div>
                      </button>
                    )}

                    {/* Pin Toggle (Admin only for blog posts) */}
                    {showPinToggle && formData.isBlogPost && (
                      <button
                        type="button"
                        onClick={() => handleAdminOptionChange({ isPinned: !formData.isPinned })}
                        className={`group relative px-3 py-2 border border-black transition-all duration-300 overflow-hidden ${formData.isPinned
                          ? 'bg-[#ff91e9] text-black'
                          : 'bg-white text-black hover:bg-black hover:text-white'
                          }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-pink-200/20 to-transparent translate-x-[100%] group-hover:translate-x-[-100%] transition-transform duration-700"></div>
                        <div className="relative flex items-center">
                          <div className={`w-4 h-4 border border-black mr-2 flex items-center justify-center transition-all duration-200 ${formData.isPinned ? 'bg-black' : 'bg-white'
                            }`}>
                            {formData.isPinned && (
                              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            )}
                          </div>
                          <span className="font-medium text-sm font-inter">⭐ Feature</span>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>



          {/* Content Section */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="font-space-grotesk text-lg font-bold text-black">
                Content <span className="text-red-500">*</span>
              </label>

              <div className="flex items-center gap-3">
                {/* Chart Attachment Button */}
                <ChartAttachmentButton
                  onChartAttach={(chart) => {
                    updateFormData({ embeddedChart: chart });
                  }}
                  disabled={isLoading}
                />

                {/* Video Attachment Button */}
                <VideoAttachmentButton
                  onVideoAttach={(video) => {
                    updateFormData({ embeddedVideo: video });
                  }}
                  disabled={isLoading}
                />

                {/* Preview Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                  className={`group relative px-3 py-2 border border-black transition-all duration-300 overflow-hidden ${
                    isPreviewMode 
                      ? 'bg-black text-white' 
                      : 'bg-white text-black hover:bg-black hover:text-white'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <div className="relative flex items-center">
                    {isPreviewMode ? (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className="font-medium text-sm font-inter">Edit</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="font-medium text-sm font-inter">Preview</span>
                      </>
                    )}
                  </div>
                </button>

                {/* Excerpt Toggle Button */}
                {showExcerpt && (
                  <button
                    type="button"
                    onClick={() => setIsExcerptCollapsed(!isExcerptCollapsed)}
                    className="group relative px-3 py-2 border border-black bg-white text-black hover:bg-black hover:text-white transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <div className="relative flex items-center">
                      <span className="font-medium text-sm font-inter mr-2">Excerpt</span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${isExcerptCollapsed ? 'rotate-0' : 'rotate-180'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                )}
              </div>
            </div>

            {isPreviewMode ? (
              /* Preview Mode */
              <div className="border border-black bg-white">
                {/* Preview Header */}
                <div className="border-b border-black p-4 bg-gray-50">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="font-space-grotesk font-bold text-black">Post Preview</span>
                  </div>
                </div>
                
                {/* Preview Content */}
                <div className="p-8">
                  {/* Preview Title */}
                  {formData.title && (
                    <h1 className="font-space-grotesk text-3xl font-bold text-black mb-6 border-b border-black pb-3">
                      {formData.title}
                    </h1>
                  )}
                  
                  {/* Preview Meta */}
                  <div className="flex items-center gap-3 text-sm text-black/60 mb-8 font-inter">
                    <time>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</time>
                    <span>•</span>
                    <span>Draft</span>
                    {formData.category && (
                      <>
                        <span>•</span>
                        <span className="px-2 py-1 bg-gray-100 border border-black text-xs">
                          {formData.category}
                        </span>
                      </>
                    )}
                  </div>
                  
                  {/* Preview Embedded Chart */}
                  {formData.embeddedChart && (
                    <div className="mb-8 border border-black">
                      <div className="p-4 bg-gray-50 border-b border-black">
                        <h3 className="font-space-grotesk font-bold text-black text-lg">
                          📊 {formData.embeddedChart.metadata.chartTitle}
                        </h3>
                        <p className="text-sm text-black/70 font-inter mt-1">
                          {formData.embeddedChart.chartType.charAt(0).toUpperCase() + formData.embeddedChart.chartType.slice(1)} Chart
                        </p>
                      </div>
                      <div className="p-6 bg-white">
                        <EmbeddedChartDisplay 
                          chart={formData.embeddedChart} 
                          isPreview={true}
                          showFullDetails={false}
                        />
                      </div>
                    </div>
                  )}

                  {/* Preview Embedded Video */}
                  {formData.embeddedVideo && (
                    <div className="mb-8 border border-black">
                      <div className="p-4 bg-gray-50 border-b border-black">
                        <h3 className="font-space-grotesk font-bold text-black text-lg">
                          📹 {formData.embeddedVideo.title}
                        </h3>
                        <p className="text-sm text-black/70 font-inter mt-1">
                          {formData.embeddedVideo.platform.charAt(0).toUpperCase() + formData.embeddedVideo.platform.slice(1)} Video
                        </p>
                      </div>
                      <div className="p-6 bg-white">
                        <EmbeddedVideoDisplay 
                          video={formData.embeddedVideo} 
                          isPreview={true}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Preview Body */}
                  <div className="prose prose-black max-w-none font-inter">
                    {formData.content ? (
                      <div 
                        className={`
                          text-black leading-relaxed text-lg
                          [&_h1]:font-space-grotesk [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-black [&_h1]:mt-8 [&_h1]:mb-6 [&_h1]:border-b [&_h1]:border-black [&_h1]:pb-3
                          [&_h2]:font-space-grotesk [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-black [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:border-b [&_h2]:border-black [&_h2]:pb-2
                          [&_h3]:font-space-grotesk [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-black [&_h3]:mt-6 [&_h3]:mb-3
                          [&_p]:text-black [&_p]:leading-relaxed [&_p]:mb-6 [&_p]:text-lg
                          [&_strong]:text-black [&_strong]:font-bold
                          [&_em]:text-black [&_em]:italic
                          [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:pl-2 [&_ul]:mb-6 [&_ul]:space-y-2
                          [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:pl-2 [&_ol]:mb-6 [&_ol]:space-y-2
                          [&_li]:text-black [&_li]:leading-relaxed [&_li]:text-lg [&_li]:ml-0 [&_li]:pl-1
                          [&_blockquote]:border-l-4 [&_blockquote]:border-black [&_blockquote]:bg-gray-50 [&_blockquote]:pl-6 [&_blockquote]:pr-4 [&_blockquote]:py-4 [&_blockquote]:italic [&_blockquote]:mb-6 [&_blockquote]:text-black/80
                          [&_code]:bg-gray-100 [&_code]:px-2 [&_code]:py-1 [&_code]:font-mono [&_code]:text-sm [&_code]:border [&_code]:border-gray-300 [&_code]:rounded
                          [&_pre]:bg-gray-900 [&_pre]:text-white [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:border [&_pre]:border-black [&_pre]:rounded [&_pre]:mb-6 [&_pre]:overflow-x-auto
                          [&_a]:text-black [&_a]:underline [&_a]:underline-offset-4 [&_a]:font-medium hover:[&_a]:bg-black hover:[&_a]:text-white [&_a]:transition-colors [&_a]:px-1 [&_a]:py-0.5
                          [&_img]:rounded [&_img]:border [&_img]:border-black [&_img]:mb-6 [&_img]:max-w-full [&_img]:h-auto
                        `}
                        dangerouslySetInnerHTML={{ __html: formData.content }}
                      />
                    ) : (
                      <p className="text-black/50 italic font-inter">
                        Your post content will appear here...
                      </p>
                    )}
                  </div>
                  
                  {/* Preview Tags */}
                  {formData.tags.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-black">
                      <div className="flex flex-wrap gap-3 items-center">
                        <span className="font-space-grotesk text-sm font-bold text-black">Tags:</span>
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag, index) => (
                            <span 
                              key={index}
                              className="inline-flex items-center px-3 py-1 bg-black text-white text-sm border border-black font-inter"
                            >
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                              </svg>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Edit Mode */
              <div>
                {/* Attached Media Indicators (Edit Mode Only) */}
                {(formData.embeddedChart || formData.embeddedVideo) && (
                  <div className="mb-4 p-3 bg-gray-50 border border-gray-300 rounded">
                    <div className="flex items-center gap-2 text-sm text-black/70 font-inter">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      <span>
                        {formData.embeddedChart && formData.embeddedVideo 
                          ? "Chart and video attached" 
                          : formData.embeddedChart 
                            ? "Chart attached" 
                            : "Video attached"
                        }
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsPreviewMode(true)}
                        className="ml-auto text-xs text-black underline hover:bg-black hover:text-white px-2 py-1 transition-colors"
                      >
                        View in Preview
                      </button>
                    </div>
                  </div>
                )}
                
                <SimpleRichTextEditor
                content={formData.content}
                onChange={handleContentChange}
                placeholder="Share your thoughts, questions, or insights in detail..."
                className="border border-black focus-within:border-black"
                showWordCount={true}
                showValidation={true}
                minWords={10}
                minCharacters={50}
                showPreview={false}
                allowFullscreen={true}
              />
              </div>
            )}

            {/* Excerpt (Admin only) - Collapsible */}
            {showExcerpt && !isExcerptCollapsed && (
              <div className="mt-6 pt-6 border-t border-black">
                <label className="font-space-grotesk text-lg font-bold text-black mb-4 block">
                  Excerpt <span className="text-black/60 font-inter text-sm">(optional)</span>
                </label>

                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Brief description of the post..."
                  className="w-full px-4 py-3 border border-black bg-white focus:outline-none focus:ring-2 focus:ring-black/20 resize-vertical placeholder-black/50 font-inter"
                />
              </div>
            )}
          </div>

          {/* Category Selection */}
          <div className="p-6">
            <label className="font-space-grotesk text-lg font-bold text-black mb-4 block">
              Category <span className="text-red-500">*</span>
            </label>

            {loadingData ? (
              <div className="flex items-center gap-2 p-4 border border-black">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                <span className="text-sm text-black/70">Loading categories...</span>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {categories.map(category => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => updateFormData({ category: category.name })}
                    className={`px-4 py-2 text-sm font-medium border border-black transition-all duration-300 font-inter ${formData.category === category.name
                      ? 'bg-black text-white'
                      : 'bg-white text-black hover:bg-black hover:text-white'
                      }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tags Section */}
          <div className="p-6">
            <label className="font-space-grotesk text-lg font-bold text-black mb-4 block">
              Tags
            </label>

            {/* Tag Input */}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Type a tag and press Enter..."
              className="w-full px-4 py-3 border border-black bg-white focus:outline-none focus:ring-2 focus:ring-black/20 placeholder-black/50 font-inter mb-4"
            />

            {/* Tag Display */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 p-4 bg-white border border-black mb-4">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 text-sm bg-black text-white border border-black font-inter"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-white hover:text-gray-300 w-4 h-4 flex items-center justify-center transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Popular tags */}
            <div className="border border-black p-4">
              <p className="text-sm font-space-grotesk font-bold text-black mb-3">Popular tags:</p>
              {loadingData ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                  <span className="text-sm text-black/70">Loading tags...</span>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {popularTags.slice(0, 12).map(tag => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleAddTag(tag.name)}
                      className="bg-white text-black px-3 py-1 text-sm border border-black hover:bg-black hover:text-white transition-all duration-300 font-inter"
                      title={tag.description}
                    >
                      #{tag.name} {tag.usageCount > 10 && <span className="text-xs opacity-70">({tag.usageCount})</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="-mx-8 -mb-8 border-t border-black">
          <div className={`grid gap-0 ${mode === 'create' && onSaveDraft ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {mode === 'create' && onSaveDraft && (
              <button
                type="button"
                onClick={handleDraftSave}
                disabled={isLoading}
                className={`group relative p-6 text-center font-space-grotesk font-semibold border-r border-black bg-white transition-all duration-300 overflow-hidden ${!isLoading
                  ? 'text-black hover:bg-black hover:text-white'
                  : 'text-gray-400 cursor-not-allowed bg-gray-50'
                  }`}
              >
                {/* Animated background on hover */}
                {!isLoading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                )}

                <div className="relative flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving Draft...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Save Draft
                    </>
                  )}
                </div>
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative p-6 text-center font-space-grotesk font-semibold transition-all duration-300 overflow-hidden ${!isLoading
                ? 'bg-black text-white hover:bg-gray-800 hover:shadow-lg hover:shadow-black/25 hover:-translate-y-0.5'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              {/* Success gradient animation on hover */}
              {!isLoading && (
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-green-300/20 to-transparent translate-x-[100%] group-hover:translate-x-[-100%] transition-transform duration-500"></div>
              )}

              <div className="relative flex items-center justify-center">
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Publishing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    {submitText}
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </form>
      
      {/* Validation Toast */}
      <ValidationToast
        title="Required Fields Missing"
        errors={validationErrors}
        isVisible={showValidationToast}
        onClose={() => setShowValidationToast(false)}
        autoHide={true}
        autoHideDelay={6000}
      />
    </div>
  );
}