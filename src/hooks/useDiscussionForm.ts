/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useMemo, useEffect } from 'react';
import { getTextStats, validateTextLength, extractExcerpt, type TextStats } from '@/utils/textUtils';
import { EmbeddedChart, EmbeddedVideo } from '../types/threads';
import { generateSlug } from '@/utils/slugify';

export interface DiscussionFormData {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  slug?: string;
  authorName?: string; // Admin-editable author name
  isBlogPost?: boolean;
  isPublished?: boolean;
  isPinned?: boolean;
  embeddedChart?: EmbeddedChart;
  embeddedVideo?: EmbeddedVideo;
  thumbnailUrl?: string; // Automatically extracted from first image in content
}

export function useDiscussionForm(initialData: Partial<DiscussionFormData> = {}, onAdminOptionsChange?: (data: DiscussionFormData) => void) {
  const [formData, setFormData] = useState<DiscussionFormData>({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [],
    slug: '',
    authorName: '',
    isBlogPost: false,
    isPublished: false,
    isPinned: false,
    embeddedChart: undefined,
    embeddedVideo: undefined,
    thumbnailUrl: undefined,
    ...initialData
  });
  const [tagInput, setTagInput] = useState('');
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [hasManuallyEditedSlug, setHasManuallyEditedSlug] = useState(false);
  const [isEditingAuthor, setIsEditingAuthor] = useState(false);
  const [lastUserInteraction, setLastUserInteraction] = useState<number>(0);

  // Update form data when initialData changes (for edit mode)
  useEffect(() => {
    // Only update if initialData has meaningful content and is different from current state
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(prev => {
        // Check if the data is actually different to avoid unnecessary updates
        const hasChanges = Object.keys(initialData).some(key => {
          return initialData[key as keyof DiscussionFormData] !== prev[key as keyof DiscussionFormData];
        });
        
        // Don't override user changes that happened in the last 10 seconds
        const timeSinceLastInteraction = Date.now() - lastUserInteraction;
        const recentUserInteraction = lastUserInteraction > 0 && timeSinceLastInteraction < 10000; // 10 seconds
        
        if (hasChanges) {
          
          if (recentUserInteraction) {
            return prev;
          }
          
          return {
            ...prev,
            ...initialData
          };
        }
        return prev;
      });
    }
  }, [
    (initialData as any)?.id,
    initialData?.title,
    initialData?.content,
    initialData?.category,
    initialData?.excerpt,
    initialData?.tags,
    initialData?.slug,
    initialData?.authorName,
    initialData?.isBlogPost,
    initialData?.isPublished,
    initialData?.isPinned,
    initialData?.embeddedChart,
    initialData?.embeddedVideo,
    initialData?.thumbnailUrl
  ]);

  // Auto-generate slug from title when title changes (if not manually edited)
  useEffect(() => {
    if (!hasManuallyEditedSlug && formData.title) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(formData.title)
      }));
    }
  }, [formData.title, hasManuallyEditedSlug]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setLastUserInteraction(Date.now()); // Track user interaction
    
    if (name === 'slug') {
      // Mark slug as manually edited when user types in it
      setHasManuallyEditedSlug(true);
      setFormData({
        ...formData,
        slug: generateSlug(value) // Ensure slug is always URL-safe
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleContentChange = (content: string) => {
    setLastUserInteraction(Date.now()); // Track user interaction
    setFormData({
      ...formData,
      content
    });
  };

  const handleAddTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      const newFormData = {
        ...formData,
        tags: [...formData.tags, tag]
      };
      setFormData(newFormData);
      
      // Notify parent component about the change
      if (onAdminOptionsChange) {
        onAdminOptionsChange(newFormData);
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newFormData = {
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    };
    setFormData(newFormData);
    
    // Notify parent component about the change
    if (onAdminOptionsChange) {
      onAdminOptionsChange(newFormData);
    }
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!formData.tags.includes(newTag)) {
        const newFormData = {
          ...formData,
          tags: [...formData.tags, newTag]
        };
        setFormData(newFormData);
        
        // Notify parent component about the change
        if (onAdminOptionsChange) {
          onAdminOptionsChange(newFormData);
        }
      }
      setTagInput('');
    }
  };

  const updateFormData = (updates: Partial<DiscussionFormData>) => {
    setLastUserInteraction(Date.now()); // Track user interaction
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Text statistics for content
  const contentStats = useMemo(() => {
    return getTextStats(formData.content);
  }, [formData.content]);

  // Text statistics for title
  const titleStats = useMemo(() => {
    return getTextStats(formData.title);
  }, [formData.title]);

  // Auto-generate excerpt if not provided
  const autoExcerpt = useMemo(() => {
    if (formData.excerpt.trim()) {
      return formData.excerpt;
    }
    return extractExcerpt(formData.content, 25);
  }, [formData.content, formData.excerpt]);

  // Enhanced validation with text requirements
  const validateForm = () => {
    const titleValid = formData.title.trim().length > 0;
    const contentValidation = validateTextLength(formData.content, 10, 50);
    
    return titleValid && contentValidation.isValid;
  };

  // Get validation errors for display
  const getValidationErrors = () => {
    const errors: string[] = [];
    
    if (!formData.title.trim()) {
      errors.push('Title is required');
    }
    
    const contentValidation = validateTextLength(formData.content, 10, 50);
    if (!contentValidation.isValid) {
      errors.push(...contentValidation.errors);
    }
    
    if (!formData.category) {
      errors.push('Category is required');
    }
    
    return errors;
  };

  const handleSlugEdit = () => {
    setIsEditingSlug(true);
  };

  const handleSlugBlur = () => {
    setIsEditingSlug(false);
  };

  const resetSlugFromTitle = () => {
    setHasManuallyEditedSlug(false);
    setFormData(prev => ({
      ...prev,
      slug: generateSlug(prev.title)
    }));
  };

  const handleAuthorEdit = () => {
    setIsEditingAuthor(true);
  };

  const handleAuthorBlur = () => {
    setIsEditingAuthor(false);
  };

  return {
    formData,
    tagInput,
    setTagInput,
    handleInputChange,
    handleContentChange,
    handleAddTag,
    handleRemoveTag,
    handleTagInputKeyDown,
    updateFormData,
    validateForm,
    // New text utilities
    contentStats,
    titleStats,
    autoExcerpt,
    getValidationErrors,
    // Slug editing
    isEditingSlug,
    hasManuallyEditedSlug,
    handleSlugEdit,
    handleSlugBlur,
    resetSlugFromTitle,
    // Author editing
    isEditingAuthor,
    handleAuthorEdit,
    handleAuthorBlur
  };
}