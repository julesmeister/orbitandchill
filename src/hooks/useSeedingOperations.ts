/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from 'react';

export const useSeedingOperations = () => {
  // Process State
  const [seedingInProgress, setSeedingInProgress] = useState(false);
  const [seedingProgress, setSeedingProgress] = useState(0);

  // Seed Users State
  const [seedUsersInitialized, setSeedUsersInitialized] = useState(false);
  const [seedUsersStatus, setSeedUsersStatus] = useState<any>(null);

  // Reply Generation State
  const [generatingReplyForIndex, setGeneratingReplyForIndex] = useState<number | null>(null);
  const [selectedMoodForIndex, setSelectedMoodForIndex] = useState<Record<number, string>>({});
  const [expandedReplies, setExpandedReplies] = useState<Record<number, boolean>>({});

  // Initialize seed users on component mount
  useEffect(() => {
    checkSeedUsersStatus();
  }, []);

  const checkSeedUsersStatus = async () => {
    try {
      const response = await fetch('/api/admin/seed-users/bulk-create');
      const result = await response.json();
      
      if (response.ok) {
        setSeedUsersStatus(result.status);
        setSeedUsersInitialized(result.status?.isReady || false);
      }
    } catch (error) {
      console.error('Error checking seed users status:', error);
    }
  };

  const initializeSeedUsers = async () => {
    try {
      const response = await fetch('/api/admin/seed-users/bulk-create', {
        method: 'POST',
      });
      const result = await response.json();
      
      if (result.success) {
        setSeedUsersInitialized(true);
        await checkSeedUsersStatus();
        return {
          success: true,
          message: `Successfully created ${result.created.users} seed users with configurations`
        };
      } else {
        return {
          success: false,
          error: result.error
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to initialize seed users: ' + (error as Error).message
      };
    }
  };

  const handleProcessPastedContent = async (pastedContent: string, discussionsToGenerate: number) => {
    if (!pastedContent.trim()) {
      return {
        success: false,
        error: 'Please paste some Reddit content first.'
      };
    }

    console.log('Frontend: Sending content length:', pastedContent.length);
    console.log('Frontend: First 200 chars:', pastedContent.substring(0, 200));

    setSeedingInProgress(true);
    setSeedingProgress(10);

    try {
      const response = await fetch('/api/admin/process-pasted-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: pastedContent,
          settings: {
            discussionsToGenerate
          }
        }),
      });

      const result = await response.json();
      setSeedingProgress(50);

      if (result.success) {
        setSeedingProgress(100);
        return { 
          success: true, 
          message: result.message,
          data: result.data,
          scrapedPosts: result.data.length,
          summary: result.summary
        };
      } else {
        return {
          success: false,
          error: result.error
        };
      }

    } catch (error) {
      return {
        success: false,
        error: 'Failed to parse pasted content: ' + (error as Error).message
      };
    } finally {
      setSeedingInProgress(false);
      setSeedingProgress(0);
    }
  };

  const handleProcessWithAI = async (
    scrapedContent: any[],
    aiConfig: any,
    generationSettings: any
  ) => {
    if (scrapedContent.length === 0) {
      return {
        success: false,
        error: 'No content available. Please process pasted content first.'
      };
    }

    if (!aiConfig.apiKey.trim()) {
      return {
        success: false,
        error: 'AI API key is required for transformation.'
      };
    }

    setSeedingInProgress(true);
    setSeedingProgress(60);

    try {
      setSeedingProgress(65);
      const response = await fetch('/api/admin/transform-with-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parsedContent: scrapedContent,
          aiConfig,
          generationSettings
        }),
      });

      setSeedingProgress(80);
      console.log('🔄 Raw response status:', response.status);
      console.log('🔄 Raw response ok:', response.ok);
      
      const result = await response.json();
      console.log('🔄 Parsed API response:', result);
      console.log('🔄 Response success:', result?.success);
      console.log('🔄 Response data type:', typeof result?.data);
      console.log('🔄 Response data length:', result?.data?.length);
      
      setSeedingProgress(100);

      if (result.success) {
        console.log('🔄 Setting preview content from AI transformation:', result.data?.length, 'discussions');
        if (result.data && result.data.length > 0) {
          console.log('🔄 First discussion API response:', result.data[0]);
          console.log('🔄 First discussion structure keys:', Object.keys(result.data[0]));
          console.log('🔄 Has required fields:', {
            transformedTitle: !!result.data[0].transformedTitle,
            transformedContent: !!result.data[0].transformedContent,
            assignedAuthor: !!result.data[0].assignedAuthor
          });
        }
        setExpandedReplies({}); // Clear expanded state for new content
        
        // Auto-scroll to the AI processed content section
        setTimeout(() => {
          const previewSection = document.getElementById('ai-processed-content');
          if (previewSection) {
            previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);

        return {
          success: true,
          message: result.message || 'AI transformation completed successfully',
          data: result.data,
          processedDiscussions: result.data?.length || 0,
          totalReplies: result.summary?.totalReplies || 0,
          batchId: result.batchId,
          summary: result.summary
        };
      } else {
        console.error('🔄 API returned error:', result.error);
        return {
          success: false,
          error: result.error || 'Failed to transform content with AI'
        };
      }

    } catch (error) {
      return {
        success: false,
        error: 'AI processing failed: ' + (error as Error).message
      };
    } finally {
      setSeedingInProgress(false);
    }
  };

  const handleExecuteSeeding = async (
    previewContent: any[],
    batchId: string,
    generationSettings: any
  ) => {
    if (previewContent.length === 0) {
      return {
        success: false,
        error: 'No processed content available. Please process content with AI first.'
      };
    }

    if (!batchId) {
      return {
        success: false,
        error: 'No batch ID available. Please process content with AI first.'
      };
    }

    setSeedingInProgress(true);
    setSeedingProgress(0);

    try {
      const response = await fetch('/api/admin/execute-seeding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          batchId,
          transformedContent: previewContent,
          generationSettings
        }),
      });

      const result = await response.json();
      setSeedingProgress(100);

      if (result.success) {
        return {
          success: true,
          message: result.message,
          finalStats: {
            discussionsCreated: result.results.discussionsCreated,
            repliesCreated: result.results.repliesCreated,
            votesDistributed: result.results.votesCreated,
            errors: result.results.errors
          },
          batchId: result.batchId
        };
      } else {
        return {
          success: false,
          error: result.error
        };
      }

    } catch (error) {
      return {
        success: false,
        error: 'Seeding execution failed: ' + (error as Error).message
      };
    } finally {
      setSeedingInProgress(false);
    }
  };

  // Simple similarity calculation function
  const calculateSimilarity = (text1: string, text2: string): number => {
    if (!text1 || !text2) return 0;
    
    // Convert to lowercase and split into words
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    
    // Find common words
    const commonWords = words1.filter(word => words2.includes(word));
    const totalWords = Math.max(words1.length, words2.length);
    
    return totalWords > 0 ? commonWords.length / totalWords : 0;
  };

  const handleAddReply = async (
    discussionIndex: number,
    previewContent: any[],
    aiConfig: any,
    setPreviewContent: (updater: (prev: any[]) => any[]) => void,
    activePersonas: string[] = [],
    selectedMood?: string
  ) => {
    if (!aiConfig.apiKey.trim()) {
      return {
        success: false,
        error: 'AI API key is required for generating replies.'
      };
    }

    // Prevent multiple simultaneous requests
    if (generatingReplyForIndex !== null) {
      return { success: false, error: 'Already generating reply' };
    }

    setGeneratingReplyForIndex(discussionIndex);

    try {
      const discussionData = previewContent[discussionIndex];
      const currentReplyCount = discussionData.replies ? discussionData.replies.length : 0;
      const finalMood = selectedMood || selectedMoodForIndex[discussionIndex] || 'supportive';
      
      // Debug: Log mood selection
      console.log('🎭 Frontend mood debug:');
      console.log('🎭 discussionIndex:', discussionIndex);
      console.log('🎭 selectedMood param:', selectedMood);
      console.log('🎭 selectedMoodForIndex:', selectedMoodForIndex);
      console.log('🎭 selectedMoodForIndex[discussionIndex]:', selectedMoodForIndex[discussionIndex]);
      console.log('🎭 Final mood being sent:', finalMood);

      const response = await fetch('/api/admin/generate-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          discussionData,
          aiConfig,
          replyIndex: currentReplyCount,
          selectedMood: selectedMood || selectedMoodForIndex[discussionIndex] || 'supportive',
          activePersonas
        }),
      });

      const result = await response.json();

      if (result.success) {
        const discussionData = previewContent[discussionIndex];
        const existingReplies = discussionData.replies || [];
        
        // Check for duplicate users (same user can't reply twice)
        const isDuplicateUser = existingReplies.some((reply: any) => 
          reply.authorName === result.data.authorName
        );
        
        // Check for similar content (prevent very similar replies)
        const isDuplicateContent = existingReplies.some((reply: any) => {
          const similarity = calculateSimilarity(reply.content || '', result.data.content || '');
          return similarity > 0.7; // 70% similarity threshold
        });
        
        if (isDuplicateUser) {
          return {
            success: false,
            error: `${result.data.authorName} has already replied to this discussion. Try generating again for a different user.`,
            lastAction: 'duplicate_user_prevented'
          };
        }
        
        if (isDuplicateContent) {
          return {
            success: false,
            error: `Very similar reply already exists. Try generating again for more variety.`,
            lastAction: 'duplicate_content_prevented'
          };
        }

        // Generate random timestamp between 1 hour and 7 days after discussion creation
        const discussionCreatedAt = new Date();
        const minDelayHours = 1;
        const maxDelayHours = 7 * 24; // 7 days
        const randomDelayHours = minDelayHours + Math.random() * (maxDelayHours - minDelayHours);
        const replyCreatedAt = new Date(discussionCreatedAt.getTime() + (randomDelayHours * 60 * 60 * 1000));

        // Add random timing to the reply data
        const replyWithTiming = {
          ...result.data,
          createdAt: replyCreatedAt.toISOString(),
          scheduledDelay: Math.round(randomDelayHours * 60), // minutes for display
          isTemporary: true // Mark as temporary until final generation
        };

        // Update the preview content with the new reply
        setPreviewContent(prev => prev.map((item, index) => {
          if (index === discussionIndex) {
            const updatedItem = { ...item };
            if (!updatedItem.replies) {
              updatedItem.replies = [];
            }
            
            // Double-check for duplicates before adding (extra safety)
            const isAlreadyAdded = updatedItem.replies.some((existingReply: any) => 
              existingReply.id === replyWithTiming.id || 
              (existingReply.authorName === replyWithTiming.authorName && existingReply.content === replyWithTiming.content)
            );
            
            if (!isAlreadyAdded) {
              // Create new array instead of mutating existing one
              updatedItem.replies = [...updatedItem.replies, replyWithTiming];
              updatedItem.actualReplyCount = updatedItem.replies.length;
            }
            return updatedItem;
          }
          return item;
        }));

        return {
          success: true,
          message: `Successfully added reply by ${result.data.authorName} (scheduled ${Math.round(randomDelayHours)} hours after discussion)`,
          lastAction: 'reply_added'
        };
      } else {
        // Handle specific error cases
        let errorMessage = result.error || 'Failed to generate reply';
        
        if (errorMessage.includes('All available users have already replied')) {
          errorMessage = 'All 5 seed users have already replied! Delete some replies above to add more, or proceed to "Generate Forum" to save this discussion.';
        }
        
        return {
          success: false,
          error: errorMessage
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to generate reply: ' + (error as Error).message
      };
    } finally {
      setGeneratingReplyForIndex(null);
    }
  };

  const handleDeleteReplyById = (
    discussionIndex: number,
    replyId: string,
    setPreviewContent: (updater: (prev: any[]) => any[]) => void
  ) => {
    setPreviewContent(prev => prev.map((item, index) => {
      if (index === discussionIndex) {
        const updatedItem = { ...item };
        if (updatedItem.replies) {
          // Filter out the reply with the specific ID
          const newReplies = updatedItem.replies.filter((reply: any) => reply.id !== replyId);
          updatedItem.replies = newReplies;
          updatedItem.actualReplyCount = newReplies.length;
        }
        return updatedItem;
      }
      return item;
    }));

    return {
      success: true,
      message: 'Reply removed from preview',
      lastAction: 'reply_deleted'
    };
  };

  return {
    // State
    seedingInProgress,
    seedingProgress,
    seedUsersInitialized,
    seedUsersStatus,
    generatingReplyForIndex,
    selectedMoodForIndex,
    expandedReplies,
    
    // Setters
    setSelectedMoodForIndex,
    setExpandedReplies,
    
    // Operations
    checkSeedUsersStatus,
    initializeSeedUsers,
    handleProcessPastedContent,
    handleProcessWithAI,
    handleExecuteSeeding,
    handleAddReply,
    handleDeleteReplyById,
  };
};