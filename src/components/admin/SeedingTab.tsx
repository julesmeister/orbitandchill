"use client";

import React, { useState, useEffect } from 'react';
import { SEED_PERSONA_TEMPLATES } from '@/data/seedPersonas';
import { useSeedingPersistence } from '@/hooks/useSeedingPersistence';
import { useSeedingOperations } from '@/hooks/useSeedingOperations';
import { useAIConfiguration } from '@/hooks/useAIConfiguration';
import { usePersonaManagement } from '@/hooks/usePersonaManagement';
import { useSeedingContent } from '@/hooks/useSeedingContent';
import { useReplyManagement } from '@/hooks/useReplyManagement';
import { useToastNotifications } from '@/hooks/useToastNotifications';
import { useAvatarPathsStatus } from '@/hooks/useAvatarPathsStatus';
import AIConfigurationForm from '@/components/admin/seeding/AIConfigurationForm';
import ContentInputForm from '@/components/admin/seeding/ContentInputForm';
import UserPersonaManager from '@/components/admin/seeding/UserPersonaManager';
import GenerationSettings from '@/components/admin/seeding/GenerationSettings';
import PreviewContentDisplay from '@/components/admin/seeding/PreviewContentDisplay';
import ProcessSteps from '@/components/admin/seeding/ProcessSteps';
import SeedingActionButtons from '@/components/admin/seeding/SeedingActionButtons';
import PersonaSelector from '@/components/admin/seeding/PersonaSelector';
import DiscussionCommentReplacer from '@/components/admin/seeding/DiscussionCommentReplacer';
import DiscussionBrowser from '@/components/admin/seeding/DiscussionBrowser';
import LoadingSpinner from '@/components/reusable/LoadingSpinner';
import StatusToast from '@/components/reusable/StatusToast';
import StickyScrollButtons from '@/components/reusable/StickyScrollButtons';

interface SeedingTabProps {
  isLoading?: boolean;
}

const SeedingTab: React.FC<SeedingTabProps> = ({ isLoading = false }) => {
  // Process steps configuration
  const processSteps = [
    {
      number: 1,
      title: "Paste Content",
      description: "Copy and paste Reddit discussions or any content",
      color: "#3b82f6" // blue-500
    },
    {
      number: 2,
      title: "AI Transform",
      description: "AI rephrases, reformats, and makes content unique",
      color: "#10b981" // green-500
    },
    {
      number: 3,
      title: "Generate Forum",
      description: "Create discussions with replies and voting patterns",
      color: "#8b5cf6" // purple-500
    }
  ];

  // Use custom hooks for state management
  const {
    pastedContent,
    scrapedContent,
    previewContent,
    seedingResults,
    aiProvider,
    aiModel,
    aiApiKey,
    temperature,
    activePersonas,
    setPastedContent,
    setScrapedContent,
    setPreviewContent,
    setSeedingResults,
    setAiModel,
    setActivePersonas,
    handleApiKeyChange,
    handleProviderChange,
    handleModelChange,
    handleTemperatureChange,
    togglePersonaActive,
    setAllPersonasActive,
    clearAllContent,
    clearAIConfiguration,
  } = useSeedingPersistence();

  const {
    seedingInProgress,
    seedingProgress,
    seedUsersInitialized,
    seedUsersStatus,
    generatingReplyForIndex,
    selectedMoodForIndex,
    expandedReplies,
    setSelectedMoodForIndex,
    setExpandedReplies,
  } = useSeedingOperations();

  const { getAiConfig } = useAIConfiguration();
  
  const { allPersonasComplete, createAllPersonas } = usePersonaManagement(seedUsersInitialized);
  
  const {
    processContentWrapper,
    processWithAIWrapper,
    executeSeedingWrapper,
    initializeSeedUsersWrapper,
    checkSeedUsersStatus,
    
    // Main seeding operation toast properties
    toastVisible: seedingToastVisible,
    toastTitle: seedingToastTitle,
    toastMessage: seedingToastMessage,
    toastStatus: seedingToastStatus,
    hideToast: hideSeedingToast,
  } = useSeedingContent();

  const {
    addReplyWithToast,
    deleteReplyWithToast,
    toastVisible,
    toastTitle,
    toastMessage,
    toastStatus,
    hideToast,
  } = useReplyManagement();

  // Additional toast notifications for main seeding operations
  const {
    showLoadingToast,
    showSuccessToast,
    showErrorToast,
    ...mainToastProps
  } = useToastNotifications();

  // Avatar paths status
  const { 
    totalUsers, 
    usersNeedingFix, 
    isLoading: avatarStatusLoading, 
    refetch: refetchAvatarStatus 
  } = useAvatarPathsStatus();

  // Generation Settings State
  const [discussionsToGenerate, setDiscussionsToGenerate] = useState(10);
  const [repliesPerDiscussion, setRepliesPerDiscussion] = useState({ min: 5, max: 25 });
  const [maxNestingDepth, setMaxNestingDepth] = useState(4);
  const [contentVariation, setContentVariation] = useState(70);

  // Tab Management State
  const [activeTab, setActiveTab] = useState<'generation' | 'management'>('generation');
  
  // Collapsible sections state
  const [isControlPanelCollapsed, setIsControlPanelCollapsed] = useState(false);

  // User Management State
  const [selectedUsers, setSelectedUsers] = useState<string[]>(SEED_PERSONA_TEMPLATES.map(u => u.id));
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [personasExpanded, setPersonasExpanded] = useState(false);
  const [showPersonasCompleteMessage, setShowPersonasCompleteMessage] = useState(true);

  // Show message when personas are first completed
  useEffect(() => {
    if (seedUsersInitialized && allPersonasComplete) {
      setShowPersonasCompleteMessage(true);
    }
  }, [seedUsersInitialized, allPersonasComplete]);

  // Auto-hide personas complete message after 5 seconds
  useEffect(() => {
    if (seedUsersInitialized && allPersonasComplete && showPersonasCompleteMessage) {
      const timer = setTimeout(() => {
        setShowPersonasCompleteMessage(false);
      }, 5000); // Hide after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [seedUsersInitialized, allPersonasComplete, showPersonasCompleteMessage]);

  // Wrapper functions for hook operations
  const handleProcessContentWrapper = async () => {
    const result = await processContentWrapper(pastedContent, discussionsToGenerate, setSeedingResults);
    if (result.success) {
      setScrapedContent(result.data);
    }
  };

  const handleProcessWithAIWrapper = async () => {
    const generationSettings = {
      discussionsToGenerate,
      repliesPerDiscussion,
      maxNestingDepth,
      contentVariation
    };
    
    // Show loading toast
    showLoadingToast('Transforming Content', 'AI is processing and rephrasing your content...');
    
    const result = await processWithAIWrapper(
      scrapedContent,
      aiProvider,
      aiModel,
      aiApiKey,
      temperature,
      generationSettings,
      setSeedingResults,
      setPreviewContent,
      setExpandedReplies
    );
    
    // Show error toast if AI transformation failed
    if (result && !result.success && result.error) {
      console.error('🔄 AI transformation failed, showing error toast:', result.error);
      
      // Extract clean error message for user display
      let userFriendlyError = result.error;
      if (result.error.includes('Developer instruction is not enabled')) {
        userFriendlyError = 'The selected AI model does not support system prompts. Please try a different model like Claude or GPT.';
      } else if (result.error.includes('OpenRouter API error')) {
        // Extract the actual API error message
        const match = result.error.match(/OpenRouter API error: \d+ .+ - (.+)/);
        if (match) {
          userFriendlyError = match[1];
        }
      }
      
      // Show error toast using the toast notification system
      showErrorToast('AI Transformation Failed', userFriendlyError);
    } else if (result && result.success) {
      // Show success toast when AI transformation succeeds
      showSuccessToast('AI Transformation Complete', 'Content has been successfully transformed and is ready for preview!');
    }
  };

  const handleExecuteSeedingWrapper = async () => {
    const generationSettings = {
      discussionsToGenerate,
      repliesPerDiscussion,
      maxNestingDepth,
      contentVariation
    };
    
    await executeSeedingWrapper(
      previewContent,
      seedingResults?.batchId,
      generationSettings,
      selectedUsers,
      setSeedingResults
    );
  };

  // User management functions
  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleInitializeSeedUsers = async () => {
    await initializeSeedUsersWrapper(setSeedingResults);
  };

  const handleCompleteAllPersonas = async () => {
    const result = await createAllPersonas();
    setSeedingResults(result);
    
    if (result.success) {
      await checkSeedUsersStatus();
    }
  };

  // Handle fixing avatar paths
  const handleFixAvatarPaths = async () => {
    console.log('🔧 Fix Avatar Paths: Starting avatar path fixing process...');
    showLoadingToast('Fixing Avatar Paths', 'Updating avatar paths for users with incorrect file names...');
    
    try {
      console.log('🔧 Fix Avatar Paths: Sending POST request to /api/admin/fix-avatar-paths');
      const response = await fetch('/api/admin/fix-avatar-paths', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('🔧 Fix Avatar Paths: Response received, status:', response.status);
      const result = await response.json();
      console.log('🔧 Fix Avatar Paths: Response data:', result);

      if (result.success) {
        console.log(`🔧 Fix Avatar Paths: SUCCESS - Fixed ${result.fixedCount}/${result.totalUsers} users`);
        console.log('🔧 Fix Avatar Paths: Fixed users:', result.fixedUsers);
        
        showSuccessToast(
          'Avatar Paths Fixed', 
          `Successfully updated avatar paths for ${result.fixedCount} users out of ${result.totalUsers} total users.`
        );
        setSeedingResults((prev: any) => ({
          ...prev,
          success: true,
          message: `Fixed avatar paths for ${result.fixedCount} users`,
          fixedAvatars: true,
          fixedCount: result.fixedCount,
          totalUsers: result.totalUsers,
          fixedUsers: result.fixedUsers
        }));
        
        // Refetch avatar status to update the button text
        refetchAvatarStatus();
      } else {
        console.error('🔧 Fix Avatar Paths: FAILED -', result.error);
        showErrorToast('Fix Avatar Paths Failed', result.error || 'Unknown error occurred while fixing avatar paths');
        setSeedingResults((prev: any) => ({
          ...prev,
          success: false,
          error: result.error
        }));
      }
    } catch (error) {
      console.error('🔧 Fix Avatar Paths: EXCEPTION -', error);
      showErrorToast('Fix Avatar Paths Error', 'Failed to fix avatar paths: ' + (error as Error).message);
      setSeedingResults((prev: any) => ({
        ...prev,
        success: false,
        error: 'Failed to fix avatar paths: ' + (error as Error).message
      }));
    }
  };

  // Handle comments processing
  const handleProcessComments = async (commentsText: string) => {
    if (!aiApiKey.trim()) {
      showErrorToast('API Key Required', 'AI API key is required for comment processing.');
      setSeedingResults({
        success: false,
        error: 'AI API key is required for comment processing.'
      });
      return;
    }

    // Show loading toast
    showLoadingToast('Processing Comments', 'AI is rephrasing and organizing comments...');

    try {
      const response = await fetch('/api/admin/process-comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comments: commentsText,
          aiConfig: {
            provider: aiProvider,
            model: aiModel,
            apiKey: aiApiKey,
            temperature: temperature
          },
          discussionContext: {
            title: 'Community Discussion',
            topic: 'astrology'
          }
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Show warning toast if we have partial results
        if (result.warning) {
          showErrorToast('Partial Results', result.warning.message);
        }
        
        // Add comments as replies to existing preview content instead of creating separate discussion
        if (previewContent.length > 0) {
          // Add comments as replies to the first existing discussion
          setPreviewContent(prev => {
            const updated = [...prev];
            if (updated[0]) {
              updated[0] = {
                ...updated[0],
                replies: [...(updated[0].replies || []), ...result.data],
                actualReplyCount: (updated[0].actualReplyCount || 0) + result.data.length
              };
            }
            return updated;
          });
          
          const successMsg = result.warning 
            ? `Added ${result.data.length} comments (${result.summary.rephrasedCount} rephrased, ${result.summary.fallbackCount} original)`
            : `Added ${result.data.length} rephrased comments as replies to existing discussion!`;
          
          showSuccessToast('Comments Processed', successMsg);
          setSeedingResults({
            success: true,
            message: successMsg,
            summary: result.summary,
            processedComments: true,
            addedToExisting: true,
            hasPartialResults: !!result.warning
          });
          
          // Auto-scroll to preview section after comments are processed
          setTimeout(() => {
            const previewSection = document.getElementById('ai-processed-content');
            if (previewSection) {
              previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        } else {
          // No existing content - create new discussion for comments only
          const mockDiscussion = {
            id: `discussion_${Date.now()}`,
            transformedTitle: 'Community Discussion from Comments',
            transformedContent: 'A discussion created from rephrased community comments',
            originalTitle: 'Community Discussion from Comments',
            originalContent: commentsText.substring(0, 200) + '...',
            assignedAuthor: 'Community',
            category: 'General Discussion',
            tags: ['community', 'discussion'],
            replies: result.data,
            actualReplyCount: result.data.length,
            estimatedEngagement: result.data.length * 2,
            isTemporary: true
          };

          setPreviewContent([mockDiscussion]);
          
          const successMsg = result.warning 
            ? `Created discussion with ${result.data.length} comments (${result.summary.rephrasedCount} rephrased, ${result.summary.fallbackCount} original)`
            : `Created new discussion with ${result.data.length} rephrased comments!`;
          
          showSuccessToast('Comments Processed', successMsg);
          setSeedingResults({
            success: true,
            message: successMsg,
            summary: result.summary,
            processedComments: true,
            createdNew: true,
            hasPartialResults: !!result.warning
          });
          
          // Auto-scroll to preview section after comments are processed
          setTimeout(() => {
            const previewSection = document.getElementById('ai-processed-content');
            if (previewSection) {
              previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }
      } else {
        showErrorToast('Comment Processing Failed', result.error || 'Unknown error occurred while processing comments');
        setSeedingResults({
          success: false,
          error: result.error
        });
      }
    } catch (error) {
      showErrorToast('Comment Processing Error', 'Failed to process comments: ' + (error as Error).message);
      setSeedingResults({
        success: false,
        error: 'Failed to process comments: ' + (error as Error).message
      });
    }
  };

  // Reply management functions
  const handleAddReplyWrapper = async (discussionIndex: number) => {
    // Get the current mood for this discussion
    const currentMood = selectedMoodForIndex[discussionIndex] || 'supportive';
    console.log('🎭 SeedingTab handleAddReplyWrapper - mood for discussion', discussionIndex, ':', currentMood);
    
    await addReplyWithToast(
      discussionIndex,
      previewContent,
      selectedMoodForIndex,
      aiProvider,
      aiModel,
      aiApiKey,
      temperature,
      activePersonas,
      setPreviewContent,
      setSeedingResults
    );
  };

  const handleDeleteReply = (discussionIndex: number, replyId: string) => {
    deleteReplyWithToast(discussionIndex, replyId, setPreviewContent, setSeedingResults);
  };

  const handleClearReplies = (discussionIndex: number) => {
    setPreviewContent(prev => {
      const updated = [...prev];
      if (updated[discussionIndex]) {
        updated[discussionIndex] = {
          ...updated[discussionIndex],
          replies: [],
          actualReplyCount: 0
        };
      }
      return updated;
    });
    
    setSeedingResults((prev: any) => ({
      ...prev,
      message: 'Replies cleared from preview'
    }));
  };

  const handleUpdateReply = (discussionIndex: number, replyId: string, newContent: string) => {
    setPreviewContent(prev => {
      const updated = [...prev];
      if (updated[discussionIndex] && updated[discussionIndex].replies) {
        updated[discussionIndex].replies = updated[discussionIndex].replies.map((reply: any) =>
          reply.id === replyId ? { ...reply, content: newContent } : reply
        );
      }
      return updated;
    });
    
    setSeedingResults((prev: any) => ({
      ...prev,
      message: 'Reply content updated'
    }));
  };


  if (isLoading) {
    return (
      <LoadingSpinner
        variant="dots"
        size="md"
        title="Loading seeding tools..."
        subtitle="Preparing AI-powered discussion generation interface."
      />
    );
  }

  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <div className="px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-space-grotesk font-bold text-black mb-2">
            AI-Powered Discussion Seeding
          </h1>
          <p className="text-gray-600 font-open-sans">
            Paste Reddit content and let AI rephrase, reformat, and reorganize it into unique astrology forum discussions with user personas.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border border-black mb-8">
          <div className="flex border-b border-black">
            <button
              onClick={() => setActiveTab('generation')}
              className={`flex-1 px-6 py-4 font-space-grotesk font-semibold text-center transition-colors ${
                activeTab === 'generation'
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Content Generation
              </div>
            </button>
            <button
              onClick={() => setActiveTab('management')}
              className={`flex-1 px-6 py-4 font-space-grotesk font-semibold text-center transition-colors border-l border-black ${
                activeTab === 'management'
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Discussion Management
              </div>
            </button>
          </div>

          {/* Tab Descriptions */}
          <div className="p-4 bg-gray-50">
            {activeTab === 'generation' && (
              <p className="text-sm text-gray-700 font-open-sans">
                Create new discussions by pasting content, processing it with AI, and generating forum discussions with replies.
              </p>
            )}
            {activeTab === 'management' && (
              <p className="text-sm text-gray-700 font-open-sans">
                Browse existing discussions and add AI-generated comments to enhance engagement and activity.
              </p>
            )}
          </div>
        </div>

        {/* Content Generation Tab */}
        {activeTab === 'generation' && (
          <React.Fragment>
            {/* Process Steps */}
            <ProcessSteps steps={processSteps} className="mb-8" />

        {/* Seed Users Status */}
        {!seedUsersInitialized && (
          <div className="bg-yellow-50 border border-yellow-200 mb-8 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-space-grotesk font-semibold text-yellow-800 mb-2">
                  Seed Users Required
                </h3>
                <p className="text-yellow-700 font-open-sans">
                  You need to initialize the 5 AI personas before you can start seeding discussions.
                </p>
              </div>
              <button
                onClick={handleInitializeSeedUsers}
                disabled={seedingInProgress}
                className="px-6 py-3 bg-yellow-600 text-white font-space-grotesk font-semibold hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Initialize Seed Users
              </button>
            </div>
          </div>
        )}

        {/* Complete All Personas */}
        {seedUsersInitialized && !allPersonasComplete && (
          <div className="bg-blue-50 border border-blue-200 mb-8 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-space-grotesk font-semibold text-blue-800 mb-2">
                  Enable All 20 Personas
                </h3>
                <p className="text-blue-700 font-open-sans">
                  You currently have basic personas initialized. Create all 20 persona templates to unlock the full variety of reply styles.
                </p>
              </div>
              <button
                onClick={handleCompleteAllPersonas}
                className="px-6 py-3 bg-blue-600 text-white font-space-grotesk font-semibold hover:bg-blue-700 transition-colors"
              >
                Create All 20 Personas
              </button>
            </div>
          </div>
        )}

        {/* All Personas Complete Status */}
        {seedUsersInitialized && allPersonasComplete && showPersonasCompleteMessage && (
          <div className="bg-green-50 border border-green-200 mb-8 p-6">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-space-grotesk font-semibold text-green-800 mb-1">
                  All 20 Personas Ready
                </h3>
                <p className="text-green-700 font-open-sans">
                  All persona templates are created and available for reply generation. Use the persona selector below to choose which ones are active.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Fix Avatar Paths */}
        {seedUsersInitialized && (
          <div className="bg-orange-50 border border-orange-200 mb-8 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-space-grotesk font-semibold text-orange-800 mb-2">
                  Fix Avatar Paths
                </h3>
                <p className="text-orange-700 font-open-sans">
                  Update any existing users with incorrect avatar file names to use the correct Avatar-X.png format from /public/avatars/.
                  {!avatarStatusLoading && (
                    <span className="block mt-1 text-sm">
                      {usersNeedingFix > 0 
                        ? `${usersNeedingFix} out of ${totalUsers} users need fixing.`
                        : `All ${totalUsers} users have correct avatar paths.`
                      }
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={handleFixAvatarPaths}
                disabled={avatarStatusLoading}
                className="px-6 py-3 bg-orange-600 text-white font-space-grotesk font-semibold hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {avatarStatusLoading 
                  ? 'Checking...' 
                  : usersNeedingFix > 0 
                    ? `Fix ${usersNeedingFix} Avatar Path${usersNeedingFix === 1 ? '' : 's'}`
                    : 'Check Avatar Paths'
                }
              </button>
            </div>
          </div>
        )}

        {/* Main Control Panel */}
        <div className="bg-white border border-black mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <SeedingActionButtons
                  seedingInProgress={seedingInProgress}
                  seedingProgress={seedingProgress}
                  pastedContent={pastedContent}
                  scrapedContent={scrapedContent}
                  previewContent={previewContent}
                  aiApiKey={aiApiKey}
                  seedUsersInitialized={seedUsersInitialized}
                  onProcessContent={handleProcessContentWrapper}
                  onProcessWithAI={handleProcessWithAIWrapper}
                  onExecuteSeeding={handleExecuteSeedingWrapper}
                  onClearAll={clearAllContent}
                  className=""
                />
              </div>
              <button
                onClick={() => setIsControlPanelCollapsed(!isControlPanelCollapsed)}
                className="ml-4 p-2 hover:bg-gray-100 transition-colors rounded"
                title={isControlPanelCollapsed ? 'Show progress and results' : 'Hide progress and results'}
              >
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    isControlPanelCollapsed ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {!isControlPanelCollapsed && (
              <div>
                {/* Progress Bar */}
                {seedingInProgress && (
                  <div className="mb-6">
                    <div className="w-full bg-gray-200 border border-black h-4">
                      <div 
                        className="h-full bg-black transition-all duration-300"
                        style={{ width: `${seedingProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 font-open-sans">
                      Progress: {Math.round(seedingProgress)}%
                    </p>
                  </div>
                )}

                {/* Results */}
                {seedingResults && (
                  <div className={`p-4 border border-black mb-6 ${
                    seedingResults.success ? 'bg-green-50' : 'bg-red-50'
                  }`}>
                    {seedingResults.restoredFromCache && (
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm text-blue-800 font-open-sans flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {seedingResults.restoredMessage || 'Data restored from previous session'}
                    </p>
                  </div>
                )}
                {seedingResults.success ? (
                  <div>
                    <h3 className="font-space-grotesk font-semibold text-green-800 mb-2">
                      ✅ {seedingResults.message}
                    </h3>
                    {seedingResults.finalStats && (
                      <ul className="text-sm text-green-700 font-open-sans space-y-1">
                        <li>• {seedingResults.finalStats.discussionsCreated} discussions created</li>
                        <li>• {seedingResults.finalStats.usersCreated} user personas activated</li>
                        <li>• {seedingResults.finalStats.repliesCreated} replies generated</li>
                        <li>• {seedingResults.finalStats.votesDistributed} votes distributed</li>
                      </ul>
                    )}
                    {seedingResults.scrapedPosts && (
                      <p className="text-sm text-green-700 font-open-sans">
                        • {seedingResults.scrapedPosts} posts scraped from Reddit
                      </p>
                    )}
                    {seedingResults.processedDiscussions && (
                      <ul className="text-sm text-green-700 font-open-sans space-y-1">
                        <li>• {seedingResults.processedDiscussions} discussions processed by AI</li>
                        <li>• {seedingResults.totalReplies || seedingResults.estimatedReplies || 0} replies generated</li>
                      </ul>
                    )}
                    {seedingResults.fixedAvatars && (
                      <ul className="text-sm text-green-700 font-open-sans space-y-1">
                        <li>• {seedingResults.fixedCount} users had their avatar paths updated</li>
                        <li>• {seedingResults.totalUsers} total users checked</li>
                        {seedingResults.fixedUsers && seedingResults.fixedUsers.length > 0 && (
                          <li className="mt-2">
                            <details className="cursor-pointer">
                              <summary className="text-green-600 hover:text-green-800">View updated users</summary>
                              <div className="mt-2 ml-4 space-y-1">
                                {seedingResults.fixedUsers.slice(0, 10).map((user: any) => (
                                  <div key={user.id} className="text-xs">
                                    <strong>{user.username}</strong>: {user.oldAvatar} → {user.newAvatar}
                                  </div>
                                ))}
                                {seedingResults.fixedUsers.length > 10 && (
                                  <div className="text-xs text-green-600">
                                    ...and {seedingResults.fixedUsers.length - 10} more
                                  </div>
                                )}
                              </div>
                            </details>
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                ) : (
                  <div>
                    <h3 className="font-space-grotesk font-semibold text-red-800 mb-2">
                      ❌ Process Failed
                    </h3>
                    <p className="text-sm text-red-700 font-open-sans">{seedingResults.error}</p>
                  </div>
                )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content Input & AI Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ContentInputForm
            pastedContent={pastedContent}
            onContentChange={setPastedContent}
            onProcessComments={handleProcessComments}
          />
          
          <AIConfigurationForm
            aiProvider={aiProvider}
            aiModel={aiModel}
            aiApiKey={aiApiKey}
            temperature={temperature}
            onProviderChange={handleProviderChange}
            onModelChange={handleModelChange}
            onApiKeyChange={handleApiKeyChange}
            onTemperatureChange={handleTemperatureChange}
          />
        </div>

        <GenerationSettings
          discussionsToGenerate={discussionsToGenerate}
          repliesPerDiscussion={repliesPerDiscussion}
          maxNestingDepth={maxNestingDepth}
          contentVariation={contentVariation}
          onDiscussionsChange={setDiscussionsToGenerate}
          onMinRepliesChange={(value) => setRepliesPerDiscussion(prev => ({...prev, min: value}))}
          onMaxRepliesChange={(value) => setRepliesPerDiscussion(prev => ({...prev, max: value}))}
          onMaxNestingChange={setMaxNestingDepth}
          onContentVariationChange={setContentVariation}
        />

        <UserPersonaManager
          selectedUsers={selectedUsers}
          personasExpanded={personasExpanded}
          editingUser={editingUser}
          onToggleUserSelection={toggleUserSelection}
          onToggleExpanded={() => setPersonasExpanded(!personasExpanded)}
          onEditUser={setEditingUser}
        />

        <PreviewContentDisplay
          previewContent={previewContent}
          selectedMoodForIndex={selectedMoodForIndex}
          generatingReplyForIndex={generatingReplyForIndex}
          expandedReplies={expandedReplies}
          aiApiKey={aiApiKey}
          onAddReply={handleAddReplyWrapper}
          onDeleteReply={handleDeleteReply}
          onClearReplies={handleClearReplies}
          onUpdateReply={handleUpdateReply}
          onMoodSelect={(index, mood) => {
            console.log('🎭 Mood selection triggered:', { index, mood });
            setSelectedMoodForIndex(prev => {
              const newState = { ...prev, [index]: mood };
              console.log('🎭 Updated selectedMoodForIndex:', newState);
              return newState;
            });
          }}
          onToggleExpandReplies={(index) => setExpandedReplies(prev => ({ ...prev, [index]: !prev[index] }))}
        />

        {/* Active Reply Personas - Placed after content preview for better UX */}
        <PersonaSelector
          activePersonas={activePersonas}
          onTogglePersona={togglePersonaActive}
          onSetAllActive={setAllPersonasActive}
          className="mb-8"
        />
          </React.Fragment>
        )}

        {/* Discussion Management Tab */}
        {activeTab === 'management' && (
          <React.Fragment>
            {/* Discussion Browser and Comment Manager */}
            <DiscussionBrowser
              showLoadingToast={showLoadingToast}
              showSuccessToast={showSuccessToast}
              showErrorToast={showErrorToast}
              aiProvider={aiProvider}
              aiModel={aiModel}
              aiApiKey={aiApiKey}
              temperature={temperature}
            />
          </React.Fragment>
        )}

        {/* Documentation Link */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200">
          <p className="text-sm text-blue-800 font-open-sans">
            📄 For detailed technical specifications, see{' '}
            <code className="bg-blue-100 px-1 rounded">DISCUSSIONS_SEEDING_PLAN.md</code>
          </p>
        </div>

        {/* Status Toast for Reply Management */}
        <StatusToast
          title={toastTitle}
          message={toastMessage}
          status={toastStatus}
          isVisible={toastVisible}
          onHide={hideToast}
          duration={toastStatus === 'success' ? 3000 : 0}
        />

        {/* Status Toast for Main Seeding Operations (Generate Forum, etc.) */}
        <StatusToast
          title={seedingToastTitle}
          message={seedingToastMessage}
          status={seedingToastStatus}
          isVisible={seedingToastVisible}
          onHide={hideSeedingToast}
          duration={seedingToastStatus === 'success' ? 5000 : 0}
        />

        {/* Status Toast for Main Seeding Operations */}
        {mainToastProps.toastVisible && (
          <div className="fixed bottom-6 right-6 z-[9999] pointer-events-none">
            <div 
              className={`
                px-6 py-4 border-2 border-black shadow-lg max-w-sm pointer-events-auto
                transform transition-all duration-300 ease-out
                ${mainToastProps.toastVisible 
                  ? 'translate-y-0 opacity-100 scale-100' 
                  : 'translate-y-4 opacity-0 scale-95'
                }
              `}
              style={{ backgroundColor: mainToastProps.toastStatus === 'error' ? '#000000' : '#ffffff' }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-2">
                {/* Status icon */}
                <div className="flex-shrink-0" style={{ color: mainToastProps.toastStatus === 'error' ? '#ffffff' : '#000000' }}>
                  {mainToastProps.toastStatus === 'loading' ? (
                    <div className="flex items-center space-x-1">
                      <div className="w-1 h-1 bg-current animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-1 h-1 bg-current animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1 h-1 bg-current animate-bounce"></div>
                    </div>
                  ) : mainToastProps.toastStatus === 'error' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                
                {/* Title */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold font-space-grotesk" style={{ color: mainToastProps.toastStatus === 'error' ? '#ffffff' : '#000000' }}>
                    {mainToastProps.toastTitle}
                  </h4>
                </div>

                {/* Close button (only for non-loading states) */}
                {mainToastProps.toastStatus !== 'loading' && (
                  <button
                    onClick={mainToastProps.hideToast}
                    className="flex-shrink-0 hover:opacity-70 transition-opacity"
                    style={{ color: mainToastProps.toastStatus === 'error' ? '#ffffff' : '#000000' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Message */}
              <div className="mb-3">
                <p className="text-sm font-open-sans" style={{ color: mainToastProps.toastStatus === 'error' ? '#ffffff' : '#000000' }}>
                  {mainToastProps.toastMessage}
                </p>
              </div>
            </div>
          </div>
        )}
        

        {/* Sticky Scroll Buttons */}
        <StickyScrollButtons />
      </div>
    </div>
  );
};

export default SeedingTab;