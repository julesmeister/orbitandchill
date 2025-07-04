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

export function useDiscussionForm(initialData: Partial<DiscussionFormData> = {}) {
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

  // Update form data when initialData changes (for edit mode)
  useEffect(() => {
    // Only update if initialData has meaningful content and is different from current state
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(prev => {
        // Check if the data is actually different to avoid unnecessary updates
        const hasChanges = Object.keys(initialData).some(key => {
          return initialData[key as keyof DiscussionFormData] !== prev[key as keyof DiscussionFormData];
        });
        
        if (hasChanges) {
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
    
    console.log('🔍 handleInputChange called:', { name, value });
    
    if (name === 'slug') {
      // Mark slug as manually edited when user types in it
      setHasManuallyEditedSlug(true);
      setFormData({
        ...formData,
        slug: generateSlug(value) // Ensure slug is always URL-safe
      });
    } else {
      setFormData(prev => {
        const newData = {
          ...prev,
          [name]: value
        };
        console.log('🔍 Form data updated:', newData);
        console.log('🔍 New authorName value:', newData.authorName);
        return newData;
      });
    }
  };

  const handleContentChange = (content: string) => {
    setFormData({
      ...formData,
      content
    });
  };

  const handleAddTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag]
      });
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
      setTagInput('');
    }
  };

  const updateFormData = (updates: Partial<DiscussionFormData>) => {
    // console.log('🔍 updateFormData called with:', updates);
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      // console.log('🔍 updateFormData - New form data:', newData);
      // console.log('🔍 updateFormData - New authorName:', newData.authorName);
      return newData;
    });
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