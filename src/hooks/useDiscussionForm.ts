/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useMemo, useEffect } from 'react';
import { getTextStats, validateTextLength, extractExcerpt, type TextStats } from '@/utils/textUtils';
import { EmbeddedChart, EmbeddedVideo } from '../types/threads';

export interface DiscussionFormData {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  isBlogPost?: boolean;
  isPublished?: boolean;
  isPinned?: boolean;
  embeddedChart?: EmbeddedChart;
  embeddedVideo?: EmbeddedVideo;
}

export function useDiscussionForm(initialData: Partial<DiscussionFormData> = {}) {
  const [formData, setFormData] = useState<DiscussionFormData>({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [],
    isBlogPost: false,
    isPublished: false,
    isPinned: false,
    embeddedChart: undefined,
    embeddedVideo: undefined,
    ...initialData
  });
  const [tagInput, setTagInput] = useState('');

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
    initialData?.isBlogPost,
    initialData?.isPublished,
    initialData?.isPinned,
    initialData?.embeddedChart,
    initialData?.embeddedVideo
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
    getValidationErrors
  };
}