"use client";

import React, { useState, useEffect } from 'react';
import { SEED_PERSONA_TEMPLATES } from '@/data/seedPersonas';
import { useSeedingPersistence } from '@/hooks/useSeedingPersistence';
import { useSeedingOperations } from '@/hooks/useSeedingOperations';
import { useAIConfiguration } from '@/hooks/useAIConfiguration';
import { usePersonaManagement } from '@/hooks/usePersonaManagement';
import { useSeedingContent } from '@/hooks/useSeedingContent';
import { useReplyManagement } from '@/hooks/useReplyManagement';
import AIConfigurationForm from '@/components/admin/seeding/AIConfigurationForm';
import ContentInputForm from '@/components/admin/seeding/ContentInputForm';
import UserPersonaManager from '@/components/admin/seeding/UserPersonaManager';
import GenerationSettings from '@/components/admin/seeding/GenerationSettings';
import PreviewContentDisplay from '@/components/admin/seeding/PreviewContentDisplay';
import ProcessSteps from '@/components/admin/seeding/ProcessSteps';
import SeedingActionButtons from '@/components/admin/seeding/SeedingActionButtons';
import PersonaSelector from '@/components/admin/seeding/PersonaSelector';
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

  // Generation Settings State
  const [discussionsToGenerate, setDiscussionsToGenerate] = useState(10);
  const [repliesPerDiscussion, setRepliesPerDiscussion] = useState({ min: 5, max: 25 });
  const [maxNestingDepth, setMaxNestingDepth] = useState(4);
  const [contentVariation, setContentVariation] = useState(70);

  // User Management State
  const [selectedUsers, setSelectedUsers] = useState<string[]>(SEED_PERSONA_TEMPLATES.map(u => u.id));
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [personasExpanded, setPersonasExpanded] = useState(false);

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
    
    await processWithAIWrapper(
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

  // Handle comments processing
  const handleProcessComments = async (commentsText: string) => {
    if (!aiApiKey.trim()) {
      setSeedingResults({
        success: false,
        error: 'AI API key is required for comment processing.'
      });
      return;
    }

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
        // For comments processing, create the discussion directly instead of using seeding workflow
        try {
          // Calculate discussion start time (1-7 days ago to match reply timestamps)
          const now = new Date();
          const discussionStartTime = new Date(now.getTime() - (Math.random() * 7 * 24 * 60 * 60 * 1000));
          
          const discussionResponse = await fetch('/api/discussions/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: 'Community Discussion from Reddit Comments',
              content: 'A collection of community comments that have been rephrased and organized by our AI personas.',
              excerpt: 'Rephrased Reddit comments with assigned personas',
              category: 'Community',
              tags: ['reddit', 'community', 'discussion'],
              authorId: 'admin_comments_import',
              isBlogPost: false,
              isPublished: true,
              createdAt: discussionStartTime.toISOString() // Set past creation time
            }),
          });

          const discussionResult = await discussionResponse.json();

          if (discussionResult.success) {
            // Create replies for the discussion
            const repliesResponse = await fetch(`/api/discussions/${discussionResult.discussion.id}/replies`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                replies: result.data.map((reply: any) => ({
                  content: reply.content,
                  authorId: reply.authorId,
                  authorName: reply.authorName
                }))
              }),
            });

            const repliesResult = await repliesResponse.json();

            if (repliesResult.success) {
              setSeedingResults({
                success: true,
                message: `Successfully created discussion with ${result.data.length} rephrased comments!`,
                summary: result.summary,
                discussionId: discussionResult.discussion.id,
                processedComments: true,
                directlyCreated: true
              });

              // Clear preview content since discussion is now created
              setPreviewContent([]);
            } else {
              throw new Error(repliesResult.error || 'Failed to create replies');
            }
          } else {
            throw new Error(discussionResult.error || 'Failed to create discussion');
          }
        } catch (directCreateError) {
          console.error('Failed to create discussion directly:', directCreateError);
          
          // Fallback to preview mode
          const mockDiscussion = {
            id: `discussion_${Date.now()}`,
            transformedTitle: 'Community Discussion',
            transformedContent: 'A discussion with rephrased community comments',
            originalTitle: 'Community Discussion',
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
          setSeedingResults({
            success: true,
            message: result.message + ' (Preview mode - use Generate Forum to save)',
            summary: result.summary,
            batchId: result.batchId,
            processedComments: true
          });
        }
      } else {
        setSeedingResults({
          success: false,
          error: result.error
        });
      }
    } catch (error) {
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
        {seedUsersInitialized && allPersonasComplete && (
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

        {/* Main Control Panel */}
        <div className="bg-white border border-black mb-8">
          <div className="p-6">
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
              className="mb-6"
            />

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

        {/* Documentation Link */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200">
          <p className="text-sm text-blue-800 font-open-sans">
            📄 For detailed technical specifications, see{' '}
            <code className="bg-blue-100 px-1 rounded">DISCUSSIONS_SEEDING_PLAN.md</code>
          </p>
        </div>

        {/* Status Toast */}
        <StatusToast
          title={toastTitle}
          message={toastMessage}
          status={toastStatus}
          isVisible={toastVisible}
          onHide={hideToast}
          duration={toastStatus === 'success' ? 3000 : 0}
        />

        {/* Sticky Scroll Buttons */}
        <StickyScrollButtons />
      </div>
    </div>
  );
};

export default SeedingTab;